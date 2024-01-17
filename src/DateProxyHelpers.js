import dateAddFactory from "./DateAddFactory.js";
import dateDiffFactory from "./DateDiffFactory.js";
import {DateFormatFactory} from "../dateformat/index.js";

export default methodHelpersFactory;

function methodHelpersFactory(proxify, validateLocale) {
  const formatter = DateFormatFactory();
  const isNumberAndDefined = v => !(isNaN(parseInt(v)) && isNaN(+v));
  const isObj = maybeObj => maybeObj?.constructor === Object;
  const offset2Number = dtStr => +(dtStr.slice(dtStr.indexOf(`+`) + 1).replace(`:`, ``)) || 0;
  const getTimezone = dt => /*g*/dt.localeInfo?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zeroPadArr = arr => arr.map(v => String(v)?.padStart(2, `0`) ?? v);
  const isoDateStr = d => zeroPadArr(getDate(d)).join(`-`);
  const getNumbers = obj => Object.entries(obj).filter(([, value]) => isNumberAndDefined(value));
  const cloneDateTimeError = (Time) => console.error(`clone${Time ? `Time` : `Date`}To: no toDate given`);
  const doSet = (d, values) => isObj(values) &&
    getNumbers(values).forEach(([key, value]) => d[`set${key}`](value)) &&
    true || false;
  const getTime = d => proxify(d).format(`hh,mi,ss,ms`).split(`,`).map(Number);
  const getDate = d => proxify(d).format(`yyyy,mm,dd`).split(`,`).map(Number);
  const getOrSetTime = (d, values) => doSet(d, values) || getTime(d);
  const getOrSetDate = (d, values) => doSet(d, values) || getDate(d);
  const diffCalculator = dateDiffFactory();
  const getDaysInMonth = (year, month) => proxify(new Date(year, month + 1, 1, 0, 0, 0)).yesterday.getDate();
  const clone = d => /*g,c*/ proxify(new Date(d)).relocate(d.localeInfo?.locale, d.localeInfo?.timeZone);
  const cloneLocal = d => /*g,c*/ proxify(new Date(d)).relocate();
  const dateAdd = dateAddFactory();
  const add2Date = (d, ...terms) => proxify(dateAdd(d, ...terms));
  const retrieveFormattingFormats = (locale, timeZone) => [
    `${locale && (!(Array.isArray(locale) && locale.length < 1)) ? `l:${locale}` : ``}`,
    `${timeZone ? `tz:${timeZone}` : ``}`]
    .filter(v => v).join(`,`);
  const removeLocaleInfo = d => {
    delete d.localeInfo;
    return proxify(d);
  };
  const names = function (d, month) {
    d = proxify(d);
    const {locale, timeZone} = d.localeInfo;
    return d.format(month ? `MM` : `WD`, retrieveFormattingFormats(locale, timeZone));
  };
  const getMs = d => `.${String(d.getMilliseconds()).padStart(3, "0")}`;
  const getTimeStr = (d, ms) => d.toLocaleTimeString(`en-GB`, {timeZone: d.localeInfo?.timeZone})
    + (ms ? `${getMs(d)}` : ``);
  
  function getOrSetLocale(d, {locale, timeZone, validate = true} = {}) {
    d.localeInfo = locale || timeZone ? createLocaleInfo(d, {locale, timeZone, validate}) : d.localeInfo;
    
    return d.localeInfo;
  }
  
  function createLocaleInfo(d, {locale, timeZone} = {}) {
    const info = validateLocale(locale, timeZone);
    d.localeInfo = { locale: info.locale, timeZone: info.timeZone }
    d.formats = retrieveFormattingFormats(d.localeInfo.locale, d.localeInfo.timeZone);
    return d.localeInfo;
  }
  
  function dateStr(d/*g*/) {
    d = proxify(d);
    const {locale, timeZone} = d.locale;
    const opts = timeZone ? {timeZone} : {};
    return d.toLocaleDateString(locale, opts);
  }
  
  function hasDST(dt /*g*/ ) {
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
  }
  
  function reLocate(d, locale, timeZone) {
    if (locale || timeZone) {
      getOrSetLocale(d, {locale, timeZone});
      return proxify(d);
    }
    
    if (d.localeInfo) {
      return proxify(d);
    }
    
    // no info, to local tz
    getOrSetLocale(d, validateLocale());
    
    return proxify(d);
  }
  
  function cloneTimeTo(d, toDate) {
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
  }
  
  function getLocalStr(d) {
    d = proxify(d);
    const {locale, timeZone} = d.locale ?? validateLocale();
    
    return d.toLocaleString(locale, {timeZone});
  }
  
  function doFormat(d, ...args) {
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
  }
  
  function cloneDateTo(d, toDate) {
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
  }
  
  function localizedDT(dt/*g*/) {
    const tz = {timeZone: getTimezone(dt), hourCycle: `h23`};
    try {
      return proxify(new Date(new Date(dt.toLocaleString(`en`, tz))));
    } catch (err) {
      console.error(`Can't retrieve localized date/time value for ${tz.timeZone}: ${err.message}`);
      return proxify(dt);
    }
  }
  
  function getValues(d)  {
    const mafklap = d.getMonth();
    d = proxify(d);
    const [MM,WD] = d.format(`MM,WD`).split(`,`);
    const [y,m,dd,h,mi,s,ms,dp] = d.format(`yyyy,m,dd,hh,mmi,ss,ms,dp`).split(`,`);
    let locale = d.localeInfo ? validateLocale(d.localeInfo.locale, d.localeInfo.timeZone) : validateLocale();
    
    return {
      year: +y,
      month: +m,
      date: +dd,
      hour: +h,
      minutes: +mi,
      seconds: +s,
      milliseconds: +ms,
      dayPeriod: dp !== `` ? dp : `n/a`,
      monthName: MM,
      weekDay: WD,
      resolvedLocale: locale,
      valuesArray: [y,(+m - 1),dd,h,mi,s,ms].map(Number),
    };
  }
  
  function localeDifference2(dt, utc=false)  {
    const self = localizedDT(dt);
    const selfHere = localizedDT(utc ? proxify(dt).clone.relocate({timeZone: `Etc/UTC`}) : new Date(dt));
    // milliseconds possibly influence the difference calculation
    // and are not relevant here, so discard
    selfHere.time = self.time = { milliseconds: 0 };
    const difference = self.differenceFrom(selfHere).clean;
    const equal = /equal/.test(difference);
    const sign =  equal ? `` : +self >= +selfHere ? `+` : `-`;
    return `${sign}${equal ? `no difference` : difference}`;
  }
  
  function daysUntil(dt, nextDate) {
    let z = 0;
    dt = proxify(dt);
    nextDate = proxify(nextDate);
    dt.time = nextDate.time = {hour: 0, minutes: 0, seconds: 0, milliseconds: 0};
    
    if (dt > nextDate) {
      [dt, nextDate] = [nextDate, dt];
    }
    
    while (dt < nextDate) {
      dt.add(`1 day`);
      z += 1;
    }
    return z;
  }
  
  function nextOrPrevious(d, {day, next = false, midnight = true, forFirstWeekday = false} = {}) {
    d = proxify(d);
    const dd = d.clone;
    let today = dd.getDay();
    dd.time = midnight ? { hour: 0, minutes: 0, seconds: 0, milliseconds: 0 } : {};
    let dayNr = `sun,mon,tue,wed,thu,fri,sat`.split(`,`).findIndex(v => v === day);
    let addTerm = `${ next ? 1 : -1 } days`;
    if (forFirstWeekday && today === dayNr) { return dd; }
    return dayNr < 0 ? d : function(){
      today = today === dayNr ? dd.add(addTerm).getDay() : today;
      while( today !== dayNr ) { today = dd.add(addTerm).getDay(); }
      return dd; }();
  }
  
  return {
    ...{
      clone,
      cloneLocal,
      hasDST,
      dateStr,
      timeZone: d => /*g*/getTimezone(d),
      firstWeekday: d => ({sunday = false, midnight = false} = {}) => /*gm,c*/nextOrPrevious( d, { day: sunday ? `sun` : `mon`, midnight, forFirstWeekday: true } ),
      next: d => (day, {midnight = false} = {}) => /*gm,c*/nextOrPrevious( d, { day, midnight, next: true } ),
      previous: d => (day, {midnight = false} = {}) => /*gm,c*/ nextOrPrevious( d, { day, midnight } ),
      year: (d, setValue) => /*g,s*/setValue && d.setFullYear(setValue) || getValues(d).year,
      month: (d, setValue) => /*g,s*/setValue && d.setMonth(v - 1) || getValues(d).month,
      date: (d, {year, month, date} = {}) => /*g,s*/getOrSetDate(d, {FullYear: year, Month: isNumberAndDefined(month) ? month - 1 : month, Date: date}),
      hour: (d, setValue) => /*g,s*/setValue && d.setHours(setValue) || getValues(d).hour,
      minutes: (d, setValue) => /*g,s*/setValue && d.setMinutes(setValue) || getValues(d).minutes,
      seconds: (d, setValue) => /*g,s*/setValue && d.setSeconds(setValue) || getValues(d).seconds,
      cloneTimeTo: d => toDate => /*mgm,c*/cloneTimeTo(d, toDate),
      cloneDateTo: d => toDate => /*mgm,c*/cloneDateTo(d, toDate),
      local: d => /*g*/getLocalStr(d),
      locale: (d, {locale, timeZone} = {}) => /*g,s*/getOrSetLocale(d, {locale, timeZone}),
      removeLocale: d => /*mg,c*/removeLocaleInfo(d),
      relocate: d => /*mgm,c*/({locale, timeZone} = {}) => reLocate(d, locale, timeZone),
      timeDiffToHere: d => /*g*/localeDifference2(d),
      timeDiffToUTC: d => /*g*/localeDifference2(d, true),
      time: (d, {hour, minutes, seconds, milliseconds} = {}) => /*g,s*/
        getOrSetTime(d, {Hours: hour, Minutes: minutes, Seconds: seconds, Milliseconds: milliseconds}),
      timeStr: d => (displayMS = false) => /*gm*/ getTimeStr(d, displayMS),
      dateISOStr: d => /*g*/isoDateStr(d),
      ms: (d, setValue) => /*g,s*/setValue && d.setMilliseconds(setValue) || d.getMilliseconds(),
      monthName: d => /*g*/names(d, true),
      weekDay: d => /*g*/names(d),
      self: d => /*g*/d,
      differenceFrom: d => /*gm*/fromDate => diffCalculator({start: d, end: fromDate}),
      values: d => /*g*/getValues(d),
      ISO: d => /*g*/d.toISOString(),
      daysInMonth: d => /*g*/getDaysInMonth(d.getFullYear(), d.getMonth()),
      isLeapYear: d => /*g*/getDaysInMonth(d.getFullYear(), 1) === 29,
      format: d => (...args) => /*gm*/doFormat(d, ...args),
      daysUntil: d => nextD => /*gm*/daysUntil(d, nextD),
    }, ...{
      addYears: d => (amount = 1) => /*mgm,c*/add2Date(d, `${amount} years`),
      addMonths: d => (amount = 1) => /*mgm,c*/add2Date(d, `${amount} months`),
      addWeeks: d => (amount = 1) => /*mgm,c*/add2Date(d, `${amount * 7} days`),
      addDays: d => (amount = 1) => /*mgm,c*/add2Date(d, `${amount} days`),
      nextYear: d => /*mg,c*/add2Date(d, `1 year`),
      nextWeek: d => /*mg,c*/add2Date(d, `7 days`),
      previousWeek: d => /*mg,c*/add2Date(d, "subtract, 7 days"),
      previousYear: d => /*mg,c*/add2Date(d, `subtract, 1 year`),
      nextMonth: d => /*mg,c*/add2Date(d, `1 month`),
      previousMonth: d => /*mg,c*/add2Date(d, `subtract, 1 month`),
      tomorrow: d => /*mg,c*/add2Date(d, `1 day`),
      yesterday: d => /*mg,c*/add2Date(d, `subtract, 1 day`),
      add: d => (...what2Add) => /*mgm,c*/add2Date(d, ...what2Add),
      subtract: d => (...what2Subtract) => /*mgm,c*/add2Date(d, ...[`subtract`].concat([what2Subtract]).flat()),
    }
  };
}