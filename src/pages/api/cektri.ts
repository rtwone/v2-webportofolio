import type { NextApiRequest, NextApiResponse } from "next";

function normalizeNumber(number: string) {
  number = String(number || "").trim().replace(/[^\d]/g, "");

  if (number.startsWith("0")) {
    return "62" + number.slice(1);
  }

  if (number.startsWith("8")) {
    return "62" + number;
  }

  return number;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cekTri(msisdn: string) {
  try {
    const response = await fetch(
      "https://tri.co.id/api/v1/information/sim-status",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Origin: "https://tri.co.id",
          Referer: "https://tri.co.id/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome Safari/537.36"
        },
        body: JSON.stringify({
          action: "MSISDN_STATUS_WEB",
          input1: "",
          input2: "",
          language: "ID",
          msisdn
        })
      }
    );

    const body = await response.json();
    const data = body.data || {};

    if (!body.status) {
      return {
        nomor: msisdn,
        iccid: data.iccid || "",
        wilayah: data.retDistrict || "",
        status: data.cardStatus || "Gagal",
        aktivasi: data.activationDate || "",
        masaAktif: data.actEndDate || "",
        registrasi: data.activationStatus || "",
        pesan: data.responseText || body.message || "Gagal mengambil data"
      };
    }

    return {
      nomor: data.msisdn || msisdn,
      iccid: data.iccid || "",
      wilayah: data.retDistrict || "",
      status: data.cardStatus || "Aktif",
      aktivasi: data.activationDate || "",
      masaAktif: data.actEndDate || "",
      registrasi: data.activationStatus || "",
      pesan: ""
    };
  } catch (err: any) {
    return {
      nomor: msisdn,
      iccid: "",
      wilayah: "",
      status: "Error",
      aktivasi: "",
      masaAktif: "",
      registrasi: "",
      pesan: err.message || "Terjadi error"
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan"
    });
  }

  try {
    let { msisdn } = req.body;

    if (!msisdn) {
      return res.status(400).json({
        success: false,
        message: "Nomor tidak boleh kosong"
      });
    }

    let numbers: string[] = [];

    if (Array.isArray(msisdn)) {
      numbers = msisdn;
    } else {
      numbers = String(msisdn).split(/\r?\n|,|;/);
    }

    numbers = [...new Set(numbers.map(normalizeNumber).filter(Boolean))];

    const results = [];

    for (const number of numbers) {
      results.push(await cekTri(number));
      await sleep(900);
    }

    return res.status(200).json({
      success: true,
      total: results.length,
      results
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error"
    });
  }
}
