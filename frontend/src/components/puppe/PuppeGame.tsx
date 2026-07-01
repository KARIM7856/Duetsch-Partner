"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playPuppeTurn } from "@/lib/api";
import type { PuppeTurnResult } from "@/lib/puppe-types";
import { pickDifferentNoun, type Noun } from "@/lib/games/nouns";
import { warmthTier, type WarmthTier } from "@/lib/games/warmth";

type Status = "playing" | "won" | "revealed";
type HintKind = "artikel" | "kategorie" | "buchstaben";

interface ChatEntry {
  id: number;
  role: "user" | "model";
  text: string;
  /** Present on model entries that scored a guess — drives the warmth UI. */
  result?: PuppeTurnResult;
}

const EXAMPLE_QUESTIONS = [
  "Ist es ein Tier?",
  "Kann man es essen?",
  "Ist es groß?",
  "Findet man es im Haus?",
  "Ist es lebendig?",
];

// ── particle field (snow / embers inside the chat) ──────────────────────
type FxParticle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  life?: number;
  max?: number;
};

export function PuppeGame() {
  // The secret word is never rendered until the round ends, so a lazy random
  // initializer is hydration-safe even though SSR and the client differ.
  const [secret, setSecret] = useState<Noun | null>(() => pickDifferentNoun(null));
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("playing");
  const [revealed, setRevealed] = useState<Record<HintKind, boolean>>({
    artikel: false,
    kategorie: false,
    buchstaben: false,
  });
  const [guessCount, setGuessCount] = useState(0);
  const [bestCloseness, setBestCloseness] = useState(0);
  const [warmth, setWarmth] = useState<WarmthTier | null>(null);
  const [sheenNonce, setSheenNonce] = useState(0);

  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const chatWrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fxRef = useRef<HTMLCanvasElement | null>(null);
  const confettiRef = useRef<HTMLCanvasElement | null>(null);
  const confPartsRef = useRef<
    { x: number; y: number; vx: number; vy: number; g: number; w: number; h: number; rot: number; vr: number; c: string; life: number; max: number }[]
  >([]);
  const confRafRef = useRef<number | null>(null);

  const nextId = () => ++idRef.current;
  const gameOver = status !== "playing";
  const particleKind = warmth
    ? warmth.kind === "cold"
      ? "snow"
      : warmth.kind === "hot"
        ? "ember"
        : null
    : null;

  // Keep the chat scrolled to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, isLoading, status, error]);

  // Imperatively restart a whole-chat animation for the current warmth tier.
  const playChatAnim = useCallback((tier: WarmthTier | null) => {
    const wrap = chatWrapRef.current;
    if (!wrap) return;
    wrap.classList.remove("pp-anim-shake", "pp-anim-shiver", "pp-anim-win");
    // force reflow so the animation replays even for the same tier
    void wrap.offsetWidth;
    const cls =
      tier?.kind === "hot"
        ? "pp-anim-shake"
        : tier?.kind === "cold"
          ? "pp-anim-shiver"
          : tier?.kind === "win"
            ? "pp-anim-win"
            : "";
    if (cls) wrap.classList.add(cls);
  }, []);

  // ── particle engine ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = fxRef.current;
    const wrap = chatWrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!particleKind) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let raf = 0;
    const parts: FxParticle[] = [];
    let dpr = Math.min(2, window.devicePixelRatio || 1);

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = wrap.clientWidth * dpr;
      canvas.height = wrap.clientHeight * dpr;
      canvas.style.width = `${wrap.clientWidth}px`;
      canvas.style.height = `${wrap.clientHeight}px`;
    };

    const spawn = (init: boolean): FxParticle => {
      const W = canvas.width;
      const H = canvas.height;
      if (particleKind === "snow") {
        return {
          x: Math.random() * W,
          y: init ? Math.random() * H : -10,
          r: (1 + Math.random() * 2.4) * dpr,
          vy: (0.3 + Math.random() * 0.7) * dpr,
          vx: (Math.random() - 0.5) * 0.4 * dpr,
          a: 0.4 + Math.random() * 0.5,
        };
      }
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : H + 10,
        r: (1 + Math.random() * 2) * dpr,
        vy: -(0.5 + Math.random() * 1.1) * dpr,
        vx: (Math.random() - 0.5) * 0.5 * dpr,
        a: 0.5 + Math.random() * 0.5,
        life: 0,
        max: 80 + Math.random() * 60,
      };
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (particleKind === "snow") {
          p.x += Math.sin(p.y / 40) * 0.3;
          ctx.beginPath();
          ctx.fillStyle = `rgba(186,230,253,${p.a})`;
          ctx.arc(p.x, p.y, p.r, 0, 7);
          ctx.fill();
          if (p.y > H + 10) parts[i] = spawn(false);
        } else {
          p.life = (p.life ?? 0) + 1;
          const fade = 1 - p.life / (p.max ?? 1);
          ctx.beginPath();
          ctx.fillStyle = `rgba(250,${(150 - Math.random() * 60) | 0},60,${Math.max(0, p.a * fade)})`;
          ctx.arc(p.x, p.y, p.r * fade, 0, 7);
          ctx.fill();
          if (p.life > (p.max ?? 1) || p.y < -10) parts[i] = spawn(false);
        }
      }
    };

    size();
    const n = particleKind === "snow" ? 34 : 26;
    for (let i = 0; i < n; i++) parts.push(spawn(true));
    loop();

    const onResize = () => size();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [particleKind]);

  // ── confetti ─────────────────────────────────────────────────────────
  const fireConfetti = useCallback(() => {
    const cc = confettiRef.current;
    if (!cc) return;
    const cctx = cc.getContext("2d");
    if (!cctx) return;
    cc.width = window.innerWidth;
    cc.height = window.innerHeight;

    const colors = ["#d8b15a", "#f3dd9e", "#22c55e", "#ffffff", "#0d1c45", "#fbbf24"];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.42;
    for (let i = 0; i < 160; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 4 + Math.random() * 9;
      confPartsRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 4,
        g: 0.16 + Math.random() * 0.1,
        w: 6 + Math.random() * 7,
        h: 4 + Math.random() * 6,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.4,
        c: colors[i % colors.length],
        life: 0,
        max: 120 + Math.random() * 60,
      });
    }

    if (confRafRef.current == null) {
      const loop = () => {
        confRafRef.current = requestAnimationFrame(loop);
        const parts = confPartsRef.current;
        cctx.clearRect(0, 0, cc.width, cc.height);
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.vy += p.g;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          p.life++;
          cctx.save();
          cctx.translate(p.x, p.y);
          cctx.rotate(p.rot);
          cctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
          cctx.fillStyle = p.c;
          cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          cctx.restore();
          if (p.life > p.max || p.y > cc.height + 20) parts.splice(i, 1);
        }
        if (!parts.length && confRafRef.current != null) {
          cancelAnimationFrame(confRafRef.current);
          confRafRef.current = null;
          cctx.clearRect(0, 0, cc.width, cc.height);
        }
      };
      loop();
    }
  }, []);

  useEffect(
    () => () => {
      if (confRafRef.current != null) cancelAnimationFrame(confRafRef.current);
    },
    [],
  );

  // ── game actions ─────────────────────────────────────────────────────
  function newGame() {
    setSecret((prev) => pickDifferentNoun(prev));
    setEntries([]);
    setInput("");
    setError(null);
    setStatus("playing");
    setRevealed({ artikel: false, kategorie: false, buchstaben: false });
    setGuessCount(0);
    setBestCloseness(0);
    setWarmth(null);
    playChatAnim(null);
    inputRef.current?.focus();
  }

  function giveUp() {
    if (gameOver) return;
    setStatus("revealed");
    setWarmth(null);
  }

  function revealHint(kind: HintKind) {
    if (gameOver || !secret || revealed[kind]) return;
    setRevealed((r) => ({ ...r, [kind]: true }));
    let text: string;
    if (kind === "artikel") {
      text = `Tipp — Artikel: ${secret.article}`;
    } else if (kind === "kategorie") {
      text = `Tipp — Kategorie: ${secret.theme}`;
    } else {
      text = `Tipp — Buchstaben: ${secret.word.length} (beginnt mit „${secret.word[0]}…“)`;
    }
    setEntries((prev) => [...prev, { id: nextId(), role: "model", text }]);
  }

  async function send(message: string) {
    const trimmed = message.trim();
    if (!secret || !trimmed || isLoading || gameOver) return;

    const history = entries.map((e) => ({ role: e.role, text: e.text }));
    setEntries((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }]);
    setInput("");
    setSheenNonce((n) => n + 1);
    setIsLoading(true);
    setError(null);

    try {
      const result = await playPuppeTurn({
        secret: { word: secret.word, article: secret.article, en: secret.en },
        message: trimmed,
        history,
      });
      setEntries((prev) => [
        ...prev,
        { id: nextId(), role: "model", text: result.reply, result },
      ]);

      if (result.type === "guess") {
        setGuessCount((c) => c + 1);
        setBestCloseness((b) => Math.max(b, result.closeness));
        const tier = warmthTier(result.closeness, result.isCorrect);
        setWarmth(tier);
        playChatAnim(tier);
      }

      if (result.isCorrect) {
        setStatus("won");
        fireConfetti();
        window.setTimeout(fireConfetti, 260);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  // CSS custom properties driving the warmth ambiance.
  const templeStyle = {
    "--warm-h": warmth ? `${warmth.h}` : "217",
    "--warm-s": warmth ? `${warmth.s}%` : "90%",
    "--warm-l": warmth ? `${warmth.l}%` : "60%",
    "--warm-glow": warmth ? `${warmth.glow}` : "0",
    "--frame-glow": warmth
      ? `${warmth.kind === "hot" || warmth.kind === "win" ? Math.min(1, warmth.glow) : 0.15}`
      : "0",
  } as React.CSSProperties;

  const frostOpacity =
    warmth && warmth.kind === "cold" ? (warmth.key === "eiskalt" ? 1 : 0.6) : 0;
  const heatOpacity =
    warmth && warmth.kind === "hot" ? (warmth.key === "brennt" ? 1 : 0.6) : 0;

  return (
    <>
      <canvas ref={confettiRef} className="pp-confetti" />

      <div className="puppe-temple" style={templeStyle}>
        {/* PEDIMENT */}
        <svg className="pp-pediment" viewBox="0 0 880 96" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="6,92 440,8 874,92" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="60,92 440,38 820,92" fill="none" stroke="var(--gold)" strokeWidth="1.2" opacity=".55" />
          <circle cx="440" cy="64" r="9" fill="none" stroke="var(--gold)" strokeWidth="1.4" />
          <circle cx="440" cy="64" r="2.4" fill="var(--gold)" />
        </svg>

        {/* FRIEZE / INSCRIPTION */}
        <div className="pp-frieze">
          <h1 className="pp-serif text-lg sm:text-2xl">MEINE&nbsp;&nbsp;PUPPE</h1>
          {[14, 32, 50, 68, 86].map((left) => (
            <div key={left} className="pp-triglyph" style={{ left: `${left}%` }} />
          ))}
        </div>

        {/* COLONNADE: columns | interior | columns */}
        <div className="pp-colonnade">
          <TempleWing />

          <div className="pp-interior">
            {/* status strip */}
            <div
              className="flex items-center justify-between px-4 py-2 border-x-[1.5px]"
              style={{ borderColor: "var(--gold)", background: "rgba(179,133,31,.08)" }}
            >
              <p className="text-[12px] sm:text-[13px]" style={{ color: "#6b5a2e" }}>
                Ich denke an ein deutsches Nomen — frag oder rate{" "}
                <span>{status === "won" ? "🎉" : "🧸"}</span>
              </p>
              <div className="flex items-center gap-3 text-[11px] shrink-0" style={{ color: "#8a7740" }}>
                <span>
                  Versuche <strong style={{ color: "#6b5a2e" }}>{guessCount}</strong>
                </span>
                <span className="hidden sm:inline">
                  Wärmste{" "}
                  <strong style={{ color: "#6b5a2e" }}>
                    {bestCloseness > 0 ? `${bestCloseness}%` : "—"}
                  </strong>
                </span>
              </div>
            </div>

            {/* control bar */}
            <div
              className="flex flex-wrap items-center gap-2 px-3 py-2 border-x-[1.5px]"
              style={{ borderColor: "var(--gold)", background: "#fbfcfe" }}
            >
              <button onClick={newGame} className="px-3.5 py-1.5 text-sm font-semibold pp-btn-primary">
                Neues Spiel
              </button>
              <button
                onClick={giveUp}
                disabled={gameOver}
                className="px-3 py-1.5 pp-btn-soft text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Aufgeben
              </button>
              <div className="ml-auto flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium mr-0.5">Tipps:</span>
                {(["artikel", "kategorie", "buchstaben"] as HintKind[]).map((kind) => (
                  <button
                    key={kind}
                    onClick={() => revealHint(kind)}
                    disabled={gameOver || revealed[kind]}
                    className="pp-chip-tip px-2.5 py-1 capitalize"
                  >
                    {kind}
                  </button>
                ))}
              </div>
            </div>

            {/* CHAT interior */}
            <div ref={chatWrapRef} className="pp-chatwrap">
              <div className="pp-aura" />
              <div className="pp-frost" style={{ opacity: frostOpacity }} />
              <div className="pp-heat" style={{ opacity: heatOpacity }} />
              <canvas ref={fxRef} className="pp-fx" />

              <div ref={scrollRef} className="pp-scroll">
                {entries.length === 0 && !gameOver && (
                  <div className="text-center text-slate-400 text-sm pp-bubble-in py-6">
                    <p className="mb-3">Frag mich zum Beispiel:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {EXAMPLE_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          disabled={isLoading}
                          className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {entries.map((entry) => (
                  <MessageBubble key={entry.id} entry={entry} />
                ))}

                {isLoading && (
                  <div className="flex justify-start mb-3 pp-bubble-in">
                    <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="pp-dot w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <span className="pp-dot w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <span className="pp-dot w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}

                {status === "won" && secret && (
                  <div className="my-2 pp-pop-in">
                    <div className="px-4 py-3 border rounded-xl text-sm border-green-200 bg-green-50 text-green-800">
                      🎉 <strong>Richtig!</strong> Das Wort war{" "}
                      <strong>
                        {secret.article} {secret.word}
                      </strong>{" "}
                      ({secret.en}) — Kategorie: {secret.theme}. Plural: die {secret.plural}.
                    </div>
                  </div>
                )}

                {status === "revealed" && secret && (
                  <div className="my-2 pp-pop-in">
                    <div className="px-4 py-3 border rounded-xl text-sm border-amber-200 bg-amber-50 text-amber-800">
                      Schade! Das gesuchte Wort war{" "}
                      <strong>
                        {secret.article} {secret.word}
                      </strong>{" "}
                      ({secret.en}). Versuch es noch einmal!
                    </div>
                  </div>
                )}

                {error && (
                  <div className="my-2 pp-pop-in">
                    <div className="px-4 py-3 border rounded-xl text-sm border-red-200 bg-red-50 text-red-700">
                      {error}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 p-3 border-x-[1.5px] border-b-[1.5px]"
              style={{ borderColor: "var(--gold)", background: "#fbfcfe" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                placeholder={gameOver ? "Starte ein neues Spiel…" : "Frag auf Deutsch oder rate ein Nomen…"}
                disabled={isLoading || gameOver}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300/60 text-slate-900 placeholder:text-slate-400 text-sm disabled:bg-slate-50"
              />
              <button
                type="submit"
                disabled={isLoading || gameOver || !input.trim()}
                className="relative overflow-hidden px-5 py-2.5 font-semibold pp-btn-primary text-sm"
              >
                <span className="relative z-10">Senden</span>
                <span
                  key={sheenNonce}
                  className="absolute inset-0 -skew-x-12 pp-sheen-run"
                  style={{
                    background: "linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)",
                    width: "40%",
                  }}
                />
              </button>
            </form>
          </div>

          <TempleWing />
        </div>

        {/* STYLOBATE */}
        <div className="pp-stylobate">
          <div className="pp-step" style={{ width: "78%" }} />
          <div className="pp-step" style={{ width: "88%" }} />
          <div className="pp-step" style={{ width: "100%" }} />
        </div>
      </div>

      <p className="text-center text-[11px] mt-6 pp-serif tracking-widest" style={{ color: "#a08a4e" }}>
        DEUTSCHFLOW · A1 / A2
      </p>
    </>
  );
}

function TempleWing() {
  return (
    <div className="pp-wing" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="pp-column">
          <div className="pp-col-cap" />
          <div className="pp-col-neck" />
          <div className="pp-col-shaft" />
          <div className="pp-col-base" />
        </div>
      ))}
    </div>
  );
}

function MessageBubble({ entry }: { entry: ChatEntry }) {
  const isUser = entry.role === "user";
  const result = entry.result;
  const isGuess = result?.type === "guess";
  const tier = isGuess ? warmthTier(result.closeness, result.isCorrect) : null;

  return (
    <div className={`flex mb-3 pp-bubble-in ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={isUser ? "max-w-[80%]" : "max-w-[82%]"}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-slate-900 text-white rounded-2xl rounded-br-sm"
              : "bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm"
          }`}
        >
          {entry.text}
        </div>

        {tier && result && (
          <div className="mt-1.5 space-y-1 pp-pop-in">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${tier.chip}`}
              >
                {tier.emoji} {tier.label}
              </span>
              <span className="text-xs text-slate-400">
                {result.guessedWord ? `„${result.guessedWord}“ · ` : ""}
                {result.closeness}%
              </span>
            </div>
            <div className="h-1.5 w-40 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full pp-bar-fill ${tier.bar}`}
                style={{ width: `${result.closeness}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
