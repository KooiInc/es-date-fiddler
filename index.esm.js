import methodHelpersFactory from "./src/DateProxyHelpers.js";
const dx = DateFiddlerFactory();
export { dx as default, DateFiddlerFactory };

function DateFiddlerFactory() {
  const proxied = methodHelpersFactory(proxify);
  const proxy = {
    get: ( target, key ) => { return !target[key] && proxied[key]?.(target) || targetGetter(target, key); },
    set: ( target, key, value ) => { return proxied[key]?.(target, value) || target[key]; }
  };

  return function(dateOrLocale, localeInfo) {
    const dateIsLocaleInfo = dateOrLocale?.locale || dateOrLocale?.timeZone;
    const maybeDate = dateIsLocaleInfo ? new Date() : new Date(Date.parse(dateOrLocale));
    const date2Proxy = !isNaN(maybeDate) ? maybeDate : new Date(Date.now());
    const proxied = proxify(date2Proxy);

    if (dateIsLocaleInfo || localeInfo) {
      proxied.locale = dateIsLocaleInfo ? dateOrLocale : localeInfo;
    }

    return proxied;
  }

  function proxify(date) {
    return new Proxy(date, proxy);
  }

  function targetGetter(target, key) {
    if (key in target && target[key] instanceof Function) { return target[key].bind(target); }
    return target[key];
  }
}