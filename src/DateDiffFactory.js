export default dateDiffFactory;

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