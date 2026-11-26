/* NusaData — views.js
   Router hash (#/...) dan perender tiap halaman. Semua halaman dirender
   dari NUSADATA; setiap kontrol (pemilih metrik, rentang tahun, cari dan
   urut tabel) benar-benar berfungsi. */
"use strict";

var NUSA_VIEWS = (function () {
  var D = NUSADATA;
  var homeMetric = "pdb";
  var homeFrom = 2019;
  var homeTo = 2024;
  var pageMetric = {};
  var provSort = { key: "penduduk", dir: -1 };
  var provQuery = "";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function fmtNum(v, dec) {
    return v.toFixed(dec === undefined ? 2 : dec).replace(".", ",");
  }

  function kpiCard(k) {
    var s = D.SERIES[k.key];
    var latest = s.values[2024];
    return '<article class="kpi">' +
      '<div class="label">' + esc(s.label) + '</div>' +
      '<div class="value">' + esc(k.value) + ' <small>' + esc(k.unit) + '</small></div>' +
      '<div class="delta ' + k.dir + '">' + esc(k.delta) + '</div>' +
      '<div class="src">' + esc(k.source) + '</div>' +
      '<div class="src">Nilai 2024: ' + esc(s.fmt(latest)) + '</div>' +
      '</article>';
  }

  function metricChips(keys, current, group) {
    return keys.map(function (k) {
      return '<button class="chip' + (k === current ? ' on' : '') + '" data-group="' + group + '" data-metric="' + k + '">' + esc(D.SERIES[k].label) + '</button>';
    }).join("");
  }

  function yearChips(from, to, group) {
    var out = '<span class="ctl-label">Dari</span>';
    D.YEARS.forEach(function (y) {
      out += '<button class="chip' + (y === from ? ' on' : '') + '" data-group="' + group + '" data-from="' + y + '">' + y + '</button>';
    });
    out += '<span class="ctl-label">sampai</span>';
    D.YEARS.forEach(function (y) {
      out += '<button class="chip' + (y === to ? ' on' : '') + '" data-group="' + group + '" data-to="' + y + '">' + y + '</button>';
    });
    return out;
  }

  function chartCard(group, metricKey, from, to, title, sub) {
    var s = D.SERIES[metricKey];
    return '<section class="card">' +
      '<h2>' + esc(title) + '</h2>' +
      '<p class="sub">' + esc(sub) + '</p>' +
      '<div class="controls"><span class="ctl-label">Metrik</span>' + metricChips(chartCard.keys, metricKey, group) + '</div>' +
      '<div class="controls">' + yearChips(from, to, group) + '</div>' +
      '<div class="chart-wrap"><canvas class="chart" id="chart-' + group + '" role="img" aria-label="Grafik ' + esc(s.label) + ' 2019-2024"></canvas></div>' +
      '<p class="chart-note">Menampilkan ' + esc(s.label) + ' (' + esc(s.unit) + '), ' + from + '–' + to + '. ' + esc(s.source) + '.</p>' +
      '</section>';
  }

  function drawChart(group, metricKey, from, to) {
    var cv = document.getElementById("chart-" + group);
    if (!cv) return;
    var s = D.SERIES[metricKey];
    NUSA_CHARTS.drawLine(cv, D.seriesOf(metricKey, from, to), { fmt: s.fmt });
  }

  function sectionIntro(title, lede) {
    return '<section class="hero"><h1>' + esc(title) + '</h1><p class="lede">' + esc(lede) + '</p></section>';
  }

  /* ---------- Beranda ---------- */
  function renderHome() {
    chartCard.keys = ["pdb", "inflasi", "miskin", "penduduk"];
    var html = sectionIntro("Indonesia dalam angka",
      "NusaData merangkum angka-angka penting Indonesia — penduduk, ekonomi, pendidikan, kesehatan, dan ketenagakerjaan — lengkap dengan sumber dan tahun, agar siapa pun bisa memeriksa dan membandingkannya.");
    html += '<p><span class="updated">Data terbaru: 2024 &middot; Diperbarui November 2026</span></p>';
    html += '<div class="kpi-grid">' + D.KPI.map(kpiCard).join("") + '</div>';
    html += chartCard("home", homeMetric, homeFrom, homeTo, "Tren utama 2019–2024",
      "Pilih metrik dan rentang tahun untuk melihat bagaimana angka Indonesia bergerak dalam enam tahun terakhir.");
    html += '<section class="two-col">' +
      '<div class="card"><h3>Apa yang bisa dicari di sini?</h3><ul class="tight">' +
      '<li><a href="#/penduduk">Penduduk</a> — jumlah penduduk dan sebarannya per provinsi.</li>' +
      '<li><a href="#/ekonomi">Ekonomi</a> — pertumbuhan PDB, inflasi, dan pangsa sektor.</li>' +
      '<li><a href="#/pendidikan">Pendidikan</a> — harapan dan rata-rata lama sekolah.</li>' +
      '<li><a href="#/kesehatan">Kesehatan</a> — umur harapan hidup dan stunting balita.</li>' +
      '<li><a href="#/ketenagakerjaan">Ketenagakerjaan</a> — pengangguran dan angkatan kerja.</li>' +
      '<li><a href="#/data">Data &amp; Metodologi</a> — tabel provinsi dan daftar sumber.</li>' +
      '</ul></div>' +
      '<div class="card"><h3>Sekilas: 2024</h3>' +
      '<p>Ekonomi tumbuh <strong>5,03%</strong> dengan inflasi yang rendah, <strong>1,57%</strong>. Kemiskinan turun ke level terendah dalam satu dekade, <strong>8,57%</strong>, dan pengangguran terbuka turun ke <strong>4,76%</strong>.</p>' +
      '<p>Di sisi pembangunan manusia, IPM mencapai <strong>75,02</strong> dan umur harapan hidup <strong>73,98 tahun</strong>. Stunting balita turun ke <strong>19,8%</strong>.</p>' +
      '<p class="chart-note">Semua angka di halaman ini: Sumber: BPS, 2024 (stunting: SSGI Kemenkes, 2024).</p></div>' +
      '</section>';
    html += '<div class="callout"><p><strong>Cara membaca angka di situs ini:</strong> setiap kartu dan grafik mencantumkan sumber dan tahunnya. Angka “2024” adalah angka terbaru yang diterbitkan; tren 2019–2024 menunjukkan arah perubahannya.</p></div>';
    return html;
  }

  /* ---------- Penduduk ---------- */
  function renderPenduduk() {
    var m = pageMetric.penduduk || "penduduk";
    chartCard.keys = ["penduduk", "ipm"];
    var html = sectionIntro("Penduduk Indonesia",
      "Indonesia adalah negara berpenduduk terbesar keempat di dunia. Pada 2024 jumlah penduduk mencapai 281,6 juta jiwa, tersebar di 38 provinsi dengan Jawa sebagai pulau terpadat.");
    html += '<div class="kpi-grid">' +
      '<article class="kpi"><div class="label">Jumlah penduduk</div><div class="value">281,6 <small>juta jiwa</small></div><div class="delta up">+1,04% dari 2023</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '<article class="kpi"><div class="label">Laju pertumbuhan</div><div class="value">1,04 <small>% per tahun</small></div><div class="delta down">Melambat dari 1,25% (2020)</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '<article class="kpi"><div class="label">Penduduk di Pulau Jawa</div><div class="value">55,9 <small>%</small></div><div class="delta up">Jawa Barat terbanyak: 50,35 juta</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '</div>';
    html += chartCard("penduduk", m, 2019, 2024, "Pertumbuhan penduduk 2019–2024",
      "Jumlah penduduk naik sekitar 2,5–3 juta jiwa setiap tahun.");
    html += '<section class="card"><h2>Provinsi terbesar</h2><p class="sub">Sepuluh provinsi dengan penduduk terbanyak, 2024. Tabel lengkap ada di halaman Data &amp; Metodologi.</p>' +
      '<div class="chart-wrap"><canvas class="chart" id="chart-prov" role="img" aria-label="Grafik batang penduduk 10 provinsi terbesar"></canvas></div>' +
      '<p class="chart-note">Juta jiwa, 2024. Sumber: BPS, 2024.</p></section>';
    return html;
  }

  /* ---------- Ekonomi ---------- */
  function renderEkonomi() {
    var m = pageMetric.ekonomi || "pdb";
    chartCard.keys = ["pdb", "inflasi", "gini"];
    var html = sectionIntro("Ekonomi Indonesia",
      "Ekonomi Indonesia tumbuh 5,03% pada 2024 dengan inflasi 1,57% — kombinasi pertumbuhan yang stabil dan harga yang terkendali. PDB per kapita mencapai Rp78,6 juta.");
    html += '<div class="kpi-grid">' +
      '<article class="kpi"><div class="label">Pertumbuhan PDB</div><div class="value">5,03 <small>%</small></div><div class="delta up">Stabil di kisaran 5% sejak 2022</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '<article class="kpi"><div class="label">PDB per kapita</div><div class="value">Rp78,6 <small>juta</small></div><div class="delta up">Naik dari Rp71,0 juta (2023)</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '<article class="kpi"><div class="label">Inflasi</div><div class="value">1,57 <small>%</small></div><div class="delta down">Turun dari 2,61% (2023)</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '</div>';
    html += chartCard("ekonomi", m, 2019, 2024, "Pertumbuhan dan harga 2019–2024",
      "Kontraksi 2020 adalah dampak pandemi; sejak 2021 ekonomi kembali tumbuh di atas 3,7% setiap tahun.");
    html += '<section class="card"><h2>Pangsa sektor terhadap PDB, 2024</h2><p class="sub">Industri pengolahan tetap menjadi penyumbang terbesar, diikuti perdagangan dan pertanian.</p>' +
      '<div class="chart-wrap"><canvas class="chart" id="chart-sektor" role="img" aria-label="Grafik batang pangsa sektor terhadap PDB"></canvas></div>' +
      '<p class="chart-note">Persen terhadap PDB, 2024. Sumber: BPS, 2024.</p></section>';
    return html;
  }

  /* ---------- Pendidikan ---------- */
  function renderPendidikan() {
    var m = pageMetric.pendidikan || "hls";
    chartCard.keys = ["hls", "rls", "ipm"];
    var html = sectionIntro("Pendidikan Indonesia",
      "Anak Indonesia kini diharapkan bersekolah 13,21 tahun dan rata-rata penduduk usia 25 tahun ke atas telah bersekolah 9,10 tahun — keduanya tertinggi sepanjang sejarah pencatatan.");
    html += '<div class="kpi-grid">' +
      '<article class="kpi"><div class="label">Harapan lama sekolah</div><div class="value">13,21 <small>tahun</small></div><div class="delta up">Setara tamat SMA + 1 tahun</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '<article class="kpi"><div class="label">Rata-rata lama sekolah</div><div class="value">9,10 <small>tahun</small></div><div class="delta up">Naik dari 8,77 (2023)</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '<article class="kpi"><div class="label">Angka melek huruf</div><div class="value">96,64 <small>%</small></div><div class="delta up">Penduduk usia 15 tahun ke atas</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '</div>';
    html += chartCard("pendidikan", m, 2019, 2024, "Lama sekolah 2019–2024",
      "Harapan lama sekolah naik perlahan tapi konsisten; rata-rata lama sekolah melonjak pada 2024.");
    html += '<section class="card"><h2>Apa artinya?</h2>' +
      '<p><strong>Harapan lama sekolah 13,21 tahun</strong> berarti anak usia 7 tahun hari ini diperkirakan menempuh pendidikan hingga setara kelas 1 perguruan tinggi.</p>' +
      '<p><strong>Rata-rata lama sekolah 9,10 tahun</strong> berarti penduduk dewasa rata-rata tamat kelas 3 SMP — naik dari 8,34 tahun pada 2019.</p>' +
      '<p class="chart-note">Sumber: BPS, Indeks Pembangunan Manusia, 2024.</p></section>';
    return html;
  }

  /* ---------- Kesehatan ---------- */
  function renderKesehatan() {
    var m = pageMetric.kesehatan || "ahh";
    chartCard.keys = ["ahh", "stunting"];
    var html = sectionIntro("Kesehatan Indonesia",
      "Bayi yang lahir pada 2024 diperkirakan hidup 73,98 tahun — naik hampir 2,7 tahun dibanding 2019. Stunting balita turun ke 19,8%, terendah yang pernah tercatat.");
    html += '<div class="kpi-grid">' +
      '<article class="kpi"><div class="label">Umur harapan hidup</div><div class="value">73,98 <small>tahun</small></div><div class="delta up">Naik dari 73,93 (2023)</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '<article class="kpi"><div class="label">Stunting balita</div><div class="value">19,8 <small>%</small></div><div class="delta down">Turun dari 21,5% (2023)</div><div class="src">Sumber: SSGI Kemenkes, 2024</div></article>' +
      '<article class="kpi"><div class="label">IPM dimensi kesehatan</div><div class="value">75,02 <small>IPM</small></div><div class="delta up">Kategori “tinggi” sejak 2023</div><div class="src">Sumber: BPS, 2024</div></article>' +
      '</div>';
    html += chartCard("kesehatan", m, 2019, 2024, "Umur harapan hidup dan stunting 2019–2024",
      "Umur harapan hidup naik setelah sempat tertahan pada 2020–2021; stunting turun 7,9 poin sejak 2019.");
    html += '<section class="card"><h2>Stunting: mengapa penting?</h2>' +
      '<p>Stunting — anak terlalu pendek untuk usianya akibat kekurangan gizi kronis — memengaruhi tumbuh kembang dan prestasi belajar. Pemerintah menargetkan prevalensi di bawah 14% pada 2029.</p>' +
      '<p class="chart-note">Sumber: SSGI Kementerian Kesehatan, 2024.</p></section>';
    return html;
  }

  /* ---------- Ketenagakerjaan ---------- */
  function renderKetenagakerjaan() {
    var m = pageMetric.ketenagakerjaan || "tpt";
    chartCard.keys = ["tpt", "gini"];
    var html = sectionIntro("Ketenagakerjaan Indonesia",
      "Dari 152,11 juta angkatan kerja pada Agustus 2024, sebanyak 144,87 juta orang bekerja dan 7,24 juta menganggur — tingkat pengangguran terbuka 4,76%, terendah sejak 2019.");
    html += '<div class="kpi-grid">' +
      '<article class="kpi"><div class="label">Pengangguran terbuka</div><div class="value">4,76 <small>%</small></div><div class="delta down">Turun dari 5,32% (2023)</div><div class="src">Sumber: BPS, Agt 2024</div></article>' +
      '<article class="kpi"><div class="label">Angkatan kerja</div><div class="value">152,11 <small>juta</small></div><div class="delta up">Tingkat partisipasi 70,63%</div><div class="src">Sumber: BPS, Agt 2024</div></article>' +
      '<article class="kpi"><div class="label">Pekerja informal</div><div class="value">57,95 <small>%</small></div><div class="delta down">Dari seluruh pekerja</div><div class="src">Sumber: BPS, Agt 2024</div></article>' +
      '</div>';
    html += chartCard("ketenagakerjaan", m, 2019, 2024, "Pengangguran 2019–2024",
      "Pengangguran melonjak ke 7,07% pada 2020 saat pandemi, lalu turun setiap tahun hingga 4,76% pada 2024.");
    html += '<section class="card"><h2>Membaca angka pengangguran</h2>' +
      '<p>Tingkat pengangguran terbuka (TPT) adalah persentase angkatan kerja yang tidak bekerja dan sedang mencari pekerjaan. Angka 4,76% pada Agustus 2024 adalah yang terendah dalam enam tahun terakhir.</p>' +
      '<p>Lebih dari separuh pekerja Indonesia masih bekerja di sektor informal — tanpa kontrak formal maupun jaminan sosial yang penuh — sehingga kualitas pekerjaan sama pentingnya dengan jumlahnya.</p>' +
      '<p class="chart-note">Sumber: BPS, Keadaan Ketenagakerjaan Indonesia, Agustus 2024.</p></section>';
    return html;
  }

  /* ---------- Data & Metodologi ---------- */
  function sortedProvinces() {
    var rows = D.PROVINSI.filter(function (p) {
      return !provQuery || p.nama.toLowerCase().indexOf(provQuery.toLowerCase()) !== -1;
    });
    rows.sort(function (a, b) {
      var k = provSort.key;
      var d = a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0;
      return d * provSort.dir;
    });
    return rows;
  }

  function renderData() {
    var rows = sortedProvinces();
    var arrow = provSort.dir === -1 ? " ▼" : " ▲";
    function th(key, label, num) {
      return '<th class="' + (num ? "num" : "") + '"><button data-sort="' + key + '">' + esc(label) + (provSort.key === key ? arrow : "") + '</button></th>';
    }
    var html = sectionIntro("Data & Metodologi",
      "Semua angka di NusaData berasal dari publikasi resmi. Halaman ini memuat tabel provinsi yang bisa dicari dan diurutkan, serta daftar lengkap sumber setiap angka.");
    html += '<section class="card"><h2>Tabel provinsi</h2>' +
      '<p class="sub">Penduduk (juta jiwa), IPM, dan tingkat pengangguran terbuka per provinsi, 2024. Klik judul kolom untuk mengurutkan; ketik di kotak cari untuk menyaring.</p>' +
      '<div class="table-tools"><input type="search" id="provSearch" placeholder="Cari provinsi, mis. Jawa…" value="' + esc(provQuery) + '" aria-label="Cari provinsi"></div>' +
      '<div class="table-wrap"><table class="data"><thead><tr>' +
      th("nama", "Provinsi") + th("penduduk", "Penduduk (jt)", true) + th("ipm", "IPM", true) + th("tpt", "TPT (%)", true) +
      '</tr></thead><tbody>' +
      rows.map(function (p) {
        return '<tr><td>' + esc(p.nama) + '</td><td class="num">' + fmtNum(p.penduduk) + '</td><td class="num">' + fmtNum(p.ipm) + '</td><td class="num">' + fmtNum(p.tpt) + '</td></tr>';
      }).join("") +
      '</tbody></table></div>' +
      '<p class="table-count">Menampilkan ' + rows.length + ' dari ' + D.PROVINSI.length + ' provinsi. Sumber: BPS, 2024 (penduduk: proyeksi; TPT: Agustus 2024).</p>' +
      '</section>';
    html += '<section class="card"><h2>Daftar sumber</h2><p class="sub">Setiap angka di situs ini merujuk pada salah satu publikasi berikut.</p>' +
      '<div class="table-wrap"><table class="data"><thead><tr><th>Angka</th><th>Sumber</th><th>Tahun</th></tr></thead><tbody>' +
      D.SUMBER.map(function (s) {
        return '<tr><td>' + esc(s.angka) + '</td><td>' + esc(s.sumber) + '</td><td>' + esc(s.tahun) + '</td></tr>';
      }).join("") +
      '</tbody></table></div></section>';
    html += '<section class="card"><h2>Metodologi</h2>' +
      '<ul class="tight">' +
      '<li><strong>Jumlah penduduk</strong> memakai hasil Sensus Penduduk 2020 dan proyeksi penduduk BPS.</li>' +
      '<li><strong>Pertumbuhan PDB</strong> adalah perubahan PDB harga konstan terhadap tahun sebelumnya (y-on-y).</li>' +
      '<li><strong>Inflasi</strong> adalah perubahan Indeks Harga Konsumen Desember terhadap Desember tahun sebelumnya.</li>' +
      '<li><strong>Kemiskinan</strong> memakai garis kemiskinan BPS per September; <strong>pengangguran</strong> memakai Sakernas Agustus.</li>' +
      '<li><strong>IPM</strong> menggabungkan umur harapan hidup, harapan dan rata-rata lama sekolah, serta pengeluaran per kapita yang disesuaikan.</li>' +
      '<li><strong>Stunting</strong> memakai Survei Status Gizi Indonesia (SSGI) Kementerian Kesehatan.</li>' +
      '<li>Angka dibulatkan ke dua desimal; pembulatan dapat membuat jumlah komponen tidak tepat 100%.</li>' +
      '</ul>' +
      '<p class="chart-note">NusaData adalah rangkuman independen dan bukan publikasi resmi BPS. Untuk angka resmi terbaru, rujuk publikasi BPS yang tercantum di atas.</p></section>';
    return html;
  }

  var ROUTES = {
    "": renderHome,
    "penduduk": renderPenduduk,
    "ekonomi": renderEkonomi,
    "pendidikan": renderPendidikan,
    "kesehatan": renderKesehatan,
    "ketenagakerjaan": renderKetenagakerjaan,
    "data": renderData
  };

  function currentRoute() {
    var h = window.location.hash || "#/";
    var r = h.replace(/^#\/?/, "").split("?")[0].split("/")[0];
    return ROUTES[r] ? r : "";
  }

  function render() {
    var route = currentRoute();
    var view = document.getElementById("view");
    view.innerHTML = ROUTES[route]();
    document.querySelectorAll("#mainnav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === route);
    });
    var nav = document.getElementById("mainnav");
    nav.classList.remove("open");
    document.getElementById("navToggle").setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    afterRender(route);
  }

  function afterRender(route) {
    if (route === "") {
      drawChart("home", homeMetric, homeFrom, homeTo);
    } else if (route === "penduduk") {
      drawChart("penduduk", pageMetric.penduduk || "penduduk", 2019, 2024);
      var cv = document.getElementById("chart-prov");
      if (cv) {
        var top = D.PROVINSI.slice().sort(function (a, b) { return b.penduduk - a.penduduk; }).slice(0, 10);
        NUSA_CHARTS.drawBars(cv, top.map(function (p) { return { label: p.nama, value: p.penduduk }; }),
          { fmt: function (v) { return fmtNum(v) + " jt"; }, unit: "Juta jiwa, 2024. Sumber: BPS, 2024." });
      }
    } else if (route === "ekonomi") {
      drawChart("ekonomi", pageMetric.ekonomi || "pdb", 2019, 2024);
      var cs = document.getElementById("chart-sektor");
      if (cs) {
        NUSA_CHARTS.drawBars(cs, D.SEKTOR.map(function (s) { return { label: s.nama, value: s.pangsa }; }),
          { fmt: function (v) { return fmtNum(v) + "%"; }, unit: "% terhadap PDB, 2024. Sumber: BPS, 2024." });
      }
    } else if (route === "pendidikan") {
      drawChart("pendidikan", pageMetric.pendidikan || "hls", 2019, 2024);
    } else if (route === "kesehatan") {
      drawChart("kesehatan", pageMetric.kesehatan || "ahh", 2019, 2024);
    } else if (route === "ketenagakerjaan") {
      drawChart("ketenagakerjaan", pageMetric.ketenagakerjaan || "tpt", 2019, 2024);
    }
  }

  function onChipClick(e) {
    var b = e.target.closest("button.chip");
    if (!b) return;
    var group = b.getAttribute("data-group");
    var route = currentRoute();
    if (b.hasAttribute("data-metric")) {
      var m = b.getAttribute("data-metric");
      if (group === "home") homeMetric = m; else pageMetric[group] = m;
      render();
    } else if (b.hasAttribute("data-from")) {
      var f = parseInt(b.getAttribute("data-from"), 10);
      if (group === "home") { homeFrom = f; if (homeFrom > homeTo) homeTo = homeFrom; }
      render();
    } else if (b.hasAttribute("data-to")) {
      var t = parseInt(b.getAttribute("data-to"), 10);
      if (group === "home") { homeTo = t; if (homeTo < homeFrom) homeFrom = homeTo; }
      render();
    }
  }

  function onTableClick(e) {
    var b = e.target.closest("button[data-sort]");
    if (!b) return;
    var k = b.getAttribute("data-sort");
    if (provSort.key === k) provSort.dir = -provSort.dir;
    else { provSort.key = k; provSort.dir = k === "nama" ? 1 : -1; }
    render();
  }

  function onSearch(e) {
    if (e.target && e.target.id === "provSearch") {
      provQuery = e.target.value;
      var pos = e.target.selectionStart;
      render();
      var input = document.getElementById("provSearch");
      if (input) { input.focus(); input.setSelectionRange(pos, pos); }
    }
  }

  return {
    render: render,
    onChipClick: onChipClick,
    onTableClick: onTableClick,
    onSearch: onSearch,
    currentRoute: currentRoute
  };
})();
