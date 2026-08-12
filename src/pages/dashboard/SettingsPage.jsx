import { useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="card space-y-4 p-5">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm">Dark mode</span>
          <button onClick={toggleTheme} className="btn-secondary px-3 py-1 text-xs">
            {theme === "dark" ? "Switch to light" : "Switch to dark"}
          </button>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <label className="flex items-center justify-between text-sm">
          Email notifications
          <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between text-sm">
          Task deadline reminders
          <input type="checkbox" checked={taskReminders} onChange={(e) => setTaskReminders(e.target.checked)} />
        </label>
        <p className="text-xs text-slate-400">
          These toggles are local-only for now — persisting them needs a `notificationPreferences` field on User.
        </p>
      </div>

      <div className="card p-5">
        <h2 className="mb-3 text-sm font-semibold text-red-500">Danger zone</h2>
        <button onClick={logout} className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
          Log out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
