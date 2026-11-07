"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./cursor-lab.css";

type CursorMode = "spotlight" | "magnetic" | "trail" | "crosshair";

const modes: { id: CursorMode; name: string; detail: string }[] = [
  { id: "spotlight", name: "Spotlight", detail: "A soft light follows your pointer." },
  { id: "magnetic", name: "Magnetic", detail: "The preview elements lean toward your cursor." },
  { id: "trail", name: "Motion trail", detail: "A glowing trail follows every movement." },
  { id: "crosshair", name: "Crosshair", detail: "A precise technical cursor with live coordinates." },
];

export default function CursorLab() {
  const [mode, setMode] = useState<CursorMode>("spotlight");
  const [enabled, setEnabled] = useState(true);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [copied, setCopied] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handleMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      setPosition({ x, y });
      stage.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      stage.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
      stage.style.setProperty("--pointer-xp", `${x}%`);
      stage.style.setProperty("--pointer-yp", `${y}%`);
      if (trailRef.current) {
        trailRef.current.animate(
          [{ transform: `translate3d(${event.clientX - rect.left}px, ${event.clientY - rect.top}px, 0)` }],
          { duration: 180, fill: "forwards", easing: "ease-out" }
        );
      }
    };
    stage.addEventListener("pointermove", handleMove);
    return () => stage.removeEventListener("pointermove", handleMove);
  }, []);

  const snippet = `<div class="cursor-demo cursor-${mode}">Move your pointer</div>
<style>
.cursor-demo { min-height: 320px; background: #101318; color: white; display: grid; place-items: center; position: relative; overflow: hidden; }
.cursor-demo::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .25s; }
.cursor-spotlight::before { opacity: 1; background: radial-gradient(240px circle at var(--x, 50%) var(--y, 50%), #b7f7e8 0%, transparent 70%); mix-blend-mode: screen; }
</style>`;

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="cursor-page">
      <div className="cursor-noise" aria-hidden="true" />
      <header className="cursor-nav">
        <Link href="/" className="cursor-brand"><span className="brand-mark">a.</span> AXIOM LABS</Link>
        <div className="nav-center"><span className="live-dot" /> INTERACTION STUDY / 001</div>
        <a className="nav-back" href="https://github.com/GlitchedPhoenix38/animation-explained" target="_blank" rel="noreferrer">SOURCE ↗</a>
      </header>

      <section className="cursor-intro">
        <p className="eyebrow"><span>01</span> / POINTER INTERACTIONS <i /></p>
        <h1>Make the cursor<br /><em>part of the story.</em></h1>
        <p className="intro-copy">A small collection of expressive pointer treatments. Move around, switch modes, and feel how motion can turn an interface into an experience.</p>
        <div className="intro-meta"><span>4 INTERACTIONS</span><span>·</span><span>REAL-TIME INPUT</span><span>·</span><span>BUILT FOR THE WEB</span></div>
      </section>

      <section className="cursor-workbench">
        <div className="workbench-heading">
          <div><p className="eyebrow">INTERACTIVE CANVAS</p><h2>Try it yourself<span className="accent-dot">.</span></h2></div>
          <button className={`toggle-button ${enabled ? "is-on" : ""}`} onClick={() => setEnabled(!enabled)} aria-pressed={enabled}><span /> EFFECTS {enabled ? "ON" : "OFF"}</button>
        </div>

        <div ref={stageRef} className={`cursor-stage mode-${mode} ${enabled ? "effects-on" : "effects-off"}`}>
          <div className="stage-grid" aria-hidden="true" />
          <div className="stage-glow" aria-hidden="true" />
          <div className="stage-crosshair crosshair-x" aria-hidden="true" />
          <div className="stage-crosshair crosshair-y" aria-hidden="true" />
          <div className="stage-coordinate">X: {Math.round(position.x * 10) / 10} <span>/</span> Y: {Math.round(position.y * 10) / 10}</div>
          <div className="stage-corner top-left">FIG 01 — POINTER FIELD</div>
          <div className="stage-corner bottom-right">MOVE TO INTERACT ↗</div>
          <div className="stage-content">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="stage-core"><span className="core-icon">✳</span><span>FOLLOW THE<br />FEELING</span></div>
            <p>YOUR POINTER IS THE<br /><strong>INPUT DEVICE.</strong></p>
          </div>
          <div ref={trailRef} className="trail-dot" aria-hidden="true" />
          {!enabled && <div className="effects-disabled">EFFECTS PAUSED</div>}
        </div>

        <div className="mode-picker">
          {modes.map((item, index) => (
            <button key={item.id} onClick={() => setMode(item.id)} className={`mode-option ${mode === item.id ? "selected" : ""}`}>
              <span className="mode-index">0{index + 1}</span><span className="mode-name">{item.name}</span><span className="mode-arrow">↗</span>
            </button>
          ))}
        </div>
        <p className="mode-detail">{modes.find((item) => item.id === mode)?.detail}</p>
      </section>

      <section className="principles">
        <div className="principles-title"><p className="eyebrow">THE DETAILS</p><h2>Motion with<br /><em>a purpose.</em></h2></div>
        <div className="principle-list">
          <article><span>01</span><div><h3>Responsive</h3><p>Every movement is tracked in real time, with smooth transitions that make the interface feel connected to your hand.</p></div></article>
          <article><span>02</span><div><h3>Considered</h3><p>Interaction should guide attention, reveal detail, and add feedback — never compete with the content.</p></div></article>
          <article><span>03</span><div><h3>Accessible</h3><p>Effects can be paused, touch devices remain usable, and reduced-motion preferences are respected.</p></div></article>
        </div>
      </section>

      <section className="code-section">
        <div><p className="eyebrow">TAKE IT FURTHER</p><h2>A little motion.<br /><em>Your own canvas.</em></h2><p className="code-copy">Use this starter markup as a base for your own pointer experiments.</p></div>
        <div className="code-card"><div className="code-top"><span>POINTER / STARTER.CSS</span><button onClick={copySnippet}>{copied ? "COPIED ✓" : "COPY CODE ↗"}</button></div><pre>{snippet}</pre></div>
      </section>

      <footer className="cursor-footer"><Link href="/" className="cursor-brand"><span className="brand-mark">a.</span> AXIOM LABS</Link><span>AN EXPERIMENT IN INTERACTION DESIGN · 2026</span><a href="https://github.com/GlitchedPhoenix38/animation-explained" target="_blank" rel="noreferrer">VIEW REPOSITORY ↗</a></footer>
    </main>
  );
}
