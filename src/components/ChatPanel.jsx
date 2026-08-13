import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import { usePusher } from "../context/PusherContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Spinner } from "./UI.jsx";

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatPanel = ({ projectId }) => {
  const { user } = useAuth();
  const { pusher, connected, enabled } = usePusher();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // userId -> name
  const [online, setOnline] = useState(0);
  const bottomRef = useRef(null);
  const lastTypingSent = useRef(0);

  useEffect(() => {
    api.get(`/projects/${projectId}/messages`).then(({ data }) => {
      setMessages(data.messages);
      setLoading(false);
    });
  }, [projectId]);

  useEffect(() => {
    if (!pusher || !connected) return;

    const channel = pusher.subscribe(`presence-project-${projectId}`);

    const onMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const onTyping = ({ userId, name }) => {
      if (userId === user?.id) return;
      setTypingUsers((prev) => ({ ...prev, [userId]: name }));
      setTimeout(() => {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      }, 3000);
    };
    const updateCount = () => setOnline(channel.members?.count || 0);

    channel.bind("pusher:subscription_succeeded", updateCount);
    channel.bind("pusher:member_added", updateCount);
    channel.bind("pusher:member_removed", updateCount);
    channel.bind("chat:message", onMessage);
    channel.bind("chat:typing", onTyping);

    return () => {
      pusher.unsubscribe(`presence-project-${projectId}`);
    };
  }, [pusher, connected, projectId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await api.post(`/projects/${projectId}/messages`, { content: input.trim() });
      setInput("");
    } catch {
      // message just won't appear — the input keeps the draft so the user can retry
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    const now = Date.now();
    if (now - lastTypingSent.current > 2000) {
      lastTypingSent.current = now;
      api.post(`/projects/${projectId}/typing`).catch(() => {});
    }
  };

  const typingNames = Object.values(typingUsers);

  return (
    <div className="card flex h-[520px] flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Project Chat</h2>
        {enabled ? (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-300"}`} />
            {online} online
          </div>
        ) : (
          <span className="text-xs text-slate-400">Real-time not configured</span>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="h-6 w-6 border-primary" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No messages yet — say hi to your team.</p>
        ) : (
          messages.map((m) => {
            const isMe = m.sender.id === user?.id;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                  {!isMe && <p className="mb-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{m.sender.name}</p>}
                  <div className={`inline-block rounded-2xl px-3 py-2 text-sm ${isMe ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-700"}`}>
                    {m.content}
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-400">{formatTime(m.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {typingNames.length > 0 && (
        <p className="mb-1 text-xs italic text-slate-400">{typingNames.join(", ")} typing...</p>
      )}

      <form onSubmit={handleSend} className="mt-2 flex gap-2">
        <input
          className="input-field flex-1"
          placeholder="Message the team... use @name to mention"
          value={input}
          onChange={handleTyping}
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary">
          {sending ? <Spinner /> : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
