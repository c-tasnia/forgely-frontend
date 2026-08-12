import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";
import { Spinner } from "../../components/UI.jsx";

const ProfilePage = () => {
  const { user, login } = useAuth(); // eslint-disable-line no-unused-vars
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skills: (user?.skills || []).join(", "),
    githubUsername: user?.githubUsername || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

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
        <div>
          <label className="mb-1 block text-sm font-medium">GitHub username</label>
          <input className="input-field" value={form.githubUsername} onChange={(e) => setForm({ ...form, githubUsername: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving && <Spinner />} Save changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
