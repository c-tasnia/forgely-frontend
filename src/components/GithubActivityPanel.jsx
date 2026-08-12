import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Spinner } from "./UI.jsx";

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const GithubActivityPanel = ({ projectId, hasRepo }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasRepo) { setLoading(false); return; }
    api
      .get(`/projects/${projectId}/github`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || "Could not load GitHub activity"))
      .finally(() => setLoading(false));
  }, [projectId, hasRepo]);

  if (!hasRepo) return null;

  return (
    <div className="card p-5">
      <h2 className="mb-4 text-sm font-semibold">GitHub Activity</h2>

      {loading && (
        <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
          <Spinner className="h-4 w-4 border-primary" /> Loading repo activity...
        </div>
      )}

      {!loading && error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">{error}</p>
      )}

      {!loading && !error && data && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xl font-bold text-primary">{data.openPRs}</p>
              <p className="text-xs text-slate-400">Open PRs</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{data.openIssues}</p>
              <p className="text-xs text-slate-400">Open issues</p>
            </div>
            <div>
              <p className="text-xl font-bold text-accent">{data.contributors.length}</p>
              <p className="text-xs text-slate-400">Contributors</p>
            </div>
            <div>
              <p className="text-xl font-bold text-accent">{data.commits.length}</p>
              <p className="text-xs text-slate-400">Recent commits</p>
            </div>
          </div>

          {data.contributors.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Contributors</p>
              <div className="space-y-2">
                {data.contributors.map((c) => {
                  const max = data.contributors[0].contributions || 1;
                  return (
                    <a key={c.login} href={c.url} target="_blank" rel="noreferrer" className="block">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600 dark:text-slate-300">{c.login}</span>
                        <span className="text-slate-400">{c.contributions} commits</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className="h-1.5 rounded-full bg-accent" style={{ width: `${(c.contributions / max) * 100}%` }} />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {data.commits.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Recent commits</p>
              <div className="space-y-2">
                {data.commits.slice(0, 5).map((c) => (
                  <a
                    key={c.sha}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <span className="truncate">{c.message}</span>
                    <span className="shrink-0 text-xs text-slate-400">{c.author} · {timeAgo(c.date)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <a href={data.repo.url} target="_blank" rel="noreferrer" className="inline-block text-xs text-primary">
            View full repository →
          </a>
        </div>
      )}
    </div>
  );
};

export default GithubActivityPanel;
