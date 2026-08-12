const ACCENT_CLASSES = {
  primary: "text-primary",
  accent: "text-accent",
  slate: "text-slate-700 dark:text-slate-200",
};

export const StatCard = ({ label, value, hint, accent = "primary" }) => (
  <div className="card p-5">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${ACCENT_CLASSES[accent] || ACCENT_CLASSES.primary}`}>{value}</p>
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

export const SkeletonCard = () => (
  <div className="card animate-pulse p-4">
    <div className="mb-3 h-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
    <div className="mb-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
    <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
  </div>
);

export const Spinner = ({ className = "h-5 w-5" }) => (
  <div className={`${className} animate-spin rounded-full border-2 border-white border-t-transparent`} />
);
