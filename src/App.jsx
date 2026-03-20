import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ⬇️ UPDATE THIS CODE EVERY 15 DAYS
const ACCESS_CODE = "GLPBRIDGE";

// ⬇️ STAN STORE LINK FOR 30 DAYS TO STABLE
const THIRTY_DAYS_LINK = "https://stan.store/hotcalmpaid/p/-usfy5q7e";

// Mifflin-St Jeor — always sedentary baseline (1.2)
// Physical job override bumps to light (1.375)
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
    --forest: #1C4A2E; --sage: #4A7C59; --mint: #A8C5A0;
    --cream: #F7F3EE; --warm: #EDE4D8; --coral: #C86B4F;
    --text: #1C2B1E; --muted: #6B7B6E;
  }
  .app-wrap { min-height:100vh; background:var(--cream); font-family:'DM Sans',sans-serif; color:var(--text); }

  .gate-wrap { min-height:100vh; background:var(--forest); display:flex; align-items:center; justify-content:center; padding:24px; }
  .gate-card { background:#fff; border-radius:24px; padding:48px 36px; max-width:420px; width:100%; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.2); }
  .gate-icon { font-size:48px; margin-bottom:16px; }
  .gate-card h1 { font-family:'Fraunces',serif; font-size:28px; color:var(--forest); margin-bottom:8px; }
  .gate-card h1 em { font-style:italic; color:var(--sage); }
  .gate-card p { color:var(--muted); font-size:14px; line-height:1.6; margin-bottom:28px; }
  .gate-input { width:100%; padding:14px 18px; border:2px solid #E0D9D0; border-radius:12px; font-size:16px; font-family:'DM Sans',sans-serif; text-align:center; letter-spacing:2px; text-transform:uppercase; outline:none; transition:border-color 0.2s; margin-bottom:12px; color:var(--text); background:var(--cream); }
  .gate-input:focus { border-color:var(--sage); background:#fff; }
  .gate-input.error { border-color:var(--coral); }
  .gate-error { color:var(--coral); font-size:13px; margin-bottom:12px; }
  .gate-note { font-size:12px; color:var(--muted); margin-top:16px; line-height:1.5; }
  .gate-note a { color:var(--sage); }

  .hero { background:var(--forest); padding:40px 24px 52px; text-align:center; position:relative; overflow:hidden; }
  .hero::before { content:''; position:absolute; top:-60px; left:-60px; width:280px; height:280px; border-radius:50%; background:rgba(168,197,160,0.1); }
  .hero::after { content:''; position:absolute; bottom:-70px; right:-40px; width:200px; height:200px; border-radius:50%; background:rgba(200,148,58,0.08); }
  .hero-badge { display:inline-block; background:rgba(168,197,160,0.2); color:var(--mint); border:1px solid rgba(168,197,160,0.3); border-radius:100px; padding:6px 18px; font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:18px; }
  .hero h1 { font-family:'Fraunces',serif; font-size:clamp(24px,4vw,38px); color:#fff; line-height:1.2; margin-bottom:14px; position:relative; z-index:1; }
  .hero h1 em { color:var(--mint); font-style:italic; }
  .hero p { color:rgba(255,255,255,0.7); font-size:15px; max-width:480px; margin:0 auto; line-height:1.6; position:relative; z-index:1; }

  .steps-bar { background:#fff; border-bottom:1px solid #E8E2DA; padding:0 16px; display:flex; justify-content:center; overflow-x:auto; }
  .step-tab { padding:14px 12px; font-size:12px; font-weight:500; color:var(--muted); border-bottom:3px solid transparent; white-space:nowrap; display:flex; align-items:center; gap:6px; }
  .step-tab.active { color:var(--forest); border-bottom-color:var(--forest); }
  .step-tab.done { color:var(--sage); }
  .step-num { width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; background:#E8E2DA; color:var(--muted); flex-shrink:0; }
  .step-tab.active .step-num { background:var(--forest); color:#fff; }
  .step-tab.done .step-num { background:var(--sage); color:#fff; }

  .container { max-width:680px; margin:0 auto; padding:32px 16px 80px; }
  .card { background:#fff; border-radius:18px; padding:28px 24px; box-shadow:0 2px 20px rgba(28,74,46,0.06); margin-bottom:16px; }

  .medical-banner { background:#FFF8F0; border:1.5px solid #F0D5B0; border-radius:14px; padding:16px 20px; margin-bottom:20px; display:flex; gap:12px; align-items:flex-start; }
  .medical-banner-icon { font-size:20px; flex-shrink:0; margin-top:1px; }
  .medical-banner p { font-size:13px; color:#7A5228; line-height:1.6; }
  .medical-banner strong { color:#5A3A18; }

  .calorie-card { background:linear-gradient(135deg,#EBF4EE,#F0F7F2); border:1px solid #C5DFCC; border-radius:14px; padding:20px 22px; margin-bottom:20px; }
  .calorie-card h4 { color:var(--forest); font-weight:700; font-size:14px; margin-bottom:12px; }
  .calorie-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:12px; }
  .calorie-stat { background:#fff; border-radius:10px; padding:12px; text-align:center; }
  .calorie-stat-num { font-family:'Fraunces',serif; font-size:22px; color:var(--forest); font-weight:700; }
  .calorie-stat-label { font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px; margin-top:2px; }
  .calorie-note { font-size:12px; color:#3A5C42; line-height:1.5; }

  .why-conservative { background:var(--forest); border-radius:12px; padding:16px 20px; margin-bottom:20px; display:flex; gap:12px; align-items:flex-start; }
  .why-conservative-icon { font-size:20px; flex-shrink:0; margin-top:1px; }
  .why-conservative h4 { color:#fff; font-size:13px; font-weight:700; margin-bottom:5px; }
  .why-conservative p { color:rgba(255,255,255,0.75); font-size:12px; line-height:1.6; }

  .physical-job-toggle { display:flex; align-items:flex-start; gap:14px; background:var(--warm); border-radius:12px; padding:16px 18px; cursor:pointer; margin-top:4px; border:1.5px solid transparent; transition:all 0.15s; }
  .physical-job-toggle.selected { border-color:var(--sage); background:#EBF4EE; }
  .physical-job-checkbox { width:20px; height:20px; border-radius:5px; border:1.5px solid #C0B8AF; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; font-size:12px; transition:all 0.15s; }
  .physical-job-toggle.selected .physical-job-checkbox { background:var(--sage); border-color:var(--sage); color:#fff; }
  .physical-job-text h5 { font-size:13px; font-weight:600; color:var(--forest); margin-bottom:3px; }
  .physical-job-text p { font-size:12px; color:var(--muted); line-height:1.4; }

  .section-title { font-family:'Fraunces',serif; font-size:24px; color:var(--forest); margin-bottom:6px; }
  .section-sub { color:var(--muted); font-size:14px; margin-bottom:24px; line-height:1.5; }

  .form-row { margin-bottom:18px; }
  .form-label { display:block; font-size:11px; font-weight:700; color:var(--forest); margin-bottom:7px; letter-spacing:0.5px; text-transform:uppercase; }
  .form-input { width:100%; padding:12px 14px; border:1.5px solid #DDD6CE; border-radius:10px; font-size:14px; font-family:'DM Sans',sans-serif; color:var(--text); background:var(--cream); outline:none; transition:border-color 0.2s; }
  .form-input:focus { border-color:var(--sage); background:#fff; }
  .form-row-two { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .form-row-three { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

  .tag-group { display:flex; flex-wrap:wrap; gap:8px; margin-top:4px; }
  .tag { padding:7px 14px; border-radius:100px; border:1.5px solid #DDD6CE; font-size:13px; cursor:pointer; transition:all 0.15s; background:var(--cream); color:var(--text); user-select:none; }
  .tag:hover { border-color:var(--sage); }
  .tag.selected { background:var(--forest); color:#fff; border-color:var(--forest); }

  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 24px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; border:none; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
  .btn-primary { background:var(--forest); color:#fff; width:100%; margin-top:6px; }
  .btn-primary:hover { background:#163d24; }
  .btn-primary:disabled { opacity:0.55; cursor:not-allowed; }
  .btn-outline { background:transparent; border:1.5px solid var(--forest); color:var(--forest); }
  .btn-outline:hover { background:var(--forest); color:#fff; }
  .btn-sm { padding:9px 16px; font-size:13px; width:auto; }
  .btn-coral { background:var(--coral); color:#fff; width:100%; margin-top:6px; }
  .btn-coral:hover { background:#b55e44; }

  .edu-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
  .edu-card { background:var(--warm); border-radius:12px; padding:18px; }
  .edu-icon { font-size:24px; margin-bottom:8px; }
  .edu-card h4 { font-size:14px; font-weight:600; color:var(--forest); margin-bottom:5px; }
  .edu-card p { font-size:12px; color:var(--muted); line-height:1.5; }

  .info-box { background:linear-gradient(135deg,#EBF4EE,#F0F7F2); border:1px solid #C5DFCC; border-radius:12px; padding:18px 20px; margin-bottom:16px; }
  .info-box h4 { color:var(--forest); font-weight:600; margin-bottom:7px; font-size:14px; }
  .info-box p, .info-box li { font-size:13px; color:#3A5C42; line-height:1.6; }
  .info-box ul { padding-left:18px; margin-top:5px; }
  .info-box li { margin-bottom:3px; }

  .month-banner { background:var(--forest); border-radius:12px; padding:16px 20px; margin-bottom:20px; display:flex; align-items:flex-start; gap:12px; }
  .month-banner-icon { font-size:22px; flex-shrink:0; margin-top:2px; }
  .month-banner h4 { color:#fff; font-size:14px; font-weight:700; margin-bottom:4px; }
  .month-banner p { color:rgba(255,255,255,0.75); font-size:13px; line-height:1.5; }

  .spinner { width:44px; height:44px; border:3px solid #E8E2DA; border-top-color:var(--forest); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 16px; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .loading-wrap { text-align:center; padding:50px 20px; }
  .loading-wrap h3 { font-family:'Fraunces',serif; font-size:20px; color:var(--forest); margin-bottom:6px; }
  .loading-wrap p { color:var(--muted); font-size:13px; }

  .meal-day { border:1.5px solid #E8E2DA; border-radius:14px; overflow:hidden; margin-bottom:14px; }
  .meal-day-header { background:var(--forest); color:#fff; padding:11px 18px; font-weight:600; font-size:13px; display:flex; justify-content:space-between; align-items:center; }
  .meal-day-header span { font-size:11px; opacity:0.7; }
  .meal-item { padding:12px 18px; border-bottom:1px solid #F0EBE4; display:grid; grid-template-columns:72px 1fr auto; gap:10px; align-items:start; }
  .meal-item:last-child { border-bottom:none; }
  .meal-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--coral); padding-top:2px; }
  .meal-name { font-size:13px; font-weight:600; color:var(--text); margin-bottom:2px; }
  .meal-desc { font-size:12px; color:var(--muted); line-height:1.4; }
  .meal-cal { font-size:11px; font-weight:600; color:var(--sage); white-space:nowrap; text-align:right; }

  .grocery-section { margin-bottom:20px; }
  .grocery-section h4 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--coral); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .grocery-section h4::after { content:''; flex:1; height:1px; background:#E8E2DA; }
  .grocery-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
  .grocery-item { display:flex; align-items:center; gap:9px; padding:9px 12px; background:var(--cream); border-radius:8px; font-size:12px; cursor:pointer; transition:all 0.15s; }
  .grocery-item:hover { background:var(--warm); }
  .grocery-item.checked { opacity:0.45; text-decoration:line-through; }
  .grocery-check { width:16px; height:16px; border-radius:4px; border:1.5px solid #C0B8AF; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:10px; }
  .grocery-item.checked .grocery-check { background:var(--sage); border-color:var(--sage); color:#fff; }

  .upsell-hero { background:linear-gradient(135deg,#1C4A2E 0%,#2D6B47 100%); border-radius:18px; padding:36px 28px; text-align:center; margin-bottom:16px; position:relative; overflow:hidden; }
  .upsell-hero::before { content:''; position:absolute; top:-40px; right:-40px; width:180px; height:180px; border-radius:50%; background:rgba(168,197,160,0.12); }
  .upsell-badge { display:inline-block; background:rgba(200,148,58,0.25); color:#E9C46A; border:1px solid rgba(200,148,58,0.3); border-radius:100px; padding:6px 16px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:16px; }
  .upsell-hero h2 { font-family:'Fraunces',serif; font-size:clamp(22px,4vw,32px); color:#fff; line-height:1.2; margin-bottom:12px; position:relative; z-index:1; }
  .upsell-hero h2 em { color:var(--mint); font-style:italic; }
  .upsell-hero p { color:rgba(255,255,255,0.75); font-size:14px; line-height:1.6; max-width:460px; margin:0 auto; position:relative; z-index:1; }
  .upsell-price { display:inline-flex; align-items:baseline; gap:6px; margin:20px 0 4px; }
  .upsell-price .amount { font-family:'Fraunces',serif; font-size:48px; color:#fff; font-weight:700; }
  .upsell-price .period { color:rgba(255,255,255,0.6); font-size:16px; }

  .get-item { display:flex; gap:14px; align-items:flex-start; padding:14px 0; border-bottom:1px solid #F0EBE4; }
  .get-item:last-child { border-bottom:none; }
  .get-icon { font-size:22px; flex-shrink:0; margin-top:1px; }
  .get-item h4 { font-size:14px; font-weight:600; color:var(--forest); margin-bottom:3px; }
  .get-item p { font-size:13px; color:var(--muted); line-height:1.5; }

  .no-thanks { text-align:center; margin-top:14px; }
  .no-thanks button { background:none; border:none; color:var(--muted); font-size:12px; cursor:pointer; text-decoration:underline; font-family:'DM Sans',sans-serif; }

  .warn-box { background:#FFF8F0; border:1px solid #F0D5B0; border-radius:12px; padding:14px 18px; margin-bottom:16px; font-size:12px; color:#7A5228; line-height:1.5; display:flex; gap:10px; }

  @media (max-width:560px) {
    .gate-card { padding:36px 24px; }
    .edu-grid { grid-template-columns:1fr; }
    .form-row-two { grid-template-columns:1fr; }
    .form-row-three { grid-template-columns:1fr 1fr; }
    .grocery-grid { grid-template-columns:1fr; }
    .meal-item { grid-template-columns:60px 1fr; }
    .meal-cal { display:none; }
    .calorie-row { grid-template-columns:1fr 1fr; }
  }
`;

const STEPS = ["Profile","Learn","Meal Plan","Groceries","Next Step"];
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
      <div className="medical-banner-icon">🩺</div>
      <p><strong>Medical disclaimer:</strong> This tool is for general wellness support only and is not a substitute for medical advice. Always follow the guidance of your doctor or healthcare provider — especially regarding your GLP-1 medication, nutrition needs, and any existing health conditions. Calorie estimates are approximations based on the Mifflin-St Jeor equation. Individual results vary significantly.</p>
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
        <div className="gate-icon">🌿</div>
        <h1>GLP-1 <em>Bridge</em><br/>Program</h1>
        <p>Enter your access code from your purchase confirmation email to get started.</p>
        <input className={`gate-input${error?" error":""}`} placeholder="Enter code" value={code}
          onChange={e=>{ setCode(e.target.value); setError(false); }}
          onKeyDown={e=>e.key==="Enter"&&handleSubmit()} maxLength={20} />
        {error && <p className="gate-error">That code doesn't look right. Check your confirmation email and try again.</p>}
        <button className="btn btn-primary" onClick={handleSubmit} disabled={!code.trim()}>Unlock My Plan →</button>
        <p className="gate-note">Don't have a code yet? <a href={THIRTY_DAYS_LINK} target="_blank" rel="noreferrer">Get access here for $17 →</a></p>
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
    const n = calculateNutrition(
      parseFloat(profile.weight), profile.heightFt, profile.heightIn,
      profile.age, profile.sex, profile.physicalJob
    );
    setNutrition(n);
    setStep(1);
  };

  const generatePlan = async () => {
    setLoading(true); setError("");
    const n = nutrition || calculateNutrition(
      parseFloat(profile.weight), profile.heightFt, profile.heightIn,
      profile.age, profile.sex, profile.physicalJob
    );
    try {
      const prompt = `You are a registered dietitian creating a medically responsible 7-day meal plan for a GLP-1 medication candidate.

Patient stats:
- Height: ${profile.heightFt}ft ${profile.heightIn}in | Weight: ${profile.weight}lbs | Age: ${profile.age} | Sex: ${profile.sex}
- Activity baseline: ${profile.physicalJob ? "light (physically demanding job)" : "sedentary (conservative baseline)"}
- Estimated TDEE: ${n.tdee} calories/day
- TARGET daily calories: ${n.targetCals} (conservative 500-calorie deficit for ~0.5–1lb/week loss)
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
3. Meals must be genuinely appetizing — steak chimichurri with black beans, Greek turkey bowls with tzatziki and feta, baked or sautéed salmon with lemon and herbs, cottage cheese and berry bowls with chia seeds, burger bowls without the bun, sweet potato and ground beef skillets, tuna avocado lettuce wraps, chicken salad with grapes and Greek yogurt dressing, garbanzo bean and roasted veggie bowls, shrimp stir fry with cauliflower rice. Real food people want to eat — not bland diet food.
4. No soy sauce if soy is in avoid list — use coconut aminos, lemon, herbs, red wine vinegar instead
5. Use beans, chia seeds, and vegetables generously for fiber
6. Be precise with calorie and protein counts — verify each meal adds up correctly
7. Distribute calories roughly: breakfast 22%, lunch 30%, snack 13%, dinner 35%
8. Distribute protein roughly: breakfast 25%, lunch 30%, snack 12%, dinner 33%

Respond ONLY in valid JSON with no markdown, no preamble:
{"weeklyCalories":${n.targetCals},"weeklyProtein":${n.targetProtein},"days":[{"day":"Monday","meals":{"breakfast":{"name":"...","description":"...","calories":0,"protein":0},"lunch":{"name":"...","description":"...","calories":0,"protein":0},"snack":{"name":"...","description":"...","calories":0,"protein":0},"dinner":{"name":"...","description":"...","calories":0,"protein":0}}}],"grocery":{"Proteins":["..."],"Produce":["..."],"Dairy & Eggs":["..."],"Pantry & Canned":["..."],"Spices & Condiments":["..."]}}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
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
          <div className="hero-badge">🌿 GLP-1 Bridge Program</div>
          <h1>Start <em>Before</em><br/>Your Medication Arrives</h1>
          <p>A personalized whole foods plan for people waiting on GLP-1 approval. Your body is ready when you are.</p>
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
                <p className="section-title">Your profile</p>
                <p className="section-sub">We use the Mifflin-St Jeor equation to calculate your personal calorie targets. Age and biological sex are required for an accurate result.</p>

                <div className="form-row-three">
                  <div className="form-row"><label className="form-label">Height (ft)</label><input className="form-input" type="number" placeholder="5" value={profile.heightFt} onChange={e=>setProfile(p=>({...p,heightFt:e.target.value}))} /></div>
                  <div className="form-row"><label className="form-label">Height (in)</label><input className="form-input" type="number" placeholder="6" value={profile.heightIn} onChange={e=>setProfile(p=>({...p,heightIn:e.target.value}))} /></div>
                  <div className="form-row"><label className="form-label">Age</label><input className="form-input" type="number" placeholder="35" value={profile.age} onChange={e=>setProfile(p=>({...p,age:e.target.value}))} /></div>
                </div>

                <div className="form-row-two">
                  <div className="form-row"><label className="form-label">Current weight (lbs)</label><input className="form-input" type="number" placeholder="276" value={profile.weight} onChange={e=>setProfile(p=>({...p,weight:e.target.value}))} /></div>
                  <div className="form-row"><label className="form-label">Goal weight (lbs)</label><input className="form-input" type="number" placeholder="230" value={profile.goalWeight} onChange={e=>setProfile(p=>({...p,goalWeight:e.target.value}))} /></div>
                </div>

                <div className="form-row">
                  <label className="form-label">Biological sex (used for calorie calculation only)</label>
                  <div className="tag-group">
                    {["female","male"].map(s=><Tag key={s} label={s.charAt(0).toUpperCase()+s.slice(1)} selected={profile.sex===s} onToggle={()=>setProfile(p=>({...p,sex:s}))} />)}
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">Job type</label>
                  <div className={`physical-job-toggle${profile.physicalJob?" selected":""}`}
                    onClick={()=>setProfile(p=>({...p,physicalJob:!p.physicalJob}))}>
                    <div className="physical-job-checkbox">{profile.physicalJob?"✓":""}</div>
                    <div className="physical-job-text">
                      <h5>My job is physically demanding</h5>
                      <p>Check this only if your work involves sustained physical labor — construction, nursing, warehouse, landscaping, etc. Office work, driving, retail standing, and light walking do not qualify.</p>
                    </div>
                  </div>
                </div>

                <div className="why-conservative">
                  <div className="why-conservative-icon">💡</div>
                  <div>
                    <h4>Why we default to sedentary</h4>
                    <p>Most people significantly overestimate their daily movement. "Going to the gym twice a week" or "being on your feet at work" does not change your baseline calorie burn the way most people assume. We calculate conservatively so your deficit is real — not theoretical. Your doctor can always adjust upward if needed.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <p className="section-title">Food preferences</p>
                <p className="section-sub">Select everything that appeals to you. Your plan will be built around these.</p>
                <div className="form-row"><label className="form-label">Proteins you enjoy</label><div className="tag-group">{PROTEIN_OPTS.map(o=><Tag key={o} label={o} selected={profile.proteins.includes(o)} onToggle={()=>toggleTag("proteins",o)} />)}</div></div>
                <div className="form-row"><label className="form-label">Complex carbs</label><div className="tag-group">{CARB_OPTS.map(o=><Tag key={o} label={o} selected={profile.carbs.includes(o)} onToggle={()=>toggleTag("carbs",o)} />)}</div></div>
                <div className="form-row"><label className="form-label">Foods to avoid</label><div className="tag-group">{AVOID_OPTS.map(o=><Tag key={o} label={o} selected={profile.avoid.includes(o)} onToggle={()=>toggleTag("avoid",o)} />)}</div></div>
                <div className="form-row"><label className="form-label">Cooking style</label><div className="tag-group">{COOKING_OPTS.map(o=><Tag key={o} label={o} selected={profile.cooking.includes(o)} onToggle={()=>toggleTag("cooking",o)} />)}</div></div>
                <div className="form-row"><label className="form-label">Anything else we should know?</label><textarea className="form-input" rows={2} placeholder="e.g. high blood pressure, hate mushrooms, cooking for a family..." style={{resize:"vertical"}} value={profile.notes} onChange={e=>setProfile(p=>({...p,notes:e.target.value}))} /></div>
              </div>

              {!canContinue && <p style={{textAlign:"center",color:"var(--muted)",fontSize:12,marginBottom:10}}>Enter your height, weight, age, and at least one protein preference to continue.</p>}
              <button className="btn btn-primary" disabled={!canContinue} onClick={handleContinueToLearn}>Continue →</button>
            </div>
          )}

          {/* STEP 1 — EDUCATION */}
          {step===1 && nutrition && (
            <div>
              <MedicalBanner />
              <div className="calorie-card">
                <h4>🧮 Your personalized targets</h4>
                <div className="calorie-row">
                  <div className="calorie-stat">
                    <div className="calorie-stat-num">{nutrition.tdee}</div>
                    <div className="calorie-stat-label">Maintenance</div>
                  </div>
                  <div className="calorie-stat">
                    <div className="calorie-stat-num">{nutrition.targetCals}</div>
                    <div className="calorie-stat-label">Your target</div>
                  </div>
                  <div className="calorie-stat">
                    <div className="calorie-stat-num">{nutrition.targetProtein}g</div>
                    <div className="calorie-stat-label">Protein / day</div>
                  </div>
                </div>
                <p className="calorie-note">Your meal plan will be built to hit {nutrition.targetCals} calories and {nutrition.targetProtein}g of protein daily — a conservative 500-calorie deficit from your estimated maintenance. These are starting estimates based on the Mifflin-St Jeor equation. Your doctor may advise different targets based on your full health picture.</p>
              </div>

              <div className="card">
                <p className="section-title">What you need to know</p>
                <p className="section-sub">Here's what the evidence actually says — no hype, no promises.</p>
                <div className="edu-grid">
                  {[
                    ["💉","What are GLP-1s?","Medications like Ozempic and Wegovy that work with your body's gut hormones to reduce appetite and slow digestion. They're most effective when paired with sustainable diet changes."],
                    ["⏳","Why act now?","Insurance approval can take weeks or longer. Starting whole foods habits now means you arrive to your medication having already built a foundation."],
                    ["🍽️","What GLP-1s do","They reduce hunger significantly. Building your eating habits before the medication arrives means you'll be ready to work with it from day one."],
                    ["💪","Protect your muscle","Adequate protein during fat loss helps preserve muscle mass. This plan prioritizes hitting your protein target every single day."]
                  ].map(([icon,title,desc])=>(
                    <div className="edu-card" key={title}><div className="edu-icon">{icon}</div><h4>{title}</h4><p>{desc}</p></div>
                  ))}
                </div>

                <div className="info-box">
                  <h4>📉 Honest expectations — because you deserve the truth</h4>
                  <p style={{marginBottom:8}}>A 500-calorie daily deficit is designed for approximately 0.5–1 lb of fat loss per week. Here's what that realistically looks like:</p>
                  <ul>
                    <li><strong>First 1–2 weeks:</strong> You may see a larger initial drop from water weight as you reduce processed foods and sodium. This is temporary and not pure fat loss.</li>
                    <li><strong>Ongoing:</strong> 0.5–1 lb of actual fat loss per week with consistency. Over a month that may be 4–6 lbs of fat — meaningful, sustainable progress.</li>
                    <li><strong>The real goal right now:</strong> Building the habits and baseline your medication can amplify when it arrives.</li>
                  </ul>
                  <p style={{marginTop:10,fontStyle:"italic"}}>Anyone promising dramatic rapid results from diet alone is not being straight with you. Slow and steady is not a consolation prize — it's how lasting change actually works.</p>
                </div>

                <div className="info-box">
                  <h4>🥦 The foundations that actually drive results</h4>
                  <ul>
                    <li><strong>Protein first</strong> at every meal — supports fullness and muscle preservation</li>
                    <li><strong>Whole foods only</strong> — if it has 15 ingredients, skip it</li>
                    <li><strong>Fiber manages hunger</strong> — beans, chia seeds, non-starchy vegetables</li>
                    <li><strong>Movement matters</strong> — even a 20–30 min daily walk supports progress meaningfully</li>
                    <li><strong>Water first</strong> — 80–100oz daily; thirst often masquerades as hunger</li>
                    <li><strong>Sleep is not optional</strong> — poor sleep significantly disrupts hunger hormones and fat loss</li>
                  </ul>
                </div>
              </div>

              <button className="btn btn-primary" onClick={generatePlan} disabled={loading}>
                {loading?"Building your plan...":"✨ Generate My Personalized Meal Plan"}
              </button>
              {loading && <div className="loading-wrap"><div className="spinner"/><h3>Building your plan...</h3><p>Calculating meals to match your exact targets</p></div>}
              {error && <p style={{color:"var(--coral)",textAlign:"center",marginTop:12,fontSize:13}}>{error}</p>}
              <div style={{marginTop:12}}><button className="btn btn-outline btn-sm" onClick={()=>setStep(0)}>← Back</button></div>
            </div>
          )}

          {/* STEP 2 — MEAL PLAN */}
          {step===2 && mealPlan && (
            <div>
              <div className="card">
                <p className="section-title">Your 7-day meal plan</p>
                <p className="section-sub">Built to hit your personal calorie and protein targets. Repeat for the full month.</p>
                <div className="month-banner">
                  <div className="month-banner-icon">🔁</div>
                  <div>
                    <h4>This 7-day rotation is your full 30-day plan</h4>
                    <p>Repeat it 4 times. Consistency over variety is what moves the needle. Removing daily food decisions is one of the most underrated tools for follow-through.</p>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                  <div style={{background:"var(--warm)",borderRadius:12,padding:16,textAlign:"center"}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:26,color:"var(--forest)",fontWeight:700}}>{mealPlan.weeklyCalories}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:3,textTransform:"uppercase",letterSpacing:"0.5px"}}>Target cal / day</div>
                  </div>
                  <div style={{background:"var(--warm)",borderRadius:12,padding:16,textAlign:"center"}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:26,color:"var(--forest)",fontWeight:700}}>{mealPlan.weeklyProtein}g</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:3,textTransform:"uppercase",letterSpacing:"0.5px"}}>Target protein / day</div>
                  </div>
                </div>
                <MedicalBanner />
                {mealPlan.days.map((day,di)=>(
                  <div className="meal-day" key={di}>
                    <div className="meal-day-header">
                      <span>{day.day}</span>
                      <span>{Object.values(day.meals).reduce((a,m)=>a+(m.calories||0),0)} cal · {Object.values(day.meals).reduce((a,m)=>a+(m.protein||0),0)}g protein</span>
                    </div>
                    {["breakfast","lunch","snack","dinner"].map(type=>day.meals[type]&&(
                      <div className="meal-item" key={type}>
                        <div className="meal-label">{type}</div>
                        <div><div className="meal-name">{day.meals[type].name}</div><div className="meal-desc">{day.meals[type].description}</div></div>
                        <div className="meal-cal">{day.meals[type].calories} cal<br/><span style={{color:"var(--sage)"}}>{day.meals[type].protein}g</span></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn btn-outline btn-sm" onClick={()=>setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{flex:1,marginTop:0}} onClick={()=>setStep(3)}>View Grocery List →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — GROCERY */}
          {step===3 && groceryList && (
            <div>
              <div className="card">
                <p className="section-title">Your grocery list</p>
                <p className="section-sub">Everything you need for the week. Tap items to check them off as you shop.</p>
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
                <div className="warn-box" style={{marginTop:16}}><span>💡</span><span>Check sodium on all packaged items. Aim for under 150mg per serving — especially important if you have high blood pressure or are managing a cardiovascular condition.</span></div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn btn-outline btn-sm" onClick={()=>setStep(2)}>← Meal Plan</button>
                <button className="btn btn-primary" style={{flex:1,marginTop:0}} onClick={()=>setStep(4)}>See What's Next →</button>
              </div>
            </div>
          )}

          {/* STEP 4 — UPSELL */}
          {step===4 && (
            <div>
              <div className="upsell-hero">
                <div className="upsell-badge">⭐ Ready for the next step?</div>
                <h2>You have the plan.<br/>Now build the <em>habits</em>.</h2>
                <p>The meal plan tells you what to eat. 30 Days to Stable addresses why you stop — and how to keep going anyway.</p>
                <div className="upsell-price">
                  <span className="amount">$47</span>
                  <span className="period">one time</span>
                </div>
              </div>
              <div className="card">
                <p className="section-title" style={{fontSize:20}}>What's inside 30 Days to Stable</p>
                <div style={{marginBottom:20}}>
                  {[
                    ["🧠","Daily behavioral prompts","30 days of guided check-ins that address the thoughts, patterns, and reflexes that derail progress — not just the food."],
                    ["📋","Habit tracking system","Simple daily tracking that builds awareness without obsession. You can't change what you don't see."],
                    ["🔄","The On Purpose Loop™","A framework for spotting self-sabotage before it happens and interrupting it with small, doable actions."],
                    ["💬","Tiny Savage Promises™","A daily commitment practice that builds follow-through — the thing the meal plan alone can't give you."],
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
                  <button className="btn btn-coral">Get 30 Days to Stable — $47 →</button>
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
