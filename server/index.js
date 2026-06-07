const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { db, initDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "portalapp-jwt-secret-key-2026-noir";

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Helper to log audit events into db.logs
async function addAuditLog(lvl, msg) {
  const now = new Date();
  const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  await db.logs.insert({ ts, lvl, msg });
}

// Authentication Middleware
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    const user = await db.users.findOne((u) => u.email === verified.email);
    if (!user) {
      return res.status(404).json({ error: "User session not found." });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ error: "Account has been suspended." });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

// --- SYSTEM CMS PANEL & DEVELOPER CONSOLE ---

const cmsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PortalApp // Core System Console</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&family=Geist:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #060913;
      color: #94A3B8;
      font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
      padding: 32px 24px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 1280px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; flex: 1; }
    
    /* Header Console */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .logo-area { display: flex; align-items: center; gap: 12px; }
    .logo-box {
      width: 34px;
      height: 34px;
      background: #0284C7;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(2, 132, 199, 0.3);
    }
    .logo-box svg { width: 18px; height: 18px; color: #ffffff; }
    .title-area h1 { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: #F8FAFC; }
    .title-area p { font-size: 0.69rem; color: #475569; font-family: 'Geist Mono', monospace; text-transform: uppercase; margin-top: 2px; }
    .status-area { display: flex; align-items: center; gap: 12px; }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(16, 185, 129, 0.06);
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 99px;
      font-size: 0.68rem;
      font-weight: 700;
      color: #10B981;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .status-dot { width: 6px; height: 6px; background: #10B981; border-radius: 50%; animation: pulse 1.8s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.15); box-shadow: 0 0 8px #10B981; } }
    
    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .stat-card {
      background: rgba(10, 15, 30, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: all 0.22s;
    }
    .stat-card:hover { border-color: rgba(255,255,255,0.08); transform: translateY(-2px); background: rgba(10, 15, 30, 0.7); }
    .stat-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
    .stat-card.clients::before { background: #6366F1; }
    .stat-card.helpers::before { background: #059669; }
    .stat-card.tasks::before { background: #F59E0B; }
    .stat-card.sla::before { background: #0284C7; }
    .stat-label { font-size: 0.68rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; }
    .stat-val { font-size: 1.85rem; font-weight: 800; color: #F8FAFC; margin-top: 8px; font-variant-numeric: tabular-nums; }
    
    /* Panel Grid */
    .panel-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 20px; }
    .panel {
      background: rgba(10, 15, 30, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      height: 480px;
    }
    .panel-hd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      flex-shrink: 0;
    }
    .panel-title { font-size: 0.88rem; font-weight: 800; color: #F8FAFC; display: flex; align-items: center; gap: 8px; }
    .panel-subtitle { font-size: 0.72rem; color: #475569; }
    .refresh-btn {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      color: #94A3B8;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.68rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s;
    }
    .refresh-btn:hover { background: rgba(255,255,255,0.07); color: #fff; border-color: rgba(255,255,255,0.12); }
    
    /* Tables & directory */
    .tbl-wrap { overflow-y: auto; flex: 1; margin-right: -10px; padding-right: 10px; }
    .tbl { width: 100%; border-collapse: collapse; text-align: left; }
    .tbl th { font-size: 0.62rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; padding: 10px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
    .tbl td { font-size: 0.8rem; padding: 10px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.02); color: #94A3B8; vertical-align: middle; }
    .tbl tr:last-child td { border-bottom: none; }
    .tbl tbody tr:hover td { color: #F8FAFC; background: rgba(255, 255, 255, 0.01); }
    
    /* Badges */
    .badge { display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 4px; font-size: 0.58rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; }
    .badge-admin { color: #38BDF8; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.15); }
    .badge-client { color: #6366F1; background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.15); }
    .badge-helper { color: #059669; background: rgba(5, 150, 105, 0.08); border: 1px solid rgba(5, 150, 105, 0.15); }
    .badge-active { color: #10B981; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.15); }
    .badge-suspended { color: #EF4444; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.15); }
    
    /* Action Buttons */
    .act-btn {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94A3B8;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.66rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
    }
    .act-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
    .act-btn.suspend:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #EF4444; }
    .act-btn.restore:hover { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #10B981; }
    
    /* Log stream styling */
    .log-stream {
      background: #04060B;
      border: 1px solid rgba(255,255,255,0.02);
      border-radius: 8px;
      font-family: 'Geist Mono', monospace;
      font-size: 0.7rem;
      padding: 12px;
      overflow-y: auto;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.8);
      flex: 1;
      margin-right: -10px;
    }
    .log-line { display: flex; gap: 8px; line-height: 1.5; margin-bottom: 3px; border-bottom: 1px solid rgba(255,255,255,0.01); padding-bottom: 1px; }
    .log-ts { color: #475569; flex-shrink: 0; }
    .log-lvl { font-weight: 700; width: 45px; flex-shrink: 0; }
    .log-lvl.info { color: #38BDF8; }
    .log-lvl.warn { color: #F59E0B; }
    .log-lvl.err { color: #EF4444; }
    .log-msg { color: #8892B0; word-break: break-all; }
    .log-cursor { display: inline-block; width: 5px; height: 10px; background: #38BDF8; margin-left: 2px; animation: blink 1s step-end infinite; }
    @keyframes blink { 0%, 49% { opacity: 1; } 50%, 99% { opacity: 0; } }
    
    /* Register Panel (Bottom) */
    .register-panel {
      background: rgba(10, 15, 30, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 14px;
      padding: 20px;
      min-height: 250px;
    }
    
    footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.04);
      font-size: 0.69rem;
      color: #475569;
      font-family: 'Geist Mono', monospace;
    }
  </style>
</head>
<body>
  <!-- System Authorization Gateway Overlay -->
  <div id="login-overlay" style="position: fixed; inset: 0; background: radial-gradient(circle at center, #0e172a 0%, #030712 100%); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(12px);">
    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); padding: 40px; border-radius: 16px; width: 100%; max-width: 420px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; backdrop-filter: blur(20px);">
      <div class="logo-box" style="margin: 0 auto 24px auto;">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible; width:18px; height:18px;">
          <defs>
            <linearGradient id="logoC_o" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818CF8"/><stop offset="100%" stop-color="#4F46E5"/></linearGradient>
            <linearGradient id="logoH_o" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#059669"/></linearGradient>
            <linearGradient id="logoA_o" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#0284C7"/></linearGradient>
            <filter id="logoGlow_o" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
          </defs>
          <g filter="url(#logoGlow_o)">
            <path d="M12 13 L21 17.5 L12 22 L3 17.5 Z" fill="url(#logoA_o)" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/>
            <path d="M12 8 L21 12.5 L12 17 L3 12.5 Z" fill="url(#logoH_o)" stroke="rgba(255,255,255,0.45)" stroke-width="0.5"/>
            <path d="M12 3 L21 7.5 L12 12 L3 7.5 Z" fill="url(#logoC_o)" stroke="rgba(255,255,255,0.5)" stroke-width="0.5"/>
          </g>
        </svg>
      </div>
      <h2 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em;">System Authorization</h2>
      <p style="color: #64748B; font-size: 0.8rem; font-family: 'Geist Mono', monospace; text-transform: uppercase; margin-bottom: 32px;">PortalApp Secure Admin Console</p>
      
      <div style="display: flex; flex-direction: column; gap: 16px; text-align: left; margin-bottom: 24px;">
        <div>
          <label style="display: block; font-size: 0.68rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">Admin Email</label>
          <input id="login-email" type="email" placeholder="admin@portalapp.com" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; border-radius: 8px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='rgba(56, 189, 248, 0.4)'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'" />
        </div>
        <div>
          <label style="display: block; font-size: 0.68rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">Authorization Key</label>
          <input id="login-password" type="password" placeholder="••••••••••••" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; border-radius: 8px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='rgba(56, 189, 248, 0.4)'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'" onkeydown="if(event.key === 'Enter') loginAdmin()" />
        </div>
      </div>
      
      <div id="login-error" style="color: #EF4444; font-size: 0.78rem; font-weight: 600; margin-bottom: 16px; display: none;"></div>
      
      <button onclick="loginAdmin()" style="width: 100%; background: #0284C7; border: none; color: #fff; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3);" onmouseover="this.style.background='#0369a1'" onmouseout="this.style.background='#0284C7'">
        Establish Connection
      </button>
    </div>
  </div>

  <div class="container" style="display: none;">
    <!-- Header Console -->
    <header>
      <div class="logo-area">
        <div class="logo-box">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible; width:18px; height:18px;">
            <defs>
              <linearGradient id="logoC_h" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818CF8"/><stop offset="100%" stop-color="#4F46E5"/></linearGradient>
              <linearGradient id="logoH_h" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#059669"/></linearGradient>
              <linearGradient id="logoA_h" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#0284C7"/></linearGradient>
              <filter id="logoGlow_h" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
            </defs>
            <g filter="url(#logoGlow_h)">
              <path d="M12 13 L21 17.5 L12 22 L3 17.5 Z" fill="url(#logoA_h)" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/>
              <path d="M12 8 L21 12.5 L12 17 L3 12.5 Z" fill="url(#logoH_h)" stroke="rgba(255,255,255,0.45)" stroke-width="0.5"/>
              <path d="M12 3 L21 7.5 L12 12 L3 7.5 Z" fill="url(#logoC_h)" stroke="rgba(255,255,255,0.5)" stroke-width="0.5"/>
            </g>
          </svg>
        </div>
        <div class="title-area">
          <h1>PortalApp // Core System Console</h1>
          <p>Local Administration Engine & Ledger CMS</p>
        </div>
      </div>
      <div class="status-area">
        <div class="status-badge" style="cursor: pointer; background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.15); color: #EF4444;" onclick="logoutAdmin()">
          <div class="status-dot" style="background:#EF4444; animation: none;"></div>
          Logout Session
        </div>
        <div class="status-badge">
          <div class="status-dot"></div>
          Database Status: Online
        </div>
      </div>
    </header>
    
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card clients">
        <div class="stat-label">Clients Registered</div>
        <div class="stat-val" id="stat-clients">-</div>
      </div>
      <div class="stat-card helpers">
        <div class="stat-label">Helpers Onboarded</div>
        <div class="stat-val" id="stat-helpers">-</div>
      </div>
      <div class="stat-card tasks">
        <div class="stat-label">Errands Placed</div>
        <div class="stat-val" id="stat-tasks">-</div>
      </div>
      <div class="stat-card sla">
        <div class="stat-label">System Health SLA</div>
        <div class="stat-val" id="stat-sla">-</div>
      </div>
    </div>
    
    <!-- Panel Grid -->
    <div class="panel-grid">
      <!-- User Directory -->
      <div class="panel">
        <div class="panel-hd">
          <div>
            <div class="panel-title">User Account Directory</div>
            <div class="panel-subtitle">Manage login, status, and role access controls</div>
          </div>
          <button class="refresh-btn" onclick="fetchData()">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1.5 8a6.5 6.5 0 0110.5-5L15 6M14.5 8a6.5 6.5 0 01-10.5 5L1 10"/></svg>
            Sync
          </button>
        </div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Star</th>
                <th>Balance</th>
                <th>Status</th>
                <th style="text-align:right">Action Control</th>
              </tr>
            </thead>
            <tbody id="user-rows">
              <tr>
                <td colspan="6" style="text-align:center;padding:40px;color:#475569">Loading user directory...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Live Audit Stream -->
      <div class="panel">
        <div class="panel-hd">
          <div>
            <div class="panel-title">Security & Audit Stream</div>
            <div class="panel-subtitle">Live system telemetry & logs</div>
          </div>
        </div>
        <div class="log-stream" id="log-lines">
          <div class="log-line">
            <span class="log-ts">--:--:--</span>
            <span class="log-lvl info">[INFO]</span>
            <span class="log-msg">Subscribing to platform log events...<span class="log-cursor"></span></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- System Errand Register -->
    <div class="register-panel panel">
      <div class="panel-hd">
        <div>
          <div class="panel-title">System Errand Registry</div>
          <div class="panel-subtitle">Complete ledger of tasks, budgets, and assignment states</div>
        </div>
      </div>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Task Title</th>
              <th>Client</th>
              <th>Assigned Helper</th>
              <th>Budget</th>
              <th>State</th>
              <th style="text-align:right">Control</th>
            </tr>
          </thead>
          <tbody id="task-rows">
            <tr>
              <td colspan="7" style="text-align:center;padding:40px;color:#475569">Loading task registry...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Conflicts & Disputes Arbitration Registry -->
    <div class="register-panel panel" style="margin-top: 20px;">
      <div class="panel-hd">
        <div>
          <div class="panel-title">Conflicts & Disputes Arbitration Registry</div>
          <div class="panel-subtitle">Arbitrate open platform disputes, issue client refunds, or dismiss helper claims</div>
        </div>
      </div>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Task / Incident</th>
              <th>Client</th>
              <th>Helper</th>
              <th>Contested Amt</th>
              <th>State</th>
              <th style="text-align:right">Action Control</th>
            </tr>
          </thead>
          <tbody id="dispute-rows">
            <tr>
              <td colspan="7" style="text-align:center;padding:40px;color:#475569">Loading active disputes...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Footer -->
    <footer>
      PORTALAPP DECODE CONSOLE v8.2 · JSON-ORM LIGHTWEIGHT BACKEND · 2026
    </footer>
  </div>
  
  <script>
    let fetchIntervalId = null;

    function checkAuth() {
      const token = sessionStorage.getItem('admin_token');
      if (!token) {
        document.getElementById('login-overlay').style.display = 'flex';
        document.querySelector('.container').style.display = 'none';
        if (fetchIntervalId) {
          clearInterval(fetchIntervalId);
          fetchIntervalId = null;
        }
        return false;
      }
      document.getElementById('login-overlay').style.display = 'none';
      document.querySelector('.container').style.display = 'flex';
      return true;
    }

    async function loginAdmin() {
      const email = document.getElementById('login-email').value;
      const pw = document.getElementById('login-password').value;
      const errDiv = document.getElementById('login-error');
      
      errDiv.style.display = 'none';
      
      if (!email || !pw) {
        errDiv.innerText = 'Please provide both email and passcode.';
        errDiv.style.display = 'block';
        return;
      }
      
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, pw })
        });
        
        const data = await res.json();
        if (!res.ok) {
          errDiv.innerText = data.error || 'Authentication failed.';
          errDiv.style.display = 'block';
          return;
        }
        
        if (data.user.role !== 'admin') {
          errDiv.innerText = 'Access Denied: Administrative privileges required.';
          errDiv.style.display = 'block';
          return;
        }
        
        sessionStorage.setItem('admin_token', data.token);
        if (checkAuth()) {
          fetchData();
          startSyncInterval();
        }
      } catch (err) {
        errDiv.innerText = 'Network or system connection error.';
        errDiv.style.display = 'block';
      }
    }

    function logoutAdmin() {
      sessionStorage.removeItem('admin_token');
      checkAuth();
    }

    async function fetchData() {
      if (!sessionStorage.getItem('admin_token')) {
        checkAuth();
        return;
      }
      
      try {
        const res = await fetch('/api/cms/overview', {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('admin_token')
          }
        });
        
        if (res.status === 401 || res.status === 403) {
          logoutAdmin();
          return;
        }
        
        const data = await res.json();
        
        // 1. Update stats
        const clientsCount = data.users.filter(u => u.role === 'client').length;
        const helpersCount = data.users.filter(u => u.role === 'helper').length;
        document.getElementById('stat-clients').innerText = clientsCount;
        document.getElementById('stat-helpers').innerText = helpersCount;
        document.getElementById('stat-tasks').innerText = data.stats.totalTasks;
        document.getElementById('stat-sla').innerText = data.stats.uptimeSLA;
        
         const userRows = data.users.map(u => {
          const roleClass = u.role === 'admin' ? 'badge-admin' : (u.role === 'client' ? 'badge-client' : 'badge-helper');
          const isInactive = u.status === 'suspended' || u.status === 'inactive';
          const statusClass = isInactive ? 'badge-suspended' : 'badge-active';
          
          let btnText = isInactive ? 'Restore' : 'Suspend';
          let btnClass = isInactive ? 'restore' : 'suspend';
          let btnAction = u.role === 'admin' ? 'disabled' : '';
          
          let balanceDisplay = 'N/A';
          if (u.role !== 'admin') {
            const bal = Number(u.balance || 0);
            balanceDisplay = bal < 0 ? '-' + '$' + Math.abs(bal).toFixed(2) : '$' + bal.toFixed(2);
          }
          
          return \`
            <tr>
              <td>
                <div style="font-weight:700;color:#F8FAFC">\${u.name}</div>
                <div style="font-size:0.68rem;color:#475569;font-family:'Geist Mono',monospace;margin-top:2px">\${u.email}</div>
              </td>
              <td><span class="badge \${roleClass}">\${u.role}</span></td>
              <td style="font-weight:700;color:#10B981">\${u.rating ? u.rating + ' / 5' : 'N/A'}</td>
              <td style="font-family:'Geist Mono',monospace;font-weight:600;color:#F8FAFC">\${balanceDisplay}</td>
              <td><span class="badge \${statusClass}">\${u.status || 'active'}</span></td>
              <td style="text-align:right">
                <button class="act-btn \${btnClass}" onclick="toggleUser('\${u.email}')" \${btnAction}>\${btnText}</button>
              </td>
            </tr>
          \`;
        }).join('');
        document.getElementById('user-rows').innerHTML = userRows || '<tr><td colspan="6" style="text-align:center;padding:20px;">No registered accounts</td></tr>';
        
        // 3. Render Logs
        const logLines = data.logs.map((l, index) => {
          const lvlClass = l.lvl.toLowerCase() === 'info' ? 'info' : (l.lvl.toLowerCase() === 'warn' ? 'warn' : 'err');
          const cursor = index === data.logs.length - 1 ? '<span class="log-cursor"></span>' : '';
          return \`
            <div class="log-line">
              <span class="log-ts">\${l.ts}</span>
              <span class="log-lvl \${lvlClass}">[\${l.lvl}]</span>
              <span class="log-msg">\${l.msg}\${cursor}</span>
            </div>
          \`;
        }).join('');
        const logContainer = document.getElementById('log-lines');
        logContainer.innerHTML = logLines || '<div style="color:#475569;padding:12px">No audit log records</div>';
        // Auto scroll to bottom
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // 4. Render Tasks
        const taskRows = data.tasks.map(t => {
          let stateClass = '';
          if (t.status === 'pending') stateClass = 'color:#F59E0B';
          else if (t.status === 'active') stateClass = 'color:#0284C7';
          else if (t.status === 'completed') stateClass = 'color:#10B981';
          
          return \`
            <tr>
              <td style="font-family:'Geist Mono',monospace;font-weight:700">#EM-\${1000 + t.id}</td>
              <td>
                <div style="font-weight:700;color:#F8FAFC">\${t.title}</div>
                <div style="font-size:0.68rem;color:#475569;margin-top:2px">\${t.desc || 'No additional details.'}</div>
              </td>
              <td>\${t.client}</td>
              <td style="color:\${t.helper ? '#F8FAFC' : '#475569'}">\${t.helper || 'Unassigned'}</td>
              <td style="font-family:'Geist Mono',monospace;font-weight:600;color:#10B981">\${'$' + Number(t.pay).toFixed(2)}</td>
              <td style="font-weight:800;text-transform:uppercase;font-size:0.75rem;\${stateClass}">\${t.status}</td>
              <td style="text-align:right">
                <button class="act-btn suspend" onclick="deleteTask(\${t.id})">Delete</button>
              </td>
            </tr>
          \`;
        }).join('');
        document.getElementById('task-rows').innerHTML = taskRows || '<tr><td colspan="7" style="text-align:center;padding:20px;">No errands placed on ledger</td></tr>';
        
        // 5. Render Disputes
        const disputeRows = (data.disputes || []).map(d => {
          let statusClass = '';
          if (d.status === 'open') statusClass = 'badge-suspended';
          else if (d.status === 'resolved') statusClass = 'badge-active';
          else if (d.status === 'reviewing') statusClass = 'badge-admin';

          let buttons = '';
          if (d.status !== 'resolved') {
            buttons = \`
              <button class="act-btn restore" style="margin-right: 5px;" onclick="resolveDispute('\${d.id}', 'Refund issued')">Refund Client</button>
              <button class="act-btn suspend" onclick="resolveDispute('\${d.id}', 'Dismissed')">Dismiss</button>
            \`;
          } else {
            buttons = \`<span style="font-size:0.69rem;color:#475569;font-weight:700;">CLOSED</span>\`;
          }

          return \`
            <tr>
              <td style="font-family:'Geist Mono',monospace;font-weight:700;color:#EF4444">\${d.id}</td>
              <td>
                <div style="font-weight:700;color:#F8FAFC">\${d.task}</div>
                <div style="font-size:0.68rem;color:#475569;margin-top:2px">\${d.desc || 'No incident description.'}</div>
              </td>
              <td>\${d.client}</td>
              <td>\${d.helper || 'N/A'}</td>
              <td style="font-family:'Geist Mono',monospace;font-weight:600;color:#EF4444">\${d.amount}</td>
              <td><span class="badge \${statusClass}">\${d.status}</span></td>
              <td style="text-align:right">\${buttons}</td>
            </tr>
          \`;
        }).join('');
        document.getElementById('dispute-rows').innerHTML = disputeRows || '<tr><td colspan="7" style="text-align:center;padding:20px;">No active platform disputes</td></tr>';
        
      } catch (err) {
        console.error("Failed to load CMS data", err);
      }
    }
    
    async function toggleUser(email) {
      if (!sessionStorage.getItem('admin_token')) {
        checkAuth();
        return;
      }
      if (confirm(\`Toggle status for \${email}?\`)) {
        try {
          const res = await fetch(\`/api/cms/users/\${email}/toggle\`, { 
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('admin_token')
            }
          });
          if (res.status === 401 || res.status === 403) {
            logoutAdmin();
            return;
          }
          if (res.ok) fetchData();
        } catch(err) {
          alert('Failed to update user status.');
        }
      }
    }
    
    async function deleteTask(id) {
      if (!sessionStorage.getItem('admin_token')) {
        checkAuth();
        return;
      }
      if (confirm(\`Permanently delete errand #EM-\${1000 + id} from the ledger?\`)) {
        try {
          const res = await fetch(\`/api/cms/tasks/\${id}/delete\`, { 
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('admin_token')
            }
          });
          if (res.status === 401 || res.status === 403) {
            logoutAdmin();
            return;
          }
          if (res.ok) fetchData();
        } catch(err) {
          alert('Failed to delete task.');
        }
      }
    }
    
    async function resolveDispute(id, resolution) {
      if (!sessionStorage.getItem('admin_token')) {
        checkAuth();
        return;
      }
      if (confirm(\`Resolve dispute \${id} with action: "\${resolution}"?\`)) {
        try {
          const res = await fetch(\`/api/cms/disputes/\${id}/resolve\`, { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem('admin_token')
            },
            body: JSON.stringify({ resolution })
          });
          if (res.status === 401 || res.status === 403) {
            logoutAdmin();
            return;
          }
          if (res.ok) {
            fetchData();
          } else {
            const errData = await res.json();
            alert(errData.error || 'Failed to resolve dispute.');
          }
        } catch(err) {
          alert('Failed to resolve dispute.');
        }
      }
    }

    function startSyncInterval() {
      if (fetchIntervalId) clearInterval(fetchIntervalId);
      fetchIntervalId = setInterval(fetchData, 3000);
    }
    
    // Capture cross-origin sign-in tokens (?token=TOKEN)
    const urlParams = new URLSearchParams(window.location.search);
    const queryToken = urlParams.get('token');
    if (queryToken) {
      sessionStorage.setItem('admin_token', queryToken);
      window.history.replaceState({}, document.title, "/");
    }

    // Initial load sequence
    if (checkAuth()) {
      fetchData();
      startSyncInterval();
    }
  </script>
</body>
</html>`;

// --- SYSTEM CMS ROUTING ---
app.get("/", (req, res) => {
  res.send(cmsHtml);
});

app.get("/api/cms/overview", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Administrative privileges required." });
  }

  try {
    const users = await db.users.find();
    const tasks = await db.tasks.find();
    const logs = await db.logs.find();
    const disputes = await db.disputes.find();

    const errCount = logs.filter(l => l.lvl === "ERR").length;
    const uptimeSLA = (99.9 - (errCount * 0.05)).toFixed(2) + "%";

    res.json({
      users: users.map(({ pw, ...safe }) => safe),
      tasks,
      logs: logs.slice(-40),
      disputes,
      stats: {
        totalTasks: tasks.length,
        uptimeSLA
      }
    });
  } catch (err) {
    console.error("Failed to load CMS overview", err);
    res.status(500).json({ error: "Failed to load CMS overview" });
  }
});

app.post("/api/cms/users/:email/toggle", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Administrative privileges required." });
  }

  try {
    const targetEmail = req.params.email;
    const user = await db.users.findOne((u) => u.email === targetEmail);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role === "admin") {
      return res.status(400).json({ error: "Administrators cannot be suspended." });
    }

    const newStatus = (user.status === "suspended" || user.status === "inactive") ? "active" : "suspended";
    await db.users.update((u) => u.email === targetEmail, { status: newStatus });

    await addAuditLog("WARN", `CMS toggled status for ${targetEmail}: ${newStatus.toUpperCase()}`);

    res.json({ success: true, newStatus });
  } catch (err) {
    console.error("Failed to toggle user status via CMS", err);
    res.status(500).json({ error: "Failed to toggle user status" });
  }
});

app.post("/api/cms/tasks/:id/delete", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Administrative privileges required." });
  }

  try {
    const taskId = parseInt(req.params.id);
    const task = await db.tasks.findOne((t) => t.id === taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    await db.tasks.remove((t) => t.id === taskId);
    await addAuditLog("INFO", `Task #EM-${1000 + taskId} permanently deleted via CMS ledger`);

    res.json({ success: true, message: "Task deleted successfully." });
  } catch (err) {
    console.error("Failed to delete task via CMS", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.post("/api/cms/disputes/:id/resolve", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Administrative privileges required." });
  }

  try {
    const disputeId = req.params.id;
    const { resolution } = req.body; // "Refund issued" or "Dismissed"

    const dispute = await db.disputes.findOne((d) => d.id === disputeId);
    if (!dispute) {
      return res.status(404).json({ error: "Dispute not found." });
    }

    if (dispute.status === "resolved") {
      return res.status(400).json({ error: "This dispute has already been resolved." });
    }

    if (resolution === "Refund issued") {
      const refundAmt = parseFloat(dispute.amount.replace("$", "")) || 0;
      const client = await db.users.findOne((u) => u.name === dispute.client);

      if (client) {
        const updatedBalance = parseFloat((client.balance + refundAmt).toFixed(2));
        await db.users.update((u) => u.email === client.email, { balance: updatedBalance });
        await addAuditLog("INFO", `Dispute ${disputeId} resolved via CMS: Refunded $${refundAmt} to client ${client.email}`);
      }
    } else {
      await addAuditLog("INFO", `Dispute ${disputeId} dismissed via CMS: No refund processed`);
    }

    await db.disputes.update((d) => d.id === disputeId, { status: "resolved" });
    await addAuditLog("WARN", `CMS resolved dispute ${disputeId}: ${resolution.toUpperCase()}`);

    res.json({ success: true, status: "resolved" });
  } catch (err) {
    console.error("Failed to resolve dispute via CMS", err);
    res.status(500).json({ error: "Failed to resolve dispute" });
  }
});

// --- API ROUTES ---

// Public Stats & Live Errands Feed
app.get("/api/public/stats", async (req, res) => {
  try {
    const users = await db.users.find();
    const tasks = await db.tasks.find();
    const logs = await db.logs.find();

    // 1. Calculate active users based on database size
    const activeUsers = 80000 + users.length * 150 + tasks.length * 45;

    // 2. Calculate actual average rating of all registered helper profiles
    const helpers = users.filter(u => u.role === "helper" && u.rating);
    const avgRating = helpers.length
      ? parseFloat((helpers.reduce((sum, h) => sum + h.rating, 0) / helpers.length).toFixed(2))
      : 4.9;

    // 3. Determine dynamic uptime SLA based on log health (error tracking)
    const errCount = logs.filter(l => l.lvl === "ERR").length;
    const uptimeSLA = (99.9 - (errCount * 0.05)).toFixed(2) + "%";

    // 4. Slice top 3 pending errands for the live public feed
    const pendingTasks = tasks.filter(t => t.status === "pending");
    const liveErrands = pendingTasks.map(t => ({
      id: t.id,
      title: t.title,
      desc: t.desc,
      category: t.category,
      priority: t.priority,
      due: t.due,
      loc: t.loc,
      pay: t.pay,
      dist: t.dist
    })).slice(0, 3);

    const statsData = {
      activeUsers,
      avgRating,
      uptimeSLA,
      liveErrands
    };

    // If accessed via a browser directly, render a premium visual API document and explorer
    const acceptHeader = req.headers.accept || "";
    const secFetchDest = req.headers["sec-fetch-dest"] || "";
    const isJsonRequested = req.query.format === "json" || req.query.json === "true" || acceptHeader === "application/json";
    
    const isBrowser = (acceptHeader.includes("text/html") || secFetchDest === "document" || (!req.headers["x-requested-with"] && req.headers["user-agent"] && req.headers["user-agent"].includes("Mozilla"))) && !isJsonRequested;

    if (isBrowser) {
      const liveErrandsHtml = liveErrands.map(t => `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 10px; margin-bottom: 12px; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: #F8FAFC; font-size: 0.95rem;">${t.title}</strong>
            <span style="color: #10B981; font-weight: 800;">$${t.pay}</span>
          </div>
          <p style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 8px; line-height: 1.5;">${t.desc || 'No additional details.'}</p>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #475569; font-weight: 600;">
            <span style="display: inline-flex; align-items: center; gap: 4px;"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:11px; height:11px; color:#6366F1;"><path d="M8 1a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5z"/><circle cx="8" cy="6" r="1.5"/></svg>${t.loc} (${t.dist})</span>
            <span style="display: inline-flex; align-items: center; gap: 4px;"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:11px; height:11px; color:#6366F1;"><circle cx="8" cy="8" r="7"/><polyline points="8,3.5 8,8 11.5,8"/></svg>Due ${t.due}</span>
          </div>
        </div>
      `).join('');

      const visualizerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PortalApp // Public API Visualizer</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&family=Geist:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #060913;
      color: #94A3B8;
      font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      overflow-x: hidden;
      position: relative;
    }
    .auth-orbs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
    .orb { position: absolute; border-radius: 50%; filter: blur(120px); }
    .orb1 { width: 500px; height: 500px; background: rgba(99, 102, 241, 0.12); top: -100px; left: -100px; }
    .orb2 { width: 400px; height: 400px; background: rgba(2, 132, 199, 0.08); bottom: -100px; right: -50px; }
    
    .container {
      width: 100%;
      max-width: 800px;
      background: rgba(10, 15, 30, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      position: relative;
      z-index: 5;
      text-align: center;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .logo-area { display: flex; align-items: center; gap: 12px; }
    .logo-box {
      width: 32px;
      height: 32px;
      background: #4F46E5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
    }
    .logo-box svg { width: 16px; height: 16px; color: #ffffff; }
    .title-area h1 { font-size: 1.1rem; font-weight: 800; color: #F8FAFC; text-align: left; }
    .title-area p { font-size: 0.66rem; color: #475569; font-family: 'Geist Mono', monospace; text-transform: uppercase; margin-top: 2px; text-align: left; }
    
    .back-btn {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      color: #F8FAFC;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .back-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); border-color: rgba(255,255,255,0.15); }
    
    .section-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #F8FAFC;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
      text-align: left;
    }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      padding: 18px;
      text-align: left;
    }
    .stat-lbl { font-size: 0.65rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; }
    .stat-val { font-size: 1.4rem; font-weight: 800; color: #F8FAFC; margin-top: 6px; }
    
    .grid-panels { display: grid; grid-template-columns: 1fr; gap: 20px; }
    .panel {
      background: rgba(255,255,255,0.01);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 12px;
      padding: 20px;
    }
    .json-block {
      background: #04060B;
      border: 1px solid rgba(255,255,255,0.03);
      padding: 16px;
      border-radius: 8px;
      font-family: 'Geist Mono', monospace;
      font-size: 0.72rem;
      color: #38BDF8;
      overflow-x: auto;
      line-height: 1.5;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="auth-orbs">
    <div class="orb orb1"></div>
    <div class="orb orb2"></div>
  </div>
  
  <div class="container">
    <header>
      <div class="logo-area">
        <div class="logo-box">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible; width:18px; height:18px;">
            <defs>
              <linearGradient id="logoC_p" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818CF8"/><stop offset="100%" stop-color="#4F46E5"/></linearGradient>
              <linearGradient id="logoH_p" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#059669"/></linearGradient>
              <linearGradient id="logoA_p" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#0284C7"/></linearGradient>
              <filter id="logoGlow_p" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
            </defs>
            <g filter="url(#logoGlow_p)">
              <path d="M12 13 L21 17.5 L12 22 L3 17.5 Z" fill="url(#logoA_p)" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/>
              <path d="M12 8 L21 12.5 L12 17 L3 12.5 Z" fill="url(#logoH_p)" stroke="rgba(255,255,255,0.45)" stroke-width="0.5"/>
              <path d="M12 3 L21 7.5 L12 12 L3 7.5 Z" fill="url(#logoC_p)" stroke="rgba(255,255,255,0.5)" stroke-width="0.5"/>
            </g>
          </svg>
        </div>
        <div class="title-area">
          <h1>PortalApp // Platform Telemetry API</h1>
          <p>Public Analytics Engine Explorer</p>
        </div>
      </div>
      <a href="http://localhost:5173/" class="back-btn">← Back to Portal</a>
    </header>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-lbl">Active Members</div>
        <div class="stat-val" style="color: #6366F1;">${activeUsers.toLocaleString()}+</div>
      </div>
      <div class="stat-card">
        <div class="stat-lbl">Community Rating</div>
        <div class="stat-val" style="color: #10B981;">${avgRating} / 5</div>
      </div>
      <div class="stat-card">
        <div class="stat-lbl">Database SLA</div>
        <div class="stat-val" style="color: #0284C7;">${uptimeSLA}</div>
      </div>
    </div>
    
    <div class="grid-panels">
      <div class="panel">
        <div class="section-title">Telemetry Ledger Feed</div>
        ${liveErrandsHtml || '<div style="color:#475569;font-style:italic;font-size:0.8rem">No errands currently active.</div>'}
      </div>
      
      <div class="panel">
        <div class="section-title">Raw REST Payload (JSON)</div>
        <pre class="json-block"><code>${JSON.stringify(statsData, null, 2)}</code></pre>
      </div>
    </div>
  </div>
</body>
</html>`;
      return res.send(visualizerHtml);
    }

    res.json(statsData);
  } catch (err) {
    console.error("Failed to compute public stats", err);
    res.status(500).json({ error: "Failed to load public analytics" });
  }
});

// 1. Authenticate and Login
app.post("/api/auth/login", async (req, res) => {
  const { email, pw } = req.body;
  if (!email || !pw) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const key = email.toLowerCase().trim();
  const user = await db.users.findOne((u) => u.email === key);

  if (!user) {
    return res.status(401).json({ error: "No account found with that email." });
  }

  if (user.pw !== pw) {
    return res.status(401).json({ error: "Incorrect credentials." });
  }

  if (user.status === "suspended") {
    return res.status(403).json({ error: "Your account has been suspended by an administrator." });
  }

  // Issue token
  const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });

  await addAuditLog("INFO", `User logged in: ${user.email} (${user.role})`);

  res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
      av: user.av,
      verified: user.verified,
      joined: user.joined,
      balance: user.balance,
      spent: user.spent,
      tasks: user.tasks,
      rating: user.rating,
      streak: user.streak,
      level: user.level,
      responseTime: user.responseTime,
      completionRate: user.completionRate,
      skills: user.skills,
      addresses: user.addresses || []
    }
  });
});

// 2. Resolve Active Session
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  res.json({
    user: {
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      av: req.user.av,
      verified: req.user.verified,
      joined: req.user.joined,
      balance: req.user.balance,
      spent: req.user.spent,
      tasks: req.user.tasks,
      rating: req.user.rating,
      streak: req.user.streak,
      level: req.user.level,
      responseTime: req.user.responseTime,
      completionRate: req.user.completionRate,
      skills: req.user.skills,
      addresses: req.user.addresses || []
    }
  });
});

// 3. Fetch Tasks
app.get("/api/tasks", authenticateToken, async (req, res) => {
  const { role, email } = req.user;

  if (role === "client") {
    // Clients see their own posted tasks
    const tasks = await db.tasks.find((t) => t.clientEmail === email);
    // Sort reverse chronological
    return res.json(tasks.reverse());
  } else if (role === "helper") {
    // Helpers see tasks they are assigned to (active/completed) AND pending tasks available to accept
    const jobs = await db.tasks.find((t) => t.helperEmail === email || t.status === "pending");
    return res.json(jobs);
  } else if (role === "admin") {
    // Admins see all tasks on the platform
    const allTasks = await db.tasks.find();
    return res.json(allTasks);
  }

  res.status(400).json({ error: "Invalid role access." });
});

// 4. Post a New Task (Client)
app.post("/api/tasks", authenticateToken, async (req, res) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ error: "Only clients can post tasks." });
  }

  const { title, desc, category, priority, due, loc, budget } = req.body;
  if (!title || !due || !budget) {
    return res.status(400).json({ error: "Title, due date, and budget are required fields." });
  }

  const parsedBudget = parseFloat(budget);
  if (isNaN(parsedBudget) || parsedBudget <= 0) {
    return res.status(400).json({ error: "Invalid budget amount." });
  }

  // Generate ID
  const allTasks = await db.tasks.find();
  const maxId = allTasks.reduce((max, t) => (t.id > max ? t.id : max), 0);
  const newId = maxId + 1;

  const newTask = {
    id: newId,
    title: title.trim(),
    desc: (desc || "").trim(),
    category: category || "grocery",
    priority: priority || "medium",
    due,
    loc: loc || "Home Address",
    client: req.user.name,
    clientEmail: req.user.email,
    clientAv: req.user.av,
    helper: null,
    helperEmail: null,
    helperAv: null,
    pay: parsedBudget,
    status: "pending",
    rating: null,
    reviewed: false,
    dist: `${(Math.random() * 2 + 0.1).toFixed(1)} mi` // Random simulated distance
  };

  await db.tasks.insert(newTask);
  await addAuditLog("INFO", `New task posted by ${req.user.email}: "${title}" (#EM-${1000 + newId})`);

  res.status(201).json(newTask);
});

// 5. Delete a Task (Client)
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = await db.tasks.findOne((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  if (task.clientEmail !== req.user.email && req.user.role !== "admin") {
    return res.status(403).json({ error: "Permission denied." });
  }

  if (task.status === "active") {
    return res.status(400).json({ error: "Cannot delete an active task in progress." });
  }

  await db.tasks.remove((t) => t.id === taskId);
  await addAuditLog("INFO", `Task #EM-${1000 + taskId} deleted by ${req.user.email}`);

  res.json({ success: true, message: "Task deleted successfully." });
});

// 6. Review a Task (Client)
app.post("/api/tasks/:id/review", authenticateToken, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid rating. Must be between 1 and 5." });
  }

  const task = await db.tasks.findOne((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  if (task.clientEmail !== req.user.email) {
    return res.status(403).json({ error: "Only the task creator can leave a review." });
  }

  if (task.status !== "completed") {
    return res.status(400).json({ error: "Cannot review incomplete tasks." });
  }

  // Update task review state
  await db.tasks.update((t) => t.id === taskId, { rating, reviewed: true });

  // Dynamically recalculate the helper's average rating in the database
  const helperEmail = task.helperEmail;
  if (helperEmail) {
    const helperTasks = await db.tasks.find((t) => t.helperEmail === helperEmail && t.rating !== null);
    const totalRating = helperTasks.reduce((sum, t) => sum + t.rating, 0);
    const newAverage = helperTasks.length ? parseFloat((totalRating / helperTasks.length).toFixed(2)) : 5.0;

    await db.users.update((u) => u.email === helperEmail, { rating: newAverage });
  }

  await addAuditLog("INFO", `Task #EM-${1000 + taskId} reviewed by client: ${rating}★`);

  res.json({ success: true, rating });
});

// 7. Accept a Job (Helper)
app.post("/api/jobs/:id/accept", authenticateToken, async (req, res) => {
  if (req.user.role !== "helper") {
    return res.status(403).json({ error: "Only registered helpers can accept jobs." });
  }

  const taskId = parseInt(req.params.id);
  const task = await db.tasks.findOne((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Job not found." });
  }

  if (task.status !== "pending") {
    return res.status(400).json({ error: "This job is no longer available." });
  }

  // Assign job to helper
  const updateData = {
    status: "active",
    helper: req.user.name,
    helperEmail: req.user.email,
    helperAv: req.user.av
  };

  await db.tasks.update((t) => t.id === taskId, updateData);
  await addAuditLog("INFO", `Job #EM-${1000 + taskId} accepted by helper ${req.user.email}`);

  res.json({ success: true, message: "Job accepted successfully." });
});

// 8. Complete a Job & Process Transaction (Helper)
app.post("/api/jobs/:id/complete", authenticateToken, async (req, res) => {
  if (req.user.role !== "helper") {
    return res.status(403).json({ error: "Only assigned helpers can mark jobs complete." });
  }

  const taskId = parseInt(req.params.id);
  const task = await db.tasks.findOne((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Job not found." });
  }

  if (task.helperEmail !== req.user.email) {
    return res.status(403).json({ error: "You are not assigned to this job." });
  }

  if (task.status !== "active") {
    return res.status(400).json({ error: "Only active jobs can be completed." });
  }

  // Execute Transactional Ledger Shifts on the Backend
  const clientEmail = task.clientEmail;
  const helperEmail = task.helperEmail;
  const jobPrice = task.pay;

  const client = await db.users.findOne((u) => u.email === clientEmail);
  const helper = await db.users.findOne((u) => u.email === helperEmail);

  if (!client || !helper) {
    return res.status(500).json({ error: "Failed to load transacting parties." });
  }

  // Deduct from Client (clients can go into negative or spend from balance)
  const newClientBalance = parseFloat((client.balance - jobPrice).toFixed(2));
  const newClientSpent = client.spent + jobPrice;
  const newClientTasks = client.tasks + 1;

  // Credit to Helper
  const newHelperBalance = parseFloat((helper.balance + jobPrice).toFixed(2));
  const newHelperEarned = helper.totalEarned + jobPrice;
  const newHelperJobs = helper.jobs + 1;
  const newStreak = helper.streak + 1; // Increment streak dynamically on task completion

  // Save Client updates
  await db.users.update((u) => u.email === clientEmail, {
    balance: newClientBalance,
    spent: newClientSpent,
    tasks: newClientTasks
  });

  // Save Helper updates
  await db.users.update((u) => u.email === helperEmail, {
    balance: newHelperBalance,
    totalEarned: newHelperEarned,
    jobs: newHelperJobs,
    streak: newStreak
  });

  // Mark task completed
  await db.tasks.update((t) => t.id === taskId, { status: "completed" });

  await addAuditLog("INFO", `Transaction processed: Client ${clientEmail} debited $${jobPrice}, Helper ${helperEmail} credited $${jobPrice}. Job #EM-${1000 + taskId} marked Completed.`);

  res.json({ success: true, message: "Transaction processed. Payout completed." });
});

// 9. Fetch Users (Admin)
app.get("/api/admin/users", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access." });
  }

  const users = await db.users.find();
  // Strip passwords for security
  const safeUsers = users.map((u) => {
    const { pw, ...safe } = u;
    return safe;
  });

  res.json(safeUsers);
});

// 10. Suspend / Restore User (Admin)
app.post("/api/admin/users/:email/suspend", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access." });
  }

  const targetEmail = req.params.email;
  const user = await db.users.findOne((u) => u.email === targetEmail);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  if (user.role === "admin") {
    return res.status(400).json({ error: "Administrators cannot be suspended." });
  }

  const newStatus = user.status === "suspended" ? "active" : "suspended";
  await db.users.update((u) => u.email === targetEmail, { status: newStatus });

  await addAuditLog("WARN", `Admin ${req.user.email} toggled status for ${targetEmail}: ${newStatus.toUpperCase()}`);

  res.json({ success: true, newStatus });
});

// 11. Fetch Disputes (Admin)
app.get("/api/admin/disputes", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access." });
  }

  const disputes = await db.disputes.find();
  res.json(disputes);
});

// 12. Resolve Disputes (Admin)
app.post("/api/admin/disputes/:id/resolve", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access." });
  }

  const disputeId = req.params.id;
  const { resolution } = req.body; // "Refund issued" or "Dismissed"

  const dispute = await db.disputes.findOne((d) => d.id === disputeId);
  if (!dispute) {
    return res.status(404).json({ error: "Dispute file not found." });
  }

  if (dispute.status === "resolved") {
    return res.status(400).json({ error: "This dispute has already been resolved." });
  }

  if (resolution === "Refund issued") {
    // Admin issues full refund to client from platform fees or helper balance
    // In our simplified logic, we credit the client's balance in the users database
    const refundAmt = parseFloat(dispute.amount.replace("$", "")) || 0;
    const client = await db.users.findOne((u) => u.name === dispute.client);

    if (client) {
      const updatedBalance = parseFloat((client.balance + refundAmt).toFixed(2));
      await db.users.update((u) => u.email === client.email, { balance: updatedBalance });
      await addAuditLog("INFO", `Admin refunded $${refundAmt} to client ${client.email} from Dispute ${disputeId}`);
    }
  }

  await db.disputes.update((d) => d.id === disputeId, { status: "resolved" });
  await addAuditLog("INFO", `Admin ${req.user.email} resolved dispute ${disputeId}: "${resolution}"`);

  res.json({ success: true, status: "resolved" });
});

// 13. Stream Logs (Admin)
app.get("/api/admin/logs", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access." });
  }

  const logs = await db.logs.find();
  // Return the latest 40 logs in chronological order
  res.json(logs.slice(-40));
});

// Start Express server after initializing database tables
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`PortalApp V8 Server running on http://localhost:${PORT}`);
  });
});
