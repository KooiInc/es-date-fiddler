import dateAddFactory from "./DateAddFactory.js";
import dateDiffFactory from "./DateDiffFactory.js";
import {DateFormatFactory} from "../dateformat/index.js";

export default methodHelpersFactory;

function methodHelpersFactory(proxify, validateLocale) {
  let shouldValidate = true;
  const formatter = DateFormatFactory();
  const isNumberAndDefined = v => !(isNaN(parseInt(v)) && isNaN(+v));
  const isObj = maybeObj => maybeObj?.constructor === Object;
  const offset2Number = dtStr => +(dtStr.slice(dtStr.indexOf(`+`) + 1).replace(`:`, ``)) || 0;
  const getTimezone = dt => dt.localeInfo?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zeroPad = (v, n = 2) => `${v}`.padStart(n, `0`);
  const zeroPadArr = arr => arr.map(v => String(v)?.padStart(2, `0`) ?? v);
  const isoDateStr = d => zeroPadArr(getDate(d)).join(`-`);
  const getNumbers = obj => Object.entries(obj).filter(([, value]) => isNumberAndDefined(value));
  const getValues = (d, monthZeroBased = false) => {
    d = proxify(d);
    const addMonth = monthZeroBased ? 0 : 1;
    const valueObj = {
      year: d.getFullYear(), month: d.getMonth() + addMonth, date: d.getDate(),
      hour: d.getHours(), minutes: d.getMinutes(),
      seconds: d.getSeconds(), milliseconds: d.getMilliseconds(),
      monthZeroBased,
      monthName: d.monthName,
      weekDay: d.weekDay,
      locale: d.locale || `no locale (yet)`,
    };
    
    return {
      get object() { return valueObj; },
      get array() { return Object.values(valueObj).filter(v => !isNaN(parseInt(v))); }
    };
  };
  const localizedDT = dt => {
    const tz = {timeZone: getTimezone(dt), hourCycle: `h23`};
    let dtNew;
    try {
      return proxify(new Date(new Date(dt.toLocaleString(`en`, tz))));
    } catch (err) {
      console.error(`Can't retrieve localized date/time value for ${tz.timeZone}: ${err.message}`);
      return proxify(dt);
    }
  };
  const cloneDateTimeError = (Time) => console.error(`clone${Time ? `Time` : `Date`}To: no toDate given`);
  const cloneDateTo = (d, toDate) => {
    toDate = proxify(toDate ?? new Date());
    const cloneFrom = proxify(d);
    if (toDate) {
      const [year, month, date] = cloneFrom.date;
      toDate.date = {year, month, date};
      
      if (cloneFrom.locale) {
        toDate.locale = {locale: cloneFrom.locale.locale, timeZone: cloneFrom.locale.timeZone};
      }
      
      return toDate;
    }
    cloneDateTimeError();
    return cloneFrom;
  };
  const cloneTimeTo = (d, toDate) => {
    toDate = proxify(toDate ?? new Date());
    const cloneFrom = proxify(d);
    const {hour, minutes, seconds, ms} = cloneFrom;
    toDate.time = {hour, minutes, seconds, ms};
    
    if (cloneFrom.locale) {
      toDate.locale = {locale: cloneFrom.locale.locale, timeZone: cloneFrom.locale.timeZone};
      return toDate;
    }
    cloneDateTimeError(1);
    return cloneFrom;
  };
  const getLocalStr = (d) => {
    d = proxify(d);
    let opts = {};
    
    if (!d.locale) {
      return d.toLocaleString();
    }
    
    const {locale, timeZone} = d.locale;
    
    if (d.locale?.timeZone) {
      opts = {timeZone: d.locale.timeZone};
    }
    
    return d.toLocaleString(locale, opts);
  };
  const doFormat = (d, ...args) => {
    d = proxify(d);
    let locale, timeZone, formats;
    if (d.locale) {
      locale = d.locale.locale;
      timeZone = d.locale.timeZone;
      formats = d.formats;
    }
    
    return args.length === 1
      ? formatter(d, args[0], formats)
      : args.length
        ? formatter(d, ...args)
        : d.toLocaleString(locale || [], timeZone ? {timeZone} : undefined);
  };
  const doSet = (d, values) => isObj(values) &&
    getNumbers(values).forEach(([key, value]) => d[`set${key}`](value)) &&
    true || false;
  const getTime = d => [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds() ?? 0];
  const getDate = d => [d.getFullYear(), (d.getMonth() + 1), d.getDate()];
  const getOrSetTime = (d, values) => doSet(d, values) || getTime(d);
  const getOrSetDate = (d, values) => doSet(d, values) || getDate(d);
  const diffCalculator = dateDiffFactory();
  const getDaysInMonth = (year, month) =>
    proxify(new Date(year, month + 1, 1, 0, 0, 0)).yesterday.getDate();
  const getDateX = d => [d.getFullYear(), d.getMonth(), d.getDate()];
  const clone = d => proxify(new Date(d)).relocate(d.localeInfo);
  const dateAdd = dateAddFactory();
  const add2Date = (d, ...terms) => proxify(dateAdd(d, ...terms));
  const formats = (locale, timeZone) => [
    `${locale && (!(Array.isArray(locale) && locale.length < 1)) ? `l:${locale}` : ``}`,
    `${timeZone ? `tz:${timeZone}` : ``}`]
    .filter(v => v).join(`,`);
  const createLocaleInfo = function (d, {locale, timeZone} = {}) {
    if (locale || timeZone) {
      const resolved = validateLocale(locale || [], timeZone);
      d.localeInfo = {
        locale: resolved?.locale || navigator?.language || `en`,
        timeZone: resolved?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      d.formats = formats(d.localeInfo.locale, d.localeInfo.timeZone);
    }
    
    return d.localeInfo ?? undefined;
  };
  const getOrSetLocale = (d, {locale, timeZone, validate = true} = {}) => {
    if (locale || timeZone) {
      d.localeInfo = createLocaleInfo(d, {locale, timeZone, validate});
    }
    
    return d.localeInfo;
  };
  const removeLocaleInfo = d => {
    delete d.localeInfo;
    return proxify(d);
  };
  const reLocate = function (d, locale, timeZone, validate) {
    if (locale || timeZone) {
      getOrSetLocale(d, {locale, timeZone} || d.localeInfo);
    }
    return proxify(d);
  };
  const names = function (d, month) {
    d = proxify(d);
    return d.format(month ? `MM` : `WD`, `l:${d.locale?.locale || `utc`}`);
  };
  const dateStr = d => {
    let opts = {};
    d = proxify(d);
    
    if (!d.locale) {
      return d.toLocaleDateString();
    }
    
    const {locale, timeZone} = d.locale;
    
    if (d.locale?.timeZone) {
      opts = {timeZone: d.locale.timeZone};
    }
    
    return d.toLocaleDateString(locale, opts);
  };
  const getTimeStr = (d, ms) => {
    const timeArr = getTime(d)
      .reduce((acc, v, i) => [...acc, i < 3 ? zeroPad(v) : zeroPad(v, 3)], []);
    return `${timeArr.slice(0, 3).join(`:`)}${ms ? `.${timeArr.slice(-1)}` : ``}`;
  };
  const hasDST = dt => {
    const timeZone = getTimezone(dt);
    const dt1 = new Date(dt.getFullYear(), 0, 1, 14);
    const dt2 = new Date(new Date(dt1).setMonth(6));
    const fmt = Intl.DateTimeFormat(`en-CA`, {
      year: `numeric`,
      timeZone: timeZone,
      timeZoneName: "shortOffset",
    });
    const [fmt1, fmt2] = [fmt.format(dt1), fmt.format(dt2)];
    return offset2Number(fmt1) - offset2Number(fmt2) !== 0;
  };
  
  function daysUntil(dt, nextDate) {
    let z = 0;
    dt = proxify(dt);
    nextDate = proxify(nextDate);
    dt.time = nextDate.time = {hour: 0, minutes: 0, seconds: 0, milliseconds: 0};
    
    if (dt > nextDate) {
      [dt, nextDate] = [nextDate, dt];
    }
    
    while (dt < nexDate) {
      dt.add(`1 day`);
      z += 1;
    }
    return z;
  }
  
  function nextOrPrevious(d, {day, next = false, midnight = true} = {}) {
    d = proxify(d);
    const dd = d.clone;
    let today = dd.getDay();
    dd.time = midnight ? { hour: 0, minutes: 0, seconds: 0, milliseconds: 0 } : {};
    let dayNr = `sun,mon,tue,wed,thu,fri,sat`.split(`,`).findIndex(v => v === day);
    let addTerm = `${ next ? 1 : -1 } days`;
    return dayNr < 0 ? d : function(){
      today = today === dayNr ? dd.add(addTerm).getDay() : today;
      while( today !== dayNr ) { today = dd.add(addTerm).getDay(); }
      return dd; }();
  }
  
  const extensions = {
    ...{
      clone,
      localizedDT,
      hasDST,
      getTimezone,
      dateStr,
      firstWeekday: d => ({sunday = false, midnight = false} = {}) =>
        nextOrPrevious( d, { day: sunday ? `sun` : `mon`, midnight } ),
      next: d => (day, {midnight = false} = {}) => nextOrPrevious( d, { day, midnight, next: true } ),
      previous: d => (day, {midnight = false} = {}) => nextOrPrevious( d, { day, midnight } ),
      locale2Formats: (d) => formats(d.localeInfo?.locale, d.localeInfo?.timeZone),
      year: (d, setValue) => setValue && d.setFullYear(setValue) || d.getFullYear(),
      month: (d, setValue) => setValue && d.setMonth(v - 1) || d.getMonth() + 1,
      date: (d, {year, month, date} = {}) =>
        getOrSetDate(d, {FullYear: year, Month: isNumberAndDefined(month) ? month - 1 : month, Date: date}),
      hour: (d, setValue) => setValue && d.setHours(setValue) || d.getHours(),
      minutes: (d, setValue) => setValue && d.setMinutes(setValue) || d.getMinutes(),
      seconds: (d, setValue) => setValue && d.setSeconds(setValue) || d.getSeconds(),
      cloneTimeTo: d => toDate => cloneTimeTo(d, toDate),
      cloneDateTo: d => toDate => cloneDateTo(d, toDate),
      time: (d, {hour, minutes, seconds, milliseconds} = {}) =>
        getOrSetTime(d, {Hours: hour, Minutes: minutes, Seconds: seconds, Milliseconds: milliseconds}),
      timeStr: d => (displayMS = false) => getTimeStr(d, displayMS),
      dateISOStr: d => isoDateStr(d),
      ms: (d, setValue) => setValue && d.setMilliseconds(setValue) || d.getMilliseconds(),
      monthName: d => names(d, true),
      weekDay: d => names(d),
      self: d => d,
      local: d => getLocalStr(d),
      locale: (d, {locale, timeZone} = {}) => getOrSetLocale(d, {locale, timeZone}),
      removeLocale: d => removeLocaleInfo(d),
      relocate: d => ({locale, timeZone} = {}) => reLocate(d, locale, timeZone),
      differenceFrom: d => fromDate => diffCalculator({start: d, end: fromDate}),
      values: d => (monthZeroBased = false) => getValues(d, monthZeroBased),
      ISO: d => d.toISOString(),
      daysInMonth: d => getDaysInMonth(d.getFullYear(), d.getMonth()),
      isLeapYear: d => getDaysInMonth(d.getFullYear(), 1) === 29,
      format: d => (...args) => doFormat(d, ...args),
      daysUntil: d => nextD => daysUntil(d, nextD),
      internal: () => {},
    }, ...{
      addYears: d => (amount = 1) => add2Date(d, `${amount} years`),
      addMonths: d => (amount = 1) => add2Date(d, `${amount} months`),
      addWeeks: d => (amount = 1) => add2Date(d, `${amount * 7} days`),
      addDays: d => (amount = 1) => add2Date(d, `${amount} days`),
      nextYear: d => add2Date(d, `1 year`),
      nextWeek: d => add2Date(d, `7 days`),
      previousWeek: d => add2Date(d, "subtract, 7 days"),
      previousYear: d => add2Date(d, `subtract, 1 year`),
      nextMonth: d => add2Date(d, `1 month`),
      previousMonth: d => add2Date(d, `subtract, 1 month`),
      tomorrow: d => add2Date(d, `1 day`),
      yesterday: d => add2Date(d, `subtract, 1 day`),
      add: d => (...what2Add) => add2Date(d, ...what2Add),
      subtract: d => (...what2Subtract) => add2Date(d, ...[`subtract`].concat([what2Subtract]).flat()),
    }
  };
  
  return extensions;
}