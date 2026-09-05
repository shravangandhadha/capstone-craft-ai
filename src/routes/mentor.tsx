import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { IdeaCard } from "@/components/mentor/IdeaCard";
import { IntakeWizard } from "@/components/mentor/IntakeWizard";
import { PlanView } from "@/components/mentor/PlanView";
import { generateIdeas, generatePlan, type MentorPlan, type ProjectIdea, type StudentProfile } from "@/lib/mentor.functions";

export const Route = createFileRoute("/mentor")({ component: MentorPage });

function MentorPage() {
  const runIdeas = useServerFn(generateIdeas);
  const runPlan = useServerFn(generatePlan);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [ideas, setIdeas] = useState<ProjectIdea[] | null>(null);
  const [plan, setPlan] = useState<MentorPlan | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState<"ideas" | "plan" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(nextProfile: StudentProfile) {
    setProfile(nextProfile); setIdeas(null); setPlan(null); setError(null); setLoading("ideas");
    try { setIdeas(await runIdeas({ data: nextProfile })); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to generate ideas right now."); } finally { setLoading(null); }
  }

  async function handlePlan(idea: ProjectIdea) {
    if (!profile) return;
    setSelected(idea.title); setError(null); setLoading("plan");
    try { setPlan(await runPlan({ data: { profile, idea: { title: idea.title, problem_statement: idea.problem_statement, proposed_solution: idea.proposed_solution, domains: idea.domains, difficulty: idea.difficulty, stack_highlights: idea.stack_highlights } } })); window.scrollTo({ top: 0, behavior: "smooth" }); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to build a plan right now."); } finally { setLoading(null); }
  }

  return <main className="page-wrap mentor-page"><div className="mentor-header"><div><p className="eyebrow">AI workspace</p><h1 className="page-title">Your project mentor</h1><p className="page-subtitle">Answer a few questions and get a focused, viva-ready project plan.</p></div><span className="status-pill"><span /> Mentor online</span></div>{plan ? <PlanView plan={plan} onBack={() => { setPlan(null); setSelected(null); }} /> : <div className="mentor-content"><IntakeWizard onSubmit={handleGenerate} loading={loading === "ideas"} />{error && <div className="error-banner">{error}</div>}{loading === "ideas" && <div className="loading-card">Building recommendations from your profile...</div>}{ideas && <section className="ideas-section"><div className="section-heading"><div><p className="eyebrow">Recommendations</p><h2>Good-fit project concepts</h2></div><span className="muted-count">{ideas.length} matches</span></div><div className="idea-grid">{ideas.map((idea) => <IdeaCard key={idea.title} idea={idea} selected={selected === idea.title} loading={loading === "plan"} onSelect={() => handlePlan(idea)} />)}</div></section>}</div>}</main>;
}
