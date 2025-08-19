import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * New Screen: "City Guide Landing"
 * 特徴:
 * - 固定ヘッダ + セクション連動のアクティブナビ
 * - Hero: キーワードが順に浮上
 * - Flow: タイムライン（左）と内容パネル（右）を pin & snap で同期
 * - Showcase: 横スクラブ + 背景色トランジション
 * - Metrics: カウンタ
 * - CTA: 終端セクション
 */
export default function NewScreen() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ===== 0) アクティブナビ（各セクションが画面内に入るとハイライト） =====
      const sections = gsap.utils.toArray("section[id]");
      sections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActiveNav(sec.id);
          },
        });
      });
      function setActiveNav(id) {
        const links = gsap.utils.toArray(".nav a");
        links.forEach((a) => a.classList.remove("active"));
        const cur = document.querySelector(`.nav a[href="#${id}"]`);
        if (cur) cur.classList.add("active");
      }

      // ===== 1) Hero: キーワード順次リビール =====
      const words = gsap.utils.toArray(".hero .word");
      gsap.set(words, { y: 30, opacity: 0 });
      gsap.to(words, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: ".hero", start: "top 70%", once: true },
      });

      // ===== 2) Flow: タイムライン + パネル同期（pin & snap） =====
      const flowCards = gsap.utils.toArray(".flow .card");
      const steps = gsap.utils.toArray(".flow .step");
      const count = flowCards.length || 1;
      const flowST = ScrollTrigger.create({
        trigger: ".flow-wrap",
        start: "top top",
        end: () => "+=" + window.innerHeight * (count + 0.5),
        scrub: 0.7,
        pin: true,
        snap: count > 1 ? { snapTo: 1 / (count - 1), duration: 0.25, ease: "power1.inOut" } : false,
      });
      // 右パネルを横移動
      gsap.to(".flow .track", {
        xPercent: -100 * (count - 1),
        ease: "none",
        scrollTrigger: flowST,
      });
      // 左ステップのアクティブ切替
      ScrollTrigger.create({
        trigger: ".flow-wrap",
        start: "top top",
        end: () => "+=" + window.innerHeight * (count + 0.5),
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (count - 1));
          steps.forEach((s, i) => s.classList.toggle("active", i === idx));
        },
      });

      // ===== 3) Showcase: 横スクラブ + 背景色トランジション =====
      const showCards = gsap.utils.toArray(".showcase .hcard");
      const showCount = showCards.length || 1;
      const colors = ["#0ea5e9", "#8b5cf6", "#22d3ee", "#f97316"]; // セクションごとに背景色変化
      const showST = ScrollTrigger.create({
        trigger: ".showcase",
        start: "top top",
        end: () => "+=" + window.innerWidth * (showCount - 1),
        scrub: 0.6,
        pin: true,
        snap: showCount > 1 ? { snapTo: 1 / (showCount - 1), duration: 0.25 } : false,
        onUpdate: (self) => {
          const p = self.progress * (showCount - 1);
          const i = Math.floor(p);
          const t = p - i;
          const c1 = gsap.utils.splitColor(colors[i] || colors[0]);
          const c2 = gsap.utils.splitColor(colors[i + 1] || colors[colors.length - 1]);
          // 線形補間
          const mix = (a, b, t) => Math.round(a + (b - a) * t);
          const r = mix(c1[0], c2[0], t);
          const g = mix(c1[1], c2[1], t);
          const b = mix(c1[2], c2[2], t);
          document.documentElement.style.setProperty("--bg-accent", `rgb(${r} ${g} ${b})`);
        },
      });
      gsap.to(".showcase .htrack", { xPercent: -100 * (showCount - 1), ease: "none", scrollTrigger: showST });

      // カードの少しのスケールと回転
      ScrollTrigger.create({
        trigger: ".showcase",
        start: "top top",
        end: () => "+=" + window.innerWidth * (showCount - 1),
        scrub: true,
        onUpdate: (self) => {
          const pos = self.progress * (showCount - 1);
          showCards.forEach((card, i) => {
            const dist = Math.abs(i - pos);
            gsap.to(card, { scale: 1 - dist * 0.08, rotateY: (i - pos) * 20, duration: 0.2, ease: "power2.out" });
          });
        },
      });

      // ===== 4) Metrics: カウンタ =====
      gsap.utils.toArray(".metrics .num").forEach((el) => {
        const end = Number(el.dataset?.to || 100);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.2,
          ease: "power1.out",
          onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString()),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      // ===== アクセシビリティ: reduce motion =====
      ScrollTrigger.matchMedia({
        "(prefers-reduced-motion: reduce)": function () {
          ScrollTrigger.getAll().forEach((st) => st.disable());
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      {/* ====== Styles ====== */}
      <style>{`
        :root { --bg:#0b1020; --text:#e5e7eb; --muted:#94a3b8; --line:#334155; --bg-accent:#0ea5e9; }
        html, body, #root { height: 100%; }
        body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: var(--text); background: radial-gradient(1200px 800px at 50% -10%, var(--bg-accent), var(--bg) 60%); transition: background 0.2s linear; }
        .container { width:min(1200px, 92vw); margin: 0 auto; }
        .nav { position: fixed; top: 12px; left: 50%; transform: translateX(-50%); z-index: 50; display:flex; gap:.75rem; padding:.5rem; background: rgba(15,23,42,.55); border:1px solid var(--line); border-radius: 999px; backdrop-filter: blur(8px); }
        .nav a { color: var(--muted); text-decoration:none; font-weight:600; padding:.5rem .75rem; border-radius: 999px; }
        .nav a.active { color:#0b1020; background:#22d3ee; }
        .section { min-height: 100vh; display:grid; place-items:center; padding: 6rem 1rem; box-sizing: border-box; }
        /* Hero */
        .hero { text-align:center; }
        .hero h1 { font-size: clamp(2.2rem, 7vw, 5rem); margin:.5rem 0 0; font-weight: 900; letter-spacing:.02em; }
        .hero .kws { display:flex; gap:.5rem; justify-content:center; flex-wrap:wrap; opacity:.95 }
        .word { display:inline-block; padding:.25rem .6rem; border-radius:999px; border:1px solid var(--line); background: rgba(255,255,255,.06); }
        .sub { color: var(--muted); margin-top:.75rem; }
        .cta { margin-top:1rem; display:inline-block; background:#22d3ee; color:#0b1020; padding:.75rem 1rem; border-radius:12px; font-weight:700; text-decoration:none; }
        /* Flow */
        .flow-wrap { width:min(1200px, 92vw); height: 70vh; display:grid; grid-template-columns: 320px 1fr; gap:1.25rem; align-items:stretch; }
        .steps { background: rgba(255,255,255,.04); border:1px solid var(--line); border-radius:20px; padding:1rem; display:flex; flex-direction:column; gap:.5rem; }
        .step { padding:.75rem 1rem; border-radius:12px; color: var(--muted); border:1px dashed var(--line); }
        .step.active { color:#0b1020; background:#22d3ee; border-style: solid; }
        .panel { border:1px solid var(--line); border-radius:20px; overflow:hidden; background: rgba(255,255,255,.03); }
        .track { width:100%; height:100%; display:flex; }
        .card { flex:0 0 100%; display:grid; place-items:center; font-size: clamp(1.4rem, 3.5vw, 2.2rem); }
        /* Showcase */
        .showcase .hpanel { width:min(1200px, 92vw); height:70vh; border: 1px solid var(--line); border-radius:24px; overflow:hidden; background: rgba(255,255,255,.04); }
        .showcase .htrack { width:100%; height:100%; display:flex; }
        .showcase .hcard { flex:0 0 100%; display:grid; place-items:center; font-size: clamp(1.2rem, 3.2vw, 2rem); border-right:1px solid var(--line); will-change: transform; }
        /* Metrics */
        .metrics .wrap { display:flex; gap:2rem; justify-content:center; }
        .metrics .num { font-weight:900; font-size: clamp(1.8rem, 5vw, 3rem); }
        .metrics .label { color: var(--muted); text-align:center; }
        @media (max-width: 900px){ .flow-wrap{ grid-template-columns: 1fr; height: 80vh; } }
      `}</style>

      {/* ====== Header Nav ====== */}
      <nav className="nav">
        <a href="#home">Home</a>
        <a href="#flow">Flow</a>
        <a href="#showcase">Showcase</a>
        <a href="#metrics">Metrics</a>
        <a href="#cta">Get Started</a>
      </nav>

      {/* ====== Hero ====== */}
      <section id="home" className="section hero">
        <div className="container">
          <div className="kws">
            <span className="word">Discover</span>
            <span className="word">Create</span>
            <span className="word">Share</span>
            <span className="word">Explore</span>
          </div>
          <h1>City Guide Landing</h1>
          <p className="sub">スクロールと同期して流れるストーリー調のランディング。GSAP × ScrollTrigger の実戦レシピ。</p>
          <a className="cta" href="#flow">Start the tour</a>
        </div>
      </section>

      {/* ====== Flow (Pinned timeline + content) ====== */}
      <section id="flow" className="section flow">
        <div className="flow-wrap">
          <div className="steps">
            <div className="step active">01 Plan</div>
            <div className="step">02 Find</div>
            <div className="step">03 Route</div>
            <div className="step">04 Enjoy</div>
          </div>
          <div className="panel">
            <div className="track">
              <div className="card">Plan your day with highlights</div>
              <div className="card">Find hidden spots and cafés</div>
              <div className="card">Route across scenic streets</div>
              <div className="card">Enjoy the night city vibes</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Showcase (Horizontal with bg transitions) ====== */}
      <section id="showcase" className="section showcase">
        <div className="hpanel container">
          <div className="htrack">
            <div className="hcard">Modern Architecture</div>
            <div className="hcard">Local Food Culture</div>
            <div className="hcard">Parks & Riverside</div>
            <div className="hcard">Night Markets</div>
          </div>
        </div>
      </section>

      {/* ====== Metrics ====== */}
      <section id="metrics" className="section metrics">
        <div className="container">
          <div className="wrap">
            <div>
              <div className="num" data-to="128">0</div>
              <div className="label">Places</div>
            </div>
            <div>
              <div className="num" data-to="640">0</div>
              <div className="label">Photos</div>
            </div>
            <div>
              <div className="num" data-to="98">0</div>
              <div className="label">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section id="cta" className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.8rem,5vw,3rem)", margin: 0 }}>Ready to explore?</h2>
          <p className="sub">コピペで動く GSAP × ScrollTrigger の新画面テンプレート。</p>
          <a className="cta" href="#home">Back to top</a>
        </div>
      </section>
    </div>
  );
}
