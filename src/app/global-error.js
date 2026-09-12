"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#faf4ea",
            fontFamily: "serif",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              background: "white",
              borderRadius: "1.5rem",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", color: "#2b1b12", marginBottom: "0.5rem" }}>
              Application error
            </h2>
            <p style={{ color: "#5a4a3a", marginBottom: "1.5rem" }}>
              The app failed to load. Please refresh the page.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: "0.625rem 1.25rem",
                background: "#c1552c",
                color: "white",
                border: "none",
                borderRadius: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}