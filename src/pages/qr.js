import React, { useState, useEffect } from "react";
import "../css/qr.css";

const Authqr = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    fetch("/server/qr")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const qrCode = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
        setQrCode(qrCode);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching QR code:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {qrCode && (
        <div className="relative">
          <img
            src={`data:image/png;base64,${qrCode}`}
            alt="QR Code"
            className="w-96 h-96 mb-4"
          />
        </div>
      )}
      {loading && (
        <div className="loader">
          <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authqr;
