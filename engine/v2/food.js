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
