// FORGE brand kit v1 — shared by every v2 template. Load after the page's own markup.
// Adds: F-tile wordmark (top right), series chip "SERIES · #NN" (top left), branded end card + sonic-logo timing.
(function(){
const B=window.BRAND={series:(window.CFG&&CFG.series)||'FORGE',ep:(window.CFG&&CFG.ep)||'',endDur:2.2};
const css=document.createElement('style');css.textContent=`
#bwm{position:absolute;right:64px;top:104px;display:flex;align-items:center;gap:14px;z-index:20}
.ftile{width:62px;height:62px;border-radius:16px;background:#FF6A1A;display:flex;align-items:center;justify-content:center;font-family:A;font-size:46px;color:#000;line-height:1}
#bwm .w{font-family:A;font-size:44px;letter-spacing:.06em;color:#fff}
#bchip{position:absolute;left:64px;top:112px;z-index:20;display:flex;align-items:center;gap:12px;font-weight:800;font-size:28px;letter-spacing:.2em;color:#fff;background:#1a1a1a;border:2px solid #FF6A1A;border-radius:999px;padding:10px 22px}
#bchip .ep{color:#FF6A1A}
#bend{position:absolute;inset:0;z-index:30;background:radial-gradient(70% 45% at 50% 45%,#2a1408,#050505 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0}
#bend .ftile{width:220px;height:220px;border-radius:56px;font-size:168px;box-shadow:0 0 120px #FF6A1A66}
#bend .w{margin-top:46px;font-family:A;font-size:150px;letter-spacing:.08em}
#bend .s{margin-top:8px;font-weight:800;font-size:40px;letter-spacing:.3em;color:#FF6A1A}
#bend .f{margin-top:70px;font-weight:600;font-size:42px;color:#cfcfcf}
#tag,#wm{display:none!important}`;
document.head.appendChild(css);
document.body.insertAdjacentHTML('beforeend',`<div id="bchip">${B.series}${B.ep?` <span class="ep">#${B.ep}</span>`:''}</div>
<div id="bwm"><div class="ftile">F</div><div class="w">FORGE</div></div>
<div id="bend"><div class="ftile">F</div><div class="w">FORGE</div><div class="s">GYM SCIENCE · DAILY</div><div class="f">${(window.CFG&&CFG.endLine)||'Follow for one every day'}</div></div>`);
// call from render(t) with the time the end card starts
B.end=function(t,t0){const e=document.getElementById('bend');const a=Math.max(0,Math.min(1,(t-t0)/.25));e.style.opacity=a;
  const tile=e.querySelector('.ftile');const p=Math.max(0,Math.min(1,(t-t0)/.35));const sc=t<t0?1.6:1+.6*Math.pow(1-p,3);tile.style.transform=`scale(${sc}) rotate(${(1-p)*-12}deg)`;
  const w=e.querySelectorAll('.w,.s,.f');w.forEach((x,i)=>{const q=Math.max(0,Math.min(1,(t-t0-.25-i*.12)/.3));x.style.opacity=q;x.style.transform=`translateY(${(1-q)*30}px)`});};
})();
