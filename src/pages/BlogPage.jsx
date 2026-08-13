const posts = [
  { title: "Why we stopped scoring contribution by commit count alone", date: "Jul 2026", excerpt: "Commits are a terrible proxy for effort — here's what we weighted instead." },
  { title: "Running a capstone team through ProjectForge", date: "Jun 2026", excerpt: "A four-person team's workflow from kickoff to final submission." },
  { title: "Kanban vs. sprints for student teams", date: "May 2026", excerpt: "Why short-lived teams usually do better with a lightweight board than full Scrum." },
];

const BlogPage = () => (
  <div className="mx-auto max-w-3xl px-4 py-16">
    <h1 className="mb-8 text-3xl font-bold">Blog</h1>
    <div className="space-y-6">
      {posts.map((p) => (
        <article key={p.title} className="card p-5">
          <p className="mb-1 text-xs text-slate-400">{p.date}</p>
          <h2 className="mb-2 font-semibold text-primary">{p.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{p.excerpt}</p>
        </article>
      ))}
    </div>
  </div>
);

export default BlogPage;
