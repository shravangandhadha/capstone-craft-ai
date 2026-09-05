import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, CheckCircle2, FolderKanban, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CapstoneForge — AI Final-Year Project Idea Generator & Mentor" },
      {
        name: "description",
        content:
          "Turn a vague idea into a viva-ready capstone: tailored project concepts, tech stack architecture, a phased roadmap and examiner Q&A prep.",
      },
      { property: "og:title", content: "CapstoneForge — AI Project Idea Generator & Mentor" },
      {
        property: "og:description",
        content:
          "Tailored final-year project concepts with full tech stacks, 4-phase roadmaps and viva preparation for engineering students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="page-wrap">
      <div className="welcome-row">
        <div><p className="eyebrow">Saturday, September 5, 2026</p><h1 className="page-title">Good morning, Shravan</h1><p className="page-subtitle">Here is what is happening with your capstone workspace.</p></div>
        <Link to="/mentor" className="button-primary"><Sparkles size={17} /> Open AI mentor</Link>
      </div>
      <section className="metric-grid"><Metric icon={<FolderKanban size={19} />} label="Active projects" value="3" detail="1 due this week" /><Metric icon={<Sparkles size={19} />} label="Mentor sessions" value="12" detail="+4 this month" /><Metric icon={<BarChart3 size={19} />} label="Project progress" value="68%" detail="On track" /></section>
      <section className="dashboard-grid">
        <div className="surface-panel project-panel"><div className="section-heading"><div><p className="eyebrow">Workspace</p><h2>Recent projects</h2></div><button className="text-button">View all <ArrowRight size={15} /></button></div>{[{ title: "Smart Campus Assistant", tag: "AI / ML", progress: 82, due: "Due in 6 days" }, { title: "SecurePay anomaly detector", tag: "Cybersecurity", progress: 54, due: "Due in 18 days" }, { title: "CropSense dashboard", tag: "Data Engineering", progress: 31, due: "Due in 32 days" }].map((project) => <div key={project.title} className="project-row"><div className="project-mark">{project.title.slice(0, 1)}</div><div className="project-copy"><strong>{project.title}</strong><span>{project.tag} · {project.due}</span><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div></div><b>{project.progress}%</b></div>)}</div>
        <div className="surface-panel activity-panel"><div className="section-heading"><div><p className="eyebrow">Your week</p><h2>Next steps</h2></div></div><div className="next-step"><CheckCircle2 size={18} className="step-done" /><div><strong>Review mentor feedback</strong><span>Smart Campus Assistant · Today</span></div></div><div className="next-step"><span className="step-number">2</span><div><strong>Finish system architecture</strong><span>SecurePay anomaly detector · Tomorrow</span></div></div><div className="next-step"><span className="step-number">3</span><div><strong>Prepare your project pitch</strong><span>CropSense dashboard · Sep 10</span></div></div><Link to="/mentor" className="button-secondary full-button">Plan my next step <ArrowRight size={16} /></Link></div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <div className="surface-panel metric-card"><span className="metric-icon">{icon}</span><div><span className="metric-label">{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}
