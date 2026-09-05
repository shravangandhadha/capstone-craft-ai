import type { MentorPlan } from "@/lib/mentor.functions";

const PHASE_TONE = ["text-primary", "text-signal", "text-accent", "text-foreground"];

function StackBlock({
  label,
  items,
}: {
  label: string;
  items: { name: string; purpose: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-elevated/50 p-4">
      <div className="eyebrow mb-3">{label}</div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.name}>
            <div className="font-mono text-xs text-primary">{it.name}</div>
            <div className="text-sm text-muted-foreground">{it.purpose}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PlanView({ plan, onBack }: { plan: MentorPlan; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="lab-panel grid-paper px-6 py-6">
        <button
          type="button"
          onClick={onBack}
          className="eyebrow transition-colors hover:text-foreground"
        >
          ← Back to concepts
        </button>
        <h2 className="mt-3 text-3xl font-semibold">{plan.title}</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">{plan.one_liner}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="lab-panel p-6">
          <h3 className="text-lg font-semibold">Key features</h3>
          <div className="mt-4 space-y-5">
            <div>
              <div className="eyebrow mb-2 text-signal">Core MVP</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.mvp_features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-primary">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-2 text-accent">Bonus for higher marks</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.bonus_features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-2">System roles</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {plan.user_roles.map((r) => (
                  <div key={r.name} className="rounded-lg border border-border bg-elevated/50 p-3">
                    <div className="font-mono text-xs text-primary">{r.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{r.responsibility}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="lab-panel p-6">
          <h3 className="text-lg font-semibold">Tech stack architecture</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StackBlock label="Frontend" items={plan.tech_stack.frontend} />
            <StackBlock label="Backend" items={plan.tech_stack.backend} />
            <StackBlock label="Database & storage" items={plan.tech_stack.data} />
            <StackBlock label="APIs & libraries" items={plan.tech_stack.third_party} />
          </div>
        </section>
      </div>

      <section className="lab-panel p-6">
        <h3 className="text-lg font-semibold">Development roadmap</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plan.roadmap.map((ph, i) => (
            <div key={ph.phase} className="relative rounded-xl border border-border bg-elevated/40 p-4">
              <div className={`font-mono text-[11px] uppercase tracking-wider ${PHASE_TONE[i % 4]}`}>
                {ph.phase}
              </div>
              <div className="mt-1 font-display text-sm font-semibold">{ph.title}</div>
              <div className="font-mono text-[11px] text-muted-foreground">{ph.weeks}</div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {ph.tasks.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="opacity-60">▹</span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-border pt-2 font-mono text-[11px] text-signal">
                {ph.deliverable}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="lab-panel p-6">
          <h3 className="text-lg font-semibold">Viva & evaluation prep</h3>
          <ol className="mt-4 space-y-4">
            {plan.viva_questions.map((q, i) => (
              <li key={q.question} className="flex gap-3">
                <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="text-sm font-medium">{q.question}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{q.answer_hint}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="lab-panel p-6">
          <h3 className="text-lg font-semibold">10-minute demo strategy</h3>
          <ul className="mt-4 space-y-3">
            {plan.demo_strategy.map((d) => (
              <li key={d.minute} className="flex gap-3 rounded-lg border border-border bg-elevated/40 p-3">
                <span className="font-mono text-[11px] text-accent">{d.minute}</span>
                <span className="text-sm text-muted-foreground">{d.action}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
