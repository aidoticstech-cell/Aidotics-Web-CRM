"use client";

const COORDINATORS = [
  { name: "Neha Patel", leads: 186, converted: 48, rate: 25.8, response: "8 min", stars: 5 },
  { name: "Rahul Sharma", leads: 142, converted: 35, rate: 24.6, response: "12 min", stars: 4 },
  { name: "Amit Verma", leads: 98, converted: 22, rate: 22.4, response: "15 min", stars: 4 },
];

const SOURCES = [
  { name: "Website", pct: 34, color: "#8b5cf6" },
  { name: "Phone Call", pct: 18, color: "#0ea5e9" },
  { name: "Facebook", pct: 15, color: "#3b82f6" },
  { name: "WhatsApp", pct: 12, color: "#10b981" },
  { name: "Referral", pct: 11, color: "#f59e0b" },
  { name: "Other", pct: 10, color: "#9ca3af" },
];

const CAMPAIGNS = [
  { name: "Home Care May 2025", leads: 312, conv: "28%", spend: "₹45,000" },
  { name: "ICU Nurse Promo", leads: 186, conv: "22%", spend: "₹32,000" },
  { name: "Google Ads NCR", leads: 245, conv: "19%", spend: "₹58,000" },
];

export function AnalyticsTabPanel({ tab }: { tab: string }) {
  if (tab === "Overview") {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="dash-card lg:col-span-2">
          <h3 className="dash-card-title">Lead Trend</h3>
          <div className="mt-4 h-48 rounded-xl bg-gradient-to-b from-violet-50 to-white">
            <svg viewBox="0 0 400 120" className="h-full w-full">
              <polyline points="0,90 50,70 100,75 150,45 200,50 250,30 300,40 350,25 400,35" fill="none" stroke="#7c3aed" strokeWidth="2" />
              <polyline points="0,100 50,85 100,80 150,65 200,60 250,55 300,50 350,48 400,45" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>
        </section>
        <section className="dash-card border-violet-100 bg-violet-50/30">
          <h3 className="dash-card-title">Insights</h3>
          <ul className="mt-3 space-y-2 text-xs text-gray-700">
            <li>• Conversion rate improved by 4.2%.</li>
            <li>• Website is top source at 34%.</li>
            <li>• 42 follow-ups due today.</li>
          </ul>
        </section>
      </div>
    );
  }

  if (tab === "Lead Source") {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="dash-card">
          <h3 className="dash-card-title">Leads by Source</h3>
          <ul className="mt-4 space-y-3">
            {SOURCES.map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between text-xs"><span>{s.name}</span><span className="font-semibold">{s.pct}%</span></div>
                <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full" style={{ width: `${s.pct}%`, background: s.color }} /></div>
              </li>
            ))}
          </ul>
        </section>
        <section className="dash-card">
          <h3 className="dash-card-title">Source Performance</h3>
          <table className="mt-3 w-full text-left text-xs">
            <thead className="text-gray-500"><tr><th className="pb-2">Source</th><th>Leads</th><th>Conv.</th></tr></thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name} className="border-t border-gray-50"><td className="py-2">{s.name}</td><td>{Math.round(1248 * s.pct / 100)}</td><td>{(s.pct * 0.25).toFixed(0)}%</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  if (tab === "Conversion Funnel") {
    return (
      <section className="dash-card max-w-xl">
        <h3 className="dash-card-title">Conversion Funnel</h3>
        <div className="mt-4 space-y-3">
          {[
            { label: "New Leads", val: 826, w: 100 },
            { label: "Qualified", val: 510, w: 62 },
            { label: "Proposal Sent", val: 346, w: 42 },
            { label: "Converted", val: 312, w: 38 },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex justify-between text-sm"><span>{row.label}</span><span className="font-bold">{row.val}</span></div>
              <div className="h-3 rounded-full bg-gray-100"><div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-violet-300" style={{ width: `${row.w}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-lg font-bold text-emerald-600">Overall conversion 25.08%</p>
      </section>
    );
  }

  if (tab === "Coordinator Performance") {
    return (
      <section className="dash-card overflow-x-auto">
        <h3 className="dash-card-title">Coordinator Performance</h3>
        <table className="mt-4 w-full min-w-[640px] text-left text-xs">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="pb-2">Coordinator</th>
              <th>Total</th>
              <th>Converted</th>
              <th>Rate</th>
              <th>Response</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {COORDINATORS.map((c) => (
              <tr key={c.name} className="border-t border-gray-50">
                <td className="py-3 font-semibold">{c.name}</td>
                <td>{c.leads}</td>
                <td>{c.converted}</td>
                <td className="font-semibold text-emerald-600">{c.rate}%</td>
                <td>{c.response}</td>
                <td>{"★".repeat(c.stars)}{"☆".repeat(5 - c.stars)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn-outline-purple mt-4 text-xs">View Full Coordinator Report</button>
      </section>
    );
  }

  if (tab === "Lead Status") {
    return (
      <section className="dash-card">
        <h3 className="dash-card-title">Status breakdown</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["New", 276, "bg-violet-50 border-violet-100"],
            ["Discussion", 412, "bg-sky-50 border-sky-100"],
            ["Qualified", 198, "bg-cyan-50 border-cyan-100"],
            ["Proposal", 156, "bg-amber-50 border-amber-100"],
            ["Converted", 312, "bg-emerald-50 border-emerald-100"],
            ["Lost", 94, "bg-red-50 border-red-100"],
          ].map(([label, count, cardClass]) => (
            <div key={label} className={`rounded-xl border p-4 text-center ${cardClass}`}>
              <p className="text-2xl font-black text-gray-900">{count}</p>
              <p className="text-xs text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (tab === "Location") {
    return (
      <section className="dash-card">
        <h3 className="dash-card-title">Leads by City</h3>
        <div className="mt-4 space-y-3">
          {[
            ["Delhi", 312],
            ["Gurgaon", 286],
            ["Noida", 198],
            ["Faridabad", 124],
            ["Ghaziabad", 98],
          ].map(([city, count]) => (
            <div key={city} className="flex items-center gap-3 text-sm">
              <span className="w-24 font-medium">{city}</span>
              <div className="h-2 flex-1 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-sky-500" style={{ width: `${(Number(count) / 312) * 100}%` }} /></div>
              <span className="w-12 text-right font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (tab === "Time Analytics") {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="dash-card">
          <h3 className="dash-card-title">Leads by Hour (avg)</h3>
          <div className="mt-4 flex items-end gap-1 h-32">
            {[12, 28, 45, 62, 48, 35, 22, 18, 25, 40, 55, 38].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-violet-400" style={{ height: `${h}%` }} title={`${i + 8}:00`} />
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-gray-500">Peak: 10 AM – 2 PM</p>
        </section>
        <section className="dash-card">
          <h3 className="dash-card-title">Response time distribution</h3>
          <ul className="mt-3 space-y-2 text-xs">
            {[
              ["Under 5 min", 28],
              ["5–15 min", 35],
              ["15–30 min", 18],
              ["30+ min", 19],
            ].map(([label, pct]) => (
              <li key={label} className="flex justify-between"><span>{label}</span><span className="font-semibold">{pct}%</span></li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  if (tab === "Campaign Performance") {
    return (
      <section className="dash-card">
        <h3 className="dash-card-title">Campaign Performance</h3>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="border-b text-xs text-gray-500">
            <tr><th className="pb-2">Campaign</th><th>Leads</th><th>Conversion</th><th>Spend</th></tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c) => (
              <tr key={c.name} className="border-t border-gray-50">
                <td className="py-3 font-semibold">{c.name}</td>
                <td>{c.leads}</td>
                <td className="text-emerald-600 font-semibold">{c.conv}</td>
                <td>{c.spend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  return null;
}
