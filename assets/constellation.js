/* Seven drifting nodes, edges between neighbors, and a small node at each
   edge's midpoint — because in Seption, relationships are nodes too. */
(function () {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Seven anchors echoing the logo's flower arrangement, spread wide.
  const anchors = [
    [0.50, 0.22], [0.28, 0.34], [0.72, 0.34],
    [0.50, 0.50],
    [0.26, 0.66], [0.74, 0.66], [0.50, 0.80],
  ];

  const nodes = anchors.map(([ax, ay], i) => ({
    ax, ay,
    phase: i * 1.7,
    speed: 0.00012 + (i % 3) * 0.00004,
    rx: 26 + (i % 4) * 9,
    ry: 20 + ((i + 2) % 4) * 8,
    r: 5 + (i % 3) * 1.5,
  }));

  const LINK_DIST = 0.34; // fraction of min(w,h·1.4)

  function positions(t) {
    return nodes.map(n => ({
      x: n.ax * w + Math.cos(t * n.speed + n.phase) * n.rx,
      y: n.ay * h + Math.sin(t * n.speed * 1.3 + n.phase) * n.ry,
      r: n.r,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const pts = positions(t);
    const maxD = Math.min(w, h * 1.4) * LINK_DIST;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > maxD) continue;
        const alpha = 0.28 * (1 - d / maxD) + 0.04;
        ctx.strokeStyle = 'rgba(140, 150, 240,' + alpha + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        // the relationship is itself a node
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        ctx.fillStyle = 'rgba(192, 166, 245,' + (alpha + 0.12) + ')';
        ctx.beginPath();
        ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const p of pts) {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      glow.addColorStop(0, 'rgba(130, 167, 248, 0.30)');
      glow.addColorStop(1, 'rgba(130, 167, 248, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();

      const core = ctx.createRadialGradient(
        p.x - p.r * 0.4, p.y - p.r * 0.4, p.r * 0.1, p.x, p.y, p.r
      );
      core.addColorStop(0, '#aab8f9');
      core.addColorStop(1, '#8f7ce8');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (reduceMotion) {
    draw(40000);
    window.addEventListener('resize', () => draw(40000));
  } else {
    let raf;
    function loop(t) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(loop);
    });
  }
})();
