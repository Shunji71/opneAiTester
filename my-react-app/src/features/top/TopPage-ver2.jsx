import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin once at module scope
gsap.registerPlugin(ScrollTrigger);

/**
 * Advanced GSAP × ScrollTrigger demo (Pure JS version for .jsx)
 * - Top progress bar that reflects total scroll progress
 * - Hero with split-text reveal
 * - Parallax scene pinned & scrubbed
 * - Horizontal gallery with snap + subtle 3D transforms
 * - SVG line drawing on enter
 * - Number counters that animate once when visible
 * - Responsive behavior via matchMedia
 */
export default function TopPage2() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // === 0) Global scroll progress bar ===
      const progressEl = document.querySelector(".progress");
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (progressEl) progressEl.style.transform = `scaleX(${self.progress})`;
        },
      });

      // === 1) Split-text headline reveal ===
      const splitEls = gsap.utils.toArray(".split");
      splitEls.forEach((el) => {
        const text = el.textContent || "";
        el.setAttribute("data-original", text);
        el.innerHTML = text
          .split("")
          .map((ch) => `<span class="ch">${ch === " " ? "&nbsp;" : ch}</span>`)
          .join("");
        const chars = el.querySelectorAll(".ch");
        gsap.from(chars, {
          opacity: 0,
          yPercent: 50,
          rotateX: -40,
          transformOrigin: "50% 100%",
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        });
      });

      // === 2) Fade-ups for generic content blocks ===
      gsap.utils.toArray(".fadeup").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // === 3) Pinned parallax scene ===
      const parallax = {
        trigger: ".parallax",
        start: "top top",
        end: () => "+=" + window.innerHeight * 1.5,
        scrub: 0.6,
        pin: true,
      };
      gsap.to(".layer.back", { yPercent: 20, scrollTrigger: parallax });
      gsap.to(".layer.mid", { yPercent: 40, scrollTrigger: parallax });
      gsap.to(".layer.front", { yPercent: 60, scrollTrigger: parallax });

      // === 4) Horizontal gallery with snap and subtle 3D ===
      const cards = gsap.utils.toArray(".hcard");
      const sections = cards.length || 1;
      const hst = ScrollTrigger.create({
        trigger: ".hpin",
        start: "top top",
        end: () => "+=" + window.innerWidth * (sections - 1),
        scrub: 0.6,
        pin: true,
        snap: sections > 1 ? { snapTo: 1 / (sections - 1), duration: 0.3, ease: "power1.inOut" } : false,
      });
      gsap.to(".htrack", {
        xPercent: -100 * (sections - 1),
        ease: "none",
        scrollTrigger: hst,
      });
      // depth / tilt as we scroll
      ScrollTrigger.create({
        trigger: ".hpin",
        start: "top top",
        end: () => "+=" + window.innerWidth * (sections - 1),
        scrub: true,
        onUpdate: (self) => {
          const pos = self.progress * (sections - 1);
          cards.forEach((card, i) => {
            const dist = Math.abs(i - pos);
            const scale = gsap.utils.clamp(0.85, 1, 1 - dist * 0.08);
            const rotY = gsap.utils.clamp(-30, 30, (i - pos) * 25);
            gsap.to(card, { scale, rotateY: rotY, duration: 0.2, ease: "power2.out" });
          });
        },
      });

      // === 5) SVG path drawing (no TS casts) ===
      gsap.utils.toArray(".draw path").forEach((path) => {
        let len = 400;
        // If it's really an SVGPathElement, use its length
        if (path && typeof path === "object" && "getTotalLength" in path && typeof path.getTotalLength === "function") {
          try { len = path.getTotalLength(); } catch (_) {}
        }
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: path.closest(".draw"), start: "top 80%", once: true },
        });
      });

      // === 6) Number counters (no TS casts) ===
      gsap.utils.toArray(".counter").forEach((el) => {
        const end = Number(el.dataset?.to || 100);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration: 1.2,
          ease: "power1.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toLocaleString();
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      // === 7) Responsive tweaks with matchMedia (no TS casts) ===
      ScrollTrigger.matchMedia({
        "(max-width: 768px)": function () {
          // soften parallax on small screens
          gsap.to([".layer.back", ".layer.mid", ".layer.front"], {
            yPercent: (i) => [10, 20, 30][i] ?? 10,
            scrollTrigger: { trigger: ".parallax", start: "top top", end: "+=100%", scrub: 0.5, pin: true },
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      {/* ========== Inline styles for easy copy-paste ========== */}
      <style>{`
        :root { --bg:#0b1020; --text:#e5e7eb; --muted:#94a3b8; --line:#334155; --glass:#0f172a; }
        html, body, #root { height: 100%; }
        body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: var(--bg); color: var(--text); }
        .progress-wrap { position: fixed; inset: 0 auto auto 0; height: 4px; width: 100%; z-index: 50; background: linear-gradient(90deg, rgba(255,255,255,0.06), transparent);} 
        .progress { transform-origin: left center; height: 100%; width: 100%; transform: scaleX(0); background: linear-gradient(90deg, #22d3ee, #60a5fa); }
        .section { min-height: 100vh; display: grid; place-items: center; padding: 6rem 1rem; box-sizing: border-box; }
        .hero { text-align:center; padding-top: 12vh; }
        .split { display:inline-block; line-height: 1.1; font-weight: 800; font-size: clamp(2rem, 7vw, 5rem); letter-spacing: 0.02em; }
        .subtitle { color: var(--muted); margin-top: 0.75rem; }
        .btn { display:inline-block; background:#22d3ee; color:#0b1020; padding:0.75rem 1rem; border-radius:12px; font-weight:600; text-decoration:none; }
        .grid { display:grid; gap:1rem; grid-template-columns: repeat(12, 1fr); width:min(1100px,92vw); }
        .card { grid-column: span 6; background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border: 1px solid var(--line); border-radius: 20px; padding: 1.25rem 1.5rem; }
        @media (max-width: 768px){ .card { grid-column: 1 / -1; } }

        /* Parallax scene */
        .parallax { position: relative; overflow: hidden; }
        .scene { position: absolute; inset: 0; perspective: 800px; }
        .layer { position:absolute; inset:0; background-position:center; background-size:cover; opacity:0.9; filter: saturate(1.1); }
        .layer.back { background-image: radial-gradient(1200px 800px at 50% -10%, #0ea5e9 0%, transparent 60%); }
        .layer.mid { background-image: radial-gradient(1200px 800px at 50% 50%, rgba(96,165,250,0.2) 0%, transparent 60%); mix-blend-mode: screen; }
        .layer.front { background-image: radial-gradient(600px 400px at 50% 110%, rgba(34,211,238,0.35) 0%, transparent 60%); }
        .parallax .label { position: relative; z-index: 2; text-align:center; font-size: clamp(1.5rem,4vw,2.5rem); }

        /* Horizontal gallery */
        .hpin { background: var(--bg); }
        .hpanel { width: min(1100px, 92vw); height: 70vh; border-radius: 24px; outline: 1px solid var(--line); overflow: hidden; display:grid; place-items:center; perspective: 1200px; }
        .htrack { width: 100%; height: 100%; display: flex; }
        .hcard { flex: 0 0 100%; display:grid; place-items:center; font-size: clamp(1.3rem, 3.6vw, 2.4rem); color: var(--text); background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border-right: 1px solid var(--line); will-change: transform; }

        /* SVG draw */
        .draw { width:min(900px, 90vw); }
        .draw svg { width:100%; height:auto; display:block; }
        .metrics { display:flex; gap:2rem; justify-content:center; margin-top:1rem; color: var(--muted); }
        .metrics .num { font-weight:800; font-size: clamp(1.5rem, 4.5vw, 3rem); color: var(--text); }
      `}</style>

      {/* Global progress bar */}
      <div className="progress-wrap"><div className="progress" /></div>

      {/* Section 1: Hero with split text */}
      <section className="section hero">
        <div>
          <h1 className="split">Scroll-Story with GSAP</h1>
          <p className="subtitle">Split text, parallax, horizontal snap, SVG draw, counters</p>
          <div style={{ marginTop: "1.25rem" }}>
            <a className="btn" href="https://greensock.com/scrolltrigger/" target="_blank" rel="noreferrer">ScrollTrigger Docs</a>
          </div>
        </div>
      </section>

      {/* Section 2: Feature cards with fade-up */}
      <section className="section">
        <div className="grid">
          <div className="card fadeup"><strong>Split-text</strong><br />characters cascade in with 3D tilt.</div>
          <div className="card fadeup"><strong>Parallax</strong><br />three layered backgrounds scrub with pin.</div>
          <div className="card fadeup"><strong>Horizontal Snap</strong><br />gallery panels snap to each slide.</div>
          <div className="card fadeup"><strong>SVG Drawing</strong><br />vector paths draw when visible.</div>
        </div>
      </section>

      {/* Section 3: Parallax pinned scene */}
      <section className="section parallax">
        <div className="scene">
          <div className="layer back" />
          <div className="layer mid" />
          <div className="layer front" />
        </div>
        <div className="label">Pinned Parallax Scene</div>
      </section>

      {/* Section 4: Horizontal gallery with snap */}
      <section className="section hpin">
        <div className="hpanel">
          <div className="htrack">
            <div className="hcard">Panel 1 – Welcome</div>
            <div className="hcard">Panel 2 – Smooth Scrub</div>
            <div className="hcard">Panel 3 – Snap Points</div>
            <div className="hcard">Panel 4 – 3D Tilt</div>
            <div className="hcard">Panel 5 – The End</div>
          </div>
        </div>
      </section>

      {/* Section 5: SVG line drawing + counters */}
      <section className="section">
        <div className="draw">
          <svg viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 180 C 120 60, 280 60, 380 180 S 640 300, 780 120" stroke="#60a5fa" strokeWidth="6" />
            <path d="M60 120 L160 200 L280 80 L420 200 L560 60 L740 200" stroke="#22d3ee" strokeWidth="6" />
          </svg>
          <div className="metrics">
            <div><div className="num counter" data-to="120">0</div><div>Articles</div></div>
            <div><div className="num counter" data-to="2400">0</div><div>Photos</div></div>
            <div><div className="num counter" data-to="98">0</div><div>Satisfaction</div></div>
          </div>
        </div>
      </section>

      {/* Section 6: Outro */}
      <section className="section">
        <div style={{ textAlign: "center" }}>
          <h2 className="split" style={{ fontSize: "clamp(1.8rem,5vw,3rem)" }}>That\'s a wrap</h2>
          <p className="subtitle">Clone this file into Vite/CRA and you\'re ready to play.</p>
          <div style={{ marginTop: "1.25rem" }}>
            <a className="btn" href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/" target="_blank" rel="noreferrer">More ScrollTrigger</a>
          </div>
        </div>
      </section>
    </div>
  );
}
