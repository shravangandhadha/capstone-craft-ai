import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const liveUrl = process.env.LIVE_URL;

async function fileExists(relativePath) {
  await access(resolve(root, relativePath));
}

async function read(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

test("project contains the required user-facing routes", async () => {
  const routeTree = await read("src/routeTree.gen.ts");
  for (const route of ["'/'", "'/mentor'", "'/profile'", "'/settings'"]) {
    assert.match(routeTree, new RegExp(route.replaceAll("'", "\\'")));
  }
});

test("AI configuration stays server-side", async () => {
  const helper = await read("src/lib/ai.server.ts");
  assert.match(helper, /process\.env\["GEMINI_API_KEY"\]/);
  assert.match(helper, /generativelanguage\.googleapis\.com/);
  assert.doesNotMatch(helper, /LOVABLE_API_KEY|Lovable-API-Key/);
});

test("local secrets are excluded from Git", async () => {
  const gitignore = await read(".gitignore");
  assert.match(gitignore, /^\*\.local$/m);
  await fileExists(".env.example");
});

test("deployment command and model configuration are documented", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  const readme = await read("README.md");
  assert.match(packageJson.scripts["deploy:cloudflare"], /nitro deploy --prebuilt/);
  assert.match(readme, /GEMINI_API_KEY/);
  assert.match(readme, /GEMINI_MODEL/);
});

test("core pages are present", async () => {
  for (const file of [
    "src/components/AppShell.tsx",
    "src/routes/index.tsx",
    "src/routes/mentor.tsx",
    "src/routes/profile.tsx",
    "src/routes/settings.tsx",
  ]) {
    await fileExists(file);
  }
});

if (liveUrl) {
  for (const route of ["/", "/mentor", "/profile", "/settings"]) {
    test(`live route ${route} responds successfully`, async () => {
      const response = await fetch(new URL(route, liveUrl));
      assert.equal(response.status, 200);
    });
  }
}
