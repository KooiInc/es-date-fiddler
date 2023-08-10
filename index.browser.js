window.DateX = DateXFactory();

function DateXFactory() {
  const proxied = methodHelpersFactory(proxify);
  const proxy = {
    get: ( target, key ) => { return !target[key] && proxied[key]?.(target) || targetGetter(target, key); },
    set: ( target, key, value ) => { return proxied[key]?.(target, value) || target[key]; },
    ownKeys: (target) => Object.getOwnPropertyNames(proxied),
    has: (target, key) => key in proxied || key in target,
  };

  function proxify(date) {
    return new Proxy(date, proxy);
  }

  function targetGetter(target, key) {
    if (key in target && target[key] instanceof Function) { return target[key].bind(target); }
    return target[key];
  }

  function exported(dateOrLocale, localeInfo) {
    const dateIsLocaleInfo = dateOrLocale?.locale || dateOrLocale?.timeZone;
    const dateIsDate = (dateOrLocale || ``) instanceof Date;
    const maybeDate = dateIsLocaleInfo
      ? new Date()
      : new Date( dateIsDate ? dateOrLocale : Date.parse(dateOrLocale));
    const date2Proxy = !isNaN(maybeDate) ? maybeDate : new Date(Date.now());
    const proxied = proxify(date2Proxy);

    if (dateIsLocaleInfo || localeInfo) {
      proxied.locale = dateIsLocaleInfo ? dateOrLocale : localeInfo;
    }

    return proxied;
  }

  exported.extendWith = function({name, fn, isMethod = false, proxifyResult = false} = {}) {
    if (!name || !fn || !(fn instanceof Function)) {
      return console.error(`cannot extend without name and/or fn (function)`);
    }
    proxied[name] = dt => isMethod
      ? (...args) => {
        dt = proxify(dt);
        return proxifyResult ? proxify(fn(dt, ...args)) : fn(dt, ...args);
      }
      : proxifyResult ? proxify(fn(proxify(dt))) : fn(proxify(dt));
  };

  return exported;
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
  const getOrSetLocale = (d, {locale, timeZone} = {}) => {
    if ( locale || timeZone) {
      d.localeInfo = createLocaleInfo(d, {locale, timeZone});
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
  const getOrSetDate = (d, {year, month, date} = {}) => {
    if (year || month || date) {
    const [y, m, dt] = getDate(d);
      d.setFullYear(year || y);
      d.setMonth( (month || m + 1) - 1);
      d.setDate(date || dt);
      return true;
    }
    return d.getDate();
  };
  const diffCalculator = dateDiffFactory();
  const getTime = d => [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()];
  const getDate = d => [d.getFullYear(), d.getMonth(), d.getDate()];
  const getTimeStr = (d, ms) => {
    const timeArr = getTime(d);
    const milliSecs = ms ? `.${timeArr.pop()}`.padStart(3, `0`) : ``;
    return `${timeArr.slice(0, 3).map( v => `${v}`.padStart(2, '0')).join(`:`)}${milliSecs}`;
  }
  const getOrSetTime = function(d,  { hour, minutes, seconds, milliseconds } = {}) {
    if (hour || minutes || seconds || milliseconds) {
      const [h, m, s, ms] = getTime(d);
      d.setHours(hour ?? h);
      d.setMinutes(minutes ?? m);
      d.setSeconds(seconds ?? s);
      d.setMilliseconds(milliseconds ?? ms);
      return true;
    }
    return getTime(d);
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
      year: (d, setValue) => setValue && d.setFullYear(setValue) || d.getFullYear(),
      month: (d, setValue) => setValue && d.setMonth(v - 1) || d.getMonth() + 1,
      date: (d, {year, month, date} = {}) => getOrSetDate(d, {year, month, date}),
      hour: (d, setValue) => setValue && d.setHours(setValue) || d.getHours(),
      minutes: (d, setValue) => setValue && d.setMinutes(setValue) || d.getMinutes(),
      seconds: (d, setValue) => setValue && d.setSeconds(setValue) || d.getSeconds(),
      cloneTimeTo: d => toDate => cloneTimeTo(d, toDate),
      cloneDateTo: d => toDate => cloneDateTo(d, toDate),
      time: (d, {hour, minutes, seconds, milliseconds} = {}) => getOrSetTime(d, {hour, minutes, seconds, milliseconds}),
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

function dateDiffFactory() {
  const checkParams = (start, end) => {
    const noStart = isNaN(start);
    const noEnd = isNaN(end);
    if (noStart && !noEnd) {
      const [message, full, clean] = Array(3).fill(`start- and/or end date are not valid`);
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
  const parts = Object.entries({
    year: `FullYear`, month: `Month`, date: `Date`,
    day: `Date`, hour: `Hours`, minute: `Minutes`,
    second: `Seconds`, millisecond: `Milliseconds` })
    .reduce( (acc, [key, value]) =>
      ({...acc, [key]: value, [`${key}s`]: value}), {} );

  const aggregateArguments = function(...argsRaw) {
    if (argsRaw.length < 1) { return []; }

    let subtract;

    if (argsRaw[0].startsWith(`subtract`)) {
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

  return function(date, ...args) {
    let aggregated = aggregateArguments(...args);

    if (aggregated.length) {
      aggregated.forEach( ([n, part]) => {
        part = parts[part];

        if (+n && part) {
          date[`set${part}`](date[`get${part}`]() + +n);
        }
      } );
    }

    return date;
  };
}