const AboutPage = () => (
  <div className="mx-auto max-w-3xl px-4 py-16">
    <h1 className="mb-4 text-3xl font-bold">About ProjectForge</h1>
    <p className="mb-4 text-slate-600 dark:text-slate-300">
      ProjectForge started as a way to stop juggling GitHub, Trello, and Discord separately for every group
      project. Instead of three disconnected tools, teams get one workspace where task boards, GitHub activity,
      and team chat all point at the same source of truth.
    </p>
    <p className="mb-4 text-slate-600 dark:text-slate-300">
      We built it for student teams and small dev groups first — the people juggling coursework, capstones, and
      side projects with a rotating cast of teammates and shifting deadlines.
    </p>
    <p className="text-slate-600 dark:text-slate-300">
      Our contribution scoring is intentionally framed as an activity signal, not a verdict on how hard someone
      worked — we'd rather teams have an honest conversation than trust a single number blindly.
    </p>
  </div>
);

export default AboutPage;
