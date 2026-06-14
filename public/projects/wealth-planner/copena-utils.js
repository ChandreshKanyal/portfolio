/* Copena — shared utilities. Loaded before page scripts in all calculator pages. */
const Cr=1e7,L=1e5;
function fmt(v){const c=v/Cr;if(c>=100)return'₹'+Math.round(c)+' Cr';if(c>=10)return'₹'+c.toFixed(1)+' Cr';if(c>=1)return'₹'+c.toFixed(2)+' Cr';const l=v/L;if(l>=1)return'₹'+l.toFixed(2)+'L';return'₹'+Math.round(v).toLocaleString('en-IN')}
function slide(el){delete el.dataset.override;el.style.setProperty('--pct',((el.value-el.min)/(el.max-el.min)*100)+'%')}
function rv(id){const el=document.getElementById(id);return el?(el.dataset.override!==undefined?+el.dataset.override:+el.value):0}
function parseRaw(s){if(!s||s==='—')return 0;s=s.replace(/₹|,|\s/g,'');if(s.endsWith('Cr'))return parseFloat(s)*1e7;if(s.endsWith('L'))return parseFloat(s)*1e5;if(s.endsWith('K'))return parseFloat(s)*1e3;return parseFloat(s)||0}
function animateVal(el,target,ms){if(target==='—'){el.textContent='—';el._t=0;return}const prev=el._t||0,next=parseRaw(target);if(prev===next){el.textContent=target;return}el._t=next;const t0=performance.now();(function step(now){const p=Math.min((now-t0)/ms,1),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;el.textContent=fmt(prev+(next-prev)*e);if(p<1)requestAnimationFrame(step);else el.textContent=target})(t0)}
function isDark(){return document.documentElement.getAttribute('data-theme')==='dark'}
function th(){return isDark()?{grid:'rgba(255,255,255,0.06)',tick:'#5A5855',axis:'rgba(255,255,255,0.08)',bg:'#1C1B19',bd:'rgba(255,255,255,0.10)',tc:'#F0EDE6',bc:'#8A8680'}:{grid:'rgba(0,0,0,0.05)',tick:'#B0ADA8',axis:'rgba(0,0,0,0.08)',bg:'#FFFFFF',bd:'rgba(0,0,0,0.10)',tc:'#1A1916',bc:'#7A7875'}}
function areaGrad(ctx,area,col,a){if(!area)return col+'33';const g=ctx.createLinearGradient(0,area.top,0,area.bottom);g.addColorStop(0,col+Math.round(a*255).toString(16).padStart(2,'0'));g.addColorStop(1,col+'05');return g}
function setLegend(id,items){document.getElementById(id).innerHTML=items.map(it=>`<div class="leg-item"><div class="leg-dot${it.dash?' dashed':''}" style="background:${it.c}"></div><span>${it.l}</span></div>`).join('')}
function parseNumInput(s){s=String(s).trim().replace(/[₹,\s]/g,'');if(/[Cc][Rr]$/.test(s))return parseFloat(s)*1e7;if(/[Ll]$/.test(s))return parseFloat(s)*1e5;if(/[Kk]$/.test(s))return parseFloat(s)*1e3;return parseFloat(s)}
function setVal(id,txt){const el=document.getElementById(id);if(el&&document.activeElement!==el)el.value=txt}
function numFocus(id){const sl=document.getElementById(id),nu=document.getElementById('v-'+id);if(sl&&nu){nu.value=sl.dataset.override!==undefined?sl.dataset.override:sl.value;nu.select()}}
function numBlur(id){const sl=document.getElementById(id),nu=document.getElementById('v-'+id);if(!sl||!nu)return;const v=parseNumInput(nu.value);if(!isNaN(v)&&v>=+sl.min){if(v>+sl.max){sl.value=sl.max;slide(sl);sl.dataset.override=v}else{sl.value=v;slide(sl)}}recalc()}
function numKey(e,id){if(e.key==='Enter')document.getElementById('v-'+id).blur()}
