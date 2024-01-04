const $D = DateXFactory();
const DateX = $D;
module.exports = { DateX, $D, DateXFactory };

function DateXFactory() {
  let extensionGettersAndSetters = methodHelpersFactory(proxify, localeValidator);
  const proxy = {
    get: ( target, key ) => { return !target[key] ? extensionGettersAndSetters[key]?.(target) : targetGetter(target, key); },
    set: ( target, key, value ) => { return extensionGettersAndSetters[key] ? extensionGettersAndSetters[key](target, value) : target[key]; },
    ownKeys: () => Object.getOwnPropertyNames(extensionGettersAndSetters),
    has: (target, key) => key in extensionGettersAndSetters || key in target,
  };
  
  function extendWith({name, fn, root, isMethod, proxifyResult} = {}) {
    if (!name || !fn || !(fn instanceof Function)) {
      return console.error(`es-date-fiddler (extendWith): cannot extend without name and/or fn (function)`);
    }
    
    if (root) {
      Object.defineProperty( xDateFn, name, {
        value: (...args) => {
          const called = fn(...args);
          return called instanceof Date ? proxify(called) : called;
        }
      } );
      
      return console.log(`✔ created '${name}' root level method`);
    }
    
    extensionGettersAndSetters = Object.freeze({...extensionGettersAndSetters, [name]: dt => {
        dt = proxify(dt);
        
        if (dt.localeInfo) {
          dt.relocate(dt.localeInfo);
        }
        
        return isMethod
          ? (...args) => proxifyResult ? proxify(fn(dt, ...args)) : fn(dt, ...args)
          : proxifyResult ? proxify(fn(dt)) : fn(dt);
      }
    });
    console.log(`✔ created '${name}' ${isMethod ? `method` : `getter`}`);
  }
  
  function localeValidator(locale, timeZone, logError = true) {
    const reportLocaleError = errLocale =>
      console.error(`invalid locale (time zone: "${errLocale.timeZone}", locale: "${
        errLocale.locale}"), associated your locale instead`);
    try {
      return Intl.DateTimeFormat(locale, {timeZone: timeZone}).resolvedOptions();
    } catch (err) {
      logError && reportLocaleError({locale, timeZone});
      return Intl.DateTimeFormat().resolvedOptions();
    }
  }
  
  function now() {
    return xDateFn();
  }
  
  function validateLocaleConstructorExtension({locale, timeZone} = {}) {
    if (!locale && !timeZone) { return false; }
    const validated = localeValidator(locale, timeZone, false);
    
    if (locale && !timeZone) { return validated.locale === locale; }
    if (timeZone && !locale) { return timeZone === validated.timeZone; }
    
    return validated.locale === locale && timeZone === validated.timeZone;
  }
  
  function proxify(date) {
    return new Proxy(date, proxy);
  }
  
  function targetGetter(target, key) {
    if (key in target && target[key] instanceof Function) { return target[key].bind(target); }
    return target[key];
  }
  
  function getDescriptions() {
    // NOTE: only for non bundled code
    const descrs = {
      mgm: `mutating getter method`,
      c: `chainable`,
      g: `getter`,
      s: `setter`,
      mg: `mutating getter`,
      gm: `getter method`,
    };
    const lis = {};
    Object.entries(Object.getOwnPropertyDescriptors( extensionGettersAndSetters ))
      .sort(([key1, ], [key2, ]) => key1.localeCompare(key2))
      .forEach( ([key, description]) => {
        const matched = String(description.value)
          .match(/(?<=\/\*).+?(?=\*\/)/)?.shift()?.split(`,`)?.map(v => descrs[v]).join(`, `);
        if (matched) { lis[key] = matched; }
      });
    if (Object.keys(lis).length < 1)  {
      console.error(`$D.describe can only be used with uncompressed code`);
      return {};
    }
    return lis;
  }
  
  function xDateFn(dateOrLocale, localeInfo) {
    dateOrLocale = Array.isArray(dateOrLocale) ? new Date(...dateOrLocale) : dateOrLocale;
    const dateIsLocaleInfo = dateOrLocale?.locale || dateOrLocale?.timeZone;
    const dateIsDate = (dateOrLocale || ``) instanceof Date;
    const maybeDate = dateIsLocaleInfo
      ? new Date()
      : new Date( dateIsDate ? dateOrLocale : Date.parse(dateOrLocale));
    const date2Proxy = !isNaN(maybeDate) ? maybeDate : new Date(Date.now());
    
    return proxify(date2Proxy).relocate(dateIsLocaleInfo ? dateOrLocale : localeInfo);
  }
  
  Object.defineProperties(xDateFn, {
    now: { get() { return now(); } },
    extendWith: { get() { return extendWith; } },
    validateLocale: {get() { return validateLocaleConstructorExtension; } },
    ownFns: { get() { return Object.getOwnPropertyDescriptors( extensionGettersAndSetters ) } },
    describe: { get() { return getDescriptions(); } }
  });
  
  return xDateFn;
}

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
    return d.format(month ? `MM` : `WD`, `l:${d.locale?.locale || `utc`}`);
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
  };
  
  function getValues(d)  {
    d = proxify(d);
    const [y,m,dd,h,mi,s,ms,dp] = d.format(`yyyy,mm,dd,hh,mmi,ss,ms,dp`).split(`,`);
    const [WD, MM] = d.format(`WD,MM`).split(`,`);
    let locale = d.localeInfo ? validateLocale(d.localeInfo.locale, d.localeInfo.timeZone) : validateLocale();
    const valueObj = {
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
      valuesArray: [y,m - 1,dd,h,mi,s,ms].map(Number),
    };
    
    return valueObj;
  };
  
  function localeDifference2(dt)  {
    const self = localizedDT(dt);
    const selfHere = localizedDT(new Date(dt));
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
  
  const extensions = {
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
  
  return extensions;
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

    const diffs = { from: date1, to: date2, years, months, days, hours, minutes, seconds, milliseconds };
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
            return parseInt(v) ? subtract ? -v : +v : v;
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