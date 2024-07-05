System.register(["./main-legacy-L51glwCA.js","./index8-legacy-SHDvohxk.js"],(function(e,t){"use strict";var n,r,s,i,o;return{setters:[e=>{n=e.r,r=e.a,s=e.w},e=>{i=e.f,o=e.s}],execute:function(){
/*!
             * (C) Ionic http://ionicframework.com - MIT License
             */
e("startStatusTap",(()=>{const e=window;e.addEventListener("statusTap",(()=>{n((()=>{const t=e.innerWidth,n=e.innerHeight,a=document.elementFromPoint(t/2,n/2);if(!a)return;const c=i(a);c&&new Promise((e=>r(c,e))).then((()=>{s((async()=>{c.style.setProperty("--overflow","hidden"),await o(c,300),c.style.removeProperty("--overflow")}))}))}))}))}))}}}));
