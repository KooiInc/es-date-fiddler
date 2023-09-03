import methodHelpersFactory from "./src/DateProxyHelpers.js";
const dx = DateXFactory();
export { dx as default, DateXFactory };

function DateXFactory() {
  let extensionGettersAndSetters = Object.freeze(methodHelpersFactory(proxify, localeValidator));
  const proxy = {
    get: ( target, key ) => { return !target[key] ? extensionGettersAndSetters[key]?.(target) : targetGetter(target, key); },
    set: ( target, key, value ) => { return extensionGettersAndSetters[key] ? extensionGettersAndSetters[key](target, value) : target[key]; },
    ownKeys: (target) => Object.getOwnPropertyNames(extensionGettersAndSetters),
    has: (target, key) => key in extensionGettersAndSetters || key in target,
  };

  function extendWith({name, fn, root = false, isMethod = false, proxifyResult = false} = {}) {
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

  function validateLocale({locale, timeZone} = {}) {
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

  function xDateFn(dateOrLocale, localeInfo) {
    dateOrLocale = Array.isArray(dateOrLocale) ? new Date(...dateOrLocale) : dateOrLocale;
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

  Object.defineProperties(xDateFn, {
    now: { get() { return now(); } },
    extendWith: { get() { return extendWith; } },
    validateLocale: {get() { return validateLocale; } },
    ownFns: { get() { return Object.getOwnPropertyDescriptors( extensionGettersAndSetters ) } }
  });

  return xDateFn;
}