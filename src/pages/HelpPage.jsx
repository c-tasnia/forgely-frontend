const topics = [
  { q: "How do I invite a teammate?", a: "Open your project, go to Members, and invite by email. They'll see the invite in their Notifications." },
  { q: "Can I change someone's role after inviting them?", a: "Yes — the project owner can update a member's role from the project's Members panel." },
  { q: "How is the contribution score calculated?", a: "It blends tasks completed, GitHub commits, PRs, and code reviews. See the About page for the full breakdown." },
  { q: "How do I connect my GitHub repo?", a: "Add the repository URL when creating or editing a project. Full commit/PR sync uses the GitHub API." },
];

const HelpPage = () => (
  <div className="mx-auto max-w-3xl px-4 py-16">
    <h1 className="mb-8 text-3xl font-bold">Help & Support</h1>
    <div className="space-y-4">
      {topics.map((t) => (
        <details key={t.q} className="card p-4">
          <summary className="cursor-pointer font-medium">{t.q}</summary>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.a}</p>
        </details>
      ))}
    </div>
    <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
      Still stuck? Reach out on the <a href="/contact" className="text-primary">Contact</a> page.
    </p>
  </div>
);

export default HelpPage;
