# es-date-fiddler
An ES Date with nifty extensions using ES Proxy. Furthermore it is programmed in a [class free object oriented](https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming/) coding style.

See [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for examples. 

## What is it?
The datefiddler library delivers an enhanced ES-Date called `DateX`.

A `DateX` is a normal ECMAScript `Date` Object. By using `Proxy` functionality one can use a number of additional setters and getters (e.g. for arithmetic, formatting, locale awareness), *as well as* use all regular `Date` functionality. So, to create a `DateX`, instead of `new Date(...)` one uses `DateX(...)`.

For example, to set the date of a `DateX`, use

``` javascript
const myDate = DateX();
myDate.date = { year: myDate.year + 3, date: 12, month: 1 };
// one doesn't need to fill all values, the following keeps the current year of the XDate
myDate.date = { date: 12, month: 5 };
```
A `DateX` can be *locale aware*. When one initializes a `DateX`, one can either provide a locale and/or timezone for it, or set it later. If a locale is set, some of the getters will use it. The locale is either set on initialization of a `DateX`, or by the `.locale` setter. The next snippet demonstrates this (it shows the basic syntax of `DateX` as well).

``` javascript
const myDate = DateX(`2021/2/15`, {locale: `fr-FR`, timeZone: `Europe/Paris`});
const nowGermany = DateX({locale: `de-DE`, timeZone: `Europe/Berlin`});
const myDutchDate = myDate.clone;
myDutchDate.locale = {locale: `nl-NL`, timeZone: `Europe/Amsterdam`};
```

## Import & initialize

There are *three flavors* of this library. One for scripts with type `module` (or projects with `"type": "module"` in package.json). One for the browser and one to use with `require` in NodeJS.

For each flavor, the script is (bundled and) minified. The location of the minified scripts is `https://kooiinc.github.io/es-date-fiddler/Bundle`

### NodeJS require

``` javascript
// after download of the bundle from 
// https://kooiinc.github.io/es-date-fiddler/Bundle/index.cjs.min.js
// Note: the module is exported as a function
const DateX = require("[local location of the bundle]/index.cjs.min.js").DateX;
```

### ESM import
``` javascript
const DateX = ( await 
  import("https://kooiinc.github.io/es-date-fiddler/Bundle/index.esm.min.js") 
).default;
// Note: the module also exports a factory named DateXFactory. Use it as
const dxFactory = (await 
  import("https://kooiinc.github.io/es-date-fiddler/Bundle/index.esm.min.js")
    .DateXFactory;
const DateX = dxFactory();
```

### Browser script
``` html
<script 
  src="https://kooiinc.github.io/es-date-fiddler/Bundle/index.browser.min.js">
</script>
<script>
  const DateX = window.DateX;
  // optionally delete from global namespace
  delete window.DateX;
</script>
```

## Usage examples
```javascript
// DateX imported and initialized
const now = DateX();
const then = DateX(`1997/04/27 01:30`);
const previousMonth = now.clone.previousMonth;
console.log(now.differenceFrom(then));
console.log(previousMonth.local);
````

For more comprehensive usage examples, see [**demo**](https://kooiinc.github.io/es-date-fiddler/Demo/).


## Getters and setters of `DateX`

### Simple getters/setters are: 
- `year`: `[instance].year` or `[instance].year = [value]` 
- `month`: `[instance].month` or `[instance].month = [value]`
- `hour`: `[instance].hour` or `[instance].hour = [value]` 
- `minutes`: `[instance].minutes` or `[instance].minutes = [value]` 
- `seconds`: `[instance].seconds` or `[instance].seconds = [value]` 
- `ms`: `[instance].ms` or `[instance].ms = [value]`
- `date`: `[instance].date` (see additional getter/setters for setter)
- `time`: `[instance].time` returns an [h, m, s, ms] (see additional getters/setters for setter)
- `locale`: returns the internal value of locale (if it is set, otherwise `undefined`). See additional getters/setters for setter.

### Additional getters are
- `local`: `[instance].local`: `tolocalestring()` equivalent, but 
  - when `[instance].locale` is set, will use that (so `toLocaleString(locale, {timeZone})`)
- `monthName`: `[instance.monthName]` The name of the month (january, february ...), using the instances' locale
- `weekDay`: `[instance.weekDay]` The name of the weekday (monday, tuesday ...), using the instances' locale
- `self`: returns the original `Date` as a plain ES `Date`
- `clone`: clones the `DateX` instance to a new `DateX`
   - **Note**: `[instance].clone` may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript).   
- `cloneDateTo([dateTo]: Date|DateX)`: copies the *date part* of the `DateX` instance (*including its locale*) to `dateTo`. When `dateTo` is missing the date part is copied to *now*.<br>Returns a new `DateX` instance.
  - **Note**: `[instance].cloneDateTo` may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript).
- `cloneTimeTo([dateTo]: Date/DateX)`: clones the *time part*  of the `DateX` instance (*including its locale*) to `dateTo`. When `dateTo` is missing the time part is copied to *now*.<br>Returns a new `DateX` instance.
  - **Note**: `[instance].cloneTimeTo` may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript).
- `daysInMonth`: returns the days in the month of the `DateX` instance Date.
- `isLeapYear`: calculates and returns if the `DateX` instance is a leap year (return true or false)
- `values`(asArray: boolean): returns the values (year, month etc.) either as `Object` or as `Array`.
- `ISO`: short for `.toISOString()`, so returns the ISO string representation of the `DateX` instance

### Additional getter and/or setters are:
- `date`: `[instance].date = /* Object literal. One or more of */ { year, month, date };`
- `time`: `[instance].time = /* Object literal. One or more of */ { hour, minutes, seconds, milliseconds };` 
- `locale`:  `[instance].locale = /* Object literal. One or both of */ { locale: [locale], timeZone: [timeZone] }`.
  - **Note**: when the locale of a `DateX` instance is not set ones current locale is used.
  - **Note**: it *is* important to use valid values. When either locale or timeZone are not valid (e.g. `timeZone: "London"`), some stringify-getters (`format, local`) will show an error message in the resulting string. [See also](https://betterprogramming.pub/formatting-dates-with-the-datetimeformat-object-9c808dc58604), or [this wikipedia page](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
- `removeLocale()`: remove all associated locale information from the `DateX` instance.  
- `format(template: string, options: string)`: format the date (locale specific) using a template string. This uses a specific library. See [Github](https://github.com/KooiInc/dateformat) for all about the syntax.
- `differenceFrom(someDate: Date | DateX)`: calculates the difference from `somedate` in years, months, days, hours, minutes, seconds and milliseconds. See the [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for a few examples.
- `relocate({locale, timeZone}: Object)`: (re)set the locale of the instance. When one or neither of `locale`/  `timeZone` is/are present, the locale will be set to `{locale: 'utc', timeZone: 'Etc/UTC'}`.
   - **Note**: `[instance].relocate(...)` may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript).

### Setters to add or subtract days, years, hours etc.
The following setters use the following basic syntax for adding or subtracting things from the date at hand.

```
  yourDateX.[add/subtract](
    "[n year(s)], [n month(s)], [n week(s)], [n day(s)], 
     [n hour(s)], [n minute(s)], [n second(s)], [n millisecond(s)]"
  );
```

See the [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for examples.

**Notes**:
* all setters below *change the instance Date*. If one doesn't want that, `clone` the `DateX` instance first, e.g `const nextYear = [instance].clone.nextYear`.
* all setters below can be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript), e.g. `[instance].nextYear.add("15 days").subtract("2 hours, 30 minutes")`.
---
- `add(...things2Add: string | string[])`: add [things2Add] to the `DateX` instance and set its value to the result. [thing2Add] can be either a comma delimited string, or a number of strings, e.g. `[instance].add("1 day, 5 hours")` or `[instance].add("1 day", "5 hours")` 
- `subtract(...things2Subtract: string | string[])`: subtract [things2Add] from the `DateX` instance and set its value to the result. [thing2Add] can be either a comma delimited string, or a number of strings, e.g. `[instance].subtract("1 day, 5 hours")` or `[instance].subtract("1 day", "5 hours")`.
  - **Note**: `subtract` is for convenience, it can also be written as `[instance].add("-1 day, -5 hours")`
- `addYears(n: Number)`: add `n` years to the `DateX` instance and set its value to the result. `n` May be  negative. 
- `addMonths(n: Number)`: add `n` months to the `DateX` instance and set its value to the result. `n` May be  negative. 
- `addWeeks(n: Number)`: add `n` weeks to the `DateX` instance and set its value to the result. `n` May be  negative.
- `addDays(n: Number)`: add `n` days to the `DateX` instance and set its value to the result. `n` May be negative.
- `nextYear`: add one year to the `DateX` instance and set its value to the result.
- `previousYear`: subtract one year to the `DateX` instance and set its value to the result.
- `nextWeek`: add one week (7 days) to the `DateX` instance and set its value to the result. 
- `previousWeek`: subtract one week (7 days) from the `DateX` instance  and set its value to the result.
- `nextMonth`: add one month to the `DateX` instance and set its value to the result. 
- `previousMonth`: subtract one month to the `DateX` instance and set its value to the result. 
- `tomorrow`: add one day to the `DateX` instance and set its value to the result. 
- `yesterday`: subtract one day from the `DateX` instance and set its value to the result.
