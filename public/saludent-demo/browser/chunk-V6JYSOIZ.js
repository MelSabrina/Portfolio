import{e as C}from"./chunk-PZ4MTC7K.js";import{A as r,B as m,E as u,F as p,J as s,K as f,L as g,M as a,P as h,S as v,aa as y,ba as w,ka as x,w as l,y as c,z as d}from"./chunk-YWZUGVJD.js";import"./chunk-UOVZUEU7.js";import"./chunk-PRIH67NR.js";import"./chunk-VDAJZWAL.js";import"./chunk-WXIJF4PF.js";import"./chunk-FUYVFOST.js";import"./chunk-YUNOCBLG.js";import"./chunk-VGMJM2GZ.js";import"./chunk-2NIBOUWM.js";import"./chunk-I547WOKC.js";import"./chunk-UEXYWWPB.js";import"./chunk-PUYJVZLO.js";import"./chunk-NMFL75IO.js";import"./chunk-4CLCTAJ7.js";function M(o,E){if(o&1&&a(0,"iframe",1),o&2){let t=h();s("src",t.iframeSrc,c)}}function b(o,E){o&1&&(f(0,"ion-content",2)(1,"p"),v(2,"No se encontr\xF3 el contenido."),g()())}var _=(()=>{class o{route;sanitizer;el;title="";programKey="";iframeSrc=null;msgHandler;constructor(t,e,n){this.route=t,this.sanitizer=e,this.el=n}ngOnInit(){let t=this.route.snapshot.queryParamMap.get("file");this.title=this.route.snapshot.queryParamMap.get("title")||"Gu\xEDa",this.programKey=this.route.snapshot.queryParamMap.get("program")||"",t&&(this.iframeSrc=this.sanitizer.bypassSecurityTrustResourceUrl(t))}ngAfterViewInit(){let t=this.el.nativeElement.querySelector("iframe");t&&t.addEventListener("load",()=>{try{let e=t.contentDocument||t.contentWindow?.document;if(e){let n=e.createElement("style");n.textContent=[".toolbar{display:none!important;}","html,body,*{cursor:none!important;user-select:none!important;-webkit-user-select:none!important;}","::-webkit-scrollbar{display:none;}","*{scrollbar-width:none;}"].join(""),e.head.appendChild(n);let i=e.createElement("script");i.textContent=`(function(){
              /* Cursor relay */
              document.addEventListener('mousemove',function(e){
                window.parent.postMessage({type:'inner-cursor',x:e.clientX,y:e.clientY},'*');
              },true);
              document.addEventListener('mousedown',function(){
                window.parent.postMessage({type:'inner-mousedown'},'*');
              },true);
              document.addEventListener('mouseup',function(){
                window.parent.postMessage({type:'inner-mouseup'},'*');
              },true);

              /* Pan handler \u2014 find scroll targets on mousedown, lock axis on first move */
              function findScroll(el,horiz){
                var cur=el;
                while(cur&&cur!==document.documentElement){
                  var s=window.getComputedStyle(cur),ov=horiz?s.overflowX:s.overflowY;
                  if((ov==='auto'||ov==='scroll')&&(horiz?cur.scrollWidth>cur.clientWidth:cur.scrollHeight>cur.clientHeight))return cur;
                  cur=cur.parentElement;
                }
                return document.documentElement;
              }
              var sx=null,sy=null,ssl=0,sst=0,selH=null,selV=null,axis=null,moved=false;
              document.addEventListener('mousedown',function(e){
                sx=e.clientX;sy=e.clientY;moved=false;axis=null;
                selH=findScroll(e.target,true);
                selV=findScroll(e.target,false);
                ssl=selH?selH.scrollLeft:0;
                sst=selV?selV.scrollTop:0;
              },true);
              document.addEventListener('mousemove',function(e){
                if(sx===null)return;
                var dx=e.clientX-sx,dy=e.clientY-sy;
                if(!moved&&Math.max(Math.abs(dx),Math.abs(dy))>4){
                  moved=true;
                  axis=Math.abs(dx)>Math.abs(dy)?'h':'v';
                }
                if(!moved)return;
                if(axis==='h'&&selH)selH.scrollLeft=ssl-dx;
                if(axis==='v'&&selV)selV.scrollTop=sst-dy;
              },true);
              document.addEventListener('mouseup',function(){sx=null;},true);
              document.addEventListener('click',function(e){
                if(moved){e.stopPropagation();e.preventDefault();moved=false;}
              },true);
            })();`,e.head.appendChild(i)}}catch(e){console.warn("Cannot access iframe content:",e)}}),this.msgHandler=e=>{let n=this.el.nativeElement.querySelector("iframe");if(n)if(e.data?.type==="inner-cursor"){let i=n.getBoundingClientRect();window.parent.postMessage({type:"visitaps-cursor",x:i.left+e.data.x,y:i.top+e.data.y},"*")}else e.data?.type==="inner-mousedown"?window.parent.postMessage({type:"visitaps-mousedown"},"*"):e.data?.type==="inner-mouseup"&&window.parent.postMessage({type:"visitaps-mouseup"},"*")},window.addEventListener("message",this.msgHandler)}ngOnDestroy(){this.msgHandler&&window.removeEventListener("message",this.msgHandler)}static \u0275fac=function(e){return new(e||o)(r(w),r(y),r(l))};static \u0275cmp=m({type:o,selectors:[["app-visor-html"]],decls:3,vars:3,consts:[["backHref","/modulos",3,"title","programKey"],["frameborder","0","sandbox","allow-scripts allow-same-origin",1,"visor-frame",3,"src"],[1,"ion-padding"]],template:function(e,n){e&1&&(a(0,"app-banner",0),u(1,M,1,1,"iframe",1)(2,b,3,0,"ion-content",2)),e&2&&(s("title",n.title)("programKey",n.programKey),d(),p(n.iframeSrc?1:2))},dependencies:[x,C],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;height:100%;width:100%;overflow:hidden}ion-content[_ngcontent-%COMP%]{--padding-start: 0 !important;--padding-end: 0 !important;--padding-top: 0 !important;--padding-bottom: 0 !important;height:100%;display:flex;flex-direction:column}.visor-frame[_ngcontent-%COMP%]{flex:1;width:100%;min-width:0;border:none;background:#fff;overflow:auto}"]})}return o})();export{_ as VisorHtmlPage};
