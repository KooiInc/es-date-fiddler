import dateAddFactory from "./DateAddFactory.js";
import dateDiffFactory from "./DateDiffFactory.js";
import {DateFormatFactory} from "../dateformat/index.js";

export default methodHelpersFactory;

function methodHelpersFactory(proxify) {
  const formatter = DateFormatFactory();
  const getValues = (d, asArray) => {
    const valueObj = {
      year: d.getFullYear(), month: d.getMonth() + 1, date: d.getDate(),
      hour: d.getHours(), minutes: d.getMinutes(),
      seconds: d.getSeconds(), milliseconds: d.getMilliseconds() };
    return asArray ? Object.values(valueObj) : valueObj;
  };
  const getOrSetLocale = (d, {locale, timeZone} = {}) => {
    if ( locale || timeZone) {
      d.localeInfo = createLocaleInfo(d, {locale, timeZone});
    }

    return d.localeInfo;
  };
  const currentLocalTime4TZ = dt => timeZoneLabel =>
    new Date(new Date().toLocaleString(`en`, {timeZone: timeZoneLabel}))
      .toLocaleString(`en-CA`, {hourCycle: `h23`});
  const cloneDateTo = (d, toDate) => {
    toDate = proxify(toDate ?? new Date());
    const cloneFrom = proxify(d);

    if (toDate) {
      const {year, month, date} = cloneFrom;
      toDate.date = {year, month, date};

      if (cloneFrom.locale) {
        toDate.locale = { locale: cloneFrom.locale.locale, timeZone: cloneFrom.locale.timeZone };
      }
    }

    return toDate;
  };
  const cloneTimeTo = (d, toDate) => {
    toDate = proxify(toDate ?? new Date());
    const cloneFrom = proxify(d);
    const {hour, minutes, seconds, ms} = cloneFrom;
    toDate.time = {hour, minutes, seconds, ms};

    if (cloneFrom.locale) {
      toDate.locale = { locale: cloneFrom.locale.locale, timeZone: cloneFrom.locale.timeZone };
    }

    return toDate;
  };
  const localeCatcher = function(dProxified) {
    const formats = getFormats(dProxified);
    const report = formats?.replace(/l:/, `locale: `).replace(/tz:/, `timeZone: `);
    return dProxified.toLocaleString() + ` !!invalid locale info => ${report}`;
  };
  const getLocalStr = (d) => {
    d = proxify(d);
    let opts = {};

    if (!d.locale) {
      return d.toLocaleString();
    }

    if (d.locale?.timeZone) {
      opts = { timeZone: d.locale.timeZone };
    }

    try { return d.toLocaleString(d.locale?.locale, opts); }
    catch(err) { return localeCatcher(d); }
  }
  const doFormat = (d, ...args) => {
    d = proxify(d);
    const [ locale, timeZone ] = [ d.locale, d.timeZone ];
    const formats = getFormats(d);
    try {
      return args.length === 1
        ? formatter(d, args[0], formats)
        : args.length
          ? formatter(d, ...args)
          : d.toLocaleString(locale, timeZone ? { timeZone } : undefined);
    } catch(err) { return localeCatcher(proxify(d)); }
  };
  const doSet = (d, values) => Object.getPrototypeOf(values || ``).constructor === Object &&
    Object.entries(values)
      .filter( ([, value]) => isNumberAndDefined(value) )
      .forEach( ([key, value]) => d[`set${key}`](+value)) &&
    true || false;
  const getOrSetDate = function(d, values) { return doSet(d, values) || d.getDate(); };
  const isNumberAndDefined = v => !isNaN(parseInt(v));
  const diffCalculator = dateDiffFactory();
  const getTime = d => [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()];
  const getDate = d => [d.getFullYear(), d.getMonth(), d.getDate()];
  const getTimeStr = (d, ms) => {
    const timeArr = getTime(d);
    const milliSecs = ms ? `.${timeArr.pop()}`.padStart(3, `0`) : ``;
    return `${timeArr.slice(0, 3).map( v => `${v}`.padStart(2, '0')).join(`:`)}${milliSecs}`;
  }
  const getOrSetTime = function(d, values) { return doSet(d, values) || getTime(d); };
  const getDaysInMonth = (year, month) =>
    proxify(new Date(year, month + 1, 1, 0, 0, 0)).yesterday.getDate();
  const getDateX = d => [d.getFullYear(), d.getMonth(), d.getDate()];
  const clone = d => proxify(new Date(d));
  const dateAdd = dateAddFactory();
  const add2Date = (d, ...terms) => proxify(dateAdd(d, ...terms));
  const createLocaleInfo = function(d, {locale, timeZone } = {}) {
    [locale, timeZone] = [
      locale || d.localeInfo?.locale, timeZone || d.localeInfo?.timeZone];
    const formats = [
       `${locale ? `l:${locale}` : ``}`,
       `${timeZone ? `tz:${timeZone}` : ``}` ]
      .filter(v => v).join(`, `)
    d.localeInfo = {
      formats,
      ...(locale ? {locale} : {}),
      ...(timeZone ? {timeZone} : {}), };
    return d.localeInfo;
  };
  const getFormats = d => {
    d = proxify(d);
    const [locale, timeZone] = [ d.localeInfo?.locale, d.localeInfo?.timeZone];
    return [
      `${locale ? `l:${locale}` : ``}`,
      `${timeZone ? `tz:${timeZone}` : ``}` ]
      .filter(v => v).join(`, `);
  };
  const removeLocaleInfo = d => {
    d = proxify(d);
    delete d.localeInfo;
  };
  const reLocate = function(d, locale, timeZone) {
    d = proxify(d);
    d.locale = {locale, timeZone};
    return d;
  };
  const names = function(d, month) {
    d = proxify(d);
    return d.format(month ? `MM` : `WD`, `l:${d.locale?.locale || `utc`}`);
  }

  return ({
    ...{
      clone,
      currentLocalTime4TZ,
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
      ms: (d, setValue) => setValue && d.setMilliseconds(setValue) || d.getMilliseconds(),
      monthName: d => names(d, true),
      weekDay: d => names(d),
      self: d => d,
      local: d => getLocalStr(d),
      locale: (d, {locale, timeZone} = {}) => getOrSetLocale(d, {locale, timeZone}),
      removeLocale: d => () => removeLocaleInfo(d),
      relocate: d => ({locale, timeZone} = {}) => reLocate(d, locale, timeZone),
      differenceFrom: d => fromDate => diffCalculator({start: d, end: fromDate}),
      values: d => asArray => getValues(d, asArray),
      ISO: d => d.toISOString(),
      daysInMonth: d => getDaysInMonth(d.getFullYear(), d.getMonth()),
      isLeapYear: d => getDaysInMonth(d.getFullYear(), 1) === 29,
      format: d => (...args) => doFormat(d, ...args),
    },
    ...{
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
  });
}