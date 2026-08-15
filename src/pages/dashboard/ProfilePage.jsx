import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";
import { Spinner } from "../../components/UI.jsx";

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skills: (user?.skills || []).join(", "),
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [githubStatus, setGithubStatus] = useState(null); // "connected" | "error" | null

  useEffect(() => {
    const status = searchParams.get("github");
    if (status) {
      setGithubStatus(status);
      refreshUser().finally(() => {
        searchParams.delete("github");
        setSearchParams(searchParams, { replace: true });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      await api.patch("/auth/me", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { data } = await api.get("/auth/github/connect");
      window.location.href = data.url;
    } catch (err) {
      setGithubStatus("error");
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await api.delete("/auth/github");
      await refreshUser();
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="card space-y-3 p-5">
        <h2 className="text-sm font-semibold">GitHub</h2>
        {githubStatus === "connected" && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            GitHub connected.
          </p>
        )}
        {githubStatus === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Couldn't connect your GitHub account — try again.
          </p>
        )}

        {user?.githubConnected ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Connected as <span className="font-medium text-primary">@{user.githubUsername}</span>
            </p>
            <button onClick={handleDisconnect} disabled={disconnecting} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500">
              {disconnecting ? <Spinner className="h-3 w-3" /> : "Disconnect"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Not connected — needed for accurate contribution scoring.</p>
            <button onClick={handleConnect} disabled={connecting} className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-xs">
              {connecting ? <Spinner className="h-3 w-3" /> : "Connect GitHub"}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-5">
        {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Profile updated.</p>}
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <textarea className="input-field" rows={3} maxLength={300} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Skills</label>
          <input className="input-field" placeholder="React, Node.js, MongoDB" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving && <Spinner />} Save changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
