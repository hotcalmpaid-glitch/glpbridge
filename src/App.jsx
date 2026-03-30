import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ⬇️ UPDATE THIS CODE EVERY 30 DAYS
const ACCESS_CODE = "HOP";

// ⬇️ STAN STORE LINKS
const HOT_MINIMUM_LINK = "https://stan.store/hotcalmpaid/p/the-glp1-bridge";
const THIRTY_DAYS_LINK = "https://stan.store/hotcalmpaid/p/-usfy5q7e";

function calculateNutrition(weightLbs, heightFt, heightIn, age, sex, physicalJob) {
  const weightKg = weightLbs * 0.453592;
  const heightCm = ((parseInt(heightFt) * 12) + parseInt(heightIn)) * 2.54;
  const ageNum = parseInt(age) || 35;
  const sexOffset = sex === "male" ? 5 : -161;
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageNum) + sexOffset;
  const activityMultiplier = physicalJob ? 1.375 : 1.2;
  const tdee = Math.round(bmr * activityMultiplier);
  const floor = sex === "male" ? 1600 : 1400;
  const targetCals = Math.max(floor, tdee - 500);
  const targetProtein = Math.min(150, Math.round(weightLbs * 0.6));
  return { tdee, targetCals, targetProtein };
}

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --dragon: #DA1C5C;
    --dragon-dark: #B51648;
    --dragon-light: #FFF0F5;
    --tangerine: #F15A29;
    --tangerine-light: #FFF4F0;
    --raspberry: #FF5DD4;
    --sun: #F9C12F;
    --sun-light: #FFFBEE;
    --sand: #F7E9D7;
    --black: #0D0D0D;
    --cream: #FFFAF7;
    --text: #0D0D0D;
    --muted: #8A7070;
    --border: #F2DDD5;
  }

  .app-wrap { min-height:100vh; background:var(--sand); font-family:'DM Sans',sans-serif; color:var(--text); }

  /* GATE */
  .gate-wrap {
    min-height:100vh;
    background:var(--black);
    display:flex; align-items:center; justify-content:center; padding:24px;
    background-image:
      radial-gradient(ellipse at 15% 60%, rgba(218,28,92,0.25) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 20%, rgba(241,90,41,0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 60% 90%, rgba(255,93,212,0.12) 0%, transparent 45%);
  }
  .gate-card {
    background:var(--cream);
    border-radius:28px; padding:48px 36px; max-width:420px; width:100%;
    text-align:center;
    box-shadow: 0 0 0 2px rgba(218,28,92,0.15), 0 32px 80px rgba(0,0,0,0.4);
  }
  .gate-icon { font-size:48px; margin-bottom:14px; }
  .gate-card h1 { font-family:'Playfair Display',serif; font-size:28px; color:var(--black); margin-bottom:4px; line-height:1.2; }
  .gate-card h1 em { font-style:italic; color:var(--dragon); }
  .gate-tagline { font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--tangerine); margin-bottom:20px; display:block; }
  .gate-card p { color:var(--muted); font-size:14px; line-height:1.6; margin-bottom:24px; }
  .gate-input {
    width:100%; padding:14px 18px; border:2px solid var(--border); border-radius:14px;
    font-size:18px; font-family:'DM Sans',sans-serif; text-align:center;
    letter-spacing:4px; text-transform:uppercase; outline:none;
    transition:all 0.2s; margin-bottom:12px; color:var(--black); background:#fff;
    font-weight:700;
  }
  .gate-input:focus { border-color:var(--dragon); box-shadow:0 0 0 3px rgba(218,28,92,0.12); }
  .gate-input.error { border-color:var(--dragon); background:var(--dragon-light); }
  .gate-error { color:var(--dragon); font-size:13px; margin-bottom:12px; font-weight:600; }
  .gate-note { font-size:12px; color:var(--muted); margin-top:16px; line-height:1.5; }
  .gate-note a { color:var(--dragon); font-weight:700; }

  /* HERO */
  .hero {
    background:var(--black);
    padding:52px 24px 60px; text-align:center; position:relative; overflow:hidden;
    background-image:
      radial-gradient(ellipse at 20% 50%, rgba(218,28,92,0.22) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 15%, rgba(241,90,41,0.18) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 100%, rgba(255,93,212,0.1) 0%, transparent 45%);
  }
  .hero::after {
    content:'';
    position:absolute; bottom:0; left:0; right:0; height:4px;
    background:linear-gradient(90deg, var(--dragon), var(--tangerine), var(--raspberry), var(--dragon));
  }
  .hero-badge {
    display:inline-block;
    background:rgba(255,93,212,0.15); color:var(--raspberry);
    border:1px solid rgba(255,93,212,0.3); border-radius:100px;
    padding:6px 20px; font-size:11px; font-weight:700; letter-spacing:2px;
    text-transform:uppercase; margin-bottom:22px;
  }
  .hero h1 { font-family:'Playfair Display',serif; font-size:clamp(30px,6vw,52px); color:#fff; line-height:1.1; margin-bottom:6px; }
  .hero h1 em { font-style:italic; color:var(--dragon); }
  .hero-tm { font-size:clamp(16px,2.5vw,22px); color:var(--tangerine); font-family:'Playfair Display',serif; font-weight:700; margin-bottom:18px; display:block; letter-spacing:1px; }
  .hero p { color:rgba(255,255,255,0.6); font-size:15px; max-width:480px; margin:0 auto; line-height:1.6; }

  /* STEPS */
  .steps-bar { background:#fff; border-bottom:2px solid var(--border); padding:0 16px; display:flex; justify-content:center; overflow-x:auto; }
  .step-tab { padding:14px 12px; font-size:11px; font-weight:700; color:var(--muted); border-bottom:3px solid transparent; white-space:nowrap; display:flex; align-items:center; gap:6px; letter-spacing:0.5px; text-transform:uppercase; transition:color 0.2s; }
  .step-tab.active { color:var(--dragon); border-bottom-color:var(--dragon); }
  .step-tab.done { color:var(--tangerine); opacity:0.7; }
  .step-num { width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; background:#F2DDD5; color:var(--muted); flex-shrink:0; transition:all 0.2s; }
  .step-tab.active .step-num { background:var(--dragon); color:#fff; }
  .step-tab.done .step-num { background:var(--tangerine); color:#fff; opacity:1; }

  .container { max-width:680px; margin:0 auto; padding:32px 16px 80px; }
  .card { background:#fff; border-radius:20px; padding:28px 24px; box-shadow:0 4px 24px rgba(218,28,92,0.07); margin-bottom:16px; border:1px solid var(--border); }

  /* MEDICAL */
  .medical-banner { background:var(--sun-light); border:1.5px solid rgba(249,193,47,0.5); border-radius:14px; padding:14px 18px; margin-bottom:20px; display:flex; gap:12px; align-items:flex-start; }
  .medical-banner-icon { font-size:18px; flex-shrink:0; margin-top:1px; }
  .medical-banner p { font-size:12px; color:#7A6020; line-height:1.6; }
  .medical-banner strong { color:#5A4010; }

  /* CALORIE CARD */
  .calorie-card { background:var(--black); border-radius:18px; padding:22px; margin-bottom:20px; position:relative; overflow:hidden; }
  .calorie-card::before { content:''; position:absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:50%; background:rgba(218,28,92,0.15); }
  .calorie-card h4 { color:#fff; font-weight:700; font-size:14px; margin-bottom:14px; position:relative; z-index:1; }
  .calorie-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:12px; position:relative; z-index:1; }
  .calorie-stat { background:rgba(255,255,255,0.07); border-radius:12px; padding:14px 10px; text-align:center; border:1px solid rgba(255,255,255,0.08); }
  .calorie-stat-num { font-family:'Playfair Display',serif; font-size:24px; color:var(--dragon); font-weight:700; }
  .calorie-stat-label { font-size:10px; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:0.5px; margin-top:3px; }
  .calorie-note { font-size:12px; color:rgba(255,255,255,0.5); line-height:1.5; position:relative; z-index:1; }

  /* WHY CONSERVATIVE */
  .why-conservative { background:var(--tangerine-light); border:1.5px solid rgba(241,90,41,0.25); border-radius:14px; padding:16px 20px; margin-bottom:20px; display:flex; gap:12px; align-items:flex-start; }
  .why-conservative-icon { font-size:20px; flex-shrink:0; margin-top:1px; }
  .why-conservative h4 { color:var(--tangerine); font-size:13px; font-weight:700; margin-bottom:5px; }
  .why-conservative p { color:#8A3A10; font-size:12px; line-height:1.6; }

  /* PHYSICAL JOB */
  .physical-job-toggle { display:flex; align-items:flex-start; gap:14px; background:var(--sand); border-radius:14px; padding:16px 18px; cursor:pointer; margin-top:4px; border:1.5px solid transparent; transition:all 0.2s; }
  .physical-job-toggle:hover { border-color:var(--border); }
  .physical-job-toggle.selected { border-color:var(--dragon); background:var(--dragon-light); }
  .physical-job-checkbox { width:22px; height:22px; border-radius:6px; border:2px solid #DDB0C0; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; font-size:12px; transition:all 0.2s; }
  .physical-job-toggle.selected .physical-job-checkbox { background:var(--dragon); border-color:var(--dragon); color:#fff; }
  .physical-job-text h5 { font-size:13px; font-weight:700; color:var(--black); margin-bottom:3px; }
  .physical-job-text p { font-size:12px; color:var(--muted); line-height:1.4; }

  .section-title { font-family:'Playfair Display',serif; font-size:26px; color:var(--black); margin-bottom:6px; line-height:1.2; }
  .section-title em { font-style:italic; color:var(--dragon); }
  .section-sub { color:var(--muted); font-size:14px; margin-bottom:24px; line-height:1.5; }

  .form-row { margin-bottom:18px; }
  .form-label { display:block; font-size:11px; font-weight:700; color:var(--black); margin-bottom:7px; letter-spacing:0.5px; text-transform:uppercase; }
  .form-input { width:100%; padding:12px 16px; border:1.5px solid var(--border); border-radius:12px; font-size:14px; font-family:'DM Sans',sans-serif; color:var(--text); background:var(--sand); outline:none; transition:all 0.2s; }
  .form-input:focus { border-color:var(--dragon); background:#fff; box-shadow:0 0 0 3px rgba(218,28,92,0.08); }
  .form-row-two { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .form-row-three { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

  .tag-group { display:flex; flex-wrap:wrap; gap:8px; margin-top:4px; }
  .tag { padding:8px 16px; border-radius:100px; border:1.5px solid var(--border); font-size:13px; cursor:pointer; transition:all 0.2s; background:#fff; color:var(--text); user-select:none; font-weight:500; }
  .tag:hover { border-color:var(--dragon); color:var(--dragon); }
  .tag.selected { background:var(--dragon); color:#fff; border-color:var(--dragon); }

  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:14px 28px; border-radius:14px; font-size:14px; font-weight:700; cursor:pointer; border:none; transition:all 0.2s; font-family:'DM Sans',sans-serif; letter-spacing:0.3px; }
  .btn-primary { background:linear-gradient(135deg, var(--dragon), var(--dragon-dark)); color:#fff; width:100%; margin-top:6px; box-shadow:0 4px 16px rgba(218,28,92,0.3); }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(218,28,92,0.4); }
  .btn-primary:disabled { opacity:0.45; cursor:not-allowed; transform:none; box-shadow:none; }
  .btn-outline { background:transparent; border:2px solid var(--black); color:var(--black); }
  .btn-outline:hover { background:var(--black); color:#fff; }
  .btn-sm { padding:9px 16px; font-size:12px; width:auto; }
  .btn-tangerine { background:linear-gradient(135deg, var(--tangerine), #D44A1A); color:#fff; width:100%; margin-top:6px; box-shadow:0 4px 16px rgba(241,90,41,0.3); }
  .btn-tangerine:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(241,90,41,0.4); }

  .edu-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
  .edu-card { background:var(--sand); border-radius:16px; padding:20px; border:1px solid var(--border); transition:transform 0.2s; }
  .edu-card:hover { transform:translateY(-2px); }
  .edu-icon { font-size:28px; margin-bottom:10px; }
  .edu-card h4 { font-size:14px; font-weight:700; color:var(--black); margin-bottom:5px; }
  .edu-card p { font-size:12px; color:var(--muted); line-height:1.5; }

  .info-box { background:var(--dragon-light); border:1px solid rgba(218,28,92,0.18); border-radius:16px; padding:20px; margin-bottom:16px; }
  .info-box h4 { color:var(--dragon-dark); font-weight:700; margin-bottom:8px; font-size:14px; display:flex; align-items:center; gap:6px; }
  .info-box p, .info-box li { font-size:13px; color:#6A1030; line-height:1.7; }
  .info-box ul { padding-left:18px; margin-top:6px; }
  .info-box li { margin-bottom:4px; }

  .month-banner { background:var(--black); border-radius:16px; padding:20px; margin-bottom:20px; display:flex; align-items:flex-start; gap:14px; position:relative; overflow:hidden; }
  .month-banner::after { content:''; position:absolute; bottom:-20px; right:-20px; width:100px; height:100px; border-radius:50%; background:rgba(218,28,92,0.15); }
  .month-banner-icon { font-size:24px; flex-shrink:0; margin-top:2px; }
  .month-banner h4 { color:#fff; font-size:14px; font-weight:700; margin-bottom:5px; }
  .month-banner p { color:rgba(255,255,255,0.55); font-size:13px; line-height:1.5; }

  .spinner { width:48px; height:48px; border:3px solid var(--border); border-top-color:var(--dragon); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 16px; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .loading-wrap { text-align:center; padding:60px 20px; }
  .loading-wrap h3 { font-family:'Playfair Display',serif; font-size:24px; color:var(--black); margin-bottom:8px; }
  .loading-wrap p { color:var(--muted); font-size:14px; }

  .meal-day { border:1.5px solid var(--border); border-radius:18px; overflow:hidden; margin-bottom:14px; background:#fff; }
  .meal-day-header { background:var(--black); color:#fff; padding:13px 20px; font-weight:700; font-size:13px; display:flex; justify-content:space-between; align-items:center; letter-spacing:0.3px; }
  .day-cal { font-size:11px; color:var(--raspberry); font-weight:700; }
  .meal-item { padding:14px 20px; border-bottom:1px solid var(--border); display:grid; grid-template-columns:72px 1fr auto; gap:12px; align-items:start; }
  .meal-item:last-child { border-bottom:none; }
  .meal-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:var(--tangerine); padding-top:2px; }
  .meal-name { font-size:13px; font-weight:700; color:var(--black); margin-bottom:3px; }
  .meal-desc { font-size:12px; color:var(--muted); line-height:1.4; }
  .meal-cal { font-size:11px; font-weight:700; color:var(--black); white-space:nowrap; text-align:right; }
  .meal-cal span { color:var(--dragon); display:block; font-weight:700; }

  .grocery-section { margin-bottom:22px; }
  .grocery-section h4 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--tangerine); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .grocery-section h4::after { content:''; flex:1; height:1.5px; background:var(--border); }
  .grocery-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .grocery-item { display:flex; align-items:center; gap:10px; padding:10px 14px; background:var(--sand); border-radius:12px; font-size:12px; cursor:pointer; transition:all 0.15s; border:1px solid transparent; font-weight:500; }
  .grocery-item:hover { background:var(--dragon-light); border-color:rgba(218,28,92,0.2); }
  .grocery-item.checked { opacity:0.4; text-decoration:line-through; }
  .grocery-check { width:18px; height:18px; border-radius:5px; border:2px solid #DDB0C0; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:11px; transition:all 0.15s; }
  .grocery-item.checked .grocery-check { background:var(--dragon); border-color:var(--dragon); color:#fff; }

  /* UPSELL */
  .upsell-hero {
    background:var(--black);
    border-radius:24px; padding:44px 28px; text-align:center; margin-bottom:16px;
    position:relative; overflow:hidden;
    background-image:
      radial-gradient(ellipse at 15% 70%, rgba(218,28,92,0.25) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 20%, rgba(241,90,41,0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 60% 100%, rgba(255,93,212,0.12) 0%, transparent 40%);
  }
  .upsell-badge { display:inline-block; background:rgba(255,93,212,0.15); color:var(--raspberry); border:1px solid rgba(255,93,212,0.3); border-radius:100px; padding:6px 18px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:18px; }
  .upsell-hero h2 { font-family:'Playfair Display',serif; font-size:clamp(24px,4vw,38px); color:#fff; line-height:1.2; margin-bottom:14px; }
  .upsell-hero h2 em { font-style:italic; color:var(--dragon); }
  .upsell-hero p { color:rgba(255,255,255,0.6); font-size:15px; line-height:1.6; max-width:460px; margin:0 auto; }
  .upsell-price { display:inline-flex; align-items:baseline; gap:4px; margin:22px 0 4px; }
  .upsell-price .amount { font-family:'Playfair Display',serif; font-size:60px; color:#fff; font-weight:900; line-height:1; }
  .upsell-price .period { color:rgba(255,255,255,0.45); font-size:16px; }

  .get-item { display:flex; gap:14px; align-items:flex-start; padding:15px 0; border-bottom:1px solid var(--border); }
  .get-item:last-child { border-bottom:none; }
  .get-icon { font-size:24px; flex-shrink:0; margin-top:1px; }
  .get-item h4 { font-size:14px; font-weight:700; color:var(--black); margin-bottom:3px; }
  .get-item p { font-size:13px; color:var(--muted); line-height:1.5; }

  .no-thanks { text-align:center; margin-top:18px; }
  .no-thanks button { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; text-decoration:underline; font-family:'DM Sans',sans-serif; }
  .no-thanks button:hover { color:var(--black); }

  .warn-box { background:var(--sun-light); border:1px solid rgba(249,193,47,0.4); border-radius:14px; padding:14px 18px; margin-bottom:16px; font-size:12px; color:#7A6020; line-height:1.5; display:flex; gap:10px; }

  .stat-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
  .stat-box { background:var(--sand); border-radius:16px; padding:20px; text-align:center; border:1px solid var(--border); }
  .stat-num { font-family:'Playfair Display',serif; font-size:32px; color:var(--dragon); font-weight:700; }
  .stat-label { font-size:10px; color:var(--muted); margin-top:4px; text-transform:uppercase; letter-spacing:0.5px; font-weight:700; }

  @media (max-width:560px) {
    .gate-card { padding:36px 20px; }
    .edu-grid { grid-template-columns:1fr; }
    .form-row-two { grid-template-columns:1fr; }
    .form-row-three { grid-template-columns:1fr 1fr; }
    .grocery-grid { grid-template-columns:1fr; }
    .meal-item { grid-template-columns:60px 1fr; }
    .meal-cal { display:none; }
    .calorie-row { grid-template-columns:1fr 1fr; }
  }
`;

const STEPS = ["About You","The Tea","Your Plan","Groceries","Level Up"];
const PROTEIN_OPTS = ["Chicken","Salmon","Ground Turkey","Ground Beef","Tuna","Shrimp","Steak","Eggs"];
const CARB_OPTS = ["Sweet Potato","Beans","Brown Rice","Oats","Fruits","Quinoa"];
const AVOID_OPTS = ["Soy/Soy Sauce","Dairy","Gluten","Nuts","Shellfish","Pork","Red Meat","None"];
const COOKING_OPTS = ["Baking","Sautéing","Grilling","One-pan meals","Quick (under 30 min)","Meal prep friendly"];

function Tag({ label, selected, onToggle }) {
  return <div className={`tag${selected?" selected":""}`} onClick={onToggle}>{label}</div>;
}

function MedicalBanner() {
  return (
    <div className="medical-banner">
      <div className="medical-banner-icon">⚕️</div>
      <p><strong>Heads up:</strong> This tool is for general wellness support only — not a substitute for medical advice. Your doctor knows your body better than any app does. Always follow their guidance, especially around medication, nutrition, and existing health conditions. Calorie estimates are based on the Mifflin-St Jeor equation and are starting points, not prescriptions. Individual results vary.</p>
    </div>
  );
}

function AccessGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = () => {
    if (code.trim().toUpperCase() === ACCESS_CODE) { onUnlock(); }
    else { setError(true); setTimeout(()=>setError(false), 2500); }
  };
  return (
    <div className="gate-wrap">
      <div className="gate-card">
        <div className="gate-icon">🔥</div>
        <h1>The <em>Hot Minimum</em><br/>Meal Plan™</h1>
        <span className="gate-tagline">by Hot Calm Paid</span>
        <p>Enter your access code from your confirmation email. We'll take it from there.</p>
        <input className={`gate-input${error?" error":""}`} placeholder="ACCESS CODE" value={code}
          onChange={e=>{ setCode(e.target.value); setError(false); }}
          onKeyDown={e=>e.key==="Enter"&&handleSubmit()} maxLength={20} />
        {error && <p className="gate-error">That code didn't work. Check your confirmation email and try again.</p>}
        <button className="btn btn-primary" onClick={handleSubmit} disabled={!code.trim()}>
          Let Me In →
        </button>
        <p className="gate-note">Don't have a code? <a href={HOT_MINIMUM_LINK} target="_blank" rel="noreferrer">Get The Hot Minimum for $17 →</a></p>
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    heightFt:"", heightIn:"", weight:"", goalWeight:"",
    age:"", sex:"female", physicalJob:false,
    proteins:[], carbs:[], avoid:[], cooking:[], notes:""
  });
  const [nutrition, setNutrition] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [groceryList, setGroceryList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState({});

  const toggleTag = (field, val) => setProfile(p => ({ ...p, [field]: p[field].includes(val) ? p[field].filter(x=>x!==val) : [...p[field],val] }));
  const canContinue = profile.weight && profile.heightFt && profile.age && profile.proteins.length > 0;

  const handleContinueToLearn = () => {
    const n = calculateNutrition(parseFloat(profile.weight), profile.heightFt, profile.heightIn, profile.age, profile.sex, profile.physicalJob);
    setNutrition(n);
    setStep(1);
  };

  const generatePlan = async () => {
    setLoading(true); setError("");
    const n = nutrition || calculateNutrition(parseFloat(profile.weight), profile.heightFt, profile.heightIn, profile.age, profile.sex, profile.physicalJob);
    try {
      const prompt = `You are a registered dietitian creating a medically responsible 7-day meal plan called "The Hot Minimum" — the minimum viable nutrition that actually moves the needle.

Patient stats:
- Height: ${profile.heightFt}ft ${profile.heightIn}in | Weight: ${profile.weight}lbs | Age: ${profile.age} | Sex: ${profile.sex}
- Activity baseline: ${profile.physicalJob ? "light (physically demanding job)" : "sedentary (conservative baseline)"}
- Estimated TDEE: ${n.tdee} calories/day
- TARGET daily calories: ${n.targetCals} (conservative 500-calorie deficit for ~0.5-1lb/week loss)
- TARGET daily protein: ${n.targetProtein}g (0.6g per lb of body weight)
- Goal weight: ${profile.goalWeight || "not specified"}lbs

Food preferences:
- Proteins: ${profile.proteins.join(", ")||"any"}
- Complex carbs: ${profile.carbs.join(", ")||"any"}
- Avoid: ${profile.avoid.join(", ")||"none"}
- Cooking style: ${profile.cooking.join(", ")||"any"}
- Notes: ${profile.notes||"none"}

STRICT REQUIREMENTS:
1. Each day's TOTAL calories must land within 50 calories of ${n.targetCals}
2. Each day's TOTAL protein must land within 8g of ${n.targetProtein}g
3. Meals must be genuinely appetizing — steak chimichurri with black beans, Greek turkey bowls with tzatziki and feta, baked or sautéed salmon with lemon and herbs, cottage cheese and berry bowls with chia seeds, burger bowls without the bun, sweet potato and ground beef skillets, tuna avocado lettuce wraps, chicken salad with grapes and Greek yogurt dressing, garbanzo bean and roasted veggie bowls, shrimp stir fry with cauliflower rice. Real food people want to eat.
4. No soy sauce if soy is in avoid list — use coconut aminos, lemon, herbs, red wine vinegar instead
5. Use beans, chia seeds, and vegetables generously for fiber
6. Be precise with calorie and protein counts
7. Distribute calories roughly: breakfast 22%, lunch 30%, snack 13%, dinner 35%
8. Distribute protein roughly: breakfast 25%, lunch 30%, snack 12%, dinner 33%

Respond ONLY in valid JSON with no markdown, no preamble:
{"weeklyCalories":${n.targetCals},"weeklyProtein":${n.targetProtein},"days":[{"day":"Monday","meals":{"breakfast":{"name":"...","description":"...","calories":0,"protein":0},"lunch":{"name":"...","description":"...","calories":0,"protein":0},"snack":{"name":"...","description":"...","calories":0,"protein":0},"dinner":{"name":"...","description":"...","calories":0,"protein":0}}}],"grocery":{"Proteins":["..."],"Produce":["..."],"Dairy & Eggs":["..."],"Pantry & Canned":["..."],"Spices & Condiments":["..."]}}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{
          "Content-Type":"application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:4000, messages:[{role:"user",content:prompt}] })
      });
      const data = await res.json();
      const text = data.content.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(text);
      setMealPlan(parsed); setGroceryList(parsed.grocery); setStep(2);
    } catch(e) { setError("Something went wrong generating your plan. Please try again."); }
    setLoading(false);
  };

  if (!unlocked) return (<><style>{FONTS}{css}</style><AccessGate onUnlock={()=>setUnlocked(true)} /></>);

  return (
    <>
      <style>{FONTS}{css}</style>
      <div className="app-wrap">

        <div className="hero">
          <div className="hero-badge">✨ Hot Calm Paid</div>
          <h1>The <em>Hot Minimum</em></h1>
          <span className="hero-tm">Meal Plan™</span>
          <p>High protein. Whole foods. Built around your actual life — not some fantasy version of it.</p>
        </div>

        <div className="steps-bar">
          {STEPS.map((s,i)=>(
            <div key={i} className={`step-tab${step===i?" active":""}${step>i?" done":""}`}>
              <div className="step-num">{step>i?"✓":i+1}</div>{s}
            </div>
          ))}
        </div>

        <div className="container">

          {/* STEP 0 — PROFILE */}
          {step===0 && (
            <div>
              <MedicalBanner />
              <div className="card">
                <p className="section-title">Let's talk about <em>you</em></p>
                <p className="section-sub">We use the Mifflin-St Jeor equation — the gold standard in nutrition science — to calculate your actual calorie targets. Age and biological sex matter for the math.</p>
                <div className="form-row-three">
                  <div className="form-row"><label className="form-label">Height (ft)</label><input className="form-input" type="number" placeholder="5" value={profile.heightFt} onChange={e=>setProfile(p=>({...p,heightFt:e.target.value}))} /></div>
                  <div className="form-row"><label className="form-label">Height (in)</label><input className="form-input" type="number" placeholder="6" value={profile.heightIn} onChange={e=>setProfile(p=>({...p,heightIn:e.target.value}))} /></div>
                  <div className="form-row"><label className="form-label">Age</label><input className="form-input" type="number" placeholder="34" value={profile.age} onChange={e=>setProfile(p=>({...p,age:e.target.value}))} /></div>
                </div>
                <div className="form-row-two">
                  <div className="form-row"><label className="form-label">Current weight (lbs)</label><input className="form-input" type="number" placeholder="276" value={profile.weight} onChange={e=>setProfile(p=>({...p,weight:e.target.value}))} /></div>
                  <div className="form-row"><label className="form-label">Goal weight (lbs)</label><input className="form-input" type="number" placeholder="230" value={profile.goalWeight} onChange={e=>setProfile(p=>({...p,goalWeight:e.target.value}))} /></div>
                </div>
                <div className="form-row">
                  <label className="form-label">Biological sex (for the math only)</label>
                  <div className="tag-group">
                    {["female","male"].map(s=><Tag key={s} label={s.charAt(0).toUpperCase()+s.slice(1)} selected={profile.sex===s} onToggle={()=>setProfile(p=>({...p,sex:s}))} />)}
                  </div>
                </div>
                <div className="form-row">
                  <label className="form-label">Job situation</label>
                  <div className={`physical-job-toggle${profile.physicalJob?" selected":""}`} onClick={()=>setProfile(p=>({...p,physicalJob:!p.physicalJob}))}>
                    <div className="physical-job-checkbox">{profile.physicalJob?"✓":""}</div>
                    <div className="physical-job-text">
                      <h5>My job is genuinely physically demanding</h5>
                      <p>Construction, nursing, warehouse, landscaping — real sustained physical labor. Sitting at a desk, light retail, or "I walk around sometimes" does not count here.</p>
                    </div>
                  </div>
                </div>
                <div className="why-conservative">
                  <div className="why-conservative-icon">💡</div>
                  <div>
                    <h4>Why we keep it conservative</h4>
                    <p>Most people wildly overestimate how much they move. A real deficit requires honest math. We calculate on the lower end so your results are real — not theoretical. Your doctor can always adjust up from there.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <p className="section-title">What are you <em>working with?</em></p>
                <p className="section-sub">Tell us what you actually like to eat. This is not a punishment plan — it's built around your real life.</p>
                <div className="form-row"><label className="form-label">Proteins you love</label><div className="tag-group">{PROTEIN_OPTS.map(o=><Tag key={o} label={o} selected={profile.proteins.includes(o)} onToggle={()=>toggleTag("proteins",o)} />)}</div></div>
                <div className="form-row"><label className="form-label">Complex carbs you vibe with</label><div className="tag-group">{CARB_OPTS.map(o=><Tag key={o} label={o} selected={profile.carbs.includes(o)} onToggle={()=>toggleTag("carbs",o)} />)}</div></div>
                <div className="form-row"><label className="form-label">Hard no's</label><div className="tag-group">{AVOID_OPTS.map(o=><Tag key={o} label={o} selected={profile.avoid.includes(o)} onToggle={()=>toggleTag("avoid",o)} />)}</div></div>
                <div className="form-row"><label className="form-label">How you actually cook</label><div className="tag-group">{COOKING_OPTS.map(o=><Tag key={o} label={o} selected={profile.cooking.includes(o)} onToggle={()=>toggleTag("cooking",o)} />)}</div></div>
                <div className="form-row"><label className="form-label">Anything else we should know?</label><textarea className="form-input" rows={2} placeholder="High blood pressure, hate mushrooms, cooking for a family, obsessed with hot sauce..." style={{resize:"vertical"}} value={profile.notes} onChange={e=>setProfile(p=>({...p,notes:e.target.value}))} /></div>
              </div>

              {!canContinue && <p style={{textAlign:"center",color:"var(--muted)",fontSize:12,marginBottom:10}}>Fill in your height, weight, age, and pick at least one protein to keep going.</p>}
              <button className="btn btn-primary" disabled={!canContinue} onClick={handleContinueToLearn}>Let's Go →</button>
            </div>
          )}

          {/* STEP 1 — EDUCATION */}
          {step===1 && nutrition && (
            <div>
              <MedicalBanner />
              <div className="calorie-card">
                <h4>🧮 Your actual numbers (not a guess)</h4>
                <div className="calorie-row">
                  <div className="calorie-stat"><div className="calorie-stat-num">{nutrition.tdee}</div><div className="calorie-stat-label">Maintenance</div></div>
                  <div className="calorie-stat"><div className="calorie-stat-num">{nutrition.targetCals}</div><div className="calorie-stat-label">Your target</div></div>
                  <div className="calorie-stat"><div className="calorie-stat-num">{nutrition.targetProtein}g</div><div className="calorie-stat-label">Protein/day</div></div>
                </div>
                <p className="calorie-note">Your plan will hit {nutrition.targetCals} calories and {nutrition.targetProtein}g protein daily — a conservative 500-calorie deficit. These are estimates. Your doctor's guidance always wins.</p>
              </div>

              <div className="card">
                <p className="section-title">Here's <em>the tea</em></p>
                <p className="section-sub">No hype, no fake promises. Just what's actually true about food, your body, and what to expect.</p>
                <div className="edu-grid">
                  {[
                    ["💉","What are GLP-1s?","Medications like Ozempic and Wegovy that work with your gut hormones to reduce appetite. They work best when your eating habits are already moving in the right direction."],
                    ["⏳","Why start now?","Insurance approval takes weeks to months. Every week you wait without changing anything is a week your body spent in the same conditions. You don't need the prescription to start."],
                    ["🍽️","What the medication actually does","It reduces hunger — significantly. But if you've never practiced eating this way, you won't know what to do with the reduced hunger. Build the habits now."],
                    ["💪","The protein thing is not optional","Adequate protein during fat loss protects your muscle mass. Lose muscle and your metabolism tanks. This plan hits your protein target every single day for that reason."]
                  ].map(([icon,title,desc])=>(
                    <div className="edu-card" key={title}><div className="edu-icon">{icon}</div><h4>{title}</h4><p>{desc}</p></div>
                  ))}
                </div>
                <div className="info-box">
                  <h4>📉 Honest expectations — because you deserve the truth, not hype</h4>
                  <p style={{marginBottom:8}}>A 500-calorie deficit is designed for 0.5–1 lb of fat loss per week. Here's what that actually looks like:</p>
                  <ul>
                    <li><strong>First 1–2 weeks:</strong> You'll likely see a bigger drop — mostly water weight from cutting processed food and sodium. Real, but temporary.</li>
                    <li><strong>Ongoing:</strong> 0.5–1 lb of actual fat loss per week with consistency. Over a month, that's 4–6 lbs of real fat — meaningful, sustainable progress.</li>
                    <li><strong>The real goal:</strong> Building the habits your body and your medication can build on long-term.</li>
                  </ul>
                  <p style={{marginTop:10,fontStyle:"italic"}}>Anyone promising rapid dramatic results from diet alone is not being straight with you. Slow and steady is not a consolation prize — it's how it actually works.</p>
                </div>
                <div className="info-box">
                  <h4>✨ The Hot Minimum — what actually moves the needle</h4>
                  <ul>
                    <li><strong>Protein first</strong> at every meal — fullness, muscle preservation, all of it</li>
                    <li><strong>Whole foods only</strong> — if it has 15 ingredients, it's not on the plan</li>
                    <li><strong>Fiber is your hunger manager</strong> — beans, chia seeds, non-starchy vegetables</li>
                    <li><strong>A daily walk</strong> — not a workout. A walk. 20–30 minutes. That's the Hot Minimum.</li>
                    <li><strong>80–100oz of water</strong> — thirst masquerades as hunger constantly</li>
                    <li><strong>Sleep is not optional</strong> — poor sleep wrecks hunger hormones and fat loss</li>
                  </ul>
                </div>
              </div>

              <button className="btn btn-primary" onClick={generatePlan} disabled={loading}>
                {loading ? "Building your plan..." : "✨ Build My Hot Minimum Plan"}
              </button>
              {loading && (
                <div className="loading-wrap">
                  <div className="spinner"/>
                  <h3>Cooking something up...</h3>
                  <p>Personalizing your 7-day rotation right now</p>
                </div>
              )}
              {error && <p style={{color:"var(--dragon)",textAlign:"center",marginTop:12,fontSize:13,fontWeight:600}}>{error}</p>}
              <div style={{marginTop:12}}><button className="btn btn-outline btn-sm" onClick={()=>setStep(0)}>← Back</button></div>
            </div>
          )}

          {/* STEP 2 — MEAL PLAN */}
          {step===2 && mealPlan && (
            <div>
              <div className="card">
                <p className="section-title">Your <em>Hot Minimum</em> Plan</p>
                <p className="section-sub">Built around your body and your preferences. This is your full 30-day program.</p>
                <div className="month-banner">
                  <div className="month-banner-icon">🔁</div>
                  <div>
                    <h4>This 7-day rotation = your entire 30-day plan</h4>
                    <p>Repeat it 4 times. Consistency over variety is what actually moves the scale. Decision fatigue is the enemy — this removes it completely.</p>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="stat-box"><div className="stat-num">{mealPlan.weeklyCalories}</div><div className="stat-label">Target cal / day</div></div>
                  <div className="stat-box"><div className="stat-num">{mealPlan.weeklyProtein}g</div><div className="stat-label">Protein / day</div></div>
                </div>
                <MedicalBanner />
                {mealPlan.days.map((day,di)=>(
                  <div className="meal-day" key={di}>
                    <div className="meal-day-header">
                      <span>{day.day}</span>
                      <span className="day-cal">{Object.values(day.meals).reduce((a,m)=>a+(m.calories||0),0)} cal · {Object.values(day.meals).reduce((a,m)=>a+(m.protein||0),0)}g protein</span>
                    </div>
                    {["breakfast","lunch","snack","dinner"].map(type=>day.meals[type]&&(
                      <div className="meal-item" key={type}>
                        <div className="meal-label">{type}</div>
                        <div><div className="meal-name">{day.meals[type].name}</div><div className="meal-desc">{day.meals[type].description}</div></div>
                        <div className="meal-cal">{day.meals[type].calories} cal<br/><span>{day.meals[type].protein}g</span></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button className="btn btn-outline btn-sm" onClick={()=>setStep(1)}>← Back</button>
                <button className="btn btn-outline btn-sm" onClick={()=>window.print()}>🖨️ Print / Save PDF</button>
                <button className="btn btn-primary" style={{flex:1,marginTop:0}} onClick={()=>setStep(3)}>View Grocery List →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — GROCERY */}
          {step===3 && groceryList && (
            <div>
              <div className="card">
                <p className="section-title">Your <em>grocery list</em></p>
                <p className="section-sub">Everything you need for the week. Tap to check off as you shop. No extras, no fluff.</p>
                {Object.entries(groceryList).map(([cat,items])=>(
                  <div className="grocery-section" key={cat}>
                    <h4>{cat}</h4>
                    <div className="grocery-grid">
                      {items.map(item=>{
                        const key=`${cat}:${item}`;
                        return <div key={item} className={`grocery-item${checked[key]?" checked":""}`} onClick={()=>setChecked(p=>({...p,[key]:!p[key]}))}>
                          <div className="grocery-check">{checked[key]?"✓":""}</div>{item}
                        </div>;
                      })}
                    </div>
                  </div>
                ))}
                <div className="warn-box" style={{marginTop:16}}><span>💡</span><span>Check sodium on all packaged items — aim for under 150mg per serving. Non-negotiable if you're managing blood pressure.</span></div>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button className="btn btn-outline btn-sm" onClick={()=>setStep(2)}>← Meal Plan</button>
                <button className="btn btn-outline btn-sm" onClick={()=>window.print()}>🖨️ Print / Save PDF</button>
                <button className="btn btn-primary" style={{flex:1,marginTop:0}} onClick={()=>setStep(4)}>See What's Next →</button>
              </div>
            </div>
          )}

          {/* STEP 4 — UPSELL */}
          {step===4 && (
            <div>
              <div className="upsell-hero">
                <div className="upsell-badge">✨ The next level is right here</div>
                <h2>You have the plan.<br/>Now build the <em>habits</em>.</h2>
                <p>The Hot Minimum tells you what to eat. 30 Days to Stable addresses why you stop — and exactly how to keep going anyway.</p>
                <div className="upsell-price">
                  <span className="amount">$47</span>
                  <span className="period">one time</span>
                </div>
              </div>
              <div className="card">
                <p className="section-title" style={{fontSize:22}}>What's inside <em>30 Days to Stable</em></p>
                <div style={{marginBottom:20}}>
                  {[
                    ["🧠","Daily behavioral prompts","30 days of guided check-ins that address the thoughts, patterns, and reflexes that derail you — not just the food."],
                    ["📋","Habit tracking system","Simple daily tracking that builds awareness without obsession. You can't change what you won't look at."],
                    ["🔄","The On Purpose Loop™","A framework for catching self-sabotage before it happens and interrupting it with something small and doable."],
                    ["💬","Tiny Savage Promises™","A daily commitment practice that builds the follow-through muscle the meal plan alone can't give you."],
                    ["📈","Track Your Receipts™","A method for documenting your wins so your brain starts believing the evidence of your own progress."],
                  ].map(([icon,title,desc])=>(
                    <div className="get-item" key={title}>
                      <div className="get-icon">{icon}</div>
                      <div><h4>{title}</h4><p>{desc}</p></div>
                    </div>
                  ))}
                </div>
                <MedicalBanner />
                <a href={THIRTY_DAYS_LINK} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                  <button className="btn btn-tangerine">Get 30 Days to Stable — $47 →</button>
                </a>
                <div className="no-thanks">
                  <button onClick={()=>setStep(3)}>← Go back to my grocery list</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
