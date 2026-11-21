/* Interview Copilot demo — application script
   Part 1: keep keyboard focus and scroll position when a region is re-rendered with innerHTML,
   and skip the rebuild entirely when nothing changed. */
(()=>{const D=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML'),M=new WeakMap();
const txt=e=>(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,40);
const key=e=>{const c=e.closest('[data-id]');return {act:e.dataset.act,v:e.dataset.v,id:e.id,did:c?c.dataset.id:null,map:e.dataset.map,opt:e.dataset.opt,tag:e.tagName.toLowerCase(),t:txt(e)}};
const find=(r,k)=>{if(k.id){const x=r.querySelector('#'+CSS.escape(k.id));if(x)return x}
 const sel=k.act?'[data-act="'+k.act+'"]':k.map?'[data-map="'+k.map+'"]':k.opt?'[data-opt="'+k.opt+'"]':k.tag;
 const c=[...r.querySelectorAll(sel)].filter(x=>(k.v==null||x.dataset.v===k.v)&&(k.did==null||(x.closest('[data-id]')||{}).dataset?.id===k.did));
 return c.find(x=>txt(x)===k.t)||c[0]};
const sk=(r,e)=>{const s=e.tagName+'.'+[...e.classList].map(c=>CSS.escape(c)).join('.');return [s,[...r.querySelectorAll(s)].indexOf(e)]};
Object.defineProperty(Element.prototype,'innerHTML',{configurable:true,get(){return D.get.call(this)},set(v){
 v=String(v);const m=M.get(this);
 if(m&&m.v===v&&this.isConnected&&D.get.call(this)===m.out)return;
 const a=document.activeElement,k=a&&a!==document.body&&this.contains(a)?key(a):null;
 const sc=[];if(this.isConnected)this.querySelectorAll('*').forEach(e=>{if(e.scrollTop||e.scrollLeft)sc.push([sk(this,e),e.scrollTop,e.scrollLeft])});
 D.set.call(this,v);M.set(this,{v,out:D.get.call(this)});
 sc.forEach(([[s,i],t,l])=>{const e=this.querySelectorAll(s)[i];if(e){e.scrollTop=t;e.scrollLeft=l}});
 if(k){const n=find(this,k);if(n&&!n.disabled&&n.focus)n.focus({preventScroll:true})}
}})})();

/* Part 2: the app */
/* ---------- icons ---------- */
const IC={
 chat:'<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 20 12z"/>',
 send:'<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
 micoff:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M4 4l16 16"/>',
 cam:'<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3z"/>',
 camoff:'<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3zM3 3l18 18"/>',
 spk:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
 spkoff:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
 cc:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 10.3a2.2 2.2 0 1 0 0 3.4M17 10.3a2.2 2.2 0 1 0 0 3.4"/>',
 doc:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h7M7 14h10"/>',
 end:'<path d="M3 13.2c5-4.6 13-4.6 18 0l-2 2.8-3.6-1.3-.4-2.6c-2.1-.6-4-.6-6 0l-.4 2.6L5 16z" fill="currentColor" transform="translate(0 -1.6)"/>',
 pin:'<path d="M9 3.5h6l-1 5.5 3.5 3.5h-11L10 9zM12 12.5V21"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',
 menu:'<path d="M4 7h16M8 12h12M12 17h8"/>',
 reword:'<path d="M4.5 10.5A7.5 7.5 0 0 1 18 7l1.5 1.5M19.5 4v4.5H15M19.5 13.5A7.5 7.5 0 0 1 6 17l-1.5-1.5M4.5 20v-4.5H9"/>',
 skip:'<path d="M6 5.5l9 6.5-9 6.5zM18 5.5v13"/>',
 compass:'<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 ask:'<path d="M4.5 5h15v10.5H10l-5.5 4z"/><path d="M9 10.2h.1M12 10.2h.1M15 10.2h.1" stroke-width="2.4"/>',
 alert:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.1"/>',
 restart:'<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9M4.5 4.5V9H9"/>',
 save:'<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
 target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
 layers:'<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5"/>',
 expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 collapse:'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
 flag:'<path d="M5.5 21V4M5.5 4.5h11l-2.2 4 2.2 4h-11"/>',
 chev:'<path d="M9 5.5l6.5 6.5L9 18.5"/>',
 up:'<path d="M12 19V6M6.5 11.5L12 6l5.5 5.5M5 20h14"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
};
const ic=(n,s=20,w=1.8)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=t=>{t=Math.floor(t);const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return (h?h+':'+String(m).padStart(2,'0'):String(m).padStart(2,'0'))+':'+String(s).padStart(2,'0')};
const $=s=>document.querySelector(s);

/* ---------- framework ---------- */
const STEPS=['Define','Locate','Prepare','Confirm','Execute','Monitor','Modify','Conclude'];
const MJ=['Plan what my child eats and drinks before school','Find a drink my child likes that is also healthy','Get the drink ready in the morning rush','Check the sugar and nutrition before buying','Get my child to finish the drink before school','Notice whether my child has energy through the day','Adjust when my child gets bored or tired','Restock and keep the routine going'];
const SAVED=[
 [{t:MJ[0],os:['Minimize the time it takes to plan a breakfast my child will eat','Minimize uncertainty about whether breakfast gives enough energy until lunch']},{t:'Check what my child already ate',os:['Minimize the likelihood of my child skipping breakfast']}],
 [{t:MJ[1],os:['Minimize the likelihood of buying a drink my child refuses']}],
 [{t:MJ[2],os:['Minimize the time it takes to prepare the drink in the morning','Minimize the likelihood of lumps when mixing with cold milk']}],
 [{t:MJ[3],os:['Minimize the time it takes to understand the sugar content on the pack','Minimize uncertainty about whether the drink is healthy enough for daily use']}],
 [{t:MJ[4],os:['Minimize the likelihood of my child leaving the drink unfinished']}],
 [{t:MJ[5],os:['Minimize uncertainty about whether my child has enough energy through the school day']}],
 [{t:MJ[6],os:['Minimize the effort to find a variation my child will accept']}],
 [{t:MJ[7],os:['Minimize the likelihood of running out before the next shopping trip','Minimize the effort to choose the right pack size for my family']}]
];
const PLAIN=['Planning breakfast','Choosing a drink','Making it in the morning','Checking sugar and nutrition','Getting him to drink it','Watching his energy','Changing things up','Restocking'];
const TYPES={step:['Job Step','var(--violet)'],micro:['Micro-job','var(--cyan)'],outcome:['Outcome','var(--lime)'],undef:['Undefined','var(--amber)'],bg:['Background','var(--fg3)']};
const WARM_ITEMS=['Introduce yourself and the purpose','Confirm recording consent','Ask a warm-up question'];
const WARM_Q=["Tell me a bit about yourself and your family.","To start, who's at home with you, and how old are the children?","Tell me a little about a typical school morning at your house.","What does your child do after school, any sport or classes?","Tell me a little about your week and where breakfast fits in."];

const LOGO_P='assets/sozolab-logo.webp';
const LOGO=LOGO_P;
/* ---------- people ---------- */
const IMG_KAY='assets/kay.webp';
const IMG_THIDA='assets/thida.webp';
const P={
 kay:{img:IMG_KAY,pos:'45% 30%',name:'Daniel Haddad',role:'Interviewer',ini:'DH',skin:'#e2b48f',skin2:'#b98563',hair:'#1c1411',shirt:'#33405a',style:'bun',bg:['#3b3027','#141210'],bokeh:[[60,60,40,'#f2c38a'],[340,40,30,'#ffe1a8'],[370,150,46,'#6b4a33'],[30,200,36,'#8a6a49']]},
 thida:{img:IMG_THIDA,pos:'50% 28%',name:'Sofia Marin',role:'Participant',ini:'SM',skin:'#cf9a74',skin2:'#a26e4d',hair:'#120d0b',shirt:'#5a6b45',style:'long',bg:['#2b3a2e','#0f1511'],bokeh:[[50,40,46,'#c9e39b'],[350,70,40,'#f3d38f'],[330,220,50,'#3c5a3e'],[80,230,36,'#a07a4e']]}
};
let UID=0;
function hair(p){
 if(p.style==='long')return `<path d="M150 148c-4-52 22-74 50-74s56 20 52 74c2 44 10 74 4 96l-24-6c4-34 4-64 2-92-12-22-46-28-74-10-4 34-2 70 4 102l-22 6c-6-28 6-52 8-96z" fill="${p.hair}"/>`;
 if(p.style==='bun')return `<circle cx="200" cy="80" r="20" fill="${p.hair}"/><path d="M154 140c-2-40 20-58 46-58s50 18 46 58c-14-26-40-34-68-26-12 6-20 14-24 26z" fill="${p.hair}"/>`;
 return `<path d="M156 132c-2-36 18-52 44-52s48 14 44 52c-10-18-30-24-46-22-18 0-34 8-42 22z" fill="${p.hair}"/>`;
}
function portrait(p,big){const u='p'+(++UID);const vb=big?'-170 -40 740 400':'0 0 400 300',R=big?'x="-170" y="-40" width="740" height="400"':'width="400" height="300"';return `<svg class="pt" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${u}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient><filter id="${u}f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter><radialGradient id="${u}s" cx=".42" cy=".35" r=".75"><stop offset="0" stop-color="${p.skin}"/><stop offset="1" stop-color="${p.skin2}"/></radialGradient><linearGradient id="${u}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.shirt}"/><stop offset="1" stop-color="#0b0b0e"/></linearGradient></defs><rect ${R} fill="url(#${u}a)"/><g filter="url(#${u}f)" opacity=".75">${p.bokeh.map(([x,y,r,c])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`+(big?`<circle cx="${400-x+(x>200?-120:120)}" cy="${y+40}" r="${r*1.3}" fill="${c}" opacity=".6"/>`:'')).join('')}</g><g class="who"><path d="M84 300c10-62 60-86 116-86s106 24 116 86v60H84z" fill="url(#${u}c)"/><rect x="184" y="172" width="32" height="50" rx="14" fill="${p.skin2}"/><ellipse cx="200" cy="140" rx="43" ry="53" fill="url(#${u}s)"/>${hair(p)}</g></svg>`}

/* ---------- interview script ---------- */
const L=(s,x,d=5)=>({k:'line',s,x,d});
const E=o=>({k:'ev',d:2.5,...o});
const D=(who,topic,d,wait)=>({k:'drift',who,topic,d,wait});
const SEGS=[
 {warm:true,
  pre:[L('kay',"Hi Sofia, can you hear me okay?",1),
   L('thida',"Yes, I can hear you. Sorry, I was just getting Bin settled with his homework.",3.5),
   L('kay',"No problem at all, thanks for squeezing this in. I'm Daniel, and I'm part of a team looking at how families in Vietnam keep their kids going through school and sport.",4.5),{k:'tick',i:0,d:.5},
   L('kay',"There are no right or wrong answers, I just want to hear how things actually go at your place. Is it okay if I record this, so I don't have to scribble notes the whole time?",6),
   L('thida',"Sure, that's fine.",5),{k:'tick',i:1,d:.5}],
  post:[L('thida',"Okay, um, so I work at a bank in Ho Chi Minh City. And my son Bin is nine. He's football crazy, he plays three afternoons a week.",5),
   E({type:'bg',q:"I work at a bank in Ho Chi Minh City.",note:'Occupation and city',conf:.95}),E({type:'bg',q:"My son Bin is nine. He's football crazy, he plays three afternoons a week.",note:'Son, 9, plays football three times a week',conf:.93,d:1.5}),
   L('kay',"Three afternoons, wow. That's a busy kid.",4),
   L('thida',"Very busy! Most mornings he just grabs a carton of Milo on the way out. Some days, honestly, that's his whole breakfast.",3.5),E({type:'bg',q:"Most mornings he just grabs a carton of Milo on the way out.",note:'Current routine: Milo carton on the way to school',conf:.9})]},
 {step:0,q:"How do you decide what he eats and drinks before school?",alts:["Tell me about the last time you planned his breakfast.","What makes breakfast easy or hard on a school day?","How do you choose between a proper breakfast and just a drink?","How do you work out if it's enough for him?"],why:"Define has no evidence yet. Start with the trigger.",
  evs:[L('thida',"Hmm. Honestly, it depends how late we are. On a good day he has rice or bread. But a lot of days it's just the drink, and I never really know if that's enough to get him to lunch.",5),E({type:'outcome',step:0,oc:'Minimize uncertainty about whether breakfast gives enough energy until lunch',q:"I never really know if that's enough to get him to lunch.",conf:.91}),
   L('kay',"Mm, that makes sense.",4),
   L('thida',"But the part that really gets me is the afternoon. He comes home from football completely drained, sometimes too tired to even start his homework.",3.5),E({type:'outcome',step:5,mj:MJ[5],oc:'Minimize uncertainty about whether my child has enough energy through the school day',q:"He comes home from football completely drained, sometimes too tired to even start his homework.",conf:.88}),
   L('kay',"Oh, that sounds tough, for both of you.",3.5),{k:'topic',step:5,d:1}]},
 {step:1,q:"Walk me through how you chose the drink he has now.",alts:["Where did you first hear about it?","What did you compare before you bought it?","How do you choose between the different brands?","What did you have to look up yourself?"],why:"Locate: find where the choice comes from.",
  evs:[L('thida',"Oh, that was his teacher, actually. She mentioned it at a parents' meeting.",5),E({type:'step',step:1,q:"She mentioned it at a parents' meeting.",conf:.8,d:1.5}),
   L('kay',"Okay, so the school put it on your radar.",3.5),
   L('thida',"Yeah. And then I spent a whole evening on Shopee reading reviews, trying to understand the difference between all the versions. There are so many!",3.5),E({type:'outcome',step:1,oc:'Minimize the time it takes to compare the versions of a drink',q:"Trying to understand the difference between all the versions. There are so many!",conf:.93}),
   L('kay',"I can imagine. Did anything help you decide in the end?",4),
   L('thida',"A friend said the less-sugar one tastes almost the same, so I looked at that one too.",4.5),E({type:'undef',step:0,q:"A friend said the less-sugar one tastes almost the same.",note:'Matches Define, but no micro-job fits yet.',sugOc:'Minimize the time it takes to compare sugar levels across versions',conf:.46})]},
 {step:2,q:"What happens when you make it at home in the morning?",alts:["How long does it take to make his drink?","Is anything tricky about making it?","What gets in the way on a busy morning?","What happened the last time you made it in a hurry?"],why:"Prepare: the micro-job has 2 open outcomes.",
  evs:[L('thida',"Ha, chaos. If I use cold milk the powder goes all lumpy, so I'm standing there stirring and stirring while he's looking for his shoes.",5),E({type:'micro',step:2,mj:MJ[2],q:"If I use cold milk the powder goes all lumpy.",conf:.84}),E({type:'micro',step:2,mj:'Make the drink while getting the children out the door',newMj:true,q:"Stirring and stirring while he's looking for his shoes.",conf:.74,d:1.5}),
   L('kay',"Ha, I think every parent knows that morning.",3.5)]},
 {step:3,own:"So before you buy it, how do you know it's actually good for him?",q:"Before you buy it, how do you check the sugar and nutrition?",alts:["What do you look at on the pack?","How do you know how much sugar is in it?","What do you check before it goes in the basket?","What do you double-check before trying a new version?"],why:"Confirm has no evidence yet.",
  evs:[L('thida',"Hmm, honestly I don't really check. The sugar is in tiny print on the back, and in the shop I can't read it properly, so I kind of just guess.",5),E({type:'outcome',step:3,mj:MJ[3],oc:'Minimize the time it takes to understand the sugar content on the pack',q:"The sugar is in tiny print on the back, and in the shop I can't read it properly, so I kind of just guess.",conf:.9}),
   L('kay',"That's fair, those labels aren't easy to read.",3.5),
   L('thida',"Oh, but did I tell you? Bin made the school football team. He scored in the final last Sunday, we were all screaming!",4),D('thida','Bin’s football final',2),
   L('kay',"No way, congratulations! Who were they playing?",4),D('kay','Bin’s football final',1,true)],
  deepEvs:[L('thida',"Sorry, back to the sugar. My mother keeps telling me it's too sweet for every day, and I'm honestly not sure if she's right.",6),E({type:'outcome',step:3,mj:MJ[3],oc:'Minimize uncertainty about whether the drink is healthy enough for daily use',q:"My mother keeps telling me it's too sweet for every day, and I'm honestly not sure if she's right.",conf:.89}),
   L('kay',"Right, so you're getting mixed messages.",3.5)]},
 {step:4,q:"What happens when he actually drinks it?",alts:["Tell me about this morning's breakfast.","Does he always finish it?","What helps him finish it before school?","What happens if he doesn't drink it at home?"],why:"Execute: next step in the framework.",
  evs:[L('thida',"Ha, if he drinks it! Half the time he leaves it on the table. Or I find the carton in his school bag at night, still full.",5),E({type:'outcome',step:4,mj:MJ[4],oc:'Minimize the likelihood of my child leaving the drink unfinished',q:"I find the carton in his school bag at night, still full.",conf:.9}),
   L('kay',"Oh no. So it comes home untouched.",3.5),
   L('thida',"Exactly. And then I don't know what he actually had all day.",3)]},
 {step:5,q:"During the day, how do you know if he has enough energy?",alts:["What does his teacher tell you?","How does he seem when he gets home?","How do you notice when he's running low?","What do you do when he's tired?"],why:"Monitor: 6 flagged consumer reviews point here.",
  evs:[L('thida',"Honestly? I usually don't, until pickup. Last week the teacher told me he was sleepy in the last lesson, and I had no idea.",5),E({type:'outcome',step:5,mj:MJ[5],oc:'Minimize uncertainty about whether my child has enough energy through the school day',q:"The teacher told me he was sleepy in the last lesson, and I had no idea.",conf:.95}),
   L('kay',"That must be hard to hear at pickup.",3.5),
   L('thida',"It is. My sister gives her kids those energy gummies, she says they're easier than a drink. I don't know.",3.5),E({type:'undef',q:"My sister gives her kids those energy gummies.",note:'Competitor mention. No match in the framework.',sugOc:'Minimize the effort to give my child energy on the go',conf:.41}),
   L('kay',"Mm-hm.",3),
   L('thida',"So I started packing him an extra snack, but, well, he just trades it with his friends.",3),E({type:'micro',step:6,mj:MJ[6],q:"I started packing him an extra snack, but, well, he just trades it with his friends.",conf:.86}),
   L('kay',"Of course he does.",3),{k:'topic',step:6,d:1}]},
 {step:6,q:"Has the routine ever stopped working? What did you change?",alts:["Tell me about a time he got tired of it.","When he refused it, what did you try?","What do you do if he gets bored of the taste?","How did you get him back into the routine?"],why:"Modify: probe what parents change.",
  evs:[L('thida',"Yes, last month. He suddenly said he was bored of the taste. So I tried the cereal version, but he said it was too thick, like porridge.",5),E({type:'outcome',step:6,mj:MJ[6],oc:'Minimize the effort to find a variation my child will accept',q:"I tried the cereal version, but he said it was too thick, like porridge.",conf:.82,d:1.5}),
   L('kay',"Ah, so the swap didn't really work.",3.5),
   L('thida',"No. Actually, now that I think about it, maybe it started with the lumps in the morning. He hates it when it's not smooth.",3.5),E({type:'micro',step:2,mj:MJ[2],q:"He hates it when it's not smooth.",conf:.83}),
   L('kay',"Interesting, that's a really useful connection.",3),{k:'topic',step:2,d:1}]},
 {step:7,q:"When it runs out, what do you need to do?",alts:["How do you keep it stocked at home?","Where do you usually buy it?","What happens when you run out?","How do you decide which pack size to buy?"],why:"Conclude: last step not yet covered.",
  evs:[L('thida',"Oh, we always run out mid-week. It's so annoying.",5),E({type:'outcome',step:7,mj:MJ[7],oc:'Minimize the likelihood of running out before the next shopping trip',q:"We always run out mid-week.",conf:.92}),
   L('kay',"What happens then?",3.5),
   L('thida',"I end up buying both. The big tin is cheaper, but the cartons are easier for school. So now the cupboard is full of both.",3),E({type:'outcome',step:7,mj:MJ[7],oc:'Minimize the effort to choose the right pack size for my family',q:"The big tin is cheaper, but the cartons are easier for school.",conf:.88,d:1.5})]},
 {close:true,step:null,q:"Is there anything about keeping him energised that we didn't ask, but you think matters?",alts:["If you could change one thing about his school mornings, what would it be?","What would make his breakfast easier for you?","What's the one thing you'd tell Nestlé?","Is there anything else you think we should know?"],why:"All 8 job steps have evidence. Ask a closing question, then end the session.",
  evs:[L('thida',"Hmm, maybe just that I feel guilty when he's tired. I really want him to do well, at school and at football.",5),E({type:'outcome',step:5,mj:MJ[5],oc:'Minimize uncertainty about whether my child has enough energy through the school day',q:"I feel guilty when he's tired.",conf:.72}),
   L('kay',"That's completely understandable. Thank you for being so open about it.",4),
   L('thida',"And to be honest, if he's still this tired next term, I'll probably try a different brand.",4),E({type:'undef',q:"If he's still this tired next term, I'll probably try a different brand.",note:'Churn signal. No match in the framework.',sugOc:'Minimize the likelihood of switching brands when results are not visible',conf:.38}),
   L('kay',"That's really helpful to know. Thank you, Sofia, this has been great.",4)]}
];
const SEED_END=0, FAST_X=9;
const BRIDGES=["That sounds exciting. Going back to what you were saying, ","I'd love to hear more about that another time. Coming back to his mornings, ","Let's pick up where we left off. "];

/* ---------- sessions ---------- */
const SESSIONS=[{n:3,date:'Wed 4 Nov 2026',time:'2:00 PM'},{n:4,date:'Thu 6 Nov 2026',time:'10:00 AM',who:'Mai Pham'}];
let SI=0;const SES=()=>SESSIONS[SI];
function goSession(i){SI=i;P.thida.name=i?SESSIONS[i].who:'Sofia Marin';start()}
/* ---------- state ---------- */
let S,GEN=0,EVN=0;
function fresh(){return{tabs:{er:'cop',ee:'guide'},chat:[],chatDraft:'',copNew:false,chatNew:0,role:'er',state:'connecting',elapsed:0,speed:1,seg:0,fast:true,lines:[],evs:[],card:{mode:'idle'},resolver:null,cur:null,skipped:new Set(),asked:[],rewords:0,drift:null,drifts:[],pin:{er:null,ee:null},mic:true,cam:true,spk:true,txr:{er:false,ee:true},cap:true,played:new Set(),skipSegs:new Set(),pendingBack:false,early:new Set(),maxStep:null,follow:null,followed:false,stepMenu:false,mapStep:null,open:new Set(),custom:null,lastCur:null,jump:null,endUndo:null,eeLeft:false,drop:null,phase:'lobby',consent:false,otherHere:false,reminded:false,checks:{mic:0,cam:0,net:0},opts:{drift:true,share:true},filter:'all',notifs:[],unseen:0,speaking:null,endConfirm:false,menu:false,mapOpen:null,bridge:null,newIds:new Set(),saved:false,ended:false}}

/* ---------- engine ---------- */
const isPaused=()=>!!(!S.otherHere||S.custom||S.endUndo||S.eeLeft||(S.drop&&S.drop.who==='ee'));
function later(ms,fn,g){const t=()=>{if(g!==GEN)return fn(false);if(isPaused())return setTimeout(t,250);fn(true)};setTimeout(t,ms)}
function sleep(sec){const g=GEN;return new Promise((res,rej)=>{if(S.fast){S.elapsed+=sec*FAST_X;return res()}later(sec*1000/S.speed,ok=>ok?res():rej('stop'),g)})}
function waitAction(sec){const g=GEN;return new Promise((res,rej)=>{if(S.fast){S.elapsed+=4*FAST_X;return res('auto')}let done=false;S.resolver=v=>{if(done)return;done=true;S.resolver=null;res(v)};later(sec*1000/S.speed,ok=>{if(done)return;done=true;S.resolver=null;ok?res('auto'):rej('stop')},g)})}
const MORE=['Can you walk me through the last time that happened?','What was the hardest part of that?','What did you do next?','What would have made that easier?'];
const MORE_W=['How old are your children?','What does a typical school morning look like?','What sport or activities does your child do?','What does your child usually drink in the morning?'];
const RW=new Map();
function rewordText(t){let m;
 if((m=t.match(/^You mentioned (.+) earlier\. Can you tell me more about that\?$/)))return `Earlier you talked about ${m[1]}. What happened there?`;
 if((m=t.match(/^Can you (.+)\?$/)))return `Could you ${m[1]}?`;
 if((m=t.match(/^How (do|did) you (.+)\?$/)))return `Can you tell me how you ${m[2]}?`;
 if((m=t.match(/^Tell me about (.+)\.$/)))return `I\u2019d love to hear about ${m[1]}.`;
 if((m=t.match(/^Walk me through (.+)\.$/)))return `Could you take me through ${m[1]}?`;
 if((m=t.match(/^What (.+)\?$/)))return `Could you share what ${m[1]}?`;
 if((m=t.match(/^(Before|After|Once|When|If) (.+)$/)))return `Thinking about it, ${t.charAt(0).toLowerCase()+t.slice(1)}`;
 return `In your own words, ${t.charAt(0).toLowerCase()+t.slice(1)}`}
const rw=a=>a.map(t=>RW.get(t)||t);
const deepQs=st=>[`You mentioned ${PLAIN[st].toLowerCase()} earlier. Can you tell me more about that?`,...MORE];
const segOpts=sg=>rw(S.card&&S.card.deep&&S.card.seg===SEGS.indexOf(sg)?deepQs(sg.step):[sg.q,...sg.alts]);
const warmOpts=()=>rw(WARM_Q);
const custOpts=C=>rw(C.qs);
function toggleRw(orig){if(RW.has(orig))RW.delete(orig);else RW.set(orig,rewordText(orig))}
const curQ=()=>{const c=S.card,sg=SEGS[c.seg];return segOpts(sg)[c.qi]};

async function execEv(e){
 if(e.k==='line')addLine(e.s,e.x);
 else if(e.k==='ev')addEv(e);
 else if(e.k==='topic'){if(S.cur===e.step)return;await sleep(1.2);S.jump=e.step;S.followed=true;S.early.delete(e.step)}
 else if(e.k==='tick'){if(S.warm){S.warm.done[e.i]=1;renderCopilot()}}
 else if(e.k==='act'){const ev=S.evs.find(x=>!x.dismissed&&x.type!=='bg'&&!x.verified&&!x.flagged&&(e.a==='flag'?x.type==='step':true));if(!ev)return;if(e.a==='verify'){verify(ev)}else{ev.flagged=true;toast('info','Flagged for revision','Review it in the session wrap-up.',ic('flag',18))}renderFeed();renderTop();renderCoverage()}
 else if(e.k==='drift'){if(!S.opts.drift||S.pendingBack)return;startDrift(e);if(e.wait&&S.drift){const r=await waitAction(28);endDrift(r)}}
}
const segFor=st=>SEGS.findIndex(g=>g.step===st&&!g.close);
function nextSeg(cur){
 const ok=k=>SEGS[k].q&&!SEGS[k].close&&!S.played.has(k)&&!S.skipSegs.has(k);
 for(let k=1;k<SEGS.length;k++)if(k!==cur&&ok(k))return k;
 const c=SEGS.findIndex(g=>g.close);return c>=0&&!S.played.has(c)?c:-1;
}
function takeJump(){const j=S.jump;S.jump=null;const k=segFor(j);S.skipSegs.delete(k);return k}
async function run(){
 const g=GEN;
 try{
  while(S.seg>=0){
   if(S.seg===SEED_END&&S.fast){S.fast=false;renderAll();await connect();}
   if(g!==GEN)return;
   const sg=SEGS[S.seg];
   if(sg.warm){
    S.played.add(S.seg);
    S.stage='warmup';S.warm={done:[0,0,0],qi:0,hint:false,go:false,wait:false};S.card={mode:'warmup'};renderCopilot();renderCoverage();renderGuide();
    const go=()=>S.warm.go;
    for(const e of sg.pre){if(go())break;await sleep(e.d);if(go())break;await execEv(e)}
    if(!go()){
     S.warm.wait=true;renderCopilot();const a=await waitAction(14);S.warm.wait=false;
     const wq=warmOpts()[S.warm.qi];
     if(a==='skip'){S.asked.push({t:S.elapsed,q:wq,step:null,how:'skipped'});S.warm.done[2]=1;renderCopilot()}
     else if(a!=='start'){addLine('kay',wq);S.asked.push({t:S.elapsed,q:wq,step:null,how:a==='auto'?'heard':'asked',reworded:[...RW.values()].includes(wq)});S.warm.done[2]=1;S.warm.asked=true;renderCopilot();
      for(const e of sg.post){if(go())break;await sleep(e.d);if(go())break;await execEv(e)}}
    }
    if(!go()){S.warm.hint=true;renderCopilot();await waitAction(12)}
    S.stage='framework';S.warm=null;renderCoverage();renderGuide();
    const k=S.jump!=null?takeJump():nextSeg(S.seg);
    toast('info','Framework started',`Copilot now matches answers to the job map, starting at ${STEPS[SEGS[k].step]}.`,ic('compass',18));
    S.seg=k;continue;
   }
   if(sg.q){
    S.pendingBack=false;const prevCur=S.cur;S.card={mode:'suggest',seg:S.seg,qi:0,deep:sg.step!=null&&!sg.close&&stepCount(sg.step)>0,back:sg.step!=null&&S.maxStep!=null&&sg.step<S.maxStep&&!S.followed&&S.bridge===null,jumped:S.followed};if(sg.step!=null)S.maxStep=Math.max(S.maxStep??-1,sg.step);S.followed=false;if(sg.step!=null)S.cur=sg.step;renderCopilot();renderCoverage();renderGuide();
    let a;
    if(S.bridge!==null){a='bridge';await sleep(.6)}else a=await waitAction(16);
    if(a==='jump'){S.seg=takeJump();continue}
    if(a==='skip'){S.asked.push({t:S.elapsed,q:curQ(),step:sg.step,how:'skipped'});S.skipSegs.add(S.seg);if(sg.step!=null)S.skipped.add(sg.step);toast('info','Question skipped','Copilot moved to the next step in the framework.',ic('skip'));S.seg=nextSeg(S.seg);continue}
    S.played.add(S.seg);if(sg.step!=null)S.skipped.delete(sg.step);
    const own=a==='auto'&&sg.own,q=own?sg.own:curQ(),text=a==='bridge'?BRIDGES[S.bridge]+q.charAt(0).toLowerCase()+q.slice(1):q;
    S.asked.push({t:S.elapsed,q,step:sg.step,jumped:!!S.card.jumped,back:!!S.card.back,how:a==='bridge'?'bridged':a==='auto'?'heard':a==='picked'?'picked':'asked',reworded:[...RW.values()].includes(q),own:!!own});
    S.bridge=null;
    addLine('kay',text);
    S.card.mode='listening';S.card.heard=a==='auto';S.card.own=own?sg.own:null;S.card.how=a;renderCopilot();renderCoverage();renderGuide();
   }
   for(const e of (S.card.deep?(sg.deepEvs||sg.evs.filter(x=>x.k!=='drift')):sg.evs)){if(S.jump!=null)break;await sleep(e.d);if(S.jump!=null)break;await execEv(e)}
   S.seg=S.jump!=null?takeJump():nextSeg(S.seg);
  }
  S.card={mode:'done'};renderCopilot();
 }catch(x){}
}
async function connect(){S.state='connecting';renderTop();await sleep(1.8);S.state='recording';renderTop();if(S.role==='er'){toast('info','Copilot is listening','Copilot matches what Sofia says to the job map as you talk.',ic('spark'));const tl=document.querySelectorAll('#toasts > *');if(tl.length)tl[tl.length-1].classList.add('er-only')}}

function addLine(s,x){
 S.lines.push({t:S.elapsed,s,x,off:!!S.drift});S.speaking=s;
 if(S.fast)return;
 renderCaption();renderSpeaking();renderTranscript();
 clearTimeout(addLine.t);addLine.t=setTimeout(()=>{S.speaking=null;renderSpeaking()},3800/S.speed);
}
function stepCountX(i,skip){return S.evs.some(e=>!e.dismissed&&e.step===i&&e.id!==skip)}
function addEv(e){
 const ev={id:'e'+(++EVN),t:S.elapsed,type:e.type,step:e.step??null,mj:e.mj||(e.type==='micro'?MJ[e.step]:null),oc:e.oc||null,q:e.q,conf:e.conf,note:e.note||'',sugOc:e.sugOc||'',newMj:!!e.newMj,verified:false,dismissed:false};
 if(e.type==='outcome'&&!e.mj&&e.step!=null)ev.mj=MJ[e.step];
 S.evs.unshift(ev);
 if(ev.step!=null&&S.stage==='framework'&&S.cur!=null&&ev.step>S.cur&&!stepCountX(ev.step,ev.id))S.early.add(ev.step);
 const ln=S.lines[S.lines.length-1];if(ln)ln.ev=ev.type;
 if(S.fast)return;
 S.newIds.add(ev.id);renderFeed();renderCoverage();renderTranscript();
}
function startDrift(e){
 if(!S.drift){S.drift={who:e.who,topic:e.topic,since:S.elapsed,bi:0,kay:false};S.drifts.push(S.drift)}
 if(e.who==='kay')S.drift.kay=true;
 S.card={...S.card,mode:'drift'};
 const ln=S.lines[S.lines.length-1];if(ln)ln.off=true;
 if(S.fast)return;
 renderDrift();renderCopilot();renderTranscript();
}
function endDrift(r){
 const d=S.drift;if(!d)return;d.dur=S.elapsed-d.since;d.how=r;
 S.drift=null;
 if(r==='back'||r==='auto'){S.bridge=d.bi;if(S.cur!=null)S.jump=S.cur}
 if(r==='dismiss')toast('info','Alert dismissed','Copilot will keep listening for the framework.',ic('x'));
 renderDrift();renderCopilot();
}

/* ---------- renderers ---------- */
const self=()=>S.role==='er'?'kay':'thida';
const mainId=()=>S.pin[S.role]||(S.role==='er'?'thida':'kay');
function renderAll(){
 document.body.dataset.role=S.role;
 const er=S.role==='er';
 $('#cov').hidden=!er;$('#cop').hidden=!er;$('#feed').hidden=true;$('#guide').hidden=er;$('#ins').hidden=true;
 renderTop();renderVideo();renderCenter();renderOvl();renderCopilot();renderFeed();renderCoverage();renderGuide();renderIns();renderCtrl();renderTranscript();
}
function renderTop(){
 const meDrop=S.drop&&S.drop.who===S.role,lab=S.endUndo?'Ended':meDrop?'Reconnecting':!S.otherHere&&S.phase==='call'?'Waiting for '+P.thida.name.split(' ')[0]:({connecting:'Connecting',recording:'Recording',ending:'Ending'}[S.state]||'Ended');
 $('#top').innerHTML=`
 <div class="brand"><img class="logo lgl" src="${LOGO_P}" alt="SOZO LAB"><img class="logo lgd" src="${LOGO}" alt="SOZO LAB"></div>
 <div class="mtitle"><h1>Milo · School &amp; Sport</h1><p><span class="sess">Session ${SES().n} of 6</span></p></div>
 <span class="grow1"></span>
  <div class="roles glass" role="group" aria-label="Switch view">
  <button aria-pressed="${S.role==='er'}" class="${S.role==='er'?'on':''}" data-act="role" data-v="er">Interviewer</button>
  <button aria-pressed="${S.role==='ee'}" class="${S.role==='ee'?'on':''}" data-act="role" data-v="ee">Interviewee</button>
 </div>
 <div class="recst s-${meDrop?'connecting':S.endUndo?'ending':S.state}" role="status"><i></i><span>${lab}</span><b class="mono" id="tmr">${fmt(S.elapsed)}</b></div>
${themeBtn()}`;
}
function tileHTML(id,isMain){
 const p=P[id],me=id===self(),off=me&&!S.cam,muted=me&&!S.mic;
 const absent=id==='thida'&&!me&&!S.otherHere;const inner=absent?`<div class="camoff absent"><span class="lw-av big"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4" fill="currentColor"/><path d="M4.5 20c.8-3.6 3.9-5.5 7.5-5.5s6.7 1.9 7.5 5.5" fill="currentColor"/></svg></span>${isMain?`<p>Waiting for ${esc(p.name.split(' ')[0])} to join…</p>`:''}</div>`:off?`<div class="camoff"><b>${p.ini}</b></div>`:p.img?`<img class="pt ph" src="${p.img}" alt="${esc(p.name)} on camera" style="object-position:${p.pos}">`:portrait(p,isMain);
 if(isMain)return inner;
 return `<div class="tile${S.speaking===id?' speaking':''}" data-pid="${id}">${inner}<div class="nm">${muted?`<span class="mute">${ic('micoff',12,2.2)}</span>`:''}<span>${me?'You':p.name}</span></div><button class="pin" data-act="pin" data-v="${id}" aria-label="Pin ${esc(p.name)} to main view" title="Pin to main view">${ic('pin',15)}</button></div>`;
}
function mainLabel(){const m=mainId(),p=P[m],pinned=!!S.pin[S.role];return `<div class="mainlabel glass"><span>${m===self()?'You':esc(p.name)}</span><span class="wave" hidden><i></i><i></i><i></i><i></i></span>${pinned?`<button class="pinned" data-act="unpin" title="Pinned. Click to unpin" aria-label="Unpin">${ic('pin',15)}</button>`:''}</div>`}
function renderVideo(){
 const m=mainId();
 const p=P[m],pinned=!!S.pin[S.role];
 const mv=$('#mainvid');mv.innerHTML=tileHTML(m,true)+mainLabel();mv.dataset.pid=m;
 $('#pips').innerHTML=Object.keys(P).filter(id=>id!==m).map(id=>tileHTML(id,false)).join('');
 renderSpeaking();
}
function renderSpeaking(){
 if(S.phase==='call'){const aw=awayId();document.querySelectorAll('[data-pid]').forEach(t=>t.classList.toggle('away',t.dataset.pid===aw))}
 document.querySelectorAll('[data-pid]').forEach(el=>el.classList.toggle('speaking',el.dataset.pid===S.speaking));
 document.querySelectorAll('.mainlabel .wave').forEach(w=>w.hidden=S.speaking!==mainId());
}
function renderCenter(){
 const m=mainId(),p=P[m],pinned=!!S.pin[S.role];
 {const tt=$('#toasts');if(tt)$('#app').appendChild(tt)}
 $('#center').innerHTML=`<div id="sys"></div><div id="drift"></div><div id="toastslot"></div><div class="caption" id="caption"></div>`;
 renderDrift();renderCaption();renderSpeaking();renderSys();placeToasts();
}
function renderCaption(){
 const c=$('#caption');if(!c)return;const l=S.lines[S.lines.length-1];
 c.hidden=!S.cap||!l;if(l)c.innerHTML=`<b>${l.s===self()?'You':P[l.s].name}</b>${esc(l.x)}`;
}
function driftDur(){return S.drift?fmt(S.elapsed-S.drift.since):''}
function renderDrift(){
 const el=$('#drift');if(!el)return;
 if(!S.drift||S.role!=='er'){el.innerHTML='';return}
 const d=S.drift;
 el.innerHTML=`<div class="drift" role="alert"><span class="ico">${ic('alert',18,2)}</span><div style="flex:1;min-width:0"><b>Off topic for <span class="mono" id="dtm">${driftDur()}</span></b><p>${d.kay?'Your follow-up also moved away from the job map.':'Sofia moved to '+esc(d.topic)+'.'} Nothing said here maps to a job step. Bring the conversation back to his routine.</p></div><div class="acts"><button class="btn sm" data-act="dismiss">Dismiss</button><button class="btn sm amb" data-act="back">${ic('compass',16)}<span>Back to framework</span></button></div></div>`;
}
function qList(list,sel,anim){return `<ol class="qlist${anim?' shim':''}" aria-label="Question options">${list.slice(0,5).map((t,k)=>`<li><button class="qopt${k===sel?' on':''}" data-act="pickq" data-v="${k}" aria-pressed="${k===sel}"><span class="qn">${k+1}</span><span class="qt">${esc(t)}</span>${[...RW.values()].includes(t)?'<span class="qtag rw">Reworded</span>':k===0?'<span class="qtag">Suggested</span>':''}</button></li>`).join('')}</ol>`}
const tabOf=()=>S.tabs[S.role];
function ptabs(){const er=S.role==='er',home=er?'cop':'guide',t=tabOf();return `<div class="ptabs" role="group" aria-label="Panel"><button aria-pressed="${t===home}" class="${t===home?'on':''}" data-act="ptab" data-v="${home}">${er?'Copilot':'Conversation'}${er&&t!==home&&S.copNew?'<i class="pdot"></i>':''}</button><button aria-pressed="${t==='chat'}" class="${t==='chat'?'on':''}" data-act="ptab" data-v="chat">Chat${S.chatNew&&t!=='chat'?`<span class="pcnt">${S.chatNew}</span>`:''}</button></div>`}
const chatEl=()=>S.role==='er'?$('#cop'):$('#guide');
function chatMsgs(){return S.chat.length?S.chat.map(m=>{const me=m.s===self();return `<div class="cm${me?' me':''}"><div class="cmh"><b>${me?'You':P[m.s].name}</b><span class="mono">${fmt(m.t)}</span></div><p>${esc(m.x)}</p></div>`}).join(''):`<div class="cempty">${ic('chat',22)}<p>Messages go to everyone in the call and are saved with the transcript.</p></div>`}
function renderChat(){const el=chatEl();if(!el)return;el.classList.remove('drifting');el.classList.add('chatmode');el.innerHTML=ptabs()+`<div class="chatv"><div class="cmsgs" id="cmsgs">${chatMsgs()}</div><form class="cform" id="cform" autocomplete="off"><input id="cin" type="text" placeholder="Message ${S.role==='er'?'Sofia':'Daniel Haddad'}…" aria-label="Chat message" value="${esc(S.chatDraft)}"><button class="csend" type="submit" aria-label="Send" ${S.chatDraft.trim()?'':'disabled'}>${ic('send',18,2)}</button></form></div>`;const m=$('#cmsgs');if(m)m.scrollTop=m.scrollHeight}
function addChat(s,x){S.chat.push({s,t:S.elapsed,x});if(tabOf()==='chat'&&$('#cmsgs')){$('#cmsgs').innerHTML=chatMsgs();$('#cmsgs').scrollTop=$('#cmsgs').scrollHeight}else{if(s!==self())S.chatNew++;const el=chatEl(),t=el&&el.querySelector('.ptabs');if(t)t.outerHTML=ptabs()}}
function renderCopilot(){
 const el=$('#cop'),c=S.card;el.classList.toggle('drifting',c.mode==='drift');
 el.classList.remove('chatmode');const head=(badge)=>ptabs()+(badge?`<div class="stepline">${badge}</div>`:'');
 if(S.role!=='er')return;if(tabOf()==='chat'){S.copNew=true;el.classList.remove('drifting');el.classList.add('chatmode');if(!el.querySelector('.chatv'))renderChat();else{const t=el.querySelector('.ptabs');if(t)t.outerHTML=ptabs()}return}
 const stepBadge=sg=>`<span class="badge">${sg.close?'Closing':'Step '+(sg.step+1)+' · '+STEPS[sg.step]}</span>`;
 const acts=(dis)=>`<div class="acts4 three">${dis?'<p class="acthint">Reword and Skip turn on once the question is asked.</p>':''}<button class="btn" data-act="reword"${dis?' disabled':''}>${ic('reword',16)}<span>Reword</span></button><button class="btn" data-act="skip"${dis?' disabled':''}>${ic('skip',16)}<span>Skip</span></button><button class="btn" data-act="back">${ic('compass',16)}<span>Back to framework</span></button></div>`;
 const waitRow=(n,act)=>`<div class="waitrow"><span class="wv"><span class="wave"><i></i><i></i><i></i><i></i></span>Listening for your question…</span><button class="lnk2" data-act="${act}">Didn\u2019t catch it? Mark option ${n} as asked</button></div>`;
 if(c.mode==='idle'){el.innerHTML=head('')+`<div class="listen"><span class="wave"><i></i><i></i><i></i><i></i></span>Connecting to the session…</div>`;return}
 if(S.custom){const C=S.custom;el.classList.remove('drifting');
  el.innerHTML=head(`<span class="badge">Step ${C.step+1} · ${STEPS[C.step]}</span>`)+`<span class="eyebrow">Ask about ${C.kind==='outcome'?'outcome':'micro-job'}</span><div class="tgt">${esc(C.target)}</div><p class="hint2">${ic('mic',15)}Just ask out loud. Copilot will detect it.</p>${qList(custOpts(C),C.qi,C.anim)}${waitRow(C.qi+1,'cask')}<p class="why">${ic('spark',19)}Copilot will match the answer to this ${C.kind==='outcome'?'outcome':'micro-job'}. The planned question waits until you\u2019re done.</p><div class="acts4 three"><button class="btn" data-act="creword">${ic('reword',16)}<span>Reword</span></button><button class="btn" data-act="cskip">${ic('skip',16)}<span>Skip</span></button><button class="btn" data-act="cskip">${ic('compass',16)}<span>Back to framework</span></button></div>`;C.anim=false;return}
 if(c.mode==='warmup'&&S.warm){const W=S.warm;
  el.innerHTML=head(`<span class="badge">Warm-up</span>`)+`<span class="eyebrow">Opening checklist</span><ul class="chk">${WARM_ITEMS.map((t,i)=>`<li class="${W.done[i]?'on':''}"><span class="bx" aria-hidden="true">${W.done[i]?ic('check',12,2.8):''}</span>${t}<span class="sr-only">${W.done[i]?' (done)':' (to do)'}</span></li>`).join('')}</ul>`+(W.hint?`<div class="hint">${ic('spark',19)}<div><b>Sofia is describing her son’s routine.</b>Start the framework at Step 1 · Define?</div></div>`:W.asked?`<div class="listen"><span class="wave"><i></i><i></i><i></i><i></i></span>Capturing background. It won't be mapped to the job map.</div>`:`<span class="eyebrow">Choose a warm-up question</span><p class="hint2">${ic('mic',15)}Just ask out loud. Copilot will detect it.</p>${qList(warmOpts(),W.qi,c.anim)}${W.wait?waitRow(W.qi+1,'ask'):''}<p class="why">${ic('spark',19)}Answers are saved as background, not job map evidence. Off-topic alerts are paused.</p>`)+`<div class="acts4 three">${W.wait?'':'<p class="acthint">Reword and Skip turn on once you ask a question.</p>'}<button class="btn" data-act="reword"${W.wait?'':' disabled'}>${ic('reword',16)}<span>Reword</span></button><button class="btn" data-act="skip"${W.wait?'':' disabled'}>${ic('skip',16)}<span>Skip</span></button><button class="btn${W.hint?' pri':''}" data-act="startfw">${ic('compass',16)}<span>Start framework</span></button></div>`;c.anim=false;return}
 if(c.mode==='done'){el.innerHTML=head(`<span class="badge" style="color:var(--lime-text)">${ic('check',14,2.4)}8 of 8 steps</span>`)+`<p class="q">Framework complete.</p><p class="why">${ic('spark',19)}Every job step has evidence. Thank Sofia, then end the session to see the wrap-up.</p>`;return}
 const sg=SEGS[c.seg];
 if(c.mode==='drift'){
  const nx=sg;const q=sg.step!=null?deepQs(sg.step)[0]:sg.q;const br=BRIDGES[S.drift?S.drift.bi:0]+q.charAt(0).toLowerCase()+q.slice(1);
  el.innerHTML=head(`<span class="badge" style="color:var(--amber)">${ic('alert',14,2)}Off framework</span>`)+`<span class="eyebrow">Suggested bridge</span><p class="q shim" id="cq">“${esc(br)}”</p><p class="why">${ic('target',15)}Steers back to Step ${(nx.step??0)+1} · ${STEPS[nx.step??0]}, where you were before the tangent.</p><div class="acts4 two"><button class="btn amb" data-act="back" style="grid-column:1/-1">${ic('compass',16)}<span>Back to framework</span></button><button class="btn" data-act="reword">${ic('reword',16)}<span>Reword</span></button><button class="btn" data-act="dismiss">${ic('x',16)}<span>Dismiss</span></button></div>`;
  return;
 }
 if(c.mode==='suggest'){
  el.innerHTML=head(stepBadge(sg))+`${S.follow?`<div class="follow">${ic('compass',18)}<div><b>Sofia moved to ${STEPS[S.follow.to]}</b><span>Following her in a few seconds.</span></div><div class="fbt"><button class="btn sm" data-act="stay">Stay on ${STEPS[S.follow.from]}</button><button class="btn sm pri" data-act="follow">Follow</button></div></div>`:''}${c.deep?`<div class="cnote">${ic('check',14,2.6)}Sofia already talked about ${STEPS[sg.step]}. Go deeper.</div>`:c.back?`<div class="cnote back">${ic('back',14,2.4)}Back to ${STEPS[sg.step]}, missed earlier.</div>`:''}<span class="eyebrow">Choose a question</span><p class="hint2">${ic('mic',15)}Just ask out loud. Copilot will detect it.</p>${qList(segOpts(sg),c.qi,c.anim)}${waitRow(c.qi+1,'ask')}<p class="why">${ic('spark',19)}${esc(sg.why)}</p>${acts(false)}`;
  c.anim=false;return;
 }
 if(c.mode==='listening'){
  el.innerHTML=head(stepBadge(sg))+`${S.follow?`<div class="follow">${ic('compass',18)}<div><b>Sofia moved to ${STEPS[S.follow.to]}</b><span>Following her in a few seconds.</span></div><div class="fbt"><button class="btn sm" data-act="stay">Stay on ${STEPS[S.follow.from]}</button><button class="btn sm pri" data-act="follow">Follow</button></div></div>`:''}<span class="eyebrow">${c.heard?'Detected':'Marked as asked'}</span><span class="detchip ${c.own?'own':''}">${c.own?ic('ask',14)+'Your own question':ic('check',14,2.4)+'Matches option '+(c.qi+1)}</span><p class="q" style="color:var(--fg2)">“${esc(c.own||curQ())}”</p><div class="listen"><span class="wave"><i></i><i></i><i></i><i></i></span>Listening for Sofia's answer and matching evidence…</div>${acts(true)}`;
 }
}
function pathHTML(ev){
 if(ev.type==='undef'&&ev.step!=null)return `<span>Step ${ev.step+1} · ${STEPS[ev.step]}</span><span class="sep">›</span><em>No micro-job match</em>`;
 if(ev.type==='bg')return `<em>${esc(ev.note)} · not mapped to the job map</em>`;
 if(ev.type==='undef'&&ev.step==null)return `<em>${esc(ev.note)}</em>`;
 const parts=[`Step ${ev.step+1} · ${STEPS[ev.step]}`];
 if(ev.mj&&ev.type!=='step')parts.push(esc(ev.mj));
 if(ev.oc)parts.push(esc(ev.oc));
 return parts.map((p,i)=>`<span>${p}</span>`).join('<span class="sep">›</span>')+(ev.mapped?' <em>· mapped by you</em>':'');
}
function evHTML(ev,live=true){
 return `<article class="ev${ev.verified?' ver':''}${ev.flagged?' flagged':''}${S.newIds.has(ev.id)?' in':''}" data-id="${ev.id}">
 <div class="evh"><span class="chip c-${ev.type}">${TYPES[ev.type][0]}</span>${ev.newMj?'<span class="chip ghost">New micro-job</span>':''}${ev.flagged?'<span class="chip c-flag">Flagged</span>':''}${ev.type==='bg'?'':`<span class="conf" title="Match confidence">${Math.round(ev.conf*100)}% match</span>`}<span class="tm mono">${fmt(ev.t)}</span></div>
 <blockquote>“${esc(ev.q)}”</blockquote>
 <div class="path">${pathHTML(ev)}</div>
 <div class="eva">${ev.type==='bg'?'':`<button class="vbtn${ev.verified?' on':''}" data-act="ver" aria-pressed="${ev.verified}">${ic('check',15,2.2)}${ev.verified?'Verified':'Verify'}</button><button class="vbtn${ev.flagged?' flg':''}" data-act="flag" aria-pressed="${!!ev.flagged}" title="Flag for revision">${ic('flag',15)}${ev.flagged?'Flagged':'Flag'}</button>`}${ev.type==='undef'?`<button class="vbtn" data-act="map" aria-expanded="${S.mapOpen===ev.id}">${ic('layers',16)}Map</button>`:''}<button class="ib sm" data-act="dis" aria-label="Dismiss evidence" title="Dismiss">${ic('x',15)}</button></div>
 ${S.mapOpen===ev.id?(ev.step==null?`<div class="mapw"><span class="mapl">Map to step</span><div class="picker">${STEPS.map((s,i)=>`<button data-act="mapstep" data-v="${i}">${i+1} · ${s}</button>`).join('')}</div></div>`:`<div class="mapw"><span class="mapl">Map to micro-job in ${STEPS[ev.step]}</span>${ev.sugOc?`<span class="mapo">Becomes outcome: “${esc(ev.sugOc)}”</span>`:''}<div class="picker col">${stepModel(ev.step).mjs.map((m,mi)=>`<button data-act="mapmj" data-v="${mi}">${esc(m.t)}</button>`).join('')}<button class="ghost" data-act="mapmj" data-v="-1">Step level only</button></div></div>`):''}
 </article>`;
}
function renderFeed(){
 const live=S.evs.filter(e=>!e.dismissed),cnt=k=>live.filter(e=>e.type===k).length;
 const shown=live.filter(e=>S.filter==='all'||e.type===S.filter);
 const ver=live.filter(e=>e.verified).length;
 $('#feed').innerHTML=`<div class="ch"><h2>Live Evidence<small>${live.length} detected · ${ver} verified${live.some(e=>e.flagged)?' · '+live.filter(e=>e.flagged).length+' flagged':''}</small></h2></div>
 <div class="filters" role="group" aria-label="Filter evidence"><button class="fc${S.filter==='all'?' on':''}" aria-pressed="${S.filter==='all'}" data-act="filter" data-v="all">All (${live.length})</button>${Object.entries(TYPES).map(([k,[l,c]])=>`<button class="fc${S.filter===k?' on':''}" aria-pressed="${S.filter===k}" data-act="filter" data-v="${k}"><i style="background:${c}"></i>${l} (${cnt(k)})</button>`).join('')}</div>
 <div class="list" id="evlist">${shown.length?shown.map(e=>evHTML(e)).join(''):`<div class="empty">${live.length?'Nothing of this type yet.':'Evidence will appear here as Sofia talks.'}</div>`}</div>`;
 S.newIds.clear();
}
function stepCount(i){return S.evs.filter(e=>!e.dismissed&&e.step===i).length}
const lcf=x=>x.charAt(0).toLowerCase()+x.slice(1);
function itemQs(isO,t){const pad=a=>{const g=['Can you walk me through the last time that happened?','What did you do about it?','How did that affect you or your family?','What would have made it easier?'];for(const x of g){if(a.length>=5)break;if(!a.includes(x))a.push(x)}return a.slice(0,5)};return pad(itemQs0(isO,t))}
function itemQs0(isO,t){
 if(!isO){const x=lcf(t);return [`Tell me about the last time you had to ${x}.`,`What\u2019s the hardest part when you ${x}?`,`How do you usually ${x} today?`]}
 let m;
 if((m=t.match(/^Minimize the time it takes to (.+)$/)))return [`How long does it take you to ${m[1]}? What slows it down?`,`Walk me through the last time you had to ${m[1]}.`];
 if((m=t.match(/^Minimize uncertainty about (.+)$/)))return [`How sure do you feel about ${m[1]}? What would help?`,`What do you do when you\u2019re not sure about ${m[1]}?`];
 if((m=t.match(/^Minimize the likelihood of (.+)$/)))return [`Tell me about a time you ran into ${m[1]}.`,`What makes ${m[1]} more likely for you?`];
 if((m=t.match(/^Minimize the effort to (.+)$/)))return [`How much effort does it take to ${m[1]}?`,`What would make it easier to ${m[1]}?`];
 return [`Tell me more about this: ${lcf(t)}.`,`Can you walk me through the last time that happened?`];
}
function stepModel(i){
 const evs=S.evs.filter(e=>!e.dismissed&&e.step===i&&e.type!=='bg');
 const mjs=SAVED[i].map(m=>({t:m.t,saved:true,os:m.os.map(o=>({t:o,saved:true})),q:[]}));
 const getMj=t=>{let m=mjs.find(x=>x.t===t);if(!m){m={t,saved:false,os:[],q:[]};mjs.push(m)}return m};
 const stepQ=[],unQ=[];
 evs.forEach(e=>{
  if(e.type==='step'){if(e.verified)stepQ.push(e);return}
  if(e.type==='undef'){unQ.push(e);return}
  const m=getMj(e.mj||mjs[0].t);if(!m)return;
  if(e.type==='outcome'&&e.oc){let o=m.os.find(x=>x.t===e.oc);if(!o){o={t:e.oc,saved:false};m.os.push(o)}o.cap=true;if(e.verified){o.ver=true;(o.q=o.q||[]).push(e)}}
  else if(e.type==='micro'){m.cap=true;if(e.verified)(m.mq=m.mq||[]).push(e)}
  if(e.verified)m.q.push(e);
 });
 return {mjs,stepQ,unQ,capN:mjs.reduce((t,m)=>t+m.os.filter(o=>o.cap).length,0)};
}
function pendingNew(){const out=[];STEPS.forEach((_,i)=>{const evs=S.evs.filter(e=>!e.dismissed&&e.step===i&&e.mj);const saved=SAVED[i].map(m=>m.t);
 evs.forEach(e=>{if(saved.includes(e.mj)||evs.some(x=>x.mj===e.mj&&x.verified))return;let p=out.find(o=>o.t===e.mj);if(!p){p={t:e.mj,step:i,q:[]};out.push(p)}p.q.push(e)})});return out}
function renderCoverage(){
 const wu=S.stage==='warmup',wDone=S.stage==='framework';
 const vstep=i=>S.evs.some(e=>!e.dismissed&&e.step===i&&e.verified);
 const first=i=>{const t=S.evs.filter(e=>!e.dismissed&&e.step===i).map(e=>e.t);return t.length?Math.min(...t):null};
 const covered=STEPS.filter((_,i)=>stepCount(i)>0).length,vc=STEPS.filter((_,i)=>vstep(i)).length,sk=[...S.skipped].filter(i=>!stepCount(i)).length;
 const und=S.evs.filter(e=>!e.dismissed&&e.type==='undef'&&e.step==null).length;
 const R=19,C=2*Math.PI*R,pc=covered/8;
 const ring=`<svg class="jring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="${R}" class="tr"/><circle cx="24" cy="24" r="${R}" class="pg" style="stroke-dasharray:${C};stroke-dashoffset:${C*(1-pc)}"/></svg><span class="jrn"><b>${covered}</b>/8</span>`;
 const node=(st,n)=>st==='ver'?`<span class="jn ver">${ic('check',15,3)}</span>`:st==='has'?`<span class="jn has">${ic('check',15,2.8)}</span>`:st==='cur'?'<span class="jn cur"><i></i></span>':st==='skip'?`<span class="jn skip">${ic('skip',13,2.4)}</span>`:`<span class="jn">${n}</span>`;
 const items=[];
 items.push(wu?{st:'cur',cur:true,n:'W',name:'Warm-up',meta:'Getting to know Sofia'}:{st:wDone?'ver':'',n:'W',name:'Warm-up',right:wDone?'Done':''});
 STEPS.forEach((s,i)=>{const n=stepCount(i),v=vstep(i),cur=S.cur===i&&!wu;
  const st=cur&&!n?'cur':n?'ver':S.skipped.has(i)?'skip':'';
  const it={st,cur,n:i+1,name:s};
  if(cur){const M=stepModel(i),tot=M.mjs.reduce((t,m)=>t+m.os.length,0);it.meta=`${M.capN} of ${tot} outcomes heard`;it.pct=tot?M.capN/tot:0}
  else if(n){const M=stepModel(i),mj=M.mjs.filter(m=>m.cap||m.os.some(o=>o.cap)).length,oc=M.capN;if(S.early.has(i))it.early=true;const parts=[mj?`${mj} micro-job${mj>1?'s':''}`:'',oc?`${oc} outcome${oc>1?'s':''}`:''].filter(Boolean);if(!parts.length)parts.push(`${n} item${n>1?'s':''}`);it.meta=parts.join(' · ');it.light=(mj+oc)<=1}
  else if(S.skipped.has(i))it.right='Skipped';
  items.push(it)});
 $('#cov').classList.remove('dim');
 const done=items.map(it=>it.st==='ver'||it.st==='has');
 $('#cov').innerHTML=`<div class="ch"><h2>Job Map<small>${wu?'Warm-up in progress':`${covered} of 8 steps covered`}</small></h2></div>
 <ol class="tl" tabindex="0" aria-label="Job map steps">${items.map((it,k)=>`<li class="${it.st}${it.cur?' now':''}${done[k]?' dn':''}${k&&done[k]&&done[k-1]?' lk':''}"${it.cur?' aria-current="step"':''}>${node(it.st,it.n)}<div class="tlx"><b>${it.name}</b>${it.cur?'<span class="nowchip">Now</span>':''}${it.meta?it.meta.replace(' heard','').split(' · ').map(m=>`<span class="tlm">${m}</span>`).join(''):it.right?`<span class="tlm">${it.right}</span>`:''}${it.early&&!it.cur?'<span class="early">Came up early</span>':''}</div></li>`).join('')}</ol>
 ${und?`<div class="jund">${ic('alert',15,2)}<span>${und} item${und===1?'':'s'} not matched to a step</span></div>`:''}`;
}
function renderGuide(){
 if(S.role!=='ee')return;
 const c=S.cur;
 const G=$('#guide');if(tabOf()==='chat'){if(!G.querySelector('.chatv'))renderChat();else{const t=G.querySelector('.ptabs');if(t)t.outerHTML=ptabs()}return}G.classList.remove('chatmode');
 $('#guide').innerHTML=ptabs()+`<div class="ch"><h2>Today's Conversation<small>With Daniel Haddad · about 30 minutes</small></h2></div><p>We're learning how parents keep their children energised for school and sport. There are no right or wrong answers. Your own experience is what matters.</p>
 <div class="topic"><span class="eyebrow">Now talking about</span><b>${c==null?(S.stage==='warmup'?'Getting to know you':'Getting started'):PLAIN[c]}</b><div class="dots" aria-hidden="true">${STEPS.map((_,i)=>`<i class="${c===i?'c':(c!=null&&i<c)?'d':''}"></i>`).join('')}</div></div>
 <p style="display:flex;gap:10px;align-items:center;color:var(--fg3);font-size:13px"><span style="flex:none;display:grid">${ic('lock',22)}</span>This session is recorded with your consent. Only the research team sees the transcript.</p>`;
}
function renderIns(){
 if(S.role!=='ee')return;
 $('#ins').innerHTML=`<div class="ch"><h2>Confirmed Insights<small>${S.notifs.length} so far</small></h2></div><div class="list">${S.notifs.length?S.notifs.map(n=>`<div class="insi"><span class="ck">${ic('check',14,2.6)}</span><div><q>${esc(n.q)}</q><span>${esc(n.topic)} · ${fmt(n.t)}</span></div></div>`).join(''):`<div class="empty">When Daniel Haddad flags something you said as a key insight, it shows up here.</div>`}</div>`;
}
function renderCtrl(){
 $('#ctrl').innerHTML=`<div class="ctrl-name">${mainLabel()}</div><div class="ctrl-btns"><button class="cb${S.mic?'':' off'}" data-act="mic" aria-pressed="${!S.mic}" aria-label="${S.mic?'Mute':'Unmute'}" title="${S.mic?'Mute':'Unmute'}">${ic(S.mic?'mic':'micoff',24)}</button>
 <button class="cb${S.cam?'':' off'}" data-act="cam" aria-pressed="${!S.cam}" aria-label="${S.cam?'Turn camera off':'Turn camera on'}" title="Camera">${ic(S.cam?'cam':'camoff',24)}</button>
 <button class="cb${S.cap?' on':''}" data-act="cap" aria-pressed="${S.cap}" aria-label="${S.cap?'Turn off captions':'Turn on captions'}" title="Captions">${ic('cc',24)}</button>
 ${S.role==='er'?`<button class="cb${S.txr[S.role]?' on':''}" data-act="tx" aria-pressed="${S.txr[S.role]}" aria-label="${S.txr[S.role]?'Close transcript':'Open transcript'}" title="Transcript">${ic('doc',24)}</button>`:''}
 <button class="cb" data-act="fs" aria-label="${document.fullscreenElement?'Exit full screen':'Full screen'}" title="${document.fullscreenElement?'Exit full screen':'Full screen'}">${ic(document.fullscreenElement?'collapse':'expand',24)}</button>
 <span class="sep"></span>
 <button class="cb end" data-act="end" aria-label="${S.role==='er'?'End session':'Leave session'}" title="${S.role==='er'?'End session':'Leave'}">${ic('end',28)}</button>
 ${S.endConfirm&&S.role==='ee'?`<div class="confirm glass" role="alertdialog" aria-modal="true" aria-labelledby="cfmt" aria-describedby="cfmd"><b id="cfmt">Leave the interview?</b><p id="cfmd">Daniel Haddad will see that you left. You can rejoin any time.</p><div class="row"><button class="btn grow" data-act="cancelend">Keep going</button><button class="btn red grow" data-act="eeleave">Leave interview</button></div></div>`:''}${S.endConfirm&&S.role==='er'?`<div class="confirm glass" role="alertdialog" aria-modal="true" aria-labelledby="cfmt" aria-describedby="cfmd"><b id="cfmt">${uncovered()} of 8 steps not covered yet</b><p id="cfmd">End the session anyway? You can still rejoin for a few seconds after ending.</p><div class="row"><button class="btn grow" data-act="cancelend">Keep going</button><button class="btn red grow" data-act="confirmend">End session</button></div></div>`:''}</div>`;
}
function renderTranscript(){
 const d=$('#drawer');const showTx=S.role==='er'&&S.txr[S.role];d.hidden=!showTx;if(!showTx)return;
 d.innerHTML=`<div class="ch"><h2>Transcript<small>${S.lines.length} lines · live</small></h2><button class="ib sm" data-act="tx" aria-label="Close transcript">${ic('x',15)}</button></div>
 <div class="tx" id="txl">${S.lines.map(l=>`<div class="ln${l.off?' off':''}"><div class="h"><span class="s-${l.s}">${l.s===self()?'You':P[l.s].name}</span><span class="tm mono">${fmt(l.t)}</span>${l.ev&&S.role==='er'?`<span class="chip c-${l.ev}">${TYPES[l.ev][0]}</span>`:''}${l.off&&S.role==='er'?'<span class="chip c-undef">Off topic</span>':''}</div><p>${esc(l.x)}</p></div>`).join('')}</div>`;
 const t=$('#txl');t.scrollTop=t.scrollHeight;
}

/* ---------- toasts ---------- */
function placeToasts(){const t=$('#toasts'),slot=$('#toastslot'),inCall=!$('#stage').hidden&&slot;
 if(inCall){if(t.parentNode!==slot)slot.appendChild(t);t.classList.add('inline')}else{if(t.parentNode!==$('#app'))$('#app').appendChild(t);t.classList.remove('inline')}}
function toast(kind,title,body,icon,quote){placeToasts();
 const box=$('#toasts'),el=document.createElement('div');
 el.className='toast'+(kind==='info'?' info':'');el.setAttribute('role','status');
 el.innerHTML=`<span class="ti">${icon||ic('check',18,2.4)}</span><div style="min-width:0"><b>${esc(title)}</b>${body?`<p>${esc(body)}</p>`:''}${quote?`<q>${esc(quote)}</q>`:''}</div><button class="x" aria-label="Close">${ic('x',16)}</button>`;
 el.querySelector('.x').onclick=()=>el.remove();
 box.prepend(el);while(box.children.length>3)box.lastChild.remove();
 setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),300)},kind==='info'?3800:6000);
}

/* ---------- actions ---------- */
function verify(ev){
 ev.verified=!ev.verified;if(ev.verified)ev.flagged=false;
 if(ev.verified){
  const n={id:ev.id,q:ev.q,t:ev.t,topic:ev.step!=null?PLAIN[ev.step]:'General'};S.notifs.unshift(n);
  if(!S.opts.share){S.notifs.shift();if(!S.fast)toast('info','Verified','Sharing with Sofia is off for this session.',ic('check',18,2.4))}
  else if(S.role==='ee')showEeToast(n);else{S.unseen++;toast('info','Verified and shared with Sofia','She sees a confirmation on her screen.',ic('check',18,2.4))}
 }else{S.notifs=S.notifs.filter(n=>n.id!==ev.id)}
}
function showEeToast(n){toast('ok','Daniel Haddad verified something you said','Saved as an insight about '+n.topic.toLowerCase()+'.',ic('check',18,2.4),n.q)}
function act(a,b){
 const id=b.closest('[data-id]')?.dataset.id,ev=id&&S.evs.find(e=>e.id===id),v=b.dataset.v;
 switch(a){
  case 'join':join();return;
  case 'theme':applyTheme(effTheme()==='dark'?'light':'dark');return;
  case 'remind':S.reminded=true;renderLobby();toast('info','Reminder sent',P.thida.name.split(' ')[0]+' got a link to join the interview.',ic('check',18,2.4));return;
  case 'role':if(S.role===v)return;S.role=v;announce('Now viewing as '+(v==='er'?'Interviewer':'Interviewee'));S.endConfirm=false;S.menu=false;
   if(S.phase==='lobby'){renderLobby();return}
   if(S.ended){renderWrap();renderTop();return}
   renderAll();
   if(false){S.notifs.slice(0,Math.min(S.unseen,2)).reverse().forEach((n,i)=>setTimeout(()=>showEeToast(n),300+i*500));S.unseen=0;renderTop()}
   return;
  case 'fs':try{const p=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();p&&p.catch&&p.catch(()=>toast('info','Full screen is not available here','Open the page in a desktop browser to use full screen.',ic('expand',18)))}catch(x){toast('info','Full screen is not available here','Open the page in a desktop browser to use full screen.',ic('expand',18))}return;
  case 'menu':S.menu=!S.menu;renderTop();return;
  case 'speed':S.speed=+v;renderTop();return;
  case 'restart':start();return;
  case 'endnow':S.menu=false;endSession();return;
  case 'pin':S.pin[S.role]=v;renderVideo();renderCenter();renderCtrl();return;
  case 'unpin':S.pin[S.role]=null;renderVideo();renderCenter();renderCtrl();return;
  case 'mic':S.mic=!S.mic;if(S.phase==='lobby'){renderLobby();return}renderCtrl();renderVideo();if(!S.mic)toast('info','You are muted','Copilot still transcribes the other participants.',ic('micoff',18));return;
  case 'cam':S.cam=!S.cam;if(S.phase==='lobby'){renderLobby();return}renderCtrl();renderVideo();return;
  case 'spk':S.spk=!S.spk;renderCtrl();return;
  case 'tx':S.txr[S.role]=!S.txr[S.role];renderCtrl();renderTranscript();return;
  case 'cap':S.cap=!S.cap;renderCtrl();renderCaption();return;
  case 'end':if(S.ended||S.endUndo)return;
   if(S.role==='ee'){S.endConfirm=!S.endConfirm;renderCtrl();focusSel(S.endConfirm?'#ctrl .confirm [data-act=cancelend]':'#ctrl [data-act=end]');return}
   if(uncovered()>0&&!S.endConfirm){S.endConfirm=true;renderCtrl();focusSel('#ctrl .confirm [data-act=cancelend]');return}
   S.endConfirm=false;renderCtrl();startEndUndo();return;
  case 'rejoinend':stopEndUndo();toast('info','Rejoined the session','Recording and Copilot picked up where you left off.',ic('restart',18));return;
  case 'gowrap':stopEndUndo(true);endSession();return;
  case 'eeaway':case 'eeleave':S.eeLeft=a==='eeaway'?'away':'left';S.endConfirm=false;renderCtrl();renderSys();renderOvl();return;
  case 'eerejoin':S.eeLeft=false;S.endConfirm=false;renderSys();renderOvl();toast('info','You rejoined','Daniel Haddad can see and hear you again.',ic('restart',18));return;
  case 'reconnect':reconnect();return;
  case 'cancelend':S.endConfirm=false;renderCtrl();focusSel('#ctrl [data-act=end]');return;
  case 'confirmend':S.endConfirm=false;renderCtrl();startEndUndo();return;
  case 'filter':S.filter=v;renderFeed();return;
  case 'flag':if(ev){ev.flagged=!ev.flagged;if(ev.flagged&&ev.verified){ev.verified=false;S.notifs=S.notifs.filter(n=>n.id!==ev.id)}renderFeed();if(S.ended)renderWrap();else if(ev.flagged)toast('info','Flagged for revision','Review it in the session wrap-up.',ic('flag',18))}return;
  case 'ver':if(ev){verify(ev);renderFeed();renderTop();if(!S.ended)renderCoverage();if(S.ended)renderWrap()}return;
  case 'dis':if(ev){ev.dismissed=true;renderFeed();renderCoverage()}return;
  case 'map':S.mapOpen=S.mapOpen===id?null:id;S.mapStep=null;renderFeed();return;
  case 'mapstep':if(ev){ev.step=+v;ev.type='step';ev.mapped=true;S.mapOpen=null;renderFeed();renderCoverage();toast('info','Mapped to '+STEPS[+v],'Saved as job step evidence.',ic('layers',18))}return;
  case 'mapback':S.mapStep=null;renderFeed();return;
  case 'mapmj':if(ev&&ev.step!=null){const st=ev.step,mi=+v;ev.step=st;ev.mapped=true;
   if(mi<0){ev.type='step';toast('info','Mapped to '+STEPS[st],'Saved as job step evidence.',ic('layers',18))}
   else{const m=stepModel(st).mjs[mi];ev.mj=m.t;ev.type='outcome';ev.oc=ev.sugOc||ev.note;toast('info','Mapped to '+m.t,'Added as an undefined outcome under Step '+(st+1)+' · '+STEPS[st]+'. Verify it to confirm.',ic('layers',18));S.open.add(st)}
   S.mapOpen=null;S.mapStep=null;renderFeed();renderCoverage()}return;
  case 'mapto':if(ev){ev.step=+v;ev.mapped=true;ev.type='step';S.mapOpen=null;renderFeed();renderCoverage();toast('info','Mapped to '+STEPS[+v],'Saved as job step evidence. Add a micro-job in the wrap-up.',ic('layers',18))}return;
  case 'ask':if((S.card.mode==='suggest'||(S.card.mode==='warmup'&&S.warm&&S.warm.wait))&&S.resolver)S.resolver('ask');return;
  case 'askitem':{const i=+v,M=stepModel(i),k=b.dataset.k.split(':');const m=M.mjs[+k[1]];if(!m)return;
   const isO=k[0]==='o',t=isO?m.os[+k[2]].t:m.t;S.custom={step:i,kind:isO?'outcome':'micro',target:t,qs:itemQs(isO,t),qi:0,anim:true};
   if(S.warm&&S.stage==='warmup'){toast('info','Start the framework first','Then ask about this '+(isO?'outcome':'micro-job')+'.',ic('compass',18));S.custom=null;return}
   renderCopilot();return}
  case 'cask':{const C=S.custom;if(!C)return;const qq=custOpts(C)[C.qi];addLine('kay',qq);S.asked.push({t:S.elapsed,q:qq,step:C.step,how:'asked',reworded:[...RW.values()].includes(qq)});S.cur=C.step;S.custom=null;renderCopilot();renderCoverage();renderGuide();toast('info','Listening for the answer','Evidence will be matched to Step '+(C.step+1)+' · '+STEPS[C.step]+'.',ic('ask',18));return}
  case 'creword':if(S.custom){toggleRw(S.custom.qs[S.custom.qi]);S.custom.anim=true;S.rewords++;renderCopilot()}return;
  case 'cskip':S.custom=null;renderCopilot();return;
  case 'ptab':if(tabOf()===v)return;S.tabs[S.role]=v;if(v==='chat'){S.chatNew=0;renderChat();setTimeout(()=>{const i=$('#cin');if(i)i.focus()},0)}else if(S.role==='er'){S.copNew=false;renderCopilot()}else renderGuide();return;
  case 'pickq':{const k=+v;if(S.custom){S.custom.qi=k}else if(S.card.mode==='warmup'&&S.warm){S.warm.qi=k}else if(S.card.mode==='suggest'){S.card.qi=k}renderCopilot();return}
  case 'stepmenu':S.stepMenu=!S.stepMenu;renderCopilot();return;
  case 'follow':if(S.follow&&S.resolver)S.resolver('follow');return;
  case 'stay':if(S.follow&&S.resolver)S.resolver('stay');return;
  case 'acc':{const k=v==='u'?'u':+v;S.open.has(k)?S.open.delete(k):S.open.add(k);renderCoverage();return}
  case 'jumpstep':{const i=+v,k=segFor(i);
   if(S.ended||k<0)return;
   S.stepMenu=false;
   if(S.card.mode==='suggest'&&S.card.seg===k){renderCopilot();return}
   S.played.delete(k);S.followed=true;
   S.jump=i;
   if(S.warm){S.warm.go=true;if(S.resolver)S.resolver('start');return}
   if(S.drift&&S.resolver){S.resolver('back');return}
   if(S.resolver){S.resolver('jump');return}
   if(S.card.mode==='done'){S.seg=takeJump();run();return}
   toast('info',`Next: Step ${i+1} · ${STEPS[i]}`,'Copilot will switch when Sofia finishes this answer.',ic('compass',18));return}
  case 'startfw':if(S.warm){S.warm.go=true;if(S.resolver)S.resolver('start')}return;
  case 'skip':if((S.card.mode==='suggest'||(S.card.mode==='warmup'&&S.warm&&S.warm.wait))&&S.resolver)S.resolver('skip');return;
  case 'reword':
   if(S.card.mode==='warmup'&&S.warm){toggleRw(WARM_Q[S.warm.qi]);S.rewords++;S.card.anim=true;renderCopilot();return}
   if(S.card.mode==='suggest'){const sg=SEGS[S.card.seg];toggleRw((S.card.deep?deepQs(sg.step):[sg.q,...sg.alts])[S.card.qi]);S.rewords++;S.card.anim=true;renderCopilot()}
   else if(S.card.mode==='drift'&&S.drift){S.drift.bi=(S.drift.bi+1)%BRIDGES.length;S.rewords++;renderCopilot()}
   return;
  case 'back':
   if(S.drift){if(S.resolver)S.resolver('back');else{S.pendingBack=true;endDrift('back');}return}
   {const el=$('#cov .cr.cur')||$('#cov');el.classList.remove('pulse');void el.offsetWidth;el.classList.add('pulse');toast('info','You are on the framework','Current focus: '+(S.cur!=null?'Step '+(S.cur+1)+' · '+STEPS[S.cur]:'opening')+'.',ic('compass',18))}
   return;
  case 'dismiss':if(S.drift&&S.resolver)S.resolver('dismiss');return;
  case 'save':{const n=S.evs.filter(e=>!e.dismissed&&e.type!=='bg').length;S.saved=true;renderWrap();toast('ok','Sent for review',`${n} evidence items are now in the admin panel for verification.`)}return;
  case 'resume':goSession(0);return;
  case 'nextsess':goSession(1);return;
 }
}
document.addEventListener('click',e=>{
 if(S&&S.stepMenu&&!e.target.closest('.smw')){S.stepMenu=false;renderCopilot()}
 if(S.menu&&!e.target.closest('.menuwrap')){S.menu=false;renderTop()}
 const b=e.target.closest('[data-act]');if(b)act(b.dataset.act,b);
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='cform')return;e.preventDefault();const x=S.chatDraft.trim();if(!x)return;S.chatDraft='';const i=$('#cin');if(i)i.value='';const sb=$('#cform .csend');if(sb)sb.disabled=true;
 addChat(self(),x);
 {const g=GEN,from=S.role==='er'?'thida':'kay',txt=S.role==='er'?'Got it, thanks!':'Thanks, Sofia. Noted.';setTimeout(()=>{if(GEN!==g||S.ended)return;addChat(from,txt)},2200)}
});
document.addEventListener('input',e=>{if(e.target.id==='cin'){S.chatDraft=e.target.value;const sb=$('#cform .csend');if(sb)sb.disabled=!S.chatDraft.trim()}});
document.addEventListener('change',e=>{
 if(e.target.id==='consent'){S.consent=e.target.checked;const j=$('#joinbtn');if(j)j.disabled=!S.consent;const h=$('#joinhint');if(h)h.hidden=S.consent;return}
 if(e.target.dataset.opt){S.opts[e.target.dataset.opt]=e.target.checked;return}
 const s=e.target.closest('select[data-map]');if(!s||s.value==='')return;
 const ev=S.evs.find(x=>x.id===s.dataset.map);if(ev){const [st,mi]=s.value.split(':').map(Number);ev.step=st;ev.mapped=true;if(mi<0){ev.type='step'}else{const m=stepModel(st).mjs[mi];ev.mj=m.t;ev.type='outcome';ev.oc=ev.sugOc||ev.note}renderWrap();toast('info','Mapped to '+STEPS[st],mi<0?'Saved as job step evidence.':'Added as an outcome under “'+ev.mj+'”.',ic('layers',18))}
});
document.addEventListener('scroll',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('tl'))t.classList.toggle('atend',t.scrollLeft+t.clientWidth>=t.scrollWidth-4)},true);
document.addEventListener('keydown',e=>{
 if((e.key==='d'||e.key==='D')&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&S.phase==='call'&&!S.ended&&!S.endUndo&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)){simDrop();return}
 if(e.key==='Tab'){const box=S.endConfirm?document.querySelector('#ctrl .confirm'):(!$('#ovl').hidden&&$('#ovl'));if(box){const f=[...box.querySelectorAll('button:not([disabled])')];if(f.length){const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&(i===-1||i===f.length-1)){e.preventDefault();f[0].focus()}}}}
 if(e.key==='Escape'){if(S.endConfirm){S.endConfirm=false;renderCtrl();focusSel('#ctrl [data-act=end]')}if(S.menu){S.menu=false;renderTop()}if(S.mapOpen){S.mapOpen=null;renderFeed()}}});

/* ---------- end safety, leaving, drops ---------- */
function uncovered(){return S.stage!=='framework'?8:STEPS.filter((_,i)=>stepCount(i)===0).length}
let UNDO_T=null;
function startEndUndo(){S.endUndo={left:8};renderTop();renderOvl();clearInterval(UNDO_T);UNDO_T=setInterval(()=>{if(!S.endUndo)return clearInterval(UNDO_T);S.endUndo.left--;if(S.endUndo.left<=0){stopEndUndo(true);endSession()}else tickOvl()},1000)}
function tickOvl(){const o=document.querySelector('#ovl .ovc');const ring=o&&o.querySelector('.ring');if(!ring||S.role!=='er'){renderOvl();return}const L=S.endUndo.left;ring.style.setProperty('--p',L/8);ring.querySelector('span').textContent=L;const pp=o.querySelector('p');if(pp)pp.textContent=`Opening your wrap-up in ${L} second${L===1?'':'s'}.`}
function stopEndUndo(quiet){clearInterval(UNDO_T);S.endUndo=null;renderTop();renderOvl()}
let DROP_N=0;
function simDrop(){if(S.drop)return;const id=++DROP_N;S.drop={who:S.role,since:S.elapsed,n:S.evs.filter(e=>!e.dismissed).length,rejoin:false,id};renderTop();renderSys();renderOvl();
 setTimeout(()=>{if(S.drop&&S.drop.id===id){S.drop.rejoin=true;renderOvl()}},3000);
 setTimeout(()=>{if(S.drop&&S.drop.id===id)reconnect()},7000)}
function reconnect(){const d=S.drop;if(!d)return;S.drop=null;renderTop();renderSys();renderOvl();
 const away=fmt(S.elapsed-d.since),nn=S.evs.filter(e=>!e.dismissed).length-d.n;
 if(d.who==='er'&&S.role==='er')toast('info','You\u2019re back','While you were away: '+away+' \u00b7 '+nn+' new evidence item'+(nn===1?'':'s')+'.',ic('restart',18));
 else toast('info','Reconnected',d.who===S.role?'Your connection is back.':(d.who==='er'?'Daniel Haddad':'Sofia')+' is back in the call.',ic('restart',18))}
function awayId(){return S.eeLeft||(S.drop&&S.drop.who==='ee')?'thida':(S.drop&&S.drop.who==='er')?'kay':null}
function renderSys(){
 const el=$('#sys');document.querySelectorAll('[data-pid]').forEach(t=>t.classList.toggle('away',t.dataset.pid===awayId()));
 if(!el)return;let h='';
 if(S.role==='er'){
  if(S.eeLeft==='away')h=`<div class="sysb">${ic('alert',18,2)}<div><b>Sofia stepped away</b><p>She\u2019ll be back shortly. The session stays open.</p></div><button class="btn sm" data-act="end">End session</button></div>`;
  else if(S.eeLeft==='left')h=`<div class="sysb">${ic('alert',18,2)}<div><b>Sofia has left the interview</b><p>She can still rejoin. Or end the session and review the wrap-up.</p></div><button class="btn sm red" data-act="end">End session</button></div>`;
  else if(S.drop&&S.drop.who==='ee')h=`<div class="sysb"><i class="spin"></i><div><b>Sofia\u2019s connection dropped</b><p>Reconnecting\u2026 Nothing is lost.</p></div></div>`;
 }else{
  if(S.drop&&S.drop.who==='er')h=`<div class="sysb"><i class="spin"></i><div><b>Daniel Haddad\u2019s connection dropped</b><p>He\u2019ll be back shortly. Please stay on the call.</p></div></div>`;
 }
 el.innerHTML=h;
}
let SCREEN_INIT=false;
function goScreen(name,head){try{history.replaceState(null,'','#'+name)}catch(x){}
 if(!SCREEN_INIT){SCREEN_INIT=true;return}
 requestAnimationFrame(()=>{const h=document.querySelector(head);if(h){h.tabIndex=-1;h.focus({preventScroll:false})}})}
function announce(m){const r=$('#srlive');if(!r)return;r.textContent='';setTimeout(()=>{r.textContent=m},60)}
function focusSel(s){requestAnimationFrame(()=>{const e=document.querySelector(s);if(e)e.focus()})}
function renderOvl(){
 const o=$('#ovl');if(!o)return;let h='';
 if(S.endUndo&&S.role==='er'){const L=S.endUndo.left;h=`<div class="ovc"><div class="ring" style="--p:${L/8}"><span>${L}</span></div><b>Session ended</b><p>Opening your wrap-up in ${L} second${L===1?'':'s'}.</p><div class="row"><button class="btn" data-act="gowrap">Go to wrap-up</button><button class="btn pri" data-act="rejoinend">${ic('restart',16)}Rejoin</button></div></div>`}
 else if(S.endUndo&&S.role==='ee'){h=`<div class="ovc"><i class="spin big"></i><b>Daniel Haddad is ending the session</b><p>Thanks for your time.</p></div>`}
 else if(S.eeLeft==='away'&&S.role==='ee'){h=`<div class="ovc"><b>You stepped away</b><p>Daniel Haddad knows you\u2019ll be back. Your camera and microphone are off.</p><div class="row"><button class="btn pri" data-act="eerejoin">${ic('restart',16)}I\u2019m back</button></div></div>`}
 else if(S.eeLeft==='left'&&S.role==='ee'){h=`<div class="ovc"><span class="big2">${ic('check',28,2.4)}</span><b>Thanks for your time, Sofia</b><p>You\u2019ve left the interview. You can close this window.</p><div class="row"><button class="btn" data-act="eerejoin">Rejoin instead</button></div></div>`}
 else if(S.drop&&S.drop.who===S.role){h=`<div class="ovc"><i class="spin big"></i><b>Reconnecting\u2026</b><p>${S.role==='er'?'Your session is still open. Copilot keeps listening and capturing evidence.':'Your interview is still open. Daniel Haddad is waiting.'}</p>${S.drop.rejoin?`<div class="row"><button class="btn pri" data-act="reconnect">${ic('restart',16)}Rejoin now</button></div>`:''}</div>`}
 const was=!o.hidden;o.hidden=!h;o.innerHTML=h;
 if(h){o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');const t=o.querySelector('b');if(t){t.id='ovlt';o.setAttribute('aria-labelledby','ovlt')}}else{o.removeAttribute('role');o.removeAttribute('aria-modal')}
 [...$('#stage').children].forEach(c=>{if(c!==o&&c.id!=='toasts')c.inert=!!h});
 if(h&&!o.contains(document.activeElement)){const f=o.querySelector('button.pri,button');if(f)f.focus();else{o.tabIndex=-1;o.focus()}}
 if(!h&&was)focusSel('#ctrl [data-act=end]');
}
/* ---------- end + wrap-up ---------- */
async function endSession(){
 GEN++;clearInterval(UNDO_T);S.endUndo=null;S.drop=null;S.eeLeft=false;$('#ovl').hidden=true;[...$('#stage').children].forEach(c=>c.inert=false);if(S.drift){S.drift.dur=S.elapsed-S.drift.since;S.drift=null}
 S.state='ending';renderTop();
 await new Promise(r=>setTimeout(r,900));
 S.ended=true;S.state='ended';S.txr[S.role]=false;
 $('#stage').hidden=true;$('#wrap').hidden=false;renderWrap();goScreen('wrap','#wrap h1');
 document.body.style.overflow='';
}
function renderWrap(){
 const w=$('#wrap');
 if(S.role==='ee'){
  w.innerHTML=`<div class="wi"><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><div class="brand"><img class="logo lgl" src="${LOGO_P}" alt="SOZO LAB"><img class="logo lgd" src="${LOGO}" alt="SOZO LAB"><span>Innovation Copilot</span></div><span style="flex:1"></span>${rolesHTML()}${themeBtn()}</div>
  <div class="thanks"><span class="big">${ic('check',36,2.4)}</span><span class="eyebrow">Session ended · ${fmt(S.elapsed)}</span><h1>Thank You, Sofia</h1><p>Your experience helps the team understand what makes sending money to family hard. You can close this window.</p>
  </div></div>`;
  return;
 }
 const live=S.evs.filter(e=>!e.dismissed&&e.type!=='bg'),bgs=S.evs.filter(e=>!e.dismissed&&e.type==='bg').reverse(),ver=live.filter(e=>e.verified).length;
 const asked=S.asked.filter(a=>a.how!=='skipped').length,sk=S.asked.filter(a=>a.how==='skipped').length;
 const offT=S.drifts.reduce((t,d)=>t+(d.dur||0),0);
 const covered=STEPS.filter((_,i)=>stepCount(i)>0).length;
 const by=(i,k)=>live.filter(e=>e.step===i&&e.type===k).length;
 const und=live.filter(e=>e.type==='undef'&&e.step==null);
 const LOW=.6,flg=live.filter(e=>e.flagged),low=live.filter(e=>e.conf<LOW&&!e.verified);
 const rev=live.filter(e=>e.flagged||(e.type==='undef'&&e.step==null)||(e.conf<LOW&&!e.verified));
 const saveN=live.filter(e=>!e.flagged&&!(e.type==='undef'&&e.step==null)).length;
 const heldTxt=[flg.length?`${flg.length} flagged`:'',und.length?`${und.length} unmapped`:''].filter(Boolean).join(' and ');
 const next=[];
 STEPS.forEach((s,i)=>{const n=stepCount(i);if(!n)next.push(['alert',`Cover Step ${i+1} · ${s}`,S.skipped.has(i)?'Skipped in this session. Open with: “'+SEGS.find(g=>g.step===i).q+'”':'Not reached. No evidence yet.']);else if(n===1&&!live.some(e=>e.step===i&&e.verified))next.push(['target',`Probe deeper on ${s}`,'Only one unverified item. Ask for a specific recent example.'])});
 und.forEach(e=>next.push(['layers','Decide where this belongs',e.note+' “'+e.q+'”']));
 if(S.drifts.length)next.push(['compass','Keep follow-ups on the framework',`${S.drifts.length} off-topic moment${S.drifts.length>1?'s':''} (${fmt(offT)}). Park side topics for the end.`]);
 const CLQ=(()=>{const g=SEGS.find(x=>x.close);return g?[g.q,...g.alts]:[]})();
 const stLab=(st,q)=>st==null?(CLQ.some(x=>x===q||RW.get(x)===q)?'Closing':'Warm-up'):`Step ${st+1} · ${STEPS[st]}`;
 const askedL=S.asked.filter(a=>a.how!=='skipped'),skipL=S.asked.filter(a=>a.how==='skipped');
 const notL=SEGS.map((g,k)=>({g,k})).filter(({g,k})=>g.q&&!S.played.has(k)&&!S.skipSegs.has(k)).map(({g})=>({step:g.close?null:g.step,q:g.q}));
 const quote=(()=>{const ee=S.lines.filter(l=>l.s==='thida'&&!l.off&&l.x.length>30);return ee.filter(l=>l.ev).sort((a,b)=>b.x.length-a.x.length)[0]||ee.sort((a,b)=>b.x.length-a.x.length)[0]})();
 const heroRing=(v,label)=>{const r=50,c=2*Math.PI*r;return `<svg class="hring" viewBox="0 0 124 124" width="124" height="124" role="img" aria-label="${Math.round(v*100)}% ${label}"><defs><linearGradient id="hrg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#A8DADC"/></linearGradient></defs><circle cx="62" cy="62" r="${r}" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="10"/><circle cx="62" cy="62" r="${r}" fill="none" stroke="url(#hrg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-v)}" transform="rotate(-90 62 62)"/><text x="62" y="62" text-anchor="middle" class="rv">${Math.round(v*100)}%</text><text x="62" y="80" text-anchor="middle" class="rl2">${label}</text></svg>`};
 const covRing=()=>{const R=54,C=2*Math.PI*R,seg=C/8,gap=4;return `<svg class="cring" viewBox="0 0 132 132" aria-label="${covered} of 8 steps covered">${STEPS.map((st,i)=>{const on=stepCount(i)>0;return `<circle cx="66" cy="66" r="${R}" fill="none" stroke="${on?'var(--lime)':'var(--chip-hi)'}" stroke-width="12" stroke-dasharray="${seg-gap} ${C-seg+gap}" stroke-dashoffset="${-i*seg}" transform="rotate(-90 66 66)"><title>${i+1} · ${st}${on?' · covered':''}</title></circle>`}).join('')}<text x="66" y="64" text-anchor="middle" class="cr1">${Math.round(covered/8*100)}%</text><text x="66" y="84" text-anchor="middle" class="cr2">coverage</text></svg>`};
 const pathRaw=askedL.filter(a=>a.step!=null);let prev=null,mx=-1;
 const path=[{lab:'W',name:'Warm-up',t:(askedL[0]&&askedL[0].step==null)?askedL[0].t:0}];
 pathRaw.forEach(a=>{path.push({lab:a.step+1,name:STEPS[a.step],t:a.t,jump:a.jumped,back:a.back})});
 const jumps=path.filter(p=>p.jump).length,backs=path.filter(p=>p.back).length;
 const groups=STEPS.map((s,i)=>({i,s,items:live.filter(e=>e.step===i)})).filter(g=>g.items.length);
 w.innerHTML=`<div class="wi">
 <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><div class="brand"><img class="logo lgl" src="${LOGO_P}" alt="SOZO LAB"><img class="logo lgd" src="${LOGO}" alt="SOZO LAB"><span>Innovation Copilot</span></div><span style="flex:1"></span>${rolesHTML()}${themeBtn()}</div>
 <section class="whero ehero hh">
  <div class="hh-top"><span>${SES().date} · Session ${SES().n} of 6</span><button class="hh-link" data-act="resume">${ic('restart',14)}Restart demo</button></div>
  <h1>Milo · School &amp; Sport</h1>
  <dl class="hh-tk">
   <div><dt>Participant</dt><dd>Sofia Marin</dd></div>
   <div><dt>Job</dt><dd>Give my child energy for school and sport</dd></div>
   <div><dt>Job steps</dt><dd><span class="hh-sq">${STEPS.map((st,i)=>`<i class="${stepCount(i)>0?'on':''}" title="${i+1} · ${st}"></i>`).join('')}</span><span class="hh-n">${covered} of 8</span></dd></div>
   <div><dt>Evidence</dt><dd>${live.length} saved, awaiting verification</dd></div>
  </dl>
 </section>
 <div class="stats">
  <div class="stat"><span class="si">${ic('mic',18)}</span><span>Duration</span><b class="mono">${fmt(S.elapsed)}</b><small>${S.lines.length} transcript lines${S.drifts.length?` · ${fmt(offT)} off topic`:''}</small></div>
  <div class="stat"><span class="si">${ic('layers',18)}</span><span>Evidence captured</span><b>${live.length}</b><div class="mbar">${['outcome','micro','step','undef'].map(k=>{const n=live.filter(e=>e.type===k).length;return n?`<i style="flex:${n};background:${TYPES[k][1]}" title="${n} ${TYPES[k][0]}"></i>`:''}).join('')}</div><small>${['outcome','micro','step','undef'].map(k=>{const n=live.filter(e=>e.type===k).length;return n?`<em><i style="background:${TYPES[k][1]}"></i>${n} ${TYPES[k][0].toLowerCase()}</em>`:''}).join('')}</small></div>
  <div class="stat"><span class="si">${ic('ask',18)}</span><span>Questions asked</span><b>${asked}</b><div class="mbar">${asked?`<i style="flex:${asked};background:var(--lime)"></i>`:''}${sk?`<i style="flex:${sk};background:var(--amber)"></i>`:''}${notL.length?`<i style="flex:${notL.length};background:var(--chip-hi)"></i>`:''}</div><small><em><i style="background:var(--lime)"></i>${asked} asked</em><em><i style="background:var(--amber)"></i>${sk} skipped</em><em><i style="background:var(--chip-hi)"></i>${notL.length} not asked</em></small></div>
  <div class="stat"><span class="si">${ic('reword',18)}</span><span>Topic jumps</span><b>${jumps}</b><small><em><i style="background:var(--violet)"></i>${jumps} jump${jumps===1?'':'s'} followed</em><em><i style="background:var(--amber)"></i>${backs} returned to</em><em>${S.drifts.length} off-topic</em></small></div>
 </div>

 <section class="wc qwc"><h2>Questions<small>What was asked and what is still open</small></h2>
  <div class="qcols" tabindex="0" role="region" aria-label="Questions asked, skipped and not asked">
   <div class="qcol"><h3>Asked <span>${askedL.length}</span></h3>${askedL.map(a=>`<div class="qi"><div class="qmeta"><span class="qst">${stLab(a.step,a.q)} · ${fmt(a.t||0)}</span><span class="qtgs">${a.jumped?'<span class="qtg j">Jumped</span>':''}${a.back?'<span class="qtg m">Missed earlier</span>':''}${a.how==='bridged'?'<span class="qtg b">Bridged back</span>':''}${a.reworded?'<span class="qtg">Reworded</span>':''}${a.own?'<span class="qtg o">Own question</span>':''}</span></div><p>${esc(a.q)}</p></div>`).join('')||'<div class="empty">No questions were asked.</div>'}</div>
   <div class="qcol"><h3>Skipped <span>${skipL.length}</span></h3>${skipL.map(a=>`<div class="qi"><div class="qmeta"><span class="qst">${stLab(a.step,a.q)} · ${fmt(a.t||0)}</span></div><p>${esc(a.q)}</p></div>`).join('')||'<div class="empty">Nothing was skipped.</div>'}
    <h3 class="h2nd">Not asked <span>${notL.length}</span></h3>${notL.map(g=>`<div class="qi"><span class="qst">${stLab(g.step,g.q)}</span><p>${esc(g.q)}</p></div>`).join('')||'<div class="empty">Every planned question was asked or skipped.</div>'}</div>
  </div>
 </section>
 ${SI===0?(()=>{const nx=SESSIONS[1],unc=STEPS.map((st,i)=>[st,i]).filter(([,i])=>!stepCount(i));return `<section class="upnext" aria-label="Next session"><div class="un-l"><span class="un-k">Up next</span><h2>Session ${nx.n} of 6 · ${esc(nx.who)}</h2><p>${nx.date} · ${nx.time} · about 30 minutes</p></div><button class="btn pri un-go" data-act="nextsess">Go to session ${nx.n}${ic('chev',16,2.2)}</button></section>`})():''}

 </div>`;
}
function wbtns(e){return `<div class="btns"><button class="vbtn${e.verified?' on':''}" data-act="ver" aria-pressed="${e.verified}">${ic('check',15,2.2)}${e.verified?'Verified':'Verify'}</button><button class="vbtn${e.flagged?' flg':''}" data-act="flag" aria-pressed="${!!e.flagged}">${ic('flag',15)}${e.flagged?'Unflag':'Flag'}</button></div>`}
function effTheme(){const t=document.documentElement.dataset.theme;return t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}
function themeBtn(){const d=effTheme()==='dark';return `<span class="tdiv" aria-hidden="true"></span><button class="theme" data-act="theme" role="switch" aria-checked="${d}" aria-label="Dark mode" title="${d?'Dark mode on':'Dark mode off'}"><span class="tk"><svg class="sun" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9"/></svg><svg class="moon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M13.2 10.2A5.6 5.6 0 0 1 5.8 2.8a5.6 5.6 0 1 0 7.4 7.4z"/></svg></span></button>`}
function applyTheme(t){document.documentElement.dataset.theme=t;THEME_SAVED=t;try{localStorage.setItem('ic-theme-nv',t)}catch(x){}
 if(S.phase==='lobby')renderLobby();if(!$('#stage').hidden)renderTop();if(S.ended)renderWrap()}
const SYS_DARK=matchMedia('(prefers-color-scheme: dark)');let THEME_SAVED=null;try{THEME_SAVED=localStorage.getItem('ic-theme-nv')}catch(x){}
document.documentElement.dataset.theme=(THEME_SAVED==='light'||THEME_SAVED==='dark')?THEME_SAVED:(SYS_DARK.matches?'dark':'light');
SYS_DARK.addEventListener('change',e=>{if(THEME_SAVED)return;document.documentElement.dataset.theme=e.matches?'dark':'light';if(S.phase==='lobby')renderLobby();if(!$('#stage').hidden)renderTop();if(S.ended)renderWrap()})
function rolesHTML(){return `<div class="roles glass" role="group" aria-label="Switch view"><button aria-pressed="${S.role==='er'}" class="${S.role==='er'?'on':''}" data-act="role" data-v="er">Interviewer</button><button aria-pressed="${S.role==='ee'}" class="${S.role==='ee'?'on':''}" data-act="role" data-v="ee">Interviewee</button></div>`}

document.addEventListener('fullscreenchange',()=>{if(!S.ended)renderCtrl()});
/* ---------- clock ---------- */
setInterval(()=>{if(S&&S.state==='recording'&&!S.ended&&!S.endUndo){S.elapsed+=.25*S.speed;const t=$('#tmr');if(t)t.textContent=fmt(S.elapsed);const d=$('#dtm');if(d)d.textContent=driftDur()}},250);

function start(){
 GEN++;RW.clear();const role=S?S.role:'er';const sp=S?S.speed:1;S=fresh();S.role=role;S.speed=sp;EVN=0;
 $('#stage').hidden=true;$('#wrap').hidden=true;$('#lobby').hidden=false;$('#toasts').innerHTML='';
 renderLobby();goScreen('lobby','#lobby h1');
 const g=GEN;if(!SI)setTimeout(()=>{if(g!==GEN||S.otherHere)return;S.otherHere=true;if(S.phase==='lobby')renderLobby();else{renderTop();renderVideo();renderCenter();toast('info','Sofia joined','You can start the conversation.',ic('check',18,2.4))}},9000);
}
function join(){
 if(!S.consent)return;
 if(S.role==='ee')S.otherHere=true;S.phase='call';const L=$('#lobby');L.classList.add('leaving');$('#stage').hidden=false;
 renderAll();run();goScreen('call','#top h1');setTimeout(()=>{L.hidden=true;L.classList.remove('leaving')},550);
}
const DEV={mic:['MacBook Pro Microphone','AirPods Pro','External USB Mic'],cam:['FaceTime HD Camera','Logitech C920'],spk:['MacBook Pro Speakers','AirPods Pro']};
function renderLobby(){
 const me=P[self()],other=P[S.role==='er'?'thida':'kay'],C=S.checks,here=S.role==='er'?S.otherHere:true;
 const chk=(k,l,off)=>{const st=C[k]===0?'run':off?'warn':'ok';return `<span class="pc pc-${st}">${st==='run'?'<i class="spin"></i>':st==='warn'?ic('alert',14,2):ic('check',14,2.6)}${off&&st!=='run'?off:l}</span>`};
 const ready=C.mic&&C.cam&&C.net;
 const L=$('#lobby');
 L.innerHTML=`<div class="lb-bg">${me.img&&S.cam?`<img src="${me.img}" alt="" style="object-position:${me.pos}">`:''}</div>
 <div class="lb-top"><div class="brand"><img class="logo lgl" src="${LOGO_P}" alt="SOZO LAB"><img class="logo lgd" src="${LOGO}" alt="SOZO LAB"><span>Innovation Copilot</span></div><span style="flex:1"></span>${rolesHTML()}${themeBtn()}</div>
 <div class="lb-center"><section class="lc glass" aria-label="Join interview">
  <div class="lc-pv">${S.cam?`<img class="pt ph" src="${me.img}" alt="Your camera preview" style="object-position:${me.pos}">`:`<div class="camoff"><b>${me.ini}</b></div>`}
   <div class="lc-pvc"><button class="cb${S.mic?'':' off'}" data-act="mic" aria-pressed="${!S.mic}" aria-label="${S.mic?'Mute':'Unmute'}" title="${S.mic?'Mute':'Unmute'}">${ic(S.mic?'mic':'micoff',22)}</button><button class="cb${S.cam?'':' off'}" data-act="cam" aria-pressed="${!S.cam}" aria-label="${S.cam?'Turn camera off':'Turn camera on'}" title="Camera">${ic(S.cam?'cam':'camoff',22)}</button></div>
  </div>
  <div class="lc-head"><span class="lc-sess2">Session ${SES().n} of 6</span><h1>Milo · School &amp; Sport</h1></div>
  <p class="lc-wait${here?'':' away'}">${SI&&S.role==='er'?'<span class="lw-av"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4" fill="currentColor"/><path d="M4.5 20c.8-3.6 3.9-5.5 7.5-5.5s6.7 1.9 7.5 5.5" fill="currentColor"/></svg></span>':`<span class="lw-av lw-ph"><img src="${other.img}" alt="" style="object-position:${other.pos}"></span>`}${here?`<span><b>${esc(other.name)}</b> is waiting</span>`:`<span><b>${esc(other.name.split(' ')[0])}</b> hasn\u2019t joined yet · ${SI?SES().date.replace(/ \d{4}$/,'')+' · ':''}Starts at ${SES().time}</span>`}</p>
  <label class="consent"><input type="checkbox" id="consent" ${S.consent?'checked':''}><span>I agree to this session being recorded and transcribed.</span></label>
  <button class="btn pri join" data-act="join" id="joinbtn" aria-describedby="joinhint"${S.consent?'':' disabled'}>Join Interview</button><p class="joinhint" id="joinhint"${S.consent?' hidden':''}>Tick the consent box above to join.</p>${SI?'<button class="lnk2 replay" data-act="resume">Replay the session 3 demo</button>':''}
 </section></div>`;
}
function runChecks(){const g=GEN;S.checks={mic:0,cam:0,net:0};['mic','cam','net'].forEach((k,i)=>setTimeout(()=>{if(g!==GEN||S.phase!=='lobby')return;S.checks[k]=1;renderLobby()},700+i*600))}
start();
