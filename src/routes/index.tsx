import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { IdeaCard } from "@/components/mentor/IdeaCard";
import { IntakeWizard } from "@/components/mentor/IntakeWizard";
import { PlanView } from "@/components/mentor/PlanView";
import {
  generateIdeas,
  generatePlan,
  type MentorPlan,
  type ProjectIdea,
  type StudentProfile,
} from "@/lib/mentor.functions";

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
  const runIdeas = useServerFn(generateIdeas);
  const runPlan = useServerFn(generatePlan);

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [ideas, setIdeas] = useState<ProjectIdea[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [plan, setPlan] = useState<MentorPlan | null>(null);
  const [loading, setLoading] = useState<"ideas" | "plan" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(p: StudentProfile) {
    setProfile(p);
    setError(null);
    setPlan(null);
    setIdeas(null);
    setLoading("ideas");
    try {
      const result = await runIdeas({ data: p });
      setIdeas(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  async function handlePlan(idea: ProjectIdea) {
    if (!profile) return;
    setSelected(idea.title);
    setError(null);
    setLoading("plan");
    try {
      const result = await runPlan({
        data: {
          profile,
          idea: {
            title: idea.title,
            problem_statement: idea.problem_statement,
            proposed_solution: idea.proposed_solution,
            domains: idea.domains,
            difficulty: idea.difficulty,
            stack_highlights: idea.stack_highlights,
          },
        },
      });
      setPlan(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-8 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-10">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            CF
          </span>
          <div>
            <div className="font-display text-base font-semibold">CapstoneForge</div>
            <div className="eyebrow">Project mentor</div>
          </div>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] text-signal">
          Structured AI generation
        </span>
      </header>

      {!plan && (
        <section className="max-w-3xl pb-10">
          <h1 className="text-4xl font-semibold leading-[1.05] lg:text-5xl">
            From a vague idea to a{" "}
            <span className="text-primary">viva-ready</span> capstone project.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Tell us your program, stack and career target. You get tailored project concepts, a full tech
            architecture, a phased week-by-week roadmap, and the questions your examiners will actually ask.
          </p>
        </section>
      )}

      {plan ? (
        <PlanView
          plan={plan}
          onBack={() => {
            setPlan(null);
            setSelected(null);
          }}
        />
      ) : (
        <div className="space-y-8">
          <IntakeWizard onSubmit={handleGenerate} loading={loading === "ideas"} />

          {error && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          {loading === "ideas" && (
            <div className="grid gap-5 md:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="lab-panel animate-pulse space-y-3 p-5">
                  <div className="h-3 w-24 rounded bg-elevated" />
                  <div className="h-5 w-3/4 rounded bg-elevated" />
                  <div className="h-3 w-full rounded bg-elevated" />
                  <div className="h-3 w-5/6 rounded bg-elevated" />
                  <div className="h-8 w-full rounded bg-elevated" />
                </div>
              ))}
            </div>
          )}

          {ideas && ideas.length > 0 && (
            <section>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-2xl font-semibold">Generated concepts</h2>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {ideas.length} matches · ranked by fit
                </span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.title}
                    idea={idea}
                    selected={selected === idea.title}
                    loading={loading === "plan"}
                    onSelect={() => handlePlan(idea)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <footer className="mt-16 border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
        CapstoneForge · concepts, roadmaps and viva prep generated for your exact profile
      </footer>
    </main>
  );
}
