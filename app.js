(() => {
  const canvas=document.getElementById('scene'),ctx=canvas.getContext('2d',{alpha:true}),app=document.getElementById('app');
  let dpr=1,W=0,H=0,az=-.55,el=.46,zoom=1.2,view='all',labelsOn=false,night=false,styleMode='western',drag=false,px=0,py=0;
  const P={wall:'#e9e2d4',slab:'#d5cec0',roof:'#263c37',glass:'#547b79',court:'#88a789',path:'#c9bda8',tree:'#52795f',trunk:'#8c684b',water:'#6f9b9b',living:'#b86f4c',dining:'#c79a5d',kitchen:'#789887',elder:'#9a7f9f',flex:'#708eab',service:'#858b86',master:'#b56f77',bedroom:'#7189a3',closet:'#b5966c',bath:'#6f9a9e',family:'#b18056',terrace:'#7b9b72'};
  const info={
    all:{title:'整体建筑',rooms:[['整块用地','约8m × 31m','path'],['外观样式','默认现代意式，可切换东方','roof'],['前空地','4m × 8m，设正式院门','dining'],['主体','纵向17.5m × 横向8m','living'],['后空地','9.5m × 8m','terrace'],['二楼露天花园','约5m × 5m，无屋顶','court']],logic:['现代意式采用浅米石材、炭灰檐口、克制柱廊和深色金属院门，不做繁复仿欧线脚。','保留东方样式切换，便于在相同户型和体量下直接比较两种外观。','院门—前庭—入户门形成完整归家层次；正立面只保留必要采光窗。']},
    f1:{title:'一层 · 前后分离的双厨房',rooms:[['客厅','后段一侧，面向后院','living'],['封闭中厨','位于后段，重油烟烹饪','kitchen'],['轻食 / 备餐厨房','位于前段，紧邻餐厅','dining'],['小食品储藏间','约5㎡，只放干货与小家电','service'],['后勤 / 清洗区','连接中厨与后院','service'],['老人房 / 客房','前段一侧','elder'],['玄关与餐厅','靠入户门及轻食厨房','dining'],['中部储物间','5m×5m，可设门','service'],['楼梯、公卫与洗衣','中部3m宽连接带','bath']],logic:['两间厨房完全前后分开：轻食厨房在前段靠餐厅，中间隔着储物区和交通核；封闭中厨在后段靠后院。','食品储藏间不是硬性必需，但双厨房家庭建议保留约3–5㎡，用于米面粮油、饮料、备用餐具和小家电。','储藏间不代替冰箱，也不放潮湿杂物；靠中厨布置，减少搬运距离。']},
    f2:{title:'二层 · 卧室、花园与晾晒层',rooms:[['主卧','后段一侧','master'],['衣帽间','主卧独立收纳','closet'],['卫生间','与一层湿区上下对应','bath'],['卧室二','前段一侧','bedroom'],['卧室三 / 书房','前段另一侧','flex'],['家庭厅与楼梯厅','后段及中部连接带','family'],['洗衣柜','紧邻晾晒走廊','service'],['有顶晾晒走廊','约1.2m×5m，面向花园通风','terrace'],['露天小花园','约5m×5m，上方无屋顶','court']],logic:['晾晒走廊设置在二楼中部侧边，约1.2m宽，连接楼梯厅、洗衣柜和露天花园。','走廊利用侧边房间屋面遮雨，但不伸到5×5m花园上方；设置地漏、滴水线和可升降晾衣杆。','满足至少两间卧室、一个卫生间和独立衣帽间，并预留第三间弹性房。']},
    roof:{title:'屋顶层 · 花园上方不封顶',rooms:[['房间屋面','1.2m女儿墙控制','roof'],['设备区','热水、空调与检修','service'],['二楼花园上空','完全露天，不设屋顶','court'],['后院','设备维护与晾晒补充','terrace']],logic:['1.2m高度仅用于房间屋面女儿墙及设备遮挡，不作为正常卧室。','二楼5m×5m花园上方完全留空，不设置玻璃房、雨棚或第三层楼板。','花园做好结构找坡、防水、溢流口和独立排水。']},
    explode:{title:'分层关系',rooms:[['一层','公共活动、卧室与带门储物','living'],['二层','卧室、衣帽间与露天花园','bedroom'],['屋顶层','仅覆盖房间部分','roof'],['花园上空','从二楼花园贯通天空','court']],logic:['分层视图可看到一楼储物空间正上方对应二楼露天花园。','卫生间、厨房和设备区尽量上下对齐。','花园楼板荷载、防水和排水需由当地设计单位专项计算。']}
  };
  info.all.rooms[1]=['外观样式','托斯卡纳乡宅 · 实景参考重设计','roof'];
  info.all.logic=['前后双坡屋顶采用陶土色，屋脊升高约1.2m；中部露天花园上方留空。','前庭三联拱廊形成有阴影的入户空间，浅灰泥墙面、局部石材基座与深绿百叶窗统一外观。','二楼生活过道以侧向拱廊面向花园，洗衣、晾晒与通行仍安排在侧边连接带内。'];
  info.roof.rooms=[['意式坡屋顶','屋脊升高约1.2m','roof'],['前后两段','各自独立起坡','living'],['花园上方','完全露天','court'],['侧边廊道','独立低坡屋面','service']];
  info.roof.logic=['托斯卡纳方案将原来的1.2m屋顶层改为坡屋顶高度，不作为可居住第三层。','坡屋顶严格止于花园边界，前后两段不跨院相连。','设备检修位置、屋面排水和结构做法需在施工图阶段确定。'];
  const rooms={
    f1:[[-1.8,9,4.4,5,'老人房','elder'],[2.2,10.25,3.6,2.5,'玄关/餐厅','dining'],[2.2,7.75,3.6,2.5,'轻食/备餐厨房','dining'],[-1.5,4,5,5,'带门储物间','service'],[2.5,5.25,3,2.5,'楼梯','service'],[2.5,3.38,3,1.25,'公卫','bath'],[2.5,2.13,3,1.25,'洗衣储藏','service'],[-2,-1,4,4.5,'封闭中厨','kitchen'],[-3,-4.625,2,2.75,'小食品储藏间','service'],[-1,-4.625,2,2.75,'后勤/清洗区','service'],[2,-2.25,4,7.5,'客厅','living']],
    f2:[[-1.75,9,4.5,5,'卧室二','bedroom'],[2.25,9,3.5,5,'卧室三/书房','flex'],[3.1,5.25,1.8,2.5,'楼梯厅','service'],[3.1,3.5,1.8,1,'洗衣柜','service'],[3.1,2.25,1.8,1.5,'公卫','bath'],[1.6,4,1.2,5,'晾晒走廊','terrace'],[-2,-2.25,4,7.5,'主卧','master'],[2,.5,4,2,'衣帽间','closet'],[2,-1.6,4,2.2,'主卫','bath'],[2,-4.35,4,3.3,'家庭厅','family'],[-1.5,4,5,5,'露天小花园','terrace']]
  };

  function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render()}
  function shade(hex,a){const n=parseInt(hex.slice(1),16),c=v=>Math.max(0,Math.min(255,v));return `rgb(${c((n>>16)+a)},${c(((n>>8)&255)+a)},${c((n&255)+a)})`}
  function tr(p){const ca=Math.cos(az),sa=Math.sin(az),ce=Math.cos(el),se=Math.sin(el),x1=ca*p.x-sa*p.z,z1=sa*p.x+ca*p.z,y1=ce*p.y-se*z1,z2=se*p.y+ce*z1,b=Math.min(W>850?W-350:W,H)/32;return{x:W*(W>850?.39:.5)+x1*b*zoom,y:H*(el===0?.75:(W>850?.59:.48))-y1*b*zoom,d:z2}}
  function face(ps,color,alpha=1,stroke='rgba(28,39,35,.22)'){const q=ps.map(tr);return{q,d:q.reduce((s,p)=>s+p.d,0)/q.length,color,alpha,stroke}}
  function box(out,x,z,w,d,y,h,color,alpha=1){const X=x-w/2,A=x+w/2,Z=z-d/2,B=z+d/2,Y=y,T=y+h,p=(x,y,z)=>({x,y,z});out.push(face([p(X,Y,Z),p(A,Y,Z),p(A,T,Z),p(X,T,Z)],shade(color,-18),alpha));out.push(face([p(A,Y,Z),p(A,Y,B),p(A,T,B),p(A,T,Z)],shade(color,-32),alpha));out.push(face([p(A,Y,B),p(X,Y,B),p(X,T,B),p(A,T,B)],shade(color,5),alpha));out.push(face([p(X,Y,B),p(X,Y,Z),p(X,T,Z),p(X,T,B)],shade(color,-8),alpha));out.push(face([p(X,T,Z),p(A,T,Z),p(A,T,B),p(X,T,B)],shade(color,18),alpha))}
  function prism(out,x,z,r,y,h,color,n=8,alpha=1){const a=[];for(let i=0;i<n;i++){const t=6.283*i/n;a.push({x:x+Math.cos(t)*r,z:z+Math.sin(t)*r})}for(let i=0;i<n;i++){const A=a[i],B=a[(i+1)%n];out.push(face([{x:A.x,y,z:A.z},{x:B.x,y,z:B.z},{x:B.x,y:y+h,z:B.z},{x:A.x,y:y+h,z:A.z}],shade(color,-i*3),alpha))}out.push(face(a.map(p=>({x:p.x,y:y+h,z:p.z})),shade(color,12),alpha))}
  function exterior(){return styleMode==='western'?{wall:'#eadbc3',roof:'#ad573a',trim:'#c4ad86',metal:'#353b3f',door:'#553b2c',stone:'#bdab8d',gate:'#343a3e'}:{wall:P.wall,roof:P.roof,trim:'#d5c5a8',metal:P.roof,door:'#68472f',stone:'#77736a',gate:'#815d43'}}

  function ground(out){
    const s=exterior();
    out.push(face([{x:-5.2,y:-.18,z:-16},{x:5.2,y:-.18,z:-16},{x:5.2,y:-.18,z:16},{x:-5.2,y:-.18,z:16}],night?'#24322e':'#d9ded5',1,'rgba(34,55,46,.08)'));
    out.push(face([{x:-4,y:-.13,z:11.5},{x:4,y:-.13,z:11.5},{x:4,y:-.13,z:15.5},{x:-4,y:-.13,z:15.5}],night?'#4a5b55':P.path,1));
    out.push(face([{x:-4,y:-.13,z:-15.5},{x:4,y:-.13,z:-15.5},{x:4,y:-.13,z:-6},{x:-4,y:-.13,z:-6}],night?'#365247':P.terrace,1));
    out.push(face([{x:-.75,y:-.1,z:11.5},{x:.75,y:-.1,z:11.5},{x:.75,y:-.1,z:15.5},{x:-.75,y:-.1,z:15.5}],night?'#65756e':'#d8d1c5',1));
    prism(out,2,-10.5,.2,-.1,1.9,P.trunk,7);prism(out,2,-10.5,1.15,1.35,1.55,P.tree,10,.96);box(out,-1,-12.4,2.5,1,-.08,.13,P.water,.95);
    const west=styleMode==='western',height=west?1.25:1.9;
    box(out,-3.28,15.38,1.45,.24,0,height,s.wall,1);box(out,3.28,15.38,1.45,.24,0,height,s.wall,1);box(out,-2.48,15.38,.34,.52,0,west?1.65:2.45,s.trim,1);box(out,2.48,15.38,.34,.52,0,west?1.65:2.45,s.trim,1);
    if(west){box(out,0,15.4,4.8,.07,1.24,.06,s.gate,1);box(out,0,15.4,4.8,.07,.24,.06,s.gate,1)}else box(out,0,15.38,5.25,.48,2.18,.27,s.roof,1);
    for(let x=-2.3;x<=2.3;x+=west?.22:.5)box(out,x,15.4,west?.035:.09,.08,.28,west?.96:1.62,s.gate,1)
  }
  function windows(out,y,h){
    const c=night?'#f1bd67':P.glass,yy=y+h*.54,second=y>3;
    if(second){[-2.15,1.25].forEach(x=>box(out,x,11.51,1.65,.05,yy,1.25,c,.9));[-2,2].forEach(x=>box(out,x,-6.01,1.65,.05,yy,1.2,c,.9));[-2.25,8.8].forEach(z=>{box(out,-4.01,z,.05,1.45,yy,1.15,c,.9);box(out,4.01,z,.05,1.45,yy,1.15,c,.9)});box(out,-1.1,6.49,2.2,.05,yy,1.15,c,.9);box(out,-1.1,1.51,2.2,.05,yy,1.15,c,.9);box(out,2.19,4,.05,1.5,yy,1.1,c,.9)}
    else{box(out,-1.8,11.51,1.85,.05,yy,1.05,c,.9);[-2,2].forEach(x=>box(out,x,-6.01,1.65,.05,yy,1.15,c,.9));[8.8,-2.25].forEach(z=>{box(out,-4.01,z,.05,1.35,yy,1.1,c,.9);box(out,4.01,z,.05,1.35,yy,1.1,c,.9)});box(out,4.01,4,.05,1.1,yy,1.05,c,.9);box(out,-4.03,4,.08,1.55,y+.05,2.35,night?'#72553d':'#6a4b36',.98)}
  }
  function building(out){if(styleMode==='western'){window.drawTuscanHouse(out,{box,face,prism,view,night});return}const solid=view==='all'||view==='explode',a1=solid?1:(view==='f1'?.18:.09),a2=solid?1:(view==='f2'?.18:.09),o2=view==='explode'?2.2:0,o3=view==='explode'?4.5:0,s=exterior();
    box(out,0,9,8,5,0,3.2,s.wall,a1);box(out,0,-2.25,8,7.5,0,3.2,s.wall,a1);box(out,-1.5,4,5,5,0,3.2,s.wall,a1);box(out,2.5,4,3,5,0,3.2,s.wall,a1);if(a1>.5)windows(out,0,3.2);
    box(out,0,11.57,8,.2,0,.34,s.stone,a1);box(out,2.35,11.59,1.55,.12,.05,2.55,s.door,Math.max(.2,a1));
    if(styleMode==='western'){prism(out,1.42,11.74,.17,0,2.9,s.trim,10,Math.max(.2,a1));prism(out,3.28,11.74,.17,0,2.9,s.trim,10,Math.max(.2,a1));box(out,2.35,11.74,2.2,.5,2.78,.3,s.trim,Math.max(.2,a1));box(out,0,11.72,8.25,.42,3.02,.2,s.trim,Math.max(.2,a1))}else{box(out,1.42,11.72,.24,.45,0,3.08,s.roof,Math.max(.2,a1));box(out,3.28,11.72,.24,.45,0,3.08,s.roof,Math.max(.2,a1));box(out,2.35,11.72,2.1,.45,2.83,.25,s.roof,Math.max(.2,a1));[-3.25,-2.9,-2.55].forEach(x=>box(out,x,11.7,.11,.28,.42,2.35,s.gate,Math.max(.2,a1)))}
    box(out,0,11.82,8.7,1.05,2.98,.2,s.roof,Math.max(.2,a1));
    [[0,9,8,5],[0,-2.25,8,7.5],[-1.5,4,5,5],[2.5,4,3,5]].forEach(([x,z,w,d])=>box(out,x,z,w,d,3.16,.18,P.slab,Math.max(.18,a1)));
    if(view!=='f1'){
      box(out,0,9,8,5,3.2+o2,3,s.wall,a2);box(out,0,-2.25,8,7.5,3.2+o2,3,s.wall,a2);box(out,3.1,4,1.8,5,3.2+o2,3,s.wall,a2);if(a2>.5)windows(out,3.2+o2,3);
      [[0,9,8,5],[0,-2.25,8,7.5],[2.5,4,3,5]].forEach(([x,z,w,d])=>box(out,x,z,w,d,6.16+o2,.18,P.slab,Math.max(.18,a2)));
      box(out,-1.5,4,4.82,4.82,3.34+o2,.12,P.terrace,.94);box(out,-3.91,4,.18,5,3.35+o2,1.08,s.metal,.82);
      box(out,1.08,2.6,.16,2.2,3.35+o2,1.05,s.metal,.76);box(out,1.08,5.7,.16,1.6,3.35+o2,1.05,s.metal,.76);box(out,1.55,2.15,.08,.08,3.42+o2,2.05,s.metal,.9);box(out,1.55,5.85,.08,.08,3.42+o2,2.05,s.metal,.9);box(out,1.5,4,.06,3.7,5.42+o2,.06,s.metal,.9);box(out,1.92,4,.06,3.7,5.42+o2,.06,s.metal,.9);
      box(out,-2.7,4.9,.55,1.6,3.46+o2,.38,P.tree,.95);box(out,-.3,3.05,1.7,.5,3.46+o2,.42,'#b99b72',.95);prism(out,-2.7,4.9,.42,3.82+o2,.55,P.tree,8,.94)
    }
    if(view!=='f1'&&view!=='f2'){
      const y=6.25+o2+o3;
      [[0,11.42,8,.3],[0,6.58,8,.3],[-3.92,9,.3,5],[3.92,9,.3,5],[0,1.42,8,.3],[0,-5.92,8,.3],[-3.92,-2.25,.3,7.5],[3.92,-2.25,.3,7.5],[1.08,4,.3,5],[3.92,4,.3,5]].forEach(([x,z,w,d])=>box(out,x,z,w,d,y,1.2,s.roof,.96));box(out,0,9,8.85,5.75,y+1.16,.16,s.roof,.98);box(out,0,-2.25,8.85,8.15,y+1.16,.16,s.roof,.98);
      box(out,-1.8,8.8,2.2,1.5,y,.72,'#8c7358',.98);box(out,2,-2.8,2.4,1.5,y,.68,P.service,.96)
    }
  }
  function roomLayer(out,ls){const key=view==='f2'?'f2':'f1';if(view!=='f1'&&view!=='f2')return;const y=key==='f1'?.12:3.34;rooms[key].forEach(([x,z,w,d,name,c])=>{box(out,x,z,w-.18,d-.18,y,.16,P[c],.86);ls.push({x,y:y+.22,z,text:name,color:P[c]})})}
  function siteTags(ls){if(!['all','roof','explode'].includes(view))return;const lifted=view==='explode';ls.push({x:0,y:2.75,z:15.35,text:'院门 / 大门'},{x:2.35,y:2.75,z:11.72,text:'入户门'},{x:0,y:.15,z:13.5,text:'前空地 4×8m'},{x:-1.5,y:lifted?7.9:4.8,z:4,text:'二楼露天花园 5×5m'},{x:1.65,y:lifted?8.3:5.15,z:4,text:'晾晒走廊 1.2×5m'},{x:0,y:.15,z:-10.75,text:'后空地 9.5×8m'},{x:0,y:lifted?14.2:7.75,z:1.5,text:'主体 17.5×8m'})}
  function label(l){const p=tr(l);ctx.font='600 11px "Microsoft YaHei",sans-serif';const tw=ctx.measureText(l.text).width;ctx.fillStyle='rgba(250,248,243,.9)';ctx.beginPath();ctx.roundRect(p.x-tw/2-7,p.y-11,tw+14,22,7);ctx.fill();ctx.strokeStyle='rgba(40,55,49,.18)';ctx.stroke();ctx.fillStyle='#25322e';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(l.text,p.x,p.y)}
  function scale(){const y=H-(W<850?234:30),x=W>850?W-350:W-116;ctx.globalAlpha=.65;ctx.strokeStyle=night?'#d7e4df':'#33473f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+72,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.moveTo(x+72,y-4);ctx.lineTo(x+72,y+4);ctx.stroke();ctx.font='10px system-ui';ctx.fillStyle=ctx.strokeStyle;ctx.textAlign='center';ctx.fillText('概念比例',x+36,y-7);ctx.globalAlpha=1}
  const depthCanvas=document.createElement('canvas'),gl=depthCanvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  let depthProgram,depthBuffer;
  if(gl){
    const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s};
    depthProgram=gl.createProgram();gl.attachShader(depthProgram,shader(gl.VERTEX_SHADER,'attribute vec3 a; attribute vec4 c; varying vec4 col; void main(){gl_Position=vec4(a,1.0);col=c;}'));gl.attachShader(depthProgram,shader(gl.FRAGMENT_SHADER,'precision mediump float; varying vec4 col; void main(){gl_FragColor=col;}'));gl.linkProgram(depthProgram);depthBuffer=gl.createBuffer();
  }
  function depthDraw(out){
    if(!gl)return false;
    depthCanvas.width=canvas.width;depthCanvas.height=canvas.height;gl.viewport(0,0,depthCanvas.width,depthCanvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(depthProgram);gl.bindBuffer(gl.ARRAY_BUFFER,depthBuffer);
    const a=gl.getAttribLocation(depthProgram,'a'),c=gl.getAttribLocation(depthProgram,'c');gl.enableVertexAttribArray(a);gl.enableVertexAttribArray(c);gl.vertexAttribPointer(a,3,gl.FLOAT,false,28,0);gl.vertexAttribPointer(c,4,gl.FLOAT,false,28,12);
    for(const opaque of [true,false]){
      const data=[];
      for(const f of out){if((f.alpha>=.99)!==opaque)continue;const rgb=f.color.startsWith('#')?[1,3,5].map(i=>parseInt(f.color.slice(i,i+2),16)/255):f.color.match(/[\d.]+/g).slice(0,3).map(n=>Number(n)/255);
        const emit=q=>data.push(q.x/W*2-1,1-q.y/H*2,-q.d/80,...rgb,f.alpha);
        for(let i=1;i<f.q.length-1;i++){emit(f.q[0]);emit(f.q[i]);emit(f.q[i+1])}
      }
      gl.depthMask(opaque);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,data.length/7);
    }
    gl.depthMask(true);ctx.drawImage(depthCanvas,0,0,W,H);return true;
  }
  function render(){ctx.clearRect(0,0,W,H);if(night){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0d1918');g.addColorStop(1,'#22332f');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}const out=[],ls=[];ground(out);building(out);roomLayer(out,ls);siteTags(ls);out.sort((a,b)=>a.d-b.d);ctx.lineJoin='round';if(!depthDraw(out))out.forEach(f=>{ctx.globalAlpha=f.alpha;ctx.beginPath();ctx.moveTo(f.q[0].x,f.q[0].y);for(let i=1;i<f.q.length;i++)ctx.lineTo(f.q[i].x,f.q[i].y);ctx.closePath();ctx.fillStyle=f.color;ctx.fill()});ctx.globalAlpha=1;if(labelsOn||view==='f1'||view==='f2')ls.sort((a,b)=>tr(a).d-tr(b).d).forEach(label);scale()}
  function panel(){const c=info[view],title=view==='all'?(styleMode==='western'?'托斯卡纳 · 外观方案':'现代东方 · 旧版对比'):c.title;document.getElementById('viewTitle').textContent=title;document.getElementById('roomList').innerHTML=c.rooms.map(([a,b,k])=>`<div class="room" style="--room-color:${P[k]||P.roof}"><span class="dot"></span><span>${a}<small>${b}</small></span></div>`).join('');document.getElementById('logicList').innerHTML=c.logic.map(x=>`<li>${x}</li>`).join('');document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view))}
  function toast(s){const t=document.getElementById('toast');t.textContent=s;t.classList.add('show');clearTimeout(t._id);t._id=setTimeout(()=>t.classList.remove('show'),1400)}
  const fingers=new Map();let pinch=0;
  canvas.addEventListener('pointerdown',e=>{fingers.set(e.pointerId,[e.clientX,e.clientY]);drag=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');if(fingers.size===2){const a=[...fingers.values()];pinch=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}});
  canvas.addEventListener('pointermove',e=>{if(!drag||!fingers.has(e.pointerId))return;fingers.set(e.pointerId,[e.clientX,e.clientY]);if(fingers.size===2){const a=[...fingers.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pinch)zoom=Math.max(.55,Math.min(1.8,zoom*d/pinch));pinch=d}else{az+=(e.clientX-px)*.008;el=Math.max(.18,Math.min(1.2,el+(e.clientY-py)*.006));px=e.clientX;py=e.clientY}render()});
  const end=e=>{fingers.delete(e.pointerId);pinch=0;if(!fingers.size){drag=false;canvas.classList.remove('dragging')}else{const a=[...fingers.values()][0];px=a[0];py=a[1]}};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.55,Math.min(1.8,zoom*Math.exp(-e.deltaY*.001)));render()},{passive:false});
  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;if(el===0){el=.55;az=-.55;zoom=1.2}panel();render()}));
  document.getElementById('resetBtn').onclick=()=>{az=-.55;el=.46;zoom=1.2;render();toast('总览视角')};
  document.getElementById('frontBtn').onclick=()=>{view='all';az=0;el=0;zoom=W>850?1.7:2;panel();render();toast('正立面视角 · 拖动可继续旋转')};
  document.getElementById('labelBtn').onclick=()=>{labelsOn=!labelsOn;render();toast(labelsOn?'房间标签已显示':'房间标签已隐藏')};
  document.getElementById('styleBtn').onclick=e=>{styleMode=styleMode==='western'?'oriental':'western';e.currentTarget.textContent=styleMode==='western'?'切换东方':'切换托斯卡纳';panel();render();toast(styleMode==='western'?'托斯卡纳院宅':'现代东方院宅')};
  document.getElementById('themeBtn').onclick=e=>{night=!night;app.classList.toggle('night',night);e.currentTarget.textContent=night?'日景':'夜景';render()};
  document.getElementById('fullBtn').onclick=()=>{if(!document.fullscreenElement)app.requestFullscreen?.();else document.exitFullscreen?.()};
  addEventListener('keydown',e=>{if(e.key==='ArrowLeft')az-=.08;if(e.key==='ArrowRight')az+=.08;if(e.key==='ArrowUp')el=Math.min(1.2,el+.06);if(e.key==='ArrowDown')el=Math.max(0,el-.06);render()});addEventListener('resize',resize);panel();resize();
})();
