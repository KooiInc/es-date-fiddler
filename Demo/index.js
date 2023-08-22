/* region intialize/start */
const isDev = location.host.startsWith(`dev.`);
const devMini = t => t ? `../Bundle/index.esm.min.js` : `../index.esm.js`;
import $ from "https://kooiinc.github.io/JQL/Bundle/jql.min.js";
if (!/stackblitz/i.test(location)) { console.clear(); }
const $D = isDev
  ? (await import(devMini(false))).default
  : (await import("../Bundle/index.esm.min.js")).default;
const { log, logTop } = logFactory(true);
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
  const xtndFN4Display = (xtnd => xtnd.slice(xtnd.indexOf(`{`) + 2, -1).trim())(String(extendHelper));
  const dtst = $D();
  const yn = tf => tf ? `Yep` : `Nope`;
  const toJSON = (obj, format) => format ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  const toCode = (str, block) => `<code${block ? ` class="codeblock"` : ``}>${
    str.replace(/^\s+\b/gm, ``).replace(/^\s{3,}(\W)/gm, `  $1`)
      .replace(/^\s+</gm, `<`)}</code>`;
  window.DX = $D;
  const d1 = $D({ locale: `en-US`, timeZone: `US/Pacific` });
  const d2 = d1.clone;
  const d3 = $D(new Date(200, 2, 18, 12, 0, 30));
  d2.date = { year: 2022, date: 10, month: 12 };
  d2.locale = { locale: `nl-NL`, timeZone: `Europe/Amsterdam` };
  log(
    `!!<h1>Demo for es-date-fiddler</h1>`,
    `!!<h2>a proxy to extend and make working with ES <code>Date</code> somewhat easier</h3>`
  );

  log(`!!<h3 id="inits">Initialization</h3>`);
  log(`!!` + toCode(`// $D imported (import $D from "[location of module]")
    const d1 = $D({ locale: \`en-US\`, timeZone: \`US/Pacific\` });
    const d2 = d1.clone;
    const d3 = $D(new Date(200, 2, 18, 12, 0, 30));
// Note: month is *not* zero based here)
    d2.date = { year: 2022, date: 10, month: 12 };
    d2.locale = { locale: \`nl-NL\`, timeZone: \`Europe/Amsterdam\` };`, true) );

  log(`${toCode(`d1.local`)} (timeZone: ${d1.locale?.timeZone}) => ${d1.local}<br>${toCode(`d1.dateStr`)} => ${
    d1.dateStr}<br>${toCode(`d1.timeStr()`)} => ${d1.timeStr()}`);
  log(`${toCode(`d2.local`)} (timeZone: ${d2.locale?.timeZone}) => ${d2.local}<br>${toCode(`d2.dateStr`)} => ${
    d2.dateStr}<br>${toCode(`d2.timeStr(true)`)} => ${d2.timeStr(true)}`);
  log(`${toCode(`d3.local`)} (no timeZone) => ${d3.local}<br>${toCode(`d3.dateStr`)} => ${
    d3.dateStr}<br>${toCode(`d3.timeStr()`)} => ${d3.timeStr()}`)
  /* endregion init  */
  
  /* region constructor */
  log(`!!<h3 id="constructor" class="quoted">Constructor</h3>
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
  log(`${toCode(`$D(\`hello\`).ISO`)}
    <p>=> invalid date string returns <i>now</i>: ${$D(`hello`).ISO}</p>`);
  log(`${toCode(`$D(\`2012/12/12 00:00:00\`).ISO`)}
    <p>=> string converted to: ${$D(`2012/12/12 00:00:00`).ISO}</p>`);
  log(`${toCode(`$D().ISO`)}
    <p>=> no parameters returns <i>now</i>: ${$D().ISO}</p>`);
  log(`${toCode(`$D({locale: 'fr-FR', timeZone: 'Europe/Paris' }).local`)}
    <p>=> <i>now</i> with locale parameters: ${
    $D({locale: 'fr-FR', timeZone: 'Europe/Paris' }).local}</p>`);
  const frDate = $D('2020/03/18 17:00', {locale: 'fr-FR', timeZone: 'Europe/Paris' });
  const frDateFormatted = frDate.format('WD d MM yyyy hh:mmi');
  log(`${toCode(`const frDate = $D('2020/03/18 17:00', { locale: 'fr-FR', timeZone: 'Europe/Paris' });
    const frDateFormatted = frDate.format('WD d MM yyyy hh:mmi')`, true)}
    <p>=> Instance with locale parameters formatted: ${frDateFormatted}</p>`);
  /* endregion constructor */
  
  /* region extensions */
  log(`!!<h3 id="customprops">Extension getters / setters</h3>`);
  const now = $D();
  const y2000 = now.clone;
  y2000.date = { year: 2000 };
  log(`!!` + toCode(`
    const now = $D();
    const y2000 = now.clone;
    y2000.date = { year: 2000 };`, true));
  log(`${toCode(`y2000.local`)} => ${y2000.local}`);
  log(`${toCode(`y2000.year`)} => ${y2000.year}`);
  log(`${toCode(`y2000.daysInMonth`)} => ${
    y2000.monthName} ${y2000.year} has ${y2000.daysInMonth} days`);
  log(`${toCode(`now.isLeapYear`)} => Is this year (${now.year}) is a leap year? ${yn(now.isLeapYear)}`);
  log(`${toCode(`y2000.isLeapYear`)} => Is year ${y2000.year} a leap year? ${yn(y2000.isLeapYear)}`);
  log(`<code>y2000.timeStr()</code> => ${y2000.timeStr()}`);
  log(`<code>y2000.timeStr(true)</code> => ${y2000.timeStr(true)}`);
  log(`<code>y2000.hour</code> => ${y2000.hour}`);
  y2000.hour = 22;
  log(`<code>y2000.hour = 22;</code><p>${toCode(`y2000.hour`)} => ${y2000.hour}</p>`);
  log(`${toCode(`y2000.monthName`)} => ${y2000.monthName}`);
  log(`${toCode(`y2000.weekDay`)} => ${y2000.weekDay}`);
  const chinese = y2000.clone;
  chinese.locale = { locale:`zh-Hant`, timeZone: `Asia/Shanghai` };
  log(`!!` + toCode(`const chinese = y2000.clone;
  chinese.locale = { locale: \`zh-Hant\`, timeZone: \`Asia/Shanghai\` };`, true));
  log(`${toCode(`chinese.local`)} => ${chinese.local}`);
  log(`${toCode(`chinese.monthName`)} => ${chinese.monthName}`);
  log(`${toCode(`chinese.weekDay`)} => ${chinese.weekDay}`);
  y2000.time = {hour: 12, minutes: 13, seconds: 0};
  log(`${toCode(`y2000.time = {hour: 12, minutes: 13, seconds: 0};\ny2000.timeStr(true);`, true)}<p>=> ${
    y2000.timeStr(true)}</p>`);
  log(`<code>y2000.minutes</code> => ${y2000.minutes}`);
  log(`${toCode(`y2000.time`)} => [${y2000.time}]`);
  /* endregion  extensions */
  
  /* region extend */
  extendHelper();
  log(`!!<h3 id="extendCustom">Utilities: add extensions to the constructor dynamically</h3>
    <div>Additional extension properties/methods can be created using</div>
      <p><code>$D.extendWith({name: string, fn: Function, isMethod: boolean, proxifyResult: boolean})</code>.</p>
      <ul class="sub"><li><code>fn</code>: the function to use. The function should at least have one parameter,
      that being the date value of the instance. By default the extension function is added as property
      (<code>isMethod</code> false). When <code>isMethod</code> is true, the function
      is considered (and callable as) a method and can receive parameters (<code>[instance][name](dateValue, ...args)</code>).</li>
      <li><code>proxifyResult</code> When true <i>and</i> <code>fn</code> returns the instance date,
      enables chaining. False by default.
      <br><b>Note</b>: when <code>fn</code> returns the instance date, there's no need to set this value.</li></ul>`);
  log(`!!<code class="codeblock">${xtndFN4Display}</code>`);
  log(`<code>$D().add(\`1 day\`).isTodayOrLaterThen($D());</code> => ${$D().add(`1 day`).isTodayOrLaterThen($D())}<br>
  <code>$D().add(\`-1 day\`).isTodayOrLaterThen($D());</code> => ${$D().add(`-1 day`).isTodayOrLaterThen($D())}<br>
  <code>$D().utcDistanceHours</code> => ${$D().utcDistanceHours}<br>
  <code>$D().relocate({locale: \`gmt\`, timeZone: \`Europe/Greenwich\`}).utcDistanceHours</code> => ${$D().relocate({locale: `gmt`, timeZone: `utc`}).utcDistanceHours}<br>
  <code>$D().relocate({timeZone: \`America/New_York\`}).utcDistanceHours</code> => ${$D().relocate({locale: `en-US`, timeZone: `America/New_York`}).utcDistanceHours}<br>
  <code>$D().localeDiff(\`Pacific/Auckland\`)</code> => ${
    $D().localeDiff(`Pacific/Auckland`) }<br>
  <code>$D().localeDiff(\`America/New_York\`)</code> => ${
    $D().localeDiff(`America/New_York`) }<br>
  <code>$D.now.localeDiff(\`Asia/Calcutta\`)</code> => ${
    $D().localeDiff(`Asia/Calcutta`) }<br>
  <code>$D({timeZone: \`Asia/Calcutta\`}).localeDiff(\`America/New_York\`)</code> => ${
    $D({timeZone: `Asia/Calcutta`}).localeDiff(`America/New_York`) }<br>
  <code>$D().midNight.local</code> => ${$D().midNight.local}<br>
  <code>$D(\`2022/06/01\`).daysUntil($D(\`2023/06/01\`))</code> => ${$D(`2022/06/01`).daysUntil($D(`2023/06/01`))}<br>
  <code>$D(\`2023/06/01\`).daysUntil($D(\`2024/06/01\`))</code> => ${
    $D(`2023/06/01`).daysUntil($D(`2024/06/01`))}<br>
  <code>$D(\`2024/06/01\`).daysUntil($D(\`2023/06/01\`))</code> => ${
    $D(`2024/06/01`).daysUntil($D(`2023/06/01`), false)} (<b>Note</b>: Start date > end date)<br>
  <code>$D(\`2022/06/01\`).daysUntil($D(\`2023/06/01\`), false)</code> => ${
    $D(`2022/06/01`).daysUntil($D(`2023/06/01`), false)}<br>`);
  
  /* endregion extend */

  /* region locale */
  const yourZone = Intl.DateTimeFormat().resolvedOptions();
  log(`!!<h3 id="locale">Locale</h3>`);
  log(`!!<div>
        <p>With <code>$D</code> you can associate a <i>locale</i> and/or <i>timeZone</i>
          with its <code>Date</code></p>
        <b>Notes</b><ul class="decimal">
        <li>As long as <code>[instance].locale</code> is not set, the <code>$D</code> instance
          Date is associated with your locale (like a regular <code>Date instance</code>).
          Your locale is currently <code>{locale: ${yourZone.locale}, timeZone: ${
            yourZone.timeZone}}</code>).</li>
        <li>when associated with a <code>$D</code> instance the locale provided will be validated.
        If it is not valid, an error is logged to the console, and the instances' locale will be
        reverted to your locale.</li>
        <li>The locale information is also used with the <code>dateStr</code> property.
        If such information is available the string value returned will be in the instance dates'
        local format.</li>
        <li><b>Note</b>: you can check the locale information of the examples hereafter
        @<a target="_blank" href="https://time.is/">time.is</a></li></ul>
        <p><br>There are several ways to associate (and make use of) locale information
        with a <code>$D</code> instance. Here are some examples.</p>
      </div>`);

  const d2German = d2.clone;
  d2German.locale = { locale: `de-DE`, timeZone: `Europe/Berlin` };
  const d2Dutch = d2.clone.relocate({ locale: `nl-NL`, timeZone: `Europe/Amsterdam` } );
  const todayAustralia = $D({timeZone: 'Australia/Darwin', locale: 'en-AU'});
  const nwZealandTomorrow = $D(new Date(), {timeZone: 'Pacific/Auckland', locale: 'en-NZ'}).tomorrow;
  const invalidLocale = $D({locale: 'somewhere'});
  const invalidTimezone = $D({timeZone: 'somewhere'});
  const invalidLocaleData = $D({locale: 'somewhere', timeZone: 'somehow'});
  log(`!!` + toCode(`const d2German = d2.clone;
    d2German.locale = { locale: \`de-DE\`, timeZone: \`Europe/Berlin\` };
    const d2Dutch = d2.clone.relocate({ locale: \`nl-NL\`, timeZone: \`Europe/Amsterdam\` });
    const toDayAustralia = $D({timeZone: 'Australia/Darwin', locale: 'en-AU'});
    const nwZealandTomorrow = $D(new Date(), {timeZone: 'Pacific/Auckland', locale: 'en-NZ'}).tomorrow;
    const invalidLocale = $D({locale: 'somewhere'});
    const invalidTimezone = $D({timeZone: 'somewhere'});
    const invalidLocaleData = $D({locale: 'somewhere', timeZone: 'somehow'});`, true));
  log(toCode(`d2German.local`) + ` => ${d2German.local}`);
  log(toCode(`d2German.dateStr`) + ` => ${d2German.dateStr}`);
  log(`!!<div><b>Note</b>: You can retrieve a date string as ISO 8601 date string using the <code>dateISOStr</code> getter
    <br>${toCode(`d2German.dateISOStr`)} => ${d2German.dateISOStr}`);
  log(toCode(`d2Dutch.local`) + ` => ${d2Dutch.local}`);
  log(toCode(`d2Dutch.dateStr`) + ` => ${d2Dutch.dateStr}`);
  log(toCode(`todayAustralia.local`) + ` => ${todayAustralia.local}`);
  log(toCode(`todayAustralia.dateStr`) + ` => ${todayAustralia.dateStr}`);
  log(toCode(`nwZealandTomorrow.local`) + ` => ${nwZealandTomorrow.local}`);
  log(toCode(`nwZealandTomorrow.dateStr`) + ` => ${nwZealandTomorrow.dateStr}`);
  log(toCode(`nwZealandTomorrow.getTimezone`) + ` => ${nwZealandTomorrow.getTimezone}`);
  log(toCode(`$D().relocate({timeZone: 'Australia/Darwin'}).localizedDT.timeStr()`) + ` => ${
    $D().relocate({timeZone: 'Australia/Darwin'}).localizedDT.timeStr()}`);
  log(toCode(`$D().getTimezone`) + ` (your local time zone) => ${$D().getTimezone}`);
  log(toCode(`d2German.removeLocale.local`) + ` => ${d2German.removeLocale.local}`);
  log(toCode(`d2German.locale`) + ` => ${d2German.removeLocale.locale}`);
  log(toCode(`invalidLocale.dateStr`) + ` => ${invalidLocale.dateStr}`);
  log(toCode(`invalidLocale.local`) + ` => ${invalidLocale.local}`);
  log(toCode(`invalidTimezone.locale`) + ` => ${toJSON(invalidTimezone.locale)}`)
  log(toCode(`invalidTimezone.local`) + ` => ${invalidTimezone.local}`);
  log(toCode(`invalidLocaleData.locale`) + ` => ${toJSON(invalidLocaleData.locale)}`);
  log(toCode(`invalidLocaleData.local`) + ` => ${invalidLocaleData.local}`);

  log(`!!<div><b>Note</b>: the <code>hasDST</code> getter answers the question if
      Daylight Saving Time is used within the associated time zone</div>`);
  log(toCode(`nwZealandTomorrow.hasDST`) + ` => ${nwZealandTomorrow.hasDST}`);
  log(toCode(`$D().relocate({timeZone: 'Australia/Darwin'}).hasDST`) + ` => ${
    $D().relocate({timeZone: 'Australia/Darwin'}).hasDST}`);
  log(toCode(`d2Dutch.hasDST`) + ` => ${d2Dutch.hasDST}`);
  /* endregion locale */

  /* region formatting */
  log(`!!<h3 id="formatting">Formatting (see <a target="_blank" href="https://github.com/KooiInc/dateformat">GitHub</a>)</h3>`);
  log(`!!<div><b>Syntax</b>: ${toCode(`[$D].format(templateString:string, [otherOptions:string])`)}`);
  log(`!!<div><b>Note</b>: formatting uses either<ul class="decimal">
      <li>the locale/timeZone of its <code>$D</code> instance (no second parameter),</li>
      <li>the given locale/timeZone from its second parameter,</li>
      <li>the default (your) locale (no locale set and no second parameter), or</li>
      <li>the default (your) locale (locale set, but second parameter explicitly <code>undefined</code>)</li>
    </ul></div>`);

  d1.relocate({locale: 'pl-PL', timeZone: 'Europe/Warsaw'});
  log(`!!` + toCode(`d1.relocate({locale: 'pl-PL', timeZone: 'Europe/Warsaw'});`));
  log(`${toCode(`d1.format(\`{1. d1 with instance locale:} &lt;i>&ltb>WD MM d yyyy hh:mmi dp&lt/b>&lt;/i>\`)}`)}
    <p>=> ${d1.format(`{1. d1 with instance locale:} <i><b>WD d MM yyyy hh:mmi dp</b></i>`)}`);
  log(`${
    toCode(`d1.format(\`{2. d1 formatted /w second parameter:} &lt;i>&ltb>(WD) d MM yyyy (hh:mmi:ss)&lt/b>&lt/i>\`, <b><i>'l:fr-FR'</i></b>)`)}
    <p>=> ${ d1.format(`{2. d1 formatted /w second parameter:} <i><b>(WD) d MM yyyy (hh:mmi:ss)</b></i>`, 'l:fr-FR')}</p>` );
  log(`${
    toCode(`$D().format(\`{3. new instance default (your) locale:} &lt;i>&ltb>(WD) d MM yyyy (hh:mmi:ss dp)&lt/b>&lt;/i>\`)`)}
    <p>=> ${ $D().format(`{3. new instance default (your) locale:} <i><b>(WD) d MM yyyy (hh:mmi:ss dp)</b></i>`)}</p>` );
  log(`${
    toCode(`d1.format(\`{4. d1 default (your) locale:} &lt;i>&ltb>(WD) d MM yyyy (hh:mmi:ss dp)&lt/b>&lt;/i>\`, <b><i>undefined</i></b>)`)}
    <p>=> ${ d1.format(`{4. d1 default (your) your locale:} <i><b>(WD) d MM yyyy (hh:mmi:ss dp)</b></i>`, undefined)}</p>` );

  const d2French = d2.clone;
  d2French.locale = {locale: `fr-FR`, timeZone: `Europe/Paris`};
  const d2Brazil = d2French.clone;
  d2Brazil.locale = { locale: `pt-BR`, timeZone: `America/Fortaleza` };
  const d2EnFrancais = d2French.format(`{<i>En français</i>} => d MM yyyy (hh:mmi:ss)`);
  const d2BrazilFormatted = d2Brazil.format(`WD d MM yyyy hh:mmi:ss`);

  log(`!!` + toCode(`
    const d2French = d2.clone;
    const d2Brazil = d2French.clone;
    d2French.locale = {locale: \`fr-FR\`, timeZone: \`Europe/Paris\`};
    d2Brazil.locale = { locale: \`pt-BR\`, timeZone: \`America/Fortaleza\` };
    const d2EnFrancais = d2French
      .format(\`{&lt;i>En français&lt;/i>} => d MM yyyy (hh:mmi:ss)\` );
    const d2BrazilFormatted = d2Brazil.format(\`WD d MM yyyy hh:mmi:ss\)`, true));
  log(`${toCode(`d2French.locale`)} => ${toJSON(d2French.locale)}`);
  log(`${toCode(`d2EnFrancais`)} => ${d2EnFrancais}`);
  log(`${toCode(`d2Brazil`)} => ${d2BrazilFormatted}`);

  const d1Clone = d1.clone;
  d1Clone.date = { year: 2000, month: 2 };
  const d1CloneFormattedUS = d1Clone.format(
    `{in Los Angeles (US): }
      WD MM d yyyy hh:mmi:ss dp`,`l:en-US, tz:America/Los_Angeles`);
  log(`!!${toCode(`
      const d1Clone = $D(d1.clone);
      d1Clone.date = { year: 2000, month: 2 };
      const d1CloneFormattedUS = dateFrom_d1.format(
          \`{in Los Angeles (US): } WD MM d yyyy hh:mmi:ss dp\`,
          \`l:en-US, tz:America/Los_Angeles\` );`, true)}`,
    `${toCode(`d1Clone.local`)} => ${d1Clone.local}`,
    `<code>d1CloneFormattedUS</code> => ${d1CloneFormattedUS}`,);
  log(`!!<div><b>Note</b>: a <code>$D</code> instance with invalid locale data
    formats the <code>Date</code> using your locale:</div>`);
  log( toCode(`invalidTimezone.format('dd MM yyyy hh:mmi:ss dp')`) + `<p>=> ${
    invalidTimezone.format('dd MM yyyy hh:mmi:ss dp')}</p>` );

  /* endregion formatting */
  
  /* region clone date or time part */
  log(`!!<h3 id="cloning">Clone date- or time part</h3>`);
  log(`!!<div><b>Notes</b>:<ul class="decimal">
    <li>The locale of the original is also cloned.</li>
    <li>Time for the result may differ due to daylight saving times</li></ul></div>`);
  const initial = $D(new Date(`1999/05/31 14:22:44.142`), { locale: `en-GB` });
  const dateCloned = initial.cloneDateTo();
  const timeCloned = initial.cloneTimeTo();
  log(toCode(`const initial = $D(new Date(\`1999/05/31 14:22:44.142\`), { locale: \`en-GB\` });
  // Clone date/time of [initial] to current date
  const dateCloned = initial.cloneDateTo(new Date());
  const timeCloned = initial.cloneTimeTo(new Date());`, true));
  log(`${toCode(`initial.format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${initial.format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  log(`${toCode(`dateCloned.format('dd/mm/yyyy hh:mmi:ss')`)} => ${dateCloned.format('dd/mm/yyyy hh:mmi:ss')}`);
  log(`${toCode(`timeCloned.format('dd/mm/yyyy hh:mmi:ss')`)} => ${timeCloned.format('dd/mm/yyyy hh:mmi:ss')}`);
  log(`${toCode(`initial.cloneDateTo(new Date('2000/1/1 22:33:44')).format('dd/mm/yyyy hh:mmi:ss')`)} => ${
    initial.cloneDateTo(new Date('2000/1/1 22:33:44')).format('dd/mm/yyyy hh:mmi:ss')}`);
  /* endregion clone date or time part */

  /* region arithmetic */
  const exampleDate = $D().relocate({locale: `en-GB`, timeZone: `Europe/London`});
  const exampleDateFormatted = exampleDate.add(`5 days, 3 hours`).nextYear
    .format(`{<code>exampleDate.add(\`5 days, 3 hours\`).nextYear</code>}:  MM d yyyy (hh:mmi:ss)`);
  log(`!!<h3 id="fiddling">Arithmetic (add/subtract to/from the Date at hand)</h3>
  <div><b>Notes</b></div><ul class="sub">
    <li>add/subtract and all aggregates like ${toCode(`.nextYear`)}, ${toCode(`.tomorrow`)} are
      <a target="_blank" href="https://www.tutorialspoint.com/method-chaining-in-javascript">chainable</a></li>
    <li>add/subtract and all aggregates <i>change</i> the instance Date</li>
  </ul>
  <code class="codeblock">const exampleDate = $D().relocate({locale: \`en-GB\`, timeZone: \`Europe/London\`});
const exampleDateFormatted = exampleDate.add(\`5 days, 3 hours\`).nextYear
  .format(\`{&lt;code>exampleDate.add(\`5 days, 3 hours\`).nextYear&lt;/code>}: MM d yyyy (hh:mmi:ss)\`);`);
  log(
    `${toCode(`exampleDateFormatted`)} => ${exampleDateFormatted}`,
    `${toCode(`exampleDate.clone.addYears(-10).local`)} => ${exampleDate.clone.addYears(-10).local}`,
  );
  log(`${toCode(`exampleDate.subtract(\`5 days, 3 hours, 1 year\`).local`)} => ${
    exampleDate.subtract(`5 days, 3 hours, 1 year`).local}`);
  log(`${toCode(`$D().previousYear.nextMonth.local`)} => ${$D().previousYear.nextMonth.local}`);
  /* endregion arithmetic */
  
  /* region difference */
  log(`!!<h3 id="difference">Difference utility</h3>`);
  log(`${toCode(`$D().differenceFrom('1991/08/27 13:30').full`)}
   <p> => ${$D().differenceFrom('1991/08/27 13:30').full}</p>`);
  log(`${toCode(`$D().differenceFrom($D().subtract(\`5 days, 2 hours, 1 minute\`)).clean`)}
   <p> => ${
    $D().differenceFrom($D().subtract(`5 days, 2 hours, 1 minute`)).clean}
     (<b>Note</b>:<code>.clean</code> removes zero values) </p>`);
  const today = $D();
  const then = $D(`2023/07/16`);
  log(`!!${
    toCode(`const today = $D();
      const then = $D(\`2023/07/16\`);
      const diffFromThen = today.differenceFrom(then);`, true)}`);
  log(`!!${toCode(`diffFromThen`)} => <pre>${toJSON(today.differenceFrom(then), true)}</pre>`);
  log(`${toCode(`then.differenceFrom(then).full`)} ${toJSON(then.differenceFrom(then).full)}`);
  log(`${toCode(`then.differenceFrom(then).clean`)} ${then.differenceFrom(then).clean}`);
  /* endregion difference */

  /* region values */
  log(`!!<h3 id="values">Values</h3>
    <p>The <code>[instance].values(monthZeroBased: boolean)</code> getter method delivers
    an Object <code>{array, object}</code><br>
    By default the month value is <i>not</i> zero based (so january is 1).<br>
    Use <code>monthZeroBased = true</code> if you want to use the values for a new Date.</p>
    ${valuesHelper()}`);
  /* endregion values */
  
  /* region natives */
  log(`!!<h3 id="natives">Use native Date getters/setters</h3>
    <p>Most native getters/setters (e.g. <code>setFullYear</code> or <code>getFullYear</code>)
    are wrapped in extensions. Because a <code>$D</code> instance is a actually a
    proxied <code>Date</code> instance, you can also use the native getters and/or setters.
    <code class="codeblock">${nativesHelper().join(`\n`)}</code>`);
  /* endregion natives */
  
  /* region now & validateLocale */
  log(`<h3 id="utilities">Utilities: now, validateLocale</h3>
    <div><code>now</code>, as you may have expected, delivers an instance from the current date.</div>
    <div>With <code>validateLocale</code> you can validate a <code>locale</code>, a <code>timeZone</code> label
    or both</div>`);
  log(`${toCode(`$D.now.local`)} => ${$D.now.local}`);
  log(`${toCode(`$D.now.weekDay`)} => ${$D.now.weekDay}`);
  log(`${toCode(`$D.now.relocate({locale: "en-GB"}).format("{Hi! Time flies! It's} WD {again}")`)} => ${
    $D.now.relocate({locale: "en-GB"}).format("{Hi! Time flies! It's} WD {again}")}`);
  log(`${toCode(`$D.validateLocale({locale: "invalid!"})`)} => ${$D.validateLocale({locale: "invalid!"})}`);
  log(`${toCode(`$D.validateLocale({locale: "en-GB"})`)} => ${$D.validateLocale({locale: "en-GB"})}`);
  log(`${toCode(`$D.validateLocale({timeZone: "ToTheMoon/AndBack"})`)} => ${
    $D.validateLocale({timeZone: "ToTheMoon/AndBack"})}`);
  log(`${toCode(`$D.validateLocale({timeZone: "Asia/Shanghai"})`)} => ${
    $D.validateLocale({timeZone: "Asia/Shanghai"})}`);
  log(`${toCode(`$D.validateLocale({locale: "nope", timeZone: "Asia/Shanghai"})`)} => ${
    $D.validateLocale({locale: "nope", timeZone: "Asia/Shanghai"})}`);
  log(`${toCode(`$D.validateLocale({locale: "en", timeZone: "ToTheMoon/AndBack"})`)} => ${
    $D.validateLocale({locale: "en", timeZone: "ToTheMoon/AndBack"})}`);
  log(`${toCode(`$D.validateLocale({locale: "en", timeZone: "Asia/Shanghai"})`)} => ${
    $D.validateLocale({locale: "en", timeZone: "Asia/Shanghai"})}`);
  /* endregion now & validateLocale */
  
  /* region all extension names */
    log(`!!<h3 id="allNames">List of default instance extension getters/setters</h3>
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
        <li>A <i>getter method</i> is called with parameters(s) and retrieves a (calculated) value
        of the instance (e.g. <code>[instance].time(true)</code>)</li>
        <li>A <i>getter</i> retrieves a (calculated) value of the instance (e.g. <code>[instance].isDST</code>)</li>
        <li>A <i>setter and getter</i> either retrieves a value or can be used to <i>assign</i> a value
        (e.g. <code>[instance].hour = 4</code>)</li>
        ${getInitialExtensions()}</ul>`);
  /* endregion all extension names */
  
  /* region performance */
  log(`!!<h3 id="perfomance">Performance</h3>`);
  log(checkPerformance(1_500));
  /* endregion performance */
}
/* endregion demo */

/* region helpers */
function checkPerformance(nRuns) {
  const start = performance.now();
  for (let i = 0; i < nRuns; i += 1) {
    $D({locale: `nl-NL`, timeZone: `Europe/Amsterdam`}).clone.add(`42 days`);
  }
  const perf = performance.now() - start;
  const perfPerTest = perf/nRuns/1000;
  return `${nRuns.toLocaleString()} times
    <code>$D({locale: \`nl-NL\`, timeZone: \`Europe/Amsterdam\`}).clone.add(\`42 days\`)</code> ...
    <br>... took ${
    (perf).toFixed(2)}</b> milliseconds (${perfPerTest.toFixed(6)} seconds / iteration).`;
}

function logFactory(formatJSON = true) {
  const logContainer = $(`<ul id="log2screen"/>`);
  const toJSON = content => tryJSON(content, formatJSON);
  const createItem = t => $(`${t}`.startsWith(`!!`) ? `<li class="head">` : `<li>`);
  const logPosition = {top: logContainer.prepend, bottom: logContainer.append};
  const cleanContent = content => !$.IS(content, String, Number) ? toJSON(content) : `${content}`;
  const writeLogEntry = content => createItem(content).append( $(`<div>${content?.replace(/^!!/, ``)}</div>`) );
  const logItem = (pos = `bottom`) => content => logPosition[pos]( writeLogEntry(cleanContent(content)) );
  return {
    log: (...txt) => txt.forEach( logItem() ),
    logTop: (...txt) => txt.forEach( logItem(`top`) ), };
}

function tryJSON(content, formatted) {
  try { return formatted ? `<pre>${JSON.stringify(content, null, 2)}</pre>` : JSON.stringify(content); }
  catch(err) { return `Some [Object object] can not be converted to JSON`; }
}

function codeBlocks2Code() {
  const codeReplacements = new Map( [
    [`<`, `&lt;`],
    [`>`, `&gt;`],
    [`&`, a => `&amp;${a[1]}`],
    [`linebreak`, `\n<br>`],
    [`reducebreaks`, `\n\n`] ] );
  const allBlocks = $.nodes(`.codeblock`);
  $.nodes(`code:not(.codeblock)`).forEach( cd => $(cd).addClass(`inline`));
  allBlocks.forEach(block => {
    block = $(block);
    block.addClass(`language-javascript`).removeClass(`codeblock`);

    const pre = $.virtual(`<pre class="language-javascript line-numbers">${
      block.HTML.get(1).trim()
        .replace(/&[^lgtamp;]/g, codeReplacements.get(`&`))}</pre>`);
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
  $.delegate(`click`, `[data-target]`, evt => {
    const target = $(evt.target.dataset.target);
    container.scrollTo(0, container.scrollTop + Math.round(target.dimensions.top) - 12);
  });
  const contentDiv = $(
    `<div class="content" id="content"><h3>Content</h3><ul></ul></div>`,
    $(`#inits`),
    $.at.BeforeBegin );
  const ul = contentDiv.find$(`ul`);
  $(`h3[id]`).each(h3 => {
    const header = $(h3).duplicate();
    const doQuote = header.hasClass(`quoted`) ? ` class="quoted"` : ``;
    header.find$(`a`).remove();
    const headerText = header.html();
    ul.append(`<li><div ${doQuote} data-target="h3#${h3.id}">${headerText.replace(/\(.+\)/, ``)}</div></li>`);
    $(h3).prop(`title`, `Back to top`);
  });
  $(`<p><b>Note</b>: Use <code class="inline">$D</code> in the developer console to experiment with it</p>`,
    contentDiv, $.at.AfterEnd);
  $.editCssRule(`.bottomSpace { height: ${container.clientHeight}px; }`);
  $(`#log2screen`).afterMe(`<div class="bottomSpace"></div>`);
}

function valuesHelper() {
  const now = $D.now;
  const nowTomorrow = $D(now.values(true).array).tomorrow;
  return `<code class="codeblock">${[
    `const now = $D.now;`,
    `now.values().object; //=> ${JSON.stringify(now.values().object)}`,
    `now.values().array; //=> [${now.values().array}]`,
    `now.values(true).object.month; //=> ${now.values(true).object.month}`,
    `const nowTomorrow = $D(now.values(true).array).tomorrow;`,
    `nowTomorrow.local; //=> ${nowTomorrow.local}`,
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
    `currentDate.toLocaleString(\`br-BR\`, {timeZone: \`America/Fortaleza\`}); //=> ${
      currentDate.toLocaleString(`br-BR`, {timeZone: `America/Fortaleza`})}`,
    `currentDate.setHours(currentDate.hour - 3);`,
    `currentDate.getHours(); //=> ${
      (currentDate.setHours(currentDate.hour - 3), currentDate.getHours())}`,
  ];
}

function extendHelper() {
$D.extendWith({name: `isTodayOrLaterThen`, fn: (dt, nextDt) => +dt >= +nextDt, isMethod: true});

// locale aware `getTimezoneOffset`
$D.extendWith({name: `utcDistanceHours`, fn: dt => {
  const timeZone = dt.localeInfo?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const fmt = Intl.DateTimeFormat(`en-CA`, {
    year: `numeric`,
    timeZone: timeZone,
    timeZoneName: "shortOffset",
  });
  let distance = fmt.format(dt).match(/[+-]\d+$/);
  return !distance ? 0 : distance.shift();  }
});

// difference between the local time (as determined by the
// instance locale) and the time in the [timeZone] parameter
$D.extendWith({name: `localeDiff`, fn: (dt, timeZone) => {
  const cloned = dt.clone.localizedDT;
  const localized = dt.clone.relocate({timeZone}).localizedDT;
  // milliseconds possibly influence the difference calculation
  // and are not relevant here, so discard
  localized.time = cloned.time = {milliseconds: 0};
  const sign = cloned === localized ? `` : localized.isTodayOrLaterThen(cloned) ? `+` : `-`;
  return `${sign}${cloned.differenceFrom(localized).clean}`;
}, isMethod: true });

$D.extendWith({name: `utcDiff`, fn: dt => {
  const dtClone = dt.clone;
  const tz = {timeZone: dtClone.locale?.timeZone || `utc`};
  const utcDiff = dt.getTimezoneOffset() * -1;
  const local4TZ = dtClone.localize4TZ(tz.timeZone).add(`${utcDiff} minutes, 1 second`);
  let diff = dt.differenceFrom(local4TZ);
  diff = diff.clean.startsWith(`Dates`) ? `no difference` : diff.clean;
  return `UTC difference for ${tz.timeZone}: ${diff}`;
} });

// Note: this getter method (daysUntil) already exists in $D instances.
// It will be overwritten ...
$D.extendWith({name: `daysUntil`, fn: (dt, nextDate, reportString = true) => {
    let z = 0, containsLeapYear = false;
    nextDate = !nextDate.time ? $D(nextDate) : nextDate;
    dt.time = nextDate.time = { hour: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    
    if (dt > nextDate) {
      [dt, nextDate] = [nextDate, dt];
    }
    
    while (dt < nextDate) {
      dt.add(`1 day`);
      if (!containsLeapYear && dt.isLeapYear) { containsLeapYear = true; }
      z += 1;
    }
    return reportString ? `Days from ${dt.date.join(`/`)} until ${nextDate.date.join(`/`)}: ${z} ${
      containsLeapYear ? `(range contains leap year)` : ``}` : z;
  },
  isMethod: true,
});

// returns $D instance, so chainable
$D.extendWith({name: `midNight`, fn: dt => {
  dt.time = { hour: 0, minutes: 0, seconds: 0, milliseconds: 0 };
  return dt; }, proxifyResult: true });
}

function getInitialExtensions() {
  return `<li class="head"><h3>The list</b>: <code>[$D instance].</code></h3></li>
    <li><b>add</b> (mutating getter method, chainable)</li>
    <li><b>addDays</b> (mutating getter method, chainable)</li>
    <li><b>addMonths</b> (mutating getter method, chainable)</li>
    <li><b>addWeeks</b> (mutating getter method, chainable)</li>
    <li><b>addYears</b> (mutating getter method, chainable)</li>
    <li><b>clone</b> (getter, chainable)</li>
    <li><b>cloneDateTo</b> (method, chainable)</li>
    <li><b>cloneTimeTo</b> (method, chainable)</li>
    <li><b>date</b> (setter and getter)</li>
    <li><b>dateISOStr</b> (getter)</li>
    <li><b>dateStr</b> (getter)</li>
    <li><b>daysInMonth</b> (getter)</li>
    <li><b>differenceFrom</b> (getter method)</li>
    <li><b>format</b> (getter method)</li>
    <li><b>getTimezone</b> (getter)</li>
    <li><b>hasDST</b> (getter)</li>
    <li><b>hour</b> (setter and getter, chainable)</li>
    <li><b>isLeapYear</b> (getter)</li>
    <li><b>ISO</b> (getter)</li>
    <li><b>local</b> (getter)</li>
    <li><b>locale</b> (setter and getter)</li>
    <li><b>locale2Formats</b> (getter)</li>
    <li><b>localizedDT</b> (getter, chainable)</li>
    <li><b>minutes</b> (setter and getter)</li>
    <li><b>month</b> (setter and getter)</li>
    <li><b>monthName</b> (getter)</li>
    <li><b>ms</b> (setter and getter)</li>
    <li><b>nextMonth</b> (mutating getter, chainable)</li>
    <li><b>nextWeek</b> (mutating getter, chainable)</li>
    <li><b>nextYear</b> (mutating getter, chainable)</li>
    <li><b>previousMonth</b> (mutating getter, chainable)</li>
    <li><b>previousWeek</b> (mutating getter, chainable)</li>
    <li><b>previousYear</b> (mutating getter, chainable)</li>
    <li><b>relocate</b> (setter method, chainable)</li>
    <li><b>removeLocale</b> (getter, chainable)</li>
    <li><b>seconds</b> (setter and getter)</li>
    <li><b>self</b> (getter)</li>
    <li><b>subtract</b> (mutating getter method, chainable)</li>
    <li><b>time</b> (setter and getter)</li>
    <li><b>timeStr</b> (getter method)</li>
    <li><b>tomorrow</b> (mutating getter, chainable)</li>
    <li><b>values</b> (getter method)</li>
    <li><b>weekDay</b> (getter)</li>
    <li><b>year</b> (setter and getter)</li>
    <li><b>yesterday</b> (mutating getter, chainable)</li>`;
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
     #log2screen ul li span[data-target] {
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
    `li div p {
      margin-top: 0.3rem;
    }`,
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
    }`,
  );
}
/* endregion styling */