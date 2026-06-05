import { useState } from "react";

type ResultItem = {
  nomor: string;
  iccid?: string;
  wilayah?: string;
  status?: string;
  aktivasi?: string;
  masaAktif?: string;
  registrasi?: string;
  pesan?: string;
};

export default function CekTri() {
  const [nomor, setNomor] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);

  async function cekNomor() {
    if (!nomor.trim()) return alert("Masukkan nomor dulu");

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/cektri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ msisdn: nomor })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Gagal cek nomor");
        return;
      }

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
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-white to-violet-100 px-4 py-10 text-slate-900">
      <div className="fixed -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-300/50 blur-3xl" />
      <div className="fixed -right-24 top-20 h-96 w-96 rounded-full bg-blue-400/40 blur-3xl" />
      <div className="fixed bottom-0 left-1/3 h-80 w-80 rounded-full bg-yellow-200/50 blur-3xl" />

      <section className="relative mx-auto max-w-5xl">
        <div className="rounded-[34px] border border-white/60 bg-white/40 p-7 shadow-2xl shadow-blue-900/10 backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-3xl font-black text-white shadow-lg">
              3
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Tri SIM Information
              </p>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Cek Kartu Tri
              </h1>
            </div>
          </div>

          <p className="mb-5 max-w-2xl text-sm leading-6 text-slate-600">
            Masukkan satu atau banyak nomor. Pisahkan dengan enter, koma, atau titik koma.
          </p>

          <textarea
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            className="min-h-[150px] w-full resize-y rounded-3xl border border-white/70 bg-white/60 p-5 text-base outline-none backdrop-blur-xl transition focus:ring-4 focus:ring-blue-400/20"
            placeholder={`08988899828
6289512345678
08961234567`}
          />

          <button
            onClick={cekNomor}
            disabled={loading}
            className="mt-4 w-full rounded-3xl bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500 px-6 py-4 font-extrabold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-70"
          >
            {loading ? "Memproses..." : "Cek Sekarang"}
          </button>

          <p className="mt-4 text-xs text-slate-500">
            Gunakan hanya untuk nomor milik sendiri atau nomor yang kamu punya izin untuk cek.
          </p>
        </div>

        {results.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/60 bg-white/40 p-5 shadow-xl backdrop-blur-2xl">
              <p className="text-sm text-slate-500">Total</p>
              <h2 className="text-3xl font-black">{results.length}</h2>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/40 p-5 shadow-xl backdrop-blur-2xl">
              <p className="text-sm text-slate-500">Aktif</p>
              <h2 className="text-3xl font-black">
                {results.filter((x) => x.status === "Aktif").length}
              </h2>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/40 p-5 shadow-xl backdrop-blur-2xl">
              <p className="text-sm text-slate-500">Gagal/Error</p>
              <h2 className="text-3xl font-black">
                {results.filter((x) => x.status !== "Aktif").length}
              </h2>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {results.map((item, i) => {
            const active = item.status === "Aktif";

            return (
              <div
                key={i}
                className="rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-xl shadow-blue-900/10 backdrop-blur-2xl"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h2 className="text-xl font-black">{item.nomor}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.status || "Tidak diketahui"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Info label="Wilayah" value={item.wilayah} full />
                  <Info label="Tanggal Aktivasi" value={item.aktivasi} />
                  <Info label="Masa Aktif" value={item.masaAktif} />
                  <Info label="Registrasi" value={item.registrasi} />
                  <Info label="ICCID" value={maskIccid(item.iccid)} />
                  {item.pesan && <Info label="Pesan" value={item.pesan} full />}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function Info({
  label,
  value,
  full
}: {
  label: string;
  value?: string;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/60 p-4 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <p className="mb-1 text-xs text-slate-500">{label}</p>
      <p className="break-words text-sm font-bold">{value || "-"}</p>
    </div>
  );
}
