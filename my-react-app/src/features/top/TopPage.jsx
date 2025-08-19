import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Divide } from "lucide-react";

// Register the plugin once at module scope
gsap.registerPlugin(ScrollTrigger);

export default function TopPage() {
  const root = useRef(null);

  useLayoutEffect(() => {
    // gsap.context scopes selectors to this component and handles cleanup
    const ctx = gsap.context(() => {
      // 1) Fade in each .fade section when it enters the viewport
      + gsap.utils.toArray(".fade").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true, // play only once
          },
        });
      });

      // 2) Pin a panel and scrub a horizontal animation tied to scroll
      gsap.to(".track", {
        xPercent: -200, // move 2 panels worth (0 -> -200%)
        ease: "none",
        scrollTrigger: {
          trigger: ".pin",
          start: "top top",
          end: () => "+=" + window.innerHeight * 3, // scroll distance
          scrub: 1, // smooth scrubbing
          pin: true, // keep the section fixed while we scroll through it
        },
      });
    }, root);

    return () => ctx.revert(); // cleanup all animations & ScrollTriggers
  }, []);

  return (
    <div ref={root}>
      {/* --- Simple styles for the demo (inline so it's copy-pasteable) --- */}
      <style>{`
        :root { --bg:#0b1020; --text:#e5e7eb; --glass:#0f172a; --line:#334155; }
        html, body, #root { height: 100%; }
        body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; background: var(--bg); color: var(--text); }
        .section { min-height: 100vh; display: grid; place-items: center; padding: 6rem 1rem; box-sizing: border-box; }
        .hero { background: radial-gradient(80% 120% at 50% 0%, #0ea5e9 0%, var(--bg) 60%); text-align:center; }
        .hero h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 0.5rem; }
        .hero p { opacity: 0.9; }
        .pin { background: var(--bg); }
        .panel { width: min(1000px, 92vw); height: 60vh; border-radius: 24px; outline: 1px solid var(--line); display: grid; place-items: center; overflow: hidden; }
        .track { width: 300%; display: flex; gap: 2rem; padding: 0 2rem; box-sizing: border-box; }
        .card { flex: 0 0 100%; display: grid; place-items: center; font-size: clamp(1.5rem, 4vw, 3rem); background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border: 1px solid var(--line); border-radius: 20px; height: 80%; }
        .fade { text-align: center; }
        .btn { display:inline-block; background:#22d3ee; color:#0b1020; padding:0.75rem 1rem; border-radius:12px; font-weight:600; text-decoration:none; }
      `}</style>

      {/* Section 1: Hero (static) */}
      <section className="section hero">
        <div>
          <h1>GSAP × ScrollTrigger Minimal</h1>
          <p>Scroll down to see fade-ins and a pinned scrub animation.</p>
        </div>
      </section>

      {/* Section 2: Fade-in on enter */}
      <section className="section fade">
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>Fade-in section</h2>
          <p style={{ opacity: 0.85 }}>This block fades in when it hits 80% of the viewport.</p>
        </div>
      </section>

      {/* Section 3: Pinned panel with horizontal track that scrubs with scroll */}
      <section className="section pin">
        <div className="panel">
          <div className="track">
            <div className="card">Panel 1</div>
            <div className="card">Panel 2</div>
            <div className="card">Panel 3</div>
          </div>
        </div>
      </section>

      {/* Section 4: Another fade-in */}
      <section className="section fade">
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>Another fade-in</h2>
          <p style={{ opacity: 0.85 }}>Add more sections and reuse the same pattern.</p>
          <a className="btn" href="https://greensock.com/scrolltrigger/" target="_blank" rel="noreferrer">ScrollTrigger Docs</a>
        </div>
      </section>
    </div>
  );
}
