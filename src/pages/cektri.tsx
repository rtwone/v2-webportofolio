import { useState } from "react";

export default function CekTri() {
  const [nomor, setNomor] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function cekNomor() {
    if (!nomor.trim()) return alert("Masukkan nomor dulu");

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/cektri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msisdn: nomor }),
      });

      const data = await res.json();
      setResults(data.results || []);
    } catch {
      alert("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  function maskIccid(iccid?: string) {
    if (!iccid) return "-";
    return iccid.slice(0, 6) + "****" + iccid.slice(-4);
  }

  return (
    <>
      <main className="page">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <section className="glass hero">
          <div className="brand">
            <div className="logo">3</div>
            <div>
              <p>Tri SIM Information</p>
              <h1>Cek Kartu Tri</h1>
            </div>
          </div>

          <p className="desc">
            Masukkan satu atau banyak nomor. Pisahkan dengan enter, koma, atau titik koma.
          </p>

          <textarea
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            placeholder={`08988899828\n6289512345678\n08961234567`}
          />

          <button onClick={cekNomor} disabled={loading}>
            {loading ? "Memproses..." : "Cek Sekarang"}
          </button>

          <small>
            Gunakan hanya untuk nomor milik sendiri atau nomor yang kamu punya izin untuk cek.
          </small>
        </section>

        {results.length > 0 && (
          <section className="summary">
            <div className="glass mini">
              <span>Total</span>
              <b>{results.length}</b>
            </div>
            <div className="glass mini">
              <span>Aktif</span>
              <b>{results.filter((x) => x.status === "Aktif").length}</b>
            </div>
            <div className="glass mini">
              <span>Gagal/Error</span>
              <b>{results.filter((x) => x.status !== "Aktif").length}</b>
            </div>
          </section>
        )}

        <section className="results">
          {results.map((item, i) => (
            <div className="result glass" key={i}>
              <div className="top">
                <h2>{item.nomor}</h2>
                <span className={item.status === "Aktif" ? "badge active" : "badge off"}>
                  {item.status || "Tidak diketahui"}
                </span>
              </div>

              <div className="grid">
                <Info label="Wilayah" value={item.wilayah} full />
                <Info label="Tanggal Aktivasi" value={item.aktivasi} />
                <Info label="Masa Aktif" value={item.masaAktif} />
                <Info label="Registrasi" value={item.registrasi} />
                <Info label="ICCID" value={maskIccid(item.iccid)} />
                {item.pesan && <Info label="Pesan" value={item.pesan} full />}
              </div>
            </div>
          ))}
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 40px 18px;
          background:
            radial-gradient(circle at 10% 10%, #b5ffe8, transparent 30%),
            radial-gradient(circle at 90% 20%, #b9c6ff, transparent 35%),
            radial-gradient(circle at 50% 90%, #fff0b8, transparent 35%),
            linear-gradient(135deg, #f8fbff, #eef5ff);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #102033;
          overflow: hidden;
        }

        .glass {
          background: rgba(255, 255, 255, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          box-shadow: 0 25px 70px rgba(31, 58, 105, 0.18);
        }

        .hero {
          position: relative;
          max-width: 980px;
          margin: auto;
          padding: 30px;
          border-radius: 34px;
        }

        .brand {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .logo {
          width: 58px;
          height: 58px;
          border-radius: 20px;
          display: grid;
          place-items: center;
          font-size: 30px;
          font-weight: 900;
          color: white;
          background: linear-gradient(145deg, #9b5cff, #4f8cff);
        }

        .brand p {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #64748b;
        }

        h1 {
          margin: 0;
          font-size: 52px;
          letter-spacing: -0.05em;
        }

        .desc {
          max-width: 650px;
          color: #64748b;
          line-height: 1.6;
        }

        textarea {
          width: 100%;
          min-height: 150px;
          resize: vertical;
          border: 1px solid rgba(255,255,255,.8);
          outline: none;
          border-radius: 24px;
          padding: 18px;
          font-size: 16px;
          background: rgba(255,255,255,.65);
        }

        button {
          width: 100%;
          margin-top: 16px;
          border: 0;
          border-radius: 22px;
          padding: 17px;
          color: white;
          font-weight: 900;
          cursor: pointer;
          background: linear-gradient(135deg, #2ee59d, #4f8cff, #9b5cff);
        }

        small {
          display: block;
          margin-top: 14px;
          color: #64748b;
        }

        .summary {
          max-width: 980px;
          margin: 18px auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .mini {
          border-radius: 24px;
          padding: 18px;
        }

        .mini span {
          display: block;
          color: #64748b;
          font-size: 13px;
        }

        .mini b {
          font-size: 30px;
        }

        .results {
          max-width: 980px;
          margin: 18px auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .result {
          border-radius: 28px;
          padding: 20px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .top h2 {
          margin: 0;
          font-size: 20px;
        }

        .badge {
          height: fit-content;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .active {
          background: #dcfce7;
          color: #166534;
        }

        .off {
          background: #ffe4e6;
          color: #9f1239;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .info {
          padding: 14px;
          border-radius: 18px;
          background: rgba(255,255,255,.58);
          border: 1px solid rgba(255,255,255,.55);
        }

        .full {
          grid-column: 1 / -1;
        }

        .label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .value {
          font-size: 14px;
          font-weight: 800;
          word-break: break-word;
        }

        @media (max-width: 760px) {
          h1 {
            font-size: 36px;
          }

          .summary,
          .results {
            grid-template-columns: 1fr;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

function Info({ label, value, full }: any) {
  return (
    <div className={full ? "info full" : "info"}>
      <div className="label">{label}</div>
      <div className="value">{value || "-"}</div>
    </div>
  );
}
