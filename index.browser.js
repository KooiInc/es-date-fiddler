window.DateFiddlerFactory = DateFiddlerFactory;

function DateFiddlerFactory() {
  console.log(`nounou`);
  const proxied = methodHelpersFactory(proxify);
  const proxy = {
    get: ( target, key ) => { return !target[key] && proxied[key]?.(target) || targetGetter(target, key); },
    set: ( target, key, value ) => { return proxied[key]?.(target, value) || target[key]; }
  };

  return function(date) {
    const maybeDate = new Date(Date.parse(date));
    const date2Proxy = !isNaN(maybeDate) ? maybeDate : new Date(Date.now());
    return proxify(date2Proxy);
  }

  function proxify(date) {
    return new Proxy(date, proxy);
  }

  function targetGetter(target, key) {
    if (key in target && target[key] instanceof Function) { return target[key].bind(target); }
    return target[key];
  }
}

function DateFormatFactory() {
  const [digits, numeric, long, short] = [`2-digit`, `numeric`, `long`, `short`];
  const theOptions = {
    fixed: {
      MM: {month: long},
      M: {month: short},
      m: {month: numeric},
      mm: {month: digits},
      yyyy: {year: numeric},
      yy: {year: digits},
      WD: {weekday: long},
      wd: {weekday: short},
      d: {day: numeric},
      dd: {day: digits},
      h: {hour: numeric},
      hh: {hour: digits},
      mi: {minute: numeric},
      mmi: {minute: digits},
      s: {second: numeric},
      ss: {second: digits},
      ms: {fractionalSecondDigits: 3},
      tz: {timeZoneName: `shortOffset`},
      dl: {locale: `default`},
      h12: {hour12: false},
      yn: {yearName: ``},
      ry: {relatedYear: true},
      msp: {fractionalSecond: true},
    },
    dynamic: {
      tzn: v => ({timeZoneName: v.slice(4)}),
      hrc: v => ({hourCycle: `h${v.slice(4)}`}),
      ds: v => ({dateStyle: v.slice(3)}),
      ts: v => ({timeStyle: v.slice(3)}),
      tz: v => ({timeZone: v.slice(3)}),
      e: v => ({era: v.slice(2)}),
      l: v => ({locale: v.slice(2)}),
    },
  }
  const dtfOptions = {
    ...theOptions,
    retrieveDyn(fromValue) {
      const key = fromValue?.slice(0, fromValue.indexOf(`:`));
      return theOptions.dynamic[key] && theOptions.dynamic[key](fromValue);
    },
    get re() { return new RegExp(`\\b(${Object.keys(theOptions.fixed).join(`|`)})\\b`, `g`); },
  };
  const extractFromTemplate = (rawTemplateString = `dtf`, plainTextIndex = 0) => {
    let formatStr = ` ${ rawTemplateString
      .replace(/(?<=\{)(.+?)(?=})/g, _ => `[${plainTextIndex++}]`)
      .replace(/[{}]/g, ``)
      .trim() } `;
    const texts = rawTemplateString.match(/(?<=\{)(.+?)(?=})/g) || [];
    return {
      get texts() { return texts; },
      formatString(v) { formatStr = v; },
      set formatStr(v) { formatStr = v; },
      get formatStr() { return formatStr; },
      get units() { return formatStr.match(dtfOptions.re) || []; },
      finalize(dtf = ``, h12 = ``, era = ``, yn = ``) {
        return formatStr
          .replace(/~([\d+]?)/g, `$1`)
          .replace(/dtf/, dtf)
          .replace(/era/, era)
          .replace(/dp\b|~dp\b/, h12)
          .replace(/yn\b/, yn)
          .replace(/\[(\d+?)]/g, (_, d) => texts[d].trim())
          .trim();
      }
    };
  };
  const unSpacify = str => str.replace(/\s+/g, ``);
  const getOpts = (...opts) => opts?.reduce( (acc, optValue) =>
      ({...acc, ...(dtfOptions.retrieveDyn(optValue) || dtfOptions.fixed[optValue]),}),
    dtfOptions.fixed.dl );
  const dtNoParts = (date, xTemplate, moreOptions) => {
    const opts = getOpts(...unSpacify(moreOptions).split(`,`));
    const formatted = Intl.DateTimeFormat(opts.locale, opts).format(date);
    return xTemplate.finalize(formatted);
  };
  const dtFormatted = (date, xTemplate, moreOptions) => {
    const optsCollected = getOpts( ...xTemplate.units.concat(unSpacify(moreOptions).split(`,`)).flat() );
    const opts = {...dtfOptions.fixed};
    // note: numeric is locale independent
    const checkNumeric = (type, value) => optsCollected[type] === `numeric` && value.startsWith(`0`)
      ? value.slice(1) : value;
    const dtf = Intl.DateTimeFormat(optsCollected.locale, optsCollected)
      .formatToParts(date)
      .reduce( (parts, v) =>
        (v.type === `literal` ? parts : {...parts, [v.type]: checkNumeric(v.type, v.value) } ), {} );
    opts.ms = optsCollected.fractionalSecondDigits ? opts.msp : opts.ms;
    opts.yyyy = dtf.relatedYear ? opts.ry : opts.yyyy;
    xTemplate.formatStr = xTemplate.formatStr
      .replace(dtfOptions.re, dtUnit => dtf[Object.keys(opts[dtUnit]).shift()] || dtUnit);
    return xTemplate.finalize(...[,dtf.dayPeriod, dtf.era, dtf.yearName]);
  }

  return (date, template, moreOptions = `l:default`) => (/ds:|ts:/.test(moreOptions))
    ? dtNoParts(...[date, extractFromTemplate(undefined), moreOptions])
    : dtFormatted(...[date, extractFromTemplate(template || undefined), moreOptions]);
}

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
    d.localeInfo =  (!(`localeInfo` in d) || values ) ? createLocaleInfo(d, values) : d.localeInfo;
    return d.localeInfo;
  };
  const cloneTimeTo = (d, toDate) => {
    const cloneD = new Date(...getDateX(toDate ?? new Date()));
    const cloneT = getTime(d, true);
    return clone(new Date(...getDateX(cloneD).concat(cloneT)));
  };
  const getLocalStr = (d, opts) => {
    d = proxify(d);
    return d.toLocaleString(d.locale.l, {...(opts ?? {}), timeZone: d.locale.tz });
  }
  const doFormat = (d, ...args) => {
    const locale = proxify(d).locale;
    return args.length === 1
      ? formatter(d, args[0], locale.formats) : args.length
        ? formatter(d, ...args) : d.toLocaleString(locale.l);
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
    cloneDate: d => clone(new Date(...getDateX(d).concat([0, 0, 0]))),
    cloneTime: d => cloneTimeTo(d),
    cloneTimeTo: d => toDate => cloneTimeTo(d, toDate),
    time: (d, hmsms) => hmsms && setTime(d, hmsms) || getTime(d),
    timeStr: d => (ms = false) => getTimeStr(d, ms),
    ms: (d, v) => v && d.setMilliseconds(v) || d.getMilliseconds(),
    monthName: d => { d = proxify(d); return d.format(`MM`, `l:${d.locale.l}`); },
    weekDay: d => { d = proxify(d); return d.format(`WD`, `l:${d.locale.l}`); },
    self: d => d,
    local: (d, opts) => getLocalStr(d, opts),
    locale: (d, values) => getLocale(d, values),
    differenceFrom: d => fromD => diffCalculator({start: d, end: fromD}),
    values: d => asArray => getValues(d, asArray),
    UTC: d => Date.UTC( ...getValues(d, true) ),
    UTCString: d => d.toUTCString(),
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

function dateDiffFactory() {
  const checkParams = (start, end) => {
    const noStart = isNaN(start);
    const noEnd = isNaN(end);
    if (noStart && !noEnd) {
      const [message, full, clean] = Array(3).fill(`start and end date are not valid`);
      return { error: true, message, full, clean };
    }

    if (noEnd) {
      const [message, full, clean] = Array(3).fill(`end date not valid`);
      return { error: true, message, full, clean };
    }

    if (noStart) {
      const [message, full, clean] = Array(3).fill(`start date not valid`);
      return { error: true, message, full, clean };
    }

    return { error: false };
  };

  const stringify = stringifyComposed();

  return function getDifference({start, end} = {}) {
    const maybeStart = new Date(Date.parse(start));
    const maybeEnd = new Date(Date.parse(end));
    const checks = checkParams(maybeStart, maybeEnd);
    if (checks.error) { return checks; }
    const date1 = new Date(start);
    const date2 = new Date(end);
    const differenceMs = Math.abs(date2 - date1);
    const differenceDate = new Date(differenceMs);
    const years = differenceDate.getUTCFullYear() - 1970;
    const months = differenceDate.getUTCMonth();
    const days = differenceDate.getUTCDate() - 1;
    const hours = differenceDate.getUTCHours();
    const minutes =  differenceDate.getUTCMinutes();
    const seconds = differenceDate.getUTCSeconds();
    const milliseconds = differenceDate.getUTCMilliseconds();

    const diffs = { years, months, days, hours, minutes, seconds, milliseconds };
    diffs.full = stringify({values: diffs, full: true});
    diffs.clean = stringify({ values: diffs });
    return diffs;
  };

  function stringifyComposed() {
    const pipe = (...functions) => initial => functions.reduce((param, func) => func(param), initial);
    const singleOrMultiple = (numberOf, term) => (numberOf === 1 ? term.slice(0, -1) : term);
    const filterRelevant = ({values, full}) =>
      [Object.entries(values).filter( ([key, ]) => /^(years|month|days|hours|minutes|seconds)/i.test(key)), full];
    const aggregateDiffs = ([diffs, full]) =>
      full ? diffs : diffs.filter(([, value]) => full ? +value : value > 0);
    const stringifyDiffs = diffsFiltered => diffsFiltered.reduce( (acc, [key, value])  =>
      [...acc, `${value} ${singleOrMultiple(value, key)}`], [] );
    const diffs2SingleString = diffStrings  => diffStrings.length < 1
      ? `Dates are equal` : `${diffStrings.slice(0, -1).join(`, `)}${
        diffStrings.length > 1 ? ` and ` : ``}${diffStrings.slice(-1).shift()}`;
    return pipe(filterRelevant, aggregateDiffs, stringifyDiffs, diffs2SingleString);
  }
}

function dateAddFactory() {
  const units = Object.entries({
    year: `FullYear`, month: `Month`, date: `Date`,
    day: `Date`, hour: `Hours`, minute: `Minutes`,
    second: `Seconds`, millisecond: `Milliseconds` })
    .reduce( (acc, [key, value]) =>
      ({...acc, [key]: value, [`${key}s`]: value}), {} );

  const aggregateParams = function(...argsRaw) {
    if (argsRaw.length < 1) {
      return [];
    }
    let subtract;

    if (argsRaw[0] === `subtract` || argsRaw[0].startsWith(`subtract`)) {
      subtract = true;

      if (argsRaw[0].startsWith(`subtract`) && argsRaw.length === 1) {
        argsRaw = argsRaw[0].split(`,`);
      }

      argsRaw = argsRaw.slice(1);
    }

    const allInOne = argsRaw.length === 1 ? argsRaw[0]?.split(/,/) : argsRaw;

    if (allInOne && allInOne.length) {
      argsRaw = allInOne.map(v => v.trim());
    }

    return argsRaw
      .map(function (a) {
        return a.toLowerCase().split(/\s/)
          .map(v => {
            v = v.trim();
            return +v ? subtract ? -v : +v : v;
          });
      });
  }

  const add2Date = function(date, ...args) {
    let aggregated = aggregateParams(...args);

    if (aggregated.length) {
      aggregated.forEach( ([n, term]) => {
        term = units[term];

        if (+n && term) {
          date[`set${term}`](date[`get${term}`]() + +n);
        }
      } );
    }

    return date;
  };

  return add2Date;
}