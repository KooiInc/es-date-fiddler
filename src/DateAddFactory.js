export default dateAddFactory;

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