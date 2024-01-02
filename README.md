# es-date-fiddler
An ES Date with nifty extensions using [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). 
It is programmed in a [class free object oriented](https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming/) coding style.


See [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for examples. 

<h2 id="What">What is it?</h2>

The datefiddler library by default delivers an enhanced ES-Date constructor, and a factory to create the constructor (`DateXFactory`). In the following we name the constructor `$D`.

`$D` is a normal ECMAScript `Date` constructor, without the need to use `new`. 
By using `Proxy` functionality one can use and/or create a number of additional setters and getters (e.g. for arithmetic, formatting, locale awareness), *as well as* use all regular `Date` functionality. 
So, to create a `$D` extended `Date`, instead of `new Date(...)` one uses `$D(...)`.

For example, to set the date of a `$D`, use

``` javascript
const myDate = $D();
myDate.date = { year: myDate.year + 3, date: 12, month: 1 };
// one doesn't need to fill all values, the following keeps the current year of the XDate
myDate.date = { date: 12, month: 5 };
```
Instances are ***locale aware***. When one instantiates a `$D` instance, 
one can either provide a locale (e.g. `de-DE`) and/or timeZone identifier (e.g. `Europ/Berlin`) 
for it, or set it later.

When locale/timeZone is not associated with an instance, the instance will be 
associated with the local (your) locale and timeZone identifier.

The next snippet demonstrates this (it shows the basic syntax of `$D` as well).

``` javascript
const myDate = $D(`2021/2/15`, {locale: `fr-FR`, timeZone: `Europe/Paris`});
const nowGermany = $D({locale: `de-DE`, timeZone: `Europe/Berlin`});
const aClone = myDate.clone;
aClone.locale; //=> {locale: `fr-FR`, timeZone: `Europe/Paris`}
const myDutchDate = myDate.cloneLocal;
myDutchDate.locale; //=> {locale: [your locale], timeZone: [your time zone]};
```

## Import & initialize

There are *three flavors* of this library. One for scripts with type `module` (or projects with `"type": "module"` in package.json). One for the browser and one to use with `require` in NodeJS.

For each flavor, the script is (bundled and) minified. The location of the minified scripts is `https://kooiinc.github.io/es-date-fiddler/Bundle`

**Note**: earlier version of this module exported `DateX`. That's still available, but may be deprecated in a later version.

### NodeJS commonjs
The cjs-code exports the constructor as `DateX` and `$D` and the factory `DateXFactory`. 

Download links:
- https://cdn.jsdelivr.net/gh/KooiInc/es-date-fiddler@latest/Node/index.bundle.cjs
- https://kooiinc.github.io/es-date-fiddler/Node/index.bundle.cjs

``` javascript
// no package.json or "type": "commonjs" in your package.json
const $D = require("[local location of the cjs bundle]/index.bundle.cjs").$D;

// "type": "module" in your package.json:
// after download of the bundle from one of the download links
// Note: in this case you may as well use the esm import.
// See next chapter (ESM import) 
import {$D} from "[local location of the cjs bundle]/index.bundle.cjs";
/* ... */
```

### ESM import

Import links:
- https://cdn.jsdelivr.net/gh/KooiInc/es-date-fiddler@latest/Bundle/index.esm.min.js
- https://kooiinc.github.io/es-date-fiddler/Bundle/index.esm.min.js

``` javascript
import $D = from "https://kooiinc.github.io/es-date-fiddler/Bundle/index.esm.min.js";

// Note: the module also exports a factory named DateXFactory. Use it as
import import {DateXFactory} from "https://kooiinc.github.io/es-date-fiddler/Bundle/index.esm.min.js";
const $D = dxFactory();
/* ... */
```

### Browser script
The browser-code makes the constructor available as `window.$D` or `window.DateX`, 
and the factory as `window.DateXFactory`.

Import links:
- https://cdn.jsdelivr.net/gh/KooiInc/es-date-fiddler@latest/Bundle/index.browser.min.js
- https://kooiinc.github.io/es-date-fiddler/Bundle/index.browser.min.js
 
``` html
<script 
  src="https://kooiinc.github.io/es-date-fiddler/Bundle/index.browser.min.js">
</script>
<script>
  const $D = window.$D;
  /* ... */
</script>
```

## Usage examples
The [**DEMO**](https://kooiinc.github.io/es-date-fiddler/Demo/) contains a lot of usage examples.

## Getters and setters of `$D` instances

A number of getter (-methods) return the instance. These may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript). For example:

```javascript
const nextweek = $D(`2024/01/01`)
  .nextMonth
  .add(`-3 hours, 20 minutes, 5 seconds`)
  .relocate({locale: `en-AU`, timeZone: 'Australia/Darwin'})
  .format(`WD MM d yyyy hh:mmi:ss dp`); //=> 'Thursday February 1 2024 06:50:05 am'
```

### Simple getters/setters are: 
- `year`: `[instance].year` or `[instance].year = [value]` 
- `month`: `[instance].month` or `[instance].month = [value]`
- `hour`: `[instance].hour` or `[instance].hour = [value]` 
- `minutes`: `[instance].minutes` or `[instance].minutes = [value]` 
- `seconds`: `[instance].seconds` or `[instance].seconds = [value]` 
- `ms`: `[instance].ms` or `[instance].ms = [value]`
- `date`: `[instance].date` (see additional getter/setters for setter)
- `time`: `[instance].time` returns an [h, m, s, ms] (see additional getters/setters for setter)
- `locale`: returns the current value of locale and timeZone identifier (`{locale, timeZone}`). 
   See additional getters/setters for the setter.

### Additional getters are
- `clone`<sup>chainable</sup>: clones the `$D` instance to a new `$D` instance, including its associate locale/timeZone.
- `cloneLocal`<sup>chainable</sup>: clones the `$D` instance to new `$D` instance *with the default (your) locale/timeZone*.
- `cloneDateTo([dateTo]: Date|$D)`<sup>chainable</sup>: copies the *date part* of the `$D` instance to `dateTo`. When `dateTo` is missing the date part is copied to *now*.<br>Returns a new `$D` instance.
- `cloneTimeTo([dateTo]: Date/$D)`<sup>chainable</sup>: clones the *time part*  of the `$D` instance to `dateTo`. When `dateTo` is missing the time part is copied to *now*.<br>Returns a new `$D` instance.
- `daysInMonth`: returns the days in the month of the `$D` instance Date.
- `daysUntil(nextDate: Date | $D instance)`: returns the number of days between two dates. 
   The time of both dates will not be considered, so returns the number of days between
    *midnight* from - and to date.
- `dateStr`: get the date part from the instance date as string. 
   The string will be formatted using the instances' associated locale information.
- `dateISOStr`: get the date part from the instance date as ISO 8601 string (yyyy-mm-dd).
- `firstWeekday([{sunday: boolean, midnight: boolean}])`<sup>chainable</sup>: retrieve new instance 
   from the date of the instances' first weekday, starting from monday (default) or 
   sunday (`{ sunday: true }`) with the instances' time (default) or the time set to midnight (`{ midnight: true }`). 
- `getTimezone`: retrieves the time zone of the instance date (either the associated - or the local time zone).
- `hasDST`: determine if the instance date timeZone is within a Daylight Saving Time zone, using the instances' 
   associated timeZone information.
- `isLeapYear`: calculates and returns if the `$D` instance is a leap year (return true or false).
- `ISO`: short for `.toISOString()`, so returns the ISO string representation of the `$D` instance
- `local`: `[instance].local`: `tolocalestring()` equivalent, but `[instance].local` will use the instances' 
   locale/timeZone (either set or the default (your) locale/timeZone).
- `monthName`: `[instance.monthName]` The name of the month (january, february ...), using the instances' associated locale.
- `self`: returns the original `Date` as a plain ES `Date`.
- `timeStr(includeMS: boolean`): retrieve time as string (`hh:mm:ss[.ms]`).   
   The result will be the time within the instances' associated timeZone, with a 24-hour notation (hh:mm:ss[.ms]).
- `timeZone`: retrieves the timeZone currently associated with the instance.
- `timeDiffToHere`: retrieves the time difference (hour, minutes) from an instance to the date within the default (your) timeZone.
- `values(asArray: boolean)`: returns the values (year, month etc.) using the associated locale/timeZone as `Object`:  
   `{year, month, date, hour, minutes, seconds, milliseconds, dayPeriod, monthName, weekDay, resolvedLocale, valuesArray}`.
- `weekDay`: `[instance.weekDay]` The name of the weekday (monday, tuesday ...), using the instances' associated locale.

### Additional getter and/or setters are:
- `date` (setter): `[instance].date = /* Object literal. One or more of { year, month, date }; */`
- `time` (setter): `[instance].time = /* Object literal. One or more of { hour, minutes, seconds, milliseconds }; */` 
- `locale` (setter):  `[instance].locale = /* Object literal. One or both of  { locale: [locale], timeZone: [timeZone] } */`.  
   **Notes**: 
   - when the locale of a `$D` instance is not set ones current locale/timeZone is used.
   - it *is* important to use valid values. When either locale or timeZone are not valid (e.g. `timeZone: "London"`), 
     some stringify-getters (`format, local`) will revert to ones current locale/timeZone. See [this wikipedia page](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
- `relocate(newLocale: Object: {locale: string, timeZone: string})`<sup>chainable</sup>: locale setter as method. Associate [locale] and [timeZone] with the current `$D` instance.
- `removeLocale`<sup>chainable</sup>: remove associated locale information from the `$D` instance (**note**: resets to local (your) locale). 
- `format(template: string, options: string)`: format the date (locale specific) using a template string. This uses a specific library. See [Github](https://github.com/KooiInc/dateformat) for all about the syntax.
- `differenceFrom(date: instance or ES-Date)`: retrieve the instances' *absolute* difference from [date]. Returns:  
  `{from, to, years, months, days, hours, minutes, seconds, milliseconds, full (string from all values), clean (string from non zero values)}`  
  See the [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for a few examples.
- `relocate({locale, timeZone}: Object)`<sup>chainable</sup>: (re)set the locale of the instance. When one or neither of `locale`/  `timeZone` is/are present, the locale will be set to `{locale: 'utc', timeZone: 'Etc/UTC'}`.

### Setters to add or subtract days, years, hours etc.
The following setters use the following basic syntax for adding or subtracting things from the date at hand.

```
  your$D.[add/subtract](
    "[n year(s)], [n month(s)], [n week(s)], [n day(s)], 
     [n hour(s)], [n minute(s)], [n second(s)], [n millisecond(s)]"
  );
```

See the [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for examples.

**Notes**:
* all setters below *change the instance Date*. If one doesn't want that, `clone` the `$D` instance first, e.g `const nextYear = [instance].clone.nextYear`.
* all setters below are chainable, e.g. `[instance].nextYear.add("15 days").subtract("2 hours, 30 minutes")`.
* for convenience the `$D` constructor has the property (getter) `now` to create an instance with the current `Date`. `$D.now` is equivalent to `$D()`. 
---
- `add(...things2Add: string | string[])`<sup>chainable</sup>: add [things2Add] to the `$D` instance and set its value to the result. [thing2Add] can be either a comma delimited string, or a number of strings, e.g. `[instance].add("1 day, 5 hours")` or `[instance].add("1 day", "5 hours")` 
- `subtract(...things2Subtract: string | string[])`<sup>chainable</sup>: subtract [things2Add] from the `$D` instance and set its value to the result. [thing2Add] can be either a comma delimited string, or a number of strings, e.g. `[instance].subtract("1 day, 5 hours")` or `[instance].subtract("1 day", "5 hours")`.
  - **Note**: `subtract` is for convenience, it can also be written as `[instance].add("-1 day, -5 hours")`
- `addYears(n: Number)`<sup>chainable</sup>: add `n` years to the `$D` instance and set its value to the result. `n` May be  negative. 
- `addMonths(n: Number)`<sup>chainable</sup>: add `n` months to the `$D` instance and set its value to the result. `n` May be  negative. 
- `addWeeks(n: Number)`<sup>chainable</sup>: add `n` weeks to the `$D` instance and set its value to the result. `n` May be  negative.
- `addDays(n: Number)`<sup>chainable</sup>: add `n` days to the `$D` instance and set its value to the result. `n` May be negative.
- `nextYear`<sup>chainable</sup>: add one year to the `$D` instance and set its value to the result.
- `previousYear`<sup>chainable</sup>: subtract one year to the `$D` instance and set its value to the result.
- `nextWeek`<sup>chainable</sup>: add one week (7 days) to the `$D` instance and set its value to the result. 
- `previousWeek`<sup>chainable</sup>: subtract one week (7 days) from the `$D` instance  and set its value to the result.
- `nextMonth`<sup>chainable</sup>: add one month to the `$D` instance and set its value to the result. 
- `previousMonth`<sup>chainable</sup>: subtract one month to the `$D` instance and set its value to the result. 
- `tomorrow`<sup>chainable</sup>: add one day to the `$D` instance and set its value to the result. 
- `yesterday`<sup>chainable</sup>: subtract one day from the `$D` instance and set its value to the result.

## Instance utilities

### now, validateLocale
- `now`: (getter) as may be expected, delivers an instance from the current date. It is equivalent to `$D(()`.
- `validatedLocale(locale: Object {locale, timeZone})`: 
   validate a `locale` string, a `timeZone` label or both

### `extendWith`: create additonal setters and getters for `$D`
One can create additional setters/getter (properties/methods) to the constructor using:

`$D.extendWith({name: string, fn: Function, isMethod: boolean, proxifyResult: boolean})`

- `fn: Function`: the function to use. The function signature is `[fn](date, [one or more arguments])`. 
  The [date] parameter is the instance date, which within the function [fn] will be available as a `$D` instance
- `isMethod: boolean`
  by default the extension function is added as property (getter) when `isMethod` is `false`. When `isMethod` is `true`, the function is considered (and callable) as a method and can receive parameters (`[instance][name](dateValue, ...args)`).
- `proxifyResult: boolean`: When `true` ***and*** `fn` returns the instance date, enables chaining by returning a `$D` instance. Default value is `false`. May be useful when one is not sure the return value will be the
   actual instance instead of a 'plain' `Date`.

The [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) contains examples.
