import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

function hexToRgb01(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}

const SETTINGS = {
  speed: 3,
  scale: 1,
  color: '#0d7355',
  noiseIntensity: 1.5,
  rotation: 0
};

const canvas = document.getElementById('silk-bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const uniforms = {
  uTime: { value: 0 },
  uSpeed: { value: SETTINGS.speed },
  uScale: { value: SETTINGS.scale },
  uRotation: { value: SETTINGS.rotation },
  uNoiseIntensity: { value: SETTINGS.noiseIntensity },
  uColor: { value: new THREE.Color(...hexToRgb01(SETTINGS.color)) }
};

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
});

const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}
window.addEventListener('resize', resize, { passive: true });
resize();

let last = performance.now();
function animate(now) {
  const delta = (now - last) / 1000;
  last = now;

  uniforms.uTime.value += 0.1 * delta;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

const textEl = document.getElementById('welcome-text');

if (textEl) {
  const lines = [
    'Hey, I\'m Julius.',
    'I build things.',
    'Welcome to my corner.',
    'Nice to see you here.',
    'Let\'s build something.',
  ];
  const picked = lines[Math.floor(Math.random() * lines.length)];
  let i = 0;
  textEl.textContent = '';
  textEl.style.opacity = 1;
  textEl.style.minHeight = '1.2em';

  function type() {
    if (i <= picked.length) {
      textEl.textContent = picked.slice(0, i);
      i++;
      setTimeout(type, 55 + Math.random() * 40);
    }
  }
  setTimeout(type, 400);
}
