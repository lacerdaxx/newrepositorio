import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, delayRender, continueRender} from 'remotion';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import cues from '../cues.json';

const CU = cues as any;
const IMP: {f: number; s: number; x: number; y: number}[] = CU.impacts;
const SC: number[][] = CU.scenes;
const FONT = "'Montserrat', Arial, sans-serif";
const OR = '#FF6A00';

const fh = delayRender('fonts');
Promise.all(['700', '800', '900'].map((w) => document.fonts.load(`${w} 100px Montserrat`, 'AÃÉÍÓÚÇÊÂÔ$•0123456789'))).then(() => continueRender(fh)).catch(() => continueRender(fh));

const expo = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const land = Easing.out(Easing.back(1.5));
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const p = (f: number, at: number, dur = 14, e: (t: number) => number = expo) =>
  interpolate(f, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const rnd = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

let _ctx: CanvasRenderingContext2D | null = null;
const measure = (t: string) => {
  if (!_ctx) _ctx = document.createElement('canvas').getContext('2d')!;
  _ctx.font = `900 100px Montserrat`;
  return _ctx.measureText(t).width / 100;
};
const fit = (t: string, target: number, max: number) => Math.min(max, target / measure(t));

/* ------------------------------------------------------------------ 3D TEXT */
type Look = 'orange' | 'chrome' | 'white';
const LOOK: Record<Look, {face: string; side: (t: number) => string}> = {
  orange: {
    face: 'linear-gradient(180deg,#FFE0A8 0%,#FFA13A 34%,#FF6A00 52%,#D14A00 78%,#FF8A1F 100%)',
    side: (t) => `hsl(${24 - t * 6} 100% ${34 - t * 24}%)`,
  },
  chrome: {
    face: 'linear-gradient(180deg,#ffffff 0%,#e4eaef 36%,#7f8a95 50%,#c9d2d9 58%,#ffffff 100%)',
    side: (t) => `hsl(212 9% ${50 - t * 38}%)`,
  },
  white: {
    face: 'linear-gradient(180deg,#ffffff 0%,#f5f5f5 55%,#c8c8c8 100%)',
    side: (t) => `hsl(0 0% ${58 - t * 46}%)`,
  },
};

type Mode = 'deep' | 'left' | 'right' | 'rise' | 'expand';
const LAYERS = 12;

const Text3D: React.FC<{
  text: string; size: number; landAt: number; look?: Look; lookFn?: (i: number, ch: string) => Look;
  stag?: number; dur?: number; mode?: Mode; shineAt?: number; depth?: number; spacing?: number;
}> = ({text, size, landAt, look = 'chrome', lookFn, stag = 2, dur = 16, mode = 'deep', shineAt, depth = 0.28, spacing = 0}) => {
  const f = useCurrentFrame();
  const chars = Array.from(text);
  const n = chars.length;
  const startAt = landAt - (n - 1) * stag - dur;
  const D = size * depth;
  return (
    <div style={{display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap', transformStyle: 'preserve-3d', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: spacing}}>
      {chars.map((ch, i) => {
        const at = startAt + i * stag;
        if (f < at) return <span key={i} style={{visibility: 'hidden', whiteSpace: 'pre'}}>{ch}</span>;
        const e = p(f, at, dur, mode === 'rise' ? expo : land);
        const inv = 1 - e;
        const sgn = i % 2 ? 1 : -1;
        let tr = '';
        if (mode === 'deep') tr = `translate3d(0,${inv * 70}px,${inv * -1500}px) rotateX(${inv * -55}deg) rotateY(${inv * 40 * sgn}deg)`;
        if (mode === 'left') tr = `translate3d(${inv * -1000}px,0,${inv * -200}px) rotateY(${inv * 70}deg)`;
        if (mode === 'right') tr = `translate3d(${inv * 1000}px,0,${inv * -200}px) rotateY(${inv * -70}deg)`;
        if (mode === 'rise') tr = `translate3d(0,${inv * 140}px,${inv * -400}px) rotateX(${inv * -80}deg)`;
        if (mode === 'expand') tr = `translate3d(${(i - (n - 1) / 2) * inv * -60}px,0,${inv * -900}px) scale(${0.3 + 0.7 * e})`;
        const lf = at + dur;
        const kick = f >= lf ? 0.07 * Math.exp(-(f - lf) / 4) * Math.cos((f - lf) / 1.6) : 0;
        const idle = f >= lf ? Math.sin((f + i * 7) / 22) * 2.2 : 0;
        const lk = lookFn ? lookFn(i, ch) : look;
        const L = LOOK[lk];
        const sh = shineAt !== undefined ? ((f - shineAt - i * 2.2) / 22) : -1;
        const shPos = clamp(sh, -0.3, 1.3);
        const shine = sh > -0.3 && sh < 1.3
          ? `linear-gradient(105deg, rgba(255,255,255,0) ${shPos * 100 - 22}%, rgba(255,255,255,0.97) ${shPos * 100}%, rgba(255,255,255,0) ${shPos * 100 + 22}%), `
          : '';
        if (ch === ' ') return <span key={i} style={{whiteSpace: 'pre'}}>{ch}</span>;
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', transformStyle: 'preserve-3d', transform: `${tr} scale(${1 + kick}) rotateY(${idle}deg)`}}>
            {Array.from({length: LAYERS}).map((_, k) => {
              const kk = LAYERS - k; // draw deepest first
              const t = kk / LAYERS;
              return (
                <span key={k} style={{position: 'absolute', left: 0, top: 0, color: L.side(t), transform: `translateZ(${-t * D}px)`, whiteSpace: 'pre'}}>{ch}</span>
              );
            })}
            <span style={{position: 'relative', display: 'inline-block', transform: 'translateZ(0.5px)', color: 'transparent', backgroundImage: `${shine}${L.face}`, WebkitBackgroundClip: 'text', backgroundClip: 'text', whiteSpace: 'pre'}}>{ch}</span>
          </span>
        );
      })}
    </div>
  );
};

const Block: React.FC<{top: number; z?: number; children: React.ReactNode; left?: number; right?: number}> = ({top, z = 0, children, left = 0, right = 0}) => (
  <div style={{position: 'absolute', left, right, top, transformStyle: 'preserve-3d', transform: `translateZ(${z}px)`}}>{children}</div>
);

/* ---------------------------------------------------------- BACKGROUND/FX */
const CARBON = `linear-gradient(27deg,#151515 5px,transparent 5px) 0 5px,linear-gradient(207deg,#151515 5px,transparent 5px) 10px 0,linear-gradient(27deg,#222 5px,transparent 5px) 0 10px,linear-gradient(207deg,#222 5px,transparent 5px) 10px 5px,linear-gradient(90deg,#1b1b1b 10px,transparent 10px),linear-gradient(#1d1d1d 25%,#1a1a1a 25%,#1a1a1a 50%,transparent 50%,transparent 75%,#242424 75%,#242424)`;

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = p(f, 6, 30, io);
  const bright = 0.5 * p(f, 276, 14) * (1 - p(f, 340, 20)) + 0.25 * p(f, 372, 10) * (1 - p(f, 430, 14));
  return (
    <AbsoluteFill style={{background: '#030303'}}>
      <AbsoluteFill style={{opacity: fadeIn * 0.9, background: CARBON, backgroundColor: '#131313', backgroundSize: '20px 20px', transform: `translateY(${(f * 0.6) % 20}px)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 44%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.78) 100%)'}} />
      <AbsoluteFill style={{opacity: fadeIn, background: `radial-gradient(ellipse 80% 38% at 50% 70%, rgba(255,106,0,${0.28 + bright * 0.5}), rgba(0,0,0,0) 70%)`}} />
      <div style={{position: 'absolute', left: -1000, width: 3080, top: 1180, height: 1800, opacity: fadeIn, transform: 'perspective(650px) rotateX(74deg)', transformOrigin: '50% 0',
        backgroundImage: `linear-gradient(rgba(255,106,0,0.75) 2px, transparent 2px), linear-gradient(90deg, rgba(255,106,0,0.75) 2px, transparent 2px)`,
        backgroundSize: '130px 130px', backgroundPosition: `0 ${f * 7}px`, WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)'}} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 140 + i * 330, top: -300, width: 240, height: 2600, opacity: fadeIn * (0.55 + bright), mixBlendMode: 'screen',
          transform: `rotate(${Math.sin(f / 60 + i * 2) * 14 + (i - 1) * 16}deg)`, transformOrigin: '50% 0', background: 'linear-gradient(180deg, rgba(255,150,60,0.30), rgba(255,106,0,0.05) 60%, rgba(0,0,0,0))'}} />
      ))}
      {Array.from({length: 110}).map((_, i) => {
        const spawn = rnd(i + 3) * 55;
        if (f < spawn) return null;
        const x = rnd(i) * 1080 + Math.sin(f / 40 + i) * 14;
        const y = ((rnd(i + 1) * 1920 - f * (0.5 + rnd(i + 2) * 2.2)) % 1920 + 1920) % 1920;
        const s = 2 + rnd(i + 4) * 4;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / 9 + i));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: 9, background: i % 5 ? OR : '#fff', opacity: tw * clamp((f - spawn) / 10), boxShadow: `0 0 ${s * 3}px ${OR}`}} />;
      })}
    </AbsoluteFill>
  );
};

const HUD: React.FC = () => {
  const f = useCurrentFrame();
  const k = p(f, 10, 24, io);
  const br = (s: React.CSSProperties) => <div style={{position: 'absolute', width: 90, height: 90, borderColor: OR, borderStyle: 'solid', borderWidth: 0, opacity: k, filter: 'none', ...s}} />;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {br({left: 36, top: 60, borderTopWidth: 5, borderLeftWidth: 5})}
      {br({right: 36, top: 60, borderTopWidth: 5, borderRightWidth: 5})}
      {br({left: 36, bottom: 60, borderBottomWidth: 5, borderLeftWidth: 5})}
      {br({right: 36, bottom: 60, borderBottomWidth: 5, borderRightWidth: 5})}
      <div style={{position: 'absolute', left: 36, right: 36, top: 62, height: 6, opacity: k * 0.8, background: 'repeating-linear-gradient(90deg, rgba(255,106,0,0.9) 0 3px, transparent 3px 18px)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)'}} />
      <div style={{position: 'absolute', left: 36, right: 36, bottom: 62, height: 6, opacity: k * 0.8, background: 'repeating-linear-gradient(90deg, rgba(255,106,0,0.9) 0 3px, transparent 3px 18px)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: ((f * 9) % 2100) - 100, height: 3, background: 'linear-gradient(90deg, transparent, rgba(255,140,40,0.35), transparent)'}} />
    </AbsoluteFill>
  );
};

const Circuits: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 100) return null;
  const paths = [
    'M0 300 H220 L300 380 H520 L560 340 H1080',
    'M0 1500 H180 L260 1420 H640 L700 1480 H1080',
    'M1080 220 H860 L780 300 H560',
    'M0 900 H120 L180 960 H360',
    'M1080 1100 H900 L840 1040 H700 L650 1100 H560',
    'M540 0 V160 L600 220 V420',
    'M540 1920 V1760 L480 1700 V1540',
  ];
  const fade = 1 - p(f, 78, 14);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: fade}}>
      {paths.map((d, i) => {
        const k = p(f, 4 + i * 3, 28, io);
        return (
          <g key={i}>
            <path d={d} pathLength={1} stroke={OR} strokeWidth={3} fill="none" strokeDasharray="1" strokeDashoffset={1 - k} opacity={0.75} />
            <path d={d} pathLength={1} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="0.05 1" strokeDashoffset={-((f * 0.02 + i * 0.3) % 1.1) + 0.05} opacity={k} />
          </g>
        );
      })}
    </svg>
  );
};

const Sparks: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {IMP.filter((m) => m.s >= 0.75 && f >= m.f && f < m.f + 16).map((m, j) => {
        const e = (f - m.f) / 16;
        const ease = 1 - Math.pow(1 - e, 3);
        return (
          <div key={j} style={{position: 'absolute', left: m.x, top: m.y, width: 0, height: 0}}>
            {Array.from({length: 18}).map((_, i) => {
              const a = (i / 18) * 360 + rnd(i + j) * 20;
              const len = (50 + rnd(i * 3 + j) * 190) * m.s;
              return <div key={i} style={{position: 'absolute', left: 0, top: 0, width: 6 + 16 * (1 - e), height: 3, borderRadius: 3, background: i % 3 ? '#FFB45C' : '#fff', boxShadow: `0 0 10px ${OR}`, opacity: 1 - e,
                transform: `rotate(${a}deg) translateX(${ease * len + 30}px)`}} />;
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  let o = 0;
  IMP.forEach((m) => { if (m.s >= 1 && f >= m.f && f < m.f + 8) o = Math.max(o, 0.45 * m.s * (1 - (f - m.f) / 8)); });
  SC.forEach(([a, b], i) => { if (i > 0 && f >= a - 1 && f < a + 7) o = Math.max(o, 0.35 * (1 - (f - a + 1) / 8)); });
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 46%, rgba(255,235,210,${o}), rgba(255,106,0,${o * 0.6}) 70%)`, mixBlendMode: 'screen'}} />;
};

const Streaks: React.FC = () => {
  const f = useCurrentFrame();
  let o = 0;
  SC.forEach(([a, b], i) => { if (i < SC.length - 1) { const x = (f - (b - 8)) / 14; if (x > 0 && x < 1) o = Math.max(o, Math.sin(x * Math.PI)); } });
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o * 0.85, mixBlendMode: 'screen', background: 'repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,160,70,0.8) 0deg 0.7deg, transparent 0.7deg 5deg)',
    WebkitMaskImage: 'radial-gradient(circle at 50% 46%, transparent 18%, black 75%)', maskImage: 'radial-gradient(circle at 50% 46%, transparent 18%, black 75%)'}} />;
};

/* ------------------------------------------------------------------ SCENE */
const shake = (f: number) => {
  let x = 0, y = 0;
  IMP.forEach((m) => {
    const d = f - m.f;
    if (d >= 0 && d < 10) { const a = m.s * 16 * Math.exp(-d / 3.5); x += (rnd(f * 3.1 + m.f) - 0.5) * a; y += (rnd(f * 5.7 + m.f) - 0.5) * a; }
  });
  return [x, y];
};

const Scene: React.FC<{i: number; cam: (t: number) => number[]; children: React.ReactNode; glow?: string}> = ({i, cam, children, glow}) => {
  const f = useCurrentFrame();
  const [from, to] = SC[i];
  if (f < from || f >= to + 6) return null;
  const t = clamp((f - from) / (to - from));
  const [rx, ry, tz] = cam(t);
  const ex = i === SC.length - 1 ? 0 : clamp((f - (to - 6)) / 10);
  const en = i === 0 ? 0 : 1 - p(f, from, 10);
  const [sx, sy] = shake(f);
  return (
    <AbsoluteFill>
      {glow && <AbsoluteFill style={{background: glow, opacity: 1 - ex}} />}
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 46%'}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: '50% 46%',
          transform: `translate3d(${sx}px,${sy}px,${tz + ex * ex * 1700 - en * 900}px) rotateX(${rx}deg) rotateY(${ry + ex * 10}deg)`}}>
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * io(t);

/* ------------------------------------------------------------------ PANEL */
const Panel: React.FC<{at: number; top: number; h: number; w?: number; z?: number; closeAt?: number}> = ({at, top, h, w = 960, z = -50, closeAt}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k1 = p(f, at, 8, io);
  const k2 = p(f, at + 5, 16, expo);
  const c = closeAt !== undefined ? p(f, closeAt, 12, io) : 0;
  const kh = k2 * (1 - c);
  const left = (1080 - w) / 2;
  const sweep = ((f - at) * 12) % (h + 200);
  return (
    <div style={{position: 'absolute', left, top, width: w, height: h, transformStyle: 'preserve-3d', transform: `translateZ(${z}px)`}}>
      <div style={{position: 'absolute', inset: -4, borderRadius: 6, opacity: kh * 0.7, boxShadow: `0 0 90px 10px rgba(255,106,0,0.35)`}} />
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - kh) * 50}% ${(1 - k1) * 50}%)`, overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255,106,0,0.14), rgba(8,8,8,0.62) 35%, rgba(8,8,8,0.78))', border: '3px solid rgba(255,150,60,0.95)', boxShadow: 'inset 0 0 90px rgba(255,106,0,0.16)'}}>
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 7px)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: sweep - 100, height: 100, background: 'linear-gradient(180deg, transparent, rgba(255,150,60,0.16), transparent)'}} />
        {[[0, 0, 'Top', 'Left'], [1, 0, 'Top', 'Right'], [0, 1, 'Bottom', 'Left'], [1, 1, 'Bottom', 'Right']].map(([x, y, a, b]: any, i) => (
          <div key={i} style={{position: 'absolute', [x ? 'right' : 'left']: 12, [y ? 'bottom' : 'top']: 12, width: 50, height: 50, [`border${a}`]: '7px solid #FFB45C', [`border${b}`]: '7px solid #FFB45C'}} />
        ))}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- 3D ALERT */
const TRI = 'M200 40 Q214 40 222 54 L372 318 Q384 340 360 340 L40 340 Q16 340 28 318 L178 54 Q186 40 200 40 Z';
const Alert3D: React.FC = () => {
  const f = useCurrentFrame();
  const k = p(f, 4, 38, Easing.bezier(0.22, 0.9, 0.3, 1));
  const z = (1 - k) * -3200;
  const ry = (1 - k) * 900;
  const landed = f >= 40 ? Math.exp(-(f - 40) / 5) : 0;
  const sc = 1 + 0.12 * landed * Math.cos((f - 40) / 1.5) + (f > 44 ? Math.sin(f / 18) * 0.01 : 0);
  const D = 70;
  const lit = clamp((f - 30) / 12);
  const ringK = p(f, 40, 22, expo);
  if (f < 2) return null;
  return (
    <>
      <div style={{position: 'absolute', left: 540 - 300, top: 640 - 300, width: 600, height: 600, borderRadius: 600, border: `${8 * (1 - ringK)}px solid rgba(255,170,80,${1 - ringK})`, transform: `scale(${0.3 + ringK * 2.2})`, opacity: f >= 40 ? 1 : 0}} />
      <div style={{position: 'absolute', left: 540 - 250, top: 640 - 250, width: 500, height: 500, borderRadius: 500, border: '3px dashed rgba(255,106,0,0.55)', transform: `rotate(${f * 2}deg)`, opacity: k * (1 - p(f, 80, 8))}} />
      <div style={{position: 'absolute', left: 540 - 200, top: 640 - 200, width: 400, height: 400, transformStyle: 'preserve-3d', transform: `translateZ(${z}px) rotateY(${ry}deg) scale(${sc}) rotateX(8deg)`}}>
        {Array.from({length: 14}).map((_, i) => {
          const t = (14 - i) / 14;
          return (
            <svg key={i} width={400} height={400} viewBox="0 0 400 400" style={{position: 'absolute', left: 0, top: 0, transform: `translateZ(${-t * D}px)`}}>
              <path d={TRI} fill={`hsl(${22 - t * 4} 100% ${(24 - t * 18) + lit * 6}%)`} />
            </svg>
          );
        })}
        <svg width={400} height={400} viewBox="0 0 400 400" style={{position: 'absolute', left: 0, top: 0, transform: 'translateZ(1px)'}}>
          <defs>
            <linearGradient id="af" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.35" stopColor="#e6ebef" />
              <stop offset="0.5" stopColor="#7f8a95" />
              <stop offset="0.62" stopColor="#d6dde3" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="ai" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFA13A" />
              <stop offset="0.5" stopColor="#FF6A00" />
              <stop offset="1" stopColor="#B83F00" />
            </linearGradient>
          </defs>
          <path d={TRI} fill="url(#af)" />
          <path d="M200 92 L330 312 L70 312 Z" fill="url(#ai)" opacity={0.55 + lit * 0.45} transform="translate(0,6)" />
          <rect x={184} y={150} width={32} height={96} rx={14} fill="#120700" />
          <circle cx={200} cy={282} r={19} fill="#120700" />
        </svg>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------- LOGO */
const Logo: React.FC<{landAt: number; top: number; target: number; max: number; shineAt?: number; barW?: number}> = ({landAt, top, target, max, shineAt, barW}) => {
  const f = useCurrentFrame();
  const size = fit('MULTI CAR', target, max);
  const bw = barW ?? target;
  const bk = p(f, landAt - 6, 14, expo);
  const bs = shineAt !== undefined ? clamp((f - shineAt - 6) / 20, -0.3, 1.3) : -1;
  const bh = size * 0.46;
  return (
    <>
      <Block top={top}>
        <Text3D text="MULTI CAR" size={size} landAt={landAt} stag={2} mode="deep" shineAt={shineAt} lookFn={(i) => (i < 5 ? 'chrome' : 'orange')} />
      </Block>
      <Block top={top + size * 1.08} z={6}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{position: 'relative', overflow: 'hidden', width: bw * bk, height: bh, background: `linear-gradient(180deg, #FF8A1F, ${OR} 55%, #C84800)`, borderRadius: 6, boxShadow: `0 0 50px rgba(255,106,0,0.7)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: bh * 0.66, color: '#0a0a0a', letterSpacing: '0.22em', marginRight: '-0.22em', whiteSpace: 'nowrap', opacity: bk > 0.9 ? 1 : 0}}>VEÍCULOS</span>
            {bs > -0.3 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${bs * 100 - 15}%`, width: '30%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent)'}} />}
          </div>
        </div>
      </Block>
    </>
  );
};

/* ------------------------------------------------------------------- CARS */
const Car: React.FC<{variant: 0 | 1; flip?: boolean; w: number}> = ({variant, flip, w}) => {
  const body = variant === 0
    ? 'M10 98 L18 80 Q24 70 44 66 L104 58 Q138 28 190 26 L254 26 Q296 30 322 58 L372 66 Q392 70 396 88 L398 102 Q398 108 390 108 L12 108 Z'
    : 'M10 98 L14 74 Q20 62 40 58 L96 52 Q112 22 160 18 L292 18 Q330 22 350 52 L376 58 Q394 62 398 82 L400 102 Q400 108 392 108 L12 108 Z';
  const win = variant === 0 ? 'M112 60 Q140 34 188 33 L250 33 Q284 36 306 60 Z' : 'M104 54 Q120 28 162 25 L290 25 Q322 28 340 54 Z';
  return (
    <svg width={w} height={w * 0.36} viewBox="0 0 410 148" style={{transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible'}}>
      <defs>
        <linearGradient id={`cb${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3a" /><stop offset="0.45" stopColor="#151515" /><stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="cw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6b7480" /><stop offset="1" stopColor="#0f1114" /></linearGradient>
      </defs>
      <ellipse cx={205} cy={116} rx={200} ry={9} fill="rgba(255,106,0,0.35)" />
      <path d={body} fill={`url(#cb${variant})`} stroke="#FFB45C" strokeWidth={2.2} />
      <path d={win} fill="url(#cw)" />
      <path d={variant === 0 ? 'M30 84 L384 84' : 'M30 82 L388 82'} stroke="rgba(255,150,60,0.9)" strokeWidth={2.5} />
      <path d={body} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1} strokeDasharray="60 500" />
      <rect x={374} y={78} width={20} height={7} rx={3} fill="#fff" /><rect x={374} y={78} width={20} height={7} rx={3} fill="#fff" style={{filter: 'blur(5px)'}} />
      {[96, 312].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={106} r={27} fill="#080808" stroke="#2a2a2a" strokeWidth={3} />
          <circle cx={cx} cy={106} r={16} fill="#9aa3ad" /><circle cx={cx} cy={106} r={9} fill="#2b2f34" />
          <circle cx={cx} cy={106} r={21} fill="none" stroke="#FF6A00" strokeWidth={1.6} />
        </g>
      ))}
    </svg>
  );
};

/* -------------------------------------------------------------- SCENES */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const sz1 = fit('ATENÇÃO,', 900, 170);
  const sz2 = fit('LUZIÂNIA-GO!', 940, 140);
  return (
    <>
      <Alert3D />
      <Block top={880}><Text3D text="ATENÇÃO," size={sz1} landAt={54} look="chrome" stag={2.5} /></Block>
      <Block top={880 + sz1 * 1.12}><Text3D text="LUZIÂNIA-GO!" size={sz2} landAt={70} look="orange" stag={2} mode="deep" shineAt={72} /></Block>
    </>
  );
};

const S2: React.FC = () => {
  const m = fit('MEGA', 820, 330);
  const fe = fit('FEIRÃO', 840, 240);
  const an = fit('DE ANIVERSÁRIO', 800, 96);
  return (
    <>
      <Panel at={92} top={210} h={1230} />
      <Block top={290}><Text3D text="MEGA" size={m} landAt={110} look="orange" stag={3} shineAt={118} /></Block>
      <Block top={290 + m * 1.02}><Text3D text="FEIRÃO" size={fe} landAt={124} look="chrome" stag={3} shineAt={130} /></Block>
      <Block top={290 + m * 1.02 + fe * 1.06}><Text3D text="DE ANIVERSÁRIO" size={an} landAt={142} look="white" stag={1.2} mode="rise" /></Block>
      <Logo landAt={160} top={1010} target={800} max={170} shineAt={166} barW={800} />
    </>
  );
};

const S3: React.FC = () => {
  const f = useCurrentFrame();
  const t = p(f, 197, 16, io);
  const flip = (1 - p(f, 206, 18, expo)) * -80;
  const a = fit('13, 14 E 15', 880, 220);
  const b = fit('DE NOVEMBRO', 760, 130);
  const c = fit('NA MULTI CAR VEÍCULOS', 800, 74);
  const d = fit('LUZIÂNIA-GO', 760, 120);
  const draw = 1 - p(f, 224, 8);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: draw}}>
        <rect x={60} y={300} width={960} height={1050} fill="none" stroke="#FFB45C" strokeWidth={5} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - t} style={{filter: 'drop-shadow(0 0 12px #FF6A00)'}} />
        <path d="M60 300 H1020 M60 1130 H1020" stroke="#fff" strokeWidth={3} pathLength={1} strokeDasharray="0.1 1" strokeDashoffset={-(t * 1.1) + 0.1} />
      </svg>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${flip}deg)`}}>
        <Panel at={206} top={300} h={830} />
        <Block top={400}><Text3D text="13, 14 E 15" size={a} landAt={232} look="orange" stag={2.2} shineAt={240} /></Block>
        <Block top={400 + a * 1.1}><Text3D text="DE NOVEMBRO" size={b} landAt={242} look="chrome" stag={1.6} mode="rise" /></Block>
        <Block top={400 + a * 1.1 + b * 1.4}><div style={{width: 600 * p(f, 244, 14), height: 5, margin: '0 auto', background: `linear-gradient(90deg, transparent, ${OR}, transparent)`, boxShadow: `0 0 20px ${OR}`}} /></Block>
        <Block top={400 + a * 1.1 + b * 1.4 + 40}><Text3D text="NA MULTI CAR VEÍCULOS" size={c} landAt={254} look="white" stag={1} mode="rise" /></Block>
        <Block top={400 + a * 1.1 + b * 1.4 + 40 + c * 1.5}><Text3D text="LUZIÂNIA-GO" size={d} landAt={264} look="orange" stag={1.6} mode="deep" /></Block>
      </div>
    </>
  );
};

const S4: React.FC = () => {
  const a = fit('PRIMEIRA', 900, 190);
  const b = fit('PARCELA', 840, 190);
  const c = fit('SÓ DEPOIS', 880, 190);
  const d = fit('DO CARNAVAL', 940, 150);
  const f = useCurrentFrame();
  return (
    <>
      <Block top={330}><Text3D text="PRIMEIRA" size={a} landAt={294} look="white" stag={2.4} depth={0.34} /></Block>
      <Block top={330 + a * 1.04}><Text3D text="PARCELA" size={b} landAt={302} look="white" stag={2.4} depth={0.34} /></Block>
      <div style={{position: 'absolute', left: 140, right: 140, top: 330 + a * 1.04 + b * 1.25, height: 5, background: `linear-gradient(90deg, transparent, ${OR}, transparent)`, opacity: p(f, 310, 14), boxShadow: `0 0 24px ${OR}`}} />
      <Block top={900}><Text3D text="SÓ DEPOIS" size={c} landAt={322} look="orange" stag={2.4} mode="left" shineAt={326} depth={0.3} /></Block>
      <Block top={900 + c * 1.05}><Text3D text="DO CARNAVAL" size={d} landAt={334} look="orange" stag={2} mode="right" shineAt={338} depth={0.3} /></Block>
    </>
  );
};

const S5: React.FC = () => {
  const f = useCurrentFrame();
  const n12 = 400;
  const pp = fit('PRIMEIRAS PARCELAS', 880, 96);
  const ap = fit('POR APENAS', 560, 64);
  const rs = 130;
  const v = fit('299,99', 800, 270);
  const bk = fit('PELO BANCO VOLKSWAGEN', 860, 66);
  const pulse = f > 420 ? 1 + 0.015 * Math.sin((f - 420) / 5) : 1;
  return (
    <>
      <Panel at={359} top={230} h={1330} />
      <Block top={270}><Text3D text="12" size={n12} landAt={378} look="chrome" stag={4} shineAt={386} depth={0.24} /></Block>
      <Block top={270 + n12 * 0.98}><Text3D text="PRIMEIRAS PARCELAS" size={pp} landAt={392} look="white" stag={1} mode="rise" /></Block>
      <Block top={800}><Text3D text="POR APENAS" size={ap} landAt={402} look="chrome" stag={1.4} mode="rise" /></Block>
      <Block top={880}><Text3D text="R$" size={rs} landAt={410} look="white" stag={3} /></Block>
      <Block top={880 + rs * 0.95} z={40}>
        <div style={{transform: `scale(${pulse})`, transformStyle: 'preserve-3d'}}>
          <Text3D text="299,99" size={v} landAt={418} look="orange" stag={3} shineAt={424} depth={0.3} />
        </div>
      </Block>
      <Block top={880 + rs * 0.95 + v * 1.1}><Text3D text="PELO BANCO VOLKSWAGEN" size={bk} landAt={432} look="chrome" stag={0.9} mode="rise" /></Block>
    </>
  );
};

const S6: React.FC = () => {
  const a = fit('R$ 5.000', 940, 260);
  const b = fit('DE BÔNUS', 800, 170);
  const c = fit('NO SEU USADO', 780, 92);
  const d = fit('NA TROCA', 560, 92);
  return (
    <>
      <Panel at={446} top={400} h={760} />
      <Block top={500}>
        <Text3D text="R$ 5.000" size={a} landAt={468} look="orange" stag={3} mode="expand" shineAt={472} depth={0.3}
          lookFn={(i) => (i < 2 ? 'white' : 'orange')} />
      </Block>
      <Block top={500 + a * 1.1}><Text3D text="DE BÔNUS" size={b} landAt={478} look="chrome" stag={2.2} mode="deep" shineAt={484} /></Block>
      <Block top={500 + a * 1.1 + b * 1.3}><Text3D text="NO SEU USADO" size={c} landAt={490} look="white" stag={1} mode="rise" /></Block>
      <Block top={500 + a * 1.1 + b * 1.3 + c * 1.1}><Text3D text="NA TROCA" size={d} landAt={496} look="white" stag={1.2} mode="rise" /></Block>
    </>
  );
};

const S7: React.FC = () => {
  const f = useCurrentFrame();
  const lf = f - 504;
  const ck = p(f, 506, 28, expo);
  const out = p(f, 584, 14, io);
  const carsOut = out;
  const a = fit('MAIS DE 300 CARROS', 860, 88);
  const a2 = fit('EM ESTOQUE', 860, 120);
  const b = fit('TODA LINHA ZERO KM', 860, 90);
  const c1 = fit('BYD • CITROËN • PEUGEOT', 880, 62);
  const c2 = fit('FORD • NISSAN', 600, 62);
  const e = fit('E TAMBÉM CARROS SEMI-NOVOS', 860, 56);
  return (
    <>
      <Block top={170} z={-30} left={0} right={0}>
        <div style={{position: 'absolute', left: -460 + 420 * ck, top: 0, transformStyle: 'preserve-3d', transform: `rotateY(28deg) translateZ(${30 - out * 400}px)`, opacity: 1 - carsOut * 0.6}}>
          <Car variant={0} w={560} />
        </div>
        <div style={{position: 'absolute', right: -460 + 420 * ck, top: 80, transformStyle: 'preserve-3d', transform: `rotateY(-28deg) translateZ(${30 - out * 400}px)`, opacity: 1 - carsOut * 0.6}}>
          <Car variant={1} w={560} flip />
        </div>
      </Block>
      <Panel at={512} top={420} h={800} closeAt={584} />
      <div style={{opacity: 1 - out * 1.2, transformStyle: 'preserve-3d'}}>
        {out < 0.95 && (
          <>
            <Block top={480}><Text3D text="MAIS DE 300 CARROS" size={a} landAt={520} look="white" stag={1} mode="rise" /></Block>
            <Block top={480 + a * 1.08}><Text3D text="EM ESTOQUE" size={a2} landAt={528} look="chrome" stag={2} shineAt={532} /></Block>
            <Block top={480 + a * 1.08 + a2 * 1.25}><Text3D text="TODA LINHA ZERO KM" size={b} landAt={540} look="orange" stag={1.4} shineAt={546} mode="left" /></Block>
            <Block top={480 + a * 1.08 + a2 * 1.25 + b * 1.45}><Text3D text="BYD • CITROËN • PEUGEOT" size={c1} landAt={560} look="white" stag={0.8} mode="rise" /></Block>
            <Block top={480 + a * 1.08 + a2 * 1.25 + b * 1.45 + c1 * 1.15}><Text3D text="FORD • NISSAN" size={c2} landAt={566} look="white" stag={0.8} mode="rise" /></Block>
            <Block top={480 + a * 1.08 + a2 * 1.25 + b * 1.45 + c1 * 1.15 + c2 * 1.7}><Text3D text="E TAMBÉM CARROS SEMI-NOVOS" size={e} landAt={576} look="chrome" stag={0.7} mode="rise" /></Block>
          </>
        )}
      </div>
      {f >= 592 && (
        <>
          <div style={{position: 'absolute', left: 540 - 420, top: 880 - 300, width: 840, height: 640, borderRadius: 840, background: `radial-gradient(circle, rgba(255,106,0,${0.45 * p(f, 596, 12)}), rgba(0,0,0,0) 70%)`}} />
          <Logo landAt={604} top={720} target={880} max={220} shineAt={612} barW={880} />
        </>
      )}
    </>
  );
};

export const Ad: React.FC = () => {
  const f = useCurrentFrame();
  const fadeOut = p(f, 622, 8, io);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Background />
      <Circuits />
      <HUD />
      <Scene i={0} cam={(t) => [lerp(0, 2, t), lerp(-4, 6, t), lerp(-200, 0, t)]}><S1 /></Scene>
      <Scene i={1} cam={(t) => [lerp(7, -2, t), lerp(-16, 14, t), lerp(-160, 90, t)]}><S2 /></Scene>
      <Scene i={2} cam={(t) => [lerp(5, 0, t), lerp(10, -6, t), lerp(-220, 70, t)]}><S3 /></Scene>
      <Scene i={3} cam={(t) => [lerp(2, -3, t), lerp(-8, 8, t), lerp(-160, 60, t)]}><S4 /></Scene>
      <Scene i={4} cam={(t) => [lerp(6, -2, t), lerp(10, -8, t), lerp(-200, 80, t)]}><S5 /></Scene>
      <Scene i={5} cam={(t) => [lerp(3, 0, t), lerp(-6, 5, t), lerp(-500, 170, t)]}><S6 /></Scene>
      <Scene i={6} cam={(t) => [lerp(4, 0, t), lerp(-16, 12, t), lerp(-150, 180, t)]}><S7 /></Scene>
      <Sparks />
      <Streaks />
      <Flash />
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
