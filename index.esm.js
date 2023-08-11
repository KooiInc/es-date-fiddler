import methodHelpersFactory from "./src/DateProxyHelpers.js";
const dx = DateXFactory();
export { dx as default, DateXFactory };

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
      return console.error(`es-date-fiddler (extendWith): cannot extend without name and/or fn (function)`);
    }

    proxied[name] = dt => {
      dt = proxify(dt);

      if (dt.localeInfo) {
        dt.relocate(dt.localeInfo);
      }

      return isMethod
        ? (...args) => proxifyResult ? proxify(fn(dt, ...args)) : fn(dt, ...args)
        : proxifyResult ? proxify(fn(dt)) : fn(dt);
    }
  };

  return exported;
}