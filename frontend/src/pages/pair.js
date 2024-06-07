import React, { useState, useEffect } from "react";
import "../css/pair.css";

const Paircd = () => {
  const [phoneNumber, setPhoneNumber] = useState("+");
  const [pairCode, setPairCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setConnecting(true);
    setError(null);

    if (!phoneNumber) {
      setError("Enter your WhatsApp number with a country code");
      setConnecting(false);
      return;
    } else if (phoneNumber.replace(/[^0-9]/g, "").length < 11) {
      setError("Invalid number format");
      setConnecting(false);
      return;
    }

    try {
      const response = await fetch(
        `/server/pair?number=${phoneNumber.replace(/[^0-9]/g, "")}`,
      );
      const data = await response.json();
      setPairCode(data.code || "Service Unavailable");
    } catch (error) {
      console.error("Error fetching pairing code:", error);
      setError("Failed to fetch pairing code. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairCode);
    alert("Pairing code copied to clipboard!");
  };

  return (
    <div className="authqr-container">
      {loading ? (
        <div className="authqr-loader">
          <div className="authqr-spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </div>
      ) : (
        <div className="authqr-form-container">
          <form onSubmit={handleSubmit} className="authqr-form">
            <label htmlFor="phone" className="authqr-label">
              Phone Number:
            </label>
            <input
              type="tel"
              id="phone"
              className="authqr-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            {error && <div className="authqr-error">{error}</div>}
            <button type="submit" className="authqr-submit-button">
              Get Pairing Code
            </button>
            {connecting && (
              <div className="authqr-connecting">Connecting...</div>
            )}
            {pairCode && !connecting && (
              <div className="authqr-pairing-section">
                <p className="authqr-pair-code">{pairCode}</p>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="authqr-copy-button"
                >
                  Copy Pairing Code
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Paircd;
