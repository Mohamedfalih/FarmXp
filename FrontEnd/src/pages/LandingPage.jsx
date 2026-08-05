import { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";


const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Government Schemes", href: "#benefits" },
  { label: "Modules", href: "#modules" },
  { label: "About", href: "#testimonials" },
  { label: "Contact", href: "#faq" },
];

const features = [
  { icon: "🌱", bg: "#E4F1D8", title: "Sustainable Farming", desc: "Practices that protect soil & water" },
  { icon: "🤖", bg: "#F8E1D6", title: "AI Farming Assistant", desc: "Ask questions, get instant guidance" },
  { icon: "📚", bg: "#FCEDD3", title: "Learning Modules", desc: "Bite-sized, practical lessons" },
  { icon: "🏆", bg: "#DFF0F2", title: "XP Rewards & Badges", desc: "Progress feels like a game" },
  { icon: "📈", bg: "#E4F1D8", title: "Sustainability Score", desc: "A clear score for your farm" },
  { icon: "📊", bg: "#FCEDD3", title: "Progress Analytics", desc: "See growth over every season" },
  { icon: "🏛️", bg: "#DFF0F2", title: "Government Schemes", desc: "Find schemes you qualify for" },
  { icon: "🛒", bg: "#F8E1D6", title: "Market Buyers", desc: "Connect with verified buyers" },
  { icon: "🔔", bg: "#E4F1D8", title: "Notifications", desc: "Never miss a deadline" },
  { icon: "📱", bg: "#DFF0F2", title: "Mobile Friendly", desc: "Works anywhere on the farm" },
];

const steps = [
  { num: 1, title: "Create your account", desc: "Set up your farmer profile in minutes" },
  { num: 2, title: "Complete learning modules", desc: "Practical, easy-to-follow lessons" },
  { num: 3, title: "Earn XP & improve your score", desc: "Track badges and sustainability gains" },
  { num: 4, title: "Connect with schemes & buyers", desc: "Unlock government and market opportunities" },
];

const benefits = [
  {
    key: "farmer",
    className: "farmer",
    title: "🌾 Farmer Benefits",
    items: ["Learn modern farming techniques", "Reduce chemical usage", "Improve water management", "Increase productivity"],
  },
  {
    key: "gov",
    className: "gov",
    title: "🏛️ Government Benefits",
    items: ["Monitor sustainable adoption", "Promote sustainable agriculture", "Better outreach to farmers"],
  },
  {
    key: "buyer",
    className: "buyer",
    title: "🛒 Market Buyer Benefits",
    items: ["Discover verified sustainable farmers", "Transparent sustainability score"],
  },
];

const modules = [
  { icon: "🏠", bg: "#E4F1D8", title: "Dashboard" },
  { icon: "🤖", bg: "#F8E1D6", title: "AI Assistant" },
  { icon: "📚", bg: "#FCEDD3", title: "Learning Modules" },
  { icon: "🎮", bg: "#DFF0F2", title: "Quiz" },
  { icon: "📈", bg: "#E4F1D8", title: "Progress" },
  { icon: "🏆", bg: "#FCEDD3", title: "Leaderboard" },
  { icon: "🧪", bg: "#DFF0F2", title: "Certified Practices" },
  { icon: "💧", bg: "#E4F1D8", title: "Sustainability Metrics" },
  { icon: "🏛️", bg: "#F8E1D6", title: "Government Schemes" },
  { icon: "🛒", bg: "#FCEDD3", title: "Market Buyers" },
  { icon: "🔔", bg: "#DFF0F2", title: "Notifications" },
  { icon: "⚙️", bg: "#E4F1D8", title: "Settings" },
];

const stats = [
  { value: "10,000+", label: "FARMERS LEARNING" },
  { value: "500+", label: "LEARNING MODULES" },
  { value: "100+", label: "GOVERNMENT SCHEMES" },
  { value: "95%", label: "FARMER SATISFACTION" },
];

const testimonials = [
  {
    quote: "FarmXP helped me switch to drip irrigation and I finally understand my sustainability score.",
    name: "Mohamed Farooq",
    role: "Farmer, Coimbatore",
    avatarBg: "#6FA83A",
    initials: "MF",
  },
  {
    quote: "We can finally see which farmers are adopting sustainable practices across our district.",
    name: "Radha Sundaram",
    role: "Government Officer",
    avatarBg: "#3E8FA0",
    initials: "RS",
  },
  {
    quote: "The sustainability score gives us real confidence when sourcing from new farmers.",
    name: "Arjun Kumar",
    role: "Organic Buyer",
    avatarBg: "#C1552E",
    initials: "AK",
  },
];

const faqs = [
  { q: "What is FarmXP?", a: "FarmXP is a gamified learning platform that helps farmers adopt sustainable practices through interactive modules, AI guidance, and rewards." },
  { q: "How does XP work?", a: "You earn XP by completing learning modules, quizzes, and logging certified sustainable practices on your farm." },
  { q: "How do sustainability scores help?", a: "Your score reflects water, soil, pest, and crop-diversity practices — and helps buyers and schemes identify verified sustainable farmers." },
  { q: "Can I access government schemes?", a: "Yes, FarmXP recommends schemes you're eligible for based on your crop, region, and sustainability progress." },
  { q: "Is the AI assistant available in local languages?", a: "The AI Farming Assistant is designed to support regional languages so farmers can ask questions comfortably." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing">
      {/* ---------- HEADER ---------- */}
      <header>
        <nav className="nav">
          <a href="#" className="logo">
            <span className="mark">🌾</span>
            <span className="word">FarmXP</span>
          </a>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link to="/login" className="btn btn-outline btn-sm">
              Sign In
            </Link>

            <Link to="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
            <button
              className="nav-toggle-label"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="hero">
        <span className="hero-deco d1">🍃</span>
        <span className="hero-deco d2">💧</span>
        <span className="hero-deco d3">🌱</span>
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">🌱 Gamified Sustainable Farming</div>
            <h1>
              Learn Sustainable Farming. <span className="accent">Earn Rewards.</span> Grow Smarter.
            </h1>
            <p>
              FarmXP is an AI-powered gamified learning platform that helps farmers adopt sustainable farming
              practices through interactive learning modules, AI guidance, XP rewards, sustainability tracking,
              government scheme discovery, and direct market opportunities.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <a href="#features" className="btn btn-outline">
                Explore Features
              </a>
            </div>
          </div>

          <div className="mock-wrap">
            <div className="laptop">
              <div className="laptop-screen">
                <div className="laptop-topbar">
                  <span className="laptop-title">Good Morning, Mohamed 🌱</span>
                  <div className="mini-ring"></div>
                </div>
                <div className="mini-stats">
                  <div className="mini-stat">
                    <b>2,480</b>
                    <span>TOTAL XP</span>
                  </div>
                  <div className="mini-stat">
                    <b>72</b>
                    <span>SUSTAIN.</span>
                  </div>
                  <div className="mini-stat">
                    <b>9</b>
                    <span>PRACTICES</span>
                  </div>
                </div>
                <div className="mini-bar">
                  <i></i>
                </div>
                <div className="mini-row">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
            <div className="phone">
              <div className="phone-screen">
                <div className="phone-dot"></div>
                <div className="phone-line w60" style={{ margin: "0 auto 10px" }}></div>
                <div className="phone-card"></div>
                <div className="phone-card"></div>
                <div className="phone-line w80"></div>
                <div className="phone-line w60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHY FARMXP ---------- */}
      <section className="why" id="features">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Why FarmXP</div>
            <h2>Everything a farmer needs, in one place</h2>
            <p>A complete toolkit for learning, tracking, and growing — built around real farming outcomes.</p>
          </div>
          <div className="feat-grid">
            {features.map((f) => (
              <div className="feat-card" key={f.title}>
                <div className="feat-icon" style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="how" id="how">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">How It Works</div>
            <h2>From sign-up to real market access</h2>
            <p>Four simple steps take you from your first login to selling as a certified sustainable farmer.</p>
          </div>
          <div className="timeline">
            {steps.map((s) => (
              <div className="tl-step" key={s.num}>
                <div className="tl-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BENEFITS ---------- */}
      <section className="benefits" id="benefits">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Project Benefits</div>
            <h2>Built for every stakeholder</h2>
          </div>
          <div className="ben-grid">
            {benefits.map((b) => (
              <div className={`ben-card ${b.className}`} key={b.key}>
                <h3>{b.title}</h3>
                <ul>
                  {b.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- MODULES ---------- */}
      <section className="modules" id="modules">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Project Modules</div>
            <h2>Explore the full FarmXP platform</h2>
          </div>
          <div className="mod-grid">
            {modules.map((m) => (
              <div className="mod-card" key={m.title}>
                <div className="mod-icon" style={{ background: m.bg }}>
                  {m.icon}
                </div>
                <h4>{m.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="stats">
        <div className="wrap">
          <div className="stats-grid">
            {stats.map((s) => (
              <div className="stat-box" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="testi" id="testimonials">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Testimonials</div>
            <h2>Trusted by farmers, officials &amp; buyers</h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t) => (
              <div className="testi-card" key={t.name}>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-person">
                  <div className="testi-avatar" style={{ background: t.avatarBg }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">FAQ</div>
            <h2>Common questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta">
        <div className="wrap">
          <h2>Start Your Sustainable Farming Journey Today</h2>
          <p>Join thousands of farmers already learning, earning, and growing with FarmXP.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-light">
              Create Free Account
            </Link>

            <Link to="/login" className="btn btn-light-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-logo">
                <span className="mark">🌾</span>
                <span className="word">FarmXP</span>
              </div>
              <p style={{ fontSize: "13px", color: "#A8BBA1", maxWidth: "260px" }}>
                Gamified platform to promote sustainable farming practices.
              </p>
              <div className="foot-social">
                <span>𝕏</span>
                <span>in</span>
                <span>f</span>
                <span>ig</span>
              </div>
            </div>
            <div className="foot-col">
              <h5>Quick Links</h5>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how">How It Works</a></li>
                <li><a href="#modules">Modules</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Platform</h5>
              <ul>
                <li><a href="#benefits">Government Schemes</a></li>
                <li><a href="#modules">Market Buyers</a></li>
                <li><a href="#testimonials">About</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Contact</h5>
              <ul>
                <li>hello@farmxp.in</li>
                <li>+91 98765 43210</li>
                <li>Coimbatore, Tamil Nadu</li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">© 2026 FarmXP. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}