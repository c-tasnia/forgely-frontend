import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Spinner } from "./UI.jsx";

const BAR_LABELS = { tasks: "Tasks", commits: "Commits", prs: "PRs", reviews: "Reviews", activity: "Activity" };

const MemberRow = ({ member }) => (
  <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {member.name?.charAt(0)?.toUpperCase()}
        </span>
        <div>
          <p className="text-sm font-medium">{member.name}</p>
          <p className="text-xs capitalize text-slate-400">{member.role}</p>
        </div>
      </div>
      <span className="text-xl font-bold text-primary">{member.score}%</span>
    </div>
    <div className="space-y-1.5">
      {Object.entries(member.breakdown).map(([key, pct]) => (
        <div key={key}>
          <div className="mb-0.5 flex justify-between text-xs text-slate-400">
            <span>{BAR_LABELS[key]}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContributionPanel = ({ projectId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/projects/${projectId}/contribution`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || "Could not load contribution data"))
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div className="card p-5">
      <h2 className="mb-1 text-sm font-semibold">Contribution</h2>
      <p className="mb-4 text-xs text-slate-400">
        A weighted activity signal (tasks 40% · commits 25% · PRs 20% · reviews 10% · activity 5%) — not a
        measure of actual effort or code quality. Use it as a conversation starter, not a verdict.
      </p>

      {loading && (
        <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
          <Spinner className="h-4 w-4 border-primary" /> Calculating...
        </div>
      )}

      {!loading && error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">{error}</p>
      )}

      {!loading && !error && data && (
        <div className="space-y-3">
          {!data.githubConnected && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              No GitHub repo linked — commit, PR, and review scores are 0 until one's connected. Task and
              activity scores are still accurate.
            </p>
          )}
          {data.members.map((m) => (
            <MemberRow key={m.userId} member={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContributionPanel;
