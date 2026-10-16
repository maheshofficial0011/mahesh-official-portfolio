import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Code2, Cpu, Github, Mail, Menu, MessageCircle, Search, ArrowUp, Moon, Leaf, Waves, Linkedin, Sparkles, Terminal, X, Layers3, Braces, ShieldCheck, GraduationCap, Gamepad2, Target, Trophy, Send, RotateCcw } from 'lucide-react'

type Project = { name: string; category: string; status: 'In progress' | 'Building' | 'Learning'; number: string; description: string; stack: string[]; url: string; color: string; icon: typeof Cpu }
const projects: Project[] = [
  { name: 'SurakshaDrishti AI', category: 'AI / ML', status: 'In progress', number: '01', description: 'A computer-vision concept for railway crowd and activity monitoring, with a live dashboard, person detection, and alert workflows.', stack: ['Python', 'YOLOv8', 'OpenCV', 'FastAPI'], url: 'https://github.com/maheshofficial0011/SurakshaDrishti-AI', color: 'lime', icon: ShieldCheck },
  { name: 'SikshaSetu', category: 'Full stack', status: 'In progress', number: '02', description: 'An education-focused platform exploring multilingual learning and accessible communication for students.', stack: ['React', 'TypeScript', 'FastAPI', 'NLLB-200'], url: 'https://github.com/maheshofficial0011/Siksha_Setu', color: 'violet', icon: Layers3 },
  { name: 'SkillSaathi', category: 'Full stack', status: 'Building', number: '03', description: 'A campus peer-learning platform designed to help students share skills, ask for help, and learn together.', stack: ['React', 'TypeScript', 'Supabase'], url: 'https://github.com/maheshofficial0011/skillsaathi-campus-peer-learning', color: 'orange', icon: GraduationCap },
  { name: 'DSA-JAVA', category: 'Development', status: 'Learning', number: '04', description: 'A structured problem-solving journey through data structures and algorithms, with Java practice and edge-case thinking.', stack: ['Java', 'DSA', 'Problem solving'], url: 'https://github.com/maheshofficial0011/DSA-JAVA', color: 'blue', icon: Braces },
  { name: 'WasteVoice AI', category: 'AI / ML', status: 'In progress', number: '05', description: 'An idea exploring how AI-assisted reporting can make campus waste concerns easier to communicate and act on.', stack: ['AI', 'Community tech', 'Prototyping'], url: 'https://github.com/maheshofficial0011/wastevoice-ai', color: 'pink', icon: Sparkles },
  { name: 'Helpdesk 360', category: 'Full stack', status: 'Building', number: '06', description: 'A helpdesk project focused on making support requests and issue tracking easier to manage.', stack: ['Web development', 'UI/UX'], url: 'https://github.com/maheshofficial0011/helpdesk-360', color: 'teal', icon: Terminal },
]
const filters = ['All', 'AI / ML', 'Full stack', 'Development']
type GitHubEvent = { id: string; type: string; repo: { name: string; url: string }; created_at: string; payload: { commits?: { sha: string; message: string }[]; action?: string; ref_type?: string; pull_request?: { title?: string; html_url?: string }; issue?: { title?: string; html_url?: string } } }
type GitHubUser = { public_repos: number; followers: number; following: number; html_url: string; login: string }
const githubEventDescription = (event: GitHubEvent) => {
  if (event.type === 'PushEvent') return { label: 'Pushed commits', detail: event.payload.commits?.length ? `${event.payload.commits.length} commit${event.payload.commits.length === 1 ? '' : 's'}` : 'Repository update' }
  if (event.type === 'CreateEvent') return { label: `Created ${event.payload.ref_type || 'a resource'}`, detail: 'New repository activity' }
  if (event.type === 'PullRequestEvent') return { label: `Pull request ${event.payload.action || 'updated'}`, detail: event.payload.pull_request?.title || 'Pull request activity' }
  if (event.type === 'IssuesEvent') return { label: `Issue ${event.payload.action || 'updated'}`, detail: event.payload.issue?.title || 'Issue activity' }
  if (event.type === 'WatchEvent') return { label: 'Starred a repository', detail: 'Repository starred' }
  if (event.type === 'ForkEvent') return { label: 'Forked a repository', detail: 'Repository forked' }
  if (event.type === 'ReleaseEvent') return { label: 'Published a release', detail: 'Release activity' }
  if (event.type === 'IssueCommentEvent') return { label: 'Commented on an issue', detail: 'Discussion activity' }
  return { label: event.type.replace(/Event$/, '').replace(/([a-z])([A-Z])/g, '$1 $2'), detail: 'Public GitHub activity' }
}
type TerminalLine = { kind: 'input' | 'output' | 'error'; text: string }
const skills = [
  { title: 'AI & Computer Vision', items: ['Python', 'YOLOv8', 'OpenCV', 'Machine Learning'], icon: Cpu },
  { title: 'Web Engineering', items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'], icon: Code2 },
  { title: 'Backend & Data', items: ['FastAPI', 'SQLite', 'Supabase', 'WebSockets'], icon: Layers3 },
  { title: 'Currently learning', items: ['Java DSA', 'Cybersecurity', 'AI automation'], icon: Braces },
]
export default function App() {
  const [filter, setFilter] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'midnight' | 'forest' | 'ocean'>('midnight')
  const [projectQuery, setProjectQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [githubEvents, setGithubEvents] = useState<GitHubEvent[]>([])
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null)
  const [githubLoading, setGithubLoading] = useState(true)
  const [githubError, setGithubError] = useState('')
  const [githubRefreshKey, setGithubRefreshKey] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameScore, setGameScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [terminalInput, setTerminalInput] = useState('')
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [commandPaletteQuery, setCommandPaletteQuery] = useState('')
  const commandPaletteRef = useRef<HTMLInputElement>(null)
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([{ kind: 'output', text: 'Welcome to Mahesh.OS — a portfolio terminal, not a real system shell.' }, { kind: 'output', text: 'Type help to see the available commands.' }])
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const terminalOutputRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const controller = new AbortController()
    const loadGitHubActivity = async () => {
      setGithubLoading(true)
      setGithubError('')
      try {
        const headers = { Accept: 'application/vnd.github+json' }
        const [userResponse, eventsResponse] = await Promise.all([
          fetch('https://api.github.com/users/maheshofficial0011', { headers, signal: controller.signal }),
          fetch('https://api.github.com/users/maheshofficial0011/events/public?per_page=8', { headers, signal: controller.signal }),
        ])
        if (!userResponse.ok || !eventsResponse.ok) throw new Error(userResponse.status === 403 || eventsResponse.status === 403 ? 'GitHub API rate limit reached. Please try again later.' : 'GitHub activity is temporarily unavailable.')
        const [userData, eventData] = await Promise.all([userResponse.json(), eventsResponse.json()])
        if (!Array.isArray(eventData)) throw new Error('GitHub returned an unexpected activity response.')
        setGithubUser(userData as GitHubUser)
        setGithubEvents(eventData as GitHubEvent[])
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        setGithubError(error instanceof Error ? error.message : 'Could not load GitHub activity.')
      } finally {
        if (!controller.signal.aborted) setGithubLoading(false)
      }
    }
    void loadGitHubActivity()
    return () => controller.abort()
  }, [githubRefreshKey])
  useEffect(() => {
    if (!gameActive) return
    if (timeLeft <= 0) { setGameActive(false); return }
    const timer = window.setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [gameActive, timeLeft])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandPaletteOpen(open => !open)
      } else if (event.key === 'Escape') setCommandPaletteOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  useEffect(() => {
    if (commandPaletteOpen) window.requestAnimationFrame(() => commandPaletteRef.current?.focus())
  }, [commandPaletteOpen])
  const paletteActions = [
    { label: 'Go to Home', detail: 'Navigate to the top of the page', keywords: 'home start hero', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Explore Projects', detail: 'Browse my work and repositories', keywords: 'projects work github', action: () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'About Me', detail: 'Read my story', keywords: 'about profile', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Skills', detail: 'View tools and technologies', keywords: 'skills tech stack', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Learning Journey', detail: 'See what I am learning', keywords: 'journey learning dsa', action: () => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'GitHub Activity', detail: 'View recent public GitHub events', keywords: 'github activity commits repositories open source', action: () => document.getElementById('github-activity')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Open Terminal', detail: 'Try interactive portfolio commands', keywords: 'terminal command shell', action: () => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Reaction Challenge', detail: 'Play the 15-second mini game', keywords: 'game challenge play reaction', action: () => document.getElementById('challenge')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Contact Me', detail: 'Find email and WhatsApp links', keywords: 'contact email whatsapp message', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Theme: Midnight', detail: 'Switch to the midnight palette', keywords: 'theme dark midnight', action: () => setTheme('midnight') },
    { label: 'Theme: Forest', detail: 'Switch to the forest palette', keywords: 'theme green forest', action: () => setTheme('forest') },
    { label: 'Theme: Ocean', detail: 'Switch to the ocean palette', keywords: 'theme blue ocean', action: () => setTheme('ocean') },
    { label: 'Copy email address', detail: 'maheshofficial00110@gmail.com', keywords: 'copy email clipboard', action: () => { void navigator.clipboard?.writeText('maheshofficial00110@gmail.com') } },
  ]
  const filteredPaletteActions = paletteActions.filter(item => (item.label + ' ' + item.detail + ' ' + item.keywords).toLowerCase().includes(commandPaletteQuery.toLowerCase().trim()))
  const runPaletteAction = (action: () => void) => { action(); setCommandPaletteOpen(false); setCommandPaletteQuery('') }
  const startGame = () => { setGameScore(0); setTimeLeft(15); setGameActive(true) }
  const handleArtMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -10, y: ((event.clientX - rect.left) / rect.width - .5) * 12 })
  }
  const visibleProjects = useMemo(() => projects.filter(p => (filter === 'All' || p.category === filter) && `${p.name} ${p.description} ${p.stack.join(' ')}`.toLowerCase().includes(projectQuery.toLowerCase().trim())), [filter, projectQuery])
  const closeMenu = () => setMenuOpen(false)
  const runTerminalCommand = (rawCommand: string) => {
    const command = rawCommand.trim()
    if (!command) return
    const [name, ...args] = command.toLowerCase().split(/\s+/)
    const argument = args.join(' ')
    const output = (text: string, kind: TerminalLine['kind'] = 'output') => setTerminalLines(lines => [...lines, { kind: 'input' as const, text: '$ ' + command }, { kind, text }].slice(-36))
    if (name === 'clear') { setTerminalLines([]); return }
    if (name === 'help') output('Commands: help · whoami · about · projects · skills · contact · theme [midnight|forest|ocean] · open <project> · clear')
    else if (name === 'whoami') output('Mahesh Official — engineering student, builder, and curious problem-solver.')
    else if (name === 'about') output('I learn by building useful things, testing edge cases, and improving what breaks. Current interests: AI/ML, full-stack development, Java DSA, and automation.')
    else if (name === 'projects') output(projects.map(project => project.number + '  ' + project.name + ' — ' + project.category).join('\n'))
    else if (name === 'skills') output('Python · React · TypeScript · Vite · FastAPI · OpenCV · YOLOv8 · SQLite · Supabase · Java DSA')
    else if (name === 'contact') output('Email: maheshofficial00110@gmail.com\nGitHub: github.com/maheshofficial0011')
    else if (name === 'theme') {
      if (['midnight', 'forest', 'ocean'].includes(argument)) { setTheme(argument as 'midnight' | 'forest' | 'ocean'); output('Theme switched to ' + argument + '.') }
      else output('Usage: theme midnight | theme forest | theme ocean')
    } else if (name === 'open') {
      const normalized = argument.replace(/\s+/g, '-')
      const match = projects.find(project => project.name.toLowerCase() === argument || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized)
      if (match) { window.open(match.url, '_blank', 'noopener,noreferrer'); output('Opening ' + match.name + ' repository in a new tab: ' + match.url) }
      else output('Project not found. Try open sikshasetu, open dsa-java, open skillsaathi, or run projects.', 'error')
    } else output('Unknown command: ' + name + '. Type help to see available commands.', 'error')
    window.requestAnimationFrame(() => { if (terminalOutputRef.current) terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight })
  }
  return <div className={`site-shell theme-${theme}`}><div className="noise" aria-hidden="true" />
    <button type="button" className="command-palette-trigger" onClick={() => setCommandPaletteOpen(true)} aria-keyshortcuts="Control+K Meta+K"><Search size={14}/><span>Quick jump</span><kbd>Ctrl K</kbd></button>
    {selectedProject && <div className="project-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedProject(null) }}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <div className="project-modal-top"><span className="section-kicker">PROJECT / {selectedProject.number}</span><button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details"><X size={19}/></button></div>
        <div className={`project-modal-art ${selectedProject.color}`}><div className="visual-grid"/><div className="visual-number">MAHESH.LAB / {selectedProject.number}</div><div className="project-modal-icon">{(() => { const Icon = selectedProject.icon; return <Icon size={48} strokeWidth={1.2}/> })()}</div><span>{selectedProject.category.toUpperCase()}</span></div>
        <div className="project-modal-content"><div className="project-meta"><span className="project-index">SELECTED WORK</span><span className={`project-status ${selectedProject.status.toLowerCase().replace(' ','-')}`}><i/>{selectedProject.status}</span></div><h2 id="project-modal-title">{selectedProject.name}</h2><p>{selectedProject.description}</p><h3>Technology stack</h3><div className="tags">{selectedProject.stack.map(tech => <span key={tech}>{tech}</span>)}</div><div className="project-modal-actions"><a className="btn btn-primary" href={selectedProject.url} target="_blank" rel="noreferrer">Explore repository <ArrowUpRight size={16}/></a><button className="btn btn-quiet" type="button" onClick={() => setSelectedProject(null)}>Close details</button></div><p className="project-modal-note">Project status reflects the current portfolio notes. Check the repository for implementation details and the latest progress.</p></div>
      </section>
    </div>}
    {commandPaletteOpen && <div className="command-palette-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setCommandPaletteOpen(false) }}>
      <section className="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-palette-title">
        <div className="command-palette-search"><Search size={18}/><label className="sr-only" id="command-palette-title" htmlFor="command-palette-input">Search portfolio actions</label><input id="command-palette-input" ref={commandPaletteRef} value={commandPaletteQuery} onChange={event => setCommandPaletteQuery(event.target.value)} placeholder="Search pages, themes, and actions…" autoComplete="off"/><button type="button" onClick={() => setCommandPaletteOpen(false)} aria-label="Close quick jump"><X size={17}/></button></div>
        <p className="command-palette-caption">QUICK JUMP <span>ESC TO CLOSE</span></p>
        <div className="command-palette-results" role="listbox" aria-label="Portfolio actions">{filteredPaletteActions.length ? filteredPaletteActions.map(item => <button type="button" role="option" aria-selected="false" className="command-palette-item" key={item.label} onClick={() => runPaletteAction(item.action)}><span className="command-palette-item-icon"><ArrowUpRight size={16}/></span><span><strong>{item.label}</strong><small>{item.detail}</small></span><kbd>↵</kbd></button>) : <p className="command-palette-empty">No matching actions. Try “projects”, “theme”, or “contact”.</p>}</div>
        <div className="command-palette-footer"><span><kbd>Ctrl</kbd> + <kbd>K</kbd> to toggle</span><span>MAHESH.OS</span></div>
      </section>
    </div>}
    <header className="nav-wrap"><a className="brand" href="#home" onClick={closeMenu}><span className="brand-mark">M<span>.</span></span><span>MAHESH <em>OFFICIAL</em></span></a>
      <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <div className="nav-right"><div className="theme-switcher" role="group" aria-label="Choose visual theme"><button className={theme==='midnight'?'theme-option active':'theme-option'} onClick={()=>setTheme('midnight')} aria-label="Midnight theme" title="Midnight"><Moon size={14}/></button><button className={theme==='forest'?'theme-option active':'theme-option'} onClick={()=>setTheme('forest')} aria-label="Forest theme" title="Forest"><Leaf size={14}/></button><button className={theme==='ocean'?'theme-option active':'theme-option'} onClick={()=>setTheme('ocean')} aria-label="Ocean theme" title="Ocean"><Waves size={14}/></button></div><nav className={menuOpen ? 'nav-links open' : 'nav-links'}><a href="#work" onClick={closeMenu}>Work <span>↘</span></a><a href="#about" onClick={closeMenu}>About</a><a href="#skills" onClick={closeMenu}>Skills</a><a href="#journey" onClick={closeMenu}>Journey</a><a href="#github-activity" onClick={closeMenu}>GitHub</a><a href="#terminal" onClick={closeMenu}>Terminal</a><a href="#challenge" onClick={closeMenu}>Challenge</a><a className="nav-contact" href="#contact" onClick={closeMenu}>Let's talk <ArrowUpRight size={15}/></a></nav></div>
    </header>
    <main>
      <section className="hero section-pad" id="home">
        <div className="hero-copy"><motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="eyebrow"><span className="status-dot"/> AVAILABLE FOR COLLABORATION <span className="eyebrow-line"/></motion.div>
          <motion.h1 initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.08}}>Ideas into<br/><span className="gradient-text">intelligent</span><br/>experiences<span className="period">.</span></motion.h1>
          <motion.p className="hero-sub" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.35}}>I'm <strong>Mahesh</strong>, an engineering student who learns by building. I keep coming back to one question: can I turn this idea into something a real person would find useful? Most days, that means writing code, testing an AI idea, fixing what broke, and learning enough to try again.</motion.p>
          <motion.div className="hero-actions" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.45}}><a className="btn btn-primary" href="#work">Explore my work <ArrowDownRight size={17}/></a><a className="btn btn-quiet" href="https://github.com/maheshofficial0011" target="_blank" rel="noreferrer"><Github size={17}/> GitHub profile <ArrowUpRight size={15}/></a></motion.div>
          <div className="hero-foot"><span><span className="tiny-square"/> ENGINEERING STUDENT</span><span>BUILDING IN PUBLIC · 2026</span></div>
        </div>
        <motion.div className="hero-art" onMouseMove={handleArtMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} style={{ rotateX: tilt.x, rotateY: tilt.y, transformPerspective: 1000 }} initial={{opacity:0,scale:.94,rotate:2}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:.9,delay:.15}}>
          <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-orbit orbit-three"/><div className="art-cross cross-a"/><div className="art-cross cross-b"/>
          <div className="art-core"><div className="core-top"><span className="core-dot"/><span>THINK / BUILD / ITERATE</span><span className="core-menu">•••</span></div><div className="core-symbol">M<span>✳</span></div><div className="core-bottom"><span>CREATIVE ENGINEERING</span><span className="core-index">[ 01 — ∞ ]</span></div></div>
          <div className="float-card float-code"><span className="float-label"><Terminal size={13}/> CURRENT MODE</span><strong>Building things<br/>that matter<span className="cursor">_</span></strong><div className="mini-bars">{Array.from({length:10},(_,i)=><i key={i}/>)}</div></div>
          <div className="float-card float-ai"><span className="ai-spark"><Sparkles size={16}/></span><div><strong>AI × HUMAN</strong><small>Ideas with purpose</small></div></div><span className="art-note note-top">FIG. 001 / PERSONAL SYSTEM</span><span className="art-note note-bottom">INFINITE CURIOSITY ↗</span>
        </motion.div>
        <a className="scroll-cue" href="#work"><span className="scroll-line"/> SCROLL TO EXPLORE <ArrowDownRight size={14}/></a>
      </section>
      <div className="marquee" aria-label="Areas of interest"><div className="marquee-track">{Array.from({length:2},(_,i)=><span key={i}>AI & MACHINE LEARNING <b>✳</b> FULL-STACK DEVELOPMENT <b>✳</b> CREATIVE TECHNOLOGY <b>✳</b> PROBLEM SOLVING <b>✳</b> BUILDING FOR IMPACT <b>✳</b></span>)}</div></div>
      <section className="work-section section-pad" id="work"><div className="section-heading"><div><span className="section-kicker">01 / SELECTED PROJECTS</span><h2>Things I'm <span className="serif-italic">making.</span></h2></div><p>Real problems. Curious experiments.<br/>A workbench that keeps evolving.</p></div>
        <div className="filter-row" role="group" aria-label="Filter projects">{filters.map(f=><button key={f} onClick={()=>setFilter(f)} className={filter===f?'filter active':'filter'}>{f}<span>{f==='All'?projects.length.toString().padStart(2,'0'):projects.filter(p=>p.category===f).length.toString().padStart(2,'0')}</span></button>)}</div><div className="project-search-row"><label className="project-search"><Search size={16}/><input type="search" value={projectQuery} onChange={e=>setProjectQuery(e.target.value)} placeholder="Search projects or technologies..." aria-label="Search projects or technologies"/>{projectQuery && <button type="button" onClick={()=>setProjectQuery('')} aria-label="Clear search"><X size={15}/></button>}</label><span className="project-result-count">{visibleProjects.length} of {projects.length} projects</span></div>
        <div className="project-grid">{visibleProjects.map((p,idx)=>{const Icon=p.icon;return <motion.article layout key={p.name} className={`project-card ${p.color}`} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.4,delay:idx*.05}}><div className="project-visual"><div className="visual-grid"/><div className="visual-number">PROJECT / {p.number}</div><div className="visual-icon"><Icon strokeWidth={1.25}/></div><div className="visual-orb"/><div className="visual-bottom"><span>{p.category.toUpperCase()}</span><span>MAHESH.LAB</span></div></div><div className="project-info"><div className="project-meta"><span className="project-index">{p.number} / 06</span><span className={`project-status ${p.status.toLowerCase().replace(' ','-')}`}><i/>{p.status}</span></div><h3>{p.name}<a href={p.url} target="_blank" rel="noreferrer" aria-label={`Open ${p.name} on GitHub`}><ArrowUpRight size={19}/></a></h3><p>{p.description}</p><div className="tags">{p.stack.map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><button className="project-link project-details-button" type="button" onClick={() => setSelectedProject(p)}>QUICK VIEW <Layers3 size={13}/></button><a className="project-link" href={p.url} target="_blank" rel="noreferrer">VIEW REPOSITORY <ArrowUpRight size={13}/></a></div></div></motion.article>})}</div>{visibleProjects.length === 0 && <div className="no-project-results"><Search size={22}/><strong>No matching projects</strong><p>Try another project name, category, or technology.</p><button className="btn btn-quiet" type="button" onClick={() => { setProjectQuery(""); setFilter("All") }}>Reset filters</button></div>}
        <div className="project-disclaimer"><span className="disclaimer-mark">i</span><p>Project statuses reflect current development and learning notes. Some features are prototypes or in progress; repository details are the source of truth.</p></div>
      </section>
      <section className="about-section section-pad" id="about"><div className="about-left"><span className="section-kicker">02 / A LITTLE ABOUT ME</span><h2>Curiosity is<br/>my <span className="serif-italic">default setting.</span></h2><div className="about-stamp"><span>STAY</span><strong>CURIOUS</strong><span>KEEP BUILDING ↗</span></div></div><div className="about-copy"><div className="big-quote">“</div><p className="about-lead">I learn best when an idea becomes a working thing — even if the first version is rough.</p><p>My path so far has been hands-on rather than perfectly linear. I've explored computer vision, multilingual learning tools, peer-to-peer student learning, and full-stack apps. Each project has forced me to get past the exciting idea and deal with the practical parts: structure, edge cases, interfaces, data, and the bugs that only show up when something actually runs.</p><p>I'm still figuring out which problems I want to spend years solving. For now, I'm strengthening my fundamentals in Java and data structures while exploring AI/ML, backend development, and automation. I don't consider every experiment a finished product; I want this site to show what I'm learning, what I'm building, and what still needs work.</p><div className="about-signoff"><span className="signature">Mahesh.</span><span>LEARN LOUDLY. BUILD THOUGHTFULLY.</span></div></div></section>
      <section className="skills-section section-pad" id="skills"><div className="section-heading"><div><span className="section-kicker">03 / MY TOOLKIT</span><h2>Tools of the <span className="serif-italic">trade.</span></h2></div><p>Technologies I use, explore, and<br/>keep getting better at.</p></div><div className="skills-grid">{skills.map((s,i)=>{const Icon=s.icon;return <motion.div className="skill-card" key={s.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}><div className="skill-card-top"><span className="skill-icon"><Icon size={19}/></span><span className="skill-num">0{i+1}</span></div><h3>{s.title}</h3><div className="skill-pills">{s.items.map(item=><span key={item}>{item}</span>)}</div><div className="skill-card-line"/></motion.div>})}</div><p className="skills-note"><span className="status-dot"/> This is an evolving toolkit, not a claim of mastery in every technology.</p></section>
      <section className="journey-section section-pad" id="journey"><div className="journey-intro"><span className="section-kicker">04 / THE PROCESS</span><h2>Progress over<br/><span className="serif-italic">perfection.</span></h2><p>I don't have a perfect roadmap. This is the repeatable loop that helps me make progress without pretending I know everything already.</p></div><div className="journey-steps"><div className="journey-step"><span className="step-count">01</span><div><h3>Explore</h3><p>Start with the people and the problem, not the framework. Read, ask questions, and understand what a useful result would look like.</p></div><span className="step-symbol">⌕</span></div><div className="journey-step"><span className="step-count">02</span><div><h3>Experiment</h3><p>Make the smallest version that can teach me something. Run it, test the awkward cases, and keep notes on what fails.</p></div><span className="step-symbol">⤢</span></div><div className="journey-step"><span className="step-count">03</span><div><h3>Improve</h3><p>Fix the rough edges, explain the decisions, and be honest about what is complete versus what is still a prototype.</p></div><span className="step-symbol">↗</span></div></div></section>

      <section className="github-activity-section section-pad" id="github-activity" aria-labelledby="github-activity-title">
        <div className="section-heading"><div><span className="section-kicker">05 / LIVE FROM GITHUB</span><h2 id="github-activity-title">Building in <span className="serif-italic">public.</span></h2></div><p>Recent public activity fetched directly from GitHub.<br/>Updates when this section loads.</p></div>
        <div className="github-profile-strip">
          <div className="github-profile-mark"><Github size={25}/></div>
          <div className="github-profile-copy"><strong>@maheshofficial0011</strong><span>{githubLoading ? 'Fetching public profile…' : githubError ? 'Live profile temporarily unavailable' : 'Live public GitHub profile'}</span></div>
          {githubUser && <div className="github-profile-stats"><span><strong>{githubUser.public_repos}</strong><small>repositories</small></span><span><strong>{githubUser.followers}</strong><small>followers</small></span><span><strong>{githubUser.following}</strong><small>following</small></span></div>}
          <a className="github-profile-link" href="https://github.com/maheshofficial0011" target="_blank" rel="noreferrer">PROFILE <ArrowUpRight size={14}/></a>
        </div>
        {githubLoading && <div className="github-activity-state" role="status"><span className="github-loading-dot"/>Loading recent public activity from GitHub…</div>}
        {!githubLoading && githubError && <div className="github-activity-state github-activity-error" role="alert"><strong>Couldn’t load live activity</strong><p>{githubError} This section uses GitHub’s public API and does not contain invented sample events.</p><button className="btn btn-quiet" type="button" onClick={() => setGithubRefreshKey(key => key + 1)}><RotateCcw size={14}/> Try again</button></div>}
        {!githubLoading && !githubError && githubEvents.length === 0 && <div className="github-activity-state">No recent public events were returned. Check the profile for repositories and other activity.</div>}
        {!githubLoading && !githubError && githubEvents.length > 0 && <div className="github-activity-list">{githubEvents.map(event => { const description = githubEventDescription(event); return <article className="github-activity-item" key={event.id}><span className="github-event-marker"><Github size={15}/></span><div className="github-event-main"><div className="github-event-heading"><strong>{description.label}</strong><time dateTime={event.created_at}>{new Date(event.created_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</time></div><p>{description.detail}</p><a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer">{event.repo.name}<ArrowUpRight size={13}/></a></div></article> })}</div>}
        <div className="github-activity-footer"><span><i/> PUBLIC EVENTS ONLY · GITHUB API</span><button type="button" onClick={() => setGithubRefreshKey(key => key + 1)} disabled={githubLoading}><RotateCcw size={13}/> Refresh activity</button></div>
        <p className="github-activity-disclaimer">GitHub’s public events feed may be delayed and only includes recent public activity. It does not represent private contributions or a complete lifetime contribution count. <a href="https://docs.github.com/en/rest/activity/events" target="_blank" rel="noreferrer">API details <ArrowUpRight size={11}/></a></p>
      </section>

      <section className="terminal-section section-pad" id="terminal" aria-labelledby="terminal-title">
        <div className="terminal-intro"><span className="section-kicker">05 / INTERACTIVE SYSTEM</span><h2 id="terminal-title">Meet me at the<br/><span className="serif-italic">command line.</span></h2><p>Explore my work through a little terminal. These commands are a safe, simulated interface — they do not execute system commands.</p><div className="terminal-hint"><span>TRY</span><button type="button" onClick={() => { setTerminalInput("help"); terminalInputRef.current?.focus() }}>help</button><button type="button" onClick={() => { setTerminalInput("projects"); terminalInputRef.current?.focus() }}>projects</button><button type="button" onClick={() => runTerminalCommand("theme ocean")}>theme ocean</button></div></div>
        <div className="terminal-window" onClick={() => terminalInputRef.current?.focus()}>
          <div className="terminal-titlebar"><div className="terminal-lights" aria-hidden="true"><i/><i/><i/></div><span><Terminal size={14}/> mahesh@portfolio:~</span><span className="terminal-live"><i/> ONLINE</span></div>
          <div className="terminal-screen" ref={terminalOutputRef} role="log" aria-live="polite" aria-label="Terminal output">
            <div className="terminal-banner" aria-hidden="true">MAHESH<span>.OS</span><small>PERSONAL PORTFOLIO INTERFACE / v1.0</small></div>
            {terminalLines.map((line, index) => <div className={"terminal-line terminal-" + line.kind} key={index}><span className="terminal-prompt" aria-hidden="true">{line.kind === "input" ? "›" : line.kind === "error" ? "!" : "•"}</span><pre>{line.text}</pre></div>)}
          </div>
          <form className="terminal-command" onSubmit={event => { event.preventDefault(); runTerminalCommand(terminalInput); setTerminalInput("") }}>
            <label htmlFor="terminal-input"><span aria-hidden="true">❯</span><span className="sr-only">Enter a terminal command</span></label><input id="terminal-input" ref={terminalInputRef} value={terminalInput} onChange={event => setTerminalInput(event.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="type a command…" aria-describedby="terminal-help"/><button type="submit" aria-label="Run command"><ArrowUpRight size={17}/></button>
          </form><p className="terminal-help" id="terminal-help">Enter to run · <button type="button" onClick={() => { setTerminalInput("help"); terminalInputRef.current?.focus() }}>show commands</button> · <button type="button" onClick={() => { setTerminalLines([]); terminalInputRef.current?.focus() }}>clear output</button></p>
        </div>
      </section>
      <section className="challenge-section section-pad" id="challenge"><div className="challenge-heading"><span className="section-kicker">06 / PLAY & CHALLENGE</span><h2>A tiny test of<br/><span className="serif-italic">reaction.</span></h2><p>Fifteen seconds. Click as fast as you can. No leaderboard tricks — just a little break and a fair score.</p></div><div className="game-panel glass-panel"><div className="game-topline"><span><Gamepad2 size={16}/> REACTION LAB</span><span className="game-timer">{gameActive ? `${timeLeft}s LEFT` : timeLeft === 0 ? 'TIME UP' : '15s ROUND'}</span></div><div className="game-score"><span>YOUR SCORE</span><strong>{gameScore.toString().padStart(2, '0')}</strong><small>{gameScore >= 20 ? 'Quick hands!' : 'Ready when you are.'}</small></div><button className={`game-target ${gameActive ? 'is-live' : ''}`} disabled={!gameActive} onClick={() => setGameScore(s => s + 1)} aria-label="Click target to score points"><Target size={27}/><span>{gameActive ? 'CLICK!' : timeLeft === 0 ? 'ROUND OVER' : 'TARGET'}</span></button><div className="game-controls"><button className="btn btn-primary" onClick={startGame}><RotateCcw size={15}/>{gameActive ? 'Restart round' : timeLeft === 0 ? 'Play again' : 'Start challenge'}</button><a className="btn btn-quiet" href="mailto:maheshofficial00110@gmail.com?subject=Challenge%20Mahesh&body=Hey%20Mahesh%2C%20I%20tried%20your%20portfolio%20challenge.%20Here%27s%20my%20challenge%3A%20"><Send size={15}/> Challenge me directly <ArrowUpRight size={14}/></a></div><p className="game-note"><Trophy size={13}/> Think you can beat your own score? Restart and try again. Want a coding challenge instead? Send me one.</p></div></section>
      <section className="contact-section section-pad" id="contact"><div className="contact-glow"/><span className="section-kicker">05 / YOUR TURN</span><h2>Have a good<br/>problem? <span className="serif-italic">Let's build.</span></h2><p>Open to learning together, collaborating on meaningful projects, and connecting with people who love making things.</p><div className="contact-actions"><a className="btn btn-whatsapp" href="https://wa.me/9779806434625?text=Hi%20Mahesh%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you." target="_blank" rel="noreferrer"><MessageCircle size={18}/> Chat on WhatsApp <ArrowUpRight size={17}/></a><a className="btn btn-outline" href="mailto:maheshofficial00110@gmail.com"><Mail size={17}/> Send an email</a><a className="btn btn-outline" href="https://github.com/maheshofficial0011" target="_blank" rel="noreferrer"><Github size={17}/> Follow my work</a></div><a className="whatsapp-contact-card" href="https://wa.me/9779806434625?text=Hi%20Mahesh%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you." target="_blank" rel="noreferrer"><span className="whatsapp-card-icon"><MessageCircle size={21}/></span><span className="whatsapp-card-copy"><strong>Prefer WhatsApp?</strong><small>Message me directly · +977 9806434625</small></span><ArrowUpRight className="whatsapp-card-arrow" size={19}/></a><form className="contact-form" action="https://formsubmit.co/maheshofficial00110@gmail.com" method="POST"><input type="hidden" name="_subject" value="New portfolio message — Mahesh Official"/><input type="hidden" name="_template" value="table"/><div className="contact-form-heading"><span className="section-kicker">OR SEND A MESSAGE HERE</span><p>Fill in the form and it will be delivered to my Gmail inbox.</p></div><div className="contact-form-grid"><label>Your name<input name="name" type="text" placeholder="Your name" autoComplete="name" required/></label><label>Your email<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/></label><label className="contact-form-full">Subject<input name="subject" type="text" placeholder="What would you like to discuss?" required/></label><label className="contact-form-full">Message<textarea name="message" rows={5} placeholder="Write your message here..." required/></label></div><button className="btn btn-primary contact-submit" type="submit"><Mail size={16}/> Send message <ArrowUpRight size={16}/></button><p className="contact-form-note">Your email address is used so Mahesh can reply. Please don't include sensitive information.</p></form><div className="contact-bottom"><span><span className="status-dot"/> OPEN TO IDEAS & COLLABORATION</span><span>NO SHORTCUTS. JUST CURIOSITY.</span></div></section>
    </main>
    <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">M<span>.</span></span><span>MAHESH <em>OFFICIAL</em></span></a><span className="footer-made">DESIGNED WITH INTENTION <span>✳</span> BUILT TO EVOLVE</span><div className="socials"><a href="https://github.com/maheshofficial0011" aria-label="GitHub" target="_blank" rel="noreferrer"><Github size={17}/></a><a href="https://www.linkedin.com/search/results/people/?keywords=Mahesh%20%28Manav%29%20Rana" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={17} strokeWidth={2.1}/></a><a href="mailto:maheshofficial00110@gmail.com" aria-label="Email"><Mail size={17}/></a></div><span className="copyright">© 2026 MAHESH OFFICIAL</span></footer>
    <a className="back-to-top" href="#home" aria-label="Back to top"><ArrowUp size={17}/><span>BACK TO TOP</span></a>
  </div>
}
