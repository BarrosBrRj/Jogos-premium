import React,{useEffect,useMemo,useState} from "react";

const GAMES=[
 {id:"hunt",name:"CAÇADA URBANA",tag:"JOGO JÁ LIBERADO",desc:"Fuja pela cidade, despiste os investigadores e sobreviva à caçada.",cover:"/covers/cacada-urbana.svg",tone:"blue",locked:false},
 {id:"mystery",name:"MISTÉRIO ZERO",tag:"PREMIUM",desc:"Investigue cenas, confronte suspeitos e descubra quem está por trás do caso.",cover:"/covers/misterio-zero.svg",tone:"amber",locked:true},
 {id:"mind",name:"MENTE SECRETA",tag:"PREMIUM",desc:"Desafie sua memória, raciocínio e conhecimentos em rodadas eletrizantes.",cover:"/covers/mente-secreta.svg",tone:"purple",locked:true}
];
const SIZE=7, START={x:3,y:3}, INITIAL=[{x:0,y:0},{x:6,y:0},{x:0,y:6}];
const key=(p)=>p.x+"-"+p.y;
function distance(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)}
function App(){
 const [page,setPage]=useState("home"),[turn,setTurn]=useState(0),[player,setPlayer]=useState(START),[guards,setGuards]=useState(INITIAL),[status,setStatus]=useState("playing"),[moves,setMoves]=useState(12),[showPremium,setShowPremium]=useState(false),[name,setName]=useState(()=>localStorage.getItem("jp-name")||"Jogador"),[wins,setWins]=useState(()=>Number(localStorage.getItem("jp-wins")||0)),[losses,setLosses]=useState(()=>Number(localStorage.getItem("jp-losses")||0));
 useEffect(()=>{localStorage.setItem("jp-name",name)},[name]);
 useEffect(()=>{localStorage.setItem("jp-wins",String(wins));localStorage.setItem("jp-losses",String(losses))},[wins,losses]);
 const reset=()=>{setPlayer(START);setGuards(INITIAL);setMoves(12);setTurn(0);setStatus("playing")};
 const move=(x,y)=>{
  if(status!=="playing"||distance(player,{x,y})!==1)return;
  const next={x,y};
  if(guards.some(g=>key(g)===key(next))){setPlayer(next);setStatus("caught");setLosses(v=>v+1);return}
  const nextGuards=[],occupied=new Set();let captured=false;
  for(let i=0;i<guards.length;i++){
   const g=guards[i];
   const opts=[{x:g.x+1,y:g.y},{x:g.x-1,y:g.y},{x:g.x,y:g.y+1},{x:g.x,y:g.y-1}]
    .filter(p=>p.x>=0&&p.x<SIZE&&p.y>=0&&p.y<SIZE&&!occupied.has(key(p)));
   opts.sort((a,b)=>distance(a,next)-distance(b,next));
   const chosen=opts[0]||g;
   nextGuards.push(chosen);
   if(key(chosen)===key(next)){captured=true;for(const rest of guards.slice(i+1))nextGuards.push(rest);break}
   occupied.add(key(chosen));
  }
  setPlayer(next);setGuards(nextGuards);setMoves(m=>m-1);setTurn(t=>t+1);
  if(captured){setStatus("caught");setLosses(v=>v+1)}
  else if(moves-1<=0){setStatus("escaped");setWins(v=>v+1)}
 };
 const cells=useMemo(()=>Array.from({length:SIZE*SIZE},(_,i)=>({x:i%SIZE,y:Math.floor(i/SIZE)})),[]);
 return <div className="app-shell">
  <header className="topbar"><button className="brand" onClick={()=>setPage("home")}><span className="brand-mark">✦</span><span>JOGOS <b>PREMIUM</b></span></button><div className="profile"><span className="avatar">♟</span><input aria-label="Seu nome" value={name} onChange={e=>setName(e.target.value)} maxLength="18"/></div></header>
  {page==="home"?<main className="home">
   <section className="hero"><div className="eyebrow">UMA COLEÇÃO. TRÊS DESAFIOS.</div><h1>Entre no jogo.<br/><em>Vire a lenda.</em></h1><p>Estratégia, investigação e inteligência em uma coleção feita para jogar no celular.</p><div className="hero-pills"><span>♟ Estratégia</span><span>⌕ Mistério</span><span>✦ Desafios</span></div></section>
   <div className="section-heading"><div><small>ESCOLHA SUA EXPERIÊNCIA</small><h2>Todos os jogos</h2></div><span className="count">01 / 03 LIBERADO</span></div>
   <section className="games">{GAMES.map(g=><article className={"game-card "+g.tone} key={g.id}><div className="game-art"><img className="game-cover" src={g.cover} alt={"Capa ilustrada de "+g.name}/><span className="art-stamp">{g.locked?"ACESSO PREMIUM":"JOGO LIBERADO"}</span></div><div className="game-copy"><div className="game-kicker">{g.tag}</div><h3>{g.name}</h3><p>{g.desc}</p><button className={g.locked?"locked-btn":"play-btn"} onClick={()=>g.locked?setShowPremium(true):setPage("hunt")}>{g.locked?"Desbloquear jogo ↗":"Jogar agora →"}</button></div></article>)}</section>
   <section className="premium-strip"><div><span className="crown">♛</span><div><small>ACESSO COMPLETO</small><h3>Uma compra. A coleção inteira.</h3><p>Desbloqueie os três jogos na mesma conta.</p></div></div><button onClick={()=>setShowPremium(true)}>Conhecer Premium</button></section>
   <footer>JOGOS PREMIUM <span>•</span> Diversão original para jogar em qualquer lugar</footer>
  </main>:<main className="game-screen"><button className="back" onClick={()=>setPage("home")}>← Voltar à coleção</button><div className="game-head"><div><small>CAÇADA URBANA · MODO SOLO</small><h1>Fuja da caçada.</h1><p>Você é o fugitivo. Os investigadores estão se aproximando.</p></div><div className="turn-box"><b>{moves}</b><span>movimentos restantes</span></div></div>
   <div className="game-layout"><section className="board-wrap"><div className="board-top"><span>MAPA DA CIDADE</span><span>RODADA {turn+1}</span></div><div className="board">{cells.map(c=>{const p=key(c),isYou=p===key(player),isGuard=guards.some(g=>key(g)===p);return <button key={p} className={"cell "+(isYou?"you":isGuard?"guard":"")+(distance(player,c)===1?" reachable":"")} onClick={()=>move(c.x,c.y)} aria-label={isYou?"Sua posição":isGuard?"Investigador":"Mover para "+(c.x+1)+","+(c.y+1)}>{isYou?"●":isGuard?"♟":((c.x+c.y)%3===0?"·":"")}</button>})}</div><div className="legend"><span><i className="dot you-dot"></i> Você</span><span><i className="dot guard-dot"></i> Investigadores</span><span><i className="dot move-dot"></i> Próximo movimento</span></div></section>
   <aside className="game-side"><div className="objective"><small>SEU OBJETIVO</small><h3>Não seja capturado</h3><p>Sobreviva aos 12 movimentos. Toque em uma casa vizinha para se deslocar. Os investigadores avançam um por vez, tentando fechar seu caminho. Eles não podem ocupar a mesma casa. Sobreviva às 12 jogadas para vencer.</p></div><div className="side-stat"><span>Movimentos</span><b>{12-moves}/12</b></div><div className="side-stat"><span>Investigadores</span><b>03</b></div><div className="side-stat"><span>Vitórias</span><b>{wins}</b></div><div className="side-stat"><span>Capturas</span><b>{losses}</b></div>{status!=="playing"&&<div className={"result "+status}><h3>{status==="escaped"?"Você escapou!":"Você foi capturado!"}</h3><p>{status==="escaped"?"A cidade ficou para trás. Vitória!":"Os investigadores fecharam o cerco. Tente outra rota."}</p><button onClick={reset}>Jogar novamente</button></div>}<button className="reset-btn" onClick={reset}>↻ Reiniciar partida</button></aside></div>
  </main>}
  {showPremium&&<div className="modal-backdrop" onClick={()=>setShowPremium(false)}><section className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowPremium(false)}>×</button><span className="crown big">♛</span><small>JOGOS PREMIUM</small><h2>Desbloqueie a coleção completa</h2><p>Tenha acesso ao Mistério Zero, Mente Secreta e a todos os novos jogos da coleção.</p><div className="modal-list"><span>✓ Acesso permanente na sua conta</span><span>✓ Novos desafios e atualizações</span><span>✓ Uma única compra</span></div><button className="modal-cta" onClick={()=>setShowPremium(false)}>Pagamento será ativado na próxima etapa</button><small className="note">Nenhuma cobrança é feita nesta versão de desenvolvimento.</small></section></div>}
 </div>
}
export default App;
