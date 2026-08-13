import { createContext, useContext, useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { useAuth } from "./AuthContext.jsx";

const PusherContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;

export const PusherProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("pf_token");
    if (!user || !token || !PUSHER_KEY) {
      clientRef.current?.disconnect();
      clientRef.current = null;
      setConnected(false);
      return;
    }

    const client = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      channelAuthorization: {
        transport: "ajax",
        endpoint: `${API_BASE}/pusher/auth`,
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    client.connection.bind("connected", () => setConnected(true));
    client.connection.bind("disconnected", () => setConnected(false));
    clientRef.current = client;

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <PusherContext.Provider value={{ pusher: clientRef.current, connected, enabled: Boolean(PUSHER_KEY) }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => useContext(PusherContext);
