import { useEffect, useRef, useState } from "react";
import { Flag, Send } from "lucide-react";
import api from "../lib/axios";
import getSocket from "../services/socket";

export default function GlobalChatPage() {
  const [messages, setMessages] = useState([]); const [text, setText] = useState("");
  const [onlineCount, setOnlineCount] = useState(0); const [error, setError] = useState("");
  const endRef = useRef(null); const socket = getSocket(); const [connected, setConnected] = useState(() => socket.connected);
  useEffect(() => {
    let active = true;
    api.get("/global-chat/messages")
      .then((response) => {
        if (active) setMessages(Array.isArray(response.data?.data) ? response.data.data : []);
      })
      .catch(() => { if (active) setError("Could not load chat history."); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const onConnect = () => setConnected(true); const onDisconnect = () => setConnected(false);
    const onPresence = (data) => setOnlineCount(data.onlineCount);
    const onMessage = (message) => {
      if (!message || typeof message !== "object" || !message._id) return;
      setMessages((items) => [...(Array.isArray(items) ? items : []).filter((item) => item?._id !== message._id), message].slice(-100));
    };
    const onError = (data) => setError(data.message || "Chat error");
    socket.on("connect", onConnect); socket.on("disconnect", onDisconnect); socket.on("global_presence", onPresence); socket.on("global_new_message", onMessage); socket.on("error", onError);
    return () => { socket.off("connect", onConnect); socket.off("disconnect", onDisconnect); socket.off("global_presence", onPresence); socket.off("global_new_message", onMessage); socket.off("error", onError); };
  }, [socket]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const send = (event) => { event.preventDefault(); const message = text.trim(); if (!message || !connected) return; socket.emit("send_global_message", message); setText(""); setError(""); };
  const report = (messageId) => { socket.emit("report_global_message", messageId); setError("Thanks. This message was reported for review."); };
  const visibleMessages = Array.isArray(messages) ? messages : [];
  return <section className="min-h-[calc(100vh-4rem)] bg-surface"><div className="mx-auto max-w-3xl px-5 py-10"><div className="mb-5 flex items-end justify-between"><div><h1 className="text-headline-xl text-primary">Global Chat</h1><p className="mt-1 text-body-sm text-on-surface-variant">Chat with the community · latest 100 messages</p></div><span className="text-label-caps text-secondary">{onlineCount} online</span></div><div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest"><div className="h-[60vh] space-y-4 overflow-y-auto p-5">{visibleMessages.map((message, index) => { const username = message?.user?.username || "Unknown member"; const createdAt = message?.createdAt ? new Date(message.createdAt) : null; const time = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""; return <div key={message?._id || `message-${index}`} className="flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-high text-primary">{message?.user?.avatar ? <img src={message.user.avatar} alt="" className="h-full w-full object-cover" /> : username[0]?.toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-label-caps text-on-surface-variant">{username}{time ? ` · ${time}` : ""}</p><button type="button" aria-label="Report message" title="Report message" onClick={() => report(message?._id)} className="text-on-surface-variant hover:text-error"><Flag size={13} /></button></div><p className="break-words text-body-sm text-on-surface">{typeof message?.text === "string" ? message.text : ""}</p></div></div>; })}<div ref={endRef} /></div>{error && <p role="alert" className="px-4 pb-2 text-body-sm text-error">{error}</p>}<form onSubmit={send} className="flex gap-2 border-t border-outline-variant p-3"><input maxLength={500} value={text} onChange={(e) => setText(e.target.value)} placeholder={connected ? "Write a message (max 500 characters)" : "Connecting…"} disabled={!connected} className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-sm text-on-surface" /><button aria-label="Send message" disabled={!connected || !text.trim()} className="rounded-full bg-primary p-3 text-on-primary disabled:opacity-50"><Send size={18} /></button></form></div></div></section>;
}
