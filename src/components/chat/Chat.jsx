import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../../../Socket/SocketContext";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const role = localStorage.getItem("role");
  const [senderMessage, setSenderMessage] = useState("");
  const location = useLocation();
  const data = location.state;
  const socket = useSocket();

  const handleMessage = () => {
    let senderId, receiverId;
    if (role === "seller") {
      senderId = data.sellerItem.sellerAuthId;
      receiverId = data.buyerAuth.id;
    } else {
      senderId = data.buyerAuth.id;
      receiverId = data?.sellerItem.sellerAuthId;
    }

    const newMessage = {
      senderId,
      receiverId,
      role,
      text: senderMessage,
      timestamp: new Date().toISOString(),
      fromSelf: true,
    };

    socket.emit("messageSend", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setSenderMessage("");
  };

  useEffect(() => {
    if (socket) {
      socket.on("messageReceived", (msg) => {
        const newMessage = {
          ...msg,
          timestamp: new Date().toISOString(),
          fromSelf: false,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      if (socket) {
        socket.off("messageReceived");
      }
    };
  }, [socket]);

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold mb-4">Chat</h1>
      </div>

      <div className="flex-1 p-4 bg-white shadow-lg rounded-lg overflow-y-auto">
        {sortedMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.fromSelf ? "justify-end" : "items-start"
            } mb-4`}
          >
            {!msg.fromSelf && msg.receiverData && msg.receiverData[0] && (
              <img
                src={
                  msg.receiverData[0].profilePicture ||
                  "default_profile_image_url"
                }
                alt="Receiver Profile"
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <div
                className={`p-3 rounded-lg ${
                  msg.fromSelf ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              {!msg.fromSelf && msg.receiverData && msg.receiverData[0] && (
                <span className="text-xs text-gray-500">
                  {msg.receiverData[0].userName || "Unknown User"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4">
        <input
          type="text"
          value={senderMessage}
          onChange={(e) => setSenderMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
        />
        <button
          onClick={handleMessage}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
