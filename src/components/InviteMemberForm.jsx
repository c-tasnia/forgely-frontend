import { useState } from "react";
import api from "../api/axios.js";
import { Spinner } from "./UI.jsx";

const InviteMemberForm = ({ projectId, onInvited }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("developer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post(`/projects/${projectId}/invites`, { email: email.trim(), role });
      setSuccess(`Invite sent to ${email.trim()}`);
      setEmail("");
      onInvited?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send invite");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <button className="btn-secondary text-sm" onClick={() => setOpen((o) => !o)}>
        {open ? "Cancel" : "+ Invite member"}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="absolute right-0 top-full z-20 mt-2 w-72 space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          <div>
            <label className="mb-1 block text-xs font-medium">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="teammate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Role</label>
            <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-emerald-600 dark:text-emerald-400">{success}</p>}
          <button type="submit" disabled={submitting || !email.trim()} className="btn-primary flex w-full items-center justify-center gap-2 text-sm">
            {submitting ? <Spinner className="h-4 w-4" /> : "Send invite"}
          </button>
          <p className="text-[11px] text-slate-400">The person needs an existing Forgely account with this email.</p>
        </form>
      )}
    </div>
  );
};

export default InviteMemberForm;
