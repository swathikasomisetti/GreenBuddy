import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { askMyPlantsAI } from "../api/chatbotApi";
import { FiMinimize2, FiTrash2, FiSend, FiCpu, FiExternalLink } from "react-icons/fi";
import "./AIChatbot.css";

function formatMessageText(text) {
  if (!text) return "";
  return text.split("\n").map((line, i) => {
    // Basic bold parsing: **text**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i} className="chat-line">
        {parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🌿 **Hi! I'm GreenBuddy AI.**\n\nI can check your saved plants, diagnose care symptoms, or answer any botanical questions. How can I help your garden today?"
    }
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "🌿 Chat cleared! What plant question would you like to explore?"
      }
    ]);
  };

  const sendMessage = async (customMessage = null) => {
    const text = customMessage || message;
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text
      }
    ]);

    if (!customMessage) {
      setMessage("");
    }

    try {
      setLoading(true);
      const reply = await askMyPlantsAI(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🌿 I'm having trouble connecting right now. Please verify that the backend server is running on port 8082."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="ai-floating-btn"
        onClick={() => setOpen(!open)}
        title="Chat with GreenBuddy AI"
        aria-label="Open AI Botanist Assistant"
      >
        <span className="btn-icon">🌿</span>
        <span className="btn-badge">AI</span>
      </button>

      {open && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-header">
            <div className="ai-header-info">
              <div className="ai-avatar">🌱</div>
              <div>
                <span className="ai-title">GreenBuddy AI Botanist</span>
                <span className="ai-online-status">
                  <span className="status-dot"></span> Active & Connected
                </span>
              </div>
            </div>
            <div className="ai-header-controls">
              <button
                className="ai-tool-btn"
                onClick={clearChat}
                title="Clear conversation"
              >
                <FiTrash2 />
              </button>
              <button
                className="ai-tool-btn"
                onClick={() => setOpen(false)}
                title="Close chat"
              >
                <FiMinimize2 />
              </button>
            </div>
          </div>

          {/* Banner link to AI Doctor */}
          <div className="ai-doctor-shortcut-banner">
            <span>Have sick leaves?</span>
            <Link to="/ai-doctor" onClick={() => setOpen(false)} className="shortcut-link">
              Open AI Plant Doctor 🩺 <FiExternalLink />
            </Link>
          </div>

          {/* Body */}
          <div className="ai-body">
            {messages.length === 1 && (
              <div className="quick-prompts">
                <span className="prompts-heading">Suggested questions:</span>
                <button onClick={() => sendMessage("How are my plants doing right now?")}>
                  🏡 Check my garden health
                </button>
                <button onClick={() => sendMessage("Which plants need watering today?")}>
                  💧 Who needs water?
                </button>
                <button onClick={() => sendMessage("Which of my plants are safe or toxic to pets?")}>
                  🐶 Pet safety check
                </button>
                <button onClick={() => sendMessage("Why do houseplant leaves turn yellow?")}>
                  🍂 Yellow leaves cause
                </button>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === "user" ? "user-msg" : "bot-msg"}
              >
                {formatMessageText(msg.text)}
              </div>
            ))}

            {loading && (
              <div className="bot-msg typing-msg">
                <span className="typing-dots">
                  <span></span><span></span><span></span>
                </span>
                <span className="typing-label">Consulting botanical records...</span>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

          {/* Footer Input */}
          <div className="ai-footer">
            <input
              type="text"
              value={message}
              placeholder="Ask anything about plant care..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={() => sendMessage()}
              disabled={!message.trim() || loading}
              className="send-btn"
              title="Send message"
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;