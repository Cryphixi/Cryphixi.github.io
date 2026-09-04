/* ============================================================
   Hero fluid background — WebGL fragment shader.
   Curl-noise (divergence-free) flow at two scales, plus a
   constant drift so the field never stalls. Two-tone Void/Deep
   mix at low strength, narrow contrast band. Half-resolution
   render, browser-upscaled. No pointer input. Hero only.
   Falls back to a CSS ombre stand-in if WebGL is unavailable
   or prefers-reduced-motion is set.
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var gl = null;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false })
      || canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
  } catch (e) { gl = null; }

  if (!gl) { cssFallback(); return; }

  var VERT = [
    'attribute vec2 a;',
    'void main(){ gl_Position = vec4(a, 0.0, 1.0); }'
  ].join('\n');

  /* 3D simplex noise (Ashima / McEwan, public domain) + curl advection */
  var FRAG = [
    'precision highp float;',
    'uniform vec2  u_res;',
    'uniform float u_time;',
    'uniform vec3  u_void;',
    'uniform vec3  u_deep;',

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

    // scalar potential field at a given scale/time offset
    'float potential(vec2 p, float t){',
    '  return snoise(vec3(p, t));',
    '}',

    // 2D curl of the scalar potential -> divergence-free flow
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
    '  vec2 p = vec2(uv.x * aspect, uv.y);',
    '  float t = u_time * 0.02;',
    // constant drift so the field never fully stalls
    '  p += vec2(0.015 * u_time * 0.03, -0.01 * u_time * 0.03);',
    // curl flow combined at two scales/speeds
    '  vec2 flow1 = curl(p * 1.1 + vec2(0.0, t), t * 0.9);',
    '  vec2 flow2 = curl(p * 2.7 - vec2(t, 0.0), t * 1.6);',
    '  vec2 q = p + flow1 * 0.28 + flow2 * 0.11;',
    // advected sample value -> normalized mix
    '  float v = snoise(vec3(q * 1.6, t * 1.2));',
    '  float mixv = smoothstep(-0.55, 0.55, v);',
    '  mixv = 0.5 + (mixv - 0.5) * 0.35;', // low strength, narrow band
    '  vec3 col = mix(u_void, u_deep, mixv);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('fluid shader compile failed:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { cssFallback(); return; }

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cssFallback(); return; }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes  = gl.getUniformLocation(prog, 'u_res');
  var uTime = gl.getUniformLocation(prog, 'u_time');
  var uVoid = gl.getUniformLocation(prog, 'u_void');
  var uDeep = gl.getUniformLocation(prog, 'u_deep');
  gl.uniform3f(uVoid, 0x06/255, 0x05/255, 0x09/255);   // Void #060509
  gl.uniform3f(uDeep, 0x15/255, 0x11/255, 0x1f/255);   // Deep #15111f

  var SCALE = 0.5; // half-resolution render, browser upscales
  function resize() {
    var w = Math.max(1, Math.floor(window.innerWidth * SCALE));
    var h = Math.max(1, Math.floor(window.innerHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  }
  window.addEventListener('resize', resize);
  resize();

  var start = performance.now();
  var raf = null;

  function frame(now) {
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }

  if (reduce) {
    // render a single static frame, no ongoing animation
    gl.uniform1f(uTime, 8.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  } else {
    raf = requestAnimationFrame(frame);
  }

  // Pause the loop when the hero is fully scrolled away (perf).
  window.addEventListener('scroll', function () {
    var faded = window.scrollY > window.innerHeight * 1.2;
    if (faded && raf) { cancelAnimationFrame(raf); raf = null; }
    else if (!faded && !raf && !reduce) { raf = requestAnimationFrame(frame); }
  }, { passive: true });

  function cssFallback() {
    // Two drifting ombre planes as a graceful degradation.
    canvas.style.display = 'none';
    var host = document.createElement('div');
    host.id = 'fluid-fallback';
    host.setAttribute('aria-hidden', 'true');
    host.innerHTML =
      '<div class="ombre a"></div><div class="ombre b"></div>';
    var css = document.createElement('style');
    css.textContent =
      '#fluid-fallback{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity .18s linear;overflow:hidden}' +
      '#fluid-fallback .ombre{position:absolute;inset:0}' +
      '#fluid-fallback .a{background-image:linear-gradient(158deg,rgba(21,17,31,.95) 0%,rgba(21,17,31,.42) 38%,rgba(6,5,9,0) 72%);background-size:220% 220%;animation:ombre-a 74s ease-in-out infinite;-webkit-mask-image:linear-gradient(to bottom,black 45%,transparent);mask-image:linear-gradient(to bottom,black 45%,transparent)}' +
      '#fluid-fallback .b{background-image:linear-gradient(22deg,rgba(21,17,31,.7) 0%,rgba(21,17,31,.28) 42%,rgba(6,5,9,0) 74%);background-size:240% 240%;animation:ombre-b 103s ease-in-out infinite;-webkit-mask-image:linear-gradient(to bottom,black 55%,transparent);mask-image:linear-gradient(to bottom,black 55%,transparent)}' +
      '@keyframes ombre-a{0%{background-position:0% 0%}50%{background-position:100% 62%}100%{background-position:0% 0%}}' +
      '@keyframes ombre-b{0%{background-position:100% 100%}50%{background-position:0% 30%}100%{background-position:100% 100%}}' +
      '@media (prefers-reduced-motion: reduce){#fluid-fallback .ombre{animation:none}}';
    document.head.appendChild(css);
    document.body.insertBefore(host, document.body.firstChild);
    // hand the fallback element the same id hook the shell fades
    host.setAttribute('data-fluid', '1');
  }
})();
