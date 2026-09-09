/* ============================================================
   Project thumbnail fluid backgrounds — same curl-noise WebGL
   shader family as the hero, one independent instance per
   thumbnail that has no real screenshot yet. Each instance gets
   its own spatial offset, time phase and speed so the swirls
   never move in lockstep, plus a verdigris accent blended in
   since this is foreground content, not a background wash.
   Falls back to the plain card background if WebGL is
   unavailable; a static frame if prefers-reduced-motion is set.
   ============================================================ */
(function () {
  'use strict';

  var canvases = document.querySelectorAll('.thumb-fluid canvas');
  if (!canvases.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var VERT = [
    'attribute vec2 a;',
    'void main(){ gl_Position = vec4(a, 0.0, 1.0); }'
  ].join('\n');

  /* 3D simplex noise (Ashima / McEwan, public domain) + curl advection,
     plus a second independently-phased sample for the accent color. */
  var FRAG = [
    'precision highp float;',
    'uniform vec2  u_res;',
    'uniform float u_time;',
    'uniform vec3  u_void;',
    'uniform vec3  u_deep;',
    'uniform vec3  u_accent;',
    'uniform vec2  u_seed;',
    'uniform float u_speed;',

    'vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }',
    'vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }',

    'float snoise(vec3 v){',
    '  const vec2 C = vec2(1.0/6.0, 1.0/3.0);',
    '  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);',
    '  vec3 i  = floor(v + dot(v, C.yyy));',
    '  vec3 x0 = v - i + dot(i, C.xxx);',
    '  vec3 g = step(x0.yzx, x0.xyz);',
    '  vec3 l = 1.0 - g;',
    '  vec3 i1 = min(g.xyz, l.zxy);',
    '  vec3 i2 = max(g.xyz, l.zxy);',
    '  vec3 x1 = x0 - i1 + 1.0 * C.xxx;',
    '  vec3 x2 = x0 - i2 + 2.0 * C.xxx;',
    '  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;',
    '  i = mod(i, 289.0);',
    '  vec4 p = permute( permute( permute(',
    '             i.z + vec4(0.0, i1.z, i2.z, 1.0))',
    '           + i.y + vec4(0.0, i1.y, i2.y, 1.0))',
    '           + i.x + vec4(0.0, i1.x, i2.x, 1.0));',
    '  float n_ = 1.0/7.0;',
    '  vec3 ns = n_ * D.wyz - D.xzx;',
    '  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);',
    '  vec4 x_ = floor(j * ns.z);',
    '  vec4 y_ = floor(j - 7.0 * x_);',
    '  vec4 x = x_ * ns.x + ns.yyyy;',
    '  vec4 y = y_ * ns.x + ns.yyyy;',
    '  vec4 h = 1.0 - abs(x) - abs(y);',
    '  vec4 b0 = vec4(x.xy, y.xy);',
    '  vec4 b1 = vec4(x.zw, y.zw);',
    '  vec4 s0 = floor(b0) * 2.0 + 1.0;',
    '  vec4 s1 = floor(b1) * 2.0 + 1.0;',
    '  vec4 sh = -step(h, vec4(0.0));',
    '  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;',
    '  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;',
    '  vec3 p0 = vec3(a0.xy, h.x);',
    '  vec3 p1 = vec3(a0.zw, h.y);',
    '  vec3 p2 = vec3(a1.xy, h.z);',
    '  vec3 p3 = vec3(a1.zw, h.w);',
    '  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));',
    '  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;',
    '  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);',
    '  m = m * m;',
    '  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));',
    '}',

    'float potential(vec2 p, float t){ return snoise(vec3(p, t)); }',

    'vec2 curl(vec2 p, float t){',
    '  float e = 0.35;',
    '  float n1 = potential(vec2(p.x, p.y + e), t);',
    '  float n2 = potential(vec2(p.x, p.y - e), t);',
    '  float n3 = potential(vec2(p.x + e, p.y), t);',
    '  float n4 = potential(vec2(p.x - e, p.y), t);',
    '  return vec2(n1 - n2, n4 - n3) / (2.0 * e);',
    '}',

    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / u_res;',
    '  float aspect = u_res.x / u_res.y;',
    '  vec2 p = vec2(uv.x * aspect, uv.y) + u_seed;',
    '  float t = u_time * 0.02 * u_speed;',
    '  p += vec2(0.015 * u_time * 0.03, -0.01 * u_time * 0.03) * u_speed;',
    '  vec2 flow1 = curl(p * 1.1 + vec2(0.0, t), t * 0.9);',
    '  vec2 flow2 = curl(p * 2.7 - vec2(t, 0.0), t * 1.6);',
    '  vec2 q = p + flow1 * 0.32 + flow2 * 0.13;',
    '  float v = snoise(vec3(q * 1.6, t * 1.2));',
    '  float mixv = smoothstep(-0.5, 0.5, v);',
    '  mixv = 0.5 + (mixv - 0.5) * 0.7;', // more contrast — this is foreground now
    '  vec3 col = mix(u_void, u_deep, mixv);',
    // independently-phased accent band, advected by the same flow so it
    // reads as part of the same swirl instead of a static overlay
    '  float a = snoise(vec3(q * 2.1 - vec2(t * 0.7, t * 0.5), t * 0.8 + u_seed.x + 5.0));',
    '  float am = smoothstep(0.2, 0.7, a);',
    '  col = mix(col, u_accent, am * 0.6);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }

  function makeInstance(canvas, index) {
    var gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false })
        || canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
    } catch (e) { gl = null; }
    if (!gl) return; // leave the card's plain background — no elaborate fallback needed here

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes    = gl.getUniformLocation(prog, 'u_res');
    var uTime   = gl.getUniformLocation(prog, 'u_time');
    var uVoid   = gl.getUniformLocation(prog, 'u_void');
    var uDeep   = gl.getUniformLocation(prog, 'u_deep');
    var uAccent = gl.getUniformLocation(prog, 'u_accent');
    var uSeed   = gl.getUniformLocation(prog, 'u_seed');
    var uSpeed  = gl.getUniformLocation(prog, 'u_speed');

    gl.uniform3f(uVoid, 0x06/255, 0x05/255, 0x09/255);     // Void #060509
    gl.uniform3f(uDeep, 0x15/255, 0x11/255, 0x1f/255);     // Deep #15111f
    gl.uniform3f(uAccent, 0x7a/255, 0x9b/255, 0x8e/255);   // Verdigris #7a9b8e

    // per-instance randomness: a large arbitrary spatial offset so each
    // thumbnail samples a completely different region of the noise field,
    // plus its own speed and a randomized start phase — independent
    // trajectories, not copies of the same one shifted in time.
    var rnd = mulberry32(0x9e3779b9 ^ (index * 2654435761));
    var seedX = rnd() * 200 - 100;
    var seedY = rnd() * 200 - 100;
    var speed = 0.75 + rnd() * 0.7;
    var startPhase = rnd() * 40;
    gl.uniform2f(uSeed, seedX, seedY);
    gl.uniform1f(uSpeed, speed);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }
    resize();
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    var start = performance.now();
    var raf = null;

    function draw(t) {
      gl.uniform1f(uTime, startPhase + t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now) {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(frame);
    }

    if (reduce) {
      draw(8.0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    // Pause off-screen instances — cards further down the projects grid
    // don't need to keep animating while scrolled out of view. A gap in
    // the noise field's time input on resume is imperceptible here.
    if (!reduce && window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !raf) { raf = requestAnimationFrame(frame); }
          else if (!entry.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { rootMargin: '200px' }).observe(canvas);
    }
  }

  // small, seedable PRNG (mulberry32) — deterministic per index so a
  // reload doesn't reshuffle which thumbnail looks like which
  function mulberry32(seed) {
    var s = seed >>> 0;
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  canvases.forEach(makeInstance);
})();
