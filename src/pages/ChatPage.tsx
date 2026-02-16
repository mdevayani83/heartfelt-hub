import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Send, ArrowLeft } from "lucide-react";

const ChatPage = () => {
  const { recipientId, productId } = useParams();
  const { user, messages, products, sendMessage } = useApp();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const product = products.find((p) => p.id === Number(productId));

  const conversation = messages.filter(
    (m) =>
      m.productId === Number(productId) &&
      ((m.senderId === user?.username && m.receiverId === recipientId) ||
        (m.senderId === recipientId && m.receiverId === user?.username))
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !recipientId) return;
    sendMessage(recipientId, Number(productId), text.trim());
    setText("");
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col animate-fade-in" style={{ height: "calc(100vh - 200px)" }}>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Link to={-1 as any} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Chat with {recipientId}</h1>
          {product && <p className="text-sm text-muted-foreground">Re: {product.name}</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-soft">
        {conversation.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No messages yet. Say hello!</p>
        ) : (
          <div className="space-y-3">
            {conversation.map((msg) => {
              const isMine = msg.senderId === user?.username;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                    isMine ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`mt-1 text-[10px] ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-primary-foreground transition-all hover:opacity-90">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
