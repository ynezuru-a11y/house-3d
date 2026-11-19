// Concept geometry in metres. Roofs stop at the open courtyard boundary.
window.drawTuscanHouse = function(out, api) {
  const {box, face, prism, view, night}=api;
  const split=view==='explode', floor=view==='f1'||view==='f2';
  const lift=split?2.2:0, roofLift=split?4.5:0;
  const C={wall:'#eadbc3',stone:'#bdab8d',trim:'#f3e5ce',tile:'#ad573a',wood:'#674632',shutter:'#43574b',iron:'#343b35',glass:night?'#edbd72':'#45616a'};
  const p=(x,y,z)=>({x,y,z});
  function panel(points,color,alpha=1){out.push(face(points,color,alpha,'rgba(59,43,30,.08)'))}
  function frontRect(x,z,w,y,h,color){panel([p(x-w/2,y,z),p(x+w/2,y,z),p(x+w/2,y+h,z),p(x-w/2,y+h,z)],color)}
  function rail(x,z,w,y,axis='x'){
    if(axis==='x'){
      box(out,x,z,w,.06,y+1.08,.065,C.iron);
      for(let t=-w/2;t<=w/2;t+=.22)box(out,x+t,z,.032,.04,y,.99,C.iron);
    }else{
      box(out,x,z,.06,w,y+1.08,.065,C.iron);
      for(let t=-w/2;t<=w/2;t+=.22)box(out,x,z+t,.04,.032,y,.99,C.iron);
    }
  }
  function arch(x,z,width,bottom,spring,top,depth,axis='x'){
    const r=width/2, point=(u,y,v)=>axis==='x'?p(x+u,y,z+v):p(x+v,y,z+u);
    for(let i=0;i<20;i++){
      const a=Math.PI*i/20,b=Math.PI*(i+1)/20;
      const u1=Math.cos(a)*r,u2=Math.cos(b)*r,y1=spring+Math.sin(a)*r,y2=spring+Math.sin(b)*r;
      for(const d of [-depth/2,depth/2])panel([point(u1,y1,d),point(u2,y2,d),point(u2,top,d),point(u1,top,d)],C.wall);
      panel([point(u1,y1,-depth/2),point(u2,y2,-depth/2),point(u2,y2,depth/2),point(u1,y1,depth/2)],C.stone);
      const rr=r+.12;
      panel([point(u1,y1,depth/2+.008),point(u2,y2,depth/2+.008),point(Math.cos(b)*rr,spring+Math.sin(b)*rr,depth/2+.008),point(Math.cos(a)*rr,spring+Math.sin(a)*rr,depth/2+.008)],C.trim);
    }
    for(const u of [-r-.17,r+.17]){
      if(axis==='x'){box(out,x+u,z,.34,depth,bottom,top-bottom,C.wall);box(out,x+u,z,.43,depth+.1,spring-.08,.13,C.trim)}
      else {box(out,x,z+u,depth,.34,bottom,top-bottom,C.wall);box(out,x,z+u,depth+.1,.43,spring-.08,.13,C.trim)}
    }
  }
  function roof(x,z,w,d,y,rise){
    const a=p(x-w/2,y,z-d/2),b=p(x+w/2,y,z-d/2),c=p(x+w/2,y,z+d/2),e=p(x-w/2,y,z+d/2);
    const u=p(x-w*.24,y+rise,z),v=p(x+w*.24,y+rise,z);
    const surfaces=[[a,b,v,u],[e,u,v,c],[a,u,e],[b,c,v]];
    surfaces.forEach((q,i)=>{
      panel(q,['#a65e43','#b66b4a','#ad6548','#a15b42'][i]);
      if(q.length===4){
        const mix=(A,B,t)=>p(A.x+(B.x-A.x)*t,A.y+(B.y-A.y)*t+.008,A.z+(B.z-A.z)*t);
        const at=(s,t)=>mix(mix(q[0],q[3],t),mix(q[1],q[2],t),s);
        for(let row=0;row<10;row++)for(let col=0;col<36;col++){
          const s=col/36,t=row/10,edge=(col+.12)/36;
          panel([at(s,t),at(edge,t),at(edge,(row+1)/10),at(s,(row+1)/10)],'#bf7a56');
          panel([at(s,t),at((col+1)/36,t),at((col+1)/36,t+.008),at(s,t+.008)],'#99543d');
        }
      }
    });
    box(out,x,z,w*.48,.12,y+rise-.025,.065,'#c48059');
    box(out,x,z+d/2,w,.1,y-.08,.1,C.wood);box(out,x,z-d/2,w,.1,y-.08,.1,C.wood);
  }
  function windowFront(x,z,y,w=1.15,h=1.65){
    frontRect(x,z,w+.24,y-.1,h+.2,C.stone);
    frontRect(x,z+.012,w,y,h,'#302f2b');frontRect(x,z+.02,w-.12,y+.06,h-.12,C.glass);
    box(out,x,z+.03,.045,.035,y,h,C.wood);box(out,x,z+.035,w,.035,y+h*.5,.045,C.wood);
    box(out,x,z+.06,w+.3,.18,y-.14,.09,C.trim);
    for(const side of [-1,1]){
      const xx=x+side*(w/2+.3);
      box(out,xx,z+.06,.45,.085,y,h,C.shutter);
      for(let yy=y+.09;yy<y+h;yy+=.14)box(out,xx,z+.11,.37,.025,yy,.025,'#73806a');
    }
  }
  function windowSide(x,z,y,w=1.2,h=1.6){
    const side=x>0?1:-1;
    box(out,x,z,.06,w+.2,y-.08,h+.16,C.stone);
    box(out,x+side*.05,z,.04,w,y,h,C.glass);
    box(out,x+side*.085,z,.04,.045,y,h,C.wood);
    box(out,x+side*.085,z,.04,w,y+h*.5,.045,C.wood);
    for(const t of [-1,1])box(out,x+side*.09,z+t*(w/2+.29),.07,.42,y,h,C.shutter);
  }
  function stoneBase(x,z,w,d,y,h){
    box(out,x,z,w+.02,d+.02,y,h,C.stone);
    for(let yy=y+.05;yy<y+h-.05;yy+=.22){
      const offset=Math.round(yy*10)%2? .35:0;
      for(let xx=x-w/2+.1;xx<x+w/2-.2;xx+=.64){
        const ww=Math.min(.58,x+w/2-xx-.02);
        frontRect(xx+ww/2,z+d/2+.025,ww,yy,.185,['#b7a387','#c8b99e','#a89882'][Math.floor((xx+15+offset)*3)%3]);
      }
    }
  }
  const a1=floor?.06:1,a2=floor?.05:1;
  [[0,9,8,5],[0,-2.25,8,7.5],[-1.5,4,5,5],[2.5,4,3,5]].forEach(([x,z,w,d])=>{
    box(out,x,z,w,d,0,3.2,C.wall,a1);
    if(!floor)stoneBase(x,z,w,d,0,.62);
    box(out,x,z,w,d,3.16,.12,C.trim,floor?.05:1);
  });
  if(!floor){
    windowFront(-1.8,11.52,.82,1.2,1.65);
    frontRect(2.35,11.55,1.55,.05,2.45,C.wood);
    for(const xx of [1.82,2.17,2.52,2.87])box(out,xx,11.59,.024,.035,.17,2.15,'#937054');
    box(out,2.7,11.64,.045,.045,1.15,.28,'#c9b079');
    [-2.25,9].forEach(z=>{windowSide(-4.03,z,.82);windowSide(4.03,z,.82)});
    // Door is aligned with the utility courtyard, not hidden behind an upper volume.
    box(out,-4.04,4,.06,1.5,.05,2.28,C.wood);
    for(const x of [-2.6,0,2.6])arch(x,12.7,2.16,.08,1.58,3.04,.38);
    box(out,0,12.18,8,1.36,0,.09,C.stone);
    panel([p(-4.18,3.05,13),p(4.18,3.05,13),p(4.18,3.38,11.45),p(-4.18,3.38,11.45)],C.tile);
    for(let x=-4.1;x<=4.1;x+=.19)panel([p(x,3.056,13),p(x+.055,3.056,13),p(x+.055,3.386,11.45),p(x,3.386,11.45)],'#c57c58');
    for(const x of [-3.6,3.6]){prism(out,x,13.45,.28,.05,.45,C.tile,12);prism(out,x,13.45,.32,.4,.65,'#67784e',12)}
  }
  if(view!=='f1'){
    [[0,9,8,5],[0,-2.25,8,7.5],[3.1,4,1.8,5]].forEach(([x,z,w,d])=>box(out,x,z,w,d,3.2+lift,3,C.wall,a2));
    if(!floor){
      [-2.15,2.15].forEach(x=>windowFront(x,11.52,4.05+lift,1.18,1.64));
      [-2.25,9].forEach(z=>{windowSide(-4.03,z,4.05+lift);windowSide(4.03,z,4.05+lift)});
      for(const z of [2.75,5.25])arch(1.13,z,2.06,3.28+lift,4.6+lift,6.12+lift,.2,'z');
      box(out,2.19,3.5,.04,.65,3.3+lift,.9,'#f5f0e6');
    }
    box(out,-1.5,4,5,5,3.22+lift,.08,'#c08a64');
    box(out,1.7,4,1.4,5,3.22+lift,.08,'#b7a68b');
    rail(-3.9,4,5,3.3+lift,'z');
    for(const z of [2.35,5.65])rail(1.1,z,1.55,3.3+lift,'z');
    // Two retractable rails sit above the walking zone; garden side remains open.
    for(const x of [1.48,1.9])box(out,x,4,.025,3.3,5.6+lift,.025,C.iron);
    for(const z of [2.35,5.65])box(out,1.7,z,.6,.035,5.6+lift,.035,C.iron);
    if(!floor){
      for(const z of [2.4,5.5]){box(out,-3.3,z,.7,.95,3.3+lift,.38,C.stone);prism(out,-3.3,z,.39,3.65+lift,.65,'#68794c',12)}
      box(out,-1.25,2.25,1.9,.5,3.3+lift,.43,C.wood);
    }
    if(view!=='f2'){
      const y=6.2+lift+roofLift;
      // Main roofs rise 1.2m; courtyard limits are z=1.5 and z=6.5.
      roof(0,9.1,8.5,5.2,y,1.2);
      roof(0,-2.35,8.5,7.7,y,1.2);
      roof(2.55,4,2.9,5,y,.68);
    }
  }
};
