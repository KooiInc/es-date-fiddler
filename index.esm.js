import methodHelpersFactory from "./src/DateProxyHelpers.js";
const dx = DateXFactory();
export { dx as default, DateXFactory };

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
  
  function dateFromStringCheck(dateStr, dateParsed) {
    const date4Check = xDateFn(dateStr.replace(/T/, ` `));
    const date2Check = xDateFn(dateParsed);
    
    return date4Check.date.join(``) === date2Check.date.join(``);
  }
  
  function DateFromString(dateString, format = "ymd") {
    dateString = dateString.trim();
    const dsArray = dateString?.split(/[T :\-\/.,]/g).filter(v => !!(v.trim()));
    const getResult = () => {
      const formatMap = [...format].reduce((a, b, i) => (a[b] = i, a), {});
      const datePart = dsArray.slice(0, 3);
      const timePart = dsArray.slice(3);
      const [year, month, date, hours, minutes, seconds, milliseconds] =
        [ +datePart[formatMap.y], +datePart[formatMap.m] - 1, +datePart[formatMap.d], ]
          .concat([...Array(4)].map( (_, i) => +timePart[i] || 0 ) );
      
      if (year < 1900) {
        return new Date(new Date( year, month, date, hours, minutes, seconds, milliseconds ).setFullYear(year) );
      }
      
      return new Date( year, month, date, hours, minutes, seconds, milliseconds );
    };
    const convert = {
      get cando() { return getResult(); },
      get cannot() {
        if (!dateString || dsArray?.length < 3) {
          console.error(`dateFromString: can't convert "${!dateString
            ? `empty date string`
            : dateString}" to ES-Date` );
          return true;
        }
        
        if (!dateFromStringCheck(dateString, getResult())) {
          console.error(`dateFromString: not what we expected. Check your input ("${
            dateString}" and "${format}")` );
          return true;
        }
        
        return undefined; },
    }
    
    return convert.cannot ? new Date(NaN) : convert.cando;
  }
  
  function localeWeekdays(locale = `en-GB`) {
    return [...Array(7).keys()]
      .map( (v) => {
        const dayStr = new Date(Date.UTC(1970, 0, 6+v) ).toLocaleDateString(locale, { weekday: 'long' });
        return {[dayStr]: {
          index: v,
          firstUp: dayStr[0].toUpperCase() + dayStr.slice(1) }
        };
      });
  }
  
  Object.defineProperties(xDateFn, {
    now: { get() { return now(); } },
    extendWith: { get() { return extendWith; } },
    validateLocale: {get() { return validateLocaleConstructorExtension; } },
    ownFns: { get() { return Object.getOwnPropertyDescriptors( extensionGettersAndSetters ) } },
    describe: { get() { return getDescriptions(); } },
    dateFromString: { value: DateFromString },
    localeWeekdays: { value: localeWeekdays },
  });
  
  return xDateFn;
}