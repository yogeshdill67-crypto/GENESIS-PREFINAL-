import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveLastAnalysis, updateAuth } from '../data/store'

const DOMAINS = [
  {
    id:"programming", name:"Programming & Software Dev", emoji:"💻",
    roles:["Full Stack Developer","Backend Developer","Software Engineer","React Developer"],
    entry:"₹3.5–8L", mid:"₹10–22L", demand:"High",
    skills:["Python","React","Node.js","Java","JavaScript","Algorithms","Git","REST APIs"],
    scoreRules: {
      streamBonus:   { cs:30, ece:10, science:5 },
      skillBonus:    { programming:25, math:10, data:10, ai:8, cloud:5, iot:5 },
      interestBonus: { startup:10, remote:10, corporate:8, highpay:8, freelance:5 },
      styleBonus:    { analytical:10, tech_heavy:12, solo:8, handson:5 },
      personalityBonus:{ logical:12, curious:8, detail:8, entrepreneur_p:5 },
      eduBonus:      { btech:10, mtech:10, diploma:5 },
      expBonus:      { fresher:0, junior:5, mid:8, senior:10 },
    }
  },
  {
    id:"data_ai", name:"Data Science & AI / ML", emoji:"🤖",
    roles:["Data Scientist","ML Engineer","AI Researcher","Data Analyst"],
    entry:"₹4–10L", mid:"₹12–28L", demand:"High",
    skills:["Python","TensorFlow","SQL","Statistics","Pandas","Deep Learning","NLP"],
    scoreRules: {
      streamBonus:   { cs:28, ece:12, science:15, commerce:5 },
      skillBonus:    { ai:30, data:25, programming:15, math:20, physics:8 },
      interestBonus: { research:12, highpay:10, startup:8, corporate:8 },
      styleBonus:    { analytical:15, tech_heavy:12, solo:8 },
      personalityBonus:{ logical:15, curious:15, detail:8 },
      eduBonus:      { btech:10, mtech:15, phd:18, bsc:8 },
      expBonus:      { fresher:0, junior:5, mid:10, senior:12 },
    }
  },
  {
    id:"cloud_devops", name:"Cloud & DevOps", emoji:"☁️",
    roles:["DevOps Engineer","Cloud Architect","SRE","Platform Engineer"],
    entry:"₹5–10L", mid:"₹14–30L", demand:"High",
    skills:["AWS","Docker","Kubernetes","Linux","CI/CD","Terraform","Python"],
    scoreRules: {
      streamBonus:   { cs:22, ece:8, other:3 },
      skillBonus:    { cloud:30, programming:18, iot:8, data:5, security:8 },
      interestBonus: { remote:12, corporate:10, highpay:10, startup:8 },
      styleBonus:    { analytical:10, tech_heavy:15, structured:10, fastpaced:5 },
      personalityBonus:{ logical:12, detail:10, curious:8 },
      eduBonus:      { btech:10, diploma:6, mtech:12 },
      expBonus:      { fresher:0, junior:8, mid:12, senior:15 },
    }
  },
  {
    id:"cybersecurity", name:"Cybersecurity", emoji:"🛡️",
    roles:["Cybersecurity Analyst","Ethical Hacker","Security Consultant","SOC Analyst"],
    entry:"₹4–8L", mid:"₹10–25L", demand:"High",
    skills:["Kali Linux","Pen Testing","Firewalls","Python","CEH","Network Security"],
    scoreRules: {
      streamBonus:   { cs:22, ece:10 },
      skillBonus:    { security:35, programming:12, cloud:10, electronics:5, iot:8 },
      interestBonus: { highpay:8, corporate:8, remote:8, govt:10 },
      styleBonus:    { analytical:12, tech_heavy:12, solo:8, fastpaced:8 },
      personalityBonus:{ logical:12, detail:15, curious:10 },
      eduBonus:      { btech:10, diploma:5 },
      expBonus:      { fresher:0, junior:5, mid:10, senior:12 },
    }
  },
  {
    id:"embedded_iot", name:"Embedded Systems & IoT", emoji:"⚙️",
    roles:["Embedded Engineer","IoT Developer","Firmware Engineer","RTOS Developer"],
    entry:"₹3–7L", mid:"₹8–20L", demand:"High",
    skills:["C/C++","RTOS","Arduino","ESP32","PCB Design","Python","Microcontrollers"],
    scoreRules: {
      streamBonus:   { ece:30, eee:20, cs:12, mech:5 },
      skillBonus:    { iot:35, electronics:28, programming:15, physics:10, mechanical:5 },
      interestBonus: { startup:10, handson:8, govt:5, research:8 },
      styleBonus:    { handson:15, analytical:10, tech_heavy:12, structured:8 },
      personalityBonus:{ logical:12, detail:15, curious:10 },
      eduBonus:      { btech:12, diploma:10, mtech:10 },
      expBonus:      { fresher:0, junior:5, mid:8, senior:10 },
    }
  },
  {
    id:"vlsi_semiconductor", name:"VLSI & Semiconductor", emoji:"🔬",
    roles:["VLSI Design Engineer","Chip Design Engineer","Process Engineer","Test Engineer"],
    entry:"₹3.5–8L", mid:"₹10–24L", demand:"High",
    skills:["Verilog","VHDL","Cadence","MATLAB","FPGA","Semiconductor Physics","SPICE"],
    scoreRules: {
      streamBonus:   { ece:32, eee:18, cs:8, science:10 },
      skillBonus:    { electronics:30, physics:20, math:15, iot:8, programming:8 },
      interestBonus: { research:12, corporate:10, highpay:10 },
      styleBonus:    { analytical:12, tech_heavy:12, structured:10, detail_work:8 },
      personalityBonus:{ logical:15, detail:15, curious:12 },
      eduBonus:      { btech:12, mtech:18, phd:20 },
      expBonus:      { fresher:0, junior:5, mid:8, senior:12 },
    }
  },
  {
    id:"design_ux", name:"UI/UX & Product Design", emoji:"🎨",
    roles:["UI/UX Designer","Product Designer","Visual Designer","Design Lead"],
    entry:"₹3–6L", mid:"₹8–20L", demand:"High",
    skills:["Figma","Adobe XD","Prototyping","User Research","Wireframing","Typography"],
    scoreRules: {
      streamBonus:   { design:35, cs:12, arts:15, science:5 },
      skillBonus:    { design:35, programming:10, writing:8, marketing:5 },
      interestBonus: { startup:12, remote:10, creative:15, freelance:10 },
      styleBonus:    { creative_work:20, people:10, analytical:5, solo:8 },
      personalityBonus:{ creative_p:20, detail:10, communicator:8, empathetic:8 },
      eduBonus:      { btech:5, bsc:8, diploma:8 },
      expBonus:      { fresher:0, junior:5, mid:8, senior:10 },
    }
  },
  {
    id:"management", name:"Product & Project Management", emoji:"📊",
    roles:["Product Manager","Business Analyst","Scrum Master","Project Manager"],
    entry:"₹5–14L", mid:"₹15–40L", demand:"High",
    skills:["Agile","SQL","Analytics","Roadmapping","JIRA","Stakeholder Management"],
    scoreRules: {
      streamBonus:   { cs:15, commerce:18, mba:25, bsc:8, arts:8 },
      skillBonus:    { management:30, data:12, programming:8, economics:10, marketing:8 },
      interestBonus: { corporate:15, startup:12, highpay:10, entrepreneur:10 },
      styleBonus:    { people:15, structured:12, fastpaced:10, analytical:8 },
      personalityBonus:{ leader:20, communicator:15, logical:10, entrepreneur_p:10 },
      eduBonus:      { mba:20, btech:10, bsc:8 },
      expBonus:      { fresher:0, junior:5, mid:12, senior:18 },
    }
  },
  {
    id:"finance", name:"Finance, BFSI & FinTech", emoji:"💰",
    roles:["Financial Analyst","Investment Banker","FinTech Developer","Risk Analyst"],
    entry:"₹4–10L", mid:"₹12–40L", demand:"High",
    skills:["Excel","Financial Modelling","Python","Bloomberg","CFA","Risk Analysis"],
    scoreRules: {
      streamBonus:   { commerce:32, mba:28, cs:10, science:8, arts:5 },
      skillBonus:    { economics:30, math:18, data:12, programming:8, management:8 },
      interestBonus: { highpay:15, corporate:12, startup:8, entrepreneur:8 },
      styleBonus:    { analytical:15, structured:12, fastpaced:10, detail_work:8 },
      personalityBonus:{ logical:15, detail:12, entrepreneur_p:10, leader:8 },
      eduBonus:      { mba:20, commerce:15, bsc:8, btech:8 },
      expBonus:      { fresher:0, junior:5, mid:10, senior:15 },
    }
  },
  {
    id:"marketing", name:"Digital Marketing & Growth", emoji:"📣",
    roles:["Digital Marketing Manager","SEO Specialist","Content Strategist","Growth Hacker"],
    entry:"₹2.5–6L", mid:"₹7–18L", demand:"High",
    skills:["SEO","Google Ads","Meta Ads","Analytics","Content Strategy","Email Marketing"],
    scoreRules: {
      streamBonus:   { commerce:18, arts:20, cs:8, mba:15 },
      skillBonus:    { marketing:35, writing:20, data:10, management:8, economics:8 },
      interestBonus: { startup:12, remote:10, freelance:12, creative:10, entrepreneur:8 },
      styleBonus:    { creative_work:12, people:12, analytical:8, fastpaced:8 },
      personalityBonus:{ communicator:20, creative_p:12, entrepreneur_p:10, leader:8 },
      eduBonus:      { mba:15, bsc:8, arts:10, diploma:5 },
      expBonus:      { fresher:0, junior:5, mid:8, senior:10 },
    }
  },
  {
    id:"aerospace", name:"Aerospace & Space Technology", emoji:"🚀",
    roles:["Aerospace Engineer","Drone/UAV Engineer","Propulsion Engineer","Systems Analyst"],
    entry:"₹4–8L", mid:"₹10–24L", demand:"Medium",
    skills:["CATIA","ANSYS","MATLAB","CFD","Orbital Mechanics","Systems Engineering"],
    scoreRules: {
      streamBonus:   { aero:40, mech:20, ece:10, science:15, eee:8 },
      skillBonus:    { space:35, physics:20, math:18, mechanical:15, electronics:8, iot:5 },
      interestBonus: { research:15, govt:10, highpay:5 },
      styleBonus:    { analytical:12, tech_heavy:12, structured:10, handson:8 },
      personalityBonus:{ logical:15, curious:15, detail:10 },
      eduBonus:      { btech:12, mtech:18, phd:20 },
      expBonus:      { fresher:0, junior:5, mid:8, senior:12 },
    }
  },
  {
    id:"biotech", name:"Biotech, Pharma & Healthcare", emoji:"🧬",
    roles:["Bioinformatics Engineer","Clinical Research Associate","Biomedical Engineer","Pharma Analyst"],
    entry:"₹3–7L", mid:"₹8–18L", demand:"Medium",
    skills:["Python","R","PCR","GCP","HPLC","Lab Techniques","Medical Devices"],
    scoreRules: {
      streamBonus:   { chem:28, medical:35, science:20, ece:5 },
      skillBonus:    { biology:35, chemistry:25, data:10, healthcare:30, programming:5, math:8 },
      interestBonus: { research:15, social:12, govt:8, corporate:8 },
      styleBonus:    { analytical:12, structured:10, handson:12, impact:15 },
      personalityBonus:{ curious:15, detail:15, empathetic:12, logical:10 },
      eduBonus:      { btech:10, mtech:15, phd:20, bsc:12 },
      expBonus:      { fresher:0, junior:5, mid:8, senior:12 },
    }
  },
  {
    id:"mechanical", name:"Mechanical & Manufacturing", emoji:"🔧",
    roles:["Mechanical Engineer","CAD Designer","Production Engineer","Quality Engineer"],
    entry:"₹3–6L", mid:"₹7–16L", demand:"Medium",
    skills:["AutoCAD","CATIA","SolidWorks","GD&T","LEAN","Six Sigma","Thermodynamics"],
    scoreRules: {
      streamBonus:   { mech:40, aero:12, civil:5, eee:5 },
      skillBonus:    { mechanical:35, physics:18, math:12, iot:5, electronics:5 },
      interestBonus: { govt:10, corporate:10, research:8 },
      styleBonus:    { handson:18, structured:12, outdoor:8, analytical:8 },
      personalityBonus:{ detail:15, logical:12, curious:8 },
      eduBonus:      { btech:12, diploma:10, mtech:15 },
      expBonus:      { fresher:0, junior:5, mid:8, senior:12 },
    }
  },
  {
    id:"freelancing", name:"Freelancing & Remote Work", emoji:"🌍",
    roles:["Freelance Developer","Freelance Designer","Freelance Analyst","Digital Nomad"],
    entry:"₹2–6L", mid:"₹8–25L", demand:"High",
    skills:["Niche Expertise","Client Communication","Portfolio Building","Upwork/Fiverr","Self-Marketing"],
    scoreRules: {
      streamBonus:   { cs:8, design:10, arts:10, commerce:8 },
      skillBonus:    { programming:10, design:10, marketing:10, writing:12, data:8 },
      interestBonus: { freelance:35, remote:20, entrepreneur:15, creative:10 },
      styleBonus:    { solo:20, creative_work:10, fastpaced:8, impact:5 },
      personalityBonus:{ entrepreneur_p:18, creative_p:12, communicator:10, leader:8 },
      eduBonus:      { diploma:8, bsc:5, btech:5 },
      expBonus:      { fresher:5, junior:8, mid:10, senior:12 },
    }
  },
  {
    id:"civil_services", name:"Civil Services & Government", emoji:"🏛️",
    roles:["IAS / IPS Officer","State PSC Officer","Defence Officer","PSU Engineer"],
    entry:"₹5–8L", mid:"₹10–18L", demand:"High",
    skills:["UPSC/State PSC Prep","Current Affairs","Essay Writing","Law Basics","Leadership"],
    scoreRules: {
      streamBonus:   { arts:20, commerce:12, science:10, medical:8, cs:5 },
      skillBonus:    { law:25, writing:15, management:12, economics:12, math:5 },
      interestBonus: { govt:35, social:15, research:8 },
      styleBonus:    { structured:15, people:12, impact:15, outdoor:8 },
      personalityBonus:{ leader:20, communicator:15, empathetic:10, logical:8 },
      eduBonus:      { arts:10, mba:8, bsc:8, btech:5 },
      expBonus:      { fresher:5, junior:8, mid:8, senior:5 },
    }
  },
  {
    id:"law_legal", name:"Law & Legal Tech", emoji:"⚖️",
    roles:["Corporate Lawyer","Legal Tech Analyst","Legal Advisor","Compliance Officer"],
    entry:"₹4–10L", mid:"₹15–40L", demand:"High",
    skills:["Corporate Law","Contract Drafting","Legal Research","M&A","Compliance","SEBI"],
    scoreRules: {
      streamBonus:   { arts:30, commerce:18, cs:8 },
      skillBonus:    { law:40, writing:18, economics:12, management:8, data:5 },
      interestBonus: { corporate:15, highpay:10, social:10 },
      styleBonus:    { analytical:12, structured:15, people:10, solo:5 },
      personalityBonus:{ logical:15, detail:12, communicator:12, leader:8 },
      eduBonus:      { arts:15, mba:10, bsc:5 },
      expBonus:      { fresher:0, junior:5, mid:10, senior:15 },
    }
  },
  {
    id:"teaching", name:"Teaching & Academia", emoji:"📚",
    roles:["Professor","Research Scientist","EdTech Creator","School Teacher"],
    entry:"₹3–6L", mid:"₹7–15L", demand:"Medium",
    skills:["Subject Expertise","Communication","Curriculum Design","Research","Content Creation"],
    scoreRules: {
      streamBonus:   { science:15, arts:15, cs:8, medical:8, commerce:8 },
      skillBonus:    { writing:20, management:8, math:8, biology:8, law:5 },
      interestBonus: { research:20, social:15, govt:10, creative:8 },
      styleBonus:    { people:20, impact:15, structured:10, solo:5 },
      personalityBonus:{ communicator:20, empathetic:15, curious:15, leader:8 },
      eduBonus:      { mtech:15, phd:20, mba:8, bsc:10 },
      expBonus:      { fresher:0, junior:5, mid:10, senior:15 },
    }
  }
];

export default function CareerAdvisor() {
  const navigate = useNavigate()
  const TOTAL_STEPS = 4
  const [currentStep, setCurrentStep] = useState(0)
  
  const [form, setForm] = useState({
    fname: '', age: '', edu: '', stream: '', exp: 'fresher',
    skills: [], interests: [], style: [], personality: '', targetSal: 10, workmode: 'any'
  })
  
  const [error, setError] = useState('')
  const [resultData, setResultData] = useState(null)

  const skillOptions = [
    { val: 'math', label: 'Mathematics' },
    { val: 'physics', label: 'Physics' },
    { val: 'programming', label: 'Programming / Coding' },
    { val: 'biology', label: 'Biology / Life Sciences' },
    { val: 'chemistry', label: 'Chemistry' },
    { val: 'design', label: 'Design & Art' },
    { val: 'economics', label: 'Economics / Finance' },
    { val: 'writing', label: 'Writing / Communication' },
    { val: 'electronics', label: 'Electronics / Circuits' },
    { val: 'data', label: 'Data & Analysis' },
    { val: 'management', label: 'Management / Leadership' },
    { val: 'marketing', label: 'Marketing / Sales' },
    { val: 'law', label: 'Law / Policy' },
    { val: 'healthcare', label: 'Healthcare / Medicine' },
    { val: 'mechanical', label: 'Mechanical / Manufacturing' },
    { val: 'ai', label: 'Artificial Intelligence / ML' },
    { val: 'cloud', label: 'Networking / Cloud / Infra' },
    { val: 'security', label: 'Security / Ethical Hacking' },
    { val: 'iot', label: 'IoT / Embedded Systems' },
    { val: 'space', label: 'Space / Aerospace' }
  ]
  
  const interestOptions = [
    { val: 'remote', label: 'Remote Work' },
    { val: 'startup', label: 'Startups' },
    { val: 'govt', label: 'Government / PSU' },
    { val: 'research', label: 'Research & Academia' },
    { val: 'freelance', label: 'Freelancing' },
    { val: 'corporate', label: 'Corporate MNC' },
    { val: 'entrepreneur', label: 'Entrepreneurship' },
    { val: 'creative', label: 'Creative Fields' },
    { val: 'social', label: 'Social Impact / NGO' },
    { val: 'highpay', label: 'High Salary Priority' }
  ]

  const styleOptions = [
    { val: 'handson', label: 'Hands-on / Practical' },
    { val: 'analytical', label: 'Analytical / Problem Solving' },
    { val: 'creative_work', label: 'Creative / Visual' },
    { val: 'people', label: 'People-facing / Teamwork' },
    { val: 'solo', label: 'Independent / Solo' },
    { val: 'outdoor', label: 'Outdoor / Field Work' },
    { val: 'structured', label: 'Structured / Process-driven' },
    { val: 'fastpaced', label: 'Fast-paced / High pressure' },
    { val: 'impact', label: 'High social / human impact' },
    { val: 'tech_heavy', label: 'Technology-heavy' }
  ]

  function toggleArr(key, val) {
    setForm(prev => {
      const arr = prev[key]
      return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  function validateStep(step) {
    setError('')
    if (step === 0) {
      if (!form.fname.trim()) { setError('Please enter your name.'); return false }
      if (!form.edu) { setError('Please select your qualification.'); return false }
      if (!form.stream) { setError('Please select your stream / branch.'); return false }
    }
    if (step === 1) {
      if (form.skills.length === 0) { setError('Please select at least one skill you enjoy.'); return false }
    }
    return true
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function prevStep() {
    setError('')
    setCurrentStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function computeResults() {
    if (!validateStep(3)) return

    const scored = DOMAINS.map(domain => {
      let score = 0
      const rules = domain.scoreRules

      score += rules.streamBonus[form.stream] || 0
      form.skills.forEach(sk => { score += rules.skillBonus[sk] || 0 })
      form.interests.forEach(int => { score += rules.interestBonus[int] || 0 })
      form.style.forEach(st => { score += rules.styleBonus[st] || 0 })
      score += rules.personalityBonus[form.personality] || 0
      score += rules.eduBonus[form.edu] || 0
      score += rules.expBonus[form.exp] || 0

      const highSalDomains = ['data_ai','cloud_devops','programming','management','finance','law_legal','cybersecurity','vlsi_semiconductor']
      if (form.targetSal >= 20 && highSalDomains.includes(domain.id)) score += 8
      if (form.targetSal <= 8) score += (domain.id === 'freelancing' || domain.id === 'teaching') ? 5 : 0

      return { domain, score }
    })

    scored.sort((a, b) => b.score - a.score)
    const maxScore = scored[0].score

    const top5 = scored.slice(0, 5)
    const top3 = scored.slice(0, 3)

    setResultData({ top3, top5, maxScore, profile: form })
    saveLastAnalysis({ top3, timestamp: Date.now() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleRestart() {
    setForm({
      fname: '', age: '', edu: '', stream: '', exp: 'fresher',
      skills: [], interests: [], style: [], personality: '', targetSal: 10, workmode: 'any'
    })
    setResultData(null)
    setCurrentStep(0)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (resultData) {
      setTimeout(() => {
        document.querySelectorAll('.sb-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%'
        })
      }, 100)
    }
  }, [resultData])

  return (
    <div className="career-advisor-page">
      <div className="page-container">
        
        {/* Header */}
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="skip-btn" onClick={() => navigate('/')}>Skip for now</button>
          </div>
          <div className="logo-tag"><span></span> SMART CAREER MATCHER</div>
          <h1 className="title">Discover Your <em>Ideal Domain</em></h1>
          <p className="subtitle">Answer a few questions — our scoring algorithm instantly finds the best-fit career domains for your profile.</p>
        </div>

        {!resultData ? (
          <>
            {/* Progress */}
            <div className="progress-wrap">
              <div className="progress-steps">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`ps ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}></div>
                ))}
              </div>
              <div className="progress-label">Step {currentStep + 1} of {TOTAL_STEPS}</div>
            </div>

            {/* Form Card */}
            <div className="form-card">
              
              {currentStep === 0 && (
                <div className="step active fade-in">
                  <div className="step-title">👋 About You</div>
                  <div className="step-sub">Let's start with some basic info so we can personalise your results.</div>
                  <div className="grid2">
                    <div className="field">
                      <label>FULL NAME *</label>
                      <input type="text" placeholder="e.g. Yogi Sharma" value={form.fname} onChange={e => setForm({...form, fname: e.target.value})} />
                    </div>
                    <div className="field">
                      <label>AGE</label>
                      <input type="number" placeholder="e.g. 19" min="13" max="60" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid2">
                    <div className="field">
                      <label>HIGHEST QUALIFICATION *</label>
                      <select value={form.edu} onChange={e => setForm({...form, edu: e.target.value})}>
                        <option value="">Select…</option>
                        <option value="10th">10th / SSLC</option>
                        <option value="12th">12th / PUC</option>
                        <option value="diploma">Diploma</option>
                        <option value="btech">B.Tech / B.E.</option>
                        <option value="bsc">B.Sc / B.Com / B.A.</option>
                        <option value="mba">MBA / PGDM</option>
                        <option value="mtech">M.Tech / M.Sc</option>
                        <option value="phd">PhD</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>STREAM / BRANCH *</label>
                      <select value={form.stream} onChange={e => setForm({...form, stream: e.target.value})}>
                        <option value="">Select…</option>
                        <option value="cs">Computer Science / IT</option>
                        <option value="ece">Electronics / ECE</option>
                        <option value="mech">Mechanical Engg</option>
                        <option value="civil">Civil Engg</option>
                        <option value="eee">Electrical / EEE</option>
                        <option value="chem">Chemical / Biotech</option>
                        <option value="aero">Aerospace Engg</option>
                        <option value="science">Pure Science (Physics/Chem/Bio/Math)</option>
                        <option value="commerce">Commerce / Finance / Economics</option>
                        <option value="arts">Arts / Humanities / Law</option>
                        <option value="medical">Medical / Healthcare</option>
                        <option value="design">Design / Architecture</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>WORK EXPERIENCE</label>
                    <select value={form.exp} onChange={e => setForm({...form, exp: e.target.value})}>
                      <option value="fresher">Fresher / Student</option>
                      <option value="junior">0–2 years</option>
                      <option value="mid">2–5 years</option>
                      <option value="senior">5+ years</option>
                    </select>
                  </div>
                  {error && <div className="err-box">{error}</div>}
                  <div className="nav-row" style={{ justifyContent: 'flex-end'}}>
                    <button className="btn-next" onClick={nextStep} style={{ flex: 'none', width: '100%' }}>Next — Skills &amp; Interests →</button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="step active fade-in">
                  <div className="step-title">🧠 Your Strengths</div>
                  <div className="step-sub">Select subjects or skills you genuinely enjoy or are good at. Pick as many as you like.</div>
                  <div className="section-label">SUBJECTS / SKILLS YOU ENJOY</div>
                  <div className="chips-wrap">
                    {skillOptions.map(o => (
                      <div key={o.val} className={`chip ${form.skills.includes(o.val) ? 'on' : ''}`} onClick={() => toggleArr('skills', o.val)}>
                        {o.label}
                      </div>
                    ))}
                  </div>
                  {error && <div className="err-box">{error}</div>}
                  <div className="nav-row">
                    <button className="btn-back" onClick={prevStep}>← Back</button>
                    <button className="btn-next" onClick={nextStep} style={{ flex: 1 }}>Next — Work Style →</button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step active fade-in">
                  <div className="step-title">🎯 Career Goals</div>
                  <div className="step-sub">Tell us what kind of career environment and salary you're targeting.</div>
                  <div className="section-label">CAREER INTERESTS</div>
                  <div className="chips-wrap" style={{ marginBottom: '1.25rem' }}>
                    {interestOptions.map(o => (
                      <div key={o.val} className={`chip ${form.interests.includes(o.val) ? 'on' : ''}`} onClick={() => toggleArr('interests', o.val)}>
                        {o.label}
                      </div>
                    ))}
                  </div>
                  <div className="field">
                    <label>TARGET ANNUAL SALARY — <span style={{color:'var(--accent)', fontWeight: 600}}>₹{form.targetSal} LPA</span></label>
                    <div className="range-row">
                      <span className="muted-text">₹3L</span>
                      <input type="range" min="3" max="100" value={form.targetSal} onChange={e => setForm({...form, targetSal: e.target.value})} />
                      <span className="muted-text">₹100L</span>
                    </div>
                  </div>
                  <div className="field" style={{ marginTop: '0.5rem' }}>
                    <label>PREFERRED WORK MODE</label>
                    <select value={form.workmode} onChange={e => setForm({...form, workmode: e.target.value})}>
                      <option value="any">Any</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>
                  {error && <div className="err-box">{error}</div>}
                  <div className="nav-row">
                    <button className="btn-back" onClick={prevStep}>← Back</button>
                    <button className="btn-next" onClick={nextStep} style={{ flex: 1 }}>Next — Personality →</button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step active fade-in">
                  <div className="step-title">🌟 Working Style</div>
                  <div className="step-sub">Last step! These help us fine-tune your domain match.</div>
                  <div className="section-label">YOU PREFER WORK THAT IS (pick all that fit)</div>
                  <div className="chips-wrap" style={{ marginBottom: '1.25rem' }}>
                    {styleOptions.map(o => (
                      <div key={o.val} className={`chip ${form.style.includes(o.val) ? 'on' : ''}`} onClick={() => toggleArr('style', o.val)}>
                        {o.label}
                      </div>
                    ))}
                  </div>
                  <div className="field">
                    <label>YOUR STRONGEST PERSONALITY TRAIT</label>
                    <select value={form.personality} onChange={e => setForm({...form, personality: e.target.value})}>
                      <option value="">Select…</option>
                      <option value="logical">Logical / Systematic thinker</option>
                      <option value="creative_p">Creative / Imaginative</option>
                      <option value="communicator">Communicator / Influencer</option>
                      <option value="leader">Natural leader / Organiser</option>
                      <option value="detail">Detail-oriented / Perfectionist</option>
                      <option value="curious">Curious / Researcher</option>
                      <option value="entrepreneur_p">Entrepreneurial / Risk-taker</option>
                      <option value="empathetic">Empathetic / Helper</option>
                    </select>
                  </div>
                  {error && <div className="err-box">{error}</div>}
                  <div className="nav-row">
                    <button className="btn-back" onClick={prevStep}>← Back</button>
                    <button className="btn-next" onClick={computeResults} style={{ flex: 1 }}>✦ Find My Domain</button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="result-panel fade-in">
            <div className="result-hero">
              <div className="rh-name">🎯 {resultData.profile.fname}, here are your <em>top career domains</em></div>
              <p>Based on your {resultData.profile.stream.toUpperCase()} background, {resultData.profile.skills.length} selected skills, and career preferences — our algorithm ranked {DOMAINS.length} domains for you.</p>
            </div>

            <div className="insight-box">
              <strong>💡 Algorithm Insight:</strong> Your profile scored <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{Math.round((resultData.top3[0].score / resultData.maxScore) * 100)}% match</span> with <strong style={{ color: 'var(--accent2)' }}>{resultData.top3[0].domain.name}</strong> — driven mainly by your stream ({resultData.profile.stream}), skills in <em>{resultData.profile.skills.slice(0,3).join(', ')}</em>{resultData.profile.interests.length ? `, and interest in ${resultData.profile.interests.slice(0,2).join(' & ')}` : ''}. Explore this domain first!
            </div>

            <div className="match-label">YOUR TOP DOMAIN MATCHES</div>
            <div className="domain-cards">
              {resultData.top3.map((item, i) => {
                const d = item.domain
                const pct = Math.round((item.score / resultData.maxScore) * 100)
                
                const whyParts = []
                const sr = d.scoreRules
                if (sr.streamBonus[form.stream] >= 20) whyParts.push(`Strong match with your ${form.stream.toUpperCase()} background`)
                const matchedSkills = form.skills.filter(s => (sr.skillBonus[s] || 0) >= 10)
                if (matchedSkills.length) whyParts.push(`Your skills in ${matchedSkills.slice(0,2).join(' & ')} align well`)
                if (!whyParts.length) whyParts.push('Good all-round compatibility with your profile')

                return (
                  <div key={d.id} className={`domain-card rank-${i+1}`}>
                    <div className="dc-top">
                      <div className={`dc-rank r${i+1}`}>{['✦','◈','◉'][i]}</div>
                      <div className="dc-name">{d.emoji} {d.name}</div>
                      <div className={`dc-score s${i+1}`}>{pct}% match</div>
                    </div>
                    <div className="dc-roles">Top roles: {d.roles.slice(0,3).join(' · ')}</div>
                    <div className="dc-salary">Salary: {d.entry} (entry) → {d.mid} (mid)</div>
                    <div className="dc-why">{whyParts.slice(0,2).join('. ')}.</div>
                    <div className="tag-row">
                      {d.skills.slice(0,5).map(s => <span key={s} className={`tag t${i+1}`}>{s}</span>)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="match-label" style={{ marginTop: '1.25rem' }}>MATCH SCORE BREAKDOWN</div>
            <div className="score-bar-wrap">
              {resultData.top5.map((item, i) => {
                const pct = Math.round((item.score / resultData.maxScore) * 100)
                const barColors = [
                  'linear-gradient(90deg,var(--accent),#34d399)',
                  'linear-gradient(90deg,var(--accent2),#a5b4fc)',
                  'linear-gradient(90deg,var(--accent3),#fcd34d)',
                  'linear-gradient(90deg,#f472b6,#fb7185)',
                  'linear-gradient(90deg,#60a5fa,#818CF8)'
                ]
                return (
                  <div key={item.domain.id} className="sb-row">
                    <div className="sb-label">{item.domain.emoji} {item.domain.name.split('&')[0].trim()}</div>
                    <div className="sb-track"><div className="sb-fill" style={{ width: '0%', background: barColors[i] }} data-pct={pct}></div></div>
                    <div className="sb-pct" style={{ color: i===0?'var(--accent)':i===1?'var(--accent2)':i===2?'var(--accent3)':'var(--muted)' }}>{pct}%</div>
                  </div>
                )
              })}
            </div>

            <button className="btn-next" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => {
              updateAuth({
                name: form.fname,
                edu: form.edu,
                stream: form.stream,
                exp: form.exp,
                domain: resultData.top3[0].domain.name
              });
              navigate('/');
            }}>Continue to Genesis & Save Profile →</button>
            <button className="restart-btn" style={{ width: '100%' }} onClick={handleRestart}>↺ Start Over / Try Different Answers</button>
          </div>
        )}

      </div>
      <style>{`
        .career-advisor-page {
          --bg: #0A0C10;
          --card: #12151C;
          --border: #1E2330;
          --accent: #6EE7B7;
          --accent2: #818CF8;
          --accent3: #FB923C;
          --text: #E8EAF0;
          --muted: #6B7280;
          --input-bg: #0F1219;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1000;
          overflow-y: auto;
          font-family: 'DM Sans', sans-serif;
        }
        
        .career-advisor-page::before {
          content: ''; position: fixed; inset: 0;
          background: radial-gradient(ellipse 60% 40% at 20% 10%, rgba(110,231,183,.07) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 30% at 80% 80%, rgba(129,140,248,.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .page-container { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

        .header { text-align: center; margin-bottom: 2.5rem; animation: fadeUp .6s ease both; }
        
        .skip-btn {
          background: transparent; border: 1px solid var(--border); color: var(--muted);
          padding: 8px 16px; border-radius: 99px; cursor: pointer; font-size: 13px;
          transition: all 0.2s;
        }
        .skip-btn:hover { background: var(--border); color: var(--text); }

        .logo-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(110,231,183,.08); border: 1px solid rgba(110,231,183,.2);
          border-radius: 99px; padding: 4px 14px; font-size: 12px;
          color: var(--accent); letter-spacing: .05em; margin-bottom: 1.2rem;
        }
        .logo-tag span { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); display: inline-block; animation: pulse 1.5s ease infinite; }
        .title { font-family: 'Syne', sans-serif; font-size: clamp(1.8rem,5vw,2.8rem); font-weight: 800; line-height: 1.1; margin-bottom: .8rem; }
        .title em { font-style: normal; background: linear-gradient(90deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .subtitle { color: var(--muted); font-size: 14px; max-width: 460px; margin: 0 auto; line-height: 1.6; }

        .progress-wrap { margin-bottom: 1.5rem; animation: fadeUp .6s .05s ease both; }
        .progress-steps { display: flex; gap: 4px; margin-bottom: 6px; }
        .ps { flex: 1; height: 3px; border-radius: 99px; background: var(--border); transition: background .3s; }
        .ps.done { background: var(--accent); }
        .ps.active { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
        .progress-label { font-size: 11px; color: var(--muted); text-align: right; }

        .form-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; animation: fadeUp .6s .1s ease both; }

        .fade-in { animation: fadeUp .4s ease both; }
        .step-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: .4rem; }
        .step-sub { font-size: 13px; color: var(--muted); margin-bottom: 1.5rem; line-height: 1.5; }

        .section-label { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .1em; color: var(--muted); text-transform: uppercase; margin-bottom: .75rem; display: flex; align-items: center; gap: 8px; }
        .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
        .field label { font-size: 12px; font-weight: 500; color: var(--muted); letter-spacing: .03em; }
        .field input, .field select, .field textarea { background: var(--input-bg); border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color .2s, box-shadow .2s; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(110,231,183,.08); }
        .field select option { background: #1a1e2a; }

        .chips-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { padding: 7px 15px; border: 1px solid var(--border); border-radius: 99px; font-size: 13px; color: var(--muted); cursor: pointer; background: var(--input-bg); transition: all .15s; user-select: none; }
        .chip:hover { border-color: var(--accent); color: var(--accent); }
        .chip.on { background: rgba(110,231,183,.12); border-color: var(--accent); color: var(--accent); font-weight: 500; }

        .range-row { display: flex; align-items: center; gap: 12px; }
        .range-row input[type=range] { flex: 1; -webkit-appearance: none; height: 4px; background: var(--border); border-radius: 99px; border: none; outline: none; padding: 0; }
        .range-row input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; background: var(--accent); border-radius: 50%; cursor: pointer; box-shadow: 0 0 0 4px rgba(110,231,183,.15); }
        .muted-text { font-size: 12px; color: var(--muted); }

        .nav-row { display: flex; gap: 10px; margin-top: 1.75rem; }
        .btn-back { padding: 12px 20px; border-radius: 12px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all .15s; }
        .btn-back:hover { border-color: var(--accent); color: var(--accent); }
        .btn-next { padding: 13px; border-radius: 12px; border: none; background: linear-gradient(135deg, var(--accent) 0%, #34d399 100%); color: #0A0C10; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; transition: transform .15s, box-shadow .15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-next:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(110,231,183,.25); }
        .btn-next:active { transform: none; }

        .err-box { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); border-radius: 10px; padding: .75rem 1rem; font-size: 13px; color: #F87171; margin-top: 1rem; text-align: left; display: block; }

        .result-panel { animation: fadeUp .5s ease both; }
        .result-hero { background: linear-gradient(135deg, rgba(110,231,183,.1), rgba(129,140,248,.07)); border: 1px solid rgba(110,231,183,.2); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.25rem; text-align: center; }
        .rh-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: .3rem; }
        .rh-name em { font-style: normal; background: linear-gradient(90deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .result-hero p { font-size: 13px; color: var(--muted); }

        .match-label { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .1em; color: var(--muted); text-transform: uppercase; margin-bottom: 1rem; text-align: left; }
        .domain-cards { margin-bottom: 1rem; text-align: left; }

        .domain-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1.1rem 1.25rem; margin-bottom: .75rem; transition: border-color .2s, transform .2s; position: relative; overflow: hidden; }
        .domain-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 3px 0 0 3px; }
        .domain-card.rank-1::before { background: var(--accent); }
        .domain-card.rank-2::before { background: var(--accent2); }
        .domain-card.rank-3::before { background: var(--accent3); }
        .domain-card:hover { border-color: rgba(110,231,183,.3); transform: translateX(4px); }

        .dc-top { display: flex; align-items: center; gap: 10px; margin-bottom: .6rem; }
        .dc-rank { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; }
        .dc-rank.r1 { background: rgba(110,231,183,.15); color: var(--accent); }
        .dc-rank.r2 { background: rgba(129,140,248,.15); color: var(--accent2); }
        .dc-rank.r3 { background: rgba(251,146,60,.15); color: var(--accent3); }
        .dc-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; }
        .dc-score { margin-left: auto; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; }
        .dc-score.s1 { background: rgba(110,231,183,.12); color: var(--accent); }
        .dc-score.s2 { background: rgba(129,140,248,.12); color: var(--accent2); }
        .dc-score.s3 { background: rgba(251,146,60,.12); color: var(--accent3); }

        .dc-roles { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
        .dc-salary { font-size: 12px; font-weight: 600; color: var(--accent); margin-bottom: 8px; }
        .dc-why { font-size: 12px; color: #9CA3AF; line-height: 1.6; margin-bottom: 8px; background: var(--input-bg); border-radius: 8px; padding: 8px 10px; }

        .tag-row { display: flex; flex-wrap: wrap; gap: 5px; }
        .tag { font-size: 11px; padding: 3px 9px; border-radius: 99px; }
        .t1 { background: rgba(110,231,183,.1); color: var(--accent); }
        .t2 { background: rgba(129,140,248,.1); color: var(--accent2); }
        .t3 { background: rgba(251,146,60,.1); color: var(--accent3); }

        .score-bar-wrap { margin-bottom: 1.25rem; }
        .sb-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .sb-label { font-size: 12px; color: var(--muted); width: 130px; flex-shrink: 0; text-align: left; }
        .sb-track { flex: 1; height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }
        .sb-fill { height: 100%; border-radius: 99px; transition: width 1s ease; }
        .sb-pct { font-size: 11px; font-weight: 600; width: 35px; text-align: right; }

        .restart-btn { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; margin-top: 1rem; transition: all .15s; }
        .restart-btn:hover { border-color: var(--accent); color: var(--accent); }

        .insight-box { background: rgba(129,140,248,.06); border: 1px solid rgba(129,140,248,.15); border-radius: 12px; padding: 1rem 1.1rem; margin-bottom: 1.25rem; font-size: 13px; color: #C7D2FE; line-height: 1.7; text-align: left; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }

        @media (max-width: 500px) {
          .grid2 { grid-template-columns: 1fr; }
          .form-card { padding: 1.25rem; }
        }
      `}</style>
    </div>
  )
}
