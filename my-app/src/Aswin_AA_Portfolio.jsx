import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import {aswin} from "../src/images";

const PHOTO_SRC = "aswin"
const COLORS = {
  bg: "#10161A",
  bgPanel: "#161F24",
  bgPanel2: "#1B262C",
  text: "#EDEFEC",
  textDim: "#8FA1A3",
  textFaint: "#5E6E70",
  teal: "#4FD1C5",
  amber: "#F2A65A",
  border: "rgba(237,239,236,0.08)",
  borderStrong: "rgba(237,239,236,0.16)",
};

const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const TERM_LINES = [
  { type: "cmd", prompt: "aswin", text: "whoami" },
  { type: "out", html: 'aswin_aa — <b>full-stack developer</b>, madurai, in' },
  { type: "cmd", prompt: "aswin", text: "cat role.txt" },
  { type: "out", html: 'currently building @ <b>Pukal Technologies</b> (Pukal Foods Pvt. Ltd)' },
  { type: "out", html: 'project: <b>reports.erpsmt.in</b> — live ERP reporting system' },
  { type: "cmd", prompt: "aswin", text: "stack --list" },
  { type: "out", html: "frontend  : html, css, bootstrap, javascript, jquery" },
  { type: "out", html: "backend   : core php, node.js, express.js" },
  { type: "out", html: "database  : mysql, mongodb" },
  { type: "out", html: "stack     : <b>MERN</b> (react, express, node, mongo)" },
  { type: "cmd", prompt: "aswin", text: "status" },
  { type: "out", html: "<b>online</b> — open to new opportunities" },
];

function GridBackdrop() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(79,209,197,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(79,209,197,0.035) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
        zIndex: 0,
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
      }}
    />
  );
}

function Terminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef(null);
  const lineIndexRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    function runLine() {
      if (cancelled) return;
      const idx = lineIndexRef.current;
      if (idx >= TERM_LINES.length) {
        setDone(true);
        return;
      }
      const line = TERM_LINES[idx];

      if (line.type === "cmd") {
        let i = 0;
        setTypingText("");
        const iv = setInterval(() => {
          if (cancelled) {
            clearInterval(iv);
            return;
          }
          i++;
          setTypingText(line.text.slice(0, i));
          if (i >= line.text.length) {
            clearInterval(iv);
            setTimeout(() => {
              setVisibleLines((prev) => [...prev, line]);
              setTypingText("");
              lineIndexRef.current++;
              runLine();
            }, 180);
          }
        }, 28);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          setVisibleLines((prev) => [...prev, line]);
          lineIndexRef.current++;
          runLine();
        }, 220);
      }
    }
    runLine();
    return () => {
      cancelled = true;
    };
  }, [started]);

  return (
    <div
      ref={containerRef}
      style={{
        background: COLORS.bgPanel,
        border: `1px solid ${COLORS.borderStrong}`,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 20px 50px -25px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: COLORS.bgPanel2,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E5695A" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E5B95A" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#5AE0A6" }} />
        <span style={{ marginLeft: 8, fontFamily: FONT_MONO, fontSize: 12, color: COLORS.textFaint }}>
          aswin — zsh
        </span>
      </div>
      <div
        style={{
          padding: "24px 26px 30px",
          fontFamily: FONT_MONO,
          fontSize: 13.5,
          color: COLORS.textDim,
          minHeight: 260,
        }}
      >
        {visibleLines.map((line, i) =>
          line.type === "cmd" ? (
            <div key={i} style={{ marginBottom: 6 }}>
              <span style={{ color: COLORS.teal }}>{line.prompt} $ </span>
              <span style={{ color: COLORS.text }}>{line.text}</span>
            </div>
          ) : (
            <div
              key={i}
              style={{ marginBottom: 6 }}
              dangerouslySetInnerHTML={{
                __html: line.html.replace(
                  /<b>/g,
                  `<b style="color:${COLORS.amber};font-weight:600">`
                ),
              }}
            />
          )
        )}
        {typingText !== "" && (
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: COLORS.teal }}>
              {TERM_LINES[lineIndexRef.current]?.prompt} ${" "}
            </span>
            <span style={{ color: COLORS.text }}>{typingText}</span>
          </div>
        )}
        {done && (
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 14,
              background: COLORS.teal,
              animation: "blink 1s step-end infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

function SectionHead({ num, title }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 36 }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: COLORS.amber }}>{num}</span>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "1.6rem", letterSpacing: "-0.01em", color: COLORS.text }}>
        {title}
      </span>
    </div>
  );
}

export default function Portfolio() {
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverGhost, setHoverGhost] = useState(false);
  const [hoverLink, setHoverLink] = useState(false);

  const skills = [
    { k: "Front-End", v: "HTML, CSS, Bootstrap, JavaScript, jQuery" },
    { k: "Back-End", v: "Core PHP, Node.js, Express.js" },
    { k: "Database", v: "MySQL, MongoDB" },
    { k: "MERN", v: "React.js, Express.js, Node.js, MongoDB" },
  ];

  const summary = [
    "Comfortable diagnosing and debugging issues across the full stack, from UI to database.",
    "Skilled in responsive design — HTML, CSS, Bootstrap, and media queries for any screen size.",
    "Adapts quickly to shifting requirements and new client specs without losing momentum.",
    "Strong communicator, used to translating client needs into working features.",
    "Fluent in Tamil and English — speaking, reading, and writing.",
    "Based in Madurai, Tamil Nadu, open to remote and on-site roles.",
  ];

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: FONT_BODY,
        lineHeight: 1.6,
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        html { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }
      `}</style>
      <GridBackdrop />

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>

        {/* NAV */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(16,22,26,0.85)",
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${COLORS.border}`,
            margin: "0 -28px",
            padding: "0 28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: COLORS.teal }}>
              aswin<span style={{ color: COLORS.textFaint }}>.dev</span>
            </div>
            <div style={{ display: "flex", gap: 28, fontFamily: FONT_MONO, fontSize: 13, color: COLORS.textDim }} className="hidden sm:flex">
              <a href="#work">experience</a>
              <a href="#stack">stack</a>
              <a href="#about">about</a>
              <a href="#contact">contact</a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <header style={{ padding: "88px 0 64px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 56,
              alignItems: "center",
            }}
            className="hero-grid"
          >
            <div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  color: COLORS.amber,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                <span style={{ color: COLORS.teal, animation: "pulse 2s infinite" }}>●</span>
                available for new opportunities
              </div>
              <h1
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: "clamp(2.4rem,5.2vw,3.6rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  marginBottom: 18,
                }}
              >
                Aswin A A<br />
                builds full-stack<br />
                products <span style={{ color: COLORS.teal }}>that ship.</span>
              </h1>
              <div style={{ fontFamily: FONT_MONO, fontSize: 15, color: COLORS.textDim, marginBottom: 24 }}>
                Full-Stack Developer <span style={{ color: COLORS.amber }}>//</span> MERN &amp; PHP{" "}
                <span style={{ color: COLORS.amber }}>//</span> Madurai, India
              </div>
              <p style={{ fontSize: 16, color: COLORS.textDim, maxWidth: 480, marginBottom: 32 }}>
                I turn business requirements into working software — from responsive front-ends
                to the databases and APIs running underneath. Currently building ERP tooling in
                production.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a
                  href="#work"
                  onMouseEnter={() => setHoverPrimary(true)}
                  onMouseLeave={() => setHoverPrimary(false)}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 13,
                    padding: "12px 20px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.teal}`,
                    background: hoverPrimary ? "#6EE0D5" : COLORS.teal,
                    color: "#0B1315",
                    fontWeight: 600,
                    transition: "all .2s",
                  }}
                >
                  See my work
                </a>
                <a
                  href="mailto:aswinarumugam002@gmail.com"
                  onMouseEnter={() => setHoverGhost(true)}
                  onMouseLeave={() => setHoverGhost(false)}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 13,
                    padding: "12px 20px",
                    borderRadius: 6,
                    border: `1px solid ${hoverGhost ? COLORS.teal : COLORS.borderStrong}`,
                    color: hoverGhost ? COLORS.teal : COLORS.text,
                    transition: "all .2s",
                  }}
                >
                  Get in touch
                </a>
              </div>
            </div>

            <div style={{ position: "relative", justifySelf: "center" }}>
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: -14,
                  background: COLORS.bgPanel,
                  border: `1px solid ${COLORS.borderStrong}`,
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  color: COLORS.teal,
                  padding: "5px 10px",
                  borderRadius: 4,
                  zIndex: 2,
                }}
              >
                // AAA //
              </div>
              <img
                src={PHOTO_SRC}
                alt="Aswin A A"
                style={{
                  width: 280,
                  height: 340,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.borderStrong}`,
                  filter: "grayscale(15%) contrast(1.03)",
                  boxShadow: `0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 6px ${COLORS.bg}, 0 0 0 7px ${COLORS.borderStrong}`,
                }}
              />
            </div>
          </div>
        </header>

        {/* EXPERIENCE */}
        <section id="work" style={{ padding: "64px 0", borderTop: `1px solid ${COLORS.border}` }}>
          <SectionHead num="01" title="Experience" />
          <div
            style={{
              background: COLORS.bgPanel,
              border: `1px solid ${COLORS.borderStrong}`,
              borderRadius: 10,
              padding: "30px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 20,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "1.25rem" }}>
                  Full-Stack Developer
                </div>
                <div style={{ color: COLORS.teal, fontFamily: FONT_MONO, fontSize: 13, marginTop: 4 }}>
                  Pukal Technologies — Pukal Foods Pvt. Ltd, Madurai
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  color: COLORS.textFaint,
                  border: `1px solid ${COLORS.borderStrong}`,
                  padding: "6px 12px",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                }}
              >
                Jul 2025 — Present
              </div>
            </div>
            <p style={{ color: COLORS.textDim, fontSize: 14.5, maxWidth: 640, marginBottom: 18 }}>
              Building and maintaining an ERP reporting platform end-to-end — front-end
              interfaces, back-end logic and the database layer that powers day-to-day
              reporting for the business.
            </p>
            <a
              href="https://reports.erpsmt.in/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoverLink(true)}
              onMouseLeave={() => setHoverLink(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT_MONO,
                fontSize: 13,
                color: COLORS.amber,
                border: `1px solid ${hoverLink ? COLORS.amber : COLORS.borderStrong}`,
                background: hoverLink ? "rgba(242,166,90,0.08)" : "transparent",
                padding: "9px 16px",
                borderRadius: 6,
                transition: "all .2s",
              }}
            >
              <ExternalLink size={13} />
              View live project — reports.erpsmt.in
            </a>
          </div>
        </section>

        {/* STACK TERMINAL */}
        <section id="stack" style={{ padding: "64px 0", borderTop: `1px solid ${COLORS.border}` }}>
          <SectionHead num="02" title="Stack" />
          <Terminal />
        </section>

        {/* SKILLS GRID */}
        <section style={{ padding: "64px 0", borderTop: `1px solid ${COLORS.border}` }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              background: COLORS.border,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
            className="skills-grid"
          >
            {skills.map((s) => (
              <div key={s.k} style={{ background: COLORS.bgPanel, padding: "24px 20px" }}>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: COLORS.amber,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 10,
                  }}
                >
                  {s.k}
                </div>
                <div style={{ fontSize: 14.5, color: COLORS.text, lineHeight: 1.5 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: "64px 0", borderTop: `1px solid ${COLORS.border}` }}>
          <SectionHead num="03" title="About" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px 32px",
            }}
            className="summary-list"
          >
            {summary.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, fontSize: 14.5, color: COLORS.textDim }}>
                <span style={{ color: COLORS.teal, fontFamily: FONT_MONO, flexShrink: 0 }}>→</span>
                {s}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER / CONTACT */}
        <footer id="contact" style={{ padding: "70px 0 50px", borderTop: `1px solid ${COLORS.border}` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 30,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem,4vw,2.6rem)",
                  marginBottom: 10,
                }}
              >
                Let's build<br />
                something <span style={{ color: COLORS.teal }}>solid.</span>
              </div>
              <p style={{ color: COLORS.textDim, fontSize: 14.5, maxWidth: 420 }}>
                Open to full-stack roles and freelance projects. Reach out any time.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: FONT_MONO, fontSize: 13.5 }}>
              <a href="mailto:aswinarumugam002@gmail.com" style={{ color: COLORS.textDim, display: "flex", alignItems: "center", gap: 10 }}>
                <Mail size={14} /> aswinarumugam002@gmail.com
              </a>
              <a href="tel:+919384799034" style={{ color: COLORS.textDim, display: "flex", alignItems: "center", gap: 10 }}>
                <Phone size={14} /> +91 93847 99034
              </a>
              <div style={{ color: COLORS.textDim, display: "flex", alignItems: "center", gap: 10 }}>
                <MapPin size={14} /> Madurai, Tamil Nadu, India
              </div>
            </div>
          </div>
          <div style={{ marginTop: 50, fontFamily: FONT_MONO, fontSize: 11.5, color: COLORS.textFaint, textAlign: "center" }}>
            © 2026 Aswin A A — Full-Stack Developer
          </div>
        </footer>
      </div>
    </div>
  );
}
