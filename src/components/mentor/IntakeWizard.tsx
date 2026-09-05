import { useState } from "react";

import type { StudentProfile } from "@/lib/mentor.functions";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "academics", label: "Academics" },
  { key: "stack", label: "Tech stack" },
  { key: "domains", label: "Domains" },
  { key: "career", label: "Career" },
  { key: "scope", label: "Team & scope" },
] as const;

const DEGREES = ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "B.E. Computer Science", "BCA", "MCA", "M.Tech CSE"];
const SEMESTERS = ["Semester 5", "Semester 6", "Semester 7", "Semester 8", "Final year"];
const PROFICIENCY = ["Beginner", "Intermediate", "Strong", "Competitive programmer"];
const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Dart", "SQL"];
const FRAMEWORKS = [
  "React",
  "Next.js",
  "Node / Express",
  "Django",
  "FastAPI",
  "Spring Boot",
  "Flutter",
  "TensorFlow",
  "PyTorch",
  "Docker",
];
const DATABASES = ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", "SQLite", "Neo4j", "pgvector"];
const DOMAINS = [
  "AI / ML",
  "Generative AI",
  "Cybersecurity",
  "Cloud Native",
  "IoT",
  "Web3",
  "FinTech",
  "HealthTech",
  "Data Engineering",
  "AR / VR",
];
const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "Security Analyst",
  "Mobile Developer",
];
const TEAM = ["Individual", "Group of 2", "Group of 3", "Group of 4"];
const DURATION = ["8 weeks", "10 weeks", "12 weeks", "16 weeks", "Two semesters"];
const COMPLEXITY = ["Beginner", "Intermediate", "Advanced"];

const EMPTY: StudentProfile = {
  degree: "B.Tech CSE",
  semester: "Semester 7",
  proficiency: "Intermediate",
  languages: [],
  frameworks: [],
  databases: [],
  primaryDomain: "",
  secondaryDomain: "",
  careerGoal: "",
  teamSize: "Group of 3",
  duration: "10 weeks",
  complexity: "Intermediate",
  notes: "",
};

function Chip({
  label,
  active,
  onClick,
  tone = "primary",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "primary" | "accent" | "signal";
}) {
  const activeTone =
    tone === "accent"
      ? "border-accent/60 bg-accent/15 text-accent"
      : tone === "signal"
        ? "border-signal/60 bg-signal/15 text-signal"
        : "border-primary/60 bg-primary/15 text-primary";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
        active ? activeTone : "border-border bg-elevated/60 text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function IntakeWizard({
  onSubmit,
  loading,
}: {
  onSubmit: (profile: StudentProfile) => void;
  loading: boolean;
}) {
  const [step, setStep] = useState(0);
  const [p, setP] = useState<StudentProfile>(EMPTY);

  const set = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));

  const toggle = (key: "languages" | "frameworks" | "databases", value: string) =>
    setP((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));

  const stepValid = [
    Boolean(p.degree && p.semester && p.proficiency),
    p.languages.length > 0,
    Boolean(p.primaryDomain),
    Boolean(p.careerGoal),
    Boolean(p.teamSize && p.duration && p.complexity),
  ][step];

  const last = step === STEPS.length - 1;

  return (
    <section id="intake" className="lab-panel grid-paper overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card/80 px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => i <= step && setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                i === step
                  ? "bg-primary/15 text-primary"
                  : i < step
                    ? "text-signal"
                    : "text-muted-foreground/60",
              )}
            >
              <span className="grid size-4 place-items-center rounded-full border border-current text-[9px]">
                {i < step ? "✓" : i + 1}
              </span>
              {s.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          Step {step + 1} / {STEPS.length}
        </span>
      </div>

      <div className="h-1 w-full bg-elevated">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="space-y-6 px-6 py-7">
        {step === 0 && (
          <>
            <Field label="Degree program">
              {DEGREES.map((d) => (
                <Chip key={d} label={d} active={p.degree === d} onClick={() => set("degree", d)} />
              ))}
            </Field>
            <Field label="Current semester">
              {SEMESTERS.map((s) => (
                <Chip key={s} label={s} active={p.semester === s} onClick={() => set("semester", s)} />
              ))}
            </Field>
            <Field label="Academic proficiency">
              {PROFICIENCY.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  tone="signal"
                  active={p.proficiency === s}
                  onClick={() => set("proficiency", s)}
                />
              ))}
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Languages you know">
              {LANGUAGES.map((s) => (
                <Chip key={s} label={s} active={p.languages.includes(s)} onClick={() => toggle("languages", s)} />
              ))}
            </Field>
            <Field label="Frameworks & tools">
              {FRAMEWORKS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  tone="signal"
                  active={p.frameworks.includes(s)}
                  onClick={() => toggle("frameworks", s)}
                />
              ))}
            </Field>
            <Field label="Databases">
              {DATABASES.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  tone="accent"
                  active={p.databases.includes(s)}
                  onClick={() => toggle("databases", s)}
                />
              ))}
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Primary domain interest">
              {DOMAINS.map((s) => (
                <Chip key={s} label={s} active={p.primaryDomain === s} onClick={() => set("primaryDomain", s)} />
              ))}
            </Field>
            <Field label="Secondary domain (optional)">
              {DOMAINS.filter((d) => d !== p.primaryDomain).map((s) => (
                <Chip
                  key={s}
                  label={s}
                  tone="accent"
                  active={p.secondaryDomain === s}
                  onClick={() => set("secondaryDomain", p.secondaryDomain === s ? "" : s)}
                />
              ))}
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Target role after graduation">
              {ROLES.map((s) => (
                <Chip key={s} label={s} active={p.careerGoal === s} onClick={() => set("careerGoal", s)} />
              ))}
            </Field>
            <div>
              <div className="eyebrow mb-2">Anything else your guide expects? (optional)</div>
              <textarea
                value={p.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder="e.g. department wants a hardware component, or we already have a dataset on crop yields"
                className="w-full rounded-xl border border-input bg-elevated/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
              />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <Field label="Team size">
              {TEAM.map((s) => (
                <Chip key={s} label={s} active={p.teamSize === s} onClick={() => set("teamSize", s)} />
              ))}
            </Field>
            <Field label="Project duration">
              {DURATION.map((s) => (
                <Chip key={s} label={s} tone="signal" active={p.duration === s} onClick={() => set("duration", s)} />
              ))}
            </Field>
            <Field label="Target complexity">
              {COMPLEXITY.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  tone="accent"
                  active={p.complexity === s}
                  onClick={() => set("complexity", s)}
                />
              ))}
            </Field>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border bg-card/80 px-6 py-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        >
          Back
        </button>
        {last ? (
          <button
            type="button"
            disabled={!stepValid || loading}
            onClick={() => onSubmit(p)}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-signal transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Generating concepts…" : "Generate project concepts"}
          </button>
        ) : (
          <button
            type="button"
            disabled={!stepValid}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Continue
          </button>
        )}
      </div>
    </section>
  );
}
