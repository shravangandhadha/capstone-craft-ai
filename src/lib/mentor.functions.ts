import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { generateStructured } from "./ai.server";

export const profileSchema = z.object({
  degree: z.string().min(1),
  semester: z.string().min(1),
  proficiency: z.string().min(1),
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  databases: z.array(z.string()),
  primaryDomain: z.string().min(1),
  secondaryDomain: z.string(),
  careerGoal: z.string().min(1),
  teamSize: z.string().min(1),
  duration: z.string().min(1),
  complexity: z.string().min(1),
  notes: z.string(),
});

export type StudentProfile = z.infer<typeof profileSchema>;

export type ProjectIdea = {
  title: string;
  problem_statement: string;
  proposed_solution: string;
  domains: string[];
  difficulty: string;
  relevance_score: number;
  relevance_reason: string;
  stack_highlights: string[];
};

export type MentorPlan = {
  title: string;
  one_liner: string;
  mvp_features: string[];
  bonus_features: string[];
  user_roles: { name: string; responsibility: string }[];
  tech_stack: {
    frontend: { name: string; purpose: string }[];
    backend: { name: string; purpose: string }[];
    data: { name: string; purpose: string }[];
    third_party: { name: string; purpose: string }[];
  };
  roadmap: { phase: string; title: string; weeks: string; tasks: string[]; deliverable: string }[];
  viva_questions: { question: string; answer_hint: string }[];
  demo_strategy: { minute: string; action: string }[];
};

const str = { type: "string" } as const;
const strArray = { type: "array", items: str } as const;

function obj(properties: Record<string, unknown>) {
  return {
    type: "object",
    additionalProperties: false,
    properties,
    required: Object.keys(properties),
  };
}

const ideasSchema = obj({
  ideas: {
    type: "array",
    items: obj({
      title: str,
      problem_statement: str,
      proposed_solution: str,
      domains: strArray,
      difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
      relevance_score: { type: "number" },
      relevance_reason: str,
      stack_highlights: strArray,
    }),
  },
});

const namedList = {
  type: "array",
  items: obj({ name: str, purpose: str }),
};

const planSchema = obj({
  title: str,
  one_liner: str,
  mvp_features: strArray,
  bonus_features: strArray,
  user_roles: { type: "array", items: obj({ name: str, responsibility: str }) },
  tech_stack: obj({
    frontend: namedList,
    backend: namedList,
    data: namedList,
    third_party: namedList,
  }),
  roadmap: {
    type: "array",
    items: obj({ phase: str, title: str, weeks: str, tasks: strArray, deliverable: str }),
  },
  viva_questions: { type: "array", items: obj({ question: str, answer_hint: str }) },
  demo_strategy: { type: "array", items: obj({ minute: str, action: str }) },
});

function describeProfile(p: StudentProfile) {
  return [
    `Degree program: ${p.degree}`,
    `Current semester: ${p.semester}`,
    `Academic proficiency: ${p.proficiency}`,
    `Known languages: ${p.languages.join(", ") || "not specified"}`,
    `Frameworks: ${p.frameworks.join(", ") || "not specified"}`,
    `Databases: ${p.databases.join(", ") || "not specified"}`,
    `Primary domain interest: ${p.primaryDomain}`,
    `Secondary domain interest: ${p.secondaryDomain || "none"}`,
    `Target job role after graduation: ${p.careerGoal}`,
    `Team size: ${p.teamSize}`,
    `Project duration: ${p.duration}`,
    `Target complexity: ${p.complexity}`,
    `Extra context from student: ${p.notes || "none"}`,
  ].join("\n");
}

const MENTOR_SYSTEM =
  "You are a senior engineering professor and industry architect who mentors final-year capstone projects. " +
  "You are specific, technical and realistic about academic timelines and student skill levels. " +
  "Never propose generic clones (no plain to-do apps, no basic CRUD portals). Titles must read like industry systems, not textbook exercises. " +
  "Always respect the student's stated stack, duration and team size.";

export const generateIdeas = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => profileSchema.parse(input))
  .handler(async ({ data }) => {
    const result = await generateStructured<{ ideas: ProjectIdea[] }>({
      system: MENTOR_SYSTEM,
      schemaName: "project_ideas",
      schema: ideasSchema,
      prompt:
        `Generate exactly 4 distinct, high-impact final-year capstone project concepts for this student.\n\n` +
        `${describeProfile(data)}\n\n` +
        `Rules:\n` +
        `- Each concept must be buildable by the stated team inside the stated duration.\n` +
        `- problem_statement: 2 sentences on the real-world problem.\n` +
        `- proposed_solution: 2 sentences on how the system works operationally.\n` +
        `- domains: 1-2 short tags such as AI/ML, Cybersecurity, Cloud Native, IoT, FinTech.\n` +
        `- relevance_score: integer 60-99, honest fit against skills and career goal.\n` +
        `- relevance_reason: one sentence tying it to their skills and target role.\n` +
        `- stack_highlights: 3-5 concrete technologies.\n` +
        `- Vary difficulty across the set where sensible.`,
    });
    return result.ideas.slice(0, 5);
  });

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        profile: profileSchema,
        idea: z.object({
          title: z.string().min(1),
          problem_statement: z.string(),
          proposed_solution: z.string(),
          domains: z.array(z.string()),
          difficulty: z.string(),
          stack_highlights: z.array(z.string()),
        }),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    return await generateStructured<MentorPlan>({
      system: MENTOR_SYSTEM,
      schemaName: "mentor_plan",
      schema: planSchema,
      prompt:
        `Build the complete mentorship execution plan for the chosen capstone project.\n\n` +
        `Chosen project: ${data.idea.title}\n` +
        `Problem: ${data.idea.problem_statement}\n` +
        `Solution: ${data.idea.proposed_solution}\n` +
        `Domains: ${data.idea.domains.join(", ")}\n` +
        `Difficulty: ${data.idea.difficulty}\n` +
        `Suggested technologies: ${data.idea.stack_highlights.join(", ")}\n\n` +
        `Student profile:\n${describeProfile(data.profile)}\n\n` +
        `Rules:\n` +
        `- mvp_features: 5-6 essential features for a working demo.\n` +
        `- bonus_features: 3-4 stretch goals that earn higher evaluation marks.\n` +
        `- user_roles: 2-4 personas with their responsibility.\n` +
        `- tech_stack: for each layer list 3-4 concrete tools with a short purpose. data covers database, caching and file storage. third_party covers AI models, external services and key libraries.\n` +
        `- roadmap: exactly 4 phases labelled Phase 1..Phase 4 (Planning & Setup, Core MVP Development, Advanced/AI Integration, Testing Deployment & Viva), each with a week range fitting the stated duration, 3-4 concrete tasks, and one deliverable.\n` +
        `- viva_questions: 5 examiner-style questions on trade-offs, scalability and security, each with a short answer hint.\n` +
        `- demo_strategy: 5 steps of a 10-minute live demo, minute field like "0:00-1:30".`,
    });
  });
