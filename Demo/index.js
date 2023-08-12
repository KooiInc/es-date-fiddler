/* region intialize/start */
const isDev = location.host.startsWith(`dev.`);
const devMini = t => t ? `../Bundle/index.esm.min.js` : `../index.esm.js`;
import $ from "https://kooiinc.github.io/JQL/Bundle/jql.min.js";
if (!/stackblitz/i.test(location)) { console.clear(); }
const perfNow = performance.now();
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

demoNdTest();
createContent();
/* endregion intialize/start */

/* region demo */
function demoNdTest() {
  /* region init */
  const yn = tf => tf ? `Yep` : `Nope`;
  const toJSON = (obj, format) => format ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  styleIt();
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
  log(`!!` + toCode(`<span class="comment">// $D imported (import $D from "[location of module]")</span>
    const d1 = $D({ locale: \`en-US\`, timeZone: \`US/Pacific\` });
    const d2 = d1.clone;
    const d3 = $D(new Date(200, 2, 18, 12, 0, 30));
    <span class="comment">// Note: month is *not* zero based here)</span>
    d2.date = { year: 2022, date: 10, month: 12 };
    d2.locale = { locale: \`nl-NL\`, timeZone: \`Europe/Amsterdam\` };`, true) );

  log(`${toCode(`d1.local`)} (timeZone: ${d1.locale?.timeZone}) => ${d1.local}<br>${toCode(`d1.dateStr`)} => ${
    d1.dateStr}<br>${toCode(`d1.timeStr(true)`)} => ${d1.timeStr(true)}`);
  log(`${toCode(`d2.local`)} (timeZone: ${d2.locale?.timeZone}) => ${d2.local}<br>${toCode(`d2.dateStr`)} => ${
    d2.dateStr}<br>${toCode(`d2.timeStr(true)`)} => ${d2.timeStr(true)}`);
  log(`${toCode(`d3.local`)} (no timeZone) => ${d3.local}<br>${toCode(`d3.dateStr`)} => ${
    d3.dateStr}<br>${toCode(`d3.timeStr(true)`)} => ${d3.timeStr(true)}`)
  /* endregion init  */

  /* region locale */
  log(`!!<h3 id="locale">Locale</h3>`);
  log(`!!<div>
        <p>With <code>$D</code> you can associate a <i>locale</i> and/or <i>timeZone</i> 
          with its <code>Date</code></p>
        <b>Notes</b><ul class="decimal">  
        <li>As long as <code>[instance].locale</code> is not set, the <code>$D</code> instance
          is not associated with either <i>locale</i> or <i>timeZone</i>. 
          In that case the instance uses <i>your locale</i> and/or <i>your timeZone</i>
          to format/display its <code>Date</code>.</li>  
        <li>When an associated locale can't be used in <code>[instance].local</code> or 
          <code>[instance].format</code> the result of those getters will contain an error
          message (and the locale of the result will be your locale). </li>
        <li>The locale information is also used with the <code>dateStr</code> property. 
        If such information is available (especially the timeZone) the string value
        returned will be in the dates' local format.</li></ul>
        <p>There are several ways to associate locale information with a <code>$D</code> instance.
        Here are some examples.</p>
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
  log(toCode(`d2Dutch.local`) + ` => ${d2Dutch.local}`);
  log(toCode(`d2Dutch.dateStr`) + ` => ${d2Dutch.dateStr}`);
  log(toCode(`todayAustralia.local`) + ` => ${todayAustralia.local}`);
  log(toCode(`todayAustralia.dateStr`) + ` => ${todayAustralia.dateStr}`);
  log(toCode(`nwZealandTomorrow.local`) + ` => ${nwZealandTomorrow.local}`);
  log(toCode(`nwZealandTomorrow.dateStr`) + ` => ${nwZealandTomorrow.dateStr}`);
  log(toCode(`invalidLocale.locale`) + ` => ${toJSON(invalidLocale.locale)}`);
  log(toCode(`invalidLocale.dateStr`) + ` => ${invalidLocale.dateStr} (<b>note</b>: ISO 8601 date format)`);
  log(toCode(`invalidLocale.local`) + ` => ${invalidLocale.local}`);
  log(toCode(`invalidTimezone.locale`) + ` => ${toJSON(invalidTimezone.locale)}`)
  log(toCode(`invalidTimezone.local`) + ` => ${invalidTimezone.local}`);
  log(toCode(`invalidLocaleData.locale`) + ` => ${toJSON(invalidLocaleData.locale)}`);
  log(`!!<div><b>Note</b>: a <code>$D</code> instance with invalid locale data 
    stringifies the <code>Date</code> using your locale <i><b>and adds an error message</b></i>:</div>`);
  log(toCode(`invalidLocaleData.local`) + ` => ${invalidLocaleData.local}`);
  invalidLocaleData.removeLocale();
  log(`!!` + toCode(`invalidLocaleData.removeLocale()`));
  log(toCode(`invalidLocaleData.locale`) + ` => ${toJSON(invalidLocaleData.locale)}`);
  log(toCode(`invalidLocaleData.local`) + ` => ${invalidLocaleData.local}`);
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
    const d2EnFrancais = d2French.format(\`{&lt;i>En français&lt;/i>} => d MM yyyy (hh:mmi:ss)\` );
    const d2BrazilFormatted = d2Brazil.format(\`WD d MM yyyy hh:mmi:ss\)`, true));
  log(`${toCode(`d2French.locale`)} => ${toJSON(d2French.locale)}`);
  log(`${toCode(`d2EnFrancais`)} => ${d2EnFrancais}`);
  log(`${toCode(`d2Brazil`)} => ${d2BrazilFormatted}`);

  const d1Clone = d1.clone;
  d1Clone.date = { year: 2000, month: 2 };
  const d1CloneFormattedUS = d1Clone.format(
    `{${toCode(`d1CloneFormattedUS`)} in Los Angeles (US) =>} WD MM d yyyy hh:mmi:ss dp`,`l:en-US, tz:America/Los_Angeles`);
  log(`!!${toCode(`
      const d1Clone = $D(d1.clone);
      d1Clone.date = { year: 2000, month: 2 };
      const d1CloneFormattedUS = dateFrom_d1.format(
        "{&lt;code>d1CloneFormattedUS&lt;/code> in Los Angeles (US) =>} WD MM d yyyy hh:mmi:ss dp",
        "l:en-US, tz:America/Los_Angeles" );`, true)}`,
    `${toCode(`d1Clone.local`)} => ${d1Clone.local}`,
    d1CloneFormattedUS,);
  log(`!!<div><b>Note</b>: a <code>$D</code> instance with invalid locale data 
    formats the <code>Date</code> using your locale <i><b>and adds an error message</b></i>:</div>`);
  log( toCode(`invalidTimezone.format('dd MM yyyy hh:mmi:ss dp')`) + `<p>=> ${
    invalidTimezone.format('dd MM yyyy hh:mmi:ss dp')}</p>` );

  // cloning
  log(`!!<h3 id="cloning">Clone date- or time part</h3>`);
  log(`!!<div><b>Notes</b>:<ul class="decimal">
    <li>The locale of the original is also cloned.</li>
    <li>Time for the result may differ due to daylight saving times</li></ul></div>`);
  const initial = $D(new Date(`1999/05/31 14:22:44.142`), { locale: `en-GB` });
  const dateCloned = initial.cloneDateTo();
  const timeCloned = initial.cloneTimeTo();
  log(toCode(`const initial = $D(new Date(\`1999/05/31 14:22:44.142\`), { locale: \`en-GB\` });
  <span class="comment">// Clone date/time of [initial] to current date</span>
  const dateCloned = initial.cloneDateTo();
  const timeCloned = initial.cloneTimeTo();`, true));
  log(`${toCode(`initial.format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${initial.format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  log(`${toCode(`dateCloned.format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${dateCloned.format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  log(`${toCode(`timeCloned.format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${timeCloned.format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  log(`${toCode(`initial.cloneDateTo(new Date('2000/1/1 22:33:44')).format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${
    initial.cloneDateTo(new Date('2000/1/1 22:33:44')).format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  /* endregion formatting */

  /* region arithmetic */
  log(`!!<h3 id="fiddling">Arithmetic (add/subtract to/from the Date at hand)</h3>`);
  log(`!!<div><b>Note</b>: add/subtract and aggregates like ${toCode(`nextYear`)} are
    <a target="_blank" href="https://www.tutorialspoint.com/method-chaining-in-javascript">chainable</a></div>`);
  log(
    d1.add(`5 days, 3 hours`).nextYear
      .format(`{<code>d1.add(\`5 days, 3 hours\`).nextYear</code>} => d MM yyyy (hh:mmi:ss)`, `l:en-GB`),
    `${toCode(`d1.clone.addYears(-10).local`)} => ${d1.clone.addYears(-10).local}`,
  );
  const defaultLocale = $D().locale?.formats;
  log(d1.add(`2 days, 5 hours`)
    .format(`{<code>d1.add(\`2 days, 5 hours\`)</code> =>} WD MM d yyyy hh:mmi:ss`, defaultLocale));
  log(d1.subtract(`2 days`, `5 hours`)
    .format(`{<code>d1.subtract(\`2 days, 5 hours)</code> =>} WD MM d yyyy hh:mmi:ss`, defaultLocale));
  log(`${toCode(`$D().previousYear.nextMonth.local`)} => ${$D().previousYear.nextMonth.local}`);

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
  /* endregion arithmetic */

  /* region constructor */
  log(`!!<h3 id="constructor" class="quoted">Constructor</h3>`);
  log(`${toCode(`$D(\`hello\`).ISO`)}
    <p>=> invalid Date returns (proxified) <i>now</i>: ${$D(`hello`).ISO}</p>`);
  log(`${toCode(`$D(\`2012/12/12 00:00:00\`).ISO`)}
    <p>=> string converted to (proxified) Date (when convertable): ${$D(`2012/12/12 00:00:00`).ISO}</p>`);
  log(`${toCode(`$D().ISO`)}
    <p>=> no parameters returns (proxified) <i>now</i>: ${$D().ISO}</p>`);
  log(`${toCode(`$D({locale: 'fr-FR', timeZone: 'Europe/Paris' }).local`)}
    <p>=> (proxified) <i>now</i> with locale parameters: ${
    $D({locale: 'fr-FR', timeZone: 'Europe/Paris' }).local}</p>`);
  const frDate = $D('2020/03/18 17:00', {locale: 'fr-FR', timeZone: 'Europe/Paris' });
  const frDateFormatted = frDate.format('WD d MM yyyy hh:mmi', frDate.locale.formats);
  log(`${toCode(`const frDate = $D('2020/03/18 17:00', { locale: 'fr-FR', timeZone: 'Europe/Paris' });
    const frDateFormatted = frDate.format('WD d MM yyyy hh:mmi', frDate.locale.formats)`, true)}
    <p>=> (proxified) Date with locale parameters: ${frDateFormatted}</p>`);
  /* endregion constructor */

  /* region custom properties */
  log(`!!<h3 id="customprops">Custom properties (get / set)</h3>`);
  const now = $D();
  const y2000 = now.clone;
  y2000.date = { year: 2000, date: 1 };
  log(`!!` + toCode(`
    const now = $D();
    const y2000 = now.clone;
    y2000.date = { year: 2000, date: 1 };`, true));
  log(`${toCode(`y2000.local`)} => ${y2000.local}`);
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
  log(`${toCode(`y2000.time`)} => [${y2000.time}]`);
  /* endregion custom properties */

  /* region values */
  log(`!!<h3 id="values">Values</h3>`);
  log(`<code>y2000.values()</code> => <p>${JSON.stringify(y2000.values())}</p>`);
  log(`<code>y2000.values(true)</code> => ${JSON.stringify(y2000.values(true))}`);

  // natives
  log(`!!<h3 id="natives">Use all native <code>Date</code> methods</h3>`);
  y2000.setHours(y2000.hour - 3);
  log(`<code>y2000.setHours(y2000.hour - 3)</code><p>${toCode(`y2024.getHours()`)} => ${y2000.getHours()}</p>`);
  log(`<code>y2000.getFullYear()</code> ${y2000.getFullYear()}`);
  log(`<code>y2000.toLocaleString()</code> ${y2000.toLocaleString()}`);
  log(`<code>y2000.toISOString()</code> ${y2000.toISOString()}`);
  log(`<code>y2000.toUTCString()</code> ${y2000.toUTCString()}`);
  log(`<code>y2000.getUTCHours()</code> ${y2000.getUTCHours()}`);
  log(`<code>y2000.toLocaleString(\`br-BR\`, {timeZone: \`America/Fortaleza\`})</code> <p> => ${
    y2000.toLocaleString(`br-BR`, {timeZone: `America/Fortaleza`})}</p>`);
  /* endregion values */

  /* region extend */
  $D.extendWith({name: `isTodayOrLaterThen`, fn: (dt, nextDt) => +dt >= +nextDt, isMethod: true});
  $D.extendWith({name: `localize4TZ`, fn: (dt, timeZoneLabel) =>
      new Date(new Date().toLocaleString(`en`, {timeZone: timeZoneLabel}))
        .toLocaleString(`en-CA`, {hourCycle: `h23`}), isMethod: true});
  $D.extendWith({name: `localeDiff`, fn: (dt, locale) => {
      const dtClone = dt.clone;
      const local4TZ = new Date(dtClone.localize4TZ(locale.timeZone));
      return `${Math.round((local4TZ - dtClone)/360_0000)} hour(s)`;
    }, isMethod: true });
  $D.extendWith({name: `utcDistance`, fn: dt => { return dt.getTimezoneOffset() } });
  $D.extendWith({name: `midNight`, fn: dt => {
    dt.time = { hour: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    return dt; }, proxifyResult: true });

  log(`!!<h3 id="extendCustom">Extend the ‘constructor’</h3>
    <div>Additional extension properties/methods can be created using<br> 
      <code>$D.extendWith({name: string, fn: Function, isMethod: boolean, proxifyResult: boolean})</code>.</div>
      <ul class="sub"><li><code>fn</code>: the function to use. The function should at least have one parameter,
      that being the date value of the instance. By default the extension function is added as property 
      (<code>isMethod</code> false). When <code>isMethod</code> is true, the function 
      is considered (and callable as) a method and can receive parameters (<code>[instance][name](dateValue, ...args)</code>).</li>
      <li><code>proxifyResult</code> When true <i>and</i> <code>fn</code> returns the instance date, 
      enables chaining. False by default.
      <br><b>Note</b>: when <code>fn</code> returns the instance date, there's no need to set this value.</li></ul>`);
  log(`!!<code class="codeblock">$D.extendWith({
  name: \`isTodayOrLaterThen\`,
  fn: (dt, nextDt) => +dt >= +nextDt, 
  isMethod: true });
  
$D.extendWith({name: \`utcDistance\`, fn: dt => dt.getTimezoneOffset(); });

$D.extendWith( {
  name: \`localize4TZ\`, 
  fn: (dt, timeZoneLabel) => 
    new Date(new Date().toLocaleString(\`gmt\`, {timeZone: timeZoneLabel}))
      .toLocaleString(\`en-CA\`, {hourCycle: \`h23\`}), 
  isMethod: true } );

$D.extendWith( {
  name: \`localeDiff\`, 
  fn: (dt, locale) => {
    const dtClone = dt.clone;
    const local4TZ = new Date(dtClone.localize4TZ(locale.timeZone));
    return \`\${Math.round((local4TZ - dtClone) / 360_0000)} hour(s)\`; }, 
  isMethod: true } );

<span class="comment">// returns instance Date, so chainable</span>
$D.extendWith({name: \`midNight\`, fn: dt => {
  dt.time = { hour: 0, minutes: 0, seconds: 0, milliseconds: 0 };
  return dt.clone; }, proxifyResult: true });</code>
  <code>$D().add(\`1 day\`).isTodayOrLaterThen($D());</code> => ${$D().add(`1 day`).isTodayOrLaterThen($D())}<br>
  <code>$D().add(\`-1 day\`).isTodayOrLaterThen($D());</code> => ${$D().add(`-1 day`).isTodayOrLaterThen($D())}<br>
  <code>$D().utcDistance</code> => ${$D().utcDistance}<br>
  <code>$D().localeDiff({locale: \`en-NZ\`, timeZone: \`Pacific/Auckland\`})</code> => ${ 
    $D().relocate({locale: `nl`, timeZone: `Europe/Amsterdam`})
      .localeDiff({locale: `en-NZ`, timeZone: `Pacific/Auckland`}) }<br>
  <code>$D().localeDiff({locale: \`en-US\`, timeZone: \`America/New_York\`})</code> => ${
    $D().relocate({locale: `nl`, timeZone: `Europe/Amsterdam`})
      .localeDiff({locale: `en-US`, timeZone: `America/New_York`}) }<br>
  <code>$D().midNight.local</code> => ${
    $D().midNight.local}<br>`);
  /* endregion extend */

  /* region performance */
  log(`!!<h3 id="perfomance">Performance</h3>`);
  log(checkPerformance(10_000));
  /* endregion performance */
}
/* endregion demo */

/* region helpers */
function checkPerformance(nRuns) {
  const start = performance.now();
  for (let i = 0; i < nRuns; i += 1) {
    const nowX = $D();
    nowX.locale = {locale: `nl-NL`, timeZone: `Europe/Amsterdam`};
    const nowXX = nowX.clone.add(`42 days`);
  }
  const perf = performance.now() - start;
  const perfPerTest = perf/nRuns;
  return `Created, set locale and cloned a $D instance ${nRuns.toLocaleString()} times.
    <br>That took ${
    (perf).toFixed(2)}</b> milliseconds (${perfPerTest.toFixed(6)} ms / iteration).`
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
  catch(err) {return `Some [Object object] can not be converted to JSON`}
}

function createContent() {
  const container = $.node(`.container`)
  $.delegate(`click`, `h3[id]`, () => {
    container.scrollTo(0,0);
  });
  $.delegate(`click`, `.content li .linkLike`, evt => {
    const origin = $(evt.target.dataset.target);
    container.scrollTo(0, origin.dimensions.top - 12);
  });
  const contentDiv = $(
    `<div class="content" id="content"><h3>Content</h3><ul></ul></div>`,
    $(`#inits`),
    $.at.BeforeBegin );
  const ul = contentDiv.find$(`ul`);
  $(`h3[id]`).each(h3 => {
    const header = $(h3).duplicate();
    const doQuote = header.hasClass(`quoted`) ? ` class="linkLike quoted"` : `class="linkLike"`;
    header.find$(`a`).remove();
    const headerText = header.html();
    ul.append(`<li><div ${doQuote} data-target="h3#${h3.id}">${headerText.replace(/\(.+\)/, ``)}</div></li>`);
    $(h3).prop(`title`, `Back to top`);
  });

  $(`<p><b>Note</b>: Use <code>$D</code> in the developer console to experiment with it</p>`,
    contentDiv, $.at.AfterEnd);
  $.editCssRule(`.bottomSpace { height: ${container.clientHeight}px; }`);
  $(`#log2screen`).afterMe(`<div class="bottomSpace">`);
}

function styleIt() {
  $.editCssRules(
    `body { margin: 0; }`,
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
    `code {
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
    `#log2screen .content ul li div[data-target]:hover {
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
    `#log2screen .content ul li {
      margin-left: -1.4rem;
      margin-top: auto;
      list-style: '\\27A4';
      cursor: pointer;
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
    `h3[id] {cursor: pointer;}`,
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

/* endregion helpers */
