import React, { useState, useMemo } from 'react';
import { careers } from '../data/store';

const NEW_CATS = [
  "Law & Legal Tech","Architecture & Design","Media & Journalism","Psychology & Counselling",
  "Agriculture & AgriTech","Hospitality & Tourism","Real Estate","Sports & Fitness",
  "Fashion & Textile","Food Technology","Marine Engg","Mining & Metallurgy",
  "Social Work & NGO","Teaching & Academia","Logistics Tech","BFSI / Insurance",
  "FinTech","Wealth Management","Gems & Jewellery","Civil Services","Defence",
  "Nuclear & Atomic Energy","Automobile","Manufacturing","Oil & Gas","Retail & FMCG",
  "Ayurveda & AYUSH","Veterinary Science","Performing Arts & Music","E-commerce",
  "Quantum Computing","Space Technology","Semiconductor","Nanotechnology","Climate Tech",
  "ESG & Sustainability","Telecom & 5G","Care Economy","International Relations",
  "Humanitarian & Aid","PropTech & ConTech","Aviation","Publishing & Print","Personal Care & Beauty"
];

export default function Explore() {
  const [search, setSearch] = useState('');
  const [demand, setDemand] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [activeCat, setActiveCat] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filteredData = useMemo(() => {
    let q = search.toLowerCase();
    let res = careers.filter(d => {
      const matchCat = activeCat === 'All' || d.cat === activeCat;
      const matchQ = !q || (d.name.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q) || d.skills.join(' ').toLowerCase().includes(q));
      const matchDemand = !demand || d.demand === demand;
      return matchCat && matchQ && matchDemand;
    });

    if (sortKey === 'salaryDesc') {
      res.sort((a, b) => parseInt(b.senior?.replace(/[^0-9]/g, '') || 0) - parseInt(a.senior?.replace(/[^0-9]/g, '') || 0));
    } else if (sortKey === 'demand') {
      const demandOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      res.sort((a, b) => (demandOrder[a.demand] || 4) - (demandOrder[b.demand] || 4));
    } else {
      res.sort((a, b) => a.name.localeCompare(b.name));
    }
    return res;
  }, [search, demand, sortKey, activeCat]);

  const totalJobs = careers.length;
  const totalCats = [...new Set(careers.map(d => d.cat))].length;
  const highDemand = careers.filter(d => d.demand === 'High').length;

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '40px' }} className="explore-container">
      <style>{`
        .wrap { padding: 1rem 1rem; max-width: 1200px; margin: 0 auto; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 1.25rem; }
        .sc { border-radius: 8px; padding: .8rem 1rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(30, 41, 59, 0.72); backdrop-filter: blur(8px); }
        .sl { font-size: 11px; color: #94a3b8; margin-bottom: 4px; letter-spacing: .03em; }
        .sv { font-size: 20px; font-weight: 500; color: #fff; }
        .controls { display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap; }
        .controls input { flex: 1; min-width: 180px; height: 40px; padding: 0 12px; border: 0.5px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(0,0,0,0.2); color: #fff; font-size: 14px; outline: none; }
        .controls select { height: 40px; padding: 0 10px; border: 0.5px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(0,0,0,0.2); color: #fff; font-size: 13px; outline: none; }
        .cats { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.25rem; }
        .cat { padding: 4px 12px; border: 0.5px solid rgba(255,255,255,0.1); border-radius: 99px; font-size: 12px; color: #94a3b8; cursor: pointer; background: transparent; transition: all .12s; }
        .cat:hover, .cat.on { background: var(--teal-500, #14b8a6); color: #000; border-color: var(--teal-400, #2dd4bf); }
        .count-bar { font-size: 13px; color: #94a3b8; margin-bottom: .75rem; }
        .count-bar span { font-weight: 500; color: #fff; }
        .table-wrap { border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; margin-bottom: 1.25rem; background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(12px); }
        table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
        thead tr { background: rgba(255,255,255,0.05); }
        th { padding: 10px 12px; text-align: left; font-weight: 500; font-size: 12px; color: #94a3b8; letter-spacing: .03em; border-bottom: 0.5px solid rgba(255,255,255,0.1); }
        td { padding: 9px 12px; border-bottom: 0.5px solid rgba(255,255,255,0.05); color: #fff; vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.03); }
        .badge { display: inline-block; padding: 2px 9px; border-radius: 99px; font-size: 11px; font-weight: 500; }
        .b-high { background: rgba(20, 184, 166, 0.2); color: #2dd4bf; }
        .b-med { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
        .b-low { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .b-cat { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
        .sal-row { display: flex; flex-direction: column; gap: 2px; }
        .sal-exp { font-size: 11px; color: #94a3b8; }
        .sal-val { font-size: 12px; font-weight: 500; color: #fff; }
        .cos { display: flex; flex-wrap: wrap; gap: 4px; }
        .co { font-size: 11px; padding: 2px 7px; background: rgba(255,255,255,0.05); border-radius: 99px; color: #cbd5e1; border: 0.5px solid rgba(255,255,255,0.1); }
        .detail-btn { font-size: 11px; padding: 3px 10px; border: 0.5px solid rgba(255,255,255,0.2); border-radius: 6px; background: transparent; color: #94a3b8; cursor: pointer; }
        .detail-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .expand-row td { background: rgba(0,0,0,0.3); padding: 12px; }
        .exp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px; }
        .exp-card { background: rgba(255,255,255,0.02); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; }
        .exp-label { font-size: 11px; color: #94a3b8; margin-bottom: 3px; }
        .exp-salary { font-size: 14px; font-weight: 500; color: #fff; }
        .exp-yrs { font-size: 11px; color: #94a3b8; }
        .skills-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .sk { font-size: 11px; padding: 2px 8px; background: rgba(45, 212, 191, 0.15); border-radius: 99px; color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.3); }
        .no-results { padding: 2rem; text-align: center; color: #94a3b8; font-size: 14px; }
        .new-badge { font-size: 10px; padding: 1px 6px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-radius: 99px; margin-left: 4px; vertical-align: middle; border: 1px solid rgba(59, 130, 246, 0.4); }
        @media(max-width:600px){ .summary-grid{grid-template-columns:repeat(2,1fr)} .exp-grid{grid-template-columns:1fr} }
        /* Light mode support */
        select option { background: #0f172a; color: #fff; }
        body.light-mode .sc { background: #fff; border-color: #e2e8f0; }
        body.light-mode .sl { color: #64748b; }
        body.light-mode .sv { color: #0f172a; }
        body.light-mode .controls input, body.light-mode .controls select { background: #fff; border-color: #cbd5e1; color: #0f172a; }
        body.light-mode select option { background: #fff; color: #0f172a; }
        body.light-mode .cat { color: #475569; border-color: #cbd5e1; }
        body.light-mode .cat:hover, body.light-mode .cat.on { color: #000; }
        body.light-mode .table-wrap { background: #fff; border-color: #e2e8f0; }
        body.light-mode thead tr { background: #f8fafc; }
        body.light-mode th { color: #475569; border-color: #e2e8f0; }
        body.light-mode td { color: #0f172a; border-color: #e2e8f0; }
        body.light-mode tr:hover td { background: #f1f5f9; }
        body.light-mode .co { background: #f8fafc; border-color: #cbd5e1; color: #475569; }
        body.light-mode .detail-btn { color: #0f172a; border-color: #cbd5e1; }
        body.light-mode .detail-btn:hover { background: #f1f5f9; }
        body.light-mode .expand-row td { background: #f8fafc; }
        body.light-mode .exp-card { background: #fff; border-color: #e2e8f0; }
        body.light-mode .exp-label, body.light-mode .exp-yrs { color: #64748b; }
        body.light-mode .exp-salary { color: #0f172a; }
        body.light-mode .sk { background: #e6fffa; color: #0d9488; }
        body.light-mode .count-bar { color: #475569; }
        body.light-mode .count-bar span { color: #0f172a; }
      `}</style>
      
      <div className="wrap">
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '0.25rem' }}>Career & Domain Explorer</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Explore real-time salary data, key skills, and hiring companies across 100+ roles.
        </p>
        
        <div className="summary-grid">
          <div className="sc"><div className="sl">Total job roles</div><div className="sv">{totalJobs}</div></div>
          <div className="sc"><div className="sl">Categories</div><div className="sv">{totalCats}</div></div>
          <div className="sc"><div className="sl">High demand roles</div><div className="sv">{highDemand}</div></div>
          <div className="sc"><div className="sl">New domains added</div><div className="sv" style={{color: "var(--teal-400, #2dd4bf)"}}>{NEW_CATS.length}</div></div>
        </div>

        <div className="controls">
          <input 
            type="text" 
            placeholder="Search skill or job role..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={demand} onChange={e => setDemand(e.target.value)}>
            <option value="">All demand levels</option>
            <option value="High">High demand</option>
            <option value="Medium">Medium demand</option>
            <option value="Low">Low demand</option>
          </select>
          <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="salaryDesc">Sort: Salary (high)</option>
            <option value="demand">Sort: Demand</option>
          </select>
        </div>

        <div className="cats">
          {["All", ...[...new Set(careers.map(d => d.cat))].sort()].map(c => {
            const isNew = NEW_CATS.includes(c);
            return (
              <span 
                key={c} 
                className={`cat ${activeCat === c ? 'on' : ''}`}
                onClick={() => setActiveCat(c)}
              >
                {c === 'All' ? 'All categories' : c}
                {isNew && <span className="new-badge">new</span>}
              </span>
            );
          })}
        </div>
        
        <div className="count-bar">Showing <span>{filteredData.length}</span> of <span>{totalJobs}</span> roles</div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{width: '21%'}}>Skill / Job role</th>
                <th style={{width: '12%'}}>Category</th>
                <th style={{width: '10%'}}>Demand</th>
                <th style={{width: '27%'}}>Salary by experience</th>
                <th style={{width: '22%'}}>Top companies</th>
                <th style={{width: '8%', textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 && (
                <tr><td colSpan="6"><div className="no-results">No results found.</div></td></tr>
              )}
              {filteredData.map(d => {
                const dc = d.demand === 'High' ? 'b-high' : d.demand === 'Medium' ? 'b-med' : 'b-low';
                const isNew = NEW_CATS.includes(d.cat);
                const cos = d.companies.slice(0, 4);
                const extraCos = d.companies.length - 4;
                const isExpanded = expandedId === d.name;

                return (
                  <React.Fragment key={d.name}>
                    <tr>
                      <td style={{fontWeight: 500, fontSize: '13px'}}>
                        {d.name} {isNew && <span className="new-badge">new</span>}
                      </td>
                      <td><span className="badge b-cat">{d.cat}</span></td>
                      <td><span className={`badge ${dc}`}>{d.demand}</span></td>
                      <td>
                        <div className="sal-row"><div className="sal-exp">Entry (0-2 yrs)</div><div className="sal-val">{d.entry}</div></div>
                        <div className="sal-row" style={{marginTop: '4px'}}><div className="sal-exp">Mid (3-6 yrs)</div><div className="sal-val">{d.mid}</div></div>
                        <div className="sal-row" style={{marginTop: '4px'}}><div className="sal-exp">Senior (7+ yrs)</div><div className="sal-val">{d.senior}</div></div>
                      </td>
                      <td>
                        <div className="cos">
                          {cos.map(c => <span key={c} className="co">{c}</span>)}
                          {extraCos > 0 && <span className="co">+{extraCos}</span>}
                        </div>
                      </td>
                      <td style={{textAlign: 'right'}}>
                        <button 
                          className="detail-btn" 
                          onClick={() => setExpandedId(isExpanded ? null : d.name)}
                        >
                          {isExpanded ? 'Close' : 'Details'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="expand-row">
                        <td colSpan="6">
                          <div className="exp-grid">
                            <div className="exp-card"><div className="exp-label">Entry level (0-2 yrs)</div><div className="exp-salary">{d.entry}</div><div className="exp-yrs">Freshers / Junior</div></div>
                            <div className="exp-card"><div className="exp-label">Mid level (3-6 yrs)</div><div className="exp-salary">{d.mid}</div><div className="exp-yrs">Experienced professional</div></div>
                            <div className="exp-card"><div className="exp-label">Senior level (7+ yrs)</div><div className="exp-salary">{d.senior}</div><div className="exp-yrs">Lead / Architect / Manager</div></div>
                          </div>
                          <div style={{fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)', marginBottom: '5px'}}>
                            Global salary: <strong style={{color: 'var(--color-text-primary, #fff)'}}>{d.global} / year</strong>
                          </div>
                          <div style={{fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)', marginBottom: '6px'}}>
                            All hiring companies:
                          </div>
                          <div className="cos" style={{marginBottom: '10px'}}>
                            {d.companies.map(c => <span key={c} className="co">{c}</span>)}
                          </div>
                          <div style={{fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)', marginBottom: '6px'}}>
                            Key skills required:
                          </div>
                          <div className="skills-row">
                            {d.skills.map(s => <span key={s} className="sk">{s}</span>)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
