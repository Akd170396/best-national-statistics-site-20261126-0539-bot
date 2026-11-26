/* NusaData — data.js
   Angka-angka publik Indonesia. Setiap angka mencantumkan sumber dan tahun
   pada tampilannya. Disusun dari publikasi Badan Pusat Statistik (BPS)
   dan Survei Status Gizi Indonesia (SSGI) Kementerian Kesehatan. */
"use strict";

var NUSADATA = (function () {
  var YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

  /* Tren tahunan 2019-2024. */
  var SERIES = {
    penduduk: {
      label: "Jumlah penduduk",
      unit: "juta jiwa",
      fmt: function (v) { return v.toFixed(2).replace(".", ",") + " jt"; },
      values: { 2019: 268.07, 2020: 270.20, 2021: 272.68, 2022: 275.77, 2023: 278.69, 2024: 281.60 },
      source: "BPS, 2024 (hasil Sensus Penduduk 2020 dan proyeksi penduduk)"
    },
    pdb: {
      label: "Pertumbuhan ekonomi (PDB)",
      unit: "% (y-on-y)",
      fmt: function (v) { return v.toFixed(2).replace(".", ",") + "%"; },
      values: { 2019: 5.02, 2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
      source: "BPS, Berita Resmi Statistik, Februari 2025"
    },
    inflasi: {
      label: "Inflasi (Desember, y-on-y)",
      unit: "%",
      fmt: function (v) { return v.toFixed(2).replace(".", ",") + "%"; },
      values: { 2019: 2.72, 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
      source: "BPS, Berita Resmi Statistik, Januari 2025"
    },
    miskin: {
      label: "Tingkat kemiskinan (September)",
      unit: "% penduduk",
      fmt: function (v) { return v.toFixed(2).replace(".", ",") + "%"; },
      values: { 2019: 9.22, 2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
      source: "BPS, Profil Kemiskinan, 2024"
    },
    tpt: {
      label: "Tingkat pengangguran terbuka (Agustus)",
      unit: "% angkatan kerja",
      fmt: function (v) { return v.toFixed(2).replace(".", ",") + "%"; },
      values: { 2019: 5.28, 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.76 },
      source: "BPS, Keadaan Ketenagakerjaan, Agustus 2024"
    },
    ipm: {
      label: "Indeks Pembangunan Manusia",
      unit: "skala 0-100",
      fmt: function (v) { return v.toFixed(2).replace(".", ","); },
      values: { 2019: 71.92, 2020: 71.94, 2021: 72.29, 2022: 72.91, 2023: 74.39, 2024: 75.02 },
      source: "BPS, Indeks Pembangunan Manusia, 2024"
    },
    ahh: {
      label: "Umur harapan hidup saat lahir",
      unit: "tahun",
      fmt: function (v) { return v.toFixed(2).replace(".", ",") + " thn"; },
      values: { 2019: 71.34, 2020: 71.47, 2021: 71.57, 2022: 71.85, 2023: 73.93, 2024: 73.98 },
      source: "BPS, Indeks Pembangunan Manusia, 2024"
    },
    gini: {
      label: "Rasio gini (Maret)",
      unit: "skala 0-1",
      fmt: function (v) { return v.toFixed(3).replace(".", ","); },
      values: { 2019: 0.380, 2020: 0.381, 2021: 0.381, 2022: 0.379, 2023: 0.379, 2024: 0.379 },
      source: "BPS, Gini Ratio, Maret 2024"
    },
    hls: {
      label: "Harapan lama sekolah",
      unit: "tahun",
      fmt: function (v) { return v.toFixed(2).replace(".", ",") + " thn"; },
      values: { 2019: 12.95, 2020: 13.00, 2021: 13.08, 2022: 13.10, 2023: 13.21, 2024: 13.21 },
      source: "BPS, Indeks Pembangunan Manusia, 2024"
    },
    rls: {
      label: "Rata-rata lama sekolah",
      unit: "tahun",
      fmt: function (v) { return v.toFixed(2).replace(".", ",") + " thn"; },
      values: { 2019: 8.34, 2020: 8.48, 2021: 8.54, 2022: 8.69, 2023: 8.77, 2024: 9.10 },
      source: "BPS, Indeks Pembangunan Manusia, 2024"
    },
    stunting: {
      label: "Prevalensi stunting balita",
      unit: "% balita",
      fmt: function (v) { return v.toFixed(1).replace(".", ",") + "%"; },
      values: { 2019: 27.7, 2020: 24.4, 2021: 24.4, 2022: 21.6, 2023: 21.5, 2024: 19.8 },
      source: "SSGI Kementerian Kesehatan, 2024"
    }
  };

  /* Kartu angka utama di beranda (angka terbaru, 2024). */
  var KPI = [
    { key: "penduduk", value: "281,6", unit: "juta jiwa", delta: "+1,04% dari 2023", dir: "up", source: "Sumber: BPS, 2024" },
    { key: "pdb", value: "5,03", unit: "% PDB", delta: "Tumbuh 5,03% pada 2024", dir: "up", source: "Sumber: BPS, 2024" },
    { key: "inflasi", value: "1,57", unit: "% inflasi", delta: "Turun dari 2,61% (2023)", dir: "down", source: "Sumber: BPS, 2024" },
    { key: "miskin", value: "8,57", unit: "% miskin", delta: "Turun dari 9,36% (2023)", dir: "down", source: "Sumber: BPS, Sep 2024" },
    { key: "tpt", value: "4,76", unit: "% menganggur", delta: "Turun dari 5,32% (2023)", dir: "down", source: "Sumber: BPS, Agt 2024" },
    { key: "ipm", value: "75,02", unit: "IPM", delta: "Naik dari 74,39 (2023)", dir: "up", source: "Sumber: BPS, 2024" }
  ];

  /* Penduduk 10 provinsi terbesar, 2024 (juta jiwa, proyeksi BPS). */
  var PROVINSI = [
    { nama: "Jawa Barat", penduduk: 50.35, ipm: 74.92, tpt: 6.75 },
    { nama: "Jawa Timur", penduduk: 41.81, ipm: 75.35, tpt: 4.19 },
    { nama: "Jawa Tengah", penduduk: 38.09, ipm: 74.35, tpt: 4.78 },
    { nama: "Sumatera Utara", penduduk: 15.59, ipm: 75.34, tpt: 5.84 },
    { nama: "Banten", penduduk: 12.43, ipm: 76.35, tpt: 6.68 },
    { nama: "DKI Jakarta", penduduk: 10.56, ipm: 84.15, tpt: 6.21 },
    { nama: "Sulawesi Selatan", penduduk: 9.46, ipm: 74.66, tpt: 4.55 },
    { nama: "Lampung", penduduk: 9.28, ipm: 72.82, tpt: 3.90 },
    { nama: "Sumatera Selatan", penduduk: 8.94, ipm: 73.12, tpt: 4.10 },
    { nama: "Riau", penduduk: 6.84, ipm: 75.54, tpt: 4.14 },
    { nama: "Kalimantan Barat", penduduk: 5.74, ipm: 70.47, tpt: 4.26 },
    { nama: "Nusa Tenggara Timur", penduduk: 5.66, ipm: 68.93, tpt: 3.16 },
    { nama: "Kalimantan Timur", penduduk: 4.00, ipm: 78.62, tpt: 5.14 },
    { nama: "Aceh", penduduk: 5.56, ipm: 74.05, tpt: 5.89 },
    { nama: "Sumatera Barat", penduduk: 5.74, ipm: 75.15, tpt: 5.73 },
    { nama: "Jambi", penduduk: 3.66, ipm: 74.53, tpt: 4.60 },
    { nama: "Bali", penduduk: 4.42, ipm: 78.09, tpt: 2.62 },
    { nama: "DI Yogyakarta", penduduk: 3.76, ipm: 81.07, tpt: 3.79 },
    { nama: "Kalimantan Selatan", penduduk: 4.20, ipm: 74.58, tpt: 4.28 },
    { nama: "Papua", penduduk: 1.12, ipm: 63.01, tpt: 3.81 }
  ];

  /* Pangsa sektor terhadap PDB 2024 (%). */
  var SEKTOR = [
    { nama: "Industri pengolahan", pangsa: 18.98 },
    { nama: "Perdagangan", pangsa: 13.04 },
    { nama: "Pertanian, kehutanan, perikanan", pangsa: 12.48 },
    { nama: "Konstruksi", pangsa: 9.99 },
    { nama: "Pertambangan dan penggalian", pangsa: 8.42 },
    { nama: "Transportasi dan pergudangan", pangsa: 6.54 },
    { nama: "Informasi dan komunikasi", pangsa: 4.41 },
    { nama: "Jasa keuangan dan asuransi", pangsa: 4.13 },
    { nama: "Sektor lainnya", pangsa: 22.01 }
  ];

  var SUMBER = [
    { angka: "Jumlah penduduk 281,6 juta", sumber: "BPS — Sensus Penduduk 2020 dan Proyeksi Penduduk", tahun: "2024" },
    { angka: "Pertumbuhan PDB 5,03%", sumber: "BPS — Berita Resmi Statistik, Februari 2025", tahun: "2024" },
    { angka: "PDB per kapita Rp78,6 juta", sumber: "BPS — Produk Domestik Bruto", tahun: "2024" },
    { angka: "Inflasi 1,57%", sumber: "BPS — Berita Resmi Statistik, Januari 2025", tahun: "2024" },
    { angka: "Kemiskinan 8,57%", sumber: "BPS — Profil Kemiskinan di Indonesia", tahun: "Sep 2024" },
    { angka: "Pengangguran terbuka 4,76%", sumber: "BPS — Keadaan Ketenagakerjaan Indonesia", tahun: "Agt 2024" },
    { angka: "Angkatan kerja 152,11 juta", sumber: "BPS — Keadaan Ketenagakerjaan Indonesia", tahun: "Agt 2024" },
    { angka: "IPM 75,02", sumber: "BPS — Indeks Pembangunan Manusia", tahun: "2024" },
    { angka: "Umur harapan hidup 73,98 tahun", sumber: "BPS — Indeks Pembangunan Manusia", tahun: "2024" },
    { angka: "Harapan lama sekolah 13,21 tahun", sumber: "BPS — Indeks Pembangunan Manusia", tahun: "2024" },
    { angka: "Rata-rata lama sekolah 9,10 tahun", sumber: "BPS — Indeks Pembangunan Manusia", tahun: "2024" },
    { angka: "Rasio gini 0,379", sumber: "BPS — Gini Ratio", tahun: "Mar 2024" },
    { angka: "Prevalensi stunting 19,8%", sumber: "Kementerian Kesehatan — Survei Status Gizi Indonesia (SSGI)", tahun: "2024" },
    { angka: "Angka melek huruf 96,64%", sumber: "BPS — Statistik Pendidikan", tahun: "2024" }
  ];

  function seriesOf(key, fromYear, toYear) {
    var s = SERIES[key];
    var out = [];
    YEARS.forEach(function (y) {
      if (y >= fromYear && y <= toYear) out.push({ year: y, value: s.values[y] });
    });
    return out;
  }

  return {
    YEARS: YEARS,
    SERIES: SERIES,
    KPI: KPI,
    PROVINSI: PROVINSI,
    SEKTOR: SEKTOR,
    SUMBER: SUMBER,
    seriesOf: seriesOf
  };
})();
