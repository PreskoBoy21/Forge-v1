// Flat illustrated food for FORGE food videos (SVG strings, centred at 0,0, ~200px wide at s=1)
const FOOD={
 burger:()=>`<ellipse cx="0" cy="62" rx="118" ry="14" fill="#000" opacity=".35"/>
  <path d="M-110,40 Q-110,62 -90,62 L90,62 Q110,62 110,40 Z" fill="#d9903f"/>
  <rect x="-116" y="14" width="232" height="26" rx="12" fill="#5a2d17"/>
  <path d="M-120,10 L120,10 L104,24 L80,12 L56,26 L30,12 L6,26 L-20,12 L-44,26 L-68,12 L-92,26 Z" fill="#f2c230"/>
  <path d="M-118,4 Q-80,-12 -40,2 Q0,-14 40,2 Q80,-12 118,4 L118,10 L-118,10 Z" fill="#4caf50"/>
  <path d="M-112,0 Q-112,-86 0,-86 Q112,-86 112,0 Z" fill="#e3a24f"/>
  <g fill="#fff3d6"><ellipse cx="-40" cy="-56" rx="6" ry="3"/><ellipse cx="10" cy="-66" rx="6" ry="3"/><ellipse cx="50" cy="-46" rx="6" ry="3"/><ellipse cx="-10" cy="-40" rx="6" ry="3"/></g>`,
 fries:()=>`<ellipse cx="0" cy="70" rx="70" ry="10" fill="#000" opacity=".35"/>
  <g fill="#f6c945" stroke="#d9a51e" stroke-width="2">${[-44,-26,-8,10,28,44].map((x,i)=>`<rect x="${x-7}" y="${-70-(i%3)*14}" width="14" height="90" rx="4" transform="rotate(${(i-2.5)*4} ${x} 0)"/>`).join('')}</g>
  <path d="M-60,-10 L60,-10 L48,70 L-48,70 Z" fill="#FF6A1A"/><rect x="-36" y="18" width="72" height="8" rx="4" fill="#000" opacity=".25"/>`,
 plate:()=>`<ellipse cx="0" cy="16" rx="300" ry="84" fill="#000" opacity=".4"/><ellipse cx="0" cy="0" rx="300" ry="84" fill="#e8e8e8"/><ellipse cx="0" cy="0" rx="250" ry="66" fill="#f7f7f7"/>`,
 chicken:()=>`<path d="M-90,-6 Q-80,-52 0,-50 Q86,-46 94,-6 Q96,30 0,30 Q-96,30 -90,-6 Z" fill="#c98a4b"/>
  <g stroke="#7a4a1f" stroke-width="7" stroke-linecap="round" opacity=".8"><path d="M-50,-34 L-20,14"/><path d="M-10,-40 L20,14"/><path d="M30,-38 L60,8"/></g>`,
 potato:()=>`<ellipse cx="0" cy="0" rx="30" ry="24" fill="#e6b85c"/><ellipse cx="-8" cy="-8" rx="10" ry="6" fill="#f6d68a"/><circle cx="12" cy="6" r="3" fill="#a3762c"/>`,
 leaf:()=>`<path d="M-40,10 Q-30,-40 30,-30 Q50,0 10,24 Q-20,34 -40,10 Z" fill="#5cb85c"/><path d="M-34,12 Q0,-6 26,-24" stroke="#3d8b3d" stroke-width="3" fill="none"/>`,
 tomato:()=>`<circle r="18" fill="#e53935"/><circle cx="-5" cy="-6" r="5" fill="#ff8a80"/>`,
 berry:()=>`<circle r="13" fill="#5e35b1"/><circle cx="-4" cy="-4" r="4" fill="#9575cd"/>`,
 straw:()=>`<path d="M0,-18 Q20,-14 16,6 Q8,22 0,24 Q-8,22 -16,6 Q-20,-14 0,-18 Z" fill="#e53935"/><path d="M-10,-18 L0,-26 L10,-18 Z" fill="#4caf50"/>`,
};
Object.assign(FOOD,{
 rice:()=>`<ellipse cx="0" cy="10" rx="70" ry="22" fill="#000" opacity=".3"/><path d="M-62,0 Q-50,-48 0,-50 Q50,-48 62,0 Z" fill="#fafafa"/><g fill="#e4e4e4">${[[-30,-20],[-6,-34],[18,-22],[34,-8],[-40,-6],[4,-12]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="3"/>`).join('')}</g>`,
 egg:()=>`<ellipse cx="0" cy="0" rx="46" ry="34" fill="#fff"/><circle cx="6" cy="-2" r="17" fill="#ffb300"/><circle cx="1" cy="-7" r="5" fill="#ffe082"/>`,
 oats:()=>`<path d="M-70,-10 L70,-10 Q66,50 0,54 Q-66,50 -70,-10 Z" fill="#FF6A1A"/><ellipse cx="0" cy="-10" rx="70" ry="16" fill="#e8d3a3"/><g fill="#c9a96a">${[-40,-18,6,30].map(x=>`<ellipse cx="${x}" cy="-12" rx="8" ry="4"/>`).join('')}</g>`,
 yogurt:()=>`<path d="M-54,-40 L54,-40 L44,50 L-44,50 Z" fill="#f5f5f5" stroke="#cfcfcf" stroke-width="3"/><rect x="-58" y="-52" width="116" height="16" rx="6" fill="#FF6A1A"/><text x="0" y="16" text-anchor="middle" font-family="I" font-weight="800" font-size="22" fill="#555">GREEK</text>`,
 popcorn:()=>`<g fill="#fff8dc" stroke="#e6d49a" stroke-width="2">${[[-34,-50],[-6,-62],[22,-52],[-20,-36],[10,-40],[36,-34]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="16"/>`).join('')}</g><path d="M-52,-30 L52,-30 L40,60 L-40,60 Z" fill="#fff"/><g fill="#FF6A1A"><path d="M-30,-30 L-18,-30 L-14,60 L-26,60 Z"/><path d="M6,-30 L18,-30 L16,60 L4,60 Z"/></g>`,
 watermelon:()=>`<path d="M-80,-10 A80,80 0 0 0 80,-10 Z" fill="#43a047"/><path d="M-70,-10 A70,70 0 0 0 70,-10 Z" fill="#fff59d"/><path d="M-64,-10 A64,64 0 0 0 64,-10 Z" fill="#ef5350"/><g fill="#222">${[[-30,10],[0,24],[28,10],[-12,36],[14,38]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="3" ry="5"/>`).join('')}</g>`,
 pizza:()=>`<path d="M0,70 L-60,-50 Q0,-74 60,-50 Z" fill="#ffca28"/><path d="M-60,-50 Q0,-74 60,-50 L56,-40 Q0,-62 -56,-40 Z" fill="#d18b3d"/><g fill="#c62828"><circle cx="-10" cy="-20" r="11"/><circle cx="18" cy="0" r="10"/><circle cx="-4" cy="26" r="9"/></g>`,
 donut:()=>`<circle r="60" fill="#d9903f"/><path d="M-56,-10 Q-50,-56 0,-58 Q52,-56 58,-6 Q40,20 0,12 Q-40,22 -56,-10 Z" fill="#f48fb1"/><circle r="20" fill="#050505"/><g stroke-width="5" stroke-linecap="round">${[[-36,-30,'#fff'],[30,-36,'#ffeb3b'],[40,-6,'#4fc3f7'],[-20,-44,'#81c784']].map(([x,y,c])=>`<path d="M${x},${y} l8,4" stroke="${c}"/>`).join('')}</g>`,
 latte:()=>`<path d="M-44,-60 L44,-60 L36,64 L-36,64 Z" fill="#f5f5f5"/><rect x="-48" y="-72" width="96" height="16" rx="6" fill="#4e342e"/><rect x="-41" y="-20" width="82" height="34" fill="#FF6A1A"/><path d="M-4,-72 L10,-100" stroke="#ddd" stroke-width="6"/>`,
 oil:()=>`<path d="M-26,-40 L26,-40 L34,70 L-34,70 Z" fill="#fdd835" opacity=".9"/><rect x="-12" y="-70" width="24" height="32" fill="#c0ca33"/><rect x="-16" y="-84" width="32" height="16" rx="4" fill="#33691e"/><rect x="-30" y="10" width="60" height="30" fill="#fff" opacity=".8"/><text x="0" y="32" text-anchor="middle" font-family="I" font-weight="800" font-size="16" fill="#555">OIL</text>`,
 sauce:()=>`<path d="M-30,-30 Q-34,70 0,72 Q34,70 30,-30 Z" fill="#e53935"/><rect x="-16" y="-60" width="32" height="32" rx="6" fill="#fafafa"/><path d="M-6,-60 L0,-80 L6,-60 Z" fill="#fafafa"/>`,
 nuts:()=>`<ellipse cx="0" cy="20" rx="70" ry="18" fill="#000" opacity=".3"/><g fill="#a1673a" stroke="#6d4322" stroke-width="2">${[[-40,0],[-14,-10],[12,2],[38,-6],[-24,14],[2,16],[28,14]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="16" ry="11"/>`).join('')}</g>`,
 choc:()=>`<rect x="-70" y="-36" width="140" height="72" rx="8" fill="#5d4037"/><g fill="#6d4c41">${[-52,-18,16,50].map(x=>[-20,12].map(y=>`<rect x="${x-14}" y="${y-12}" width="28" height="24" rx="3"/>`).join('')).join('')}</g><rect x="20" y="-40" width="56" height="80" fill="#FF6A1A"/>`,
 banana:()=>`<path d="M-70,-30 Q-60,50 60,40 Q76,36 70,24 Q-20,34 -50,-40 Z" fill="#fdd835" stroke="#c6a700" stroke-width="3"/><path d="M-70,-30 L-58,-44" stroke="#5d4037" stroke-width="6"/>`,
 shake:()=>`<path d="M-40,-60 L40,-60 L32,70 L-32,70 Z" fill="#d7ccc8"/><rect x="-44" y="-74" width="88" height="18" rx="6" fill="#222"/><rect x="-36" y="-10" width="72" height="30" fill="#FF6A1A"/>`,
 salmon:()=>`<path d="M-90,0 Q-70,-44 0,-40 Q80,-36 96,0 Q80,34 0,36 Q-70,40 -90,0 Z" fill="#ff8a65"/><g stroke="#fff" stroke-width="4" opacity=".7" fill="none"><path d="M-50,-30 Q-40,0 -50,30"/><path d="M-14,-36 Q-4,0 -14,34"/><path d="M24,-34 Q34,0 24,32"/></g>`,
 avocado:()=>`<path d="M0,-70 Q40,-60 46,10 Q48,66 0,68 Q-48,66 -46,10 Q-40,-60 0,-70 Z" fill="#7cb342"/><path d="M0,-58 Q32,-50 36,10 Q38,56 0,58 Q-38,56 -36,10 Q-32,-50 0,-58 Z" fill="#dce775"/><circle cx="0" cy="20" r="20" fill="#795548"/>`,
 bread:()=>`<path d="M-60,60 L-60,-20 Q-76,-30 -66,-52 Q-40,-76 0,-74 Q40,-76 66,-52 Q76,-30 60,-20 L60,60 Z" fill="#d7a35f"/><path d="M-48,52 L-48,-18 Q-60,-28 -52,-44 Q-30,-62 0,-62 Q30,-62 52,-44 Q60,-28 48,-18 L48,52 Z" fill="#fbe3b5"/>`,
 soda:()=>`<rect x="-34" y="-70" width="68" height="140" rx="12" fill="#e53935"/><rect x="-34" y="-70" width="68" height="14" rx="6" fill="#bdbdbd"/><rect x="-34" y="-10" width="68" height="30" fill="#fff" opacity=".85"/>`,
 water:()=>`<rect x="-30" y="-66" width="60" height="136" rx="16" fill="#81d4fa" opacity=".55" stroke="#4fc3f7" stroke-width="3"/><rect x="-14" y="-84" width="28" height="20" rx="4" fill="#0288d1"/>`,
});
