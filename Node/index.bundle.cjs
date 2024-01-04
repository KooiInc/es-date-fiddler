var E=U(),ne=E;module.exports={DateX:ne,$D:E,DateXFactory:U};function U(){let c=oe(l,y),D={get:(o,n)=>o[n]?I(o,n):c[n]?.(o),set:(o,n,s)=>c[n]?c[n](o,s):o[n],ownKeys:()=>Object.getOwnPropertyNames(c),has:(o,n)=>n in c||n in o};function f({name:o,fn:n,root:s,isMethod:u,proxifyResult:d}={}){if(!o||!n||!(n instanceof Function))return console.error("es-date-fiddler (extendWith): cannot extend without name and/or fn (function)");if(s)return Object.defineProperty(i,o,{value:(...a)=>{let $=n(...a);return $ instanceof Date?l($):$}}),console.log(`\u2714 created '${o}' root level method`);c=Object.freeze({...c,[o]:a=>(a=l(a),a.localeInfo&&a.relocate(a.localeInfo),u?(...$)=>d?l(n(a,...$)):n(a,...$):d?l(n(a)):n(a))}),console.log(`\u2714 created '${o}' ${u?"method":"getter"}`)}function y(o,n,s=!0){let u=d=>console.error(`invalid locale (time zone: "${d.timeZone}", locale: "${d.locale}"), associated your locale instead`);try{return Intl.DateTimeFormat(o,{timeZone:n}).resolvedOptions()}catch{return s&&u({locale:o,timeZone:n}),Intl.DateTimeFormat().resolvedOptions()}}function h(){return i()}function g({locale:o,timeZone:n}={}){if(!o&&!n)return!1;let s=y(o,n,!1);return o&&!n?s.locale===o:(n&&!o||s.locale===o)&&n===s.timeZone}function l(o){return new Proxy(o,D)}function I(o,n){return n in o&&o[n]instanceof Function?o[n].bind(o):o[n]}function b(){let o={mgm:"mutating getter method",c:"chainable",g:"getter",s:"setter",mg:"mutating getter",gm:"getter method"},n={};return Object.entries(Object.getOwnPropertyDescriptors(c)).sort(([s],[u])=>s.localeCompare(u)).forEach(([s,u])=>{let d=String(u.value).match(/(?<=\/\*).+?(?=\*\/)/)?.shift()?.split(",")?.map(a=>o[a]).join(", ");d&&(n[s]=d)}),Object.keys(n).length<1?(console.error("$D.describe can only be used with uncompressed code"),{}):n}function i(o,n){o=Array.isArray(o)?new Date(...o):o;let s=o?.locale||o?.timeZone,u=(o||"")instanceof Date,d=s?new Date:new Date(u?o:Date.parse(o)),a=isNaN(d)?new Date(Date.now()):d;return l(a).relocate(s?o:n)}return Object.defineProperties(i,{now:{get(){return h()}},extendWith:{get(){return f}},validateLocale:{get(){return g}},ownFns:{get(){return Object.getOwnPropertyDescriptors(c)}},describe:{get(){return b()}}}),i}function oe(c,D){let f=re(),y=e=>!(isNaN(parseInt(e))&&isNaN(+e)),h=e=>e?.constructor===Object,g=e=>+e.slice(e.indexOf("+")+1).replace(":","")||0,l=e=>e.localeInfo?.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone,I=e=>e.map(t=>String(t)?.padStart(2,"0")??t),b=e=>I(u(e)).join("-"),i=e=>Object.entries(e).filter(([,t])=>y(t)),o=e=>console.error(`clone${e?"Time":"Date"}To: no toDate given`),n=(e,t)=>h(t)&&i(t).forEach(([r,m])=>e[`set${r}`](m))&&!0||!1,s=e=>c(e).format("hh,mi,ss,ms").split(",").map(Number),u=e=>c(e).format("yyyy,mm,dd").split(",").map(Number),d=(e,t)=>n(e,t)||s(e),a=(e,t)=>n(e,t)||u(e),$=se(),O=(e,t)=>c(new Date(e,t+1,1,0,0,0)).yesterday.getDate(),M=e=>c(new Date(e)).relocate(e.localeInfo?.locale,e.localeInfo?.timeZone),w=e=>c(new Date(e)).relocate(),N=ce(),F=(e,...t)=>c(N(e,...t)),k=(e,t)=>[`${e&&!(Array.isArray(e)&&e.length<1)?`l:${e}`:""}`,`${t?`tz:${t}`:""}`].filter(r=>r).join(","),H=e=>(delete e.localeInfo,c(e)),P=function(e,t){return e=c(e),e.format(t?"MM":"WD",`l:${e.locale?.locale||"utc"}`)},L=e=>`.${String(e.getMilliseconds()).padStart(3,"0")}`,q=(e,t)=>e.toLocaleTimeString("en-GB",{timeZone:e.localeInfo?.timeZone})+(t?`${L(e)}`:"");function z(e,{locale:t,timeZone:r,validate:m=!0}={}){return e.localeInfo=t||r?G(e,{locale:t,timeZone:r,validate:m}):e.localeInfo,e.localeInfo}function G(e,{locale:t,timeZone:r}={}){let m=D(t,r);return e.localeInfo={locale:m.locale,timeZone:m.timeZone},e.formats=k(e.localeInfo.locale,e.localeInfo.timeZone),e.localeInfo}function X(e){e=c(e);let{locale:t,timeZone:r}=e.locale,m=r?{timeZone:r}:{};return e.toLocaleDateString(t,m)}function _(e){let t=l(e),r=new Date(e.getFullYear(),0,1,14),m=new Date(new Date(r).setMonth(6)),p=Intl.DateTimeFormat("en-CA",{year:"numeric",timeZone:t,timeZoneName:"shortOffset"}),[S,T]=[p.format(r),p.format(m)];return g(S)-g(T)!==0}function B(e,t,r){return t||r?(z(e,{locale:t,timeZone:r}),c(e)):(e.localeInfo||z(e,D()),c(e))}function K(e,t){t=c(t??new Date);let r=c(e),{hour:m,minutes:p,seconds:S,ms:T}=r;return t.time={hour:m,minutes:p,seconds:S,ms:T},r.locale?(t.locale={locale:r.locale.locale,timeZone:r.locale.timeZone},t):(o(1),r)}function J(e){e=c(e);let{locale:t,timeZone:r}=e.locale??D();return e.toLocaleString(t,{timeZone:r})}function Q(e,...t){e=c(e);let r,m,p;return e.locale&&(r=e.locale.locale,m=e.locale.timeZone,p=e.formats),t.length===1?f(e,t[0],p):t.length?f(e,...t):e.toLocaleString(r||[],m?{timeZone:m}:void 0)}function x(e,t){t=c(t??new Date);let r=c(e);if(t){let[m,p,S]=r.date;return t.date={year:m,month:p,date:S},r.locale&&(t.locale={locale:r.locale.locale,timeZone:r.locale.timeZone}),t}return o(),r}function Y(e){let t={timeZone:l(e),hourCycle:"h23"};try{return c(new Date(new Date(e.toLocaleString("en",t))))}catch(r){return console.error(`Can't retrieve localized date/time value for ${t.timeZone}: ${r.message}`),c(e)}}function Z(e){e=c(e);let[t,r,m,p,S,T,j,C]=e.format("yyyy,mm,dd,hh,mmi,ss,ms,dp").split(","),[W,ee]=e.format("WD,MM").split(","),te=e.localeInfo?D(e.localeInfo.locale,e.localeInfo.timeZone):D();return{year:+t,month:+r,date:+m,hour:+p,minutes:+S,seconds:+T,milliseconds:+j,dayPeriod:C!==""?C:"n/a",monthName:ee,weekDay:W,resolvedLocale:te,valuesArray:[t,r-1,m,p,S,T,j].map(Number)}}function V(e){let t=Y(e),r=Y(new Date(e));r.time=t.time={milliseconds:0};let m=t.differenceFrom(r).clean,p=/equal/.test(m);return`${p?"":+t>=+r?"+":"-"}${p?"no difference":m}`}function R(e,t){let r=0;for(e=c(e),t=c(t),e.time=t.time={hour:0,minutes:0,seconds:0,milliseconds:0},e>t&&([e,t]=[t,e]);e<t;)e.add("1 day"),r+=1;return r}function A(e,{day:t,next:r=!1,midnight:m=!0,forFirstWeekday:p=!1}={}){e=c(e);let S=e.clone,T=S.getDay();S.time=m?{hour:0,minutes:0,seconds:0,milliseconds:0}:{};let j="sun,mon,tue,wed,thu,fri,sat".split(",").findIndex(W=>W===t),C=`${r?1:-1} days`;return p&&T===j?S:j<0?e:function(){for(T=T===j?S.add(C).getDay():T;T!==j;)T=S.add(C).getDay();return S}()}return{clone:M,cloneLocal:w,hasDST:_,dateStr:X,timeZone:e=>l(e),firstWeekday:e=>({sunday:t=!1,midnight:r=!1}={})=>A(e,{day:t?"sun":"mon",midnight:r,forFirstWeekday:!0}),next:e=>(t,{midnight:r=!1}={})=>A(e,{day:t,midnight:r,next:!0}),previous:e=>(t,{midnight:r=!1}={})=>A(e,{day:t,midnight:r}),year:(e,t)=>t&&e.setFullYear(t)||Z(e).year,month:(e,t)=>t&&e.setMonth(v-1)||Z(e).month,date:(e,{year:t,month:r,date:m}={})=>a(e,{FullYear:t,Month:y(r)?r-1:r,Date:m}),hour:(e,t)=>t&&e.setHours(t)||Z(e).hour,minutes:(e,t)=>t&&e.setMinutes(t)||Z(e).minutes,seconds:(e,t)=>t&&e.setSeconds(t)||Z(e).seconds,cloneTimeTo:e=>t=>K(e,t),cloneDateTo:e=>t=>x(e,t),local:e=>J(e),locale:(e,{locale:t,timeZone:r}={})=>z(e,{locale:t,timeZone:r}),removeLocale:e=>H(e),relocate:e=>({locale:t,timeZone:r}={})=>B(e,t,r),timeDiffToHere:e=>V(e),time:(e,{hour:t,minutes:r,seconds:m,milliseconds:p}={})=>d(e,{Hours:t,Minutes:r,Seconds:m,Milliseconds:p}),timeStr:e=>(t=!1)=>q(e,t),dateISOStr:e=>b(e),ms:(e,t)=>t&&e.setMilliseconds(t)||e.getMilliseconds(),monthName:e=>P(e,!0),weekDay:e=>P(e),self:e=>e,differenceFrom:e=>t=>$({start:e,end:t}),values:e=>Z(e),ISO:e=>e.toISOString(),daysInMonth:e=>O(e.getFullYear(),e.getMonth()),isLeapYear:e=>O(e.getFullYear(),1)===29,format:e=>(...t)=>Q(e,...t),daysUntil:e=>t=>R(e,t),addYears:e=>(t=1)=>F(e,`${t} years`),addMonths:e=>(t=1)=>F(e,`${t} months`),addWeeks:e=>(t=1)=>F(e,`${t*7} days`),addDays:e=>(t=1)=>F(e,`${t} days`),nextYear:e=>F(e,"1 year"),nextWeek:e=>F(e,"7 days"),previousWeek:e=>F(e,"subtract, 7 days"),previousYear:e=>F(e,"subtract, 1 year"),nextMonth:e=>F(e,"1 month"),previousMonth:e=>F(e,"subtract, 1 month"),tomorrow:e=>F(e,"1 day"),yesterday:e=>F(e,"subtract, 1 day"),add:e=>(...t)=>F(e,...t),subtract:e=>(...t)=>F(e,...["subtract"].concat([t]).flat())}}function re(){let[c,D,f,y]=["2-digit","numeric","long","short"],h={fixed:{MM:{month:f},M:{month:y},m:{month:D},mm:{month:c},yyyy:{year:D},yy:{year:c},WD:{weekday:f},wd:{weekday:y},d:{day:D},dd:{day:c},h:{hour:D},hh:{hour:c},mi:{minute:D},mmi:{minute:c},s:{second:D},ss:{second:c},ms:{fractionalSecondDigits:3},tz:{timeZoneName:"shortOffset"},dl:{locale:"default"},h12:{hour12:!1},yn:{yearName:""},ry:{relatedYear:!0},msp:{fractionalSecond:!0}},dynamic:{tzn:n=>({timeZoneName:n.slice(4)}),hrc:n=>({hourCycle:`h${n.slice(4)}`}),ds:n=>({dateStyle:n.slice(3)}),ts:n=>({timeStyle:n.slice(3)}),tz:n=>({timeZone:n.slice(3)}),e:n=>({era:n.slice(2)}),l:n=>({locale:n.slice(2)})}},g={...h,retrieveDyn(n){let s=n?.slice(0,n.indexOf(":"));return h.dynamic[s]&&h.dynamic[s](n)},get re(){return new RegExp(`\\b(${Object.keys(h.fixed).join("|")})\\b`,"g")}},l=(n="dtf",s=0)=>{let u=` ${n.replace(/(?<=\{)(.+?)(?=})/g,a=>`[${s++}]`).replace(/[{}]/g,"").trim()} `,d=n.match(/(?<=\{)(.+?)(?=})/g)||[];return{get texts(){return d},formatString(a){u=a},set formatStr(a){u=a},get formatStr(){return u},get units(){return u.match(g.re)||[]},finalize(a="",$="",O="",M=""){return u.replace(/~([\d+]?)/g,"$1").replace(/dtf/,a).replace(/era/,O).replace(/dp\b|~dp\b/,$).replace(/yn\b/,M).replace(/\[(\d+?)]/g,(w,N)=>d[N].trim()).trim()}}},I=n=>n.replace(/\s+/g,""),b=(...n)=>n?.reduce((s,u)=>({...s,...g.retrieveDyn(u)||g.fixed[u]}),g.fixed.dl),i=(n,s,u)=>{let d=b(...I(u).split(",")),a=Intl.DateTimeFormat(d.locale,d).format(n);return s.finalize(a)},o=(n,s,u)=>{let d=b(...s.units.concat(I(u).split(",")).flat()),a={...g.fixed},$=(M,w)=>d[M]==="numeric"&&w.startsWith("0")?w.slice(1):w,O=Intl.DateTimeFormat(d.locale,d).formatToParts(n).reduce((M,w)=>w.type==="literal"?M:{...M,[w.type]:$(w.type,w.value)},{});return a.ms=d.fractionalSecondDigits?a.msp:a.ms,a.yyyy=O.relatedYear?a.ry:a.yyyy,s.formatStr=s.formatStr.replace(g.re,M=>O[Object.keys(a[M]).shift()]||M),s.finalize(void 0,O.dayPeriod,O.era,O.yearName)};return(n,s,u="l:default")=>/ds:|ts:/.test(u)?i(n,l(void 0),u):o(n,l(s||void 0),u)}function se(){let c=(y,h)=>{let g=isNaN(y),l=isNaN(h);if(g&&!l){let[I,b,i]=Array(3).fill("start- and/or end date are not valid");return{error:!0,message:I,full:b,clean:i}}if(l){let[I,b,i]=Array(3).fill("end date not valid");return{error:!0,message:I,full:b,clean:i}}if(g){let[I,b,i]=Array(3).fill("start date not valid");return{error:!0,message:I,full:b,clean:i}}return{error:!1}},D=f();return function({start:h,end:g}={}){let l=new Date(Date.parse(h)),I=new Date(Date.parse(g)),b=c(l,I);if(b.error)return b;let i=new Date(h),o=new Date(g),n=Math.abs(o-i),s=new Date(n),u=s.getUTCFullYear()-1970,d=s.getUTCMonth(),a=s.getUTCDate()-1,$=s.getUTCHours(),O=s.getUTCMinutes(),M=s.getUTCSeconds(),w=s.getUTCMilliseconds(),N={from:i,to:o,years:u,months:d,days:a,hours:$,minutes:O,seconds:M,milliseconds:w};return N.full=D({values:N,full:!0}),N.clean=D({values:N}),N};function f(){let y=(...i)=>o=>i.reduce((n,s)=>s(n),o),h=(i,o)=>i===1?o.slice(0,-1):o;return y(({values:i,full:o})=>[Object.entries(i).filter(([n])=>/^(years|month|days|hours|minutes|seconds)/i.test(n)),o],([i,o])=>o?i:i.filter(([,n])=>o?+n:n>0),i=>i.reduce((o,[n,s])=>[...o,`${s} ${h(s,n)}`],[]),i=>i.length<1?"Dates are equal":`${i.slice(0,-1).join(", ")}${i.length>1?" and ":""}${i.slice(-1).shift()}`)}}function ce(){let c=Object.entries({year:"FullYear",month:"Month",date:"Date",day:"Date",hour:"Hours",minute:"Minutes",second:"Seconds",millisecond:"Milliseconds"}).reduce((f,[y,h])=>({...f,[y]:h,[`${y}s`]:h}),{}),D=function(...f){if(f.length<1)return[];let y;f[0].startsWith("subtract")&&(y=!0,f[0].startsWith("subtract")&&f.length===1&&(f=f[0].split(",")),f=f.slice(1));let h=f.length===1?f[0]?.split(/,/):f;return h&&h.length&&(f=h.map(g=>g.trim())),f.map(function(g){return g.toLowerCase().split(/\s/).map(l=>(l=l.trim(),parseInt(l)?y?-l:+l:l))})};return function(f,...y){let h=D(...y);return h.length&&h.forEach(([g,l])=>{l=c[l],+g&&l&&f[`set${l}`](f[`get${l}`]()+ +g)}),f}}
