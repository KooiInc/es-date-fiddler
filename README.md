# es-date-fiddler
An ES Date with nifty extensions using [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). 
It is programmed in a [class free object oriented](https://depth-first.com/articles/2019/03/04/class-free-object-oriented-programming/) coding style.


See [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for examples. 

<h2 id="What">What is it?</h2>

The datefiddler library by default delivers an enhanced ES-Date constructor, and a factory to create the constructor (`DateXFactory`). In the following we named it `$D`.

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
`$D` can be *locale aware*. When one initializes a `$D`, one can either provide a locale and/or timezone for it, or set it later. If a locale is set, some of the getters will use it. The locale is either set on initialization of a `$D`, or by the `.locale` setter. The next snippet demonstrates this (it shows the basic syntax of `$D` as well).

``` javascript
const myDate = $D(`2021/2/15`, {locale: `fr-FR`, timeZone: `Europe/Paris`});
const nowGermany = $D({locale: `de-DE`, timeZone: `Europe/Berlin`});
const myDutchDate = myDate.clone;
myDutchDate.locale = {locale: `nl-NL`, timeZone: `Europe/Amsterdam`};
```

## Import & initialize

There are *three flavors* of this library. One for scripts with type `module` (or projects with `"type": "module"` in package.json). One for the browser and one to use with `require` in NodeJS.

For each flavor, the script is (bundled and) minified. The location of the minified scripts is `https://kooiinc.github.io/es-date-fiddler/Bundle`

**Note**: earlier version of this module exported `DateX`. That's still available, but may be deprecated in a later version.

### NodeJS commonjs
The library is a of type *module*. The cjs-code exports the constructor as `DateX` and `$D` and the factory `DateXFactory`.

Download links:
- https://cdn.jsdelivr.net/gh/KooiInc/es-date-fiddler@latest/Node/index.bundle.cjs
- https://kooiinc.github.io/es-date-fiddler/Node/index.bundle.cjs

``` javascript
// after download of the bundle from one of the download links 
import {$D} from "[local location of the bundle]/index.bundle.cjs";
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
```javascript
// $D imported and initialized
const now = $D();
const then = $D(`1997/04/27 01:30`);
const previousMonth = now.clone.previousMonth;
console.log(now.differenceFrom(then));
console.log(previousMonth.local);
````

For more comprehensive usage examples, see [**demo**](https://kooiinc.github.io/es-date-fiddler/Demo/).

## Getters and setters of `$D`

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
- `clone`: clones the `$D` instance to a new `$D`
  - **Note**: `[instance].clone` may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript).
- `cloneDateTo([dateTo]: Date|$D)`: copies the *date part* of the `$D` instance (*including its locale*) to `dateTo`. When `dateTo` is missing the date part is copied to *now*.<br>Returns a new `$D` instance.
  - **Note**: `[instance].cloneDateTo` may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript).
- `cloneTimeTo([dateTo]: Date/$D)`: clones the *time part*  of the `$D` instance (*including its locale*) to `dateTo`. When `dateTo` is missing the time part is copied to *now*.<br>Returns a new `$D` instance.
  - **Note**: `[instance].cloneTimeTo` may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript).
- `daysInMonth`: returns the days in the month of the `$D` instance Date.
- `daysUntil(nextDate: Date | $D instance)`: returns the number of days between two dates
  - **Note** The time of both dates will not be considered, so returns the number of days between
    *midnight* from - and to date. 
- `dateStr`: get the date part from the instance date as string.
  - **Note** when locale information is associated with the instance, will be formatted cf that locale.
- `dateISOStr`: get the date part from the instance date as ISO 8601 string (yyyy-mm-dd).
- `getTimezone`: retrieves the time zone of the instance date (either the associated - or the local time zone).
- `hasDST`: determine if the instance date timeZone is within a Daylight Saving Time zone.
  - **Note**: this uses the instances' associated locale information or the current local timeZone of the instance date.
- `isLeapYear`: calculates and returns if the `$D` instance is a leap year (return true or false).
- `ISO`: short for `.toISOString()`, so returns the ISO string representation of the `$D` instance
- `local`: `[instance].local`: `tolocalestring()` equivalent, but 
  - when `[instance].locale` is set, will use that (so `toLocaleString(locale, {timeZone})`)
- `localizedDT`: retrieve the local date/time for the either the instances' associated time zone or the local time zone (the latter is not very usefull). May be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript). This is especially useful for determining the time for a date in a remote time zone.
- `locale2Formats`: derive a formatting string from the locale (if applicable) for use in `[instance].format` (second parameter).
- `monthName`: `[instance.monthName]` The name of the month (january, february ...), using the instances' locale
- `self`: returns the original `Date` as a plain ES `Date`.
- `timeStr(includeMS: boolean`): retrieve time as string (`hh:mm:ss[.ms]`).
- `values`(asArray: boolean): returns the values (year, month etc.) either as `Object` or as `Array`.
- `weekDay`: `[instance.weekDay]` The name of the weekday (monday, tuesday ...), using the instances' locale

### Additional getter and/or setters are:
- `date`: `[instance].date = /* Object literal. One or more of */ { year, month, date };`
- `time`: `[instance].time = /* Object literal. One or more of */ { hour, minutes, seconds, milliseconds };` 
- `locale`:  `[instance].locale = /* Object literal. One or both of */ { locale: [locale], timeZone: [timeZone] }`.
  - **Note**: when the locale of a `$D` instance is not set ones current locale is used.
  - **Note**: it *is* important to use valid values. When either locale or timeZone are not valid (e.g. `timeZone: "London"`), some stringify-getters (`format, local`) will show an error message in the resulting string. [See also](https://betterprogramming.pub/formatting-dates-with-the-datetimeformat-object-9c808dc58604), or [this wikipedia page](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
- `reLocate(newLocale: Object: {locale: string, timeZone: string})`: locale setter as method. Associate [locale] and [timeZone] with the current `$D` instance.
- `removeLocale()`: remove all associated locale information from the `$D` instance.  
- `format(template: string, options: string)`: format the date (locale specific) using a template string. This uses a specific library. See [Github](https://github.com/KooiInc/dateformat) for all about the syntax.
- `differenceFrom(someDate: Date | $D)`: calculates the difference from `somedate` in years, months, days, hours, minutes, seconds and milliseconds. See the [demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for a few examples.
- `relocate({locale, timeZone}: Object)`: (re)set the locale of the instance. When one or neither of `locale`/  `timeZone` is/are present, the locale will be set to `{locale: 'utc', timeZone: 'Etc/UTC'}`.
   - **Note**: `[instance].relocate(...)` may be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript).

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
* all setters below can be [chained](https://www.tutorialspoint.com/method-chaining-in-javascript), e.g. `[instance].nextYear.add("15 days").subtract("2 hours, 30 minutes")`.
* for convenience the `$D` constructor has the property (getter) `now` to create an instance with the current `Date`. `$D.now` is equivalent to `$D()`. 
---
- `add(...things2Add: string | string[])`: add [things2Add] to the `$D` instance and set its value to the result. [thing2Add] can be either a comma delimited string, or a number of strings, e.g. `[instance].add("1 day, 5 hours")` or `[instance].add("1 day", "5 hours")` 
- `subtract(...things2Subtract: string | string[])`: subtract [things2Add] from the `$D` instance and set its value to the result. [thing2Add] can be either a comma delimited string, or a number of strings, e.g. `[instance].subtract("1 day, 5 hours")` or `[instance].subtract("1 day", "5 hours")`.
  - **Note**: `subtract` is for convenience, it can also be written as `[instance].add("-1 day, -5 hours")`
- `addYears(n: Number)`: add `n` years to the `$D` instance and set its value to the result. `n` May be  negative. 
- `addMonths(n: Number)`: add `n` months to the `$D` instance and set its value to the result. `n` May be  negative. 
- `addWeeks(n: Number)`: add `n` weeks to the `$D` instance and set its value to the result. `n` May be  negative.
- `addDays(n: Number)`: add `n` days to the `$D` instance and set its value to the result. `n` May be negative.
- `nextYear`: add one year to the `$D` instance and set its value to the result.
- `previousYear`: subtract one year to the `$D` instance and set its value to the result.
- `nextWeek`: add one week (7 days) to the `$D` instance and set its value to the result. 
- `previousWeek`: subtract one week (7 days) from the `$D` instance  and set its value to the result.
- `nextMonth`: add one month to the `$D` instance and set its value to the result. 
- `previousMonth`: subtract one month to the `$D` instance and set its value to the result. 
- `tomorrow`: add one day to the `$D` instance and set its value to the result. 
- `yesterday`: subtract one day from the `$D` instance and set its value to the result.

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
