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
  const getLocale = (d, values) => {
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
        toDate.locale = { locale: cloneFrom.locale.l, timeZone: cloneFrom.locale.tz };
      }
    }

    return toDate;
  };
  const cloneTimeTo = (d, toDate) => {
    toDate = proxify(toDate ?? new Date());
    const cloneFrom = proxify(d);
    const {hour, minutes, seconds, ms} = cloneFrom;
    console.log(ms);
    toDate.time = {hour, minutes, seconds, milliseconds: ms};

    if (cloneFrom.locale) {
      toDate.locale = { locale: cloneFrom.locale.l, timeZone: cloneFrom.locale.tz };
    }

    return toDate;
  };
  const getLocalStr = (d, opts) => {
    d = proxify(d);

    if (!d.locale) {
      return d.toLocaleString();
    }

    if (d.locale?.tz) {
      opts = {...(opts ?? {}), timeZone: d.locale.tz };
    }

    return d.toLocaleString(d.locale.l, opts);
  }
  const doFormat = (d, ...args) => {
    const locale = proxify(d).locale;
    return args.length === 1
      ? formatter(d, args[0], locale?.formats) : args.length
        ? formatter(d, ...args) : d.toLocaleString(locale?.l);
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
  const createLocaleInfo = function(d, {locale = `utc`, timeZone = `Etc/UTC` } = {}) {
    d.localeInfo = {
      l: locale,
      tz: timeZone,
      formats: `l:${locale},tz:${timeZone}` };
    return d.localeInfo;
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
    monthName: d => { d = proxify(d); return d.format(`MM`, `l:${d.locale?.l || `utc`}`); },
    weekDay: d => { d = proxify(d); return d.format(`WD`, `l:${d.locale?.l || `utc`}`); },
    self: d => d,
    local: (d, opts) => getLocalStr(d, opts),
    locale: (d, values) => getLocale(d, values),
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