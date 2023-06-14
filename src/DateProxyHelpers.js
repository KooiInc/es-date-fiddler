import dateAddFactory from "./DateAddFactory.js";
import dateDiffFactory from "./DateDiffFactory.js";
import { DateFormatFactory } from "../dateformat/index.js";

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
  const getOrSetLocale = (d, values) => {
    if (values) {
      d.localeInfo = createLocaleInfo(d, values);
    }

    return d.localeInfo;
  };
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
    toDate.time = {hour, minutes, seconds, milliseconds: ms};

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
  const getLocalStr = (d, opts) => {
    d = proxify(d);

    if (!d.locale) {
      return d.toLocaleString();
    }

    if (d.locale?.timeZone) {
      opts = {...(opts ?? {}), timeZone: d.locale.timeZone };
    }

    try { return d.toLocaleString(d.locale.locale, opts); }
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
  const setDate = (d, {year, month, date} = {}) => {
    const [y, m, dt] = getDate(d);
    d.setFullYear(year || y);
    d.setMonth( (month || m + 1) - 1);
    d.setDate(date || dt);
  };
  const diffCalculator = dateDiffFactory();
  const getTime = d => [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()];
  const getDate = d => [d.getFullYear(), d.getMonth(), d.getDate()];
  const getTimeStr = (d, ms) => {
    const timeArr = getTime(d);
    const milliSecs = ms ? `.${timeArr.pop()}`.padStart(3, `0`) : ``;
    return `${timeArr.slice(0, 3).map( v => `${v}`.padStart(2, '0')).join(`:`)}${milliSecs}`;
  }
  const setTime = function(d,  { hour, minutes, seconds, milliseconds } = {}) {
    const [h, m, s, ms] = getTime(d);
    d.setHours(hour ?? h);
    d.setMinutes(minutes ?? m);
    d.setSeconds(seconds ?? s);
    d.setMilliseconds( milliseconds ?? ms);
  };
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
  const removeLocaleInfo = (d) => {
    d = proxify(d);
    delete d.localeInfo;
  };
  const reLocate = function(d, locale, timeZone) {
    d = proxify(d);
    d.locale = {locale, timeZone};
    return d;
  };

  const proxyProperties = {
    clone,
    year: (d, v) => v && d.setFullYear(v) || d.getFullYear(),
    month: (d, v) => v && d.setMonth(v - 1) || d.getMonth() + 1,
    date: (d, ymd) => ymd && setDate(d, ymd) || d.getDate(d),
    hour: (d, v) => v && d.setHours(v) || d.getHours(),
    minutes: (d, v) => v && d.setMinutes(v) || d.getMinutes(),
    seconds: (d, v) => v && d.setSeconds(v) || d.getSeconds(),
    cloneTimeTo: d => toDate => cloneTimeTo(d, toDate),
    cloneDateTo: d => toDate => cloneDateTo(d, toDate),
    time: (d, hmsms) => hmsms && setTime(d, hmsms) || getTime(d),
    timeStr: d => (ms = false) => getTimeStr(d, ms),
    ms: (d, v) => v && d.setMilliseconds(v) || d.getMilliseconds(),
    monthName: d => { d = proxify(d); return d.format(`MM`, `l:${d.locale?.locale || `utc`}`); },
    weekDay: d => { d = proxify(d); return d.format(`WD`, `l:${d.locale?.locale || `utc`}`); },
    self: d => d,
    local: (d, opts) => getLocalStr(d, opts),
    locale: (d, values) => getOrSetLocale(d, values),
    removeLocale: d => () => removeLocaleInfo(d),
    relocate: d => ({locale, timeZone} = {}) => reLocate(d, locale, timeZone),
    differenceFrom: d => fromD => diffCalculator({start: d, end: fromD}),
    values: d => asArray => getValues(d, asArray),
    ISO: d => d.toISOString(),
    daysInMonth: d => getDaysInMonth(d.getFullYear(), d.getMonth()),
    isLeapYear: d => getDaysInMonth(d.getFullYear(), 1) === 29,
    format: d => (...args) => doFormat(d, ...args),
  };
  const fiddling = {
    addYears: d => (n = 1) => add2Date(d, `${n} years`),
    addMonths: d => (n = 1) => add2Date(d, `${n} months`),
    addWeeks: d => (n = 1) => add2Date(d, `${n * 7} days`),
    addDays: d => (n = 1) => add2Date(d, `${n} days`),
    nextYear: d => add2Date(d, `1 year`),
    nextWeek: d => add2Date(d, `7 days`),
    previousWeek: d => add2Date(d, "subtract, 7 days"),
    previousYear: d => add2Date(d, `subtract, 1 year`),
    nextMonth: d => add2Date(d, `1 month`),
    previousMonth: d => add2Date(d, `subtract, 1 month`),
    tomorrow: d => add2Date(d, `1 day`),
    yesterday: d => add2Date(d, `subtract, 1 day`),
    add: d => (...args) => add2Date(d, ...args),
    subtract: d => (...args) => add2Date(d, ...[`subtract`].concat([args]).flat()),
  };


  return {...proxyProperties, ...fiddling};
}