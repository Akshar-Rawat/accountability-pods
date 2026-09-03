import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import getSocket from "../services/socket";
import api from "../lib/axios";
import usePodStore from "../stores/podStore";

const ChatPanel = ({ podId, currentUserId }) => {
  const { handleMemberCheckedIn: updateStreaks } = usePodStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const socket = getSocket();
  const [isConnected, setIsConnected] = useState(() => socket?.connected ?? false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/pods/${podId}/messages`);
        setMessages(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load messages");
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [podId]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit("join_pod", podId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleMemberCheckedIn = (data) => {
      updateStreaks(data);
      setMessages((prev) => [...prev, data.systemMessage]);
    };

    const handleError = (error) => {
      console.error("Socket error:", error);
      setError(error.message || "Connection error");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("new_message", handleNewMessage);
    socket.on("member_checked_in", handleMemberCheckedIn);
    socket.on("error", handleError);

    if (socket.connected) {
      socket.emit("join_pod", podId);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("new_message", handleNewMessage);
      socket.off("member_checked_in", handleMemberCheckedIn);
      socket.off("error", handleError);
    };
  }, [socket, podId, updateStreaks]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    socket.emit("send_message", {
      podId,
      text: newMessage.trim(),
    });

    setNewMessage("");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container p-6">
        <div className="h-8 w-32 bg-surface-container-high rounded animate-pulse mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface-container-low rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-error bg-error-container p-6">
        <p className="text-body-sm text-error mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-body-sm font-semibold text-error hover:underline"
        >
          Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container overflow-hidden">
      <div className="border-b border-outline-variant px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">Pod Chat</h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-teal-600" : "bg-error"
              }`}
            ></div>
            <span className="text-label-caps text-on-surface-variant">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-body-md text-on-surface-variant">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.user?._id === currentUserId;
            const isSystemMessage = message.type === "system";

            return (
              <div
                key={message._id}
                className={`flex ${
                  isSystemMessage
                    ? "justify-center"
                    : isOwnMessage
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {isSystemMessage ? (
                  <div className="bg-surface-container-low px-4 py-3 rounded-full text-center">
                    <p className="text-body-sm text-on-surface-variant mb-2">
                      {message.text}
                    </p>
                    {message.photoUrl && (
                      <img 
                        src={message.photoUrl} 
                        alt="Proof" 
                        className="h-32 w-32 object-cover rounded-lg mx-auto"
                      />
                    )}
                  </div>
                ) : (
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {message.user.avatar ? (
                      <img
                        src={message.user.avatar}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-body-sm font-semibold text-on-surface flex-shrink-0">
                        {message.user.username?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div
                      className={`flex flex-col ${
                        isOwnMessage ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwnMessage
                            ? "bg-secondary text-on-secondary"
                            : "bg-surface-container-low text-on-surface"
                        }`}
                      >
                        <p className="text-body-sm">{message.text}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-label-caps text-on-surface-variant">
                          {message.user.username}
                        </span>
                        <span className="text-label-caps text-on-surface-variant">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t border-outline-variant p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="rounded-lg bg-secondary px-4 py-2 text-body-sm font-medium text-on-secondary hover:bg-secondary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
