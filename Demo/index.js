const isDev = location.host.startsWith(`dev.`);
const devMini = t => t ? `../Bundle/index.esm.min.js` : `../index.esm.js`;
const lib  = await import("https://kooiinc.github.io/SBHelpers/index.browser.js");
const { logFactory, $ } = lib;
if (isDev) { document.title = `#DEV ${document.title}`; }
const perfNow = performance.now();
const DateX = isDev
  ? (await import(devMini(false))).default
  : (await import("../Bundle/index.esm.min.js")).default;
const { log, logTop } = logFactory(true);
window.DateX = DateX;

demoNdTest();
// content and handling
$.delegate(`click`, `h3[id]`, () => {
  $.node(`#content`).scrollIntoView();
  document.documentElement.scrollTop = 0; });
$.delegate(`click`, `.content li .linkLike`, evt => {
  $.node(evt.target.dataset.target).scrollIntoView();
  document.documentElement.scrollBy(0, -15); });
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

$(`<div><b>Note</b>: Use <code>DateX</code> in the developer console to experiment with it</div>`,
  contentDiv, $.at.AfterEnd);

$(`<div class="spacer"></div>`);
logTop(`!!
      <a class="gitLink" href="//github.com/KooiInc/es-date-fiddler">
        <img src="//github.githubassets.com/favicons/favicon.png" class="gitLink" alt="github icon">Back to repository @Github
     </a>`);

function demoNdTest() {
  const yn = tf => tf ? `Yep` : `Nope`;
  const toJSON = (obj, format) => format ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  styleIt();
  const toCode = (str, block) => `<code${block ? ` class="codeblock"` : ``}>${
    str.replace(/^\s+\b/gm, ``).replace(/^\s{3,}(\W)/gm, `  $1`)
      .replace(/^\s+</gm, `<`)}</code>`;
  window.DX = DateX;
  const d1 = DateX({ locale: `en-US`, timeZone: `US/Pacific` });
  const d2 = d1.clone;
  d2.date = { year: 2022, date: 10, month: 12 };
  d2.locale = { locale: `nl-NL`, timeZone: `Europe/Amsterdam` };

  log(
    `!!<h1>Demo for es-date-fiddler</h1>`,
    `!!<h2>a proxy to extend and make working with ES <code>Date</code> somewhat easier</h3>`
  );

  log(`!!<h3 id="inits">Initialization</h3>`);
  log(`!!` + toCode(`<span class="comment">// DateX imported</span>
    const d1 = DateX();
    const d2 = d1.clone;`, true) );
  log(`${toCode(`d1`)} => ${d1}`);
  log(`${toCode(`d2`)} => ${d2}`);

  // locale
  log(`!!<h3 id="locale">Locale</h3>`);
  log(`!!<div>
        <p>With <code>DateX</code> you can associate a <i>locale</i> (and/or <i>timeZone</i>) 
          with its <code>Date</code></p>
        <p>The setter (<code>[instance].locale = <span class="comment">/* one or both of */</span> {locale, timeZone}</code>)
          'auto fills' locale/timeZone with default values if it's not in the parameter. For locale that will be "utc",
          for the timeZone "Etc/UTC". As long as <code>[instance].locale</code> is not set, it is considered 
          <code>undefined</code>, meaning the instance <code>Date</code> will use your locale.</p>  
        <p>When an associated locale can't be used in <code>[instance].local</code> or 
          <code>[instance].format</code> the result of those getters will contain an error
          message (and the locale of the result will be your locale). </p>
        <p>There are several ways to associate locale information with a <code>DateX</code> instance.
        Here are some examples.</p>
      </div>`);

  const d2German = d2.clone;
  d2German.locale = { locale: `de-DE`, timeZone: `Europe/Berlin` };
  const d2Dutch = d2.clone.relocate({ locale: `nl-NL`, timeZone: `Europe/Amsterdam` } );
  const todayAustralia = DateX({timeZone: 'Australia/Darwin', locale: 'en-AU'});
  const nwZealandTomorrow = DateX(new Date(), {timeZone: 'Pacific/Auckland', locale: 'en-NZ'}).tomorrow;
  const invalidLocale = DateX({locale: 'somewhere'});
  const invalidTimezone = DateX({timeZone: 'somewhere'});
  const invalidLocaleData = DateX({locale: 'somewhere', timeZone: 'somehow'});
  log(`!!` + toCode(`const d2German = d2.clone;
    d2German.locale = { locale: \`de-DE\`, timeZone: \`Europe/Berlin\` };
    const d2Dutch = d2.clone.relocate({ locale: \`nl-NL\`, timeZone: \`Europe/Amsterdam\` });
    const toDayAustralia = DateX({timeZone: 'Australia/Darwin', locale: 'en-AU'});
    const nwZealandTomorrow = DateX(new Date(), {timeZone: 'Pacific/Auckland', locale: 'en-NZ'}).tomorrow;
    const invalidLocale = DateX({locale: 'somewhere'});
    const invalidTimezone = DateX({timeZone: 'somewhere'});
    const invalidLocaleData = DateX({locale: 'somewhere', timeZone: 'somehow'});`, true));
  log(toCode(`d2German.local`) + ` => ${d2German.local}`);
  log(toCode(`d2Dutch.local`) + ` => ${d2Dutch.local}`);
  log(toCode(`todayAustralia.local`) + ` => ${todayAustralia.local}`);
  log(toCode(`nwZealandTomorrow.local`) + ` => ${nwZealandTomorrow.local}`);
  log(toCode(`invalidLocale.local`) + ` => ${invalidLocale.local}`);
  log(toCode(`invalidTimezone.local`) + ` => ${invalidTimezone.local}`);
  log(toCode(`invalidLocaleData.local`) + ` => ${invalidLocaleData.local}`);


  // formatting
  log(`!!<h3 id="formatting">Formatting (see <a target="_blank" href="https://github.com/KooiInc/dateformat">GitHub</a>)</h3>`);
  log(`!!` + toCode(`d1.relocate({locale: 'pl-PL', timeZone: 'Europe/Warsaw'});`));
  d1.relocate({locale: 'pl-PL', timeZone: 'Europe/Warsaw'});
  log(`!!<div><b>Note</b>: formatting uses either<ul class="decimal">
      <li>the locale of its <code>DateX</code> instance (no second parameter),</li>
      <li>the given locale from its second parameter,</li>
      <li>the default (your) locale (no locale set and no second parameter), or</li>
      <li>the default (your) locale (locale set, but second parameter explicitly <code>undefined</code>)</li>
    </ul></div>`);
  log(`${toCode(`d1.format(\`{1. d1 with instance locale:} &lt;i>&ltb>WD MM d yyyy hh:mmi dp&lt/b>&lt;/i>\`)}`)}
    <p>=> ${d1.format(`{1. d1 with instance locale:} <i><b>WD MM d yyyy hh:mmi dp</b></i>`)}`);
  log(`${
    toCode(`d1.format(\`{2. d1 formatted /w second parameter:} &lt;i>&ltb>(WD) d MM yyyy (hh:mmi:ss)&lt/b>&lt/i>\`, <b><i>'l:fr-FR'</i></b>)`)}
    <p>=> ${ d1.format(`{2. d1 formatted /w second parameter:} <i><b>(WD) d MM yyyy (hh:mmi:ss)</b></i>`, 'l:fr-FR')}</p>` );
  log(`${
    toCode(`DateX().format(\`{3. new instance default (your) locale:} &lt;i>&ltb>(WD) d MM yyyy (hh:mmi:ss dp)&lt/b>&lt;/i>\`)`)}
    <p>=> ${ DateX().format(`{3. new instance default (your) locale:} <i><b>(WD) d MM yyyy (hh:mmi:ss dp)</b></i>`)}</p>` );
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
    const d2EnFrancais = d2French.format(
      \`{&lt;i>En français&lt;/i>} => d MM yyyy (hh:mmi:ss)\` );
    const d2BrazilFormatted = d2Brazil.format(
      \`WD d MM yyyy hh:mmi:ss\)`, true));
  log(`${toCode(`d2French.locale`)} => ${toJSON(d2French.locale)}`);
  log(`${toCode(`d2EnFrancais`)} => ${d2EnFrancais}`);
  log(`${toCode(`d2Brazil`)} => ${d2BrazilFormatted}`);

  const d1Clone = d1.clone;
  d1Clone.date = { year: 2000, month: 2 };
  const d1CloneFormattedUS = d1Clone.format(
    `{${toCode(`d1CloneFormattedUS`)} in Los Angeles (US) =>} WD MM d yyyy hh:mmi:ss dp`,`l:en-US, tz:America/Los_Angeles`);
  log(`!!${toCode(`
      const d1Clone = DateX(d1.clone);
      d1Clone.date = { year: 2000, month: 2 };
      const d1CloneFormattedUS = dateFrom_d1.format(
        "{&lt;code>dateFrom_d1&lt;/code> in Los Angeles (US) =>} WD MM d yyyy hh:mmi:ss dp",
        "l:en-US, tz:America/Los_Angeles" );`, true)}`,
    `${toCode(`d1Clone.local`)} => ${d1Clone.local}`,
    d1CloneFormattedUS,);
  log(`!!<div><b>Note</b>: a <code>DateX</code> instance with invalid locale data 
    formats the <code>Date</code> using your locale <i>and adds an error message</i>:</div>`);
  log( toCode(`invalidLocaleData.format('dd MM yyyy hh:mmi:ss dp')`) + `<p>=> ${
    invalidLocaleData.format('dd MM yyyy hh:mmi:ss dp')}</p>` );

  // cloning
  log(`!!<h3 id="cloning">Clone date- or time part</h3>`);
  log(`!!<div><b>Notes</b>:<ul class="decimal">
    <li>The locale of the original is also cloned.</li>
    <li>Time for the result may differ due to daylight saving times</li></ul></div>`);
  const initial = DateX(new Date(`1999/05/31 14:22:44.142`), { locale: `en-GB` });
  const dateCloned = initial.cloneDateTo();
  const timeCloned = initial.cloneTimeTo();
  log(toCode(`const initial = DateX(new Date(\`1999/05/31 14:22:44.142\`), { locale: \`en-GB\` });
  <span class="comment">// Clone date/time of [initial] to current date</span>
  const dateCloned = initial.cloneDateTo();
  const timeCloned = initial.cloneTimeTo();`, true));
  log(`${toCode(`initial.format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${initial.format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  log(`${toCode(`dateCloned.format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${dateCloned.format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  log(`${toCode(`timeCloned.format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${timeCloned.format('dd/mm/yyyy hh:mmi:ss.ms')}`);
  log(`${toCode(`initial.cloneDateTo(new Date('2000/1/1 22:33:44')).format('dd/mm/yyyy hh:mmi:ss.ms')`)} => ${
    initial.cloneDateTo(new Date('2000/1/1 22:33:44')).format('dd/mm/yyyy hh:mmi:ss.ms')}`);

  // fiddling
  log(`!!<h3 id="fiddling">Fiddling (add/subtract to/from the Date at hand)</h3>`);
  log(`!!<div><b>Note</b>: add/subtract and aggregates like ${toCode(`nextYear`)} are
    <a target="_blank" href="https://www.tutorialspoint.com/method-chaining-in-javascript">chainable</a></div>`);
  log(
    d1.add(`5 days, 3 hours`).nextYear
      .format(`{<code>d1.add(\`5 days, 3 hours\`).nextYear</code>} => d MM yyyy (hh:mmi:ss)`, `l:en-GB`),
    `${toCode(`d1.clone.addYears(-10).local`)} => ${d1.clone.addYears(-10).local}`,
  );
  const defaultLocale = DateX().locale?.formats;
  log(d1.add(`2 days, 5 hours`)
    .format(`{<code>d1.add(\`2 days, 5 hours\`)</code> =>} WD MM d yyyy hh:mmi:ss`, defaultLocale));
  log(d1.subtract(`2 days`, `5 hours`)
    .format(`{<code>d1.subtract(\`2 days, 5 hours)</code> =>} WD MM d yyyy hh:mmi:ss`, defaultLocale));
  log(`${toCode(`DateX().previousYear.nextMonth.local`)} => ${DateX().previousYear.nextMonth.local}`);

  // difference
  log(`!!<h3 id="difference">Difference utility</h3`);
  log(`${toCode(`DateX().differenceFrom('1991/08/27 13:30').full`)}
   <p> => ${DateX().differenceFrom('1991/08/27 13:30').full}</p>`);
  log(`${toCode(`DateX().differenceFrom(DateX().subtract(\`5 days, 2 hours, 1 minute\`)).clean`)}
   <p> => ${
    DateX().differenceFrom(DateX().subtract(`5 days, 2 hours, 1 minute`)).clean}
     (<b>Note</b>:<code>.clean</code> removes zero values) </p>`);
  const today = DateX();
  const then = DateX(`2023/07/16`);
  log(`!!${
    toCode(`const today = DateX();
      const then = DateX(\`2023/07/16\`);
      const diffFromThen = today.differenceFrom(then);`, true)}`);
  log(`!!${toCode(`diffFromThen`)} => <pre>${toJSON(today.differenceFrom(then), true)}</pre>`);
  log(`${toCode(`then.differenceFrom(then).full`)} ${toJSON(then.differenceFrom(then).full)}`);
  log(`${toCode(`then.differenceFrom(then).clean`)} ${then.differenceFrom(then).clean}`);

  // constructor
  log(`!!<h3 id="constructor" class="quoted">Constructor</h3`);
  log(`${toCode(`DateX(\`hello\`).ISO`)}
    <p>=> invalid Date returns (proxified) <i>now</i>: ${DateX(`hello`).ISO}</p>`);
  log(`${toCode(`DateX(\`2012/12/12 00:00:00\`).ISO`)}
    <p>=> string converted to (proxified) Date (when convertable): ${DateX(`2012/12/12 00:00:00`).ISO}</p>`);
  log(`${toCode(`DateX().ISO`)}
    <p>=> no parameters returns (proxified) <i>now</i>: ${DateX().ISO}</p>`);
  log(`${toCode(`DateX({locale: 'fr-FR', timeZone: 'Europe/Paris' }).local`)}
    <p>=> (proxified) <i>now</i> with locale parameters: ${
    DateX({locale: 'fr-FR', timeZone: 'Europe/Paris' }).local}</p>`);
  const frDate = DateX('2020/03/18 17:00', {locale: 'fr-FR', timeZone: 'Europe/Paris' });
  const frDateFormatted = frDate.format('WD d MM yyyy hh:mmi', frDate.locale.formats);
  log(`${toCode(`const frDate = DateX('2020/03/18 17:00', { locale: 'fr-FR', timeZone: 'Europe/Paris' });
    const frDateFormatted = frDate.format('WD d MM yyyy hh:mmi', frDate.locale.formats)`, true)}
    <p>=> (proxified) Date with locale parameters: ${frDateFormatted}</p>`);

  // customs
  log(`!!<h3 id="customprops">Custom properties (get / set)</h3>`);
  const now = DateX();
  const y2000 = now.clone;
  y2000.date = { year: 2000, date: 1 };
  log(`!!` + toCode(`
    const now = DateX();
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

  // values
  log(`!!<h3 id="values">Values</h3`);
  log(`<code>y2000.values()</code> => <p>${JSON.stringify(y2000.values())}</p>`);
  log(`<code>y2000.values(true)</code> => ${JSON.stringify(y2000.values(true))}`);

  // natives
  log(`!!<h3 id="natives">Use all native <code>Date</code> methods</h3`);
  y2000.setHours(y2000.hour - 3);
  log(`<code>y2000.setHours(y2000.hour - 3)</code><p>${toCode(`y2024.getHours()`)} => ${y2000.getHours()}</p>`);
  log(`<code>y2000.getFullYear()</code> ${y2000.getFullYear()}`);
  log(`<code>y2000.toLocaleString()</code> ${y2000.toLocaleString()}`);
  log(`<code>y2000.toISOString()</code> ${y2000.toISOString()}`);
  log(`<code>y2000.toUTCString()</code> ${y2000.toUTCString()}`);
  log(`<code>y2000.getUTCHours()</code> ${y2000.getUTCHours()}`);
  log(`<code>y2000.toLocaleString(\`br-BR\`, {timeZone: \`America/Fortaleza\`})</code> <p> => ${
    y2000.toLocaleString(`br-BR`, {timeZone: `America/Fortaleza`})}</p>`);

  log(`!!<h3 id="perfomance">Performance</h3`);
  log(checkPerformance(10_000));
}

function checkPerformance(nRuns) {
  const start = performance.now();
  for (let i = 0; i < nRuns; i += 1) {
    const nowX = DateX();
    nowX.locale = {locale: `nl-NL`, timeZone: `Europe/Amsterdam`};
    const nowXX = nowX.clone.add(`42 days`);
  }
  const perf = performance.now() - start;
  return `Created, set locale and cloned a DateX instance ${nRuns.toLocaleString()} times.
    <br>That took ${
    (perf).toFixed(2)}</b> milliseconds (${(perf/1000).toFixed(2)} seconds)`;
}

function styleIt() {
  $.editCssRules(
    `body {
      margin-top: 2rem;
      font: normal 14px/17px system-ui, verdana, arial;
     }`,
    `.head pre, .head div { font-weight: normal }`,
    `code, code.codeblock {
      background-color: #fffff8;
      border: 1px dotted #999;
      color: rgb(81, 76, 125);
      font-weight: normal;
      padding: 2px 6px;
     }`,
    `#log2screen li.head h2 { line-height: 1.5rem; }`,
    `#log2screen  li { margin-top: 0.7rem; vertical-align: middle; }`,
    `#log2screen li p, #log2screen li.head p {
      margin: 0.6rem 0;
      font-weight: normal}`,
    `.quoted:before {
      content: '\\201C';
      font-family: "Times New Roman";
     }`,
    `.quoted:after {
      content: '\\201D';
      font-family: "Times New Roman";
     }`,
    `a[target]:before, a.internalLink:before, a.externalLink:before {
      color: rgba(0,0,238,0.7);
      font-size: 1.1rem;
      padding-right: 2px;
      vertical-align: baseline;
     }`,
    `a[target="_blank"]:before {
      content: '\\2197';
     }`,
    `@media (width > 1600px) {
      code.codeblock {
        width: 40vw;
      }
      ul#log2screen { max-width: 35vw; }
    }`,
    `#log2screen .content ul {
      margin-left: initial;
      margin-top: -0.7rem;
    }`,
    `#log2screen .content ul li{
      margin-left: -1.4rem;
      margin-top: auto;
      list-style: '\\27A4';
    }`,
    `@media (width < 1401px) {
      code.codeblock {
        width: 50vw;
      }
      ul#log2screen { max-width: 50vw; }
    }`,
    `h3[id] {
      cursor: pointer;
    }`,
    `h3[id]:not(.quoted):before {
      content: "↺";
      color: blue;
      padding-right: 3px;
    }`,
    `h3[id].quoted:before {
      content: "↺ \\201C";
      color: blue;
      padding-right: 3px;
    }`,
    `h3[id]:hover {
      text-decoration: underline;
    }`,
    `.content {
      margin: 0 0 1.5rem 0;
    }`,
    `.spacer {
      position: relative;
      height: 95vh;
    }`,
    `#log2screen a.gitLink img {
      width: 24px;
      height: auto;
      margin-right: 4px;
      vertical-align: middle;
    }`,
    `#log2screen a.gitLink  {
      font-weight: normal !important;
    }`,
    `.linkLike {
      color: blue;
      cursor: pointer;
      display: inline-block;
      font-family: system-ui;
      padding: 1px 3px;
    }`,
    `.linkLike:hover {
      background-color: #EEE;
    }`,
    `.comment {
      color: #c0c0c0;
    }`,
    `#log2screen ul.decimal li {
      list-style-type: decimal;
      padding-left: initial;
      margin: 0.3rem 0px 0px -0.5rem;
    }`,
    `.head div { line-height: 1.3rem; }`
  );
}
