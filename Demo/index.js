/* region intialize/start */
const isDev = location.host.startsWith(`dev.`);
const devMini = t => t ? `../Bundle/index.esm.min.js` : `../index.esm.js`;
const mini4Test = false;
import $ from "https://kooiinc.github.io/JQL/Bundle/jql.min.js";
if (!/stackblitz/i.test(location)) { console.clear(); }
const $D = isDev
  ? (await import(devMini(mini4Test))).default
  : (await import(devMini(false))).default;
const { log:print, logTop } = logFactory(true);
const debug = false;
window.$D = $D;

if (isDev) {
  document.title = `##DEV## ${document.title}`;
  $(`link[rel="icon"]`).replaceWith($.LINK.prop({href: `./demoDevIcon.png`, rel: `icon`}));
}

$(`<div class="spacer"></div>`);
$(`<div class="container">`).append($(`#log2screen`));
logTop(`!!
    <a class="gitLink" href="//github.com/KooiInc/es-date-fiddler">
      <img src="//github.githubassets.com/favicons/favicon.png" class="gitLink" alt="github icon">Back to repository @Github
    </a>`);
styleIt();
demoNdTest();
createContent();
/* endregion intialize/start */

/* region demo */
function demoNdTest() {
  /* region init */
  const methodSignatures = Object.entries($D.describe)
    .map( ([mName, signature]) => `<li><b>${mName}</b> (${signature})`)
    .join(``);
  // noinspection RegExpRepeatedSpace
  const customExtensionsCode = ( theCode => theCode
    .trim()
    .slice(theCode.indexOf(`\n`), -1)
    .replace(/DateFiddlerFactory_js_1\.default/g, `$D`) //<= stackblitz quirk
    .replace(/\n  /g, `\n` )
    .trim() )( String(extendHelper) );
  const toCode = (str, block) =>
    `<code${block ? ` class="codeblock"` : ``}>${
      str.replace(/^\s+(?=\b|(\/\/))/gm, ``)}</code>`;
  const yn = (tf) => (tf ? `Yep` : `Nope`);
  const toJSON = (obj, format) => format ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  window.DX = $D;
  const d1 = $D({ locale: `en-US`, timeZone: `US/Pacific` });
  const d2 = d1.cloneLocal;
  const d3 = $D(new Date(200, 2, 18, 12, 0, 30));
  print(
    `!!<h1>Demo for es-date-fiddler</h1>`,
    `!!<h2>a proxy to extend and make working with ES <code>Date</code> somewhat easier</h3>` );
  
  print(`!!<h3 id="inits">Initialization</h3>
  <div>The datefiddler library by default delivers an enhanced ES-Date constructor.</div>
  <div>Instances created with this constructor are <i><b>locale aware</b></i>.
  So when you create an instance with a timeZone different from yours,
  getting the hour from it will show the hour value within that timeZone.
  In the examples you can see it in action.</div>`);
  print(
    `!!` +
    toCode(`// Constructor imported as $D (import $D from "[location of module]")
    // note: the IANA time zone identifier for US/Pacific is America/Los_Angeles
    const d1 = $D({ locale: \`en-US\`, timeZone: \`US/Pacific\` });
    const d2 = d1.cloneLocal; // <= clone with default (your) locale
    const d3 = $D(new Date(200, 2, 18, 12, 0, 30));`, true) );
  print(
    `${
      toCode(`d1.local`)} => ${
      d1.local} (${toCode(`d1.timeZone`)}: ${d1.timeZone})<br>${
      toCode(`d1.dateStr`)} => ${d1.dateStr} <br>${
      toCode(`d1.timeStr()`)} => ${d1.timeStr()}<br>
      ${toCode(`d1.hour`)} => ${d1.hour}<br>
      ${toCode(`d1.timeDiffToHere`)} (time difference to local date/time): ${d1.timeDiffToHere}`
  );
  print(`${toCode(`d2.local`)} => ${d2.local} (${toCode(`d2.timeZone`)} => ${d2.timeZone})<br>
      ${toCode(`d2.dateStr`)} => ${d2.dateStr}<br>
      ${toCode(`d2.timeStr(true)`)} => ${d2.timeStr(true)}<br>
      ${toCode(`d2.hour`)} => ${d2.hour}<br>
      ${toCode(`d2.timeDiffToHere`)} (time difference to local date/time): ${d2.timeDiffToHere}` );
  print(`${toCode(`d3.local`)} => ${
    d3.local}<br>${toCode(`d3.dateStr`)} => ${
    d3.dateStr} (default (your) timeZone; ${toCode(`d3.timeZone`)} => ${
    d3.locale?.timeZone})<br>${toCode(`d3.timeStr()`)} => ${d3.timeStr()}`
  );
  /* endregion init  */
  
  /* region constructor */
  print(`!!<h3 id="constructor" class="quoted">Constructor</h3>
    <div>The constructor (here <code>$D</code>) has the signature:</div>
    <p><code>$D([dateOrLocale: Date | string | Array[Number] | {locale, timeZone}], [localeInfo: {locale, timeZone}])</code></p>
    <ul class="sub">
      <li><code>dateOrLocale</code> can be a regular Date (<code>new Date(...)</code>), a (valid)
      date string (<code>\`2022/07/18\`</code>), an array of Number or an Object with locale information
      (one of or both, e.g. <code>{locale: \`en-CA\`, timeZone: \`America/Toronto\`}</code>).
      When no date can be inferred from it, the current date ('now')  will be the instances'
      Date. If it's an Object the current date with the locale parameters from the Object
      (if valid) will be the instances' Date.</li>
      <li><code>localeInfo</code> When the first parameter is a Date or a date string, the second
        parameter can be used to associate locale information with that Date (see
        <span data-target="#locale">Locale</span>).</li>
    </ul><br><b>Examples</b>`);
  print(`${toCode(`$D(\`hello\`).ISO`)}
    <p>=> invalid date string returns <i>now</i>: ${$D(`hello`).ISO}</p>`);
  print(`${toCode(`$D(\`2012/12/12 00:00:00\`).ISO`)}
    <p>=> string converted to: ${$D(`2012/12/12 00:00:00`).ISO}</p>`);
  print(`${toCode(`$D().ISO`)}
    <p>=> no parameters returns <i>now</i>: ${$D().ISO}</p>`);
  print(`${toCode(`$D({locale: 'fr-FR', timeZone: 'Europe/Paris' }).local`)}
    <p>=> <i>now</i> with locale parameters: ${
    $D({ locale: 'fr-FR', timeZone: 'Europe/Paris' }).local}</p>`);
  const frDate = $D('2020/03/18 17:00', {
    locale: 'fr-FR',
    timeZone: 'Europe/Paris',
  });
  const frDateFormatted = frDate.format('WD d MM yyyy hh:mmi');
  print(`${toCode(
    `const frDate = $D('2020/03/18 17:00', { locale: 'fr-FR', timeZone: 'Europe/Paris' });
    const frDateFormatted = frDate.format('WD d MM yyyy hh:mmi')`, true )}
    <p>=> Instance with locale parameters formatted: ${frDateFormatted}</p>`);
  /* endregion constructor */
  
  /* region extensions */
  print(`!!<h3 id="customprops">Extension getters / setters</h3>
    <p>See also: <span data-target="#allNames">List of all getters/setters</span></p>`);
  const now = $D();
  const y2000 = now.clone;
  y2000.date = { year: 2000 };
  print(`!!` + toCode( `
    const now = $D();
    const y2000 = now.clone;
    y2000.date = { year: 2000 };`, true ) );
  print(`${toCode(`y2000.local`)} => ${y2000.local}`);
  print(`${toCode(`y2000.year`)} => ${y2000.year}`);
  print(`${toCode(`y2000.daysInMonth`)} => ${y2000.monthName} ${y2000.year} has ${
    y2000.daysInMonth} days` );
  print(`${toCode(`now.isLeapYear`)} => Is this year (${now.year}) is a leap year? ${yn(now.isLeapYear)}` );
  print(`${toCode(`y2000.isLeapYear`)} => Is year ${y2000.year} a leap year? ${yn(y2000.isLeapYear)}`);
  print(`<code>y2000.timeStr()</code> => ${y2000.timeStr()}`);
  print(`<code>y2000.timeStr(true)</code> => ${y2000.timeStr(true)}`);
  print(`<code>y2000.hour</code> => ${y2000.hour}`);
  y2000.hour = 22;
  print(`<code>y2000.hour = 22;</code><p>${toCode(`y2000.hour`)} => ${y2000.hour}</p>`);
  print(`${toCode(`y2000.monthName`)} => ${y2000.monthName}`);
  print(`${toCode(`y2000.weekDay`)} => ${y2000.weekDay}`);
  const chinese = y2000.clone;
  chinese.locale = { locale: `zh`, timeZone: `Asia/Shanghai` };
  print(`!!` + toCode(`const chinese = y2000.clone;
chinese.locale = { locale: \`zh\`, timeZone: \`Asia/Shanghai\` };`,  true));
  print(`${toCode(`chinese.local`)} => ${chinese.local}`);
  print(`${toCode(`chinese.monthName`)} => ${chinese.monthName}`);
  print(`${toCode(`chinese.weekDay`)} => ${chinese.weekDay}`);
  print(`${toCode(`chinese.timeDiffToHere`)} => ${chinese.timeDiffToHere}`);
  y2000.time = { hour: 12, minutes: 13, seconds: 0 };
  print(`${toCode(`y2000.time = {hour: 12, minutes: 13, seconds: 0};
    y2000.timeStr; //=> ${y2000.timeStr(true)}
    // NOTE
    y2000.seconds = 125; //=> y2000.timeStr(true) now ${(() => {
    y2000.seconds = 125; return y2000.timeStr(true);})()}
    y2000.time = {hour: 25, minutes: 3, seconds: 122}; //=> y2000.local now ${
    (() => {y2000.time = {hour: 25, minutes: 3, seconds: 122}; return y2000.local;})() } `, true)}` );
  print(`<code>y2000.minutes</code> => ${y2000.minutes}`);
  print(`${toCode(`y2000.time`)} => [${y2000.time}]`);
  print(`${toCode(`$D.now.firstWeekday().format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D.now
    .firstWeekday()
    .format(`WD yyyy/mm/dd  hh:mmi:ss`)}`);
  print(`${toCode(`$D.now.firstWeekday({sunday: true}).format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D.now
    .firstWeekday({sunday: true})
    .format(`WD yyyy/mm/dd  hh:mmi:ss`)}`);
  print(`${toCode(`$D(\`2023/12/31 22:00\`).firstWeekday().format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D(`2023/12/31 22:00`)
    .firstWeekday()
    .format(`WD yyyy/mm/dd  hh:mmi:ss`)}`);
  print(`${toCode(`$D(\`2023/12/31 22:00\`).firstWeekday({sunday: true}).format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D(`2023/12/31 22:00`)
    .firstWeekday({sunday: true})
    .format(`WD yyyy/mm/dd  hh:mmi:ss`)}`);
  print(`${toCode(`$D.now.add(\`2 days\`).firstWeekday().format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D.now
    .add(`2 days`)
    .firstWeekday()
    .format(`WD yyyy/mm/dd  hh:mmi:ss`)}`);
  print(`${toCode(`$D.now.add(\`12 days\`).firstWeekday().format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D.now
    .add(`12 days`)
    .firstWeekday()
    .format(`WD yyyy/mm/dd  hh:mmi:ss`)}`);
  print(`${toCode(`$D.now.firstWeekday({midnight: true}).format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D.now
    .firstWeekday({ midnight: true })
    .format(`WD yyyy/mm/dd hh:mmi:ss`)}`);
  print(`${toCode(`$D.now.firstWeekday({sunday: true}).format(\`WD yyyy/mm/dd\`)`)}
    <br>&nbsp;&nbsp;=> ${$D.now
    .firstWeekday({ sunday: true })
    .format(`WD yyyy/mm/dd`)}`);
  print(`${toCode(`$D.now.next(\`fri\`).format(\`WD yyyy/mm/dd\`)`)}
    <br>&nbsp;&nbsp;=> ${$D.now.next(`fri`).format(`WD yyyy/mm/dd`)}`);
  print(`${toCode(`$D.now.previous(\`fri\`).format(\`WD yyyy/mm/dd\`)`)}
    <br>&nbsp;&nbsp;=> ${$D.now.previous(`fri`).format(`WD yyyy/mm/dd`)}`);
  print(`${toCode(`$D(\`2003/11/01 00:30:00\`).previous(\`tue\`).format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D(`2003/11/01 00:30:00`)
    .previous(`tue`)
    .format(`WD yyyy/mm/dd hh:mmi:ss`)}`);
  print(`${toCode(
    `$D(\`2003/11/01 00:30:00\`).previous(\`tue\`, {midnight: true}).format(\`WD yyyy/mm/dd hh:mmi:ss\`)`)}
    <br>&nbsp;&nbsp;=> ${$D(`2003/11/01 00:30:00`)
    .previous(`tue`, { midnight: true })
    .format(`WD yyyy/mm/dd hh:mmi:ss`)}`);
  /* endregion  extensions */
  
  /* region extend */
  extendHelper();
  print(`!!<h3 id="extendCustom">Utilities: add custom extensions to the constructor</h3>
    <div>Additional extension properties/methods can be created using</div>
      <p><code>$D.extendWith({name: string, root: false,
        fn: Function, isMethod: boolean, proxifyResult: boolean})</code>.</p>
      <ul class="sub"><li><code>fn: Function</code>: the function to use. The function should at least have one parameter,
        that being the date value of the instance. By default the extension function is added as <i>getter</i>
        (<code>isMethod</code> false). When <code>isMethod</code> is true, the function is considered (and callable as)
        a getter <i>method</i> and can receive parameters (<code>[instance][name](dateValue, ...args)</code>).</li>
      <li><code>root: boolean</code> When true <code>fn</code> is added as method to the <code>$D</code> <i>constructor</i>.
        When called the extension method returns a <code>$D</code> instance when its return value is an actual
        Date instance (so, when <code>fn</code> returns a Date instance).<br>
        <b>Note</b>: with <code>root: true</code> you do not need the date as the minimal parameter. The
        <code>isMethod</code> and <code>proxifyResult</code> are ignored.</li>
      <li><code>isMethod: boolean</code> see <code>fn</code></li>
      <li><code>proxifyResult: boolean</code> When true <i>and</i> <code>fn</code> returns the date as <code>$D</code>
        instance, which enables chaining. False by default.</li></ul>
      <p><b>Note</b>: when <code>fn</code> does <i>not</i> return a Date, for either root or instance extensions
        <code>proxyResult: true</code> will return an instance with the current Date. That may not
        be what you expect.</p>`);
  print(`!!<code class="codeblock">${customExtensionsCode}</code>`);
  print(`<code>$D().add(\`1 day\`).isTodayOrLaterThen($D());</code> => ${$D()
    .add(`1 day`)
    .isTodayOrLaterThen($D())}<br>
  <code>$D().add(\`-1 day\`).isTodayOrLaterThen($D());</code> => ${$D()
    .add(`-1 day`)
    .isTodayOrLaterThen($D())}<br>
  <code>$D().utcDistanceHours</code> => ${$D().utcDistanceHours}<br>
  <code>$D().relocate({locale: \`gmt\`, timeZone: \`Europe/Greenwich\`}).utcDistanceHours</code> => ${
    $D().relocate({ locale: `gmt`, timeZone: `utc` }).utcDistanceHours}<br>
  <code>$D().relocate({timeZone: \`America/New_York\`}).utcDistanceHours</code> => ${
    $D().relocate({ locale: `en-US`, timeZone: `America/New_York` }).utcDistanceHours}<br>
  <code>$D().midNight.local</code> => ${$D().midNight.local}<br>
  <code>$D(\`2022/06/01\`).daysUntil($D(\`2023/06/01\`))</code> => ${
    $D(`2022/06/01`).daysUntil($D(`2023/06/01`))}<br>
  <code>$D(\`2023/06/01\`).daysUntil($D(\`2029/06/01\`))</code> => ${
    $D(`2023/06/01`).daysUntil($D(`2029/06/01`))}<br>
  <code>$D(\`2024/06/01\`).daysUntil($D(\`2023/06/01\`))</code> => ${
    $D(`2024/06/01`).daysUntil($D(`2023/06/01`), false)}
    (<b>Note</b>: Start date > end date)<br>
  <code>$D(\`2022/06/01\`).daysUntil($D(\`2023/06/01\`), false)</code> => ${
    $D(`2022/06/01`).daysUntil($D(`2023/06/01`), false)}<br>
  <code>$D.fromExif(\`2022:06:01 22:05:07\`).local</code> => ${
    $D.fromExif(`2022:06:01 22:05:07`).local}`);
  
  /* endregion extend */
  
  /* region locale */
  const yourZone = Intl.DateTimeFormat().resolvedOptions();
  print(`!!<h3 id="locale">Locale</h3>`);
  print(`!!<div>
        <p>With <code>$D</code> you can associate a <i>locale</i> and/or a <i>timeZone</i>
          with the instance</p>
        <b>Notes</b><ul class="decimal">
        <li>As long as <code>[instance].locale</code> is not set, the <code>$D</code> instance
          Date is associated with your locale and timeZone (like a regular <code>Date instance</code>).
          Your locale and timeZone are currently <code>{locale: ${yourZone.locale}, timeZone: ${
    yourZone.timeZone}}</code>).</li>
        <li>when associated with a <code>$D</code> instance the locale/timeZone provided will be validated.
        If the validition fails, an error is logged to the console, and the instances' locale and timeZone will be
        reverted to your locale and timeZone.</li>
        <li>The locale/timeZone information is used within reporting methods/getters
        (e.g. <code>[instance].timeStr</code>).</li>
        <li>To retrieve date/time values from an instance in a different locale/timeZone clone
          <i>within your time zone</i>, clone it using <code>[instance].cloneLocal</code>
          - it creates an instance clone within your timeZone.</li>
        <li><b>Note</b>: you can check the locale/timeZone information of the examples hereafter
        @<a target="_blank" href="https://time.is/">time.is</a></li></ul>
        <p><br>There are several ways to associate (and make use of) locale information
        with a <code>$D</code> instance. Here are some examples.</p>
      </div>`);
  
  const d2German = d2.clone;
  d2German.locale = { locale: `de-DE`, timeZone: `Europe/Berlin` };
  const d2Dutch = d2.clone.relocate({
    locale: `nl-NL`,
    timeZone: `Europe/Amsterdam`,
  });
  const todayAustralia = $D({ timeZone: 'Australia/Darwin', locale: 'en-AU' });
  const nwZealandTomorrow = $D(new Date(), {
    timeZone: 'Pacific/Auckland',
    locale: 'en-NZ',
  }).tomorrow;
  const invalidLocale = $D({ locale: 'somewhere' });
  const invalidTimezone = $D({ timeZone: 'somewhere' });
  const invalidLocaleData = $D({ locale: 'somewhere', timeZone: 'somehow' });
  print(
    `!!` +
    toCode(
      `const d2German = d2.clone;
    d2German.locale = { locale: \`de-DE\`, timeZone: \`Europe/Berlin\` };
    const d2Dutch = d2.clone.relocate({ locale: \`nl-NL\`, timeZone: \`Europe/Amsterdam\` });
    const toDayAustralia = $D({timeZone: 'Australia/Darwin', locale: 'en-AU'});
    const nwZealandTomorrow = $D(new Date(), {timeZone: 'Pacific/Auckland', locale: 'en-NZ'}).tomorrow;
    const invalidLocale = $D({locale: 'somewhere'});
    const invalidTimezone = $D({timeZone: 'somewhere'});
    const invalidLocaleData = $D({locale: 'somewhere', timeZone: 'somehow'});`,
      true
    )
  );
  print(toCode(`d2German.local`) + ` => ${d2German.local}`);
  print(toCode(`d2German.dateStr`) + ` => ${d2German.dateStr}`);
  print(`!!<div><b>Note</b>: You can retrieve a date string as ISO 8601 date string using the <code>dateISOStr</code> getter
    <br>${toCode(`d2German.dateISOStr`)} => ${d2German.dateISOStr}`);
  print(toCode(`d2Dutch.local`) + ` => ${d2Dutch.local}`);
  print(toCode(`d2Dutch.dateStr`) + ` => ${d2Dutch.dateStr}`);
  print(toCode(`todayAustralia.local`) + ` => ${todayAustralia.local}`);
  print(toCode(`todayAustralia.dateStr`) + ` => ${todayAustralia.dateStr}`);
  print(toCode(`nwZealandTomorrow.local`) + ` => ${nwZealandTomorrow.local}`);
  print(toCode(`nwZealandTomorrow.dateStr`) + ` => ${nwZealandTomorrow.dateStr}`);
  print(toCode(`nwZealandTomorrow.timeZone`) +` => ${nwZealandTomorrow.timeZone}`);
  print(toCode(`nwZealandTomorrow.cloneLocal.local`) + ` => ${
    nwZealandTomorrow.cloneLocal.local} (<code>nwZealandTomorrow</code> in your locale/timeZone)`);
  print(
    toCode(`$D().relocate({timeZone: 'Australia/Darwin'}).timeStr()`) +
    ` => ${$D()
      .relocate({ timeZone: 'Australia/Darwin' })
      .timeStr()}`);
  print(toCode(`$D().timeZone`) +` (your local time zone) => ${$D().timeZone}`);
  print(toCode(`d2German.removeLocale.local`) + ` => ${d2German.removeLocale.local}`);
  print(toCode(`d2German.locale`) + ` => ${d2German.removeLocale.locale}`);
  print(toCode(`invalidLocale.dateStr`) + ` => ${invalidLocale.dateStr}`);
  print(toCode(`invalidLocale.local`) + ` => ${invalidLocale.local}`);
  print(toCode(`invalidTimezone.locale`) + ` => ${toJSON(invalidTimezone.locale)}`);
  print(toCode(`invalidTimezone.local`) + ` => ${invalidTimezone.local}`);
  print(toCode(`invalidLocaleData.locale`) + ` => ${toJSON(invalidLocaleData.locale)}`);
  print(toCode(`invalidLocaleData.local`) + ` => ${invalidLocaleData.local}`);
  
  print(`<div><b>Note</b>: the <code>hasDST</code> getter answers the question if
      Daylight Saving Time is used within the associated time zone</div>
      ${toCode(`nwZealandTomorrow.hasDST`)} => ${nwZealandTomorrow.hasDST}`);
  print(toCode(`$D().relocate({timeZone: 'Australia/Darwin'}).hasDST`) +
    ` => ${$D().relocate({ timeZone: 'Australia/Darwin' }).hasDST}`);
  print(toCode(`d2Dutch.hasDST`) + ` => ${d2Dutch.hasDST}`);
  /* endregion locale */
  
  /* region formatting */
  print(`!!<h3 id="formatting">Formatting (see <a target="_blank" href="https://github.com/KooiInc/dateformat">GitHub</a>)</h3>`);
  print(`!!<div><b>Syntax</b>: ${toCode(`[$D].format(templateString:string, [otherOptions:string])`)}`);
  print(`!!<div><b>Note</b>: formatting uses either<ul class="decimal">
      <li>the locale/timeZone of its <code>$D</code> instance (no second parameter),</li>
      <li>the given locale/timeZone from its second parameter,</li>
      <li>the default (your) locale (no locale set and no second parameter), or</li>
      <li>the default (your) locale (locale set, but second parameter explicitly <code>undefined</code>)</li>
    </ul></div>`);
  
  d1.relocate({ locale: 'pl-PL', timeZone: 'Europe/Warsaw' });
  print(`!!` + toCode(`d1.relocate({locale: 'pl-PL', timeZone: 'Europe/Warsaw'});`));
  print(`${toCode(`d1.format(\`{1. d1 with instance locale:} &lt;i>&ltb>WD MM d yyyy hh:mmi&lt/b>&lt;/i>\`)}`)}
    <p>=> ${d1.format(`{1. d1 with instance locale:} <i><b>WD d MM yyyy hh:mmi</b></i>`)}`);
  print(`${toCode(`d1.format(\`{2. d1 formatted /w second parameter:} &lt;i>&ltb>(WD) d MM yyyy (hh:mmi:ss)&lt/b>&lt/i>\`, <b><i>'l:fr-FR'</i></b>)`)}
    <p>=> ${d1.format(
    `{2. d1 formatted /w second parameter:} <i><b>(WD) d MM yyyy (hh:mmi:ss)</b></i>`,
    'l:fr-FR'
  )}</p>`);
  print(`${toCode(`$D().format(\`{3. new instance default (your) locale:} &lt;i>&ltb>(WD) d MM yyyy (hh:mmi:ss~dp)&lt/b>&lt;/i>\`)`)}
    <p>=> ${$D().format(`{3. new instance default (your) locale:} <i><b>(WD) d MM yyyy (hh:mmi:ss~dp)</b></i>`)}</p>`);
  print(`${toCode(`d1.format(\`{4. d1 default (your) locale:} &lt;i>&ltb>(WD) d MM yyyy (hh:mmi:ss~dp)&lt/b>&lt;/i>\`, <b><i>undefined</i></b>)`)}
    <p>=> ${d1.format(`{4. d1 default (your) your locale:} <i><b>(WD) d MM yyyy (hh:mmi:ss~dp)</b></i>`, undefined)}</p>`);
  
  const d2French = d2.clone;
  d2French.locale = { locale: `fr-FR`, timeZone: `Europe/Paris` };
  const d2Brazil = d2French.clone;
  d2Brazil.locale = { locale: `pt-BR`, timeZone: `America/Fortaleza` };
  const d2EnFrancais = d2French.format(
    `{<i>En français</i>} => d MM yyyy (hh:mmi:ss)`
  );
  const d2BrazilFormatted = d2Brazil.format(`WD d MM yyyy hh:mmi:ss`);
  
  print(
    `!!` + toCode(`
    const d2French = d2.clone;
    const d2Brazil = d2French.clone;
    d2French.locale = {locale: \`fr-FR\`, timeZone: \`Europe/Paris\`};
    d2Brazil.locale = { locale: \`pt-BR\`, timeZone: \`America/Fortaleza\` };
    const d2EnFrancais = d2French
      .format(\`{&lt;i>En français&lt;/i>} => d MM yyyy (hh:mmi:ss)\` );
    const d2BrazilFormatted = d2Brazil.format(\`WD d MM yyyy hh:mmi:ss\)`, true) );
  print(`${toCode(`d2French.locale`)} => ${toJSON(d2French.locale)}`);
  print(`${toCode(`d2EnFrancais`)} => ${d2EnFrancais}`);
  print(`${toCode(`d2Brazil`)} => ${d2BrazilFormatted}`);
  
  const d1Clone = d1.clone;
  d1Clone.date = { year: 2000, month: 2 };
  const d1CloneFormattedUS = d1Clone.format(
    `{in Los Angeles (US): } WD MM d yyyy hh:mmi:ss dp`,
    `l:en-US, tz:America/Los_Angeles` );
  print(
    `!!${toCode(`
      const d1Clone = $D(d1.clone);
      d1Clone.date = { year: 2000, month: 2 };
      const d1CloneFormattedUS = dateFrom_d1.format(
          \`{in Los Angeles (US): } WD MM d yyyy hh:mmi:ss dp\`,
          \`l:en-US, tz:America/Los_Angeles\` );`, true)}`,
    `${toCode(`d1Clone.local`)} => ${d1Clone.local}`,
    `<code>d1CloneFormattedUS</code> => ${d1CloneFormattedUS}`
  );
  print(`!!<div><b>Note</b>: a <code>$D</code> instance with invalid locale data
    formats the <code>Date</code> using your locale:</div>`);
  print(toCode(`invalidTimezone.format('dd MM yyyy hh:mmi:ss dp')`) +
    `<p>=> ${invalidTimezone.format('dd MM yyyy hh:mmi:ss dp')}</p>`);
  
  /* endregion formatting */
  
  /* region clone date or time part */
  print(`!!<h3 id="cloning">Clone date- or time part</h3>`);
  print(`!!<div><b>Notes</b>:<ul class="decimal">
    <li>The locale of the original is also cloned.</li>
    <li>Time for the result may differ due to daylight saving times</li></ul></div>`);
  const initial = $D(new Date(`1999/05/31 14:22:44.142`), { locale: `en-GB` });
  const dateCloned = initial.cloneDateTo();
  const timeCloned = initial.cloneTimeTo();
  print(toCode(`const initial = $D(new Date(\`1999/05/31 14:22:44.142\`), { locale: \`en-GB\` });
  // Clone date/time of [initial] to current date
  const dateCloned = initial.cloneDateTo(new Date());
  const timeCloned = initial.cloneTimeTo(new Date());`, true));
  print(`${toCode(`initial.format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${initial.format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  print(`${toCode(`dateCloned.format('dd/mm/yyyy hh:mmi:ss')`)} => ${dateCloned.format('dd/mm/yyyy hh:mmi:ss')}`);
  print(`${toCode(`timeCloned.format('dd/mm/yyyy hh:mmi:ss')` )} => ${timeCloned.format('dd/mm/yyyy hh:mmi:ss')}`);
  print(`${toCode(`initial.cloneDateTo(new Date('2000/1/1 22:33:44')).format('dd/mm/yyyy hh:mmi:ss')`)} => ${
    initial
      .cloneDateTo(new Date('2000/1/1 22:33:44'))
      .format('dd/mm/yyyy hh:mmi:ss')}` );
  /* endregion clone date or time part */
  
  /* region arithmetic */
  const exampleDate = $D().relocate({
    locale: `en-GB`,
    timeZone: `Europe/London`,
  });
  const exampleDateFormatted = exampleDate
    .add(`5 days, 3 hours`)
    .nextYear.format(`{<code>exampleDate.add(\`5 days, 3 hours\`).nextYear</code>}:  MM d yyyy (hh:mmi:ss)` );
  print(`!!<h3 id="fiddling">Arithmetic (add/subtract to/from the Date at hand)</h3>
  <div><b>Notes</b></div><ul class="sub">
    <li>add/subtract and all aggregates like ${toCode(`.nextYear`)}, ${toCode(`.tomorrow`)} are
      <a target="_blank" href="https://www.tutorialspoint.com/method-chaining-in-javascript">chainable</a></li>
    <li>add/subtract and all aggregates are mutating, so <i>change</i> the Date</li>
  </ul>
  <code class="codeblock">const exampleDate = $D().relocate({locale: \`en-GB\`, timeZone: \`Europe/London\`});
const exampleDateFormatted = exampleDate.add(\`5 days, 3 hours\`).nextYear
  .format(\`{&lt;code>exampleDate.add(\`5 days, 3 hours\`).nextYear&lt;/code>}: MM d yyyy (hh:mmi:ss)\`);`);
  print(
    `${toCode(`exampleDateFormatted`)} => ${exampleDateFormatted}`,
    `${toCode(`exampleDate.clone.addYears(-10).local`)} => ${
      exampleDate.clone.addYears(-10).local}`);
  print(`${toCode(`exampleDate.subtract(\`5 days, 3 hours, 1 year\`).local`)} => ${
    exampleDate.subtract(`5 days, 3 hours, 1 year`).local}`);
  print(`${toCode(`$D().previousYear.nextMonth.local`)} => ${
    $D().previousYear.nextMonth.local}`);
  /* endregion arithmetic */
  
  /* region difference */
  print(`!!<h3 id="difference">Difference utility</h3>`);
  print(`${toCode(`$D().differenceFrom('1991/08/27 13:30').full`)}
   <p> => ${$D().differenceFrom('1991/08/27 13:30').full}</p>`);
  print(`${toCode(
    `$D().differenceFrom($D().subtract(\`5 days, 2 hours, 1 minute\`)).clean`
  )}
   <p> => ${
    $D().differenceFrom($D().subtract(`5 days, 2 hours, 1 minute`)).clean
  }
     (<b>Note</b>:<code>.clean</code> removes zero values) </p>`);
  const today = $D();
  const then = $D(`2023/07/16`);
  print(`!!${toCode(`const today = $D();
      const then = $D(\`2023/07/16\`);
      const diffFromThen = today.differenceFrom(then);`,
    true
  )}`);
  print(
    `!!${toCode(`diffFromThen`)} => <pre>${toJSON(
      today.differenceFrom(then),
      true
    )}</pre>`
  );
  print(`${toCode(`then.differenceFrom(then).full`)} ${
    toJSON( then.differenceFrom(then).full )}` );
  print(`${toCode(`then.differenceFrom(then).clean`)} ${
    then.differenceFrom(then).clean}` );
  /* endregion difference */
  
  /* region values */
  print(`!!<h3 id="values">Values</h3>
    <p>The <code>[instance].values</code> getter delivers an Object.<br>
    <code>[values].month</code> value is <i>not</i> zero based (so january is 1).<br>
    <code>[values].valuesArray[1]</code> (the month) value <i>is</i> zero based (so january is 0).<br>
    ${valuesHelper()}`);
  /* endregion values */
  
  /* region natives */
  print(`!!<h3 id="natives">Use native Date getters/setters</h3>
    <p>Because a <code>$D</code> instance is a actually a proxied <code>Date</code> instance,
    you can use all the native <code>Date</code>getters and/or setters.
    <code class="codeblock">${nativesHelper().join(`\n`)}</code>`);
  /* endregion natives */
  
  /* region now & validateLocale */
  print(`<h3 id="utilities">Utilities: now, validateLocale, dateFromString</h3>
    <div><code>now</code>, as you may have expected, delivers an instance from the current date.</div>
    <div>With <code>validateLocale</code> you can validate a <code>locale</code>, a <code>timeZone</code> label
    or both</div>
    <div>With <code>dateFromString</code> you can create an <code>ES-Date</code> from a String.
    <div>&nbsp;&nbsp;Syntax: <code>$D.dateFromString(dateString: string, [format: string (default: "ymd")])</code></div></div>`);
  print(`!!<b>$D.now</b>`)
  print(`${toCode(`$D.now.local`)} => ${$D.now.local}`);
  print(`${toCode(`$D.now.weekDay`)} => ${$D.now.weekDay}`);
  print(`${toCode(`$D.now.relocate({locale: "en-GB"}).format("{Hi! Time flies! It's} WD {again}")`)} => ${
    $D.now
      .relocate({ locale: 'en-GB' })
      .format("{Hi! Time flies! It's} WD {again}")}`);
  print(`!!<b>*$D.validateLocale</b>`)
  print(`${toCode(`$D.validateLocale({locale: "invalid!"})`)} => ${$D.validateLocale({ locale: 'invalid!' })}`);
  print(`${toCode(`$D.validateLocale({locale: "en-GB"})`)} => ${$D.validateLocale({locale: 'en-GB',})}`);
  print(`${toCode(`$D.validateLocale({timeZone: "ToTheMoon/AndBack"})`)} => ${$D.validateLocale({ timeZone: 'ToTheMoon/AndBack' })}`);
  print(`${toCode(`$D.validateLocale({timeZone: "Asia/Shanghai"})`)} => ${$D.validateLocale({ timeZone: 'Asia/Shanghai' })}`);
  print(`${toCode(`$D.validateLocale({locale: "nope", timeZone: "Asia/Shanghai"})`)} => ${
    $D.validateLocale({ locale: 'nope', timeZone: 'Asia/Shanghai' })}`);
  print(`${toCode(`$D.validateLocale({locale: "en", timeZone: "ToTheMoon/AndBack"})`)} => ${
    $D.validateLocale({ locale: 'en', timeZone: 'ToTheMoon/AndBack' })}`);
  print(`${toCode(`$D.validateLocale({locale: "en", timeZone: "Asia/Shanghai"})`)} => ${
    $D.validateLocale({ locale: 'en', timeZone: 'Asia/Shanghai' })}`);
  print(`!!<b>*$D.dateFromString</b>`)
  print(`${toCode(`$D.dateFromString("03-18-1991", "mdy").toLocaleString()`)} => ${
    $D.dateFromString("03-18-1991", "mdy").toLocaleString()}`);
  print(`${toCode(`$D.dateFromString("03-18-1991T22:30:05", "mdy").toLocaleString()`)} => ${
    $D.dateFromString("03-18-1991T22:30:05", "mdy").toLocaleString()}`);
  print(`${toCode(`$D.dateFromString("03-18-1991 03:30", "mdy").toLocaleString()`)} => ${
    $D.dateFromString("03-18-1991 03:30", "mdy").toLocaleString()}`);
  print(`!!<b>Invalid input for <code>$D.dateFromString</code> delivers invalid date</b>`);
  print(`${toCode(`$D.dateFromString("03-18-1991 invalid", "mdy").toLocaleString()`)} => ${
    $D.dateFromString("03-18-1991 invalid", "mdy").toLocaleString()} (see console)`);
  print(`${toCode(`$D.dateFromString("invalid", "mdy")?.toLocaleString()`)} => ${
    $D.dateFromString("invalid", "mdy")?.toLocaleString()} (see console)`);
  print(`${toCode(`$D.dateFromString("1991/03/18", "mdy")?.toLocaleString()`)} => ${
    $D.dateFromString("1991/03/18", "mdy")?.toLocaleString()} (see console)`);
  print(`!!<b>Use <code>$D.dateFromString</code> within $D constructor (note: invalid date will deliver <i>now</i></b>)`);
  print(`${toCode(`$D($D.dateFromString("03-18-1991T22:30:05", "mdy")).local`)} => ${
    $D($D.dateFromString("03-18-1991T22:30:05", "mdy")).local}`);
  print(`${toCode(`$D($D.dateFromString("03-18-1991T22:30:05", "<b style="color:red">dmy</b>")).local`)} => ${
    $D($D.dateFromString("03-18-1991T22:30:05", "dmy")).local} (see console)`);
  /* endregion now & validateLocale */
  
  /* region all extension names */
  print(`!!<h3 id="allNames">List of default instance extension getters/setters</h3>
      <p>You can retrieve the names of all getters/setters (properties/methods) using
      <code>Object.getOwnPropertyNames($D())</code>. When you added properties/methods
      with <code>$D.extendWith</code>, they will also show up in the list. Here are
      all <i>initial</i> (say: predefined) keys of any instance.</p>
      <div><b>Notes:</b></div>
      <ul class="sub">
        <li>A <i>mutating getter method</i> is called with parameter(s) and changes the instance date
        (e.g. <code>[instance].add(\`4 years\`)</code>)</li>
        <li>A <i>mutating getter</i> changes the instance date and retrieves it
        (e.g. <code>[instance].tomorrow</code>)</li>
        <li>A <i>getter method</i> is called with parameters(s) and retrieves a (calculated/extracted) value
        derived from the instance (e.g. <code>[instance].format(...)</code>)</li>
        <li>A <i>getter</i> retrieves a (calculated/extracted) value derived from the instance
          (e.g. <code>[instance].hasDST</code>)</li>
        <li>A <i>setter</i> can be used to <i>assign</i> a value (e.g. <code>[instance].hour = 4</code>).
          It (ofcourse) changes the instance date</li>
        <li>For mutating getter (methods) you can avoid mutating using
          a <i>clone</i> of the instance (<code>[instance].clone</code> or <code>[instance].cloneLocal</code>)</li>
        <li class="head"><h3>The list</b>: <code>[$D instance].[...]</code></h3></li>
        ${methodSignatures}</ul>`);
  
  /* endregion all extension names */
  
  /* region performance */
  if (!debug) {
    print(`!!<h3 id="perfomance">Performance</h3>`);
    print(checkPerformance(1_500));
  }
  /* endregion performance */
}
/* endregion demo */

/* region helpers */
function checkPerformance(nRuns) {
  const start = performance.now();
  for (let i = 0; i < nRuns; i += 1) {
    $D({ locale: `nl-NL`, timeZone: `Europe/Amsterdam` }).clone.add(`42 days`);
  }
  const perf = performance.now() - start;
  const perfPerTest = perf / nRuns / 1000;
  return `${nRuns.toLocaleString()} times
    <code>$D({locale: \`nl-NL\`, timeZone: \`Europe/Amsterdam\`}).clone.add(\`42 days\`)</code> ...
    <br>... took ${perf.toFixed(2)}</b> milliseconds (${perfPerTest.toFixed(
    6
  )} seconds / iteration).`;
}

function logFactory(formatJSON = true) {
  const logContainer = $(`<ul id="log2screen"/>`);
  const toJSON = (content) => tryJSON(content, formatJSON);
  const createItem = (t) =>
    $(`${t}`.startsWith(`!!`) ? `<li class="head">` : `<li>`);
  const logPosition = {
    top: logContainer.prepend,
    bottom: logContainer.append,
  };
  const cleanContent = (content) =>
    !$.IS(content, String, Number) ? toJSON(content) : `${content}`;
  const writeLogEntry = (content) =>
    createItem(content).append($(`<div>${content?.replace(/^!!/, ``)}</div>`));
  const logItem =
    (pos = `bottom`) =>
      (content) =>
        logPosition[pos](writeLogEntry(cleanContent(content)));
  return {
    log: (...txt) => txt.forEach(logItem()),
    logTop: (...txt) => txt.forEach(logItem(`top`)),
  };
}

function tryJSON(content, formatted) {
  try {
    return formatted
      ? `<pre>${JSON.stringify(content, null, 2)}</pre>`
      : JSON.stringify(content);
  } catch (err) {
    return `Some [Object object] can not be converted to JSON`;
  }
}

function codeBlocks2Code() {
  const codeReplacements = new Map([
    [`<`, `&lt;`],
    [`>`, `&gt;`],
    [`&`, (a) => `&amp;${a[1]}`],
    [`linebreak`, `\n<br>`],
    [`reducebreaks`, `\n\n`],
  ]);
  const allBlocks = $.nodes(`.codeblock`);
  $.nodes(`code:not(.codeblock)`).forEach((cd) => $(cd).addClass(`inline`));
  allBlocks.forEach((block) => {
    block = $(block);
    block.addClass(`language-javascript`).removeClass(`codeblock`);
    
    const pre = $.virtual(
      `<pre class="language-javascript line-numbers">${block.HTML.get(1)
        .trim()
        .replace(/&[^lgtamp;]/g, codeReplacements.get(`&`))}</pre>`
    );
    block.replaceWith(pre);
  });
  return Prism.highlightAll();
}

function createContent() {
  $(`.loading`).remove();
  codeBlocks2Code();
  const container = $.node(`.container`);
  $.delegate(`click`, `h3[id]`, () => {
    container.scrollTo(0, 0);
  });
  $.delegate(`click`, `[data-target]`, (evt) => {
    const target = $(evt.target.dataset.target);
    container.scrollTo(
      0,
      container.scrollTop + Math.round(target.dimensions.top) - 12
    );
  });
  const contentDiv = $(
    `<div class="content" id="content"><h3>Content</h3><ul></ul></div>`,
    $(`#inits`),
    $.at.BeforeBegin
  );
  const ul = contentDiv.find$(`ul`);
  $(`h3[id]`).each((h3) => {
    const header = $(h3).duplicate();
    const doQuote = header.hasClass(`quoted`) ? ` class="quoted"` : ``;
    header.find$(`a`).remove();
    const headerText = header.html();
    ul.append(
      `<li><div ${doQuote} class="contentDiv" data-target="h3#${h3.id}">${headerText.replace(
        /\(.+\)/,
        ``
      )}</div></li>`
    );
    $(h3).prop(`title`, `Back to top`);
  });
  $(
    `<p><b>Note</b>: Use <code class="inline">$D</code> in the developer console to experiment with it</p>`,
    contentDiv,
    $.at.AfterEnd
  );
  $.editCssRule(`.bottomSpace { height: ${container.clientHeight}px; }`);
  $(`#log2screen`).afterMe(`<div class="bottomSpace"></div>`);
}

function valuesHelper() {
  const now = $D.now;
  const japan = now.clone.relocate({ locale: `ja-JP`, timeZone: `Asia/Tokyo` });
  const tomorrow = $D(now.values.array).tomorrow;
  const nowVals = now.values;
  const japanVals = japan.values;
  const valArray4Display = str => str.replace(/(Array": )"(.+?)"/, (a,b,c) => `Array": ${c}`);
  nowVals.valuesArray = `[${now.values.valuesArray.join(`, `)}]`;
  japanVals.valuesArray = `[${japan.values.valuesArray.join(`, `)}]`;
  const valuesComment1 = `/* =>\n${valArray4Display(JSON.stringify(nowVals, null, 2))} */`;
  const valuesComment2 = `/* =>\n${valArray4Display(JSON.stringify(japanVals, null, 2))} */`;
  const cmmts = `year,month,date,hour,minutes,seconds,milliseconds`
    .split(`,`)
    .map( v => `// ${v}`);
  const vArr = now.values.valuesArray.map( (v, i) => `\n  ${`${v}`.padStart(8, ` `)}, ${cmmts[i]}` );
  const valuesArrayComment = `[${vArr.join(``)}\n  ]\n`;
  return `<code class="codeblock">${[
    `const now = $D.now;`,
    `const japan = now.clone.relocate({ locale: \`ja\`, timeZone: \`Asia/Tokyo\` });`,
    `now.values; ${valuesComment1}`,
    `now.values.month; //=> ${now.values.month}`,
    `// values are locale specific`,
    `japan.values; ${valuesComment2}`,
    `/* now.values.valuesArray represents => ${
      valuesArrayComment}\u2026 so one can use values.valuesArray to create a new instance */`,
    `const tomorrow = $D(now.values.valuesArray).tomorrow;`,
    `tomorrow.local; //=> ${tomorrow.local}`,
  ].join(`\n`)}</code>`;
}

function nativesHelper() {
  const currentDate = $D.now;
  return [
    `const currenDate = $D.now;`,
    `currentDate.getFullYear(); //=> ${currentDate.getFullYear()}`,
    `currentDate.toLocaleString(); //=> ${currentDate.toLocaleString()}`,
    `currentDate.toISOString(); //=> ${currentDate.toISOString()}`,
    `currentDate.toUTCString(); //=> ${currentDate.toUTCString()}`,
    `currentDate.getUTCHours(); //=> ${currentDate.getUTCHours()}`,
    `currentDate.getHours(); //=> ${currentDate.getHours()}`,
    `currentDate.toLocaleString(\`br-BR\`, {timeZone: \`America/Fortaleza\`}); //=> ${currentDate.toLocaleString(
      `br-BR`,
      { timeZone: `America/Fortaleza` }
    )}`,
    `currentDate.setHours(currentDate.hour - 3);`,
    `currentDate.getHours(); //=> ${
      (() => { currentDate.setHours(currentDate.hour - 3); return currentDate.getHours(); })() }`,
  ];
}

function extendHelper() {
  $D.extendWith({
    name: "isTodayOrLaterThen",
    fn: (dt, nextDt) => +dt >= +nextDt,
    isMethod: true,
  });
  
  // locale aware `getTimezoneOffset`
  $D.extendWith({
    name: "utcDistanceHours",
    fn: (dt) => {
      const timeZone = dt.localeInfo?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fmt = Intl.DateTimeFormat(
        "en-CA",
        { year: "numeric",  timeZone: timeZone, timeZoneName: "shortOffset", } );
      let distance = fmt.format(dt).match(/[+-]\d+$/);
      return !distance ? 0 : distance.shift();
    },
  });
  
  $D.extendWith({
    name: "utcDiff",
    fn: (dt) => {
      const dtClone = dt.clone;
      const tz = { timeZone: dtClone.locale?.timeZone || `utc` };
      const utcDiff = dt.timeZoneOffset() * -1;
      const local4TZ = dtClone
        .localize4TZ(tz.timeZone)
        .add(`${utcDiff} minutes, 1 second`);
      let diff = dt.differenceFrom(local4TZ);
      diff = diff.clean.startsWith("Dates") ? "no difference" : diff.clean;
      return `UTC difference for ${tz.timeZone}: ${diff}`;
    },
  });
  
  // Note: this getter method (daysUntil) already exists in $D instances.
  // It will be overwritten ...
  $D.extendWith({
    name: "daysUntil",
    fn: (dt, nextDate, reportString = true) => {
      let z = 0, containsLeapYear = false;
      [dt, nextDate] = dt > nextDate ? [nextDate, dt] : [dt, nextDate];
      const initial = dt.clone;
      nextDate = !nextDate.time ? $D(nextDate) : nextDate;
      dt.time = nextDate.time = { hour: 0, minutes: 0, seconds: 0, milliseconds: 0, };
      
      while (dt < nextDate) {
        dt.add("1 day");
        if (!containsLeapYear && dt.isLeapYear) { containsLeapYear = true; }
        z += 1;
      }
      
      return reportString
        ? `Days from ${initial.date.join(`/`)} until ${nextDate.date.join(`/`)}: ${z} ${
          containsLeapYear ? `(range contains leap year(s))` : ``}`
        : z;
    },
    isMethod: true,
  });
  
  // returns $D instance, so chainable
  $D.extendWith({
    name: "midNight",
    fn: (dt) => {
      dt.time = { hour: 0, minutes: 0, seconds: 0, milliseconds: 0 };
      return dt;
    },
    proxifyResult: true,
  });
  
  // root level
  $D.extendWith({
    name: "fromExif",
    root: true,
    fn: (dateString) => new Date(...dateString.split(/:|\s/).map((v, i) => (i === 1 ? +v - 1 : +v))),
  });
}
/* endregion helpers */

/* region styling */
function styleIt() {
  $.editCssRules(
    `body {
      margin: 0;
      font: normal 12px/17px verdana, arial;
    }`,
    `.container { position: absolute; inset: 0; overflow-y: auto; }`,
    `.head div, .head pre, pre {font-weight: normal; color: #777}`,
    `.head b[id], .head b.header {
      cursor: pointer;
      font-size: 1.2em;
      line-height: 1.5rem;
      display: inline-block;
      margin-top: 0.5rem
    }`,
    `@media (width > 1600px) {
      code.codeblock {
        width: 40vw;
      }
      ul#log2screen, #log2screen .content { max-width: 40vw; }
    }`,
    `@media (width < 1600px) {
      code.codeblock {
        width: 70vw;
      }
      ul#log2screen, #log2screen .content { max-width: 70vw; }
    }`,
    `@media (width < 1024px) {
      code.codeblock {
        width: 90vw;
      }
      ul#log2screen, #log2screen .content { max-width: 90vw; }
    }`,
    `code { background-color: revert; }`,
    `code.inline {
      color: green;
      background-color: #eee;
      padding: 2px;
      font-family: monospace;
    }`,
    `#log2screen h2 { line-height: 1.7rem; }`,
    `#log2screen li {
      listStyle: '\\2713';
      paddingLeft: 6px;
      margin: 0.5rem 0 0 -1.2rem;
    }`,
    `#log2screen li pre { margin-top: 0.2rem; }`,
    `.ws { white-space: pre-line; }`,
    `code.codeblock {
      display: block;
      background-color: rgb(255, 255, 248);
      border: 1px dotted rgb(153, 153, 153);
      color: rgb(81, 76, 125);
      margin: 1rem 0 0.5rem 0;
      font-weight: normal;
      white-space: pre-wrap;
      padding: 8px;
    }`,
    `code.codeblock .comment { color: rgb(169 156 156); }`,
    `ul#log2screen {margin: 0 auto;}`,
    `ul#log2screen li {margin-top: 0.8rem;}`,
    `ul#log2screen ul.sub { margin-left: -0.8rem; }`,
    `ul#log2screen ul.sub li { margin-top: 0.3rem; }`,
    `#log2screen li.head {
      list-style-type: none;
      font-weight: bold;
      margin-top: 0.8rem;
      margin-bottom: -0.2rem;
      font-family: revert;
    }`,
    `#log2screen .content ul {
      margin-left: initial;
      margin-top: -0.7rem;
    }`,
    `#log2screen .content {
      margin-top: -1rem;
      color: #000;
    }`,
    `a.gitLink img { vertical-align: middle; margin-right: 0.5rem;}`,
    `a {text-decoration:none; font-weight:bold;}`,
    `a:hover {text-decoration: underline;}`,
    `a[target]:before, a.internalLink:before, a.externalLink:before {
      color: rgba(0,0,238,0.7);
      font-size: 1.1rem;
      padding-right: 2px;
      vertical-align: baseline;
     }`,
    `a[target="_blank"]:before, a.externalLink:before {
      content: '\\2197';
     }`,
    `a[data-top]:before, a.internalLink:before, a[target="_top"]:before {
      content: '\\21BA';
     }`,
    `#log2screen .content ul li div[data-target]:hover,
     span[data-target] {
      color: blue;
    }`,
    `#log2screen .content {
      padding: 0.5rem;
      border-radius: 7px;
      box-shadow: -2px 1px 12px #aaa;
      margin-top: 1rem;
    }`,
    `#log2screen .content h3 {
      margin-top: 0;
      padding-left: 24px;
      color: red;
    }`,
    `[data-target] { cursor: pointer; }`,
    `#log2screen .content ul li {
      margin-left: -1.4rem;
      margin-top: auto;
      list-style: '\\27A4';
    }`,
    `#log2screen li div { line-height: 1.3rem;  }`,
    `li div p {
      margin-top: 0.3rem;
      line-height: 1.2rem;
    }`,
    `#log2screen .contentDiv { line-height: revert; }`,
    `#log2screen ul.decimal li {
      list-style-type: decimal;
      padding-left: initial;
      margin: 0.3rem 0px 0px -0.5rem;
    }`,
    `a[target]:before, a.internalLink:before, a.externalLink:before {
      color: rgba(0,0,238,0.7);
      font-size: 1.1rem;
      padding-right: 2px;
      vertical-align: baseline;
     }`,
    `a[target="_blank"]:before, a.externalLink:before {
      content: '\\2197';
     }`,
    `a[data-top]:before, a.internalLink:before, a[target="_top"]:before {
      content: '\\21BA';
     }`,
    `h3[id] {
      cursor: pointer;
      margin-top: 1.2rem;
    }`,
    `h3[id]:before {
      content: "🔝";
      font-size: 1.2rem;
      color: blue;
      padding-right: 3px;
    }`,
    `#log2screen .content ul {
      margin-left: initial;
      margin-top: -0.7rem;
      margin-bottom: 1rem;
    }`,
    `#log2screen .content ul li{
      margin-left: -1rem;
      margin-top: auto;
      padding-left: 0.4rem;
      list-style: '\\27A4';
    }`
  );
}
/* endregion styling */
