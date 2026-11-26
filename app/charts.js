/* NusaData — charts.js
   Grafik garis dan batang di atas <canvas>, tanpa pustaka apa pun.
   Semua angka digambar dari NUSADATA; grafik digambar ulang saat
   pengguna mengganti metrik atau rentang tahun. */
"use strict";

var NUSA_CHARTS = (function () {
  var HIJAU = "#0e5e4a";
  var EMAS = "#e8a90c";
  var ABU = "#8aa39a";
  var GRID = "#e2e9e5";

  function setupCanvas(canvas, heightCss) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || canvas.parentElement.clientWidth || 800;
    var h = heightCss || 300;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  function niceTicks(min, max, count) {
    var span = max - min || 1;
    var step = span / count;
    var mag = Math.pow(10, Math.floor(Math.log10(step)));
    var norm = step / mag;
    var nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
    step = nice * mag;
    var start = Math.floor(min / step) * step;
    var ticks = [];
    for (var v = start; v <= max + step * 0.5; v += step) ticks.push(v);
    return { ticks: ticks, step: step };
  }

  function fmtTick(v) {
    if (Math.abs(v) >= 100) return String(Math.round(v));
    if (Math.abs(v) >= 10) return v.toFixed(1).replace(".", ",");
    return v.toFixed(2).replace(".", ",");
  }

  /* Grafik garis untuk satu deret tahunan. */
  function drawLine(canvas, points, opts) {
    opts = opts || {};
    var box = setupCanvas(canvas, opts.height || 300);
    var ctx = box.ctx, w = box.w, h = box.h;
    var padL = 58, padR = 16, padT = 18, padB = 34;
    var vals = points.map(function (p) { return p.value; });
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var pad = (max - min) * 0.15 || 1;
    min -= pad; max += pad;
    var ticks = niceTicks(min, max, 4).ticks;
    min = Math.min(min, ticks[0]);
    max = Math.max(max, ticks[ticks.length - 1]);
    var plotW = w - padL - padR, plotH = h - padT - padB;
    function X(i) { return padL + (points.length === 1 ? plotW / 2 : (plotW * i) / (points.length - 1)); }
    function Y(v) { return padT + plotH - ((v - min) / (max - min)) * plotH; }

    ctx.clearRect(0, 0, w, h);
    ctx.font = "12px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ticks.forEach(function (t) {
      var y = Y(t);
      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      ctx.fillStyle = "#5c6b64";
      ctx.fillText(fmtTick(t), padL - 8, y);
    });
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    points.forEach(function (p, i) {
      ctx.fillStyle = "#5c6b64";
      ctx.fillText(String(p.year), X(i), h - padB + 10);
    });

    /* Area di bawah garis. */
    var grad = ctx.createLinearGradient(0, padT, 0, h - padB);
    grad.addColorStop(0, "rgba(14,94,74,0.22)");
    grad.addColorStop(1, "rgba(14,94,74,0.02)");
    ctx.beginPath();
    points.forEach(function (p, i) { if (i === 0) ctx.moveTo(X(i), Y(p.value)); else ctx.lineTo(X(i), Y(p.value)); });
    ctx.lineTo(X(points.length - 1), h - padB);
    ctx.lineTo(X(0), h - padB);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    /* Garis dan titik. */
    ctx.beginPath();
    points.forEach(function (p, i) { if (i === 0) ctx.moveTo(X(i), Y(p.value)); else ctx.lineTo(X(i), Y(p.value)); });
    ctx.strokeStyle = HIJAU; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();
    points.forEach(function (p, i) {
      ctx.beginPath();
      ctx.arc(X(i), Y(p.value), 4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; ctx.fill();
      ctx.strokeStyle = HIJAU; ctx.lineWidth = 2; ctx.stroke();
    });

    /* Label nilai di titik terakhir dan pertama. */
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    var last = points[points.length - 1];
    ctx.fillStyle = HIJAU;
    ctx.font = "bold 14px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(opts.fmt ? opts.fmt(last.value) : String(last.value), Math.min(X(points.length - 1) + 8, w - 70), Y(last.value) - 6);
  }

  /* Grafik batang horizontal untuk daftar nama + nilai. */
  function drawBars(canvas, items, opts) {
    opts = opts || {};
    var rowH = opts.rowHeight || 30;
    var heightCss = items.length * rowH + 46;
    var box = setupCanvas(canvas, heightCss);
    var ctx = box.ctx, w = box.w, h = box.h;
    var padL = opts.labelWidth || 190, padR = 64, padT = 10, padB = 28;
    var max = Math.max.apply(null, items.map(function (it) { return it.value; }));
    var plotW = w - padL - padR;
    ctx.clearRect(0, 0, w, h);
    ctx.font = "13px -apple-system, Segoe UI, Roboto, sans-serif";
    items.forEach(function (it, i) {
      var y = padT + i * rowH + rowH / 2;
      var bw = Math.max(2, (it.value / max) * plotW);
      ctx.fillStyle = i % 2 === 0 ? HIJAU : "#2a7a63";
      var barY = y - 9;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(padL, barY, bw, 18, 4); else ctx.rect(padL, barY, bw, 18);
      ctx.fill();
      ctx.fillStyle = "#1c2420";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(it.label, padL - 10, y);
      ctx.textAlign = "left";
      ctx.fillStyle = HIJAU;
      ctx.font = "bold 13px -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.fillText(opts.fmt ? opts.fmt(it.value) : String(it.value), padL + bw + 8, y);
      ctx.font = "13px -apple-system, Segoe UI, Roboto, sans-serif";
    });
    ctx.fillStyle = "#5c6b64";
    ctx.font = "12px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(opts.unit || "", padL, h - 8);
  }

  return { drawLine: drawLine, drawBars: drawBars };
})();
