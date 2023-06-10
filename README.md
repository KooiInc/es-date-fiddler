# es-date-fiddler
An ES Date with nifty extensions using ES Proxy

See [Demo](https://kooiinc.github.io/es-date-fiddler/Demo/) for examples. 

## What is it?
The datefiddler library delivers an enhanced ES-Date called `DateX`.

A `DateX` 'behaves' like a normal ES-Date, but it contains additional setters and getters. For example, to set the date of a `DateX`, you use

``` ecmascript 6
// the XDate instance is call myDate
myDate.date = { year: myDate.year + 3, date: 12, month: 1 };
// you don't need to fill all values, the following keeps the current year of the XDate
myDate.date = { date: 12, month: 5 };
```

## Import & initialize

There are three flavors of this library. One for scripts with type `module` (or projects with `"type": "module"` in package.json). One for the browser and one to use with `require` in NodeJS.

For each flavor, the script is (bundled and) minified. The location of the minified scripts is `https://kooiinc.github.io/es-date-fiddler/Bundle`

### NodeJS require

``` ecmascript 6
// after you downloaded the bundle from 
// https://kooiinc.github.io/es-date-fiddler/Bundle/index.cjs.min.js
// Note: the module is exported as a function
const DateX = require("[local location of the bundle]/index.cjs.min.js").DateX;
```

### ESM import
``` ecmascript 6
// after you downloaded the bundle from 
// https://kooiinc.github.io/es-date-fiddler/Bundle/index.esm.min.js
const DateX = (await import("[local location of the bundle]/index.esm.min.js")).default;
import DateFiddlerFactory from "[local location of the bundle]/index.esm.min";
const DateX = DateFiddlerFactory();
// Note: the module also exports a factory named DateFiddlerFactory. Use it as
const DateX = (await import("[local location of the bundle]/index.esm.min.js")).DateFiddlerFactory();
// or
const dfFactory = (await import("[local location of the bundle]/index.esm.min.js")).DateFiddlerFactory;
// [...]
const DateX = dfFactory();
```

### Browser script
``` html
<!-- after you downloaded the bundle from 
     https://kooiinc.github.io/es-date-fiddler/Bundle/index.browser.min.js
     in html (head or body) -->
<script src="[local location of the bundle]/index.browser.min.js"></script>
<script>
  const DateX = window.DateX;
  // delete from global namespace if you wish
  delete window.DateX;
</script>
```