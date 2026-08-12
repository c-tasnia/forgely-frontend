import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import { useSocket } from "../context/SocketContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Spinner } from "./UI.jsx";

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatPanel = ({ projectId, members }) => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState({}); // userId -> name
  const [online, setOnline] = useState([]);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    api.get(`/projects/${projectId}/messages`).then(({ data }) => {
      setMessages(data.messages);
      setLoading(false);
    });
  }, [projectId]);

  useEffect(() => {
    if (!socket || !connected) return;

    socket.emit("project:join", { projectId });

    const onMessage = (msg) => {
      if (msg.projectId !== projectId) return;
      setMessages((prev) => [...prev, msg]);
    };
    const onTyping = ({ userId, name }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: name }));
      setTimeout(() => {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      }, 3000);
    };
    const onPresence = ({ projectId: pid, online: onlineIds }) => {
      if (pid === projectId) setOnline(onlineIds);
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:typing", onTyping);
    socket.on("presence:update", onPresence);

    return () => {
      socket.emit("project:leave", { projectId });
      socket.off("chat:message", onMessage);
      socket.off("chat:typing", onTyping);
      socket.off("presence:update", onPresence);
    };
  }, [socket, connected, projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    socket.emit("chat:message", { projectId, content: input.trim() });
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!socket) return;
    clearTimeout(typingTimeout.current);
    socket.emit("chat:typing", { projectId });
  };

  const typingNames = Object.values(typingUsers).filter((n) => n !== user?.name);

  return (
    <div className="card flex h-[520px] flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Project Chat</h2>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-300"}`} />
          {online.length} online
        </div>
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
          placeholder={members?.length > 1 ? "Message the team... use @name to mention" : "Type a message..."}
          value={input}
          onChange={handleTyping}
          disabled={!connected}
        />
        <button type="submit" disabled={!connected || !input.trim()} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
