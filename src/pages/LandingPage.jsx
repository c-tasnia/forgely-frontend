import { Link } from "react-router-dom";

const features = [
  { title: "Kanban Task Boards", desc: "Drag tasks across To Do, In Progress, Review, and Done — built for real team velocity." },
  { title: "GitHub Integration", desc: "Pull commits, PRs, issues, and contributors straight into your project workspace." },
  { title: "Real-Time Chat", desc: "Every project gets its own channel — typing indicators, mentions, and reactions included." },
  { title: "Contribution Insights", desc: "A weighted activity score across tasks, commits, PRs, and reviews — not a leaderboard of vanity metrics." },
];

const stats = [
  { label: "Active teams", value: "1,200+" },
  { label: "Projects shipped", value: "3,400+" },
  { label: "Tasks tracked", value: "48,000+" },
  { label: "Avg. setup time", value: "3 min" },
];

const steps = [
  { title: "Create a project", desc: "Name it, set your stack, connect a repo." },
  { title: "Invite your team", desc: "Assign roles — Owner, Developer, Viewer." },
  { title: "Track everything", desc: "Kanban, chat, GitHub activity, all in one place." },
];

const testimonials = [
  { name: "Tasnia R.", role: "CS Student", quote: "We used ProjectForge for our capstone — the contribution tracking made grading group work so much fairer." },
  { name: "Rahim K.", role: "Backend Dev", quote: "Finally a tool that ties GitHub activity to actual task progress instead of two disconnected dashboards." },
  { name: "Nabila S.", role: "UI/UX Designer", quote: "The Kanban board plus chat means I never have to leave the project workspace." },
];

const faqs = [
  { q: "Is ProjectForge free for students?", a: "Yes — the core platform is free for individual students and small teams." },
  { q: "Does it replace GitHub?", a: "No, it connects to your existing GitHub repos and layers project management on top." },
  { q: "Can I use it for non-coding projects?", a: "Yes, GitHub integration is optional — Kanban, chat, and analytics work standalone." },
];

const LandingPage = () => (
  <div>
    {/* Hero */}
    <section className="flex min-h-[65vh] flex-col items-center justify-center gap-6 bg-gradient-to-b from-primary/10 to-transparent px-4 text-center dark:from-primary/20">
      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
        GitHub + Trello + Discord, in one workspace
      </span>
      <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
        Build your project. <span className="text-primary">Build your team.</span>
      </h1>
      <p className="max-w-xl text-slate-600 dark:text-slate-300">
        ProjectForge helps student and developer teams plan tasks, track GitHub activity, chat in real time,
        and see who's actually contributing.
      </p>
      <div className="flex gap-3">
        <Link to="/register" className="btn-primary">Get started free</Link>
        <Link to="/login" className="btn-secondary">I have an account</Link>
      </div>
    </section>

    {/* Stats */}
    <section className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-2xl font-bold text-primary">{s.value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
        </div>
      ))}
    </section>

    {/* Features */}
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-2 text-center text-3xl font-bold">Everything your team needs</h2>
      <p className="mx-auto mb-10 max-w-lg text-center text-slate-500 dark:text-slate-400">
        One workspace instead of five disconnected tools.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="card p-6">
            <h3 className="mb-2 font-semibold text-primary">{f.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="bg-slate-50 py-16 dark:bg-slate-900/40">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-10 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mb-1 font-semibold">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Contribution tracking highlight */}
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="card grid gap-8 p-8 sm:grid-cols-2 sm:items-center">
        <div>
          <h2 className="mb-3 text-2xl font-bold">Contribution scoring, done responsibly</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            We weigh tasks completed, commits, PRs, and reviews into a single activity score. It's a signal for
            project activity, not a verdict on how hard someone worked — code quality still needs a human eye.
          </p>
        </div>
        <div className="space-y-2">
          {[
            ["Tasks completed", 82],
            ["Commits", 74],
            ["Pull requests", 68],
            ["Reviews", 55],
          ].map(([label, pct]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{label}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="bg-slate-50 py-16 dark:bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-center text-3xl font-bold">Teams shipping with ProjectForge</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">"{t.quote}"</p>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Frequently asked questions</h2>
      <div className="space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="card p-4">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.a}</p>
          </details>
        ))}
      </div>
    </section>

    {/* Newsletter / CTA */}
    <section className="bg-primary py-16 text-center text-white">
      <h2 className="mb-3 text-2xl font-bold">Ready to forge your next project?</h2>
      <p className="mb-6 text-sm text-white/80">Join teams already shipping faster with ProjectForge.</p>
      <Link to="/register" className="rounded-lg bg-white px-5 py-2 font-medium text-primary">
        Create your free account
      </Link>
    </section>
  </div>
);

export default LandingPage;
