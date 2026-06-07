import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   PORTALAPP  ·  V7  ·  NOIR EDITORIAL
   Three portals: CLIENT · HELPER · ADMIN
   Design: High-contrast zinc + neon accents · Instrument Serif + Geist
═══════════════════════════════════════════════════════════════════════ */

/* ── SVG ICON LIBRARY (no emoji in UI) ── */
const I = {
  dash:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" fill="currentColor" fillOpacity="0.12"/><rect x="14" y="3" width="7" height="5" rx="1.5" fill="currentColor" fillOpacity="0.12"/><rect x="14" y="12" width="7" height="9" rx="1.5" fill="currentColor" fillOpacity="0.12"/><rect x="3" y="16" width="7" height="5" rx="1.5" fill="currentColor" fillOpacity="0.12"/></svg>,
  tasks:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" fillOpacity="0.12"/><path d="M9 11l2 2 4-4"/></svg>,
  post:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.12"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  map:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor" fillOpacity="0.12"/><circle cx="12" cy="10" r="3" fill="#FFFFFF"/></svg>,
  pay:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.12"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="14" x2="10" y2="14"/></svg>,
  profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="currentColor" fillOpacity="0.12"/><circle cx="12" cy="7" r="4" fill="currentColor" fillOpacity="0.12"/></svg>,
  settings:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.12"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  search:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" fill="currentColor" fillOpacity="0.12"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  jobs:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.12"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  earn:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.12"/><line x1="12" y1="6" x2="12" y2="18"/><path d="M17 9H11.5a2.5 2.5 0 0 0 0 5H13a2.5 2.5 0 0 1 0 5H7"/></svg>,
  sched:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="currentColor" fillOpacity="0.12"/><circle cx="9" cy="7" r="4" fill="currentColor" fillOpacity="0.12"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  dispute: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.12"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  finance: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12"/><path d="M7 17l5-5 3 3 5-5"/></svg>,
  analyt:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10" strokeWidth="2.5"/><path d="M12 20V4" strokeWidth="2.5"/><path d="M6 20v-6" strokeWidth="2.5"/><line x1="3" y1="20" x2="21" y2="20" strokeWidth="1.8"/></svg>,
  bell:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="currentColor" fillOpacity="0.12"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  logout:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  close:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  star:    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  arrow:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  chat:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" fillOpacity="0.12"/></svg>,
  shield:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.12"/></svg>,
  route:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.12"/><circle cx="18" cy="6" r="3" fill="currentColor" fillOpacity="0.12"/><path d="M9 15c0-4 6-2 6-6"/></svg>,
  award:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" fill="currentColor" fillOpacity="0.12"/><path d="M15.47 14L19 22l-7-3-7 3 3.53-8"/></svg>,
  activity:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  eye:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="currentColor" fillOpacity="0.12"/><circle cx="12" cy="12" r="3" fill="#FFFFFF"/></svg>,
  trash:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="currentColor" fillOpacity="0.12"/></svg>,
  lock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.12"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  copy:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" fill="currentColor" fillOpacity="0.12"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  warn:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="currentColor" fillOpacity="0.12"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.12"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  review:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" fillOpacity="0.12"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/></svg>,
  addrbk:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12"/><path d="M16 8h.01"/><path d="M16 12h.01"/><path d="M16 16h.01"/><path d="M8 8h4"/><path d="M8 12h4"/><path d="M8 16h4"/></svg>,
  cert:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" fillOpacity="0.12"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h6"/></svg>,
  streak:  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  leaderb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.12"/><path d="M7 17v-4"/><path d="M12 17V7"/><path d="M17 17v-7"/></svg>,
  log:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.12"/><path d="M9 6h6"/><path d="M9 10h6"/><path d="M9 14h6"/><path d="M9 18h4"/></svg>,
  perm:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.12"/><circle cx="12" cy="11" r="3"/><line x1="12" y1="14" x2="12.01" y2="14"/></svg>,
  menu:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  logo:    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{overflow:"visible"}}>
             <defs>
               <linearGradient id="logoC" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#818CF8"/><stop offset="100%" stopColor="#4F46E5"/></linearGradient>
               <linearGradient id="logoH" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#059669"/></linearGradient>
               <linearGradient id="logoA" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#38BDF8"/><stop offset="100%" stopColor="#0284C7"/></linearGradient>
               <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
             </defs>
             <g filter="url(#logoGlow)">
               <path d="M12 13 L21 17.5 L12 22 L3 17.5 Z" fill="url(#logoA)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
               <path d="M12 8 L21 12.5 L12 17 L3 12.5 Z" fill="url(#logoH)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5"/>
               <path d="M12 3 L21 7.5 L12 12 L3 7.5 Z" fill="url(#logoC)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
             </g>
           </svg>,
};
const Ic = ({ n, s=14, c }) => <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:s,height:s,flexShrink:0,color:c||"currentColor"}}>{I[n]}</span>;

/* ── CSS ── */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');

:root {
  /* Vibrant Light Brand Glassmorphic Theme - Elegant, clean, premium */
  --z950: #EEF2FF;  /* Pastel Lavender-Blue canvas base */
  --z900: rgba(255, 255, 255, 0.65); /* Frosted clean translucent white glass */
  --z800: rgba(255, 255, 255, 0.85); /* Medium frosted glass elements */
  --z700: rgba(255, 255, 255, 0.95); /* Soft frosted active backdrops */
  --z600: rgba(15, 23, 42, 0.08); /* Division borders and light glass outlines */
  --z500: #64748B;  /* Accessible slate-500 for sub-labels */
  --z400: #334155;  /* Accessible slate-700 for description text */
  --z300: #0F172A;  /* Accessible slate-900 for headings / main titles */
  --z200: #0F172A;  /* Absolute rich slate-900 for titles */
  --z100: #0F172A;  /* Slate-900 for high-contrast text */
  --white: #FFFFFF;

  /* Luxury Role Color Accents with tailored glows */
  --client-ac:  #4F46E5; /* Royal Indigo */
  --client-glow: rgba(79, 70, 229, 0.15);
  --client-grad: linear-gradient(135deg, #4F46E5 0%, #818CF8 100%);
  
  --helper-ac:  #059669; /* Rich Emerald */
  --helper-glow: rgba(5, 150, 105, 0.15);
  --helper-grad: linear-gradient(135deg, #059669 0%, #34D399 100%);
  
  --admin-ac:   #0284C7; /* Cyber Cerulean Blue */
  --admin-glow: rgba(2, 132, 199, 0.15);
  --admin-grad: linear-gradient(135deg, #0284C7 0%, #38BDF8 100%);

  --ac:   var(--role-ac, var(--client-ac));
  --glow: var(--role-glow, var(--client-glow));
  --ac-grad: var(--role-grad, var(--client-grad));

  /* Delicate Glass Borders */
  --bd:  rgba(15, 23, 42, 0.08);  /* Glass thin divider */
  --bd2: rgba(15, 23, 42, 0.09);  /* Glass card outline */
  --bd3: rgba(79, 70, 229, 0.22);  /* Interactive hover highlight */

  --r:8px;--r2:12px;--r3:18px;--r4:24px;--r5:36px;
}

[data-role="client"]{--role-ac:var(--client-ac);--role-glow:var(--client-glow);--role-grad:var(--client-grad);--ac:var(--client-ac);--glow:var(--client-glow);--ac-grad:var(--client-grad);}
[data-role="helper"]{--role-ac:var(--helper-ac);--role-glow:var(--helper-glow);--role-grad:var(--helper-grad);--ac:var(--helper-ac);--glow:var(--helper-glow);--ac-grad:var(--helper-grad);}
[data-role="admin"] {--role-ac:var(--admin-ac);--role-glow:var(--admin-glow);--role-grad:var(--admin-grad);--ac:var(--admin-ac);--glow:var(--admin-glow);--ac-grad:var(--admin-grad);}

html,body,#root{height:100%;overflow:hidden;}
body{font-family:'Outfit','Geist',ui-sans-serif,system-ui,sans-serif;background:linear-gradient(135deg, #EEF2FF 0%, #ECFDF5 50%, #F0F9FF 100%);color:var(--z300);-webkit-font-smoothing:antialiased;}
input,select,textarea,button{font-family:inherit;}

::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(15, 23, 42, 0.12);border-radius:99px;}
::-webkit-scrollbar-thumb:hover{background:rgba(15, 23, 42, 0.24);}
::selection{background:var(--ac);color:#FFFFFF;}

/* ════ KEYFRAMES ════ */
@keyframes spin     {to{transform:rotate(360deg);}}
@keyframes fadeUp   {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes slideUp  {from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes pinBob   {0%,100%{transform:translate(-50%,-100%) translateY(0)}50%{transform:translate(-50%,-100%) translateY(-8px)}}
@keyframes blink    {0%,49%{opacity:1}50%,99%{opacity:0}}
@keyframes countUp  {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes orb1     {0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-50px) scale(1.15)}66%{transform:translate(-50px,80px) scale(.9)}}
@keyframes orb2     {0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-100px,40px) scale(.85)}66%{transform:translate(70px,-90px) scale(1.2)}}
@keyframes orb3     {0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,70px) scale(1.1)}}
@keyframes float3d  {0%,100%{transform:perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)}25%{transform:perspective(800px) rotateX(2deg) rotateY(-3deg) translateZ(8px)}50%{transform:perspective(800px) rotateX(-1deg) rotateY(2deg) translateZ(4px)}75%{transform:perspective(800px) rotateX(3deg) rotateY(1deg) translateZ(12px)}}
@keyframes card3dIn {from{opacity:0;transform:perspective(600px) rotateY(-20deg) translateZ(-40px)}to{opacity:1;transform:perspective(600px) rotateY(0deg) translateZ(0)}}
@keyframes shimmer  {0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes rotateY  {from{transform:perspective(600px) rotateY(0deg)}to{transform:perspective(600px) rotateY(360deg)}}
@keyframes scaleIn  {from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes glowPulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.8;transform:scale(1.05)}}
@keyframes slideInL {from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes ripple   {to{transform:scale(4);opacity:0}}
@keyframes navHi    {from{width:0}to{width:100%}}

/* FaceID scanning animation */
@keyframes faceIdScan {
  0% { transform: scale(0.95); opacity: 0.4; border-color: rgba(52, 211, 153, 0.2); }
  50% { transform: scale(1.02); opacity: 1; border-color: rgba(52, 211, 153, 0.85); box-shadow: 0 0 25px rgba(52, 211, 153, 0.4); }
  100% { transform: scale(0.95); opacity: 0.4; border-color: rgba(52, 211, 153, 0.2); }
}

/* ════ BUTTONS ════ */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:var(--r2);font-size:.825rem;font-weight:600;cursor:pointer;border:none;transition:all .22s cubic-bezier(.4,0,.2,1);white-space:nowrap;letter-spacing:.01em;line-height:1;position:relative;overflow:hidden;}
.btn:disabled{opacity:.4;cursor:not-allowed;pointer-events:none;}

/* Primary: glowing role gradient background */
.btn-p{background:var(--ac-grad);color:#FFFFFF !important;font-weight:700;box-shadow:0 4px 14px var(--glow), inset 0 1px 0 rgba(255,255,255,0.2);}
.btn-p:hover:not(:disabled){transform:translateY(-1.5px);filter:brightness(1.1);box-shadow:0 8px 24px var(--glow), 0 4px 12px rgba(0,0,0,0.1);}
.btn-p:active{transform:translateY(0.5px);}

/* Secondary: high-contrast translucent light glass */
.btn-g{background:rgba(255,255,255,0.8) !important;color:#334155 !important;border:1px solid rgba(15,23,42,0.08) !important;font-weight:600;box-shadow:0 2px 4px rgba(15,23,42,0.02);backdrop-filter:blur(10px);transition:all .2s;}
.btn-g:hover:not(:disabled){background:rgba(255,255,255,0.95) !important;color:#0F172A !important;transform:translateY(-1.5px);border-color:rgba(15,23,42,0.18) !important;box-shadow:0 6px 16px rgba(15,23,42,0.06);}
.btn-g:active{transform:translateY(0.5px);}

/* Danger */
.btn-d{background:transparent !important;color:#DC2626 !important;border:1px solid rgba(220,38,38,0.2) !important;font-weight:600;}
.btn-d:hover:not(:disabled){background:rgba(220,38,38,0.06) !important;border-color:rgba(220,38,38,0.4) !important;}

/* Ghost icon buttons */
.btn-ghost{background:none !important;border:none !important;color:var(--z500) !important;cursor:pointer;padding:6px;border-radius:var(--r);transition:all .18s;display:inline-flex;align-items:center;justify-content:center;}
.btn-ghost{background:rgba(15, 23, 42, 0.05) !important;color:var(--z100) !important;}

/* Social buttons */
.btn-social{display:flex !important;align-items:center !important;justify-content:center !important;gap:10px;width:100%;padding:12px 18px;border-radius:var(--r2);border:1px solid rgba(15,23,42,0.08) !important;background:rgba(255,255,255,0.8) !important;color:#334155 !important;font-size:.875rem;font-weight:600;cursor:pointer;transition:all .22s;box-shadow:0 4px 12px rgba(15,23,42,0.02);backdrop-filter:blur(10px);}
.btn-social:hover{background:rgba(255,255,255,0.95) !important;color:#0F172A !important;transform:translateY(-1.5px);border-color:rgba(15,23,42,0.18) !important;box-shadow:0 8px 20px rgba(15,23,42,0.06);}
.btn-social svg{width:18px;height:18px;flex-shrink:0;}

.btn-sm{padding:8px 14px;font-size:.78rem;}
.btn-xs{padding:6px 10px;font-size:.72rem;}
.btn-fw{width:100%;}
.btn-icon{width:32px;height:32px;padding:0;}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(15,23,42,.1);border-top-color:var(--ac);border-radius:50%;animation:spin .65s linear infinite;}

/* ════ INPUTS ════ */
.iw{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
.il{font-size:.78rem;font-weight:700;color:var(--z500);letter-spacing:.06em;text-transform:uppercase;}
.ii{width:100%;padding:11px 14px;background:rgba(255, 255, 255, 0.85);border:1px solid rgba(15,23,42,0.12);border-radius:var(--r2);color:#0F172A;font-size:.875rem;outline:none;transition:border-color .2s,box-shadow .2s,background .2s;line-height:1.5;box-shadow:inset 0 1px 2px rgba(15,23,42,0.04);backdrop-filter:blur(6px);}
.ii:focus{border-color:var(--ac);box-shadow:0 0 0 3px var(--glow),0 6px 20px var(--glow);background:#FFFFFF;}
.ii::placeholder{color:var(--z500);}
.ii:hover:not(:focus){border-color:rgba(15,23,42,0.22);background:rgba(255, 255, 255, 0.95);}
.ii-err{border-color:#EF4444!important;box-shadow:0 0 0 3px rgba(239,68,68,.18)!important;}
.ii-wrap{position:relative;}
.ii-prefix{position:absolute;left:14px;top:50%;transform:translateY(-50%);display:flex;align-items:center;color:var(--z500);pointer-events:none;}
.ii-prefix~.ii{padding-left:38px;}
.ii-suffix{position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--z500);background:none;border:none;display:flex;align-items:center;padding:4px;border-radius:var(--r);transition:all .18s;}
.ii-suffix:hover{color:#0F172A;background:rgba(15,23,42,0.05);}
.fe{font-size:.72rem;color:#EF4444;display:flex;align-items:center;gap:4px;margin-top:4px;}
textarea.ii{resize:vertical;line-height:1.6;}
select.ii{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-size:10px;}

/* ════ AUTH ════ */
.auth-root{height:100vh;display:flex;background:linear-gradient(135deg, #EEF2FF 0%, #ECFDF5 50%, #F0F9FF 100%);overflow:hidden;position:relative;}
.auth-root.landing-mode {
  display: block;
  overflow-y: auto;
  height: 100vh;
}

/* Dedicated Centered Auth Screen Wrapper */
.auth-centered-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  z-index: 5;
  overflow-y: auto;
}

/* Landing Page Structure */
.landing-root {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 92px 24px 48px;
  position: relative;
  z-index: 2;
  animation: fadeUp .5s cubic-bezier(.16,1,.3,1);
}
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--bd2);
  display: flex;
  align-items: center;
  z-index: 1000;
  transition: all .25s;
  box-shadow: 0 4px 30px rgba(15,23,42,0.04);
}
.landing-nav-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.landing-nav::after{
  content:'';
  position:absolute;
  bottom:-1px;
  left:10%;
  right:10%;
  height:1px;
  background:linear-gradient(90deg,transparent,var(--ac),transparent);
  opacity:.8;
}
.landing-hero {
  text-align: center;
  padding: 40px 0 24px;
}
.landing-hero-eyebrow {
  font-size: .84rem;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--z400);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.landing-hero-eyebrow::before, .landing-hero-eyebrow::after {
  content: '';
  width: 24px;
  height: 1px;
  background: var(--ac);
}
.landing-hero-title {
  font-size: clamp(2.6rem, 7vh, 4.2rem);
  font-weight: 900;
  letter-spacing: -.04em;
  line-height: 1.1;
  color: var(--z100);
  margin-bottom: 20px;
}
.landing-hero-title strong {
  font-weight: 900;
  background: var(--ac-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 30px var(--glow));
}
.landing-hero-desc {
  font-size: 1.1rem;
  color: var(--z400);
  line-height: 1.7;
  max-width: 720px;
  margin: 0 auto 30px;
}
.landing-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px auto 30px;
  max-width: 1200px;
  width: 100%;
  perspective: 800px;
}
@media(max-width: 820px) {
  .landing-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
@media(max-width: 480px) {
  .landing-stats-grid {
    grid-template-columns: 1fr;
  }
}
.landing-main-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 36px;
  margin: 24px auto 0;
  max-width: 1200px;
  width: 100%;
  align-items: start;
}
@media(max-width: 960px) {
  .landing-main-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

/* Animated nebula flowing orbs */
.auth-orbs{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.orb{position:absolute;border-radius:50%;filter:blur(100px);animation-timing-function:ease-in-out;animation-iteration-count:infinite;opacity:0.8;mix-blend-mode:multiply;}
.orb1{width:700px;height:700px;background:radial-gradient(circle, rgba(129,140,248,0.28) 0%, transparent 70%);top:-100px;left:-100px;animation:orb1 20s infinite;}
.orb2{width:600px;height:600px;background:radial-gradient(circle, rgba(52,211,153,0.24) 0%, transparent 70%);bottom:-100px;right:-100px;animation:orb2 24s infinite;}
.orb3{width:500px;height:500px;background:radial-gradient(circle, rgba(56,189,248,0.26) 0%, transparent 70%);top:25%;left:25%;animation:orb3 16s infinite;}

.auth-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(15,23,42,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.015) 1px,transparent 1px);background-size:52px 52px;pointer-events:none;mask-image:radial-gradient(ellipse 85% 85% at 50% 50%,black 40%,transparent 100%);}

/* LEFT PANEL */
.auth-panel-l{flex:1;display:none;padding:40px 52px;flex-direction:column;justify-content:space-between;border-right:1px solid var(--bd);position:relative;overflow-y:auto;z-index:2;}
@media(min-width:960px){.auth-panel-l{display:flex;}}

.auth-eyebrow{font-size:.84rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--z400);display:flex;align-items:center;gap:12px;}
.auth-eyebrow::before{content:'';width:24px;height:1px;background:var(--ac);}
.auth-bighead{font-family:'Outfit','Geist',ui-sans-serif,system-ui,sans-serif;font-size:clamp(2.4rem, 5.5vh, 3.4rem);font-weight:800;letter-spacing:-.04em;line-height:1.15;color:var(--z100);margin:16px 0 20px;max-width:520px;}
.auth-bighead strong{font-weight:900;background:var(--ac-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 35px var(--glow));}
.auth-desc{font-size:1rem;color:var(--z400);line-height:1.7;max-width:480px;margin-bottom:24px;}

/* 3D Feature Cards */
.feature-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:36px;perspective:800px;}
.feature-card{background:rgba(255, 255, 255, 0.65);border:1px solid rgba(15,23,42,0.08);border-radius:var(--r3);padding:20px 24px;animation:float3d 8s ease-in-out infinite;transform-style:preserve-3d;cursor:default;transition:all .25s;box-shadow:0 12px 36px rgba(15,23,42,0.03), inset 0 1px 1px #FFFFFF;backdrop-filter:blur(20px);}
.feature-card:nth-child(2){animation-delay:-2s;}
.feature-card:nth-child(3){animation-delay:-4s;}
.feature-card:nth-child(4){animation-delay:-6s;}
.feature-card:hover{border-color:rgba(79, 70, 229, 0.25);box-shadow:0 16px 40px var(--glow), inset 0 1px 1px #FFFFFF;animation-play-state:paused;transform:perspective(800px) rotateX(-3deg) rotateY(4deg) translateZ(12px)!important;}
.fc-icon{width:36px;height:36px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
.fc-val{font-size:1.65rem;font-weight:800;letter-spacing:-.02em;margin-bottom:2px;color:var(--z100);}
.fc-lbl{font-size:.8rem;color:var(--z500);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-top:2px;}

.auth-footer-stat{display:flex;gap:36px;}
.afs-val{font-size:1.5rem;font-weight:800;letter-spacing:-.03em;line-height:1;color:var(--z100);}
.afs-lbl{font-size:.66rem;color:var(--z500);text-transform:uppercase;letter-spacing:.12em;margin-top:4px;}

/* RIGHT PANEL */
.auth-panel-r{width:100%;max-width:480px;display:flex;align-items:center;justify-content:center;padding:32px;overflow-y:auto;position:relative;background:rgba(255, 255, 255, 0.45);backdrop-filter:blur(28px);border-left:1px solid var(--bd);z-index:3;}
@media(max-width:960px){.auth-panel-r{max-width:100%;background:rgba(255, 255, 255, 0.65);backdrop-filter:blur(28px);border-left:none;}}

.auth-form{width:100%;max-width:420px;background:rgba(255, 255, 255, 0.65);padding:36px;border-radius:var(--r4);border:1px solid rgba(15,23,42,0.08);box-shadow:0 24px 60px rgba(15,23,42,0.05), inset 0 1px 1px #FFFFFF;backdrop-filter:blur(24px);}

.auth-logo-row{display:flex;align-items:center;gap:12px;margin-bottom:32px;}
.auth-logo-mark{width:36px;height:36px;background:var(--ac-grad);border-radius:var(--r2);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px var(--glow);}
.auth-logo-mark svg{width:18px;height:18px;color:#FFFFFF;}
.auth-logo-name{font-size:1.35rem;font-weight:900;letter-spacing:-.03em;color:var(--z100);}
.auth-logo-name span{background:var(--ac-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}

.auth-form-title{font-size:1.85rem;font-weight:900;letter-spacing:-.035em;margin-bottom:6px;line-height:1.2;color:var(--z100);}
.auth-form-sub{font-size:.875rem;color:var(--z400);margin-bottom:24px;line-height:1.7;}

.auth-err{display:flex;align-items:center;gap:8px;background:rgba(239,68,68,.05);border:1px solid rgba(239,68,68,.25);border-radius:var(--r2);padding:11px 14px;font-size:.825rem;color:#EF4444;margin-bottom:16px;animation:scaleIn .2s ease;}

/* SIGN IN BUTTON */
.btn-signin{
  width:100%;padding:14px 22px;
  background: var(--ac-grad) !important;
  color:#FFFFFF !important;
  font-size:.95rem;font-weight:800;letter-spacing:-.01em;
  border:1px solid rgba(255,255,255,0.15) !important;
  border-radius:var(--r2);
  cursor:pointer;
  position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .28s cubic-bezier(.4,0,.2,1);
  box-shadow:0 8px 24px var(--glow), inset 0 1px 0 rgba(255,255,255,0.25);
  margin-top:8px;
}
.btn-signin:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 32px var(--glow), 0 4px 12px rgba(0,0,0,0.1);}
.btn-signin:active{transform:translateY(1px);box-shadow:0 6px 16px var(--glow);}
.btn-signin:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.btn-signin span,.btn-signin svg,.btn-signin *{color:#FFFFFF !important;stroke:#FFFFFF;}
.btn-signin::before{content:'';position:absolute;top:0;left:-100%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .7s ease;}
.btn-signin:hover::before{left:100%;}

/* SOCIAL DIVIDER */
.auth-or{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--z500);font-size:.825rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;}
.auth-or::before,.auth-or::after{content:'';flex:1;height:1px;background:rgba(15,23,42,0.06);}

/* SOCIAL GRID */
.social-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px;}
.social-btn-full{grid-column:1/-1;}

.auth-switch{text-align:center;font-size:.9rem;color:var(--z300);margin-top:20px;}
.auth-switch button{color:var(--ac);font-weight:700;background:none;border:none;cursor:pointer;font-size:.9rem;transition:opacity .15s;}
.auth-switch button:hover{opacity:.8;}
.auth-note{font-size:.8rem;color:var(--z500);text-align:center;margin-top:16px;line-height:1.7;display:flex;align-items:center;justify-content:center;gap:6px;font-weight:500;}

/* PORTAL QUICKFILL */
.portal-cards{display:flex;flex-direction:column;gap:8px;}
.portal-card{display:flex;align-items:center;gap:14px;padding:14px 20px;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(15,23,42,0.06);border-radius:var(--r2);cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;box-shadow:0 2px 4px rgba(15,23,42,0.01);backdrop-filter:blur(12px);}
.portal-card:hover{background:rgba(255, 255, 255, 0.7);transform:translateY(-2px);box-shadow:0 10px 24px rgba(15,23,42,0.04);}
.portal-card.client:hover{border-color:var(--client-ac);box-shadow:0 10px 24px var(--client-glow), inset 0 1px 0 #FFFFFF;}
.portal-card.helper:hover{border-color:var(--helper-ac);box-shadow:0 10px 24px var(--helper-glow), inset 0 1px 0 #FFFFFF;}
.portal-card.admin:hover{border-color:var(--admin-ac);box-shadow:0 10px 24px var(--admin-glow), inset 0 1px 0 #FFFFFF;}
.portal-card-icon{width:36px;height:36px;border-radius:var(--r);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.portal-card-name{font-size:.95rem;font-weight:700;margin-bottom:1px;color:var(--z100);}
.portal-card-creds{font-family:ui-monospace,monospace;font-size:.8rem;color:var(--z400);}
.portal-card-hint{margin-left:auto;font-size:.78rem;font-weight:700;letter-spacing:.04em;padding:4px 12px;border-radius:99px;border:1px solid;opacity:.7;transition:opacity .15s;}
.portal-card:hover .portal-card-hint{opacity:1;}

/* Responsive Sign In Overlay */
.responsive-quick-signin {
  display: none;
  margin-top: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: var(--r2);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 30px rgba(15,23,42,0.04);
}
@media(max-width:960px){
  .responsive-quick-signin {
    display: block;
  }
}

.errand-feed-card{background:rgba(255, 255, 255, 0.4);border:1px solid rgba(15,23,42,0.06);border-radius:var(--r2);padding:12px 14px;font-size:.84rem;box-shadow:0 2px 4px rgba(15,23,42,0.01);transition:all .22s cubic-bezier(.4,0,.2,1);cursor:default;backdrop-filter:blur(10px);}
.errand-feed-card:hover{border-color:rgba(15,23,42,0.18);background:rgba(255, 255, 255, 0.7)!important;transform:translateY(-1.5px);box-shadow:0 8px 20px rgba(15,23,42,0.04);}

/* PWD STRENGTH */
.pwd-bars{display:flex;gap:4px;margin-top:8px;}
.pwd-bar{flex:1;height:3px;border-radius:99px;background:rgba(15,23,42,0.06);transition:background .25s;}
.pwd-bar.w{background:#EF4444;}.pwd-bar.f{background:var(--helper-ac);}.pwd-bar.s{background:#10B981;}
.pwd-hint{font-size:.7rem;color:var(--z400);margin-top:6px;}

/* ════ SHELL ════ */
.shell{height:100vh;display:flex;flex-direction:column;background:linear-gradient(135deg, #EEF2FF 0%, #ECFDF5 50%, #F0F9FF 100%);position:relative;z-index:1;}
.shell > .auth-orbs {
  z-index: 0;
  opacity: 0.85;
}
.shell > .auth-grid {
  z-index: 0;
  opacity: 0.5;
}

/* ── TOPBAR ── */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:54px;flex-shrink:0;background:rgba(255, 255, 255, 0.45);backdrop-filter:blur(32px) saturate(140%);border-bottom:1px solid var(--bd);position:relative;z-index:100;box-shadow:0 4px 20px rgba(15,23,42,0.02);}
.topbar::after{content:'';position:absolute;bottom:-1px;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,var(--ac),transparent);opacity:.8;}
.topbar-l{display:flex;align-items:center;gap:14px;}
.logo-mark{width:30px;height:30px;background:var(--ac-grad);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px var(--glow);}
.logo-mark svg{width:16px;height:16px;color:#FFFFFF;}
.logo-name{font-size:1rem;font-weight:900;letter-spacing:-.025em;color:var(--z100);}
.logo-name span{background:var(--ac-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.role-badge{display:inline-flex;align-items:center;gap:6px;padding:3.5px 12px;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border:1px solid;color:var(--ac);border-color:var(--ac);background:var(--glow);}
.topbar-r{display:flex;align-items:center;gap:10px;}
.top-icon-btn{width:34px;height:34px;border-radius:10px;border:1px solid rgba(15,23,42,0.08);background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--z400);transition:all .2s;position:relative;backdrop-filter:blur(10px);}
.top-icon-btn:hover{background:rgba(255,255,255,0.95);border-color:rgba(15,23,42,0.18);color:var(--z100);transform:translateY(-1.5px);}
.top-notif-dot{position:absolute;top:8px;right:8px;width:5px;height:5px;background:#EF4444;border-radius:50%;border:1.5px solid #FFFFFF;}
.top-av{width:32px;height:32px;border-radius:50%;background:var(--ac-grad);color:#FFFFFF;font-size:.72rem;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;border:2px solid transparent;}
.top-av:hover{border-color:var(--ac);box-shadow:0 0 0 3px var(--glow);transform:scale(1.05);}

/* ── PROFILE DROPDOWN ── */
.pmenu{position:absolute;top:54px;right:20px;background:rgba(255, 255, 255, 0.92);border:1px solid rgba(15, 23, 42, 0.08);border-radius:var(--r4);box-shadow:0 16px 40px rgba(15,23,42,0.08);width:240px;z-index:200;animation:scaleIn .2s cubic-bezier(.16,1,.3,1);overflow:hidden;backdrop-filter:blur(28px);}
.pmenu-hd{padding:18px;border-bottom:1px solid var(--bd);background:rgba(255,255,255,0.2);}
.pmenu-av-row{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.pmenu-av{width:40px;height:40px;border-radius:50%;background:var(--ac-grad);color:#FFFFFF;font-size:.85rem;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 10px var(--glow);}
.pmenu-name{font-size:.95rem;font-weight:700;color:var(--z100);}
.pmenu-email{font-size:.75rem;color:var(--z400);}
.pmenu-role{display:inline-flex;padding:3px 10px;border-radius:99px;font-size:.61rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:var(--glow);color:var(--ac);border:1px solid var(--ac);}
.pmenu-body{padding:8px;}
.pmenu-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r2);cursor:pointer;font-size:.85rem;color:var(--z300);border:none;background:none;width:100%;text-align:left;transition:all .15s;}
.pmenu-item:hover{background:rgba(15, 23, 42, 0.04);color:var(--z100);}
.pmenu-item.danger{color:#EF4444;}
.pmenu-item.danger:hover{background:rgba(239,68,68,0.05);}
.pmenu-sep{height:1px;background:rgba(15, 23, 42, 0.08);margin:6px 8px;}

/* ── SIDEBAR ── */
.layout-body{display:flex;flex:1;overflow:hidden;background:transparent;position:relative;z-index:2;}
.sidebar{width:230px;flex-shrink:0;background:rgba(255, 255, 255, 0.35);border-right:1px solid var(--bd);display:flex;flex-direction:column;overflow-y:auto;backdrop-filter:blur(32px) saturate(140%);}
.sb-top{padding:16px 12px 12px;}
.sb-section{font-size:.62rem;font-weight:800;color:var(--z500);text-transform:uppercase;letter-spacing:.18em;padding:0 12px;margin:20px 0 6px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--r2);cursor:pointer;font-size:.85rem;font-weight:600;color:#475569;border:1px solid transparent;background:none;width:100%;text-align:left;transition:all .24s cubic-bezier(.16,1,.3,1);position:relative;}
.nav-item:hover{background:rgba(255,255,255,0.4);border-color:rgba(15,23,42,0.04);color:#0F172A;transform:translateX(4px);}
.nav-item:hover .nav-ic{background:rgba(255,255,255,0.6);color:#0F172A;}
.nav-item.active{background:rgba(255, 255, 255, 0.75);color:var(--ac);font-weight:800;border-color:rgba(15,23,42,0.08);box-shadow:0 4px 15px rgba(15,23,42,0.04), inset 0 1px 0 #FFFFFF, 0 0 14px var(--glow);transform:translateX(6px);}
.nav-item.active::before{content:'';position:absolute;left:-1px;top:25%;height:50%;width:3.5px;background:var(--ac);border-radius:99px;box-shadow:0 0 8px var(--ac);transition:all .24s;}
.nav-ic{width:28px;height:28px;border-radius:8px;background:rgba(15, 23, 42, 0.04);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .24s;color:#64748B;}
.nav-item.active .nav-ic{background:var(--ac-grad);color:#FFFFFF;box-shadow:0 4px 12px var(--glow);transform:scale(1.05);}
.nav-badge{margin-left:auto;background:#EF4444;color:#FFFFFF;font-size:.6rem;font-weight:900;padding:2px 6px;border-radius:99px;min-width:18px;text-align:center;}
.nav-badge.green{background:#10B981;color:#FFFFFF;}
.sb-foot{margin-top:auto;border-top:1px solid var(--bd);padding:16px 12px;}
.sb-user-card{display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,255,255,0.4);border:1px solid rgba(15,23,42,0.06);border-radius:var(--r2);margin-bottom:8px;box-shadow:inset 0 1px 0 #FFFFFF;}
.sb-uav{width:30px;height:30px;border-radius:50%;background:var(--ac-grad);color:#FFFFFF;font-size:.7rem;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px var(--glow);}
.sb-uname{font-size:.85rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--z200);}
.sb-urole{font-size:.65rem;color:var(--ac);text-transform:uppercase;letter-spacing:.08em;font-weight:700;}

/* ── MAIN ── */
.main-scroll{flex:1;overflow-y:auto;background:transparent;position:relative;z-index:2;}
.page{padding:28px;max-width:1080px;margin:0 auto;position:relative;z-index:2;}

/* ── PAGE HEADER ── */
.page-hd{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;animation:fadeUp .35s cubic-bezier(.16,1,.3,1);}
.page-title{font-size:1.65rem;font-weight:900;letter-spacing:-.035em;margin-bottom:4px;color:var(--z100);}
.page-sub{font-size:.85rem;color:var(--z400);}
.page-actions{display:flex;gap:8px;align-items:center;flex-shrink:0;}

/* ── STAT ROW ── */
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;animation:fadeUp .4s cubic-bezier(.16,1,.3,1);}
.stat-cell{
  background:rgba(255, 255, 255, 0.65) !important;
  border:1px solid rgba(15,23,42,0.08) !important;
  border-radius:var(--r3);
  padding:22px 24px;
  position:relative;
  transition:all .28s cubic-bezier(.16,1,.3,1);
  cursor:default;
  backdrop-filter:blur(24px);
  box-shadow:0 16px 40px rgba(15,23,42,0.02), inset 0 1px 0 #FFFFFF;
}
.stat-cell:hover{
  background:rgba(255, 255, 255, 0.8) !important;
  transform:translateY(-3px);
  border-color:var(--ac) !important;
  box-shadow:0 20px 50px rgba(15,23,42,0.05), inset 0 1px 0 #FFFFFF, 0 0 20px var(--glow);
}
.stat-accent-bar{position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r3) var(--r3) 0 0;}
.stat-accent-bar.indigo{background:linear-gradient(90deg, #4F46E5, #818CF8);}
.stat-accent-bar.emerald{background:linear-gradient(90deg, #059669, #34D399);}
.stat-accent-bar.rose{background:linear-gradient(90deg, #EF4444, #F43F5E);}
.stat-accent-bar.dark{background:linear-gradient(90deg, #0284C7, #38BDF8);}
.stat-val{font-size:2rem;font-weight:900;letter-spacing:-.045em;line-height:1;margin-bottom:6px;animation:countUp .6s cubic-bezier(.16,1,.3,1);color:var(--z100);}
.stat-lbl{font-size:.72rem;color:var(--z400);text-transform:uppercase;letter-spacing:.1em;font-weight:700;}
.stat-delta{display:flex;align-items:center;gap:4px;font-size:.75rem;margin-top:10px;font-weight:600;}
.stat-delta.up{color:#059669;}.stat-delta.dn{color:#EF4444;}

/* ── CARD ── */
.card{
  background: rgba(255, 255, 255, 0.65) !important;
  border: 1px solid rgba(15,23,42,0.08) !important;
  border-radius: var(--r3);
  padding: 22px;
  position: relative;
  overflow: hidden;
  animation: fadeUp .4s cubic-bezier(.16,1,.3,1);
  transition: border-color .28s, box-shadow .28s, transform .28s;
  box-shadow: 0 16px 40px rgba(15,23,42,0.02), inset 0 1px 0 #FFFFFF;
  backdrop-filter: blur(24px);
}
.card:hover{
  border-color: var(--ac) !important;
  box-shadow: 0 20px 50px rgba(15,23,42,0.05), inset 0 1px 0 #FFFFFF, 0 0 20px var(--glow);
  transform: translateY(-3px);
}
.card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.card-title{font-size:.95rem;font-weight:800;letter-spacing:-.015em;color:var(--z200);display:flex;align-items:center;gap:8px;}
.card-sub{font-size:.78rem;color:var(--z400);margin-top:2px;}
.card-link{font-size:.8rem;color:var(--ac);font-weight:700;cursor:pointer;background:none;border:none;display:flex;align-items:center;gap:4px;transition:opacity .15s;}
.card-link:hover{opacity:.8;}

/* ── TABLE ── */
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-size:.68rem;font-weight:800;color:var(--z500);text-transform:uppercase;letter-spacing:.12em;padding:12px 16px;border-bottom:1px solid var(--bd);text-align:left;white-space:nowrap;background:rgba(15,23,42,0.01);}
.tbl td{padding:14px 16px;border-bottom:1px solid var(--bd);font-size:.85rem;vertical-align:middle;color:var(--z300);}
.tbl tr:last-child td{border-bottom:none;}
.tbl tbody tr{transition:background .18s, color .18s;cursor:pointer;}
.tbl tbody tr:hover{background:rgba(15,23,42,0.02);}
.tbl tbody tr:hover td{color:var(--z100);}

/* ── LIST ROW ── */
.lrow{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--bd);}
.lrow:last-child{border-bottom:none;}
.lrow-ic{width:38px;height:38px;border-radius:var(--r2);background:rgba(15,23,42,0.04);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--z500);transition:all .22s;border:1px solid rgba(15,23,42,0.06);}
.lrow-ic.accent{color:var(--ac);background:var(--glow);border-color:var(--ac);}
.lrow:hover .lrow-ic{transform:scale(1.08) translateY(-1px);border-color:var(--ac);box-shadow:0 4px 12px var(--glow);}
.lrow-info{flex:1;min-width:0;}
.lrow-title{font-size:.9rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--z200);}
.lrow-sub{font-size:.76rem;color:var(--z400);margin-top:3px;}
.lrow-r{flex-shrink:0;text-align:right;}
.lrow-val{font-size:.92rem;font-weight:700;color:var(--z100);}
.lrow-meta{font-size:.74rem;color:var(--z500);margin-top:3px;}

/* ── TASK CARD ── */
.tc {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: var(--r2);
  padding: 16px 18px 16px 20px;
  cursor: pointer;
  transition: all .25s cubic-bezier(.16, 1, .3, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.02), inset 0 1px 0 #FFFFFF;
  backdrop-filter: blur(20px);
}
.tc::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}
.tc.hi::before {
  background: #EF4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.35);
}
.tc.med::before {
  background: var(--helper-ac);
  box-shadow: 0 0 8px var(--helper-glow);
}
.tc.lo::before {
  background: #10B981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}
.tc:hover {
  border-color: var(--ac) !important;
  transform: translateY(-3px) translateX(2px);
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.05), 0 0 20px var(--glow), inset 0 1px 0 #FFFFFF;
}
.tc-row1 {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.tc-cb {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid var(--z500);
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .18s;
  color: #FFFFFF;
}
.tc-cb.done {
  background: #10B981;
  border-color: #10B981;
}
.tc-body {
  flex: 1;
  min-width: 0;
}
.tc-title {
  font-size: .92rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--z200);
}
.tc-title.done {
  text-decoration: line-through;
  color: var(--z500);
}
.tc-desc {
  font-size: .78rem;
  color: var(--z400);
  margin-top: 4px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.tc-acts {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity .15s;
  flex-shrink: 0;
}
.tc:hover .tc-acts {
  opacity: 1;
}

/* ── CHIPS ── */
.chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:4px;font-size:.65rem;font-weight:800;letter-spacing:.05em;border:1px solid;text-transform:uppercase;}
.chip-green{color:#34D399;border-color:rgba(52,211,153,.25);background:rgba(52,211,153,.08);}
.chip-red  {color:#F87171;border-color:rgba(248,113,113,.25);background:rgba(248,113,113,.08);}
.chip-yellow{color:var(--helper-ac);border-color:rgba(52,211,153,.25);background:rgba(52,211,153,.08);}
.chip-blue {color:var(--admin-ac);border-color:rgba(56,189,248,.25);background:rgba(56,189,248,.08);}
.chip-zinc {color:var(--z400);border-color:rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);}
.chip-ac   {color:var(--ac);border-color:var(--ac);background:var(--glow);}
.dot{display:inline-block;width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.dot-green{background:#34D399;box-shadow:0 0 6px #34D399;}.dot-red{background:#F87171;box-shadow:0 0 6px #F87171;}.dot-yellow{background:var(--helper-ac);box-shadow:0 0 6px var(--helper-ac);}.dot-blue{background:var(--admin-ac);box-shadow:0 0 6px var(--admin-ac);}.dot-zinc{background:var(--z500);}

/* ── PROGRESS ── */
.prog-bg{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.04);border-radius:99px;overflow:hidden;}
.prog-fill{height:100%;border-radius:99px;background:var(--ac-grad);box-shadow:0 0 10px var(--ac);transition:width .6s cubic-bezier(.16,1,.3,1);}

/* ── TOGGLE ── */
.toggle{width:44px;height:24px;border-radius:99px;border:none;outline:none;padding:0;background:rgba(255,255,255,0.08);cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;-webkit-appearance:none;appearance:none;}
.toggle.on{background:var(--ac-grad);box-shadow:0 0 12px var(--glow);}.toggle.off{background:rgba(255,255,255,0.08);}
.toggle::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#FFFFFF;top:3px;transition:left .2s cubic-bezier(.4,0,.2,1);box-shadow:0 2px 6px rgba(0,0,0,0.4);}
.toggle.on::after{left:23px;}.toggle.off::after{left:3px;}

/* ── MODAL ── */
.modal-bg{position:fixed;inset:0;background:rgba(15, 23, 42, 0.3);backdrop-filter:blur(12px);z-index:500;display:flex;animation:fadeIn .2s;align-items:flex-end;justify-content:center;}
.modal-bg.center{align-items:center;padding:24px;}
.modal{background:rgba(255, 255, 255, 0.88);border:1px solid rgba(15, 23, 42, 0.08);border-radius:var(--r5) var(--r5) 0 0;width:100%;max-width:620px;max-height:90vh;overflow-y:auto;animation:slideUp .32s cubic-bezier(.16,1,.3,1);box-shadow:0 30px 70px rgba(15, 23, 42, 0.12);backdrop-filter:blur(28px);}
.modal.center{border-radius:var(--r4);animation:scaleIn .25s cubic-bezier(.16,1,.3,1);}
.modal-handle{width:40px;height:4px;background:rgba(15, 23, 42, 0.12);border-radius:99px;margin:16px auto 0;}
.modal-hd{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 0;}
.modal-title{font-size:1.05rem;font-weight:800;letter-spacing:-.015em;color:var(--z300);}
.modal-body{padding:20px 24px 32px;}
.modal-close{width:30px;height:30px;border-radius:var(--r2);border:1px solid rgba(15, 23, 42, 0.08);background:none;color:var(--z400);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s;}
.modal-close:hover{background:rgba(15, 23, 42, 0.04);color:var(--z200);border-color:rgba(15, 23, 42, 0.15);}

/* ── TOAST ── */
.toast-stack{position:fixed;bottom:76px;left:50%;transform:translateX(-50%);z-index:900;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none;width:calc(100% - 24px);max-width:400px;}
.toast{pointer-events:all;display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:var(--r3);font-size:.85rem;font-weight:600;animation:scaleIn .25s cubic-bezier(.16,1,.3,1);box-shadow:0 16px 36px rgba(0,0,0,0.5);width:100%;border:1px solid;backdrop-filter:blur(16px);}
.toast-s{background:rgba(18, 25, 22, 0.85);border-color:rgba(52,211,153,.35);color:#34D399;box-shadow:0 4px 20px rgba(52,211,153,0.1);}
.toast-e{background:rgba(28, 18, 18, 0.85);border-color:rgba(248,113,113,.35);color:#F87171;box-shadow:0 4px 20px rgba(248,113,113,0.1);}
.toast-i{background:rgba(16, 22, 32, 0.85);border-color:rgba(56,189,248,.35);color:#38BDF8;box-shadow:0 4px 20px rgba(56,189,248,0.1);}
.toast-w{background:rgba(26, 22, 18, 0.85);border-color:rgba(251,191,36,.35);color:#FBBF24;box-shadow:0 4px 20px rgba(251,191,36,0.1);}
.toast-x{margin-left:auto;background:none;border:none;color:inherit;opacity:.5;cursor:pointer;font-size:16px;transition:opacity .15s;}
.toast-x:hover{opacity:1;}

/* ── BOTTOM NAV ── */
.bottom-nav{display:none;background:rgba(10, 10, 16, 0.72);backdrop-filter:blur(24px);border-top:1px solid var(--bd);height:68px;flex-shrink:0;}
.bottom-nav-inner{display:flex;height:100%;}
.bnav-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border:none;background:none;color:var(--z500);font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;transition:all .2s cubic-bezier(.4,0,.2,1);position:relative;}
.bnav-btn.active{color:var(--ac);}
.bnav-btn-ic{display:flex;align-items:center;justify-content:center;width:24px;height:24px;transition:all .22s cubic-bezier(.4,0,.2,1);}
.bnav-btn.active .bnav-btn-ic{transform:translateY(-2px) scale(1.18);color:var(--ac);filter:drop-shadow(0 2px 6px var(--glow));}
.bnav-dot{position:absolute;top:10px;right:calc(50% - 20px);width:5px;height:5px;background:#EF4444;border-radius:50%;border:1.5px solid #000;}

/* ── MAP ── */
.map-box{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);border-radius:var(--r3);height:250px;position:relative;overflow:hidden;margin-bottom:16px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.3);backdrop-filter:blur(10px);}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px);background-size:30px 30px;}
.map-road-h{position:absolute;background:rgba(255,255,255,0.02);height:14px;}
.map-road-v{position:absolute;background:rgba(255,255,255,0.02);width:14px;}
.map-pin{position:absolute;transform:translate(-50%,-100%);animation:pinBob 2.4s ease-in-out infinite;cursor:pointer;}
.map-pin svg{width:30px;height:30px;color:var(--ac);filter:drop-shadow(0 4px 8px var(--glow));}
.map-route{position:absolute;inset:0;pointer-events:none;}
.map-ctl{position:absolute;bottom:14px;right:14px;display:flex;flex-direction:column;gap:6px;}
.map-btn{width:32px;height:32px;background:rgba(18, 19, 32, 0.8);border:1px solid rgba(255,255,255,0.06);border-radius:var(--r);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;color:var(--z400);transition:all .18s;}
.map-btn:hover{background:rgba(255,255,255,0.08);color:var(--z100);border-color:rgba(255,255,255,0.15);}
.map-label{position:absolute;top:14px;left:14px;background:rgba(18, 19, 32, 0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06);border-radius:var(--r2);padding:8px 14px;font-size:.75rem;font-weight:600;color:var(--z200);box-shadow:0 4px 12px rgba(0,0,0,0.25);}

/* ── BAR CHART ── */
.bar-chart{display:flex;align-items:flex-end;gap:10px;padding:8px 0 0;}
.bar-col{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;}
.bar{width:100%;border-radius:6px 6px 0 0;background:var(--ac-grad);opacity:.8;transition:opacity .22s,transform .22s;min-height:4px;position:relative;overflow:hidden;box-shadow:0 0 10px var(--glow);}
.bar::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.15) 0%,transparent 60%);}
.bar:hover{opacity:1;transform:scaleY(1.05);transform-origin:bottom;}
.bar-lbl{font-size:.65rem;color:var(--z500);white-space:nowrap;font-variant-numeric:tabular-nums;}
.bar-val{font-size:.68rem;color:var(--z400);font-variant-numeric:tabular-nums;}

/* ── MISC ── */
.empty-state{text-align:center;padding:60px 24px;}
.empty-icon{margin-bottom:14px;color:var(--z500);display:flex;justify-content:center;}
.empty-title{font-size:1rem;font-weight:700;color:var(--z300);margin-bottom:6px;}
.empty-sub{font-size:.85rem;color:var(--z400);line-height:1.7;}
.stars{display:flex;gap:3px;}

/* SLEEK CARBONmonospaced TERMINAL FOR SYSTEM LOGS */
.log-stream{
  background:#040508;
  border:1px solid rgba(255,255,255,0.04);
  border-radius:var(--r2);
  font-family:'JetBrains Mono', 'Geist Mono', ui-monospace, monospace;
  font-size:.76rem;
  height:190px;
  overflow-y:auto;
  padding:14px;
  box-shadow:inset 0 4px 16px rgba(0,0,0,0.85);
}
.log-line{display:flex;gap:12px;padding:3px 0;line-height:1.6;}
.log-ts{color:#475569;flex-shrink:0;font-variant-numeric:tabular-nums;}
.log-lvl-info{color:#38BDF8;flex-shrink:0;width:42px;font-weight:700;text-shadow:0 0 8px rgba(56,189,248,0.25);}
.log-lvl-warn{color:#34D399;flex-shrink:0;width:42px;font-weight:700;text-shadow:0 0 8px rgba(52,211,153,0.25);}
.log-lvl-err{color:#F87171;flex-shrink:0;width:42px;font-weight:700;text-shadow:0 0 8px rgba(248,113,113,0.25);}
.log-msg{color:#94A3B8;}
.log-cursor{display:inline-block;width:6px;height:12px;background:var(--ac);margin-left:3px;box-shadow:0 0 6px var(--ac);animation:blink 1s step-end infinite;}

.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.mb-14{margin-bottom:14px;}.mb-20{margin-bottom:20px;}

.heat-grid{display:flex;gap:4px;}.heat-col{display:flex;flex-direction:column;gap:4px;}
.heat-cell{width:16px;height:16px;border-radius:3px;background:rgba(255,255,255,0.03);cursor:pointer;transition:all .18s;border:1px solid rgba(255,255,255,0.02);}
.heat-cell:hover{transform:scale(1.35);z-index:5;border-color:var(--helper-ac);box-shadow:0 0 10px var(--helper-glow);}
.heat-cell.l1{background:rgba(52,211,153,.15);}.heat-cell.l2{background:rgba(52,211,153,.35);}.heat-cell.l3{background:rgba(52,211,153,.6);}.heat-cell.l4{background:rgba(52,211,153,.95);}

.chat-msgs{display:flex;flex-direction:column;gap:12px;padding:12px 0;}
.chat-msg{display:flex;gap:10px;max-width:88%;}.chat-msg.mine{flex-direction:row-reverse;align-self:flex-end;}
.chat-av-sm{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:900;}
.chat-bub{padding:10px 14px;border-radius:12px;font-size:.85rem;line-height:1.6;}
.chat-bub.them{background:rgba(255,255,255,0.03);color:var(--z200);border-radius:3px 12px 12px 12px;border:1px solid rgba(255,255,255,0.06);}
.chat-bub.mine{background:var(--ac-grad);color:#FFFFFF;border-radius:12px 3px 12px 12px;box-shadow:0 4px 12px var(--glow), inset 0 1px 0 rgba(255,255,255,0.15);}
.chat-ts{font-size:.65rem;color:var(--z500);margin-top:4px;text-align:right;}
.chat-input-row{display:flex;gap:10px;margin-top:16px;border-top:1px solid var(--bd);padding-top:16px;}

.addr-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:var(--r2);padding:14px 16px;display:flex;align-items:center;gap:14px;margin-bottom:10px;cursor:pointer;transition:all .22s;box-shadow:0 2px 4px rgba(0,0,0,0.1);backdrop-filter:blur(8px);}
.addr-card:hover{border-color:rgba(255,255,255,0.15);background:rgba(255,255,255,0.04);transform:translateX(4px);box-shadow:0 6px 16px rgba(0,0,0,0.2);}
.addr-icon{width:36px;height:36px;border-radius:var(--r);background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;color:var(--z400);flex-shrink:0;}

.lb-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--bd);}
.lb-row:last-child{border-bottom:none;}
.lb-rank{width:26px;text-align:center;font-size:.85rem;font-weight:900;color:var(--z500);flex-shrink:0;}
.lb-rank.gold{color:#F5A623;text-shadow:0 0 8px rgba(245,166,35,0.35);}.lb-rank.silver{color:var(--z400);}.lb-rank.bronze{color:#CD7F32;}

.cert-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:var(--r2);padding:16px 18px;position:relative;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);backdrop-filter:blur(12px);}
.cert-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--ac-grad);}
.cert-verified{position:absolute;top:12px;right:14px;}

.perm-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--bd);}
.perm-row:last-child{border-bottom:none;}
.perm-l{flex:1;margin-right:14px;}
.perm-title{font-size:.9rem;font-weight:600;color:var(--z200);}
.perm-sub{font-size:.78rem;color:var(--z400);margin-top:3px;}

/* ── RESPONSIVE ── */
@media(max-width:700px){.stat-row{grid-template-columns:repeat(2,1fr);}}
`;

/* ════════════════════════ API UTILS & DATA ════════════════════════════════ */
const api = {
  getToken: () => localStorage.getItem("portalapp_token"),
  async request(path, options = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(path, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
    }
    return res.json();
  }
};

const WEEK_EARNINGS = [{d:"Mon",v:142},{d:"Tue",v:89},{d:"Wed",v:205},{d:"Thu",v:178},{d:"Fri",v:310},{d:"Sat",v:260},{d:"Sun",v:95}];

/* ════════════════════════ CONTEXT & HOOKS ══════════════════════════════════ */
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("portalapp_token");
      if (token) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem("portalapp_token");
          }
        } catch (err) {
          console.error("Failed to restore session", err);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, pw) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pw })
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, err: data.error || "Login failed" };
      }
      if (email.toLowerCase().trim() === "backend@portalapp.com") {
        window.location.href = `http://localhost:5000/?token=${data.token}`;
        return { ok: true, redirected: true };
      }
      localStorage.setItem("portalapp_token", data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, err: "Unable to connect to authentication server." };
    }
  };

  const logout = () => {
    localStorage.removeItem("portalapp_token");
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#07070A",
        color: "#F8F8FC",
        fontFamily: "sans-serif"
      }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, borderTopColor: "#FF3A3A" }} />
        <div style={{ marginTop: 16, fontSize: ".9rem", letterSpacing: ".1em", color: "#68687E", textTransform: "uppercase" }}>Loading PortalApp…</div>
      </div>
    );
  }

  return <AuthCtx.Provider value={{ user, login, logout, setUser }}>{children}</AuthCtx.Provider>;
}

let _tid = 0;
function useToast() {
  const [items, setItems] = useState([]);
  const toast = useCallback((msg, type="info") => {
    const id = ++_tid;
    setItems(t => [...t, { id, msg, type }]);
    setTimeout(() => setItems(t => t.filter(x => x.id !== id)), 3400);
  }, []);
  const kill = id => setItems(t => t.filter(x => x.id !== id));
  return { items, toast, kill };
}

function Toasts({ items, kill }) {
  const cls = { success:"toast-s", error:"toast-e", info:"toast-i", warn:"toast-w" };
  const icon = { success:<Ic n="check" s={12}/>, error:<Ic n="close" s={12}/>, info:<Ic n="info" s={12}/>, warn:<Ic n="warn" s={12}/> };
  return (
    <div className="toast-stack">
      {items.map(t => (
        <div key={t.id} className={`toast ${cls[t.type]}`}>
          {icon[t.type]}
          <span style={{flex:1}}>{t.msg}</span>
          <button className="toast-x" onClick={() => kill(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

function Modal({ open, onClose, title, children, center=false }) {
  if (!open) return null;
  return (
    <div className={`modal-bg${center?" center":""}`} onClick={e => e.target===e.currentTarget && onClose()}>
      <div className={`modal${center?" center":""}`}>
        {!center && <div className="modal-handle"/>}
        <div className="modal-hd">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><Ic n="close" s={12}/></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return <button className={`toggle ${on?"on":"off"}`} onClick={() => onChange(!on)}/>;
}

function Stars({ rating=0, max=5, size=12, interactive=false, onChange }) {
  const [hover, setHover] = useState(null);
  const active = hover ?? rating;
  return (
    <div className="stars" style={{fontSize:size}}>
      {Array.from({length:max}).map((_,i) => (
        <span key={i} style={{color: i < active ? "var(--helper-ac)" : "var(--z700)", cursor: interactive?"pointer":"default"}}
          onMouseEnter={() => interactive && setHover(i+1)}
          onMouseLeave={() => interactive && setHover(null)}
          onClick={() => interactive && onChange && onChange(i+1)}>
          <Ic n="star" s={size}/>
        </span>
      ))}
    </div>
  );
}

function PwdStrength({ pwd }) {
  if (!pwd) return null;
  const score = [/.{8,}/,/[A-Z]/,/[a-z]/,/[0-9]/,/[^A-Za-z0-9]/].filter(r=>r.test(pwd)).length;
  const cls = score<=2?"w":score<=3?"f":"s";
  const lbl = ["","Weak","Weak","Fair","Strong","Very strong"][score];
  return (
    <div>
      <div className="pwd-bars">{[1,2,3,4,5].map(i=><div key={i} className={`pwd-bar ${i<=score?cls:""}`}/>)}</div>
      <div className="pwd-hint">{lbl}</div>
    </div>
  );
}

/* ════════════════════════ AUTH SCREEN ═════════════════════════════════════ */
const GOOGLE_SVG = <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
const GITHUB_SVG = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>;
const APPLE_SVG  = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>;

function AuthScreen() {
  const { login } = useAuth();
  const { items, toast, kill } = useToast();
  const [screen, setScreen] = useState("landing");
  const [activeRole, setActiveRole] = useState("client");
  const [email, setEmail] = useState("");
  const [pw, setPw]     = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]   = useState({});
  const [sf, setSf]     = useState({name:"",email:"",pw:"",pw2:""});
  const [se, setSe]     = useState({});
  const [showSP, setShowSP] = useState(false);
  const [fEmail, setFEmail] = useState(""); const [fSent, setFSent] = useState(false);
  const [oauthProvider, setOauthProvider] = useState(null);
  const [oauthStep, setOauthStep] = useState(1);
  const [oauthSelUser, setOauthSelUser] = useState(null);
  const [oauthCustom, setOauthCustom] = useState(false);
  const [oauthEmail, setOauthEmail] = useState("");
  const [oauthPw, setOauthPw] = useState("");
  const [oauthErr, setOauthErr] = useState("");

  const [publicStats, setPublicStats] = useState({
    activeUsers: 80000,
    avgRating: 4.9,
    uptimeSLA: "99.2%",
    liveErrands: []
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/public/stats");
        if (res.ok) {
          const data = await res.json();
          setPublicStats({
            activeUsers: data.activeUsers || 80000,
            avgRating: data.avgRating || 4.9,
            uptimeSLA: data.uptimeSLA || "99.2%",
            liveErrands: data.liveErrands || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch public stats", err);
      }
    }
    fetchStats();
  }, []);

  const PORTALS = [
    {role:"client",label:"Client Portal",  ac:"#6366F1",bg:"rgba(99,102,241,0.08)",  email:"client@portalapp.com",pw:"Client@123"},
    {role:"helper",label:"Helper Portal",  ac:"#059669",bg:"rgba(5,150,105,0.08)",   email:"helper@portalapp.com",pw:"Helper@123"},
    {role:"admin", label:"Admin Portal",   ac:"#0284C7",bg:"rgba(2,132,199,0.08)",   email:"admin@portalapp.com", pw:"Admin@123"},
  ];

  async function doLogin() {
    const errs={};
    if (!email.trim()) errs.email="Email required";
    if (!pw) errs.pw="Password required";
    if (Object.keys(errs).length) { setErr(errs); return; }
    setErr({});
    setLoading(true);
    try {
      const r = await login(email, pw);
      setLoading(false);
      if (!r.ok) {
        setErr({ general: r.err });
      }
    } catch (err) {
      setLoading(false);
      setErr({ general: "Unable to connect to authentication server." });
    }
  }

  function doSignup() {
    const errs={};
    if (!sf.name.trim()) errs.name="Full name required";
    if (!sf.email.trim()) errs.email="Email required";
    if (!sf.pw || sf.pw.length < 8) errs.pw="Min 8 characters";
    if (sf.pw !== sf.pw2) errs.pw2="Passwords don't match";
    if (Object.keys(errs).length) { setSe(errs); return; }
    setSe({});
    toast("Signup is demo-only. Use the portal credentials to explore.", "info");
  }

  function socialLogin(provider) {
    setOauthProvider(provider);
    setOauthStep(1);
    setOauthSelUser(provider === "Apple" ? { name: "Diana Chen", email: "admin@portalapp.com", pw: "Admin@123", role: "Admin" } : provider === "GitHub" ? { name: "Marcus Williams", email: "helper@portalapp.com", pw: "Helper@123", role: "Helper", recommended: true } : null);
  }

  // 3D card tilt on mouse move
  function handleCardTilt(e, el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
    el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  }
  function resetTilt(el) {
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <>
      <div className={`auth-root ${screen === "landing" ? "landing-mode" : ""}`} data-role={activeRole}>
        {/* Animated orbs */}
        <div className="auth-orbs">
          <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
        </div>
        <div className="auth-grid"/>

        {/* ─── PUBLIC LANDING PAGE ─── */}
        {screen === "landing" && (
          <>
            {/* Sticky glass navigation header */}
            <div className="landing-nav">
              <div className="landing-nav-inner">
                <div className="auth-logo-row" style={{ marginBottom: 0, cursor: "pointer" }} onClick={() => setScreen("landing")}>
                  <div className="auth-logo-mark"><Ic n="logo" s={19}/></div>
                  <div className="auth-logo-name">Errand<span>Mate</span></div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="btn btn-g" onClick={() => setScreen("login")}>Sign In</button>
                  <button className="btn btn-p" onClick={() => setScreen("signup")}>Register</button>
                </div>
              </div>
            </div>

            <div className="landing-root">

            {/* Hero Branding Section */}
            <div className="landing-hero">
              <div className="landing-hero-eyebrow">Multi-role errand & service ecosystem</div>
              <h1 className="landing-hero-title">
                Your errands,<br />handled with <strong>absolute precision.</strong>
              </h1>
              <p className="landing-hero-desc">
                PortalApp connects clients in need of assistance with verified helpers ready to get work done. Three purpose-built portals on a single unified platform.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button className="btn btn-p" style={{ padding: "12px 24px", fontSize: ".9rem" }} onClick={() => setScreen("login")}>
                  Enter the Platform <Ic n="arrow" s={16} />
                </button>
              </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="landing-stats-grid">
              {[
                { ic: "users", val: publicStats.activeUsers ? `${publicStats.activeUsers.toLocaleString()}+` : "80,000+", lbl: "Active Users", bg: "rgba(99,102,241,.08)", c: "#4F46E5" },
                { ic: "star", val: publicStats.avgRating ? `${publicStats.avgRating} / 5` : "4.9 / 5", lbl: "Avg Rating", bg: "rgba(5,150,105,.08)", c: "#059669" },
                { ic: "activity", val: "2 min", lbl: "Avg Response", bg: "rgba(2,132,199,.08)", c: "#0284C7" },
                { ic: "shield", val: publicStats.uptimeSLA || "99.9%", lbl: "Uptime SLA", bg: "rgba(79,70,229,.08)", c: "#6366F1" },
              ].map((fc, i) => (
                <div key={fc.lbl} className="feature-card"
                  onMouseMove={e => handleCardTilt(e, e.currentTarget)}
                  onMouseLeave={e => resetTilt(e.currentTarget)}>
                  <div className="fc-icon" style={{ background: fc.bg, color: fc.c }}><Ic n={fc.ic} s={18} /></div>
                  <div className="fc-val" style={{ color: fc.c }}>{fc.val}</div>
                  <div className="fc-lbl">{fc.lbl}</div>
                </div>
              ))}
            </div>

            {/* Core Platform Workflow Visualizer */}
            <div className="card" style={{ marginBottom: "28px", animation: "fadeUp .35s ease" }}>
              <div className="card-hd" style={{ marginBottom: "20px" }}>
                <div>
                  <div className="card-title" style={{ fontSize: "1.2rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--ac)", display: "inline-flex", alignItems: "center" }}><Ic n="route" s={18} /></span>
                    Real-time Errand Lifecycle Workflow
                  </div>
                  <div className="card-sub">Dynamic breakdown of the transactional escrow errand cycle (100% production ready)</div>
                </div>
                <span className="badge badge-active" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", color: "#10B981", fontSize: "0.68rem" }}>Production Active</span>
              </div>

              {/* Workflow Stepper Grid */}
              <div className="workflow-stepper-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", position: "relative" }}>
                {[
                  { step: "1", ic: "plus", title: "Post Errand", actor: "Client", desc: "Sets priority, location, and funds budget in secure escrow.", color: "var(--client-ac)", bg: "var(--client-glow)" },
                  { step: "2", ic: "log", title: "Live Ledger", actor: "Ledger", desc: "Errand is indexed instantly on the live public feed.", color: "var(--admin-ac)", bg: "var(--admin-glow)" },
                  { step: "3", ic: "route", title: "Claim Job", actor: "Helper", desc: "Helper accepts task and establishes routes on active logs.", color: "var(--helper-ac)", bg: "var(--helper-glow)" },
                  { step: "4", ic: "lock", title: "Escrow Payout", actor: "Ledger", desc: "Funds transfer instantly: Client debited, Helper credited.", color: "var(--admin-ac)", bg: "var(--admin-glow)" },
                  { step: "5", ic: "review", title: "Five-Star Review", actor: "Client", desc: "Sarah rates Marcus to compute real-time helper reputations.", color: "var(--client-ac)", bg: "var(--client-glow)" }
                ].map((s, i) => (
                  <div key={s.title} className="workflow-step-card" style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    position: "relative",
                    transition: "all 0.2s ease",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = s.color;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 24px ${s.bg}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
                  }}>
                    <div style={{
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      color: "var(--z500)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "6px"
                    }}>
                      Step {s.step}
                    </div>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: s.bg,
                      color: s.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                      boxShadow: `0 4px 10px ${s.bg}`,
                      border: `1px solid rgba(255,255,255,0.08)`
                    }}>
                      <Ic n={s.ic} s={18} />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: "0.86rem", color: "var(--z100)" }}>{s.title}</div>
                    <div style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      fontSize: "0.6rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      background: "rgba(255,255,255,0.02)",
                      color: s.color,
                      border: `1px solid ${s.color}`,
                      marginTop: "6px",
                      marginBottom: "8px"
                    }}>{s.actor}</div>
                    <p style={{ fontSize: "0.74rem", color: "var(--z500)", lineHeight: "1.4" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Public Feed and Gateway Grid */}
            <div className="landing-main-grid">
              {/* Left Column: Live Public Errand Ledger */}
              <div className="card">
                <div className="card-hd">
                  <div>
                    <div className="card-title" style={{ fontSize: "1.1rem" }}>
                      <span className="dot dot-green" style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle", animation: "glowPulse 1.5s infinite" }} />
                      Live Public Errand Feed
                    </div>
                    <div className="card-sub">Dynamic real-time look into the active global ledger</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                  {publicStats.liveErrands && publicStats.liveErrands.length > 0 ? (
                    publicStats.liveErrands.map(task => (
                      <div key={task.id} className="errand-feed-card" style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 800, color: "var(--z100)", fontSize: ".92rem" }}>{task.title}</span>
                          <span style={{ color: "var(--helper-ac)", fontWeight: 800, fontSize: ".95rem" }}>${task.pay}</span>
                        </div>
                        <p style={{ fontSize: ".82rem", color: "var(--z400)", marginBottom: "8px", lineHeight: "1.5" }}>
                          {task.desc || "No additional description supplied."}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".72rem", color: "var(--z500)", fontWeight: 600 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 11, height: 11, color: "var(--ac)" }}><path d="M8 1a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5z"/><circle cx="8" cy="6" r="1.5"/></svg>{task.loc} ({task.dist})</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 11, height: 11, color: "var(--ac)" }}><circle cx="8" cy="8" r="7"/><polyline points="8,3.5 8,8 11.5,8"/></svg>Due {task.due}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--z500)", fontStyle: "italic" }}>
                      No active pending errands listed.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Portal Access Gateways */}
              <div className="card">
                <div className="card-hd">
                  <div>
                    <div className="card-title" style={{ fontSize: "1.1rem" }}>Demo Gateway Access</div>
                    <div className="card-sub">Instant one-click entry to explore specific platform roles</div>
                  </div>
                </div>
                <div className="portal-cards" style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                  {PORTALS.map(p => {
                    let desc = "";
                    if (p.role === "client") desc = "Post custom errands, allocate escrow funds, track helper progress, and issue ratings.";
                    else if (p.role === "helper") desc = "Claim live tasks, map custom travel routes, check balances, and claim helper rewards.";
                    else desc = "Audit full platform activity logs, toggle accounts, and arbitrate system-wide disputes.";
                    return (
                      <div key={p.role} className={`portal-card ${p.role}`}
                        onClick={() => {
                          setEmail(p.email);
                          setPw(p.pw);
                          setActiveRole(p.role);
                          setErr({});
                          setScreen("login");
                        }}
                        style={{ padding: "16px 20px" }}>
                        <div className="portal-card-icon" style={{ background: p.bg, color: p.ac, width: "36px", height: "36px" }}>
                          <Ic n={p.role === "client" ? "profile" : p.role === "helper" ? "route" : "shield"} s={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="portal-card-name" style={{ color: p.ac, fontSize: ".96rem", fontWeight: 800 }}>{p.label}</div>
                            <span className="portal-card-hint" style={{ color: p.ac, borderColor: p.ac, fontSize: ".68rem", padding: "1px 6px" }}>Fill & Enter</span>
                          </div>
                          <p style={{ fontSize: ".76rem", color: "var(--z500)", margin: "4px 0 6px", lineHeight: "1.4" }}>{desc}</p>
                          <div className="portal-card-creds" style={{ fontSize: ".74rem" }}>{p.email}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

        {/* ─── DEDICATED AUTH SCREEN ─── */}
        {screen !== "landing" && (
          <div className="auth-centered-wrap">
            <div className="auth-form" style={{ width: "100%", maxWidth: "440px" }}>
              
              {/* Back to Home action */}
              <button onClick={() => setScreen("landing")} 
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".82rem", fontWeight: 700, color: "var(--z500)", background: "none", border: "none", cursor: "pointer", marginBottom: 20, transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--ac)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--z400)"}>
                ← Back to Home
              </button>

              {/* Logo */}
              <div className="auth-logo-row" onClick={() => setScreen("landing")} style={{ cursor: "pointer" }}>
                <div className="auth-logo-mark"><Ic n="logo" s={19}/></div>
                <div className="auth-logo-name">Errand<span>Mate</span></div>
              </div>

              {/* ── LOGIN ── */}
              {screen === "login" && <>
                <div className="auth-form-title">Welcome back</div>
                <p className="auth-form-sub">Sign in to your portal or click the back button to go back home.</p>

                {err.general && <div className="auth-err"><Ic n="warn" s={14}/>{err.general}</div>}

                <div className="iw">
                  <label className="il">Email address</label>
                  <div className="ii-wrap">
                    <span className="ii-prefix"><Ic n="profile" s={14}/></span>
                    <input className={`ii${err.email?" ii-err":""}`} type="email" placeholder="you@example.com"
                      value={email} onChange={e=>{setEmail(e.target.value);setErr(p=>({...p,email:"",general:""}));}}
                      onKeyDown={e=>e.key==="Enter"&&doLogin()} autoComplete="email"/>
                  </div>
                  {err.email&&<span className="fe"><Ic n="warn" s={10}/>{err.email}</span>}
                </div>

                <div className="iw">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <label className="il">Password</label>
                    <button style={{fontSize:".82rem",color:"var(--ac)",background:"none",border:"none",cursor:"pointer",fontWeight:700,lineHeight:1}} onClick={()=>{setScreen("forgot");setErr({});}}>Forgot password?</button>
                  </div>
                  <div className="ii-wrap">
                    <span className="ii-prefix"><Ic n="lock" s={14}/></span>
                    <input className={`ii${err.pw?" ii-err":""}`} type={showPw?"text":"password"} placeholder="••••••••••"
                      value={pw} onChange={e=>{setPw(e.target.value);setErr(p=>({...p,pw:"",general:""}));}}
                      onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{paddingRight:40}} autoComplete="current-password"/>
                    <button className="ii-suffix" onClick={()=>setShowPw(v=>!v)}><Ic n="eye" s={14}/></button>
                  </div>
                  {err.pw&&<span className="fe"><Ic n="warn" s={10}/>{err.pw}</span>}
                </div>

                {/* ★ BIG SIGN-IN BUTTON ★ */}
                <button className="btn-signin" onClick={doLogin} disabled={loading}>
                  {loading
                    ? <><div className="spinner" style={{borderTopColor:"var(--z950)"}}/> Signing in…</>
                    : <>Sign in  <Ic n="arrow" s={16}/></>}
                </button>

                {/* OR divider */}
                <div className="auth-or">or continue with</div>

                {/* SOCIAL LOGIN GRID */}
                <div className="social-grid" style={{marginBottom:18}}>
                  <button className="btn-social" onClick={()=>socialLogin("Google")}>
                    {GOOGLE_SVG}
                    <span>Google</span>
                  </button>
                  <button className="btn-social" onClick={()=>socialLogin("GitHub")}>
                    {GITHUB_SVG}
                    <span>GitHub</span>
                  </button>
                  <button className="btn-social social-btn-full" onClick={()=>socialLogin("Apple")}>
                    {APPLE_SVG}
                    <span>Continue with Apple</span>
                  </button>
                </div>

                <div className="auth-switch">New to PortalApp? <button onClick={()=>{setErr({});setScreen("signup");}}>Create account</button></div>
                <div className="auth-note"><Ic n="lock" s={11}/> 256-bit TLS · SOC 2 Type II · GDPR ready</div>
              </>}

              {/* ── SIGN UP ── */}
              {screen === "signup" && <>
                <div className="auth-form-title">Create account</div>
                <p className="auth-form-sub">Join as a client or apply to become a verified helper.</p>

                {/* Social signup */}
                <div className="social-grid" style={{marginBottom:16}}>
                  <button className="btn-social" onClick={()=>socialLogin("Google")}>{GOOGLE_SVG}<span>Google</span></button>
                  <button className="btn-social" onClick={()=>socialLogin("GitHub")}>{GITHUB_SVG}<span>GitHub</span></button>
                </div>
                <div className="auth-or">or sign up with email</div>

                {[["name","Full name","profile","text","Jane Doe"],["email","Email address","profile","email","you@example.com"]].map(([k,lbl,ic,type,ph])=>(
                  <div className="iw" key={k}>
                    <label className="il">{lbl}</label>
                    <div className="ii-wrap"><span className="ii-prefix"><Ic n={ic} s={14}/></span>
                      <input className={`ii${se[k]?" ii-err":""}`} type={type} placeholder={ph} value={sf[k]} onChange={e=>setSf(p=>({...p,[k]:e.target.value}))} style={{paddingLeft:36}}/>
                    </div>
                    {se[k]&&<span className="fe"><Ic n="warn" s={10}/>{se[k]}</span>}
                  </div>
                ))}
                <div className="iw">
                  <label className="il">Password</label>
                  <div className="ii-wrap"><span className="ii-prefix"><Ic n="lock" s={14}/></span>
                    <input className={`ii${se.pw?" ii-err":""}`} type={showSP?"text":"password"} placeholder="Min 8 characters" value={sf.pw} onChange={e=>setSf(p=>({...p,pw:e.target.value}))} style={{paddingLeft:36,paddingRight:40}}/>
                    <button className="ii-suffix" onClick={()=>setShowSP(v=>!v)}><Ic n="eye" s={14}/></button>
                  </div>
                  <PwdStrength pwd={sf.pw}/>{se.pw&&<span className="fe"><Ic n="warn" s={10}/>{se.pw}</span>}
                </div>
                <div className="iw">
                  <label className="il">Confirm password</label>
                  <div className="ii-wrap"><span className="ii-prefix"><Ic n="lock" s={14}/></span>
                    <input className={`ii${se.pw2?" ii-err":""}`} type="password" placeholder="Repeat password" value={sf.pw2} onChange={e=>setSf(p=>({...p,pw2:e.target.value}))} style={{paddingLeft:36}}/>
                  </div>
                  {se.pw2&&<span className="fe"><Ic n="warn" s={10}/>{se.pw2}</span>}
                </div>

                <button className="btn-signin" onClick={doSignup}>Create account <Ic n="arrow" s={16}/></button>
                <div className="auth-switch" style={{marginTop:14}}>Have an account? <button onClick={()=>{setSe({});setScreen("login");}}>Sign in</button></div>
              </>}

              {/* ── FORGOT ── */}
              {screen === "forgot" && <>
                <div className="auth-form-title">Reset password</div>
                <p className="auth-form-sub">Enter your email and we'll send a reset link valid for 15 minutes.</p>
                {!fSent ? <>
                  <div className="iw"><label className="il">Email address</label>
                    <div className="ii-wrap"><span className="ii-prefix"><Ic n="profile" s={14}/></span>
                      <input className="ii" type="email" placeholder="you@example.com" value={fEmail} onChange={e=>setFEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fEmail&&setFSent(true)} style={{paddingLeft:36}}/>
                    </div>
                  </div>
                  <button className="btn-signin" onClick={()=>{if(fEmail){setFSent(true);toast("Reset link sent!","success");}}}>
                    Send reset link <Ic n="arrow" s={16}/>
                  </button>
                </> : (
                  <div style={{background:"rgba(0,217,126,.06)",border:"1px solid rgba(0,217,126,.2)",borderRadius:12,padding:22,textAlign:"center",animation:"scaleIn .25s ease"}}>
                    <div style={{color:"#00D97E",marginBottom:8,display:"flex",justifyContent:"center"}}><Ic n="check" s={32}/></div>
                    <div style={{fontWeight:800,marginBottom:5}}>Check your inbox</div>
                    <div style={{fontSize:".8rem",color:"var(--z400)"}}>Link sent to <strong style={{color:"var(--ac)"}}>{fEmail}</strong></div>
                  </div>
                )}
                <div className="auth-switch" style={{marginTop:16}}><button onClick={()=>{setScreen("login");setFSent(false);}}>← Back to sign in</button></div>
              </>}
            </div>
          </div>
        )}
      </div>
      {/* ── SIMULATED OAUTH POPUP MODALS ── */}
      {oauthProvider && (
        <Modal open={!!oauthProvider} onClose={() => setOauthProvider(null)} title={`${oauthProvider} Authentication`} center={true}>
          {oauthProvider === "Google" && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              {oauthStep === 1 && (
                <>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(15,23,42,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {GOOGLE_SVG}
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--z300)", marginBottom: "4px" }}>Sign in with Google</h3>
                  <p style={{ fontSize: "0.825rem", color: "var(--z500)", marginBottom: "20px" }}>to continue to PortalApp</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
                    {[
                      { name: "Sarah Johnson", email: "client@portalapp.com", role: "Client", av: "SJ", pw: "Client@123" },
                      { name: "Marcus Williams", email: "helper@portalapp.com", role: "Helper", av: "MW", pw: "Helper@123" },
                      { name: "Diana Chen", email: "admin@portalapp.com", role: "Admin", av: "DC", pw: "Admin@123" }
                    ].map(u => (
                      <div key={u.email} onClick={async () => {
                        setOauthSelUser(u);
                        setOauthStep(2);
                        setTimeout(async () => {
                          try {
                            const r = await login(u.email, u.pw);
                            if (r.ok) {
                              toast(`Google OAuth successful. Connected to ${u.role} Portal as ${u.name}.`, "success");
                            } else {
                              toast("Simulated Google authentication failed.", "error");
                            }
                          } catch(e) {
                            toast("Simulated Google connection failed.", "error");
                          }
                          setOauthProvider(null);
                        }, 1800);
                      }} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", background: "rgba(15,23,42,0.02)", border: "1px solid rgba(15,23,42,0.06)", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s" }}
                      className="portal-card">
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--ac-grad)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: "900" }}>
                          {u.av}
                        </div>
                        <div style={{ flex: "1" }}>
                          <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--z300)" }}>{u.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--z500)" }}>{u.email}</div>
                        </div>
                        <span className="chip chip-zinc" style={{ fontSize: "0.6rem" }}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: "20px", fontSize: "0.75rem", color: "var(--z500)" }}>
                    Google will share your name, email address, language preference, and profile picture with PortalApp.
                  </div>
                </>
              )}
              {oauthStep === 2 && (
                <div style={{ padding: "40px 0" }}>
                  <div className="spinner" style={{ width: "36px", height: "36px", borderWidth: "3px", marginBottom: "16px" }} />
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--z300)", marginBottom: "4px" }}>Signing you in...</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--z500)" }}>Connecting securely to your Google account as <strong>{oauthSelUser?.name}</strong></p>
                </div>
              )}
            </div>
          )}
          {oauthProvider === "GitHub" && (
            <div style={{ padding: "10px 0" }}>
              {oauthStep === 1 && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "20px" }}>
                    <div style={{ color: "#24292e" }}>{GITHUB_SVG}</div>
                    <div style={{ fontSize: "1.5rem", color: "var(--z500)", fontWeight: "300" }}>+</div>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg, #4F46E5 0%, #0284C7 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
                      <Ic n="logo" s={16}/>
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--z300)", marginBottom: "8px", textAlign: "center" }}>Authorize PortalApp</h3>
                  <p style={{ fontSize: "0.825rem", color: "var(--z400)", marginBottom: "20px", textAlign: "center" }}>
                    wants to access your GitHub public profile information & email address.
                  </p>
                  
                  <div style={{ border: "1px solid rgba(15,23,42,0.08)", borderRadius: "10px", background: "rgba(15,23,42,0.02)", padding: "14px", marginBottom: "20px", fontSize: "0.825rem", color: "var(--z400)", lineHeight: "1.5" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ color: "#059669" }}><Ic n="check" s={14}/></span>
                      <div><strong>Public user data</strong>: Read access to profile details, avatar, and username.</div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <span style={{ color: "#059669" }}><Ic n="check" s={14}/></span>
                      <div><strong>Email address</strong>: Access your primary GitHub email address (<code>marcus.williams@github.com</code>).</div>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--z500)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Select GitHub Profile</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                    {[
                      { name: "Marcus Williams", email: "helper@portalapp.com", role: "Helper", av: "MW", pw: "Helper@123", recommended: true },
                      { name: "Sarah Johnson", email: "client@portalapp.com", role: "Client", av: "SJ", pw: "Client@123" },
                      { name: "Diana Chen", email: "admin@portalapp.com", role: "Admin", av: "DC", pw: "Admin@123" }
                    ].map(u => (
                      <div key={u.email} onClick={() => setOauthSelUser(u)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: oauthSelUser?.email === u.email ? "rgba(5, 150, 105, 0.05)" : "rgba(15,23,42,0.01)", border: `1px solid ${oauthSelUser?.email === u.email ? "var(--helper-ac)" : "rgba(15,23,42,0.06)"}`, borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: oauthSelUser?.email === u.email ? "var(--helper-ac)" : "#64748B", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "900" }}>
                          {u.av}
                        </div>
                        <div style={{ flex: "1" }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--z300)" }}>{u.name} {u.recommended && <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "4px", background: "rgba(5, 150, 105, 0.1)", color: "#059669", marginLeft: "4px" }}>Recommended</span>}</div>
                        </div>
                        <span className="chip chip-zinc" style={{ fontSize: "0.58rem" }}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn btn-g btn-fw" onClick={() => setOauthProvider(null)}>Cancel</button>
                    <button className="btn btn-p btn-fw" disabled={!oauthSelUser} style={{ background: "#2ea44f", color: "#FFFFFF", boxShadow: "none" }} onClick={async () => {
                      if (!oauthSelUser) return;
                      setOauthStep(2);
                      setTimeout(async () => {
                        try {
                          const r = await login(oauthSelUser.email, oauthSelUser.pw);
                          if (r.ok) {
                            toast(`GitHub OAuth authorized. Connected to ${oauthSelUser.role} Portal as ${oauthSelUser.name}.`, "success");
                          } else {
                            toast("Simulated GitHub authorization failed.", "error");
                          }
                        } catch(e) {
                          toast("Simulated GitHub connection failed.", "error");
                        }
                        setOauthProvider(null);
                      }, 1800);
                    }}>
                      Authorize PortalApp
                    </button>
                  </div>
                </>
              )}
              {oauthStep === 2 && (
                <div style={{ padding: "40px 0", textAlign: "center" }}>
                  <div className="spinner" style={{ width: "36px", height: "36px", borderWidth: "3px", marginBottom: "16px", borderTopColor: "#2ea44f" }} />
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--z300)", marginBottom: "4px" }}>Redirecting back to application...</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--z500)" }}>Authorized successfully. Accessing PortalApp securely.</p>
                </div>
              )}
            </div>
          )}
          {oauthProvider === "Apple" && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              {oauthStep === 1 && (
                <>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "#000000", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {APPLE_SVG}
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--z300)", marginBottom: "6px" }}>Sign in with Apple ID</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--z400)", marginBottom: "24px" }}>
                    Use your Apple ID <strong>diana.chen@icloud.com</strong> to securely log into PortalApp as Administrator.
                  </p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
                    <button className="btn btn-signin" style={{ background: "#000000", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.15)", width: "100%", padding: "13px" }} onClick={() => {
                      setOauthSelUser({ name: "Diana Chen", email: "admin@portalapp.com", pw: "Admin@123", role: "Admin" });
                      setOauthStep(2);
                      setTimeout(async () => {
                        try {
                          const r = await login("admin@portalapp.com", "Admin@123");
                          if (r.ok) {
                            toast("Apple ID authenticated. Connected to Admin Portal as Diana Chen.", "success");
                          } else {
                            toast("Simulated Apple ID login failed.", "error");
                          }
                        } catch(e) {
                          toast("Simulated Apple ID connection failed.", "error");
                        }
                        setOauthProvider(null);
                      }, 4200);
                    }}>
                      Continue with Face ID
                    </button>
                    <button className="btn btn-g" style={{ width: "100%" }} onClick={() => setOauthProvider(null)}>Cancel</button>
                  </div>
                  <div style={{ marginTop: "14px", fontSize: "0.7rem", color: "var(--z500)" }}>
                    Apple ID details and security authentication is protected under standard end-to-end encryption protocols.
                  </div>
                </>
              )}
              {oauthStep === 2 && (
                <div style={{ padding: "20px 0" }}>
                  <div style={{ width: "80px", height: "80px", border: "3px dashed rgba(52, 211, 153, 0.2)", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", animation: "faceIdScan 2s infinite ease-in-out" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.5" style={{ width: "40px", height: "40px" }}>
                      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" strokeLinecap="round"/>
                      <circle cx="12" cy="11" r="3"/>
                      <path d="M12 14v1m-3.5-3.5h7" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#34D399", marginBottom: "4px" }}>Scanning Face ID...</h4>
                  <p style={{ fontSize: "0.825rem", color: "var(--z500)" }}>Authenticating securely using Apple Biometrics encryption</p>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
      <Toasts items={items} kill={kill}/>
    </>
  );
}

/* ════════════════════════ SHARED SHELL ════════════════════════════════════ */
function Shell({ user, tab, setTab, nav, children, toast, logout }) {
  const [pmOpen, setPmOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hasNotifDot, setHasNotifDot] = useState(() => {
    const saved = localStorage.getItem("em_has_notif_dot");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("em_notifications");
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      { id: 1, text: "Sarah Johnson posted a new high-priority errand: 'Deliver urgent documents to court.'", time: "2m ago" },
      { id: 2, text: "Helper Marcus Williams reached a 30-day streak milestone!", time: "15m ago" },
      { id: 3, text: "System Audit: Escalation dispute resolved by Administrator.", time: "1h ago" }
    ];
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pmRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const h = e => { 
      if (pmRef.current && !pmRef.current.contains(e.target)) setPmOpen(false); 
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const ROLE_LABEL = { client:"Client", helper:"Helper", admin:"Admin" };

  return (
    <div className="shell" data-role={user.role}>
      {/* Animated background color orbs and grid lines */}
      <div className="auth-orbs">
        <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
      </div>
      <div className="auth-grid"/>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-l">
          <div className="logo-mark"><Ic n="logo" s={15}/></div>
          <div className="logo-name">Errand<span>Mate</span></div>
          <div className="role-badge">{ROLE_LABEL[user.role]}</div>
        </div>
        <div className="topbar-r">
          <div style={{position:"relative"}} ref={notifRef}>
            <div className="top-icon-btn" onClick={() => { setNotifOpen(v => !v); setHasNotifDot(false); localStorage.setItem("em_has_notif_dot", JSON.stringify(false)); }}>
              <Ic n="bell" s={14}/>
              {hasNotifDot && notifications.length > 0 && <span className="top-notif-dot"/>}
            </div>
            {notifOpen && (
              <div className="pmenu" style={{ right: 0, width: "320px" }}>
                <div className="pmenu-hd" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="pmenu-role" style={{ fontSize: "0.8rem", color: "var(--ac)" }}>Notifications</span>
                  {notifications.length > 0 && (
                    <button className="btn btn-xs btn-g" onClick={() => { setNotifications([]); localStorage.setItem("em_notifications", JSON.stringify([])); setHasNotifDot(false); localStorage.setItem("em_has_notif_dot", JSON.stringify(false)); toast("All notifications cleared.", "success"); }} style={{ padding: "3px 8px", fontSize: "0.65rem" }}>
                      Clear All
                    </button>
                  )}
                </div>
                <div className="pmenu-body" style={{ maxHeight: "250px", overflowY: "auto", padding: "6px" }}>
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} style={{ padding: "8px 10px", borderBottom: "1px solid var(--bd)", fontSize: "0.78rem", lineHeight: "1.4", color: "var(--z300)" }}>
                        <div style={{ color: "var(--z200)" }}>{n.text}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--z500)", marginTop: "4px" }}>{n.time}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "20px", textAlign: "center", color: "var(--z500)", fontSize: "0.8rem", fontStyle: "italic" }}>
                      No new notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {user.role === "admin" && (
            <div className="top-icon-btn" onClick={() => toast("All systems operational ✓","success")}><Ic n="activity" s={14}/></div>
          )}
          <div style={{position:"relative"}} ref={pmRef}>
            <div className="top-av" onClick={() => setPmOpen(v=>!v)}>{user.av}</div>
            {pmOpen && (
              <div className="pmenu">
                <div className="pmenu-hd">
                  <div className="pmenu-av-row">
                    <div className="pmenu-av">{user.av}</div>
                    <div><div className="pmenu-name">{user.name}</div><div className="pmenu-email">{user.email}</div></div>
                  </div>
                  <div className="pmenu-role">{ROLE_LABEL[user.role]} Portal</div>
                </div>
                <div className="pmenu-body">
                  {[["profile","Profile","profile"],["settings","Settings","settings"]].map(([t,l,ic])=>(
                    <button key={t} className="pmenu-item" onClick={()=>{setTab(t);setPmOpen(false);}}>
                      <Ic n={ic} s={13}/>{l}
                    </button>
                  ))}
                  <div className="pmenu-sep"/>
                  <button className="pmenu-item danger" onClick={logout}>
                    <Ic n="logout" s={13}/>Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="layout-body">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sb-top">
            {["main","account"].map(group => {
              const items = nav.filter(n => n.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  <div className="sb-section">{group}</div>
                  {items.map(n => (
                    <button key={n.id} className={`nav-item${tab===n.id?" active":""}`} onClick={() => setTab(n.id)}>
                      <div className="nav-ic"><Ic n={n.ic} s={13}/></div>
                      {n.label}
                      {n.badge ? <span className={`nav-badge${n.badgeGreen?" green":""}`}>{n.badge}</span> : null}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="sb-foot">
            <div className="sb-user-card">
              <div className="sb-uav">{user.av}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="sb-uname">{user.name}</div>
                <div className="sb-urole">{ROLE_LABEL[user.role]}</div>
              </div>
            </div>
            <button className="btn btn-g btn-fw btn-sm" style={{justifyContent:"flex-start",gap:8}} onClick={logout}>
              <Ic n="logout" s={13}/>Sign out
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main-scroll">{children}</div>
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <div className="bottom-nav-inner">
          {nav.filter(n=>n.mobile!==false).slice(0,5).map(n=>(
            <button key={n.id} className={`bnav-btn${tab===n.id?" active":""}`} onClick={()=>setTab(n.id)}>
              {n.badge&&<span className="bnav-dot"/>}
              <div className="bnav-btn-ic"><Ic n={n.ic} s={18}/></div>
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CLIENT PORTAL
══════════════════════════════════════════════════════════════════════════ */
function ClientPortal({ user, logout }) {
  const { setUser } = useAuth();
  const { items, toast, kill } = useToast();
  const [tab, setTab] = useState("overview");
  const [tasks, setTasks]     = useState([]);
  const [taskModal, setTaskModal] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(null);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [settings, setSettings] = useState({notifTask:true,notifHelper:true,notifPay:true,locShare:true,profVis:true,reviewShow:true,autoCharge:false,twoFA:false});
  const [chatMsgs, setChatMsgs] = useState([
    {id:1,mine:false,text:"Hi! I've picked up your grocery list and heading to Whole Foods now.",ts:"3:41 PM"},
    {id:2,mine:true, text:"Great, please get the kombucha from the refrigerated section not the shelf.",ts:"3:42 PM"},
    {id:3,mine:false,text:"Got it! Also the organic milk is on sale 2-for-1, should I get the deal?",ts:"3:44 PM"},
  ]);
  const [chatInput, setChatInput] = useState("");
  const [nf, setNf] = useState({title:"",desc:"",priority:"medium",due:"",loc:"",budget:"",category:"grocery"});
  const [ne, setNe] = useState({});

  const loadTasks = useCallback(async () => {
    try {
      const data = await api.request("/api/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.request("/api/auth/me");
      setUser(data.user);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  }, [setUser]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const actives = tasks.filter(t=>t.status!=="completed").length;
  const done    = tasks.filter(t=>t.status==="completed").length;
  const spent   = tasks.filter(t=>t.status==="completed").reduce((s,t)=>s+t.pay,0);
  const avgRating = tasks.filter(t=>t.rating).length ? (tasks.filter(t=>t.rating).reduce((s,t)=>s+t.rating,0)/tasks.filter(t=>t.rating).length).toFixed(1) : "N/A";

  const PCLASS = {high:"hi",medium:"med",low:"lo"};
  const STATUS_CHIP = {active:<span className="chip chip-blue">Active</span>,pending:<span className="chip chip-yellow">Pending</span>,completed:<span className="chip chip-green">Done</span>};
  const CAT_LABELS = {grocery:"Grocery",errand:"Errand",transport:"Transport",assembly:"Assembly",pet:"Pet Care"};

  const nav = [
    {id:"overview",ic:"dash",  label:"Overview",group:"main"},
    {id:"tasks",   ic:"tasks", label:"My Tasks",group:"main",badge:actives||null},
    {id:"post",    ic:"post",  label:"Post Task",group:"main"},
    {id:"track",   ic:"map",   label:"Live Track",group:"main"},
    {id:"payments",ic:"pay",   label:"Payments",group:"main"},
    {id:"reviews", ic:"review",label:"Reviews",group:"main"},
    {id:"addrbook",ic:"addrbk",label:"Addresses",group:"main"},
    {id:"profile", ic:"profile",label:"Profile",group:"account"},
    {id:"settings",ic:"settings",label:"Settings",group:"account"},
  ];

  function sendChat() {
    if (!chatInput.trim()) return;
    setChatMsgs(m=>[...m,{id:Date.now(),mine:true,text:chatInput.trim(),ts:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}]);
    setChatInput("");
    setTimeout(()=>setChatMsgs(m=>[...m,{id:Date.now()+1,mine:false,text:"On it! Will update you when I'm at checkout.",ts:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),1200);
  }

  async function postTask() {
    const errs={};
    if (!nf.title.trim()) errs.title="Title required";
    if (!nf.due) errs.due="Due date required";
    if (!nf.budget) errs.budget="Budget required";
    if (Object.keys(errs).length) { setNe(errs); return; }
    try {
      await api.request("/api/tasks", {
        method: "POST",
        body: JSON.stringify(nf)
      });
      setNf({title:"",desc:"",priority:"medium",due:"",loc:"",budget:"",category:"grocery"});
      setNe({});
      setNewOpen(false);
      toast("Task posted! Helpers will respond within minutes.","success");
      loadTasks();
      refreshUser();
    } catch (err) {
      toast(err.message || "Failed to post task.", "error");
    }
  }

  async function deleteTask(id) {
    try {
      await api.request(`/api/tasks/${id}`, { method: "DELETE" });
      toast("Task deleted successfully.", "success");
      setTaskModal(null);
      loadTasks();
      refreshUser();
    } catch (err) {
      toast(err.message || "Failed to delete task.", "error");
    }
  }

  async function submitReview(id, rating) {
    try {
      await api.request(`/api/tasks/${id}/review`, {
        method: "POST",
        body: JSON.stringify({ rating })
      });
      toast(`Rated ${rating} / 5 - thank you!`, "success");
      if (taskModal && taskModal.id === id) {
        setTaskModal(m => ({ ...m, rating, reviewed: true }));
      }
      loadTasks();
      refreshUser();
    } catch (err) {
      toast(err.message || "Failed to submit review.", "error");
    }
  }

  const visible = tasks
    .filter(t=>filter==="all"||t.status===filter)
    .filter(t=>!search||t.title.toLowerCase().includes(search.toLowerCase())||t.desc?.toLowerCase().includes(search.toLowerCase()));

  const HELPER_PROFILES = [
    {name:"Marcus Williams",av:"MW",rating:4.85,jobs:187,spec:"Grocery & Delivery",dist:"0.8 mi",price:"$22–45/task",online:true},
    {name:"Priya Malhotra",av:"PM",rating:4.9,jobs:94,spec:"Assembly & Cleaning",dist:"1.4 mi",price:"$30–90/task",online:true},
    {name:"Leon Krause",av:"LK",rating:4.2,jobs:32,spec:"Pharmacy & Errands",dist:"0.5 mi",price:"$15–25/task",online:false},
    {name:"Aisha Patel",av:"AP",rating:4.95,jobs:41,spec:"Pet Care & Walking",dist:"0.3 mi",price:"$25–55/task",online:true},
  ];

  return (
    <Shell user={user} tab={tab} setTab={setTab} nav={nav} toast={toast} logout={logout}>
      <div className="page">

        {/* OVERVIEW */}
        {tab==="overview"&&<>
          <div className="page-hd">
            <div><div className="page-title">Good afternoon, {user.name.split(" ")[0]}</div><div className="page-sub">Here's your errand dashboard</div></div>
            <div className="page-actions">
              <button className="btn btn-g btn-sm" onClick={()=>setTab("track")}><Ic n="map" s={12}/>Live Track</button>
              <button className="btn btn-p btn-sm" onClick={()=>setNewOpen(true)}><Ic n="plus" s={12}/>New Task</button>
            </div>
          </div>
          <div className="stat-row">
            {[
              {val:actives,lbl:"Active Tasks",delta:"↑2 this week",up:true,clr:"var(--client-ac)"},
              {val:done,   lbl:"Completed",   delta:"all time",up:true,clr:"#00D97E"},
              {val:`$${spent}`,lbl:"Total Spent",delta:"↑$240 this month",up:false,clr:"var(--z200)"},
              {val:avgRating==="N/A"?"N/A":avgRating+" / 5",lbl:"Avg Rating",delta:"from your reviews",up:true,clr:"var(--helper-ac)"},
            ].map(s=>(
              <div className="stat-cell" key={s.lbl}>
                <div className="stat-accent-bar" style={{background:s.clr}}/>
                <div className="stat-val" style={{color:s.clr}}>{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
                <div className={`stat-delta ${s.up?"up":"dn"}`}>{s.delta}</div>
              </div>
            ))}
          </div>

          <div className="grid-2 mb-20">
            <div className="card">
              <div className="card-hd"><div><div className="card-title">Recent Tasks</div><div className="card-sub">Latest activity</div></div><button className="card-link" onClick={()=>setTab("tasks")}>View all <Ic n="arrow" s={11}/></button></div>
              {tasks.slice(0,4).map(t=>(
                <div key={t.id} className="lrow" style={{cursor:"pointer"}} onClick={()=>{setTaskModal(t);}}>
                  <div className={`lrow-ic${t.status!=="completed"?" accent":""}`}><Ic n={t.status==="completed"?"check":t.status==="active"?"activity":"tasks"} s={14}/></div>
                  <div className="lrow-info">
                    <div className="lrow-title">{t.title}</div>
                    <div className="lrow-sub">{t.helper||"Awaiting helper"} · {t.due}</div>
                  </div>
                  <div className="lrow-r">
                    <div className="lrow-val" style={{color:"var(--ac)"}}>${t.pay}</div>
                    {STATUS_CHIP[t.status]}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="card mb-14">
                <div className="card-hd"><div className="card-title">Wallet</div></div>
                <div style={{fontSize:"2.2rem",fontWeight:800,letterSpacing:"-.04em",color:"var(--ac)",marginBottom:4}}>${user.balance?.toFixed(2)}</div>
                <div style={{fontSize:".78rem",color:"var(--z400)",marginBottom:16}}>Available balance</div>
                <div style={{display:"flex",gap:7}}>
                  <button className="btn btn-p btn-sm" onClick={()=>toast("Top-up coming soon.","info")}>Add funds</button>
                  <button className="btn btn-g btn-sm" onClick={()=>toast("Withdrawal coming soon.","info")}>Withdraw</button>
                </div>
              </div>
              <div className="card">
                <div className="card-hd"><div className="card-title">Active Helper</div></div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div className="top-av" style={{width:40,height:40,fontSize:".82rem",cursor:"default",background:"var(--helper-ac)",color:"var(--z950)"}}>MW</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:".88rem"}}>Marcus Williams</div>
                    <div style={{fontSize:".72rem",color:"var(--z400)",marginTop:2}}>
                      <span className="dot dot-green" style={{marginRight:5}}/>Currently on your grocery run
                    </div>
                  </div>
                </div>
                <button className="btn btn-g btn-sm btn-fw" style={{marginTop:14}} onClick={()=>setChatOpen(tasks[0])}>
                  <Ic n="chat" s={12}/>Open Chat
                </button>
              </div>
            </div>
          </div>

          <div className="card mb-14">
            <div className="card-hd"><div><div className="card-title">Browse Helpers Near You</div><div className="card-sub">Verified and available now</div></div></div>
            <div className="grid-2">
              {HELPER_PROFILES.map(h=>(
                <div key={h.name} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:"1px solid var(--bd)"}}>
                  <div className="top-av" style={{width:36,height:36,fontSize:".72rem",cursor:"default",background:"var(--z700)",color:"var(--z200)"}}>{h.av}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:".83rem",display:"flex",alignItems:"center",gap:6}}>{h.name}<span className={`dot ${h.online?"dot-green":"dot-zinc"}`}/></div>
                    <div style={{fontSize:".7rem",color:"var(--z400)",marginTop:1}}>{h.spec} · {h.dist}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                      <Stars rating={Math.round(h.rating)} size={10}/>
                      <span style={{fontSize:".68rem",color:"var(--z500)"}}>{h.rating} · {h.jobs} jobs</span>
                    </div>
                  </div>
                  <button className="btn btn-g btn-xs" onClick={()=>toast(`Message sent to ${h.name}.`,"success")}>Book</button>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* MY TASKS */}
        {tab==="tasks"&&<>
          <div className="page-hd">
            <div><div className="page-title">My Tasks</div><div className="page-sub">{tasks.length} total · {actives} active</div></div>
            <div className="page-actions">
              <button className="btn btn-p btn-sm" onClick={()=>setNewOpen(true)}><Ic n="plus" s={12}/>New task</button>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            <div className="ii-wrap" style={{flex:1,minWidth:180}}>
              <span className="ii-prefix"><Ic n="search" s={13}/></span>
              <input className="ii" placeholder="Search tasks…" value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:34}}/>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {[["all","All"],["pending","Pending"],["active","Active"],["completed","Done"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)} className={`btn btn-sm ${filter===v?"btn-p":"btn-g"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="tc-list">
            {visible.length===0 ? (
              <div className="card empty-state"><div className="empty-icon"><Ic n="tasks" s={40}/></div><div className="empty-title">No tasks found</div><div className="empty-sub">{search?`No results for "${search}"`:"Post your first task to get started."}</div></div>
            ) : visible.map(t=>(
              <div key={t.id} className={`tc ${PCLASS[t.priority]}`} onClick={()=>setTaskModal(t)}>
                <div className="tc-row1">
                  <div className={`tc-cb${t.status==="completed"?" done":""}`}>{t.status==="completed"&&<Ic n="check" s={10}/>}</div>
                  <div className="tc-body">
                    <div className={`tc-title${t.status==="completed"?" done":""}`}>{t.title}</div>
                    <div className="tc-desc">{t.desc}</div>
                  </div>
                  <div className="tc-acts" onClick={e=>e.stopPropagation()}>
                    {t.status!=="completed"&&<button className="btn btn-icon btn-g btn-sm" onClick={()=>{setChatOpen(t);}}>
                      <Ic n="chat" s={12}/>
                    </button>}
                    <button className="btn btn-icon btn-d btn-sm" onClick={()=>{deleteTask(t.id);}}>
                      <Ic n="trash" s={12}/>
                    </button>
                  </div>
                </div>
                <div className="tc-meta">
                  {STATUS_CHIP[t.status]}
                  <span className={`chip ${t.priority==="high"?"chip-red":t.priority==="medium"?"chip-yellow":"chip-green"}`}>{t.priority}</span>
                  <span style={{fontSize:".69rem",color:"var(--z500)",display:"flex",alignItems:"center",gap:3}}><Ic n="sched" s={11}/>{t.due}</span>
                  {t.loc&&<span style={{fontSize:".69rem",color:"var(--z500)",display:"flex",alignItems:"center",gap:3}}><Ic n="map" s={11}/>{t.loc}</span>}
                  <span style={{marginLeft:"auto",fontWeight:700,fontSize:".84rem",color:"var(--ac)"}}>${t.pay}</span>
                  {t.rating&&<Stars rating={t.rating} size={11}/>}
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* POST TASK */}
        {tab==="post"&&<>
          <div className="page-hd"><div><div className="page-title">Post a Task</div><div className="page-sub">Describe your errand and set a budget</div></div></div>
          <div style={{maxWidth:600}}>
            <div className="card mb-14">
              <div style={{fontWeight:700,fontSize:".84rem",marginBottom:14,color:"var(--z300)"}}>Task Details</div>
              <div className="iw"><label className="il">Title *</label>
                <input className={`ii${ne.title?" ii-err":""}`} placeholder="e.g. Grocery run at Whole Foods" value={nf.title} onChange={e=>setNf(p=>({...p,title:e.target.value}))}/>
                {ne.title&&<span className="fe">{ne.title}</span>}
              </div>
              <div className="iw"><label className="il">Description & Instructions</label>
                <textarea className="ii" rows={3} placeholder="Specific items, brands, special instructions, notes for the helper…" value={nf.desc} onChange={e=>setNf(p=>({...p,desc:e.target.value}))}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div className="iw"><label className="il">Category</label>
                  <select className="ii" value={nf.category} onChange={e=>setNf(p=>({...p,category:e.target.value}))}>
                    {Object.entries(CAT_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="iw"><label className="il">Priority</label>
                  <select className="ii" value={nf.priority} onChange={e=>setNf(p=>({...p,priority:e.target.value}))}>
                    <option value="high">High — urgent</option><option value="medium">Medium</option><option value="low">Low — flexible</option>
                  </select>
                </div>
                <div className="iw"><label className="il">Due Date *</label>
                  <input type="date" className={`ii${ne.due?" ii-err":""}`} value={nf.due} onChange={e=>setNf(p=>({...p,due:e.target.value}))}/>
                  {ne.due&&<span className="fe">{ne.due}</span>}
                </div>
                <div className="iw"><label className="il">Budget (USD) *</label>
                  <div className="ii-wrap"><span className="ii-prefix" style={{fontWeight:700,fontSize:".82rem"}}>$</span>
                    <input className={`ii${ne.budget?" ii-err":""}`} type="number" placeholder="0.00" value={nf.budget} onChange={e=>setNf(p=>({...p,budget:e.target.value}))} style={{paddingLeft:28}}/>
                  </div>
                  {ne.budget&&<span className="fe">{ne.budget}</span>}
                </div>
              </div>
              <div className="iw"><label className="il">Pickup / Service Location</label>
                <div className="ii-wrap"><span className="ii-prefix"><Ic n="map" s={13}/></span>
                  <input className="ii" placeholder="Address or location description" value={nf.loc} onChange={e=>setNf(p=>({...p,loc:e.target.value}))} style={{paddingLeft:34}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:6}}>
                <button className="btn btn-p" onClick={postTask}><Ic n="plus" s={13}/>Post Task</button>
                <button className="btn btn-g" onClick={()=>setNf({title:"",desc:"",priority:"medium",due:"",loc:"",budget:"",category:"grocery"})}>Clear</button>
              </div>
            </div>
            <div className="card" style={{fontSize:".78rem",color:"var(--z400)",lineHeight:1.7}}>
              <div style={{fontWeight:700,color:"var(--z300)",marginBottom:6,display:"flex",alignItems:"center",gap:6}}><Ic n="info" s={13}/>Pricing guide</div>
              Grocery runs typically $15–35 · Transport $30–80 · Assembly $50–120 · Errands $10–30 · Pet care $25–60
            </div>
          </div>
        </>}

        {/* LIVE TRACK */}
        {tab==="track"&&<>
          <div className="page-hd"><div><div className="page-title">Live Tracking</div><div className="page-sub">Real-time location of your active tasks</div></div></div>
          <div className="map-box">
            <div className="map-grid"/>
            <div className="map-road-h" style={{top:"36%",left:0,right:0}}/>
            <div className="map-road-h" style={{top:"65%",left:0,right:0}}/>
            <div className="map-road-v" style={{left:"29%",top:0,bottom:0}}/>
            <div className="map-road-v" style={{left:"61%",top:0,bottom:0}}/>
            <div className="map-pin" style={{left:"30%",top:"40%",animationDelay:"0s"}}><Ic n="map" s={24} c="var(--client-ac)"/></div>
            <div className="map-pin" style={{left:"62%",top:"68%",animationDelay:"0.7s"}}><Ic n="map" s={24} c="var(--helper-ac)"/></div>
            <div className="map-pin" style={{left:"76%",top:"40%",animationDelay:"1.3s"}}><Ic n="map" s={20} c="var(--z400)"/></div>
            <svg className="map-route" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points="30,40 62,40 62,68" stroke="var(--client-ac)" strokeWidth=".4" fill="none" strokeDasharray="2 1.5" opacity=".7"/>
            </svg>
            <div className="map-label"><span className="dot dot-green" style={{marginRight:6}}/>Marcus is 0.8 mi away · ETA 12 min</div>
            <div className="map-ctl">
              {["+","–","⊕"].map(b=><div key={b} className="map-btn" onClick={()=>toast(`Map: ${b}`,"info")}>{b}</div>)}
            </div>
          </div>
          {tasks.filter(t=>t.status!=="completed").map(t=>(
            <div key={t.id} className="card mb-14" style={{display:"flex",alignItems:"center",gap:12}}>
              <div className={`lrow-ic accent`}><Ic n={t.status==="active"?"activity":"tasks"} s={14}/></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:".86rem"}}>{t.title}</div>
                <div style={{fontSize:".72rem",color:"var(--z400)",marginTop:2,display:"flex",gap:12}}>
                  <span><Ic n="map" s={11}/> {t.loc||"—"}</span>
                  <span><Ic n="profile" s={11}/> {t.helper||"Awaiting helper"}</span>
                  <span><Ic n="sched" s={11}/> {t.due}</span>
                </div>
              </div>
              {STATUS_CHIP[t.status]}
              {t.helper&&<button className="btn btn-g btn-sm" onClick={()=>setChatOpen(t)}><Ic n="chat" s={12}/>Chat</button>}
            </div>
          ))}
        </>}

        {/* PAYMENTS */}
        {tab==="payments"&&<>
          <div className="page-hd"><div><div className="page-title">Payments</div><div className="page-sub">Billing and transaction history</div></div>
            <button className="btn btn-g btn-sm" onClick={()=>toast("Statement downloaded.","success")}>Export CSV</button>
          </div>
          <div className="grid-2 mb-20">
            <div className="card">
              <div style={{fontSize:".67rem",fontWeight:700,color:"var(--z500)",textTransform:"uppercase",letterSpacing:".09em",marginBottom:10}}>Available Balance</div>
              <div style={{fontSize:"2.4rem",fontWeight:800,letterSpacing:"-.04em",color:"var(--ac)",marginBottom:4}}>${user.balance?.toFixed(2)}</div>
              <div style={{fontSize:".77rem",color:"var(--z400)",marginBottom:16}}>Ready to spend on tasks</div>
              <div style={{display:"flex",gap:7}}><button className="btn btn-p btn-sm" onClick={()=>toast("Top-up coming soon.","info")}>Add funds</button><button className="btn btn-g btn-sm" onClick={()=>toast("Withdrawal coming soon.","info")}>Withdraw</button></div>
            </div>
            <div className="card">
              {[{l:"Total spent (all time)",v:`$${user.spent?.toLocaleString()}`},{l:"Pending charges",v:`$${tasks.filter(t=>t.status!=="completed").reduce((s,t)=>s+t.pay,0)}`},{l:"Tasks paid",v:user.tasks},{l:"Avg task cost",v:`$${Math.round(user.spent/user.tasks)||0}`}].map(r=>(
                <div key={r.l} className="lrow" style={{padding:"9px 0"}}><span style={{fontSize:".8rem",color:"var(--z400)"}}>{r.l}</span><span style={{fontWeight:700}}>{r.v}</span></div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Transaction History</div></div>
            <table className="tbl">
              <thead><tr><th>#</th><th>Task</th><th>Helper</th><th>Category</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {tasks.map((t,i)=>(
                  <tr key={t.id} onClick={()=>toast(`Invoice #EM-${1000+t.id} — click to download.`,"info")}>
                    <td className="mono" style={{color:"var(--z500)",fontSize:".72rem"}}>#{1000+t.id}</td>
                    <td style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{t.title}</td>
                    <td style={{color:"var(--z400)"}}>{t.helper||"—"}</td>
                    <td><span className="chip chip-zinc">{CAT_LABELS[t.category]||t.category}</span></td>
                    <td style={{color:"var(--z400)",fontVariantNumeric:"tabular-nums"}}>{t.due}</td>
                    <td style={{fontWeight:700,color:"var(--ac)"}}>${t.pay}</td>
                    <td>{STATUS_CHIP[t.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* REVIEWS */}
        {tab==="reviews"&&<>
          <div className="page-hd"><div><div className="page-title">Reviews</div><div className="page-sub">Your feedback on completed tasks</div></div></div>
          <div className="card mb-14">
            <div className="card-hd"><div className="card-title">Leave a Review</div><div className="card-sub">For recently completed tasks</div></div>
            {tasks.filter(t=>t.status==="completed"&&!t.reviewed).map(t=>(
              <div key={t.id} className="lrow">
                <div className="lrow-ic"><Ic n="tasks" s={14}/></div>
                <div className="lrow-info"><div className="lrow-title">{t.title}</div><div className="lrow-sub">{t.helper} · {t.due}</div></div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                  <Stars rating={t.rating||0} size={14} interactive onChange={r=>submitReview(t.id, r)}/>
                  {t.rating&&<span className="chip chip-green">Rated {t.rating} / 5</span>}
                </div>
              </div>
            ))}
            {tasks.filter(t=>t.status==="completed"&&!t.reviewed).length===0&&(
              <div className="empty-state" style={{padding:"24px 0"}}><div className="empty-icon"><Ic n="star" s={28}/></div><div className="empty-title">All caught up</div><div className="empty-sub">No pending reviews.</div></div>
            )}
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Your Review History</div></div>
            {tasks.filter(t=>t.rating).map(t=>(
              <div key={t.id} className="lrow">
                <div className="lrow-ic"><Ic n="review" s={14}/></div>
                <div className="lrow-info"><div className="lrow-title">{t.title}</div><div className="lrow-sub">{t.helper} · {t.due}</div></div>
                <Stars rating={t.rating} size={13}/>
              </div>
            ))}
          </div>
        </>}

        {/* ADDRESS BOOK */}
        {tab==="addrbook"&&<>
          <div className="page-hd"><div><div className="page-title">Address Book</div><div className="page-sub">Saved locations for faster task posting</div></div>
            <button className="btn btn-p btn-sm" onClick={()=>toast("Add address modal coming soon.","info")}><Ic n="plus" s={12}/>Add Address</button>
          </div>
          {user.addresses.map(a=>(
            <div key={a.id} className="addr-card" onClick={()=>toast(`${a.label} copied to clipboard.`,"success")}>
              <div className="addr-icon"><Ic n="map" s={16}/></div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:".84rem"}}>{a.label}</div><div style={{fontSize:".74rem",color:"var(--z400)",marginTop:2}}>{a.addr}</div></div>
              <button className="btn-ghost btn-sm"><Ic n="copy" s={14}/></button>
            </div>
          ))}
        </>}

        {/* PROFILE */}
        {tab==="profile"&&<>
          <div className="page-hd"><div><div className="page-title">My Profile</div></div></div>
          <div className="card">
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22,paddingBottom:20,borderBottom:"1px solid var(--bd)"}}>
              <div className="top-av" style={{width:56,height:56,fontSize:"1.1rem",cursor:"default",borderRadius:12}}>{user.av}</div>
              <div>
                <div style={{fontWeight:800,fontSize:"1.1rem"}}>{user.name}</div>
                <div style={{fontSize:".82rem",color:"var(--z400)",marginTop:2}}>{user.email} · {user.phone}</div>
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  <span className="chip chip-green"><Ic n="check" s={9}/>Verified</span>
                  <span className="chip chip-ac">Client</span>
                </div>
              </div>
            </div>
            {[{l:"Full name",v:user.name},{l:"Email",v:user.email},{l:"Phone",v:user.phone},{l:"Member since",v:user.joined},{l:"Tasks completed",v:user.tasks},{l:"Total spent",v:`$${user.spent?.toLocaleString()}`},{l:"Average rating given",v:avgRating === "N/A" ? "N/A" : avgRating + " / 5"}].map(f=>(
              <div key={f.l} className="perm-row">
                <div className="perm-l"><div className="perm-title">{f.l}</div><div className="perm-sub" style={{marginTop:2}}>{f.v}</div></div>
                <button className="btn btn-g btn-xs" onClick={()=>toast("Edit profile available in production.","info")}>Edit</button>
              </div>
            ))}
          </div>
        </>}

        {/* SETTINGS */}
        {tab==="settings"&&<>
          <div className="page-hd"><div><div className="page-title">Settings</div><div className="page-sub">Notifications and privacy preferences</div></div></div>
          {[
            {title:"Notifications",rows:[["notifTask","Task status updates","Get notified when your task status changes"],["notifHelper","Helper accepted","Alert when a helper picks up your task"],["notifPay","Payment receipts","Email receipt for every transaction"]]},
            {title:"Privacy",rows:[["locShare","Location sharing","Share your location with assigned helpers"],["profVis","Profile visibility","Allow helpers to view your public profile"],["reviewShow","Show your reviews","Display your given reviews on helper profiles"]]},
            {title:"Security",rows:[["twoFA","Two-factor auth","Add an extra layer of sign-in security"],["autoCharge","Auto-charge wallet","Automatically top up when balance drops below $20"]]},
          ].map(sec=>(
            <div className="card mb-14" key={sec.title}>
              <div style={{fontSize:".65rem",fontWeight:700,color:"var(--z500)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>{sec.title}</div>
              {sec.rows.map(([k,title,desc])=>(
                <div className="perm-row" key={k}>
                  <div className="perm-l"><div className="perm-title">{title}</div><div className="perm-sub">{desc}</div></div>
                  <Toggle on={settings[k]} onChange={v=>{setSettings(s=>({...s,[k]:v}));toast(v?`${title} enabled.`:`${title} disabled.`,"info");}}/>
                </div>
              ))}
            </div>
          ))}
        </>}
      </div>

      {/* TASK DETAIL MODAL */}
      <Modal open={!!taskModal} onClose={()=>setTaskModal(null)} title="Task Details">
        {taskModal&&<>
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {STATUS_CHIP[taskModal.status]}
            <span className={`chip ${taskModal.priority==="high"?"chip-red":taskModal.priority==="medium"?"chip-yellow":"chip-green"}`}>{taskModal.priority}</span>
            <span className="chip chip-zinc">{CAT_LABELS[taskModal.category]||taskModal.category}</span>
            <span style={{marginLeft:"auto",fontWeight:800,fontSize:"1rem",color:"var(--ac)"}}>${taskModal.pay}</span>
          </div>
          <div style={{fontWeight:700,fontSize:"1rem",marginBottom:6}}>{taskModal.title}</div>
          <div style={{fontSize:".83rem",color:"var(--z300)",lineHeight:1.65,marginBottom:18}}>{taskModal.desc}</div>
          {[{ic:"sched",l:"Due",v:taskModal.due},{ic:"map",l:"Location",v:taskModal.loc||"—"},{ic:"profile",l:"Helper",v:taskModal.helper||"Awaiting assignment"}].map(r=>(
            <div key={r.l} className="lrow" style={{padding:"8px 0"}}>
              <div className="lrow-ic"><Ic n={r.ic} s={13}/></div>
              <span style={{fontSize:".79rem",color:"var(--z400)"}}>{r.l}</span>
              <span style={{fontWeight:600,fontSize:".83rem",marginLeft:"auto"}}>{r.v}</span>
            </div>
          ))}
          {taskModal.status==="completed"&&(
            <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid var(--bd)"}}>
              <div style={{fontSize:".77rem",color:"var(--z400)",marginBottom:8}}>Rate this task:</div>
              <Stars rating={taskModal.rating||0} size={20} interactive onChange={r=>submitReview(taskModal.id, r)}/>
            </div>
          )}
          <div style={{display:"flex",gap:8,marginTop:18}}>
            {taskModal.helper&&<button className="btn btn-g btn-sm" onClick={()=>setChatOpen(taskModal)}>
              <Ic n="chat" s={12}/>Chat with helper
            </button>}
            <button className="btn btn-d btn-sm" onClick={()=>{deleteTask(taskModal.id);}}>
              <Ic n="trash" s={12}/>Cancel task
            </button>
          </div>
        </>}
      </Modal>

      {/* NEW TASK MODAL */}
      <Modal open={newOpen} onClose={()=>setNewOpen(false)} title="Post New Task">
        <div className="iw"><label className="il">Title *</label><input className={`ii${ne.title?" ii-err":""}`} placeholder="Task title" value={nf.title} onChange={e=>setNf(p=>({...p,title:e.target.value}))}/>{ne.title&&<span className="fe">{ne.title}</span>}</div>
        <div className="iw"><label className="il">Description</label><textarea className="ii" rows={2} value={nf.desc} onChange={e=>setNf(p=>({...p,desc:e.target.value}))}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div className="iw"><label className="il">Due date *</label><input type="date" className={`ii${ne.due?" ii-err":""}`} value={nf.due} onChange={e=>setNf(p=>({...p,due:e.target.value}))}/>{ne.due&&<span className="fe">{ne.due}</span>}</div>
          <div className="iw"><label className="il">Budget (USD) *</label><input type="number" className={`ii${ne.budget?" ii-err":""}`} placeholder="$" value={nf.budget} onChange={e=>setNf(p=>({...p,budget:e.target.value}))}/>{ne.budget&&<span className="fe">{ne.budget}</span>}</div>
        </div>
        <div style={{display:"flex",gap:8}}><button className="btn btn-p" onClick={postTask}><Ic n="plus" s={13}/>Post Task</button><button className="btn btn-g" onClick={()=>setNewOpen(false)}>Cancel</button></div>
      </Modal>

      {/* CHAT MODAL */}
      <Modal open={!!chatOpen} onClose={()=>setChatOpen(null)} title={`Chat — ${chatOpen?.title||""}`}>
        {chatOpen&&<>
          <div className="chat-msgs">
            {chatMsgs.map(m=>(
              <div key={m.id} className={`chat-msg${m.mine?" mine":""}`}>
                {!m.mine&&<div className="chat-av-sm" style={{background:"var(--helper-ac)",color:"var(--z950)"}}>MW</div>}
                <div><div className={`chat-bub ${m.mine?"mine":"them"}`}>{m.text}</div><div className="chat-ts">{m.ts}</div></div>
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input className="ii" placeholder="Type a message…" style={{flex:1}} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
            <button className="btn btn-p btn-sm" onClick={sendChat}><Ic n="arrow" s={13}/></button>
          </div>
        </>}
      </Modal>

      <Toasts items={items} kill={kill}/>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HELPER PORTAL
══════════════════════════════════════════════════════════════════════════ */
function HelperPortal({ user, logout }) {
  const { setUser } = useAuth();
  const { items, toast, kill } = useToast();
  const [tab, setTab] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [jobModal, setJobModal] = useState(null);
  const [online, setOnline] = useState(true);
  const [settings, setSettings] = useState({autoAccept:false,radius2mi:true,autoPay:true,emailReceipt:true,pushNotif:true,showProfile:true});

  const loadJobs = useCallback(async () => {
    try {
      const data = await api.request("/api/tasks");
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.request("/api/auth/me");
      setUser(data.user);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  }, [setUser]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const actives    = jobs.filter(j=>j.status==="active");
  const available  = jobs.filter(j=>j.status==="pending"); // pending tasks are available to accept
  const completed  = jobs.filter(j=>j.status==="completed");
  const weekTotal  = WEEK_EARNINGS.reduce((s,d)=>s+d.v,0);
  const maxBar     = Math.max(...WEEK_EARNINGS.map(d=>d.v));

  const TYPE_IC = {grocery:"pay",delivery:"tasks",pet:"star",assembly:"cert",errand:"map"};

  const nav = [
    {id:"dashboard",ic:"dash",   label:"Dashboard",group:"main"},
    {id:"available",ic:"search", label:"Find Jobs",group:"main",badge:available.length||null,badgeGreen:true},
    {id:"active",   ic:"activity",label:"Active Jobs",group:"main",badge:actives.length||null},
    {id:"earnings", ic:"earn",   label:"Earnings",group:"main"},
    {id:"schedule", ic:"sched",  label:"Schedule",group:"main"},
    {id:"leaderboard",ic:"leaderb",label:"Leaderboard",group:"main"},
    {id:"certs",    ic:"cert",   label:"Certifications",group:"main"},
    {id:"profile",  ic:"profile",label:"Profile",group:"account"},
    {id:"settings", ic:"settings",label:"Settings",group:"account"},
  ];

  async function acceptJob(id) {
    try {
      await api.request(`/api/jobs/${id}/accept`, { method: "POST" });
      toast("Job accepted! Client has been notified.", "success");
      setJobModal(null);
      loadJobs();
      refreshUser();
    } catch (err) {
      toast(err.message || "Failed to accept job.", "error");
    }
  }

  async function completeJob(id) {
    try {
      await api.request(`/api/jobs/${id}/complete`, { method: "POST" });
      toast("Job completed! Payout processed.", "success");
      setJobModal(null);
      loadJobs();
      refreshUser();
    } catch (err) {
      toast(err.message || "Failed to complete job.", "error");
    }
  }

  const HEAT_DAYS = Array.from({length:7},(_,i)=>({day:["M","T","W","T","F","S","S"][i],cells:Array.from({length:4},()=>Math.floor(Math.random()*5))}));

  const LEADERBOARD = [
    {rank:1,name:"Priya M.",jobs:94, earn:"$6,230",rating:4.9,streak:21},
    {rank:2,name:"Marcus W.",jobs:187,earn:"$12,840",rating:4.85,streak:14},
    {rank:3,name:"Aisha P.",jobs:41, earn:"$3,100",rating:4.95,streak:8},
    {rank:4,name:"Leon K.", jobs:32,  earn:"$890",  rating:4.2,streak:0},
  ];

  const CERTS = [
    {name:"Verified Identity",issued:"Jan 2024",verified:true,desc:"Government ID + background check passed"},
    {name:"Food Handler License",issued:"Mar 2024",verified:true,desc:"NYC Food Handler Certification #FH-2891"},
    {name:"Vehicle Certified",issued:"Jun 2024",verified:true,desc:"Licensed driver · Insurance verified"},
    {name:"First Aid Trained",issued:null,verified:false,desc:"Upload certificate to get certified"},
  ];

  return (
    <Shell user={user} tab={tab} setTab={setTab} nav={nav} toast={toast} logout={logout}>
      <div className="page">

        {/* DASHBOARD */}
        {tab==="dashboard"&&<>
          <div className="page-hd">
            <div><div className="page-title">Hello, {user.name.split(" ")[0]}</div><div className="page-sub">
              <span className="dot" style={{background:online?"#00D97E":"var(--z500)",marginRight:6}}/>
              {online?"Online · Visible to clients":"Offline"}
            </div></div>
            <div className="page-actions">
              <span style={{fontSize:".78rem",color:online?"#00D97E":"var(--z400)",fontWeight:600}}>{online?"Active":"Inactive"}</span>
              <Toggle on={online} onChange={v=>{setOnline(v);toast(v?"You're online — clients can find you!":"You're now offline.","info");}}/>
            </div>
          </div>
          <div className="stat-row">
            {[
              {val:actives.length, lbl:"Active Jobs",  delta:"in progress now",clr:"var(--helper-ac)"},
              {val:`$${weekTotal}`,lbl:"This Week",    delta:"↑18% vs last week",clr:"#00D97E"},
              {val:user.jobs,      lbl:"Total Jobs",   delta:"all time",clr:"var(--z200)"},
              {val:user.rating ? user.rating + " / 5" : "N/A",lbl:"Your Rating",  delta:`${user.streak} day active streak`,clr:"var(--helper-ac)"},
            ].map(s=>(
              <div className="stat-cell" key={s.lbl}>
                <div className="stat-accent-bar" style={{background:s.clr}}/>
                <div className="stat-val" style={{color:s.clr}}>{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
                <div className="stat-delta up">{s.delta}</div>
              </div>
            ))}
          </div>

          <div className="grid-2 mb-14">
            <div className="card">
              <div className="card-hd"><div className="card-title">Earnings This Week</div><div className="card-sub">${weekTotal} total</div></div>
              <div className="bar-chart" style={{height:80,marginTop:8}}>
                {WEEK_EARNINGS.map(d=>(
                  <div key={d.d} className="bar-col">
                    <div className="bar-val">{d.v>150?`$${d.v}`:""}</div>
                    <div className="bar" style={{height:`${(d.v/maxBar)*64}px`}}/>
                    <div className="bar-lbl">{d.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-hd"><div className="card-title">Balance & Payout</div></div>
              <div style={{fontSize:"2rem",fontWeight:800,letterSpacing:"-.04em",color:"var(--ac)",marginBottom:4}}>${user.balance?.toLocaleString()}</div>
              <div style={{fontSize:".77rem",color:"var(--z400)",marginBottom:16}}>Pending payout · Next: Friday</div>
              {[{l:"Total earned",v:`$${user.totalEarned?.toLocaleString()}`},{l:"Completion rate",v:`${user.completionRate}%`},{l:"Avg response",v:user.responseTime},{l:"Level",v:`${user.level} Member`}].map(r=>(
                <div key={r.l} className="lrow" style={{padding:"7px 0"}}><span style={{fontSize:".79rem",color:"var(--z400)"}}>{r.l}</span><span style={{fontWeight:700,fontSize:".82rem"}}>{r.v}</span></div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><div><div className="card-title">Jobs Near You</div><div className="card-sub">{available.length} available</div></div><button className="card-link" onClick={()=>setTab("available")}>See all <Ic n="arrow" s={11}/></button></div>
            {available.slice(0,3).map(j=>(
              <div key={j.id} className="lrow" style={{cursor:"pointer"}} onClick={()=>setJobModal(j)}>
                <div className="lrow-ic accent"><Ic n={TYPE_IC[j.type]||"tasks"} s={14}/></div>
                <div className="lrow-info"><div className="lrow-title">{j.title}</div><div className="lrow-sub">{j.dist} · {j.client} · {j.due}</div></div>
                <div className="lrow-r">
                  <div className="lrow-val" style={{color:"var(--ac)"}}>${j.pay}</div>
                  <button className="btn btn-p btn-xs" style={{marginTop:4}} onClick={e=>{e.stopPropagation();acceptJob(j.id);}}>Accept</button>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* FIND JOBS */}
        {tab==="available"&&<>
          <div className="page-hd"><div><div className="page-title">Find Jobs</div><div className="page-sub">{available.length} jobs near you</div></div></div>
          {available.length===0?(
            <div className="card empty-state"><div className="empty-icon"><Ic n="search" s={40}/></div><div className="empty-title">No jobs right now</div><div className="empty-sub">Check back soon — new tasks are posted every few minutes.</div></div>
          ):available.map(j=>(
            <div key={j.id} className="card mb-14" style={{cursor:"pointer"}} onClick={()=>setJobModal(j)}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div className="lrow-ic accent"><Ic n={TYPE_IC[j.type]||"tasks"} s={16}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:".9rem"}}>{j.title}</div>
                    <span className={`chip ${j.priority==="high"?"chip-red":j.priority==="medium"?"chip-yellow":"chip-green"}`}>{j.priority}</span>
                  </div>
                  <div style={{fontSize:".79rem",color:"var(--z400)",marginBottom:8}}>Client: {j.client} · {j.dist} away · {j.due}</div>
                  <div style={{fontSize:".78rem",color:"var(--z300)",lineHeight:1.6}}>{j.desc}</div>
                  <div style={{display:"flex",gap:10,marginTop:10,alignItems:"center"}}>
                    <span style={{fontSize:".71rem",color:"var(--z400)",display:"flex",gap:4,alignItems:"center"}}><Ic n="map" s={11}/>{j.loc}</span>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:"1.3rem",fontWeight:800,color:"var(--ac)"}}>${j.pay}</div>
                  <button className="btn btn-p btn-sm" style={{marginTop:8}} onClick={e=>{e.stopPropagation();acceptJob(j.id);}}>Accept</button>
                </div>
              </div>
            </div>
          ))}
        </>}

        {/* ACTIVE JOBS */}
        {tab==="active"&&<>
          <div className="page-hd"><div><div className="page-title">Active Jobs</div><div className="page-sub">{actives.length} in progress</div></div></div>
          {actives.length===0?(
            <div className="card empty-state"><div className="empty-icon"><Ic n="activity" s={40}/></div><div className="empty-title">No active jobs</div><div className="empty-sub">Accept jobs from the Find Jobs tab to see them here.</div></div>
          ):actives.map(j=>(
            <div key={j.id} className={`tc ${j.priority==="high"?"hi":j.priority==="medium"?"med":"lo"}`} style={{marginBottom:8}} onClick={()=>setJobModal(j)}>
              <div className="tc-row1">
                <div className="lrow-ic accent" style={{marginTop:1}}><Ic n={TYPE_IC[j.type]||"tasks"} s={14}/></div>
                <div className="tc-body">
                  <div className="tc-title">{j.title}</div>
                  <div className="tc-desc">{j.loc} · Client: {j.client}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:"1.1rem",fontWeight:800,color:"var(--ac)"}}>${j.pay}</div>
                  <button className="btn btn-p btn-xs" style={{marginTop:6}} onClick={e=>{e.stopPropagation();completeJob(j.id);}}>
                    <Ic n="check" s={11}/>Done
                  </button>
                </div>
              </div>
              <div className="tc-meta" style={{paddingLeft:0,marginTop:10}}>
                <span className="chip chip-blue">In Progress</span>
                <span style={{fontSize:".69rem",color:"var(--z500)",display:"flex",gap:3,alignItems:"center"}}><Ic n="sched" s={11}/>{j.due}</span>
                <span style={{fontSize:".69rem",color:"var(--z500)",display:"flex",gap:3,alignItems:"center"}}><Ic n="map" s={11}/>{j.dist}</span>
              </div>
            </div>
          ))}
        </>}

        {/* EARNINGS */}
        {tab==="earnings"&&<>
          <div className="page-hd"><div><div className="page-title">Earnings</div><div className="page-sub">Income overview and payouts</div></div>
            <div className="page-actions">
              <button className="btn btn-g btn-sm" onClick={()=>toast("Tax statement downloaded.","success")}>Export</button>
              <button className="btn btn-p btn-sm" onClick={()=>toast("Payout initiated! ETA 1–2 business days.","success")}>Request Payout</button>
            </div>
          </div>
          <div className="stat-row mb-20">
            {[{val:`$${user.totalEarned?.toLocaleString()}`,lbl:"Total Earned",clr:"var(--helper-ac)"},{val:`$${weekTotal}`,lbl:"This Week",clr:"#00D97E"},{val:`$${user.balance?.toLocaleString()}`,lbl:"Pending Payout",clr:"var(--z200)"},{val:`${user.completionRate}%`,lbl:"Completion Rate",clr:"var(--admin-ac)"}].map(s=>(
              <div className="stat-cell" key={s.lbl}><div className="stat-accent-bar" style={{background:s.clr}}/><div className="stat-val" style={{color:s.clr}}>{s.val}</div><div className="stat-lbl">{s.lbl}</div></div>
            ))}
          </div>
          <div className="grid-2 mb-14">
            <div className="card">
              <div className="card-hd"><div className="card-title">Weekly Breakdown</div><div className="card-sub">${weekTotal} · 7 days</div></div>
              <div className="bar-chart" style={{height:100}}>
                {WEEK_EARNINGS.map(d=>(
                  <div key={d.d} className="bar-col">
                    <div className="bar-val">${d.v}</div>
                    <div className="bar" style={{height:`${(d.v/maxBar)*80}px`}}/>
                    <div className="bar-lbl">{d.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-hd"><div className="card-title">Monthly Revenue</div></div>
              <div className="bar-chart" style={{height:100}}>
                {[{d:"Feb",v:1820},{d:"Mar",v:2140},{d:"Apr",v:1980},{d:"May",v:2360},{d:"Jun",v:2610},{d:"Jul",v:2840}].map(d=>(
                  <div key={d.d} className="bar-col">
                    <div className="bar-val">${(d.v/1000).toFixed(1)}k</div>
                    <div className="bar" style={{height:`${(d.v/2840)*80}px`}}/>
                    <div className="bar-lbl">{d.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {/* SCHEDULE / CALENDAR */}
        {tab==="schedule"&&<>
          <div className="page-hd"><div><div className="page-title">Schedule</div><div className="page-sub">Availability and upcoming jobs</div></div></div>
          <div className="card mb-14">
            <div className="card-hd"><div className="card-title">Activity Heat Map</div><div className="card-sub">Jobs completed per day this month</div></div>
            <div className="heat-grid">
              {HEAT_DAYS.map((col,ci)=>(
                <div key={ci} className="heat-col">
                  {col.cells.map((lvl,ri)=>(
                    <div key={ri} className={`heat-cell ${lvl===0?"":lvl===1?"l1":lvl===2?"l2":lvl===3?"l3":"l4"}`}
                      title={`${lvl} jobs`} onClick={()=>lvl>0&&toast(`${lvl} job${lvl>1?"s":""} completed this day.`,"info")}/>
                  ))}
                  <div className="bar-lbl" style={{marginTop:4}}>{col.day}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">This Week</div></div>
            {["Mon Jul 21","Tue Jul 22","Wed Jul 23","Thu Jul 24","Fri Jul 25","Sat Jul 26","Sun Jul 27"].map((day,i)=>(
              <div key={day} className="lrow">
                <div className="lrow-ic" style={{background:i<3||i===4?"var(--glow)":"var(--z800)",color:i<3||i===4?"var(--ac)":"var(--z500)"}}><Ic n="sched" s={13}/></div>
                <div className="lrow-info">
                  <div className="lrow-title">{day}</div>
                  <div className="lrow-sub">{i===0?"2 jobs · Grocery run + UPS delivery":i===1?"1 job · Dog walking":i===2?"3 jobs · Office supplies + 2 errands":i===4?"1 job · Vet transport":"No jobs scheduled"}</div>
                </div>
                <div className="lrow-r">
                  <div className="lrow-val" style={{color:i<3||i===4?"var(--ac)":"var(--z500)"}}>{[63,35,90,"—",55,"—","—"][i]===0?"—":`${[63,35,90,"—",55,"—","—"][i]==="—"?"—":"$"+[63,35,90,0,55,0,0][i]||"—"}`}</div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* LEADERBOARD */}
        {tab==="leaderboard"&&<>
          <div className="page-hd"><div><div className="page-title">Leaderboard</div><div className="page-sub">Top helpers in your area this month</div></div></div>
          <div className="card mb-14">
            <div style={{textAlign:"center",padding:"20px 0 24px",borderBottom:"1px solid var(--bd)"}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:"var(--z500)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Your ranking</div>
              <div style={{fontSize:"3rem",fontWeight:900,letterSpacing:"-.05em",color:"var(--ac)"}}>#2</div>
              <div style={{fontSize:".8rem",color:"var(--z400)",marginTop:4}}>Out of 847 helpers · Top 0.2%</div>
              <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:16}}>
                {[{l:"Jobs",v:user.jobs},{l:"Earned",v:`$${user.totalEarned?.toLocaleString()}`},{l:"Streak",v:`${user.streak}d 🔥`}].map(s=>(
                  <div key={s.l} style={{textAlign:"center"}}><div style={{fontWeight:800,color:"var(--white)"}}>{s.v}</div><div style={{fontSize:".66rem",color:"var(--z500)",textTransform:"uppercase",letterSpacing:".07em"}}>{s.l}</div></div>
                ))}
              </div>
            </div>
            {LEADERBOARD.map(h=>(
              <div key={h.rank} className="lb-row">
                <div className={`lb-rank ${h.rank===1?"gold":h.rank===2?"silver":h.rank===3?"bronze":""}`}>#{h.rank}</div>
                <div className="top-av" style={{width:32,height:32,fontSize:".68rem",cursor:"default",background:h.rank===2?"var(--ac)":"var(--z700)",color:h.rank===2?"var(--z950)":"var(--z200)"}}>{h.name.split(" ").map(w=>w[0]).join("")}</div>
                <div className="lrow-info"><div className="lrow-title">{h.name}</div><div className="lrow-sub">{h.jobs} jobs · {h.streak}d streak</div></div>
                <div className="lrow-r">
                  <div className="lrow-val">{h.earn}</div>
                  <Stars rating={Math.round(h.rating)} size={10}/>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* CERTIFICATIONS */}
        {tab==="certs"&&<>
          <div className="page-hd"><div><div className="page-title">Certifications</div><div className="page-sub">Verified credentials boost your visibility</div></div></div>
          <div className="grid-2">
            {CERTS.map(c=>(
              <div key={c.name} className="cert-card">
                {c.verified&&<div className="cert-verified"><span className="chip chip-green"><Ic n="check" s={9}/>Verified</span></div>}
                {!c.verified&&<div className="cert-verified"><span className="chip chip-yellow">Upload</span></div>}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,marginTop:4}}>
                  <div className="lrow-ic" style={{background:c.verified?"var(--glow)":"var(--z800)",color:c.verified?"var(--ac)":"var(--z400)"}}><Ic n={c.verified?"cert":"lock"} s={14}/></div>
                  <div><div style={{fontWeight:700,fontSize:".86rem"}}>{c.name}</div>{c.issued&&<div style={{fontSize:".7rem",color:"var(--z400)"}}>Issued {c.issued}</div>}</div>
                </div>
                <div style={{fontSize:".76rem",color:"var(--z400)",lineHeight:1.55}}>{c.desc}</div>
                {!c.verified&&<button className="btn btn-g btn-sm btn-fw" style={{marginTop:12}} onClick={()=>toast("Certificate upload coming soon.","info")}>Upload Certificate</button>}
              </div>
            ))}
          </div>
        </>}

        {/* PROFILE */}
        {tab==="profile"&&<>
          <div className="page-hd"><div><div className="page-title">My Profile</div><div className="page-sub">Public helper profile</div></div></div>
          <div className="card">
            <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:22,paddingBottom:20,borderBottom:"1px solid var(--bd)"}}>
              <div className="top-av" style={{width:56,height:56,fontSize:"1.1rem",cursor:"default",borderRadius:12}}>{user.av}</div>
              <div>
                <div style={{fontWeight:800,fontSize:"1.1rem"}}>{user.name}</div>
                <div style={{fontSize:".82rem",color:"var(--z400)",marginTop:2}}>{user.email} · {user.phone}</div>
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  <span className="chip chip-green"><Ic n="check" s={9}/>Verified</span>
                  <span className="chip chip-yellow"><Ic n="award" s={9}/>{user.level}</span>
                  <span className="chip chip-ac">Helper</span>
                </div>
              </div>
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <Stars rating={Math.round(user.rating)} size={14}/>
                <div style={{fontSize:".78rem",color:"var(--z400)",marginTop:2}}>{user.rating} ({user.jobs} reviews)</div>
              </div>
            </div>
            {[{l:"Name",v:user.name},{l:"Email",v:user.email},{l:"Phone",v:user.phone},{l:"Member since",v:user.joined},{l:"Level",v:user.level},{l:"Total jobs",v:user.jobs},{l:"Total earned",v:`$${user.totalEarned?.toLocaleString()}`},{l:"Completion rate",v:`${user.completionRate}%`},{l:"Avg response",v:user.responseTime},{l:"Skills",v:user.skills.join(", ")}].map(f=>(
              <div key={f.l} className="perm-row">
                <div className="perm-l"><div className="perm-title">{f.l}</div><div className="perm-sub" style={{marginTop:2}}>{f.v}</div></div>
                <button className="btn btn-g btn-xs" onClick={()=>toast("Edit available in production.","info")}>Edit</button>
              </div>
            ))}
          </div>
        </>}

        {/* SETTINGS */}
        {tab==="settings"&&<>
          <div className="page-hd"><div><div className="page-title">Settings</div></div></div>
          {[
            {title:"Availability",rows:[["autoAccept","Auto-accept jobs","Accept jobs under $30 automatically"],["radius2mi","2-mile radius only","Only show jobs within 2 miles of your location"]]},
            {title:"Payouts",rows:[["autoPay","Auto payout","Request payout automatically when balance exceeds $500"],["emailReceipt","Email receipts","Send email for each completed job"]]},
            {title:"Notifications",rows:[["pushNotif","Push notifications","Job alerts and client messages"],["showProfile","Public profile","Appear in client helper searches"]]},
          ].map(sec=>(
            <div className="card mb-14" key={sec.title}>
              <div style={{fontSize:".65rem",fontWeight:700,color:"var(--z500)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>{sec.title}</div>
              {sec.rows.map(([k,title,desc])=>(
                <div className="perm-row" key={k}>
                  <div className="perm-l"><div className="perm-title">{title}</div><div className="perm-sub">{desc}</div></div>
                  <Toggle on={settings[k]} onChange={v=>{setSettings(s=>({...s,[k]:v}));toast(v?`${title} enabled.`:`${title} disabled.`,"info");}}/>
                </div>
              ))}
            </div>
          ))}
        </>}
      </div>

      <Modal open={!!jobModal} onClose={()=>setJobModal(null)} title="Job Details" center>
        {jobModal&&<>
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <div className="lrow-ic accent" style={{width:44,height:44,borderRadius:10}}><Ic n={TYPE_IC[jobModal.type]||"tasks"} s={18}/></div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:"1rem"}}>{jobModal.title}</div><div style={{fontSize:".79rem",color:"var(--z400)",marginTop:2}}>Posted by {jobModal.client}</div></div>
            <div style={{fontSize:"1.4rem",fontWeight:900,color:"var(--ac)"}}>${jobModal.pay}</div>
          </div>
          <div style={{fontSize:".82rem",color:"var(--z300)",lineHeight:1.6,marginBottom:16,background:"var(--z800)",borderRadius:8,padding:"10px 12px"}}>{jobModal.desc}</div>
          {[{ic:"map",l:"Location",v:jobModal.loc},{ic:"route",l:"Distance",v:jobModal.dist},{ic:"sched",l:"Due",v:jobModal.due},{ic:"warn",l:"Priority",v:jobModal.priority}].map(r=>(
            <div key={r.l} className="lrow" style={{padding:"8px 0"}}>
              <div className="lrow-ic"><Ic n={r.ic} s={13}/></div>
              <span style={{fontSize:".79rem",color:"var(--z400)"}}>{r.l}</span>
              <span style={{fontWeight:600,marginLeft:"auto"}}>{r.v}</span>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:20}}>
            {jobModal.status==="available"&&<button className="btn btn-p" style={{flex:1}} onClick={()=>acceptJob(jobModal.id)}>Accept Job <Ic n="arrow" s={13}/></button>}
            {jobModal.status==="active"&&<button className="btn btn-p" style={{flex:1}} onClick={()=>completeJob(jobModal.id)}><Ic n="check" s={13}/>Mark Complete</button>}
            <button className="btn btn-g" onClick={()=>setJobModal(null)}>Close</button>
          </div>
        </>}
      </Modal>
      <Toasts items={items} kill={kill}/>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN PORTAL
══════════════════════════════════════════════════════════════════════════ */
function AdminPortal({ user, logout }) {
  const { items, toast, kill } = useToast();
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [adminTasks, setAdminTasks] = useState([]);
  const [selUser, setSelUser]     = useState(null);
  const [selDisp, setSelDisp]     = useState(null);
  const [logRunning, setLogRunning] = useState(true);
  const [logs, setLogs] = useState([]);
  const [sysSettings, setSysSett] = useState({maintenance:false,signups:true,helperApps:true,disputeAlerts:true,dailySummary:true,anomalyDetect:true});
  const [perms, setPerms] = useState({helpers_suspend:true,helpers_verify:true,clients_refund:true,financials_view:true,logs_view:true,settings_edit:false});

  const loadAdminData = useCallback(async () => {
    try {
      const uData = await api.request("/api/admin/users");
      setUsers(uData);
      const dData = await api.request("/api/admin/disputes");
      setDisputes(dData);
      const tData = await api.request("/api/tasks");
      setAdminTasks(tData);
    } catch (err) {
      console.error("Failed to load admin data", err);
    }
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      const lData = await api.request("/api/admin/logs");
      setLogs(lData.reverse());
    } catch (err) {
      console.error("Failed to load audit logs", err);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  useEffect(() => {
    if (!logRunning) return;
    loadLogs();
    const interval = setInterval(() => {
      loadLogs();
    }, 3000);
    return () => clearInterval(interval);
  }, [logRunning, loadLogs]);

  const nav = [
    {id:"overview",  ic:"dash",   label:"Overview",group:"main"},
    {id:"users",     ic:"users",  label:"Users",group:"main",badge:users.filter(u=>u.flag).length||null},
    {id:"tasks",     ic:"tasks",  label:"All Tasks",group:"main"},
    {id:"disputes",  ic:"dispute",label:"Disputes",group:"main",badge:disputes.filter(d=>d.status==="open").length||null},
    {id:"finance",   ic:"finance",label:"Financials",group:"main"},
    {id:"analytics", ic:"analyt", label:"Analytics",group:"main"},
    {id:"logs",      ic:"log",    label:"Audit Log",group:"main"},
    {id:"permissions",ic:"perm",  label:"Permissions",group:"main"},
    {id:"profile",   ic:"profile",label:"My Account",group:"account"},
    {id:"settings",  ic:"settings",label:"Platform",group:"account"},
  ];

  const STATUS_CHIP = {active:<span className="chip chip-green">Active</span>,suspended:<span className="chip chip-red">Suspended</span>,inactive:<span className="chip chip-zinc">Inactive</span>};
  const DISP_CHIP   = {open:<span className="chip chip-red">Open</span>,resolved:<span className="chip chip-green">Resolved</span>,reviewing:<span className="chip chip-yellow">Reviewing</span>};

  async function toggleSuspend(email) {
    try {
      const res = await api.request(`/api/admin/users/${email}/suspend`, {
        method: "POST"
      });
      toast(`User status updated to ${res.newStatus.toUpperCase()}.`, "success");
      setSelUser(null);
      loadAdminData();
    } catch (err) {
      toast(err.message || "Failed to update user status.", "error");
    }
  }

  async function resolveDispute(id, resolution) {
    try {
      await api.request(`/api/admin/disputes/${id}/resolve`, {
        method: "POST",
        body: JSON.stringify({ resolution })
      });
      toast(`Dispute ${id} resolved: ${resolution}`, "success");
      setSelDisp(null);
      loadAdminData();
    } catch (err) {
      toast(err.message || "Failed to resolve dispute.", "error");
    }
  }

  return (
    <Shell user={user} tab={tab} setTab={setTab} nav={nav} toast={toast} logout={logout}>
      <div className="page">

        {/* OVERVIEW */}
        {tab==="overview"&&<>
          <div className="page-hd">
            <div><div className="page-title">Platform Overview</div><div className="page-sub">{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</div></div>
            <div className="page-actions">
              <button className="btn btn-g btn-sm" onClick={()=>toast("Platform report generated.","success")}><Ic n="copy" s={12}/>Export</button>
              <button className="btn btn-p btn-sm" onClick={()=>toast("All systems operational ✓","success")}><Ic n="activity" s={12}/>System Check</button>
            </div>
          </div>
          <div className="stat-row">
            {[
              {val:users.length,                       lbl:"Total Users",   delta:"↑3 this week",up:true,  clr:"var(--admin-ac)"},
              {val:"$28,450",                          lbl:"Revenue (MTD)", delta:"↑22% vs last month",up:true,clr:"#00D97E"},
              {val:disputes.filter(d=>d.status==="open").length, lbl:"Open Disputes",  delta:"requires action",up:false,clr:"#FF4444"},
              {val:"99.98%",                           lbl:"API Uptime",    delta:"last 30 days",up:true,  clr:"var(--z200)"},
            ].map(s=>(
              <div className="stat-cell" key={s.lbl}>
                <div className="stat-accent-bar" style={{background:s.clr}}/>
                <div className="stat-val" style={{color:s.clr}}>{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
                <div className={`stat-delta ${s.up?"up":"dn"}`}>{s.delta}</div>
              </div>
            ))}
          </div>

          <div className="grid-2 mb-14">
            <div className="card">
              <div className="card-hd"><div><div className="card-title">Platform Health</div></div></div>
              {[{l:"API Uptime",v:"99.98%",p:99.98,c:"#00D97E"},{l:"Task Success Rate",v:"96.4%",p:96.4,c:"var(--admin-ac)"},{l:"Helper Response",v:"3.8 min avg",p:76,c:"var(--helper-ac)"},{l:"Satisfaction Score",v:"4.8 / 5",p:96,c:"#00D97E"}].map(m=>(
                <div key={m.l} style={{marginBottom:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:".79rem",color:"var(--z400)"}}>{m.l}</span><span style={{fontSize:".8rem",fontWeight:700}}>{m.v}</span></div>
                  <div className="prog-bg" style={{height:5}}><div className="prog-fill" style={{width:`${m.p}%`,background:m.c,height:5}}/></div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-hd"><div><div className="card-title">Open Disputes</div></div><button className="card-link" onClick={()=>setTab("disputes")}>View all <Ic n="arrow" s={11}/></button></div>
              {disputes.filter(d=>d.status==="open").map(d=>(
                <div key={d.id} className="lrow" style={{cursor:"pointer"}} onClick={()=>setSelDisp(d)}>
                  <div className="lrow-ic" style={{background:"rgba(255,68,68,.1)",color:"#FF4444"}}><Ic n="dispute" s={14}/></div>
                  <div className="lrow-info"><div className="lrow-title">{d.id} · {d.task}</div><div className="lrow-sub">{d.client} vs {d.helper} · {d.opened}</div></div>
                  <div className="lrow-r"><div className="lrow-val" style={{color:"#FF4444"}}>{d.amount}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><div><div className="card-title">Live Log Stream</div><div className="card-sub" style={{display:"flex",alignItems:"center",gap:6}}><span className="dot" style={{background:logRunning?"#00D97E":"var(--z500)"}}/>{logRunning?"Live":"Paused"}</div></div>
              <button className="btn btn-g btn-sm" onClick={()=>setLogRunning(v=>!v)}>{logRunning?"Pause":"Resume"}</button>
            </div>
            <div className="log-stream">
              {logs.slice(0,8).map((l,i)=>(
                <div key={i} className="log-line">
                  <span className="log-ts mono">{l.ts}</span>
                  <span className={`mono ${l.lvl==="INFO"?"log-lvl-info":l.lvl==="WARN"?"log-lvl-warn":"log-lvl-err"}`}>{l.lvl}</span>
                  <span className="log-msg">{l.msg}</span>
                </div>
              ))}
              {logRunning&&<div className="log-line"><span className="log-ts mono">{new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span><span className="log-lvl-info mono">INFO</span><span className="log-msg">Waiting for events<span className="log-cursor"/></span></div>}
            </div>
          </div>
        </>}

        {/* USERS */}
        {tab==="users"&&<>
          <div className="page-hd"><div><div className="page-title">User Management</div><div className="page-sub">{users.length} registered users</div></div>
            <button className="btn btn-p btn-sm" onClick={()=>toast("User CSV exported.","success")}><Ic n="copy" s={12}/>Export CSV</button>
          </div>
          <div className="card">
            <table className="tbl">
              <thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Activity</th><th>Verified</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u.id} onClick={()=>setSelUser(u)}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div className="top-av" style={{width:28,height:28,fontSize:".62rem",cursor:"default",background:u.role==="client"?"rgba(255,68,68,.3)":"var(--z700)",color:u.role==="client"?"var(--client-ac)":u.role==="helper"?"var(--helper-ac)":"var(--admin-ac)"}}>{u.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                        <div><div style={{fontWeight:600,fontSize:".82rem"}}>{u.name}</div><div style={{fontSize:".68rem",color:"var(--z500)"}}>{u.email}</div></div>
                        {u.flag&&<Ic n="warn" s={12} c="#FF4444"/>}
                      </div>
                    </td>
                    <td><span className={`chip ${u.role==="client"?"chip-red":u.role==="helper"?"chip-yellow":"chip-blue"}`}>{u.role}</span></td>
                    <td style={{color:"var(--z400)",fontSize:".79rem"}}>{u.joined}</td>
                    <td style={{fontSize:".79rem",color:"var(--z300)"}}>{u.activity}</td>
                    <td>{u.verified?<span className="chip chip-green"><Ic n="check" s={9}/>Yes</span>:<span className="chip chip-zinc">No</span>}</td>
                    <td>{STATUS_CHIP[u.status]}</td>
                    <td><button className="btn btn-g btn-xs" onClick={e=>{e.stopPropagation();setSelUser(u);}}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ALL TASKS */}
        {tab==="tasks"&&<>
          <div className="page-hd"><div><div className="page-title">All Tasks</div><div className="page-sub">Platform-wide task management</div></div></div>
          <div className="card">
            <table className="tbl">
              <thead><tr><th>ID</th><th>Task</th><th>Client</th><th>Helper</th><th>Status</th><th>Value</th><th>Due</th></tr></thead>
              <tbody>
                {adminTasks.map(t=>(
                  <tr key={t.id} onClick={()=>toast(`Task #EM-${1000+t.id} details.`,"info")}>
                    <td className="mono" style={{color:"var(--z500)",fontSize:".72rem"}}>#EM-{1000+t.id}</td>
                    <td style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{t.title}</td>
                    <td style={{color:"var(--z400)"}}>{t.client}</td>
                    <td style={{color:"var(--z400)"}}>{t.helper||"Unassigned"}</td>
                    <td><span className={`chip ${t.status==="completed"?"chip-green":t.status==="active"?"chip-blue":"chip-yellow"}`}>{t.status}</span></td>
                    <td style={{fontWeight:700,color:"var(--ac)"}}>${t.pay}</td>
                    <td style={{color:"var(--z400)",fontSize:".78rem"}}>{t.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* DISPUTES */}
        {tab==="disputes"&&<>
          <div className="page-hd"><div><div className="page-title">Dispute Resolution</div><div className="page-sub">{disputes.filter(d=>d.status==="open").length} open · {disputes.filter(d=>d.status==="reviewing").length} reviewing</div></div></div>
          {disputes.map(d=>(
            <div key={d.id} className="card mb-14" style={{cursor:"pointer",borderColor:d.status==="open"?"rgba(255,68,68,.25)":"var(--bd)"}} onClick={()=>setSelDisp(d)}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div className="lrow-ic" style={{background:"rgba(255,68,68,.08)",color:"#FF6B6B",flexShrink:0}}><Ic n="dispute" s={14}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span className="mono" style={{fontWeight:700,fontSize:".85rem"}}>{d.id}</span>
                    {DISP_CHIP[d.status]}
                    <span style={{marginLeft:"auto",fontWeight:700,color:"#FF6B6B"}}>{d.amount}</span>
                  </div>
                  <div style={{fontWeight:600,fontSize:".84rem",marginBottom:3}}>{d.task}</div>
                  <div style={{fontSize:".74rem",color:"var(--z400)",marginBottom:6}}>{d.client} vs {d.helper} · {d.opened}</div>
                  <div style={{fontSize:".77rem",color:"var(--z300)",lineHeight:1.6}}>{d.desc}</div>
                </div>
              </div>
              {d.status==="open"&&(
                <div style={{display:"flex",gap:8,marginTop:14,paddingTop:12,borderTop:"1px solid var(--bd)"}} onClick={e=>e.stopPropagation()}>
                  <button className="btn btn-p btn-sm" onClick={()=>resolveDispute(d.id,"Refund issued to client")}>Refund Client</button>
                  <button className="btn btn-g btn-sm" onClick={()=>resolveDispute(d.id,"Dismissed — no action")}>Dismiss</button>
                  <button className="btn btn-g btn-sm" onClick={()=>{setDisputes(ds=>ds.map(x=>x.id===d.id?{...x,status:"reviewing"}:x));toast("Marked as reviewing.","info");}}>Mark Reviewing</button>
                </div>
              )}
            </div>
          ))}
        </>}

        {/* FINANCIALS */}
        {tab==="finance"&&<>
          <div className="page-hd"><div><div className="page-title">Financials</div><div className="page-sub">Revenue, payouts and margins</div></div>
            <button className="btn btn-p btn-sm" onClick={()=>toast("Financial report generated.","success")}><Ic n="copy" s={12}/>Export Report</button>
          </div>
          <div className="stat-row mb-20">
            {[{val:"$28,450",lbl:"Revenue MTD",clr:"#00D97E"},{val:"$18,420",lbl:"Helper Payouts",clr:"var(--helper-ac)"},{val:"$10,030",lbl:"Platform Fees",clr:"var(--admin-ac)"},{val:"35.2%",lbl:"Gross Margin",clr:"var(--z200)"}].map(s=>(
              <div className="stat-cell" key={s.lbl}><div className="stat-accent-bar" style={{background:s.clr}}/><div className="stat-val" style={{color:s.clr}}>{s.val}</div><div className="stat-lbl">{s.lbl}</div></div>
            ))}
          </div>
          <div className="grid-2 mb-14">
            <div className="card">
              <div className="card-hd"><div className="card-title">Monthly Revenue</div><div className="card-sub">6-month trend</div></div>
              <div className="bar-chart" style={{height:100}}>
                {[{d:"Feb",v:18200},{d:"Mar",v:21400},{d:"Apr",v:19800},{d:"May",v:23600},{d:"Jun",v:26100},{d:"Jul",v:28450}].map(d=>(
                  <div key={d.d} className="bar-col">
                    <div className="bar-val">${(d.v/1000).toFixed(1)}k</div>
                    <div className="bar" style={{height:`${(d.v/28450)*84}px`}}/>
                    <div className="bar-lbl">{d.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-hd"><div className="card-title">Revenue Split</div></div>
              {[{l:"Helper payouts (64.7%)",v:"$18,420",p:64.7,c:"var(--helper-ac)"},{l:"Platform fee (35.2%)",v:"$10,030",p:35.2,c:"var(--admin-ac)"}].map(m=>(
                <div key={m.l} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:".79rem",color:"var(--z400)"}}>{m.l}</span><span style={{fontWeight:700}}>{m.v}</span></div>
                  <div className="prog-bg" style={{height:6}}><div className="prog-fill" style={{width:`${m.p}%`,background:m.c,height:6}}/></div>
                </div>
              ))}
              <div style={{marginTop:18,paddingTop:14,borderTop:"1px solid var(--bd)"}}>
                {[{l:"Avg task value",v:"$38.50"},{l:"Tasks completed MTD",v:"739"},{l:"Refunds issued",v:"$420"},{l:"Chargeback rate",v:"0.07%"}].map(r=>(
                  <div key={r.l} className="lrow" style={{padding:"7px 0"}}><span style={{fontSize:".79rem",color:"var(--z400)"}}>{r.l}</span><span style={{fontWeight:700}}>{r.v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {/* ANALYTICS */}
        {tab==="analytics"&&<>
          <div className="page-hd"><div><div className="page-title">Analytics</div><div className="page-sub">Platform performance metrics</div></div></div>
          <div className="grid-2 mb-14">
            <div className="card">
              <div className="card-hd"><div className="card-title">Tasks by Category</div></div>
              {[{l:"Grocery & Shopping",p:38,c:"var(--client-ac)"},{l:"Delivery & Pickup",p:26,c:"var(--admin-ac)"},{l:"Assembly & Repairs",p:19,c:"var(--helper-ac)"},{l:"Pet Care",p:10,c:"#00D97E"},{l:"Transport",p:7,c:"var(--z400)"}].map(c=>(
                <div key={c.l} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:".79rem",color:"var(--z400)"}}>{c.l}</span><span style={{fontWeight:700,fontSize:".79rem"}}>{c.p}%</span></div>
                  <div className="prog-bg" style={{height:5}}><div className="prog-fill" style={{width:`${c.p}%`,background:c.c,height:5}}/></div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-hd"><div className="card-title">User Growth</div><div className="card-sub">New signups per month</div></div>
              <div className="bar-chart" style={{height:100}}>
                {[{d:"Feb",v:45},{d:"Mar",v:62},{d:"Apr",v:58},{d:"May",v:89},{d:"Jun",v:103},{d:"Jul",v:76}].map(d=>(
                  <div key={d.d} className="bar-col"><div className="bar-val">{d.v}</div><div className="bar" style={{height:`${(d.v/103)*80}px`}}/><div className="bar-lbl">{d.d}</div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid-3">
            {[{val:"312",lbl:"Tasks MTD",delta:"↑18%",up:true},{val:"98.1%",lbl:"Helper Accept Rate",delta:"↑1.2%",up:true},{val:"$38.50",lbl:"Avg Task Value",delta:"↑$4.20",up:true}].map(s=>(
              <div className="stat-cell" key={s.lbl} style={{borderRadius:10,border:"1px solid var(--bd)"}}>
                <div className="stat-accent-bar" style={{background:"var(--ac)",borderRadius:"10px 10px 0 0"}}/>
                <div className="stat-val" style={{color:"var(--ac)"}}>{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
                <div className={`stat-delta ${s.up?"up":"dn"}`}>{s.delta}</div>
              </div>
            ))}
          </div>
        </>}

        {/* AUDIT LOG */}
        {tab==="logs"&&<>
          <div className="page-hd"><div><div className="page-title">Audit Log</div><div className="page-sub" style={{display:"flex",alignItems:"center",gap:6}}><span className="dot" style={{background:logRunning?"#00D97E":"var(--z500)"}}/>{logRunning?"Live stream":"Paused"}</div></div>
            <div className="page-actions">
              <button className="btn btn-g btn-sm" onClick={()=>setLogRunning(v=>!v)}>{logRunning?"Pause Stream":"Resume"}</button>
              <button className="btn btn-g btn-sm" onClick={()=>toast("Log file downloaded.","success")}><Ic n="copy" s={12}/>Export</button>
            </div>
          </div>
          <div className="card">
            <div className="log-stream" style={{height:360}}>
              {logs.map((l,i)=>(
                <div key={i} className="log-line">
                  <span className="log-ts mono">{l.ts}</span>
                  <span className={`mono ${l.lvl==="INFO"?"log-lvl-info":l.lvl==="WARN"?"log-lvl-warn":"log-lvl-err"}`}>{l.lvl}</span>
                  <span className="log-msg">{l.msg}</span>
                </div>
              ))}
              {logRunning&&<div className="log-line"><span className="log-ts mono">live</span><span className="log-lvl-info mono">INFO</span><span className="log-msg">Streaming<span className="log-cursor"/></span></div>}
            </div>
          </div>
        </>}

        {/* PERMISSIONS */}
        {tab==="permissions"&&<>
          <div className="page-hd"><div><div className="page-title">Permissions</div><div className="page-sub">Admin role capabilities</div></div></div>
          <div className="card mb-14">
            <div style={{fontSize:".65rem",fontWeight:700,color:"var(--z500)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Admin Capabilities</div>
            {[
              ["helpers_suspend","Suspend / Restore Helpers","Remove a helper from the platform temporarily"],
              ["helpers_verify","Verify Helper Documents","Approve or reject certification uploads"],
              ["clients_refund","Issue Client Refunds","Process partial or full refunds from disputes"],
              ["financials_view","View Financials","Access full revenue and payout data"],
              ["logs_view","View Audit Logs","Read system event and access logs"],
              ["settings_edit","Edit Platform Settings","Change global platform configuration"],
            ].map(([k,title,desc])=>(
              <div className="perm-row" key={k}>
                <div className="perm-l"><div className="perm-title">{title}</div><div className="perm-sub">{desc}</div></div>
                <Toggle on={perms[k]} onChange={v=>{setPerms(p=>({...p,[k]:v}));toast(v?`${title} granted.`:`${title} revoked.`,"info");}}/>
              </div>
            ))}
          </div>
        </>}

        {/* PROFILE */}
        {tab==="profile"&&<>
          <div className="page-hd"><div><div className="page-title">Admin Account</div></div></div>
          <div className="card">
            <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:22,paddingBottom:20,borderBottom:"1px solid var(--bd)"}}>
              <div className="top-av" style={{width:56,height:56,fontSize:"1.1rem",cursor:"default",borderRadius:12,background:"var(--admin-ac)",color:"var(--z950)"}}>{user.av}</div>
              <div>
                <div style={{fontWeight:800,fontSize:"1.1rem"}}>{user.name}</div>
                <div style={{fontSize:".82rem",color:"var(--z400)",marginTop:2}}>{user.email}</div>
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  <span className="chip chip-blue"><Ic n="shield" s={9}/>Admin</span>
                  <span className="chip chip-green"><Ic n="check" s={9}/>2FA Active</span>
                  <span className="chip chip-zinc">Level {user.clearance} Clearance</span>
                </div>
              </div>
            </div>
            {[{l:"Name",v:user.name},{l:"Email",v:user.email},{l:"Department",v:user.dept},{l:"Clearance Level",v:`Level ${user.clearance}`},{l:"Member Since",v:user.joined},{l:"2FA",v:"Enabled (TOTP)"}].map(f=>(
              <div key={f.l} className="perm-row">
                <div className="perm-l"><div className="perm-title">{f.l}</div><div className="perm-sub" style={{marginTop:2}}>{f.v}</div></div>
                <button className="btn btn-g btn-xs" onClick={()=>toast("Admin profile locked. Contact superadmin.","warn")}>Edit</button>
              </div>
            ))}
          </div>
        </>}

        {/* PLATFORM SETTINGS */}
        {tab==="settings"&&<>
          <div className="page-hd"><div><div className="page-title">Platform Settings</div><div className="page-sub">Global configuration</div></div></div>
          {[
            {title:"Platform Controls",rows:[["maintenance","Maintenance Mode","Disable platform for all users during updates"],["signups","New Signups","Allow new user registrations"],["helperApps","Helper Applications","Accept new helper onboarding applications"]]},
            {title:"Operations",rows:[["disputeAlerts","Dispute Alerts","Email admin team when new disputes are filed"],["dailySummary","Daily Summary","Send platform digest each morning at 7am"],["anomalyDetect","Anomaly Detection","Auto-flag suspicious activity patterns"]]},
          ].map(sec=>(
            <div className="card mb-14" key={sec.title}>
              <div style={{fontSize:".65rem",fontWeight:700,color:"var(--z500)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>{sec.title}</div>
              {sec.rows.map(([k,title,desc])=>(
                <div className="perm-row" key={k}>
                  <div className="perm-l"><div className="perm-title">{title}</div><div className="perm-sub">{desc}</div></div>
                  <Toggle on={sysSettings[k]} onChange={v=>{setSysSett(s=>({...s,[k]:v}));toast(v?`${title} enabled.`:`${title} disabled.`,"info");}}/>
                </div>
              ))}
            </div>
          ))}
        </>}
      </div>

      {/* USER DETAIL MODAL */}
      <Modal open={!!selUser} onClose={()=>setSelUser(null)} title="User Details" center>
        {selUser&&<>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
            <div className="top-av" style={{width:44,height:44,fontSize:".9rem",cursor:"default",background:selUser.role==="client"?"rgba(255,68,68,.3)":"var(--z700)",color:selUser.role==="client"?"var(--client-ac)":"var(--helper-ac)"}}>{selUser.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
            <div style={{flex:1}}><div style={{fontWeight:700}}>{selUser.name}</div><div style={{fontSize:".74rem",color:"var(--z400)",marginTop:1}}>{selUser.email}</div></div>
            {STATUS_CHIP[selUser.status]}
          </div>
          {[{l:"Role",v:selUser.role},{l:"Joined",v:selUser.joined},{l:"Activity",v:selUser.activity},{l:"Verified",v:selUser.verified?"Yes":"No"},{l:"Flagged",v:selUser.flag?"Yes ⚠":"No"}].map(r=>(
            <div key={r.l} className="lrow" style={{padding:"8px 0"}}><span style={{fontSize:".79rem",color:"var(--z400)"}}>{r.l}</span><span style={{fontWeight:600,marginLeft:"auto"}}>{r.v}</span></div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:18}}>
            <button className={`btn btn-sm ${selUser.status==="suspended"?"btn-p":"btn-d"}`} onClick={()=>toggleSuspend(selUser.email)}>
              {selUser.status==="suspended"?"Restore Account":"Suspend Account"}
            </button>
            <button className="btn btn-g btn-sm" onClick={()=>toast("Message sent.","success")}>Message</button>
            <button className="btn btn-g btn-sm" onClick={()=>setSelUser(null)}>Close</button>
          </div>
        </>}
      </Modal>

      {/* DISPUTE MODAL */}
      <Modal open={!!selDisp} onClose={()=>setSelDisp(null)} title="Dispute Details" center>
        {selDisp&&<>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
            <span className="mono" style={{fontWeight:800,fontSize:"1rem"}}>{selDisp.id}</span>
            {DISP_CHIP[selDisp.status]}
            <span style={{marginLeft:"auto",fontWeight:800,fontSize:"1.1rem",color:"#FF6B6B"}}>{selDisp.amount}</span>
          </div>
          {[{l:"Task",v:selDisp.task},{l:"Client",v:selDisp.client},{l:"Helper",v:selDisp.helper},{l:"Filed",v:selDisp.opened}].map(r=>(
            <div key={r.l} className="lrow" style={{padding:"8px 0"}}><span style={{fontSize:".79rem",color:"var(--z400)"}}>{r.l}</span><span style={{fontWeight:600,marginLeft:"auto"}}>{r.v}</span></div>
          ))}
          <div style={{background:"var(--z800)",borderRadius:8,padding:"10px 12px",margin:"12px 0",fontSize:".81rem",color:"var(--z300)",lineHeight:1.65}}>{selDisp.desc}</div>
          {selDisp.status==="open"&&(
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button className="btn btn-p btn-sm" onClick={()=>resolveDispute(selDisp.id,"Refund issued")}>Refund Client</button>
              <button className="btn btn-g btn-sm" onClick={()=>resolveDispute(selDisp.id,"Dismissed")}>Dismiss</button>
              <button className="btn btn-g btn-sm" onClick={()=>{setDisputes(ds=>ds.map(d=>d.id===selDisp.id?{...d,status:"reviewing"}:d));setSelDisp(null);toast("Marked as reviewing.","info");}}>Review</button>
            </div>
          )}
        </>}
      </Modal>

      <Toasts items={items} kill={kill}/>
    </Shell>
  );
}

/* ════════════════════════ ROUTER ══════════════════════════════════════════ */
function AuthGate() {
  const { user, logout } = useAuth();
  if (!user) return <AuthScreen/>;
  if (user.role === "client") return <ClientPortal user={user} logout={logout}/>;
  if (user.role === "helper") return <HelperPortal user={user} logout={logout}/>;
  if (user.role === "admin")  return <AdminPortal  user={user} logout={logout}/>;
  return <AuthScreen/>;
}

export default function Root() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap";
    document.head.appendChild(link);
  }, []);
  return (
    <AuthProvider>
      <style>{CSS}</style>
      <AuthGate/>
    </AuthProvider>
  );
}
