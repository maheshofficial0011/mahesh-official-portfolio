import { useEffect, useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, BookOpen, CheckCircle2, Code2, Copy, ExternalLink, FileText, Github, GraduationCap, Layers3, Map, Sparkles, Trophy } from 'lucide-react'
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
const articles = [
  { id: 'learning', category: 'Reflection', title: 'Learning in public without pretending to know everything', summary: 'Show work in progress honestly.', body: 'Keep project status clear, explain what is working, and label prototypes as prototypes. A useful portfolio can show decisions, questions, and next steps—not only finished outcomes.' },
  { id: 'edges', category: 'Problem solving', title: 'Why edge cases make better programmers', summary: 'Small tests reveal assumptions hidden in a solution.', body: 'Start with normal input, then consider empty input, one item, duplicates, boundaries, and invalid positions. Write down what you expect before running the code; the difference is where learning happens.' },
  { id: 'ai', category: 'AI / ML', title: 'Building AI around a real problem', summary: 'Begin with the user and workflow, not just the model.', body: 'Describe who needs help, what task is difficult, and how success would be measured. Then choose the simplest tool that can test the idea, and be explicit about its limitations.' },
]
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
  const [motionStyle, setMotionStyle] = useState('dynamic')
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => { try { window.localStorage.setItem('mahesh-roadmap-progress', JSON.stringify(completed)) } catch { /* Session still works without storage. */ } }, [completed])
  useEffect(() => {
    try {
      const key = 'mahesh-portfolio-local-visits'
      const next = Number(window.localStorage.getItem(key) || 0) + 1
      window.localStorage.setItem(key, String(next))
      setVisitorCount(next)
    } catch { setVisitorCount(null) }
  }, [])

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter(project => (category === 'All' || project.category === category) && (project.name + ' ' + project.category + ' ' + project.stack + ' ' + project.status).toLowerCase().includes(query.trim().toLowerCase()))
    if (sortBy === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'category') return [...filtered].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    return filtered
  }, [category, query, sortBy])

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
      <div className="upgrade-project-controls"><label><span className="sr-only">Search projects</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, stack, or status…"/></label><label><span className="sr-only">Filter project category</span><select value={category} onChange={event => setCategory(event.target.value)}><option>All</option><option>AI / ML</option><option>Full stack</option><option>Development</option></select></label><label><span className="sr-only">Sort projects</span><select value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="featured">Featured order</option><option value="name">Name A–Z</option><option value="category">Category</option></select></label></div>
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

    <section className="upgrade-section section-pad" id="milestones" aria-labelledby="milestones-title">
      <div className="section-heading"><div><span className="section-kicker">11 / MILESTONES & SHARING</span><h2 id="milestones-title">Make progress <span className="serif-italic">visible.</span></h2></div><p>Project links, profile links, and small portfolio utilities.</p></div>
      <div className="upgrade-milestone-grid"><article className="upgrade-milestone"><span className="upgrade-milestone-icon"><Trophy size={19}/></span><h3>Project milestones</h3><p>Six projects are listed with clear development states. Open a repository for current source and issue history.</p><a href="https://github.com/maheshofficial0011?tab=repositories" target="_blank" rel="noreferrer">Browse repositories <ArrowUpRight size={14}/></a></article><article className="upgrade-milestone"><span className="upgrade-milestone-icon"><Sparkles size={19}/></span><h3>Share this portfolio</h3><p>Copy the current page address, or share a specific section using its URL fragment.</p><button type="button" onClick={() => { void sharePortfolio() }}><Copy size={14}/>{copyState}</button></article><article className="upgrade-milestone"><span className="upgrade-milestone-icon"><GraduationCap size={19}/></span><h3>Learning in progress</h3><p>Track subjects you are working on and revisit the roadmap when your focus changes.</p><a href="#learning-roadmap">Open learning roadmap <ArrowUpRight size={14}/></a></article><article className="upgrade-milestone"><span className="upgrade-milestone-icon"><Code2 size={19}/></span><h3>Local visit counter</h3><p>{visitorCount === null ? 'This browser does not allow local visit counting.' : 'Opened ' + visitorCount + ' time' + (visitorCount === 1 ? '' : 's') + ' in this browser profile.'}</p><small>Private to this browser · not a global visitor count</small></article></div>
    </section>

    <section className="upgrade-section section-pad upgrade-preferences" id="portfolio-preferences" aria-labelledby="preferences-title">
      <div className="section-heading"><div><span className="section-kicker">12 / EXPERIENCE SETTINGS</span><h2 id="preferences-title">Your browsing <span className="serif-italic">style.</span></h2></div><p>Choose how lively the new feature cards feel.</p></div>
      <div className="motion-options" role="group" aria-label="Animation style"><button type="button" className={motionStyle === 'dynamic' ? 'active' : ''} onClick={() => setMotionStyle('dynamic')}>Dynamic</button><button type="button" className={motionStyle === 'subtle' ? 'active' : ''} onClick={() => setMotionStyle('subtle')}>Subtle</button><button type="button" className={motionStyle === 'minimal' ? 'active' : ''} onClick={() => setMotionStyle('minimal')}>Minimal</button></div>
      <div className="contrast-setting"><div><strong>High contrast</strong><p>Increase text and control contrast in these added sections.</p></div><button type="button" role="switch" aria-checked={highContrast} className={highContrast ? "contrast-toggle is-on" : "contrast-toggle"} onClick={() => setHighContrast(value => !value)}>{highContrast ? "On" : "Off"}</button></div>\n      <p className="upgrade-footnote">The operating system reduced-motion preference is respected by the existing site styles. This selector adjusts the added feature cards only.</p>
    </section>
  </div>
}
