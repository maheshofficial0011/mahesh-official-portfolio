import { useEffect, useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, BookOpen, CheckCircle2, Code2, Copy, ExternalLink, FileText, Github, GraduationCap, Layers3, Map, Sparkles, Trophy, Target, Youtube, Instagram, Facebook, MessageCircle, Linkedin, Gamepad2, RotateCcw, Circle, X as XIcon } from 'lucide-react'
import './portfolio-upgrades.css'

const projects = [
  { name: 'SurakshaDrishti AI', category: 'AI / ML', status: 'In progress', stack: 'Python · YOLOv8 · OpenCV · FastAPI', url: 'https://github.com/maheshofficial0011/SurakshaDrishti-AI' },
  { name: 'SikshaSetu', category: 'Full stack', status: 'In progress', stack: 'React · TypeScript · FastAPI · NLLB-200', url: 'https://github.com/maheshofficial0011/Siksha_Setu' },
  { name: 'SkillSaathi', category: 'Full stack', status: 'Building', stack: 'React · TypeScript · Supabase', url: 'https://github.com/maheshofficial0011/skillsaathi-campus-peer-learning' },
  { name: 'DSA-JAVA', category: 'Development', status: 'Learning', stack: 'Java · DSA · Problem solving', url: 'https://github.com/maheshofficial0011/DSA-JAVA' },
  { name: 'WasteVoice AI', category: 'AI / ML', status: 'In progress', stack: 'AI · Community tech · Prototyping', url: 'https://github.com/maheshofficial0011/wastevoice-ai' },
  { name: 'Helpdesk 360', category: 'Full stack', status: 'Building', stack: 'Web development · UI/UX', url: 'https://github.com/maheshofficial0011/helpdesk-360' },
]
const tracks = [
  { id: 'dsa', title: 'Data Structures & Algorithms', detail: 'Practice arrays, linked lists, trees, and problem-solving patterns.', tag: 'Java DSA' },
  { id: 'java', title: 'Java Fundamentals', detail: 'Strengthen syntax, object-oriented programming, and clean code.', tag: 'Java' },
  { id: 'aiml', title: 'AI & Machine Learning', detail: 'Explore model basics, computer vision, and responsible AI workflows.', tag: 'AI / ML' },
  { id: 'cyber', title: 'Cybersecurity Fundamentals', detail: 'Learn networking, secure coding, and defensive security principles.', tag: 'Security' },
  { id: 'web', title: 'Web Development', detail: 'Build accessible interfaces and reliable full-stack applications.', tag: 'Web' },
]
const memorySymbols = ['✦','●','▲','◆','☾','✿','✿','☾','◆','▲','●','✦']
const articles = [
  { id: 'learning', category: 'Reflection', title: 'Learning in public without pretending to know everything', summary: 'Show work in progress honestly.', body: 'Keep project status clear, explain what is working, and label prototypes as prototypes. A useful portfolio can show decisions, questions, and next steps—not only finished outcomes.' },
  { id: 'edges', category: 'Problem solving', title: 'Why edge cases make better programmers', summary: 'Small tests reveal assumptions hidden in a solution.', body: 'Start with normal input, then consider empty input, one item, duplicates, boundaries, and invalid positions. Write down what you expect before running the code; the difference is where learning happens.' },
  { id: 'ai', category: 'AI / ML', title: 'Building AI around a real problem', summary: 'Begin with the user and workflow, not just the model.', body: 'Describe who needs help, what task is difficult, and how success would be measured. Then choose the simplest tool that can test the idea, and be explicit about its limitations.' },
]
function AtSignIcon() { return <span aria-hidden="true" style={{fontSize:20,fontWeight:800,lineHeight:1}}>@</span> }
function safeRead(key: string): string[] {
  try {
    const value = window.localStorage.getItem(key)
    const parsed = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch { return [] }
}

export default function PortfolioUpgrades() {
  const [completed, setCompleted] = useState<string[]>(() => safeRead('mahesh-roadmap-progress'))
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)
  const [recruiterMode, setRecruiterMode] = useState(false)
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const [copyState, setCopyState] = useState('Copy portfolio link')
  const [sortBy, setSortBy] = useState('featured')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [motionStyle, setMotionStyle] = useState(() => { try { const saved = window.localStorage.getItem('mahesh-motion-style'); return saved === 'subtle' || saved === 'minimal' ? saved : 'dynamic' } catch { return 'dynamic' } })
  const [highContrast, setHighContrast] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [activeGame, setActiveGame] = useState('memory')
  const [memoryCards, setMemoryCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [guess, setGuess] = useState('')
  const [guessMessage, setGuessMessage] = useState('Pick a number from 1 to 20.')
  const [secretNumber, setSecretNumber] = useState(() => Math.floor(Math.random() * 20) + 1)
  const [ticCells, setTicCells] = useState<string[]>(Array(9).fill(''))
  const [ticTurn, setTicTurn] = useState('X')
  const [ticMessage, setTicMessage] = useState('Your turn: X')
  const [reactionCount, setReactionCount] = useState(0)

  useEffect(() => { try { window.localStorage.setItem('mahesh-roadmap-progress', JSON.stringify(completed)) } catch { /* Session still works without storage. */ } }, [completed])
  useEffect(() => { try { window.localStorage.setItem('mahesh-motion-style', motionStyle) } catch { /* Animation preference remains available for this session. */ } }, [motionStyle])
  useEffect(() => {
    try {
      const key = 'mahesh-portfolio-local-visits'
      const next = Number(window.localStorage.getItem(key) || 0) + 1
      window.localStorage.setItem(key, String(next))
      setVisitorCount(next)
    } catch { setVisitorCount(null) }
  }, [])

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter((project, index) => (!featuredOnly || index < 3) && (category === 'All' || project.category === category) && (project.name + ' ' + project.category + ' ' + project.stack + ' ' + project.status).toLowerCase().includes(query.trim().toLowerCase()))
    if (sortBy === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'category') return [...filtered].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    return filtered
  }, [category, featuredOnly, query, sortBy])

  const downloadResume = () => {
    const lines = [
      'MAHESH (MANAV) RANA',
      'Engineering student · AI/ML · Full-stack development · Java DSA',
      '',
      'PROFILE',
      'Engineering student who learns by building practical software projects and strengthening programming fundamentals.',
      '',
      'TECHNICAL AREAS',
      'Python, Java, React, TypeScript, Vite, FastAPI, OpenCV, YOLOv8, SQLite, Supabase, WebSockets',
      '',
      'SELECTED PROJECTS',
      ...projects.map(project => project.name + ' — ' + project.category + ' (' + project.status + ')\n' + project.stack + '\n' + project.url),
      '',
      'LINKS',
      'GitHub: https://github.com/maheshofficial0011',
      'LinkedIn search: https://www.linkedin.com/search/results/people/?keywords=Mahesh%20%28Manav%29%20Rana',
      'Email: maheshofficial00110@gmail.com',
      '',
      'Review this starter resume before sharing. Unverified dates, qualifications, grades, and experience are intentionally omitted.'
    ].join('\n')
    const url = URL.createObjectURL(new Blob([lines], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'Mahesh-Manav-Rana-Resume.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }
  const handleMemoryCard = (index: number) => {
    if (memoryCards.length >= 2 || memoryCards.includes(index) || matchedCards.includes(index)) return
    const next = [...memoryCards, index]
    setMemoryCards(next)
    if (next.length === 2) {
      if (memorySymbols[next[0]] === memorySymbols[next[1]]) {
        setMatchedCards(current => [...current, next[0], next[1]])
        window.setTimeout(() => setMemoryCards([]), 450)
      } else {
        window.setTimeout(() => setMemoryCards([]), 750)
      }
    }
  }

  const sharePortfolio = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopyState('Portfolio link copied!') }
    catch { setCopyState('Copy unavailable — use your browser address bar') }
    window.setTimeout(() => setCopyState('Copy portfolio link'), 2200)
  }

  return <div className={'portfolio-upgrades motion-' + motionStyle + (highContrast ? ' high-contrast' : '')}>
    <section className="upgrade-section upgrade-dashboard section-pad" id="dashboard" aria-labelledby="dashboard-title">
      <div className="section-heading"><div><span className="section-kicker">07 / DEVELOPER OVERVIEW</span><h2 id="dashboard-title">A workbench for <span className="serif-italic">progress.</span></h2></div><p>A compact snapshot of projects, learning, and public work.</p></div>
      <div className="upgrade-stat-grid">
        <article className="upgrade-stat"><span><Layers3 size={18}/></span><strong>{projects.length.toString().padStart(2, '0')}</strong><small>Projects listed</small></article>
        <article className="upgrade-stat"><span><Map size={18}/></span><strong>{tracks.length.toString().padStart(2, '0')}</strong><small>Learning tracks</small></article>
        <article className="upgrade-stat"><span><CheckCircle2 size={18}/></span><strong>{completed.length.toString().padStart(2, '0')}/{tracks.length.toString().padStart(2, '0')}</strong><small>Tracks marked done</small></article>
        <article className="upgrade-stat"><span><Github size={18}/></span><strong>Live</strong><small><a href="https://github.com/maheshofficial0011" target="_blank" rel="noreferrer">Public GitHub profile <ExternalLink size={11}/></a></small></article>
      </div>
      <div className="upgrade-dashboard-bottom"><div><span className="upgrade-eyebrow">CURRENT FOCUS</span><h3>Build, test, reflect, repeat.</h3><p>Project states are described honestly; learning progress is stored in this browser only.</p></div><div className="upgrade-dashboard-actions"><button className="btn btn-quiet" type="button" onClick={() => setRecruiterMode(value => !value)}><FileText size={15}/>{recruiterMode ? 'Exit recruiter mode' : 'Recruiter mode'}</button><button className="btn btn-primary" type="button" onClick={downloadResume}><ArrowDownToLine size={15}/> Download resume draft</button></div></div>
      {recruiterMode && <div className="recruiter-panel" role="region" aria-label="Recruiter-friendly profile"><div><span className="upgrade-eyebrow">PROFILE AT A GLANCE</span><h3>Mahesh (Manav) Rana</h3><p>Engineering student interested in AI/ML, full-stack development, and data structures with Java.</p></div><div><strong>Focus areas</strong><p>Computer vision · Web applications · Problem solving · AI automation</p><strong>Contact</strong><p><a href="mailto:maheshofficial00110@gmail.com">maheshofficial00110@gmail.com</a></p></div><div className="recruiter-links"><a className="btn btn-quiet" href="https://github.com/maheshofficial0011" target="_blank" rel="noreferrer"><Github size={15}/> GitHub <ArrowUpRight size={13}/></a><a className="btn btn-quiet" href="https://www.linkedin.com/search/results/people/?keywords=Mahesh%20%28Manav%29%20Rana" target="_blank" rel="noreferrer">LinkedIn search <ArrowUpRight size={13}/></a></div></div>}
    </section>

    <section className="upgrade-section section-pad" id="project-explorer" aria-labelledby="project-explorer-title">
      <div className="section-heading"><div><span className="section-kicker">08 / PROJECT EXPLORER</span><h2 id="project-explorer-title">Find a <span className="serif-italic">project.</span></h2></div><p>Search, filter, and sort projects. Open a repository to inspect its source.</p></div>
      <div className="upgrade-project-controls"><label><span className="sr-only">Search projects</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, stack, or status…"/></label><label><span className="sr-only">Filter project category</span><select value={category} onChange={event => setCategory(event.target.value)}><option>All</option><option>AI / ML</option><option>Full stack</option><option>Development</option></select></label><label><span className="sr-only">Sort projects</span><select value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="featured">Featured order</option><option value="name">Name A–Z</option><option value="category">Category</option></select></label></div>\n      <label className="featured-only-control"><input type="checkbox" checked={featuredOnly} onChange={event => setFeaturedOnly(event.target.checked)}/> Show featured projects only <span>First three portfolio projects</span></label>
      <div className="upgrade-project-grid">{visibleProjects.map((project, index) => <article className="upgrade-project-card" key={project.name}><div className="upgrade-project-top"><span>{String(index + 1).padStart(2, '0')}</span><span>{project.category}</span></div><h3>{project.name}</h3><p>{project.stack}</p><div className="upgrade-project-bottom"><span>{project.status}</span><a href={project.url} target="_blank" rel="noreferrer" aria-label={'Open ' + project.name + ' repository'}>Repository <ArrowUpRight size={14}/></a></div></article>)}</div>
      {visibleProjects.length === 0 && <div className="upgrade-empty">No matching projects. Try another search or category.</div>}
    </section>

    <section className="upgrade-section section-pad" id="learning-roadmap" aria-labelledby="roadmap-title">
      <div className="section-heading"><div><span className="section-kicker">09 / LEARNING ROADMAP</span><h2 id="roadmap-title">Keep moving <span className="serif-italic">forward.</span></h2></div><p>Mark a track complete when you finish your current learning goal.</p></div>
      <div className="roadmap-progress"><div><strong>{completed.length} of {tracks.length}</strong><span>tracks marked complete</span></div><div className="roadmap-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={tracks.length} aria-valuenow={completed.length} aria-label="Learning track completion"><span style={{ width: (completed.length / tracks.length * 100) + '%' }}/></div><button type="button" className="roadmap-reset" onClick={() => setCompleted([])}>Reset progress</button></div>
      <div className="roadmap-grid">{tracks.map((track, index) => <label className={'roadmap-card' + (completed.includes(track.id) ? ' is-complete' : '')} key={track.id}><input type="checkbox" checked={completed.includes(track.id)} onChange={event => setCompleted(current => event.target.checked ? [...current, track.id] : current.filter(id => id !== track.id))}/><span className="roadmap-number">0{index + 1}</span><span className="roadmap-card-content"><strong>{track.title}</strong><small>{track.detail}</small><em>{track.tag}</em></span><CheckCircle2 className="roadmap-check" size={18}/></label>)}</div>
      <p className="upgrade-footnote">Progress is saved in this browser only. It is not shared across devices or presented as a verified certification.</p>
    </section>

    <section className="upgrade-section section-pad" id="project-timeline" aria-labelledby="timeline-title">
      <div className="section-heading"><div><span className="section-kicker">10 / PROJECT TIMELINE</span><h2 id="timeline-title">The work behind the <span className="serif-italic">work.</span></h2></div><p>A simple project-led timeline, without invented dates or credentials.</p></div>
      <div className="upgrade-timeline">
        <article><span className="upgrade-timeline-marker">01</span><div><span className="upgrade-eyebrow">FOUNDATIONS</span><h3>Strengthen Java and DSA</h3><p>Practice core data structures, trace solutions, and learn to reason through edge cases.</p><a href="https://github.com/maheshofficial0011/DSA-JAVA" target="_blank" rel="noreferrer">View DSA-JAVA <ArrowUpRight size={13}/></a></div></article>
        <article><span className="upgrade-timeline-marker">02</span><div><span className="upgrade-eyebrow">BUILDING</span><h3>Explore full-stack products</h3><p>Work on student learning and support tools with React, TypeScript, backend APIs, and data.</p><a href="https://github.com/maheshofficial0011/skillsaathi-campus-peer-learning" target="_blank" rel="noreferrer">View SkillSaathi <ArrowUpRight size={13}/></a></div></article>
        <article><span className="upgrade-timeline-marker">03</span><div><span className="upgrade-eyebrow">EXPERIMENTING</span><h3>Apply AI to practical problems</h3><p>Explore computer vision and community-focused ideas while keeping prototype limitations visible.</p><a href="https://github.com/maheshofficial0011/SurakshaDrishti-AI" target="_blank" rel="noreferrer">View SurakshaDrishti AI <ArrowUpRight size={13}/></a></div></article>
      </div>
      <p className="upgrade-footnote">This timeline describes themes in the portfolio, not a dated employment or education history.</p>
    </section>

    <section className="upgrade-section section-pad" id="tech-notes" aria-labelledby="notes-title">
      <div className="section-heading"><div><span className="section-kicker">10 / TECH BLOG & NOTES</span><h2 id="notes-title">Notes from the <span className="serif-italic">workbench.</span></h2></div><p>Short expandable notes on learning and building.</p></div>
      <div className="upgrade-article-grid">{articles.map(article => <article className="upgrade-article" key={article.id}><div className="upgrade-article-top"><span><BookOpen size={15}/>{article.category}</span><span>NOTE / {article.id.toUpperCase()}</span></div><h3>{article.title}</h3><p>{article.summary}</p>{expandedArticle === article.id && <div className="upgrade-article-body">{article.body}</div>}<button type="button" onClick={() => setExpandedArticle(current => current === article.id ? null : article.id)}>{expandedArticle === article.id ? 'Close note' : 'Read note'} <ArrowUpRight size={14}/></button></article>)}</div>
      <p className="upgrade-footnote">These are starter notes. Add new articles in the articles list inside the PortfolioUpgrades component.</p>
    </section>

    <section className="upgrade-section section-pad" id="game-arcade" aria-labelledby="arcade-title">
      <div className="section-heading"><div><span className="section-kicker">11 / THE ARCADE</span><h2 id="arcade-title">Take a break. <span className="serif-italic">Play.</span></h2></div><p>Three quick games you can play right here. Scores stay in this page session.</p></div>
      <div className="arcade-tabs" role="group" aria-label="Choose a game"><button className={activeGame==='memory'?'active':''} onClick={()=>setActiveGame('memory')} type="button"><Sparkles size={15}/> Memory Match</button><button className={activeGame==='guess'?'active':''} onClick={()=>setActiveGame('guess')} type="button"><Target size={15}/> Number Guess</button><button className={activeGame==='tic'?'active':''} onClick={()=>setActiveGame('tic')} type="button"><Gamepad2 size={15}/> Tic-Tac-Toe</button><button className={activeGame==='reaction'?'active':''} onClick={()=>setActiveGame('reaction')} type="button"><RotateCcw size={15}/> Reaction Score</button></div>
      {activeGame==='memory' && <div className="arcade-game"><div className="arcade-game-heading"><div><span className="upgrade-eyebrow">MEMORY MATCH</span><h3>Find the pairs</h3><p>Match the same symbols. Flip two cards at a time.</p></div><span className="arcade-score">{matchedCards.length/2} / 6 pairs</span></div><div className="memory-grid">{memorySymbols.map((symbol,index)=><button type="button" key={index} className={'memory-card'+(memoryCards.includes(index)||matchedCards.includes(index)?' revealed':'')+(matchedCards.includes(index)?' matched':'')} onClick={()=>handleMemoryCard(index)}>{memoryCards.includes(index)||matchedCards.includes(index)?symbol:'?'}</button>)}</div><button type="button" className="btn btn-quiet" onClick={()=>{setMemoryCards([]);setMatchedCards([])}}><RotateCcw size={14}/> Restart memory game</button></div>}
      {activeGame==='guess' && <div className="arcade-game"><span className="upgrade-eyebrow">NUMBER GUESS</span><h3>Can you find the number?</h3><p>Guess a whole number from 1 to 20.</p><form className="guess-form" onSubmit={event=>{event.preventDefault();const n=Number(guess);if(!Number.isInteger(n)||n<1||n>20){setGuessMessage('Enter a whole number from 1 to 20.');return}setGuessMessage(n===secretNumber?'Correct! You got it. Start a new round to play again.':n<secretNumber?'Too low — try a higher number.':'Too high — try a lower number.')}}><label className="sr-only" htmlFor="arcade-guess">Your guess</label><input id="arcade-guess" type="number" min="1" max="20" value={guess} onChange={event=>setGuess(event.target.value)} placeholder="1–20"/><button className="btn btn-primary" type="submit">Check guess</button></form><p className="guess-message" aria-live="polite">{guessMessage}</p><button type="button" className="btn btn-quiet" onClick={()=>{setSecretNumber(Math.floor(Math.random()*20)+1);setGuess('');setGuessMessage('New number selected. Guess from 1 to 20.')}}><RotateCcw size={14}/> New number</button></div>}
      {activeGame==='tic' && <div className="arcade-game"><div className="arcade-game-heading"><div><span className="upgrade-eyebrow">TIC-TAC-TOE</span><h3>Classic 3 × 3</h3><p>Two-player mode on the same device.</p></div><span className="arcade-score">{ticMessage}</span></div><div className="tic-grid">{ticCells.map((cell,index)=><button type="button" key={index} className="tic-cell" aria-label={'Cell '+(index+1)+(cell?', '+cell:' empty')} disabled={!!cell||ticMessage.includes('wins')||ticMessage.includes('draw')} onClick={()=>{const next=[...ticCells];next[index]=ticTurn;setTicCells(next);const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];if(wins.some(line=>line.every(i=>next[i]===ticTurn)))setTicMessage(ticTurn+' wins!');else if(next.every(Boolean))setTicMessage('It is a draw.');else{setTicTurn(ticTurn==='X'?'O':'X');setTicMessage('Your turn: '+(ticTurn==='X'?'O':'X'))}}}>{cell==='X'?<XIcon size={24}/>:cell==='O'?<Circle size={22}/>:''}</button>)}</div><button type="button" className="btn btn-quiet" onClick={()=>{setTicCells(Array(9).fill(''));setTicTurn('X');setTicMessage('Your turn: X')}}><RotateCcw size={14}/> Restart match</button></div>}
      {activeGame==='reaction' && <div className="arcade-game"><span className="upgrade-eyebrow">REACTION SCORE</span><h3>Tap the target</h3><p>Click the target as many times as you can. Score: <strong>{reactionCount}</strong></p><button type="button" className="reaction-arcade-target" onClick={()=>setReactionCount(score=>score+1)}><Target size={27}/> CLICK TO SCORE</button><button type="button" className="btn btn-quiet" onClick={()=>setReactionCount(0)}><RotateCcw size={14}/> Reset score</button></div>}
    </section>

    <section className="upgrade-section section-pad" id="social-hub" aria-labelledby="social-hub-title">
      <div className="section-heading"><div><span className="section-kicker">12 / SOCIAL ECOSYSTEM</span><h2 id="social-hub-title">Find me across the <span className="serif-italic">internet.</span></h2></div><p>A single place for social channels, direct contact, project updates, and community.</p></div>
      <div className="social-hub-grid">
        <a className="social-hub-card" href="https://www.youtube.com/" target="_blank" rel="noreferrer"><span className="social-hub-icon youtube"><Youtube size={21}/></span><span><strong>YouTube</strong><small>Videos and project demos</small></span><ArrowUpRight size={15}/></a>
        <a className="social-hub-card" href="https://www.facebook.com/" target="_blank" rel="noreferrer"><span className="social-hub-icon facebook"><Facebook size={21}/></span><span><strong>Facebook</strong><small>Community and updates</small></span><ArrowUpRight size={15}/></a>
        <a className="social-hub-card" href="https://x.com/" target="_blank" rel="noreferrer"><span className="social-hub-icon x-social"><XIcon size={20}/></span><span><strong>X / Twitter</strong><small>Short updates and ideas</small></span><ArrowUpRight size={15}/></a>
        <a className="social-hub-card" href="https://www.instagram.com/" target="_blank" rel="noreferrer"><span className="social-hub-icon instagram"><Instagram size={21}/></span><span><strong>Instagram</strong><small>Visual stories and reels</small></span><ArrowUpRight size={15}/></a>
        <a className="social-hub-card" href="https://www.threads.net/" target="_blank" rel="noreferrer"><span className="social-hub-icon threads"><AtSignIcon/></span><span><strong>Threads</strong><small>Conversations and thoughts</small></span><ArrowUpRight size={15}/></a>
        <a className="social-hub-card" href="https://wa.me/9779806434625" target="_blank" rel="noreferrer"><span className="social-hub-icon whatsapp"><MessageCircle size={21}/></span><span><strong>WhatsApp</strong><small>Message directly</small></span><ArrowUpRight size={15}/></a>
        <a className="social-hub-card" href="https://www.linkedin.com/search/results/people/?keywords=Mahesh%20%28Manav%29%20Rana" target="_blank" rel="noreferrer"><span className="social-hub-icon linkedin"><Linkedin size={21}/></span><span><strong>LinkedIn</strong><small>Find Mahesh (Manav) Rana</small></span><ArrowUpRight size={15}/></a>
        <a className="social-hub-card" href="https://github.com/maheshofficial0011" target="_blank" rel="noreferrer"><span className="social-hub-icon github"><Github size={21}/></span><span><strong>GitHub</strong><small>Code and open-source projects</small></span><ArrowUpRight size={15}/></a>
      </div>
      <p className="upgrade-footnote">YouTube, Facebook, X, Instagram, and Threads currently open their official platforms. Add your confirmed profile URLs when ready so visitors can reach your exact accounts.</p>
    </section>

    <section className="upgrade-section section-pad" id="milestones" aria-labelledby="milestones-title">
      <div className="section-heading"><div><span className="section-kicker">11 / MILESTONES & SHARING</span><h2 id="milestones-title">Make progress <span className="serif-italic">visible.</span></h2></div><p>Project links, profile links, and small portfolio utilities.</p></div>
      <div className="upgrade-milestone-grid"><article className="upgrade-milestone"><span className="upgrade-milestone-icon"><Trophy size={19}/></span><h3>Project milestones</h3><p>Six projects are listed with clear development states. Open a repository for current source and issue history.</p><a href="https://github.com/maheshofficial0011?tab=repositories" target="_blank" rel="noreferrer">Browse repositories <ArrowUpRight size={14}/></a></article><article className="upgrade-milestone"><span className="upgrade-milestone-icon"><Sparkles size={19}/></span><h3>Share this portfolio</h3><p>Copy the current page address, or share a specific section using its URL fragment.</p><button type="button" onClick={() => { void sharePortfolio() }}><Copy size={14}/>{copyState}</button></article><article className="upgrade-milestone"><span className="upgrade-milestone-icon"><GraduationCap size={19}/></span><h3>Learning in progress</h3><p>Track subjects you are working on and revisit the roadmap when your focus changes.</p><a href="#learning-roadmap">Open learning roadmap <ArrowUpRight size={14}/></a></article><article className="upgrade-milestone"><span className="upgrade-milestone-icon"><Code2 size={19}/></span><h3>Local visit counter</h3><p>{visitorCount === null ? 'This browser does not allow local visit counting.' : 'Opened ' + visitorCount + ' time' + (visitorCount === 1 ? '' : 's') + ' in this browser profile.'}</p><small>Private to this browser · not a global visitor count</small></article></div>
    </section>

    <section className="upgrade-section section-pad upgrade-preferences" id="portfolio-preferences" aria-labelledby="preferences-title">
      <div className="section-heading"><div><span className="section-kicker">12 / EXPERIENCE SETTINGS</span><h2 id="preferences-title">Your browsing <span className="serif-italic">style.</span></h2></div><p>Choose how lively the new feature cards feel.</p></div>
      <div className="motion-options" role="group" aria-label="Animation style"><button type="button" className={motionStyle === 'dynamic' ? 'active' : ''} onClick={() => setMotionStyle('dynamic')}>Dynamic</button><button type="button" className={motionStyle === 'subtle' ? 'active' : ''} onClick={() => setMotionStyle('subtle')}>Subtle</button><button type="button" className={motionStyle === 'minimal' ? 'active' : ''} onClick={() => setMotionStyle('minimal')}>Minimal</button></div>
      <div className="contrast-setting"><div><strong>High contrast</strong><p>Increase text and control contrast in these added sections.</p></div><button type="button" role="switch" aria-checked={highContrast} className={highContrast ? "contrast-toggle is-on" : "contrast-toggle"} onClick={() => setHighContrast(value => !value)}>{highContrast ? "On" : "Off"}</button></div>
      <p className="upgrade-footnote">The operating system reduced-motion preference is respected by the existing site styles. This selector adjusts the added feature cards only.</p>
    </section>
  </div>
}
