const PrivacyPage = () => (
  <div className="mx-auto max-w-3xl px-4 py-16">
    <h1 className="mb-8 text-3xl font-bold">Privacy & Terms</h1>

    <h2 className="mb-2 mt-6 text-lg font-semibold">What we store</h2>
    <p className="text-sm text-slate-600 dark:text-slate-300">
      Account details (name, email, hashed password), project and task data you create, and GitHub metadata
      (commits, PRs, contributors) for repositories you connect.
    </p>

    <h2 className="mb-2 mt-6 text-lg font-semibold">How we use it</h2>
    <p className="text-sm text-slate-600 dark:text-slate-300">
      Solely to run the product — displaying your dashboard, computing project analytics, and sending
      notifications you've opted into. We don't sell data to third parties.
    </p>

    <h2 className="mb-2 mt-6 text-lg font-semibold">Your account</h2>
    <p className="text-sm text-slate-600 dark:text-slate-300">
      You can update or delete your profile at any time from Settings. Deleting your account removes your
      personal data; projects you own can be transferred or archived first.
    </p>
  </div>
);

export default PrivacyPage;
