import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Spinner } from "./UI.jsx";

const PendingInvites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const load = () => {
    api.get("/invites").then(({ data }) => setInvites(data.invites)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const respond = async (invite, action) => {
    setActingId(invite.id);
    try {
      await api.patch(`/invites/${invite.id}/respond`, { action });
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));
    } finally {
      setActingId(null);
    }
  };

  if (loading || invites.length === 0) return null;

  return (
    <div className="card mb-6 p-5">
      <h2 className="mb-3 text-sm font-semibold">Pending invites</h2>
      <div className="space-y-3">
        {invites.map((invite) => (
          <div key={invite.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <div>
              <p className="text-sm font-medium">{invite.project.name}</p>
              <p className="text-xs text-slate-400">
                Invited by {invite.invitedBy.name} · as {invite.role}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                disabled={actingId === invite.id}
                onClick={() => respond(invite, "accept")}
                className="btn-primary flex items-center gap-1 px-3 py-1 text-xs"
              >
                {actingId === invite.id ? <Spinner className="h-3 w-3" /> : "Accept"}
              </button>
              <button
                disabled={actingId === invite.id}
                onClick={() => respond(invite, "decline")}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingInvites;
