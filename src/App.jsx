import { useState, useEffect } from "react";

const categories = ["All", "Access Mgmt", "Change Mgmt", "IT Operations", "SOX/ICFR", "SOC 1/2", "Behavioural"];

const questions = [
  // Access Management
  {
    id: 1, category: "Access Mgmt", difficulty: "Core",
    question: "What is the difference between authentication and authorization in the context of ITGC?",
    answer: "Authentication verifies WHO a user is (e.g., password, MFA), while authorization determines WHAT they can access (e.g., roles, permissions). In ITGC, we test both — user provisioning/de-provisioning controls ensure only authorized individuals have appropriate access (authorization), while password policies and MFA controls address authentication strength.",
    tip: "Always tie your answer back to how you've tested these in practice."
  },
  {
    id: 2, category: "Access Mgmt", difficulty: "Core",
    question: "How do you test User Access Reviews (UAR) during a SOX audit?",
    answer: "I obtain the UAR population for the period, select a sample (risk-based), and validate: (1) reviews were completed timely, (2) certifiers are appropriate (manager, not system admin), (3) access exceptions were remediated with evidence, and (4) terminated users were revoked. I also look for rubber-stamping by checking if any reviewer approved 100% without revocations.",
    tip: "Mention the concept of 'rubber stamp' reviews — interviewers love that."
  },
  {
    id: 3, category: "Access Mgmt", difficulty: "Advanced",
    question: "What is Segregation of Duties (SoD) and how do you identify SoD conflicts?",
    answer: "SoD ensures no single individual can execute a complete transaction end-to-end without a check. Conflicts arise when one person can both create and approve a vendor, or both initiate and post a journal entry. I identify conflicts by obtaining a role-to-function matrix from the application (e.g., SAP GRC, Oracle), mapping conflicting function combinations, then extracting users holding those conflicting roles. I then assess mitigating controls for residual risk.",
    tip: "Name specific tools — SAP GRC, Oracle Access Manager, Saviynt adds credibility."
  },
  {
    id: 4, category: "Access Mgmt", difficulty: "Core",
    question: "Walk me through how you test privileged access controls.",
    answer: "I focus on three areas: (1) Inventory — are all privileged accounts (admin, root, service accounts) inventoried and justified? (2) Usage monitoring — are privileged sessions logged and reviewed? (3) Periodic review — are privileged access rights reviewed at least quarterly? I also check for shared accounts, test that default credentials are changed, and verify that emergency/firefighter access is time-bound and fully logged.",
    tip: "Mention PAM tools like CyberArk or BeyondTrust if you've encountered them."
  },
  // Change Management
  {
    id: 5, category: "Change Mgmt", difficulty: "Core",
    question: "What are the key controls you test in an IT Change Management process?",
    answer: "The core controls are: (1) Segregation between development, testing, and production environments, (2) Documented testing and approval prior to promotion, (3) No developers have direct production access, (4) Change requests are authorized by appropriate business/IT owners, (5) Emergency changes are documented retroactively and reviewed. I also check that change logs are complete and reconcile to authorized change tickets.",
    tip: "Always mention the dev/test/prod segregation — it's the foundation."
  },
  {
    id: 6, category: "Change Mgmt", difficulty: "Advanced",
    question: "How do you handle emergency/urgent changes in a SOX control framework?",
    answer: "Emergency changes (hotfixes) bypass normal approval flows, so compensating controls are critical. I verify: (1) A defined emergency change process exists with documented criteria, (2) All emergency changes are logged at the time of implementation, (3) Retroactive approval is obtained from an appropriate authority (e.g., CAB, CIO) within a defined timeframe, (4) A periodic review of all emergency changes is performed for trend analysis. Volume of emergency changes is also a risk indicator.",
    tip: "Frame it as: 'the control itself is the compensating review after the fact.'"
  },
  {
    id: 7, category: "Change Mgmt", difficulty: "Core",
    question: "What evidence do you request to test that developers don't have production access?",
    answer: "I request: (1) A full extract of production access rights for all users, filtered to show developer roles, (2) System-generated screenshots or reports from the IAM tool, (3) An org chart or RACI to confirm who is classified as 'developer'. I then cross-reference developer names against the production access list. Even one developer with production write access is typically a control deficiency.",
    tip: "Emphasize system-generated evidence over client-prepared spreadsheets."
  },
  // IT Operations
  {
    id: 8, category: "IT Operations", difficulty: "Core",
    question: "How do you test backup and recovery controls?",
    answer: "I test three things: (1) Configuration — are backup jobs scheduled for all in-scope systems per policy? (2) Execution — do job logs confirm successful completion (no failures or only resolved exceptions)? (3) Recoverability — has a restore test been performed and documented within the past year? A backup that has never been tested for recovery is an untested control. I also check off-site/cloud storage for critical data.",
    tip: "The restore test evidence is often missing — mention this gap proactively."
  },
  {
    id: 9, category: "IT Operations", difficulty: "Core",
    question: "What is a job scheduling control and how do you audit it?",
    answer: "Job scheduling controls ensure critical batch processes (e.g., payroll runs, financial close jobs) execute completely and on schedule. I test by: (1) Obtaining the inventory of in-scope scheduled jobs, (2) Reviewing job monitoring procedures, (3) Selecting a sample and confirming successful completion with logs, (4) Verifying exception/failure notifications go to appropriate personnel, and (5) Confirming that manual restarts or interventions are logged and reviewed.",
    tip: "Connect this to financial reporting — if a payroll batch fails silently, it's a SOX risk."
  },
  {
    id: 10, category: "IT Operations", difficulty: "Advanced",
    question: "How do patch management controls relate to cybersecurity and ITGC?",
    answer: "Patch management is an ITGC control because unpatched vulnerabilities represent a risk to data integrity and confidentiality — directly impacting financial reporting systems in a SOX context. I test by reviewing: (1) The patch policy and defined SLAs (e.g., critical patches within 30 days), (2) Scan reports from tools like Qualys/Tenable showing open vulnerabilities, (3) Remediation tracking for aged patches, (4) Exceptions process for systems that cannot be patched immediately.",
    tip: "Linking patch management to financial data integrity shows maturity."
  },
  // SOX/ICFR
  {
    id: 11, category: "SOX/ICFR", difficulty: "Core",
    question: "What is the difference between a Key Report and an Interface in SOX ITGC scoping?",
    answer: "A Key Report is a system-generated report used in a financial control (e.g., aged AR listing used to assess bad debt). An Interface is a data transfer between systems (e.g., from CRM to ERP). Both are in-scope because if the data is unreliable, the control relying on it is also unreliable. For key reports, I test completeness/accuracy of data and the report logic. For interfaces, I test that data is transferred completely and accurately with reconciliation controls.",
    tip: "This question separates juniors from seniors — know ITGC scoping inside out."
  },
  {
    id: 12, category: "SOX/ICFR", difficulty: "Advanced",
    question: "How do you evaluate the severity of an ITGC deficiency — significant deficiency vs. material weakness?",
    answer: "Severity depends on two factors: likelihood and magnitude. A deficiency becomes a Significant Deficiency when there's more than a remote chance it could result in a material misstatement. It escalates to a Material Weakness if there's a reasonable possibility of a material misstatement going undetected. For ITGC, I assess: which financial statement accounts are affected, whether compensating manual controls exist, the time period the deficiency was open, and the pervasiveness across systems. PCAOB AS 2201 is the guiding standard.",
    tip: "Cite PCAOB AS 2201 — it signals you know the regulatory framework."
  },
  {
    id: 13, category: "SOX/ICFR", difficulty: "Core",
    question: "What is the role of IT General Controls in supporting automated application controls?",
    answer: "Automated Application Controls (AACs) — like system-enforced approval workflows or automated calculations — are only reliable if the underlying ITGC environment is sound. If change management controls are weak, the AAC could have been modified without proper authorization. If access controls are weak, unauthorized users could bypass the control. ITGCs therefore provide the foundation of reliance that allows auditors to place confidence in AACs, potentially reducing the extent of manual testing needed.",
    tip: "This is a favourite among Big 4 interviewers — shows conceptual depth."
  },
  // SOC 1/2
  {
    id: 14, category: "SOC 1/2", difficulty: "Core",
    question: "What is the difference between a SOC 1 Type I and Type II report?",
    answer: "A SOC 1 report covers controls at a service organization relevant to user entities' internal control over financial reporting. Type I reports on the design of controls at a point in time — 'are the controls suitably designed?' Type II covers both design AND operating effectiveness over a period (typically 6–12 months) — 'did the controls actually work throughout the period?' Type II provides significantly more assurance and is what user auditors typically rely on.",
    tip: "Follow up: 'In my experience, clients often have a Type I in year 1 and transition to Type II.'"
  },
  {
    id: 15, category: "SOC 1/2", difficulty: "Advanced",
    question: "How do you handle a SOC 2 engagement where the client has subservice organizations?",
    answer: "Under SSAE 18, service organizations can use either the Carve-Out or Inclusive Method. With Carve-Out, the subservice organization is excluded from the scope and management's description just notes its use — user auditors must then obtain the subservice org's own SOC report. With the Inclusive Method, the subservice org's controls are included in scope and tested. I always check the complementary subservice organization controls (CSOCs) to ensure they're appropriately addressed.",
    tip: "Mention SSAE 18 and CSOCs — it shows you know the standard, not just the concept."
  },
  {
    id: 16, category: "SOC 1/2", difficulty: "Core",
    question: "What are the Trust Services Criteria (TSC) for SOC 2?",
    answer: "The five TSC categories are: (1) Security (CC series) — mandatory for all SOC 2 engagements, covers logical and physical access, risk assessment, and incident response; (2) Availability — system uptime and performance; (3) Processing Integrity — complete and accurate processing; (4) Confidentiality — protection of confidential information; (5) Privacy — collection and handling of personal information per the AICPA Privacy Management Framework. Security is always required; the others are in scope based on the service commitments made.",
    tip: "Know that Security (CC criteria) is ALWAYS in scope — the rest are optional."
  },
  // Behavioural
  {
    id: 17, category: "Behavioural", difficulty: "Situational",
    question: "Tell me about a time you identified a significant ITGC deficiency. How did you handle it?",
    answer: "Structure your answer using STAR: Situation (what was the engagement/context?), Task (what were you testing?), Action (what did you find and how did you validate/escalate it?), Result (what was the outcome — remediation, reportable condition, management letter point?). Key points to emphasize: how you communicated the finding with tact (client relationship), how you assessed severity, and what compensating controls you considered. Show both technical rigor and professional judgment.",
    tip: "Prepare 2–3 real examples from your PwC/Mphasis/Coforge experience before the interview."
  },
  {
    id: 18, category: "Behavioural", difficulty: "Situational",
    question: "How do you manage pushback from a client who disagrees with your ITGC finding?",
    answer: "I first ensure I fully understand the client's perspective — sometimes they have context that changes the assessment. I revalidate the evidence and the criteria being applied. If my finding stands, I explain the risk clearly in business terms (not just audit jargon), reference the applicable standard or framework, and explore whether compensating controls reduce the severity. I escalate to the engagement manager when needed. The goal is a defensible, well-documented position — not winning an argument.",
    tip: "Show emotional intelligence — interviewers are assessing whether you can handle client pressure."
  },
  {
    id: 19, category: "Behavioural", difficulty: "Situational",
    question: "How has your background in software testing made you a stronger IT auditor?",
    answer: "My software testing background gives me a genuine technical understanding of how applications are built, deployed, and where controls can fail — not just a checklist perspective. I understand SDLC deeply, I can read code and configuration evidence critically, and I can have credible conversations with developers and IT teams. This means I spend less time asking basic questions and more time identifying real risks. I've used this to assess automated controls and interface testing with a level of depth that purely audit-background colleagues find harder.",
    tip: "This is YOUR differentiator, Aakash — own it confidently and specifically."
  },
  {
    id: 20, category: "Behavioural", difficulty: "Situational",
    question: "Where do you see the future of ITGC/IT audit heading?",
    answer: "Three major shifts: (1) Continuous auditing and monitoring — real-time control testing using data analytics instead of point-in-time sampling; (2) Cloud and SaaS controls — the rise of shared responsibility models means auditors need deep knowledge of CSP controls, SCUDs, and vendor SOC reports; (3) AI risk — as organizations embed AI in financial processes, auditors need to assess model governance, data integrity, and algorithm change management. The value of an IT auditor is increasingly in judgment and risk translation, not just control testing execution.",
    tip: "Mentioning AI governance in financial processes shows forward-thinking — use it for EY/Big 4 rounds."
  },
];

const difficultyColor = {
  "Core": "#2ecc71",
  "Advanced": "#F5A623",
  "Situational": "#9b59b6",
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [flipped, setFlipped] = useState({});
  const [bookmarked, setBookmarked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("itgc-bookmarked")) || {}; } catch { return {}; }
  });
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [answered, setAnswered] = useState(() => {
    try { return JSON.parse(localStorage.getItem("itgc-answered")) || {}; } catch { return {}; }
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    try { localStorage.setItem("itgc-bookmarked", JSON.stringify(bookmarked)); } catch {}
  }, [bookmarked]);
  useEffect(() => {
    try { localStorage.setItem("itgc-answered", JSON.stringify(answered)); } catch {}
  }, [answered]);

  const filtered = questions.filter(q => {
    const catMatch = activeCategory === "All" || q.category === activeCategory;
    const bmMatch = !showBookmarked || bookmarked[q.id];
    const searchMatch = !search || q.question.toLowerCase().includes(search.toLowerCase());
    return catMatch && bmMatch && searchMatch;
  });

  const toggleFlip = (id) => setFlipped(f => ({ ...f, [id]: !f[id] }));
  const toggleBookmark = (id, e) => { e.stopPropagation(); setBookmarked(b => ({ ...b, [id]: !b[id] })); };
  const markAnswered = (id, e) => { e.stopPropagation(); setAnswered(a => ({ ...a, [id]: !a[id] })); };

  const progress = Math.round((Object.values(answered).filter(Boolean).length / questions.length) * 100);

  return (
    <div className="itgc-app" style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "#0D1B2A",
      minHeight: "100vh",
      color: "#F7F9FC",
    }}>
      <style>{`
        .itgc-app { max-width: 480px; margin: 0 auto; }
        .itgc-inner { padding: 0; }
        .itgc-cards { display: block; padding: 16px 16px 96px; }
        .itgc-bottombar { max-width: 480px; }
        @media (min-width: 768px) {
          .itgc-app { max-width: 1200px; }
          .itgc-header-inner, .itgc-cards { max-width: 1100px; margin: 0 auto; }
          .itgc-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 16px;
            padding: 24px 24px 96px;
            align-items: start;
          }
          .itgc-card { margin-bottom: 0 !important; }
          .itgc-bottombar { max-width: 1200px; }
          .itgc-header-bar { padding-left: 24px !important; padding-right: 24px !important; }
        }
        @media (min-width: 1100px) {
          .itgc-cards { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
      {/* Header */}
      <div className="itgc-header-bar" style={{
        background: "linear-gradient(135deg, #0D1B2A 0%, #1B4F72 100%)",
        padding: "24px 20px 16px",
        borderBottom: "1px solid rgba(245,166,35,0.2)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
       <div className="itgc-header-inner">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#F5A623", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>
              ITGC INTERVIEW PREP
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>Question Bank</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#F5A623", lineHeight: 1 }}>{progress}%</div>
            <div style={{ fontSize: 10, color: "#8899AA", marginTop: 2 }}>Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 4, marginBottom: 14 }}>
          <div style={{ background: "#F5A623", height: 4, borderRadius: 4, width: `${progress}%`, transition: "width 0.4s ease" }} />
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.5 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            style={{
              width: "100%", padding: "9px 12px 9px 32px", borderRadius: 8,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#F7F9FC", fontSize: 13, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: "1px solid",
              borderColor: activeCategory === cat ? "#F5A623" : "rgba(255,255,255,0.15)",
              background: activeCategory === cat ? "rgba(245,166,35,0.15)" : "transparent",
              color: activeCategory === cat ? "#F5A623" : "#8899AA",
              cursor: "pointer", transition: "all 0.2s"
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Bookmark filter */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setShowBookmarked(b => !b)} style={{
            display: "flex", alignItems: "center", gap: 5, background: "transparent",
            border: "none", color: showBookmarked ? "#F5A623" : "#8899AA",
            fontSize: 12, cursor: "pointer", padding: 0, fontWeight: showBookmarked ? 600 : 400
          }}>
            {showBookmarked ? "★" : "☆"} {showBookmarked ? "Bookmarked only" : "Show bookmarked"}
          </button>
          <span style={{ color: "#3D5A73", fontSize: 11 }}>
            {filtered.length} question{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      </div>

      {/* Cards */}
      <div className="itgc-cards">
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#8899AA", gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔎</div>
            <div>No questions match your filters</div>
          </div>
        )}
        {filtered.map(q => {
          const isFlipped = flipped[q.id];
          const isBm = bookmarked[q.id];
          const isDone = answered[q.id];
          return (
            <div
              key={q.id}
              className="itgc-card"
              onClick={() => toggleFlip(q.id)}
              style={{
                marginBottom: 14,
                borderRadius: 14,
                border: `1px solid ${isDone ? "rgba(46,204,113,0.3)" : "rgba(255,255,255,0.08)"}`,
                background: isFlipped
                  ? "linear-gradient(135deg, #1B4F72 0%, #154360 100%)"
                  : "linear-gradient(135deg, #122333 0%, #0D1B2A 100%)",
                cursor: "pointer",
                transition: "all 0.25s ease",
                overflow: "hidden",
                boxShadow: isFlipped ? "0 4px 20px rgba(27,79,114,0.4)" : "0 2px 8px rgba(0,0,0,0.3)"
              }}
            >
              {/* Card header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                    color: "#3D5A73", fontFamily: "monospace"
                  }}>
                    Q{String(q.id).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10,
                    background: `${difficultyColor[q.difficulty]}22`,
                    color: difficultyColor[q.difficulty],
                    border: `1px solid ${difficultyColor[q.difficulty]}44`
                  }}>
                    {q.difficulty}
                  </span>
                  <span style={{ fontSize: 10, color: "#3D5A73" }}>{q.category}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={e => toggleBookmark(q.id, e)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 16, color: isBm ? "#F5A623" : "#3D5A73", padding: 0
                  }}>{isBm ? "★" : "☆"}</button>
                  {isDone && <span style={{ fontSize: 14, color: "#2ecc71" }}>✓</span>}
                </div>
              </div>

              {/* Question */}
              <div style={{ padding: "0 14px 12px" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "#E8F0F7" }}>
                  {q.question}
                </p>
              </div>

              {/* Flip indicator */}
              {!isFlipped && (
                <div style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  padding: "8px 14px",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                  <span style={{ fontSize: 10, color: "#3D5A73", letterSpacing: "0.1em" }}>TAP FOR ANSWER</span>
                  <span style={{ color: "#F5A623", fontSize: 12 }}>→</span>
                </div>
              )}

              {/* Answer */}
              {isFlipped && (
                <div style={{ borderTop: "1px solid rgba(245,166,35,0.15)", padding: "12px 14px" }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                    color: "#F5A623", marginBottom: 8, textTransform: "uppercase"
                  }}>Answer</div>
                  <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.65, color: "#C8D8E8" }}>
                    {q.answer}
                  </p>
                  <div style={{
                    background: "rgba(245,166,35,0.08)", borderRadius: 8,
                    padding: "8px 10px", borderLeft: "3px solid #F5A623",
                    marginBottom: 12
                  }}>
                    <div style={{ fontSize: 10, color: "#F5A623", fontWeight: 700, marginBottom: 3 }}>💡 INTERVIEW TIP</div>
                    <div style={{ fontSize: 12, color: "#B0C4D8", lineHeight: 1.5 }}>{q.tip}</div>
                  </div>
                  <button
                    onClick={e => markAnswered(q.id, e)}
                    style={{
                      width: "100%", padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                      border: `1px solid ${isDone ? "rgba(46,204,113,0.5)" : "rgba(255,255,255,0.15)"}`,
                      background: isDone ? "rgba(46,204,113,0.15)" : "rgba(255,255,255,0.05)",
                      color: isDone ? "#2ecc71" : "#8899AA",
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    {isDone ? "✓ Marked as Practised" : "Mark as Practised"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom stats bar */}
      <div className="itgc-bottombar" style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", background: "#0A1520",
        borderTop: "1px solid rgba(245,166,35,0.15)",
        padding: "10px 20px 16px",
        display: "flex", justifyContent: "space-around"
      }}>
        {[
          { label: "Total", value: questions.length },
          { label: "Practised", value: Object.values(answered).filter(Boolean).length },
          { label: "Bookmarked", value: Object.values(bookmarked).filter(Boolean).length },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#F5A623" }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: "#3D5A73", marginTop: 1 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
