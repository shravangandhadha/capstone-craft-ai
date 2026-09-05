import type { ProjectIdea } from "@/lib/mentor.functions";
import { cn } from "@/lib/utils";

function difficultyTone(d: string) {
  const v = d.toLowerCase();
  if (v.startsWith("adv")) return "border-accent/50 bg-accent/15 text-accent";
  if (v.startsWith("beg")) return "border-signal/50 bg-signal/15 text-signal";
  return "border-primary/50 bg-primary/15 text-primary";
}

export function IdeaCard({
  idea,
  selected,
  loading,
  onSelect,
}: {
  idea: ProjectIdea;
  selected: boolean;
  loading: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={cn(
        "lab-panel flex flex-col p-5 transition-colors",
        selected ? "border-primary/60" : "hover:border-primary/40",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {idea.domains.slice(0, 2).map((d) => (
          <span key={d} className="rounded-md bg-primary/12 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
            {d}
          </span>
        ))}
        <span
          className={cn(
            "rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
            difficultyTone(idea.difficulty),
          )}
        >
          {idea.difficulty}
        </span>
        <span className="ml-auto font-mono text-xs text-signal">{idea.relevance_score}% fit</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">{idea.title}</h3>

      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <span className="eyebrow mr-2">Problem</span>
          {idea.problem_statement}
        </p>
        <p>
          <span className="eyebrow mr-2">Solution</span>
          {idea.proposed_solution}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {idea.stack_highlights.map((s) => (
          <span key={s} className="rounded-full bg-elevated px-2.5 py-0.5 font-mono text-[10px] text-foreground/80">
            {s}
          </span>
        ))}
      </div>

      <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-signal/90">
        {idea.relevance_reason}
      </p>

      <button
        type="button"
        onClick={onSelect}
        disabled={loading}
        className="mt-4 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
      >
        {loading && selected ? "Building mentorship plan…" : "Build full mentorship plan"}
      </button>
    </article>
  );
}
