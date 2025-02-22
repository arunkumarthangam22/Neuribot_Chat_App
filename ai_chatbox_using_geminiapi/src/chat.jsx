import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBU01FuM1e2mz43-BVvfJG_oFsbh7fw8jM";

const Chatbot = () => {
  const [message, setMessage] = useState([]);

  const [input, setInput] = useState("");

  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleSend = async () => {
    if (!input.trim()) {
      return;
    }

    const newMessages = [...message, { text: input, sender: "user" }];
    setMessage(newMessages);
    setInput("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(input);
      const response = await result.response.text();

      // ✅ Auto-formatting AI response
      const formattedResponse = response
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Convert Markdown bold to HTML bold
        .replace(/\n/g, "<br />") // Preserve line breaks
        .replace(/- (.*?)\n/g, "• $1<br />"); // Convert lists to bullet points

      setMessage([
        ...newMessages,
        { text: formattedResponse, sender: "💡Neuribot" },
      ]);
    } catch (error) {
      console.log("Error fetching response:", error);
      setMessage([
        ...newMessages,
        { text: "error: unable to get the response.", sender: "💡Neuribot" },
      ]);
    }
  };

  return (
    <div
      style={{
        width: "1470px",
        margin: "auto",
        textAlign: "center",
        padding: "10px",
      }}
    >
      <h1 className="heading">💡Neuribot</h1>
      <div
        style={{
          height: "480px",
          width: "1470px",
          overflowY: "auto",
          border: "2px solid gray",
          padding: "10px",
        }}
      >
        {message.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "5px",
            }}
          >
            <strong>{msg.sender === "user" ? "You" : "💡Neuribot"}:</strong>{" "}
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message... "
        style={{ width: "80%", padding: "10px" }}
      />

      <button
        onClick={handleSend}
        style={{ padding: "20px 10px", marginLeft: "10px" }}
      >
        Send
      </button>
    </div>
  );
};

export default Chatbot;
