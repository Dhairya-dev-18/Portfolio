import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Command,
  CornerDownLeft,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Sun,
  Terminal,
  X,
} from "lucide-react";
import { profile, projects, skills, type Project } from "./config/profile";

const nav = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Work", id: "work" },
  { label: "Journey", id: "journey" },
  { label: "Contact", id: "contact" },
];
const cats = [
  "All",
  "Programming",
  "Frontend",
  "Backend",
  "Databases",
  "Tools",
];

function App() {
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem("theme") ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"),
  );
  const [active, setActive] = useState("top");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  const [palette, setPalette] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Hi! I’m Dhairya’s Dev Console.",
    "Type help to see what you can explore.",
  ]);
  const [formState, setFormState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [formError, setFormError] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const filteredSkills = useMemo(
    () =>
      skills.filter(
        (s) =>
          (filter === "All" || s.category === filter) &&
          s.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [filter, query],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette(true);
      }
      if (e.key === "Escape") {
        setPalette(false);
        setSelected(null);
      }
    };
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      setProgress(height ? scrollY / height : 0);
      const sections = ["top", ...nav.map((n) => n.id)];
      let current = "top";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 150) current = id;
      }
      setActive(current);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    if (palette) inputRef.current?.focus();
  }, [palette]);
  const go = (id: string) => {
    setPalette(false);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const run = (raw = term) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const output: Record<string, string[]> = {
      help: [
        "Available: about · skills · projects · education · contact · clear",
      ],
      about: [`${profile.name} — ${profile.role}.`, profile.intro],
      skills: [skills.map((s) => s.name).join(" · ")],
      projects: [projects.map((p) => p.name).join(" · ")],
      education: [profile.education, profile.college, profile.university],
      contact: [
        profile.email
          ? `Email: ${profile.email}`
          : "Add a professional email in src/config/profile.ts to publish contact details.",
      ],
    };
    if (cmd === "clear") setHistory([]);
    else {
      setHistory((h) => [
        ...h,
        `› ${raw}`,
        ...(output[cmd] || ["Command not found. Try help."]),
      ]);
      const destinations: Record<string, string> = {
        about: "about",
        skills: "skills",
        projects: "work",
        education: "journey",
        contact: "contact",
      };
      if (destinations[cmd]) go(destinations[cmd]);
    }
    setTerm("");
  };
  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");
    setFormError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok)
        throw new Error(body.message || "Could not send your message.");
      setFormState("success");
      formRef.current?.reset();
    } catch (err) {
      setFormState("error");
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to reach the contact service. Start the API and MySQL, then try again.",
      );
    }
  };
  const paletteActions = [
    ...nav.map((n) => ({ label: `Go to ${n.label}`, action: () => go(n.id) })),
    ...projects.map((p) => ({
      label: `Open project: ${p.name}`,
      action: () => {
        setPalette(false);
        setSelected(p);
      },
    })),
    {
      label: "Switch theme",
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        setPalette(false);
      },
    },
  ].filter((a) => a.label.toLowerCase().includes(paletteQuery.toLowerCase()));
  return (
    <>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />
      <header className="nav">
        <a
          className="brand"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go("top");
          }}
        >
          <span className="brand-mark">D.</span>
          <span>
            Dhairya<span className="brand-dot">/</span>dev
          </span>
        </a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {nav.map((n) => (
            <a
              key={n.id}
              className={active === n.id ? "active" : ""}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(n.id);
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="icon-btn palette-trigger"
            onClick={() => setPalette(true)}
            aria-label="Open command palette"
          >
            <Command size={16} />
            <span>⌘ K</span>
          </button>
          <button
            className="icon-btn theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Switch theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            className="nav-cta"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go("contact");
            }}
          >
            Let’s talk <ArrowUpRight size={14} />
          </a>
          <button
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>
      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="availability">
              <span className="status-dot" /> OPEN TO LEARNING & BUILDING{" "}
              <span className="availability-line" />
            </div>
            <h1>
              Making the web
              <br />a little more <em>human.</em>
            </h1>
            <p className="hero-lede">
              I’m <strong>Dhairya Tiwari</strong> — a computer science student
              exploring full-stack development, backend systems, and the craft
              of turning ideas into useful software.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  go("work");
                }}
              >
                Explore my work <ArrowDownRight size={17} />
              </a>
              <a
                className="button button-quiet"
                href={profile.resumePath}
                download
              >
                Download resume <ArrowDown size={16} />
              </a>
            </div>
            <div className="social-row">
              {profile.github ? (
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <Github size={16} /> GitHub <ArrowUpRight size={12} />
                </a>
              ) : null}
              {profile.linkedin ? (
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} />
                </a>
              ) : null}
              <span className="social-placeholder">
                Add profile links in config
              </span>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="A schematic of connected software systems"
          >
            <div className="art-top">
              <span>FIG. 01 — SYSTEMS IN MOTION</span>
              <span>01 / 04</span>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="system-node node-core">
              <span className="node-symbol">&lt;/&gt;</span>
              <span>build</span>
            </div>
            <div className="system-node node-ui">
              <span className="node-small">UI</span>
              <span>interface</span>
            </div>
            <div className="system-node node-api">
              <span className="node-small">API</span>
              <span>logic</span>
            </div>
            <div className="system-node node-db">
              <span className="node-small">DB</span>
              <span>data</span>
            </div>
            <div className="art-caption">
              <span>curiosity → code → something useful</span>
              <span className="tiny-arrow">↗</span>
            </div>
          </div>
          <div className="hero-meta">
            <span>BASED IN {profile.location.toUpperCase()}</span>
            <span>
              SCROLL TO EXPLORE <span className="scroll-mark">↓</span>
            </span>
          </div>
        </section>
        <section className="intro-strip">
          <div className="wrap intro-inner">
            <span className="eyebrow">A PRACTICAL MINDSET</span>
            <p>
              Learn the fundamentals.
              <br />
              <span>Build something real.</span>
            </p>
            <span className="intro-note">
              I’m drawn to the details that make software clear, useful, and
              dependable.
            </span>
          </div>
        </section>
        <section id="about" className="section wrap">
          <div className="section-heading">
            <span className="eyebrow">01 / A LITTLE ABOUT ME</span>
            <span className="section-code">[ WHO I AM ]</span>
          </div>
          <div className="about-grid">
            <h2>
              Curious by nature.
              <br />
              <span>Engineer by practice.</span>
            </h2>
            <div className="about-content">
              <p>{profile.intro}</p>
              <p>
                My path into full-stack development started with a simple
                curiosity about what happens behind a screen. Now I’m building
                projects that bring interfaces, APIs, and databases together,
                while sharpening my foundations in C++ and data structures.
              </p>
              <p>
                I’m working toward becoming a thoughtful software engineer:
                someone who can reason about a problem, choose a sensible
                approach, and keep learning as the system grows.
              </p>
              <a
                className="text-link"
                href="#journey"
                onClick={(e) => {
                  e.preventDefault();
                  go("journey");
                }}
              >
                A bit more about my journey <ArrowRight size={15} />
              </a>
            </div>
          </div>
          <div className="about-facts">
            <div>
              <span>01</span>
              <b>Think in systems</b>
              <small>Connect UI, APIs, and data</small>
            </div>
            <div>
              <span>02</span>
              <b>Learn by making</b>
              <small>Projects over hypotheticals</small>
            </div>
            <div>
              <span>03</span>
              <b>Stay curious</b>
              <small>There’s always more to understand</small>
            </div>
          </div>
        </section>
        <section id="skills" className="section skills-section">
          <div className="wrap">
            <div className="section-heading">
              <span className="eyebrow">02 / TOOLS OF THE TRADE</span>
              <span className="section-code">[ ALWAYS LEARNING ]</span>
            </div>
            <div className="section-title-row">
              <h2>
                A growing <em>toolkit.</em>
              </h2>
              <p>
                No inflated scores. Just an honest snapshot of what I use, know,
                and am learning.
              </p>
            </div>
            <div className="skill-controls">
              <div
                className="filter-tabs"
                role="group"
                aria-label="Filter skills by category"
              >
                {cats.map((c) => (
                  <button
                    key={c}
                    className={filter === c ? "selected" : ""}
                    onClick={() => setFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                className="skill-search"
                aria-label="Search technologies"
                placeholder="Find a tool…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="skill-grid">
              {filteredSkills.map((s, i) => (
                <a
                  className="skill-card"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  key={s.name}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <div className="skill-card-top">
                    <span className="skill-monogram">
                      {s.name.slice(0, 2).toUpperCase()}
                    </span>
                    <ExternalLink size={13} />
                  </div>
                  <b>{s.name}</b>
                  <small>
                    {s.category} <span>·</span> {s.level}
                  </small>
                  <p>{s.note}</p>
                </a>
              ))}
            </div>
            {!filteredSkills.length && (
              <p className="empty-state">No tools found. Try another search.</p>
            )}
            <div className="skill-legend">
              <span>
                <i className="legend-dot regular" /> Regularly used
              </span>
              <span>
                <i className="legend-dot familiar" /> Familiar
              </span>
              <span>
                <i className="legend-dot learning" /> Learning
              </span>
            </div>
          </div>
        </section>
        <section id="work" className="section wrap">
          <div className="section-heading">
            <span className="eyebrow">03 / SELECTED WORK</span>
            <span className="section-code">[ BUILDING IN PUBLIC ]</span>
          </div>
          <div className="section-title-row">
            <h2>
              Projects with <em>purpose.</em>
            </h2>
            <p>
              A couple of ideas exploring how software can help people and make
              everyday processes clearer.
            </p>
          </div>
          <div className="projects-list">
            {projects.map((p, i) => (
              <article className={`project-row ${p.accent}`} key={p.id}>
                <div
                  className="project-art"
                  onClick={() => setSelected(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(p)}
                  aria-label={`View ${p.name} details`}
                >
                  <div className="project-art-top">
                    <span>{String(i + 1).padStart(2, "0")} / PROJECT</span>
                    <span>↗</span>
                  </div>
                  <div className="project-art-graphic">
                    <span className="graphic-circle circle-a" />
                    <span className="graphic-circle circle-b" />
                    <div className="graphic-window">
                      <div className="window-bar">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="window-content">
                        <span />
                        <span />
                        <span />
                        <b>
                          {p.id === "campus-connect"
                            ? "campus / together"
                            : "warranty / workspace"}
                        </b>
                      </div>
                    </div>
                    <span className="graphic-tag">
                      {p.id === "campus-connect" ? "community" : "claims"}
                    </span>
                  </div>
                  <div className="project-art-bottom">
                    <span>{p.stack.slice(0, 3).join(" · ")}</span>
                    <span>VIEW CASE ↗</span>
                  </div>
                </div>
                <div className="project-info">
                  <span className="eyebrow">{p.eyebrow}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="project-tags">
                    {p.stack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <button className="text-link" onClick={() => setSelected(p)}>
                    Explore project <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="future-note">
            <span className="future-icon">＋</span>
            <div>
              <b>More in the making</b>
              <p>
                Hackathons, experiments, and new ideas will find a home here as
                they take shape.
              </p>
            </div>
            <span className="future-index">02 / ∞</span>
          </div>
        </section>
        <section className="section console-section">
          <div className="wrap">
            <div className="section-heading">
              <span className="eyebrow">04 / TAKE A CLOSER LOOK</span>
              <span className="section-code">[ INTERACTIVE MODE ]</span>
            </div>
            <div className="section-title-row">
              <h2>
                Curious? <em>Ask the console.</em>
              </h2>
              <p>
                A tiny, safe terminal with a few shortcuts to the things you
                might want to know.
              </p>
            </div>
            <div className="terminal">
              <div className="terminal-bar">
                <div className="terminal-controls">
                  <i />
                  <i />
                  <i />
                </div>
                <span>
                  <Terminal size={13} /> dhairya.dev — console
                </span>
                <button
                  onClick={() => setHistory([])}
                  aria-label="Clear console"
                >
                  <X size={14} />
                </button>
              </div>
              <div
                className="terminal-body"
                onClick={() =>
                  document.getElementById("terminal-input")?.focus()
                }
              >
                {history.map((line, i) => (
                  <div
                    className={
                      line.startsWith("›")
                        ? "terminal-command"
                        : "terminal-output"
                    }
                    key={i}
                  >
                    {line}
                  </div>
                ))}
                <div className="terminal-prompt">
                  <span>❯</span>
                  <input
                    id="terminal-input"
                    aria-label="Enter a console command"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && run()}
                    placeholder="type a command…"
                  />
                  <button onClick={() => run()} aria-label="Run command">
                    <CornerDownLeft size={15} />
                  </button>
                </div>
              </div>
              <div className="terminal-footer">
                <span>SAFE FRONTEND SIMULATION</span>
                <span>
                  try <button onClick={() => run("help")}>help</button> to get
                  started
                </span>
              </div>
            </div>
            <div className="command-chips">
              {[
                "about",
                "skills",
                "projects",
                "education",
                "contact",
                "clear",
              ].map((c) => (
                <button key={c} onClick={() => run(c)}>
                  {c}
                  <ArrowUpRight size={11} />
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="section wrap journey-section" id="journey">
          <div className="section-heading">
            <span className="eyebrow">05 / THE LONG GAME</span>
            <span className="section-code">[ LEARNING IN PROGRESS ]</span>
          </div>
          <div className="journey-grid">
            <div>
              <h2>
                Foundations first.
                <br />
                <em>Then keep going.</em>
              </h2>
              <p className="journey-copy">
                My journey is still unfolding. Right now, I’m focused on
                building strong computer science fundamentals and learning how
                complete applications fit together.
              </p>
              <a
                className="text-link"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("contact");
                }}
              >
                Say hello <ArrowRight size={15} />
              </a>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-dot filled" />
                <div>
                  <span className="timeline-meta">EDUCATION · IN PROGRESS</span>
                  <h3>{profile.education}</h3>
                  <p>
                    {profile.college}
                    <br />
                    {profile.university}
                  </p>
                </div>
                <ChevronDown size={16} />
              </div>
              <div className="timeline-item">
                <span className="timeline-dot" />
                <div>
                  <span className="timeline-meta">FOCUS · CURRENT</span>
                  <h3>Full-stack foundations</h3>
                  <p>
                    Exploring frontend development, backend engineering, and
                    relational data systems through hands-on project work.
                  </p>
                </div>
                <ChevronDown size={16} />
              </div>
              <div className="timeline-item">
                <span className="timeline-dot" />
                <div>
                  <span className="timeline-meta">ALWAYS ON</span>
                  <h3>Problem solving with C++</h3>
                  <p>
                    Practicing how to break down problems and reason about data
                    structures and algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="dsa-band">
          <div className="wrap dsa-inner">
            <div>
              <span className="eyebrow">SIDE QUEST / DSA</span>
              <h2>
                Better questions.
                <br />
                <em>Better solutions.</em>
              </h2>
            </div>
            <div className="dsa-copy">
              <p>
                I enjoy the small satisfaction of finding a clean path through a
                tricky problem. Arrays, strings, binary search, stacks, and
                trees are all part of the ongoing practice.
              </p>
              {profile.leetcode ? (
                <a
                  className="text-link"
                  href={profile.leetcode}
                  target="_blank"
                  rel="noreferrer"
                >
                  Find me on LeetCode <ArrowUpRight size={15} />
                </a>
              ) : (
                <span className="muted-note">
                  Coding profile link can be added in config.
                </span>
              )}
            </div>
            <div className="dsa-mark">
              {["{", "…", "}"].map((x, i) => (
                <span key={i}>{x}</span>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="section wrap contact-section">
          <div className="section-heading">
            <span className="eyebrow">06 / YOUR TURN</span>
            <span className="section-code">[ INBOX OPEN ]</span>
          </div>
          <div className="contact-grid">
            <div>
              <h2>
                Have a good
                <br />
                <em>problem?</em>
              </h2>
              <p>
                I’d love to hear what you’re working on, share notes, or talk
                about building something thoughtful.
              </p>
              <div className="contact-details">
                {profile.email ? (
                  <a href={`mailto:${profile.email}`}>
                    <Mail size={16} />
                    {profile.email}
                    <ArrowUpRight size={13} />
                  </a>
                ) : (
                  <span>
                    <Mail size={16} />
                    Email address coming soon
                  </span>
                )}
              </div>
              <div className="contact-socials">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    <Github size={16} /> GitHub <ArrowUpRight size={12} />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} />
                  </a>
                )}
              </div>
            </div>
            <form
              ref={formRef}
              className="contact-form"
              onSubmit={submitContact}
            >
              <div className="form-row">
                <label>
                  Your name
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="What should I call you?"
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    required
                    type="email"
                    maxLength={254}
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label>
                Subject
                <input
                  name="subject"
                  required
                  minLength={3}
                  maxLength={150}
                  placeholder="What’s this about?"
                />
              </label>
              <label>
                Your message
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={4}
                  placeholder="A little context goes a long way…"
                />
              </label>
              <label className="honeypot" aria-hidden="true">
                Leave this field empty
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <div className="form-submit">
                <button
                  className="button button-primary"
                  disabled={formState === "sending"}
                >
                  {formState === "sending" ? "Sending…" : "Send message"}{" "}
                  <ArrowUpRight size={16} />
                </button>
                <span>Powered by a real API. No bots, please.</span>
              </div>
              {formState === "success" && (
                <p className="form-feedback success">
                  <Check size={15} /> Message sent. Thanks for reaching out.
                </p>
              )}
              {formState === "error" && (
                <p className="form-feedback error" role="alert">
                  {formError}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap footer-main">
          <a
            className="brand"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("top");
            }}
          >
            <span className="brand-mark">d.</span>
            <span>
              dhairya<span className="brand-dot">/</span>dev
            </span>
          </a>
          <p>Curiosity, compiled into practice.</p>
          <div className="footer-links">
            {nav.map((n) => (
              <a
                href={`#${n.id}`}
                key={n.id}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.id);
                }}
              >
                {n.label}
              </a>
            ))}
          </div>
          <button className="back-top" onClick={() => go("top")}>
            Back to top ↑
          </button>
        </div>
        <div className="wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>
            DESIGNED & BUILT WITH CURIOSITY{" "}
            <span className="footer-spark">✳</span>
          </span>
        </div>
      </footer>
      {palette && (
        <div
          className="overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setPalette(false)}
        >
          <div
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="palette-search">
              <Command size={17} />
              <input
                ref={inputRef}
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Where would you like to go?"
              />
              <kbd>ESC</kbd>
              <button
                onClick={() => setPalette(false)}
                aria-label="Close palette"
              >
                <X size={16} />
              </button>
            </div>
            <div className="palette-label">QUICK ACTIONS</div>
            <div className="palette-items">
              {paletteActions.map((a, i) => (
                <button key={i} onClick={a.action}>
                  {a.label}
                  <ArrowUpRight size={14} />
                </button>
              ))}
              {!paletteActions.length && <p>No matching actions.</p>}
            </div>
            <div className="palette-hint">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
      {selected && (
        <div
          className="overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} project details`}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close project details"
            >
              <X size={19} />
            </button>
            <span className="eyebrow">{selected.eyebrow}</span>
            <h2>{selected.name}</h2>
            <p className="modal-lede">{selected.description}</p>
            <div className="modal-content-grid">
              <div>
                <h4>THE PROBLEM</h4>
                <p>{selected.problem}</p>
                <h4>MY CONTRIBUTION</h4>
                <p>{selected.contribution}</p>
                <h4>ENGINEERING NOTE</h4>
                <p>{selected.challenge}</p>
              </div>
              <div>
                <h4>FEATURE AREAS</h4>
                <ul>
                  {selected.features.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <h4>WHAT I LEARNED</h4>
                <p>{selected.learned}</p>
                <h4>NEXT UP</h4>
                <p>{selected.next}</p>
              </div>
            </div>
            <div className="modal-stack">
              {selected.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <div className="modal-links">
              {selected.repo ? (
                <a href={selected.repo} target="_blank" rel="noreferrer">
                  Repository <Github size={15} />
                </a>
              ) : (
                <span>Repository link to be added</span>
              )}
              {selected.live ? (
                <a href={selected.live} target="_blank" rel="noreferrer">
                  Live project <ExternalLink size={15} />
                </a>
              ) : (
                <span>Live demo to be added</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default App;
