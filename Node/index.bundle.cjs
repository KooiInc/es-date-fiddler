var K=J(),oe=K;module.exports={DateX:oe,$D:K,DateXFactory:J};function J(){let c=re(m,p),M={get:(n,o)=>n[o]?N(n,o):c[o]?.(n),set:(n,o,a)=>c[o]?c[o](n,a):n[o],ownKeys:()=>Object.getOwnPropertyNames(c),has:(n,o)=>o in c||o in n};function d({name:n,fn:o,root:a,isMethod:i,proxifyResult:D}={}){if(!n||!o||!(o instanceof Function))return console.error("es-date-fiddler (extendWith): cannot extend without name and/or fn (function)");if(a)return Object.defineProperty(l,n,{value:(...u)=>{let h=o(...u);return h instanceof Date?m(h):h}}),console.log(`\u2714 created '${n}' root level method`);c=Object.freeze({...c,[n]:u=>(u=m(u),u.localeInfo&&u.relocate(u.localeInfo),i?(...h)=>D?m(o(u,...h)):o(u,...h):D?m(o(u)):o(u))}),console.log(`\u2714 created '${n}' ${i?"method":"getter"}`)}function p(n,o,a=!0){let i=D=>console.error(`invalid locale (time zone: "${D.timeZone}", locale: "${D.locale}"), associated your locale instead`);try{return Intl.DateTimeFormat(n,{timeZone:o}).resolvedOptions()}catch{return a&&i({locale:n,timeZone:o}),Intl.DateTimeFormat().resolvedOptions()}}function g(){return l()}function y({locale:n,timeZone:o}={}){if(!n&&!o)return!1;let a=p(n,o,!1);return n&&!o?a.locale===n:(o&&!n||a.locale===n)&&o===a.timeZone}function m(n){return new Proxy(n,M)}function N(n,o){return o in n&&n[o]instanceof Function?n[o].bind(n):n[o]}function T(){let n={mgm:"mutating getter method",c:"chainable",g:"getter",s:"setter",mg:"mutating getter",gm:"getter method"},o={};return Object.entries(Object.getOwnPropertyDescriptors(c)).sort(([a],[i])=>a.localeCompare(i)).forEach(([a,i])=>{let D=String(i.value).match(/(?<=\/\*).+?(?=\*\/)/)?.shift()?.split(",")?.map(u=>n[u]).join(", ");D&&(o[a]=D)}),Object.keys(o).length<1?(console.error("$D.describe can only be used with uncompressed code"),{}):o}function l(n,o){n=Array.isArray(n)?new Date(...n):n;let a=n?.locale||n?.timeZone,i=(n||"")instanceof Date,D=a?new Date:new Date(i?n:Date.parse(n)),u=isNaN(D)?new Date(Date.now()):D;return m(u).relocate(a?n:o)}function S(n,o){let a=l(n.replace(/T/," ")),i=l(o);return a.date.join("")===i.date.join("")}function w(n,o="ymd"){n=n.trim();let a=n?.split(/[T :\-\/.,]/g).filter(u=>!!u.trim()),i=()=>{let u=[...o].reduce((k,P,L)=>(k[P]=L,k),{}),h=a.slice(0,3),$=a.slice(3),[b,A,Y,W,E,U,C]=[+h[u.y],+h[u.m]-1,+h[u.d]].concat([...Array(4)].map((k,P)=>+$[P]||0));return b<1900?new Date(new Date(b,A,Y,W,E,U,C).setFullYear(b)):new Date(b,A,Y,W,E,U,C)},D={get cando(){return i()},get cannot(){if(!n||a?.length<3)return console.error(`dateFromString: can't convert "${n||"empty date string"}" to ES-Date`),!0;if(!S(n,i()))return console.error(`dateFromString: not what we expected. Check your input ("${n}" and "${o}")`),!0}};return D.cannot?new Date(NaN):D.cando}function s(n="en-GB"){return[...Array(7).keys()].map(o=>{let a=new Date(Date.UTC(1970,0,6+o)).toLocaleDateString(n,{weekday:"long"});return{[a]:{index:o,firstUp:a[0].toUpperCase()+a.slice(1)}}})}return Object.defineProperties(l,{now:{get(){return g()}},extendWith:{get(){return d}},validateLocale:{get(){return y}},ownFns:{get(){return Object.getOwnPropertyDescriptors(c)}},describe:{get(){return T()}},dateFromString:{value:w},localeWeekdays:{value:s}}),l}function re(c,M){let d=se(),p=e=>!(isNaN(parseInt(e))&&isNaN(+e)),g=e=>e?.constructor===Object,y=e=>+e.slice(e.indexOf("+")+1).replace(":","")||0,m=e=>e.localeInfo?.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone,N=e=>e.map(t=>String(t)?.padStart(2,"0")??t),T=e=>N(n(e)).join("-"),l=e=>Object.entries(e).filter(([,t])=>p(t)),S=e=>console.error(`clone${e?"Time":"Date"}To: no toDate given`),w=(e,t)=>g(t)&&l(t).forEach(([r,f])=>e[`set${r}`](f))&&!0||!1,s=e=>c(e).format("hh,mi,ss,ms").split(",").map(Number),n=e=>c(e).format("yyyy,mm,dd").split(",").map(Number),o=(e,t)=>w(e,t)||s(e),a=(e,t)=>w(e,t)||n(e),i=ce(),D=(e,t)=>c(new Date(e,t+1,1,0,0,0)).yesterday.getDate(),u=e=>c(new Date(e)).relocate(e.localeInfo?.locale,e.localeInfo?.timeZone),h=e=>c(new Date(e)).relocate(),$=ae(),b=(e,...t)=>c($(e,...t)),A=(e,t)=>[`${e&&!(Array.isArray(e)&&e.length<1)?`l:${e}`:""}`,`${t?`tz:${t}`:""}`].filter(r=>r).join(","),Y=e=>(delete e.localeInfo,c(e)),W=function(e,t){e=c(e);let{locale:r,timeZone:f}=e.localeInfo;return e.format(t?"MM":"WD",A(r,f))},E=e=>`.${String(e.getMilliseconds()).padStart(3,"0")}`,U=(e,t)=>e.toLocaleTimeString("en-GB",{timeZone:e.localeInfo?.timeZone})+(t?`${E(e)}`:"");function C(e,{locale:t,timeZone:r,validate:f=!0}={}){return e.localeInfo=t||r?k(e,{locale:t,timeZone:r,validate:f}):e.localeInfo,e.localeInfo}function k(e,{locale:t,timeZone:r}={}){let f=M(t,r);return e.localeInfo={locale:f.locale,timeZone:f.timeZone},e.formats=A(e.localeInfo.locale,e.localeInfo.timeZone),e.localeInfo}function P(e){e=c(e);let{locale:t,timeZone:r}=e.locale,f=r?{timeZone:r}:{};return e.toLocaleDateString(t,f)}function L(e){let t=m(e),r=new Date(e.getFullYear(),0,1,14),f=new Date(new Date(r).setMonth(6)),F=Intl.DateTimeFormat("en-CA",{year:"numeric",timeZone:t,timeZoneName:"shortOffset"}),[I,O]=[F.format(r),F.format(f)];return y(I)-y(O)!==0}function Q(e,t,r){return t||r?(C(e,{locale:t,timeZone:r}),c(e)):(e.localeInfo||C(e,M()),c(e))}function x(e,t){t=c(t??new Date);let r=c(e),{hour:f,minutes:F,seconds:I,ms:O}=r;return t.time={hour:f,minutes:F,seconds:I,ms:O},r.locale?(t.locale={locale:r.locale.locale,timeZone:r.locale.timeZone},t):(S(1),r)}function V(e){e=c(e);let{locale:t,timeZone:r}=e.locale??M();return e.toLocaleString(t,{timeZone:r})}function R(e,...t){e=c(e);let r,f,F;return e.locale&&(r=e.locale.locale,f=e.locale.timeZone,F=e.formats),t.length===1?d(e,t[0],F):t.length?d(e,...t):e.toLocaleString(r||[],f?{timeZone:f}:void 0)}function ee(e,t){t=c(t??new Date);let r=c(e);if(t){let[f,F,I]=r.date;return t.date={year:f,month:F,date:I},r.locale&&(t.locale={locale:r.locale.locale,timeZone:r.locale.timeZone}),t}return S(),r}function q(e){let t={timeZone:m(e),hourCycle:"h23"};try{return c(new Date(new Date(e.toLocaleString("en",t))))}catch(r){return console.error(`Can't retrieve localized date/time value for ${t.timeZone}: ${r.message}`),c(e)}}function j(e){let t=e.getMonth();e=c(e);let[r,f]=e.format("MM,WD").split(","),[F,I,O,Z,z,H,B,X]=e.format("yyyy,m,dd,hh,mmi,ss,ms,dp").split(","),ne=e.localeInfo?M(e.localeInfo.locale,e.localeInfo.timeZone):M();return{year:+F,month:+I,date:+O,hour:+Z,minutes:+z,seconds:+H,milliseconds:+B,dayPeriod:X!==""?X:"n/a",monthName:r,weekDay:f,resolvedLocale:ne,valuesArray:[F,+I-1,O,Z,z,H,B].map(Number)}}function _(e,t=!1){let r=q(e),f=q(t?c(e).clone.relocate({timeZone:"Etc/UTC"}):new Date(e));f.time=r.time={milliseconds:0};let F=r.differenceFrom(f).clean,I=/equal/.test(F);return`${I?"":+r>=+f?"+":"-"}${I?"no difference":F}`}function te(e,t){let r=0;for(e=c(e),t=c(t),e.time=t.time={hour:0,minutes:0,seconds:0,milliseconds:0},e>t&&([e,t]=[t,e]);e<t;)e.add("1 day"),r+=1;return r}function G(e,{day:t,next:r=!1,midnight:f=!0,forFirstWeekday:F=!1}={}){e=c(e);let I=e.clone,O=I.getDay();I.time=f?{hour:0,minutes:0,seconds:0,milliseconds:0}:{};let Z="sun,mon,tue,wed,thu,fri,sat".split(",").findIndex(H=>H===t),z=`${r?1:-1} days`;return F&&O===Z?I:Z<0?e:function(){for(O=O===Z?I.add(z).getDay():O;O!==Z;)O=I.add(z).getDay();return I}()}return{clone:u,cloneLocal:h,hasDST:L,dateStr:P,timeZone:e=>m(e),firstWeekday:e=>({sunday:t=!1,midnight:r=!1}={})=>G(e,{day:t?"sun":"mon",midnight:r,forFirstWeekday:!0}),next:e=>(t,{midnight:r=!1}={})=>G(e,{day:t,midnight:r,next:!0}),previous:e=>(t,{midnight:r=!1}={})=>G(e,{day:t,midnight:r}),year:(e,t)=>t&&e.setFullYear(t)||j(e).year,month:(e,t)=>t&&e.setMonth(v-1)||j(e).month,date:(e,{year:t,month:r,date:f}={})=>a(e,{FullYear:t,Month:p(r)?r-1:r,Date:f}),hour:(e,t)=>t&&e.setHours(t)||j(e).hour,minutes:(e,t)=>t&&e.setMinutes(t)||j(e).minutes,seconds:(e,t)=>t&&e.setSeconds(t)||j(e).seconds,cloneTimeTo:e=>t=>x(e,t),cloneDateTo:e=>t=>ee(e,t),local:e=>V(e),locale:(e,{locale:t,timeZone:r}={})=>C(e,{locale:t,timeZone:r}),removeLocale:e=>Y(e),relocate:e=>({locale:t,timeZone:r}={})=>Q(e,t,r),timeDiffToHere:e=>_(e),timeDiffToUTC:e=>_(e,!0),time:(e,{hour:t,minutes:r,seconds:f,milliseconds:F}={})=>o(e,{Hours:t,Minutes:r,Seconds:f,Milliseconds:F}),timeStr:e=>(t=!1)=>U(e,t),dateISOStr:e=>T(e),ms:(e,t)=>t&&e.setMilliseconds(t)||e.getMilliseconds(),monthName:e=>W(e,!0),weekDay:e=>W(e),self:e=>e,differenceFrom:e=>t=>i({start:e,end:t}),values:e=>j(e),ISO:e=>e.toISOString(),daysInMonth:e=>D(e.getFullYear(),e.getMonth()),isLeapYear:e=>D(e.getFullYear(),1)===29,format:e=>(...t)=>R(e,...t),daysUntil:e=>t=>te(e,t),addYears:e=>(t=1)=>b(e,`${t} years`),addMonths:e=>(t=1)=>b(e,`${t} months`),addWeeks:e=>(t=1)=>b(e,`${t*7} days`),addDays:e=>(t=1)=>b(e,`${t} days`),nextYear:e=>b(e,"1 year"),nextWeek:e=>b(e,"7 days"),previousWeek:e=>b(e,"subtract, 7 days"),previousYear:e=>b(e,"subtract, 1 year"),nextMonth:e=>b(e,"1 month"),previousMonth:e=>b(e,"subtract, 1 month"),tomorrow:e=>b(e,"1 day"),yesterday:e=>b(e,"subtract, 1 day"),add:e=>(...t)=>b(e,...t),subtract:e=>(...t)=>b(e,...["subtract"].concat([t]).flat())}}function se(){let[c,M,d,p]=["2-digit","numeric","long","short"],g={fixed:{MM:{month:d},M:{month:p},m:{month:M},mm:{month:c},yyyy:{year:M},yy:{year:c},WD:{weekday:d},wd:{weekday:p},d:{day:M},dd:{day:c},h:{hour:M},hh:{hour:c},mi:{minute:M},mmi:{minute:c},s:{second:M},ss:{second:c},ms:{fractionalSecondDigits:3},tz:{timeZoneName:"shortOffset"},dl:{locale:"default"},h12:{hour12:!1},yn:{yearName:""},ry:{relatedYear:!0},msp:{fractionalSecond:!0}},dynamic:{tzn:s=>({timeZoneName:s.slice(4)}),hrc:s=>({hourCycle:`h${s.slice(4)}`}),ds:s=>({dateStyle:s.slice(3)}),ts:s=>({timeStyle:s.slice(3)}),tz:s=>({timeZone:s.slice(3)}),e:s=>({era:s.slice(2)}),l:s=>({locale:s.slice(2)})}},y={...g,retrieveDyn(s){let n=s?.slice(0,s.indexOf(":"));return g.dynamic[n]&&g.dynamic[n](s)},get re(){return new RegExp(`\\b(${Object.keys(g.fixed).join("|")})\\b`,"g")}},m=(s="dtf",n=0)=>{let o=` ${s.replace(/(?<=\{)(.+?)(?=})/g,i=>`[${n++}]`).replace(/[{}]/g,"").trim()} `,a=s.match(/(?<=\{)(.+?)(?=})/g)||[];return{get texts(){return a},formatString(i){o=i},set formatStr(i){o=i},get formatStr(){return o},get units(){return o.match(y.re)||[]},finalize(i="",D="",u="",h=""){return o.replace(/~([\d+]?)/g,"$1").replace(/dtf/,i).replace(/era/,u).replace(/dp\b|~dp\b/,D).replace(/yn\b/,h).replace(/\[(\d+?)]/g,($,b)=>a[b].trim()).trim()}}},N=s=>s.replace(/\s+/g,""),T=(...s)=>s?.reduce((n,o)=>({...n,...y.retrieveDyn(o)||y.fixed[o]}),y.fixed.dl),l=(s,n,o)=>{let a=T(...N(o).split(",")),i=Intl.DateTimeFormat(a.locale,a).format(s);return n.finalize(i)},S=(s,n,o,a)=>s.toLocaleString(n,{timeZone:o,month:a?p:d}),w=(s,n,o)=>{let a=T(...n.units.concat(N(o).split(",")).flat()),i={...y.fixed},D=(h,$)=>a[h]==="numeric"&&$.startsWith("0")?$.slice(1):$,u=Intl.DateTimeFormat(a.locale,a).formatToParts(s).reduce((h,$)=>$.type==="literal"&&/[ ,/-]/.test($.value)?h:{...h,[$.type]:D($.type,$.value)},{});return i.ms=a.fractionalSecondDigits?i.msp:i.ms,i.yyyy=u.relatedYear?i.ry:i.yyyy,n.formatStr=n.formatStr.replace(y.re,h=>/^(M|MM)$/.test(h)?S(s,a.locale,a.timeZone,/^M$/.test(h)):u[Object.keys(i[h]).shift()]||h),n.finalize(void 0,u.dayPeriod,u.era,u.yearName)};return(s,n,o="l:default")=>/ds:|ts:/.test(o)?l(s,m(void 0),o):w(s,m(n||void 0),o)}function ce(){let c=(p,g)=>{let y=isNaN(p),m=isNaN(g);if(y&&!m){let[N,T,l]=Array(3).fill("start- and/or end date are not valid");return{error:!0,message:N,full:T,clean:l}}if(m){let[N,T,l]=Array(3).fill("end date not valid");return{error:!0,message:N,full:T,clean:l}}if(y){let[N,T,l]=Array(3).fill("start date not valid");return{error:!0,message:N,full:T,clean:l}}return{error:!1}},M=d();return function({start:g,end:y}={}){let m=new Date(Date.parse(g)),N=new Date(Date.parse(y)),T=c(m,N);if(T.error)return T;let l=new Date(g),S=new Date(y),w=Math.abs(S-l),s=new Date(w),n=s.getUTCFullYear()-1970,o=s.getUTCMonth(),a=s.getUTCDate()-1,i=s.getUTCHours(),D=s.getUTCMinutes(),u=s.getUTCSeconds(),h=s.getUTCMilliseconds(),$={from:l,to:S,years:n,months:o,days:a,hours:i,minutes:D,seconds:u,milliseconds:h};return $.full=M({values:$,full:!0}),$.clean=M({values:$}),$};function d(){let p=(...l)=>S=>l.reduce((w,s)=>s(w),S),g=(l,S)=>l===1?S.slice(0,-1):S;return p(({values:l,full:S})=>[Object.entries(l).filter(([w])=>/^(years|month|days|hours|minutes|seconds)/i.test(w)),S],([l,S])=>S?l:l.filter(([,w])=>S?+w:w>0),l=>l.reduce((S,[w,s])=>[...S,`${s} ${g(s,w)}`],[]),l=>l.length<1?"Dates are equal":`${l.slice(0,-1).join(", ")}${l.length>1?" and ":""}${l.slice(-1).shift()}`)}}function ae(){let c=Object.entries({year:"FullYear",month:"Month",date:"Date",day:"Date",hour:"Hours",minute:"Minutes",second:"Seconds",millisecond:"Milliseconds"}).reduce((d,[p,g])=>({...d,[p]:g,[`${p}s`]:g}),{}),M=function(...d){if(d.length<1)return[];let p;d[0].startsWith("subtract")&&(p=!0,d[0].startsWith("subtract")&&d.length===1&&(d=d[0].split(",")),d=d.slice(1));let g=d.length===1?d[0]?.split(/,/):d;return g&&g.length&&(d=g.map(y=>y.trim())),d.map(function(y){return y.toLowerCase().split(/\s/).map(m=>(m=m.trim(),parseInt(m)?p?-m:+m:m))})};return function(d,...p){let g=M(...p);return g.length&&g.forEach(([y,m])=>{m=c[m],+y&&m&&d[`set${m}`](d[`get${m}`]()+ +y)}),d}}
