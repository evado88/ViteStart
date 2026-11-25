import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Titlebar } from "../components/titlebar";
import AppInfo from "../classes/app-info";
import Assist from "../classes/assist";

interface Tutorial {
  id: string;
  title: string;
  order: number;
  filename: string;
  url: string;
  content_type: string;
  size_bytes: number;
  modified: number;
}

// the API returns a relative url ("tutorials/media/..."); prepend the API base
const mediaUrl = (t: Tutorial) => `${AppInfo.apiUrl}${t.url}`;
const sizeMB = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// `publicView` renders the page standalone (for the open /tutorials route linked
// from the login page) with its own header instead of the signed-in app shell.
const Tutorials = ({ publicView = false }: { publicView?: boolean }) => {
  const [items, setItems] = useState<Tutorial[]>([]);
  const [active, setActive] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    Assist.loadData("Tutorials", "tutorials")
      .then((data: any) => {
        if (!alive) return;
        const list = (data || []) as Tutorial[];
        setItems(list);
        setActive(list[0] ?? null);
      })
      .catch((message: any) => {
        if (alive) setError(String(message));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      className="page-content"
      style={
        publicView
          ? { minHeight: "100vh", maxWidth: 1100, margin: "0 auto" }
          : { minHeight: "862px" }
      }
    >
      {publicView ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "18px 16px 6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="material-icons" style={{ color: "#2e8b57" }}>
              ondemand_video
            </span>
            <h2 style={{ margin: 0 }}>OSAWE Village Bank — Video Tutorials</h2>
          </div>
          <Link to="/login" style={{ whiteSpace: "nowrap" }}>
            <i className="fa fa-angle-left" />&nbsp;Back to sign in
          </Link>
        </div>
      ) : (
        <Titlebar title={"Video Tutorials"} />
      )}

      {loading && <p style={{ padding: 16 }}>Loading tutorials…</p>}

      {!loading && error && (
        <p style={{ padding: 16, color: "#b00020" }}>{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="dx-card" style={{ padding: 24, margin: 16 }}>
          <h4 style={{ marginTop: 0 }}>No tutorials yet</h4>
          <p style={{ marginBottom: 0 }}>
            Drop a video file into the tutorials folder on the server and it will
            appear here automatically — no rebuild needed.
          </p>
        </div>
      )}

      {!loading && !error && active && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* player */}
          <div className="dx-card" style={{ padding: 16 }}>
            <video
              key={active.id}
              src={mediaUrl(active)}
              controls
              controlsList="nodownload"
              style={{
                width: "100%",
                maxHeight: "62vh",
                borderRadius: 8,
                background: "#000",
                display: "block",
              }}
            />
            <h3 style={{ margin: "14px 4px 0" }}>{active.title}</h3>
          </div>

          {/* chooser */}
          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {items.map((t) => {
              const selected = active.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t)}
                  className="dx-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    textAlign: "left",
                    cursor: "pointer",
                    border: selected ? "2px solid #2e8b57" : "1px solid #e0e0e0",
                    background: selected ? "#f1f8f3" : "#fff",
                    borderRadius: 8,
                    width: "100%",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      flex: "0 0 auto",
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: selected ? "#2e8b57" : "#eef2f5",
                      color: selected ? "#fff" : "#2e8b57",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    <i className="fa fa-play" />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t.order < 9999 ? `${t.order}. ` : ""}
                      {t.title}
                    </span>
                    <span style={{ display: "block", fontSize: 12, color: "#777" }}>
                      {sizeMB(t.size_bytes)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorials;
