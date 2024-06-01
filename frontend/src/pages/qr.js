import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../css/qr.css";

const Authqr = () => {
  const [qrCode, setQrCode] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const socket = io("https://qtmr8n-5678.csb.app", {
      path: "/auth/qr",
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to server");
      setConnecting(true);
    });

    socket.on("qr", (data) => {
      console.log("QR code received");
      setQrCode(data);
    });

    socket.on("session", (data) => {
      console.log("Session ID received:", data.sessionId);
      setSessionId(data.sessionId);
      setConnecting(false);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnecting(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {qrCode && (
        <img
          src={`data:image/png;base64,${qrCode}`}
          alt="QR Code"
          className="w-48 h-48 mb-4"
        />
      )}
      {connecting && (
        <div className="flex justify-center items-center mb-4">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ml-2">Connecting...</span>
        </div>
      )}
      {sessionId && (
        <div className="flex justify-center items-center mb-4">
          <span className="text-lg font-bold">Session ID: {sessionId}</span>
          <button
            className="ml-2 text-sm text-blue-500 hover:text-blue-700"
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default Authqr;
