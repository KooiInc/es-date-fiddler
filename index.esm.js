import methodHelpersFactory from "./src/DateProxyHelpers.js";

export default DateFiddlerFactory;

function DateFiddlerFactory() {
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