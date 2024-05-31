import React, { useState, useEffect } from "react";
import "../css/qr.css";

const Authqr = () => {
  const [qrCode, setQrCode] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource("https://wsnthc-5678.csb.app/auth/qr");

    eventSource.onmessage = (event) => {
      console.log("Event received:", event.data);
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "qr") {
        setQrCode(parsedData.data);
      } else if (parsedData.type === "session") {
        setSessionId(parsedData.data.sessionId);
        setConnecting(false);
      }
    };

    eventSource.onopen = () => {
      console.log("SSE connection opened");
      setConnecting(true);
    };

    eventSource.onerror = () => {
      console.error("SSE connection error");
      setConnecting(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {qrCode && (
        <img
          src={`data:image/png;base64,${qrCode}`} // Ensure that qrCode data is correctly formatted
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
