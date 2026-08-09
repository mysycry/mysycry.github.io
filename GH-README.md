# GitHub Actions — a practical guide (with this repo's real workflows)

> Written to help you understand, explain, and defend the workflows in this repo —
> in an interview, on the job, or just in your own head.
>
> **All 5 workflows live in `.github/workflows/`.** Every example below is copied
> from your actual files, so if you learn these, you can talk about code you own.

---

## 1. What is GitHub Actions?

GitHub Actions is **CI/CD baked into GitHub**. It runs code automatically in
response to events in your repository.

- **CI (Continuous Integration):** every push runs checks — does it build? do the
  tests pass? is the HTML valid? This catches problems *before* they reach users.
- **CD (Continuous Deployment):** when a commit reaches `main`, the site is
  automatically built and deployed to Cloudflare Pages. No manual `drag and drop`.

A workflow is a **YAML file** in `.github/workflows/`. When the file is pushed,
GitHub reads it, provisions a fresh Linux machine (a **runner**), and executes it.

```
push to main ──▶ GitHub reads YAML ──▶ starts a runner ──▶ runs steps ──▶ success/fail
```

If a step fails, the whole job fails and you see a red ✖ in the **Actions** tab —
or a green ✓ if everything passed.

---

## 2. The building blocks (memorize these)

| Concept | What it is | In plain words |
|---|---|---|
| **Workflow** | A `.yml` file in `.github/workflows/` | "The recipe" |
| **Event (`on`)** | What triggers the workflow | "When to cook" |
| **Job** | A unit of work that runs on one runner | "One kitchen station" |
| **Step** | A single command/action inside a job | "One instruction" |
| **Action** | A reusable step published as code (`uses:`) | "A pre-made ingredient" |
| **Runner** | The machine that executes jobs (`runs-on:`) | "The oven" |
| **Secret** | Encrypted value stored in repo settings | "Password manager" |
| **Context** | `${{ ... }}` — info GitHub injects at runtime | "Live data" |

**The single most important mental model:**

> A job = **steps run in order**. If any step exits non-zero, the job fails.
> Steps share one machine (one runner), so files created in step 1 exist in step 2.

---

## 3. Anatomy of a workflow — the syntax you'll see in this repo

### `name`
Just a label. Shows up in the Actions tab and in status badges.

```yaml
name: Deploy to Cloudflare Pages
```

### `on:` — the trigger (the part interviewers love)

Workflows in this repo are triggered by **push**, **pull_request**,
**schedule** (cron), and **workflow_dispatch** (manual). Sometimes combined:

```yaml
on:
  push:
    branches: [main, socmed]
  pull_request:
    branches: [main, socmed]
  schedule:
    - cron: "0 0 * * 1"          # every Monday at 00:00 UTC
  workflow_dispatch:               # adds a "Run workflow" button in the UI
```

- `push` → runs when code is pushed to those branches.
- `pull_request` → runs on the PR itself (useful for "CI check" gates before merge).
- `schedule` → cron format: `minute hour day-of-month month day-of-week`.
  `"0 0 * * 1"` = at 00:00 on Monday. **Caveat:** scheduled workflows only run
  if the workflow is on the *default* branch, and they run on a detached ref.
- `workflow_dispatch` → lets you click a button in the Actions tab to run it on
  demand (great for debugging).

### `paths:` — run only when relevant files change

```yaml
    paths:
      - "**/*.html"
      - "**/*.css"
```

If you only change `README.md`, the HTML/CSS validator **skips** — no wasted
minutes, no noise. This is the "dumb but effective" optimization.

### `concurrency` — don't run the same workflow twice at once

```yaml
concurrency:
  group: cloudflare-pages-${{ github.ref }}
  cancel-in-progress: true
```

If you push twice in a row, the **older run gets cancelled** and only the newest
finishes. `${{ github.ref }}` makes the group unique per branch (e.g. `main` vs `socmed`).

### `permissions` — least privilege

```yaml
permissions:
  contents: read
  deployments: write
```

By default a workflow can do a lot with `GITHUB_TOKEN`. Declaring `permissions`
explicitly is a **security best practice** — you grant only what you need.
The deploy workflow needs `deployments: write` so Cloudflare can mark a deployment;
the other workflows only need `contents: read`.

### `jobs:` — one or more jobs

```yaml
jobs:
  deploy:
    name: Deploy static site
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - ...
```

- `runs-on: ubuntu-latest` → GitHub-hosted Ubuntu runner (you can also use
  `windows-latest`, `macos-latest`, or self-hosted).
- `timeout-minutes` → if the job runs longer than this, it's killed. Prevents
  runaway jobs burning minutes / money.
- Jobs within one workflow run **in parallel by default**; you can force ordering
  with `needs:`. (None of these workflows use `needs` — they're all single-job.)

### `steps:` — the actual work

A step is either **an Action** (`uses:`) or **a shell command** (`run:`).

```yaml
      - name: Checkout code
        uses: actions/checkout@v4
```

`actions/checkout@v4` downloads your repository onto the runner. **Nearly every
workflow starts with this** — without it there's no code to check.

```yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
```

`with:` passes **inputs** to an action (here: "install Node 22"). Actions are like
functions; `with` is their parameters. `@v4` is a **version pin** — don't use a
floating version you don't trust.

```yaml
      - name: Validate HTML
        run: htmlhint "index.html" --format unix
```

`run:` executes arbitrary shell commands. This is where you invoke your own tools.

### Secrets & environments

```yaml
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

- **Secrets** are encrypted variables you configure under
  *Settings → Secrets and variables → Actions*. `${{ secrets.X }}` reads them at
  runtime. They never appear in logs.
- **NEVER hardcode tokens in the YAML.** If a token lands in a file in the repo,
  anyone who can read the repo has it. (A classic "why is your CI insecure?"
  interview answer.)
- `GITHUB_TOKEN` is **auto-created** by GitHub for every run. It's how the
  workflow proves to GitHub "I am this workflow, from this repo." No setup needed.

### Expressions & contexts — `${{ ... }}`

```yaml
group: cloudflare-pages-${{ github.ref }}     # e.g. refs/heads/main
branch: ${{ github.ref_name }}                 # e.g. main
```

- **Expressions** `${{ ... }}` are evaluated by GitHub at runtime (they are *not*
  shell variables — `$VAR` vs `${{ }}` is a classic gotcha).
- **Contexts** are objects you can read: `github.*` (repo, ref, actor, event),
  `secrets.*`, `env.*`, `steps.*`, `matrix.*`, `runner.*`.
- Common interview question: *"What's the difference between `$GITHUB_REF` and
  `${{ github.ref }}`?"* → the first is a plain environment variable set on the
  runner; the second is a GitHub context evaluated by the Actions engine. Both
  usually give you the branch name, but they're different mechanisms.

### Conditionals, errors, and summaries

```yaml
      - name: W3C HTML validation
        continue-on-error: true        # this step's failure won't fail the job
        run: curl ... https://validator.w3.org/nu/
```

```yaml
      - name: Create deployment summary
        if: always()                   # run even if earlier steps failed
        run: |
          echo "- Branch: `${GITHUB_REF_NAME}`" >> "$GITHUB_STEP_SUMMARY"
```

- `continue-on-error: true` → for flaky/informational checks (public W3C APIs).
  The step can fail without failing the whole workflow.
- `if: always()` → normally a failed step skips the rest of the job; `always()`
  overrides that so cleanup/summary steps still run.
- `GITHUB_STEP_SUMMARY` is a **special file** — anything appended to it appears in
  the workflow run's summary page. Free, nice-looking CI reports.

### `shell: bash` and `set -euo pipefail`

```yaml
      - name: Check local image files exist
        shell: bash
        run: |
          set -euo pipefail
```

- `shell: bash` → explicit (default on Linux is already bash, but being explicit
  is clearer and keeps behavior consistent if you ever move runners).
- `set -euo pipefail` → **fail fast**:
  - `-e`: exit on any command error (otherwise the script might "succeed" while
    doing nothing).
  - `-u`: error on undefined variables (catches typos).
  - `o pipefail`: fail if any command in a pipeline fails, not just the last one.
- `run: |` → the **block scalar** in YAML. Everything after `|` (indented) is one
  multi-line string passed to the shell.

### The `if`-on-exit pattern used by the image checker

```bash
missing=0
...
if [[ ! -f "$image" ]]; then
  echo "::error::Missing image reference: $image"
  missing=$((missing + 1))
fi
...
if [[ "$missing" -gt 0 ]]; then
  exit 1
fi
```

- Collect all problems, report them with `::error::` (GitHub annotations appear
  on the code), then exit non-zero so the job fails **once** with all issues shown
  instead of failing on the first one.
- `exit 1` = non-zero exit = GitHub marks the step failed.

---

## 4. Tour of your 5 workflows (interview talking points)

### 4.1 `cloudflare-pages-deploy.yml` — the CD pipeline ⭐ the important one

**Purpose:** Deploy the site to Cloudflare Pages on every push to `main`/`socmed`.

| Line | What it does | Why |
|---|---|---|
| `on.push.branches: [main, socmed]` | Deploy trigger | Auto-deploy on merge = zero manual steps |
| `workflow_dispatch:` | Manual button | Deploy any branch by hand |
| `concurrency` + `cancel-in-progress` | One deploy per branch at a time | Old pushes don't clobber new ones |
| `permissions: contents: read, deployments: write` | Least privilege | Only what Cloudflare needs |
| `actions/checkout@v4` | Grab the code | Prereq for everything |
| `cloudflare/pages-action@v1` | Third-party action | Uploads `directory: .` to the `josiasmichael` project |
| `secrets.*` | Cloudflare credentials | Never in the repo |
| `GITHUB_STEP_SUMMARY` | Report | Humans can read the result in the UI |

**Interview line:** *"Every time a commit lands on `main`, the workflow checks
out the repo, authenticates to Cloudflare with an API token stored as a GitHub
secret, and publishes the folder to my Pages project. It's fully hands-off
deployment."*

### 4.2 `html-css-validation.yml` — a quality gate (CI)

**Purpose:** Reject bad HTML/CSS before it can reach production.

- Triggers only on `.html`/`.css`/workflow changes (`paths`).
- Installs `htmlhint` + `stylelint` globally, generates a config that **relaxes
  rules this codebase doesn't follow** (long hex colors, rgba, camelCase
  keyframes), then validates `index.html` and `styles.css`.
- W3C validators run as **informational** checks (`continue-on-error: true`)
  because the public API is flaky.

**Interview line:** *"The validator fails the build on malformed HTML or CSS, so
the deploy never happens on broken markup. The W3C checks are non-fatal because
an external API can be down through no fault of the code."*

Why relax rules? Stylelint's default config is opinionated (e.g. it *requires*
short hex `#fff`). This codebase deliberately uses `rgba(...)` and long hex. You
**disable the rules you don't want**, keep the rest — CI should enforce *your*
standards, not nag you to death.

### 4.3 `link-checker.yml` — hygiene (links + images + social metadata)

**Purpose:** No dead links (internal or external) in `index.html`, `styles.css`,
`README.md`, `CLOUDFLARE_DEPLOY.md` — **and** no broken image references.

- Uses **lychee** (a fast Rust link checker) via the official
  `lycheeverse/lychee-action`. The `--root-dir .` flag resolves local
  image/asset paths, so a missing `images/...` file fails the build.
- Flags: `--accept 200,204,206,403,429` (403/429 = "exists but rate-limited",
  don't fail on those) and `--exclude 'mailto:'` (email links aren't URLs).
- This **replaced** the old `broken-image-checker.yml`: lychee already validates
  the local `src`/`href` image refs and the remote favicon URL, so the
  hand-rolled `grep -f` checker was redundant.
- Weekly cron + on changes.
- Also verifies social preview metadata (`og:image`, `twitter:image`,
  `twitter:card`) point to the checked-in `images/portfolio-preview.png` —
  absorbing the old `social-media-card.yml`.

**Why it matters:** stale links (e.g. an old `js-dos.com` DOOM URL that used to
be embedded) quietly rot, and a broken `<img>` shows an ugly empty box. A
weekly check catches them automatically.

---

## 5. Why this matters — interview-ready talking points

1. **Automation / no manual steps.** Merge → test → deploy, hands-off. "I never
   manually upload my site; the pipeline does it."
2. **Quality gates.** Validation runs *before* deploy. Broken code can't ship.
3. **Security.** Secrets in `Settings → Secrets`, never hardcoded. Least-privilege
   `permissions`. Version-pinned actions (`@v4`) so supply-chain is predictable.
4. **Efficiency.** `paths` filtering + `concurrency` + `timeout-minutes` save time
   and money. Runs only when relevant, cancelled when superseded, killed if stuck.
5. **Developer experience.** `GITHUB_STEP_SUMMARY`, `::error::` annotations, and
   manual `workflow_dispatch` make results readable and debuggable.
6. **Reproducibility.** Every run starts on a fresh Ubuntu runner — CI is
   deterministic, no "works on my machine."

---

## 6. Quick-fire Q&A practice

**Q: What's the difference between `uses:` and `run:`?**
`uses:` runs a published *Action* (reusable code from the marketplace, versioned,
e.g. `actions/checkout@v4`). `run:` executes shell commands directly in the step.
Use an action when the functionality exists and is maintained; use `run:` for your
own one-off commands.

**Q: What is a runner?**
A machine that executes the workflow. GitHub-hosted (`ubuntu-latest`) spins up a
fresh VM per job; self-hosted runners are machines you manage. Each job gets its
own runner, and files don't carry over between jobs (only via artifacts/caches).

**Q: What are GitHub Secrets?**
Encrypted key/value pairs stored in repo/org settings, exposed to workflows via
`${{ secrets.NAME }}`. They're masked in logs and never committed.

**Q: What is `GITHUB_TOKEN`?**
A temporary token GitHub auto-generates for each run, granting the workflow
permissions to the repo. It dies when the run ends — no key rotation needed.

**Q: What does `paths:` do?**
Limits when a workflow fires to changes in matching files, e.g. only run the CSS
validator when CSS actually changed. Saves CI minutes and reduces noise.

**Q: How do you debug a failing workflow?**
Look at the failed step's logs in the Actions tab; add `--verbose` or `set -x`;
read the `::error::` annotations; re-run with `workflow_dispatch`; temporarily
add a step printing `${{ github }}` / `env` to inspect runtime context; use
`continue-on-error` + `GITHUB_STEP_SUMMARY` to see output even on failure.

**Q: What's a GitHub context?**
A runtime object you read with `${{ }}` — `github.ref`, `github.event`,
`github.actor`, `secrets.*`, `steps.*`, etc. They're how a workflow learns
*what* triggered it and *what's available*.

**Q (stretch): What's a build matrix?**
A way to run a job against multiple configurations at once. E.g.
`matrix.os: [ubuntu, windows]` runs the job twice, once per OS. This repo's
workflows don't use one because they target a single Linux runner, but it's a
standard pattern worth knowing. You read the current combination via
`${{ matrix.os }}`.

---

## 7. Glossary / quick reference

| Term | Meaning |
|---|---|
| `on` | Trigger(s) for the workflow |
| `workflow_dispatch` | Manual run button |
| `schedule` + cron | Timed runs |
| `jobs` | Top-level list of jobs |
| `runs-on` | Runner OS |
| `timeout-minutes` | Job kill switch |
| `steps` | Ordered list of actions/commands |
| `uses` | Invoke a published action |
| `with` | Inputs to an action |
| `run` | Shell command(s) |
| `env` | Environment variables for a step/job/workflow |
| `${{ }}` | Expression/context substitution |
| `secrets` | Encrypted credentials |
| `concurrency` | Prevent parallel duplicate runs |
| `permissions` | Least-privilege token scopes |
| `if:` | Conditionals (e.g. `if: always()`, `if: failure()`) |
| `continue-on-error` | Non-blocking step |
| `GITHUB_STEP_SUMMARY` | Write text to the run summary |
| `::error::` | Emit an inline annotation |

## 8. How to see it in action

1. Go to the repo's **Actions** tab — you'll see all 5 workflows.
2. Click one → latest runs → click a run → each **job** → each **step** with logs.
3. Click **"Run workflow"** (top-right of a `workflow_dispatch` workflow) to fire
   it manually on any branch.
4. Red ✖ = something failed; open the failed step for the error message.
5. Push a broken image path to a branch and watch the Broken Image Checker go red —
   the fastest way to *feel* what CI protects you from.
