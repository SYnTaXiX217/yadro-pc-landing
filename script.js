document.documentElement.classList.add("js");

const tiers = [
  { max: 70000, name: "Старт: киберспорт и лёгкие игры",
    fps: "CS2 и Valorant: 200+ FPS в Full HD",
    parts: { "Процессор": "Ryzen 5 5500", "Видеокарта": "RX 6600", "Память": "16 ГБ DDR4", "Накопитель": "SSD 500 ГБ" } },
  { max: 120000, name: "Играть во всё на высоких",
    fps: "Cyberpunk, Elden Ring: 60+ FPS в Full HD",
    parts: { "Процессор": "Ryzen 5 7500F", "Видеокарта": "RTX 4060 Ti", "Память": "32 ГБ DDR5", "Накопитель": "SSD 1 ТБ" } },
  { max: 200000, name: "2K без компромиссов",
    fps: "Новинки: 80–100 FPS в 2K на высоких",
    parts: { "Процессор": "Ryzen 7 7800X3D", "Видеокарта": "RTX 4070 Super", "Память": "32 ГБ DDR5", "Накопитель": "SSD 2 ТБ" } },
  { max: Infinity, name: "4K и стриминг в одном ПК",
    fps: "Любые игры: 60+ FPS в 4K",
    parts: { "Процессор": "Ryzen 9 7950X3D", "Видеокарта": "RTX 4080 Super", "Память": "64 ГБ DDR5", "Накопитель": "SSD 4 ТБ" } },
];

const slider = document.getElementById("budget");
const out = document.getElementById("budgetOut");
const nameEl = document.getElementById("tierName");
const fpsEl = document.getElementById("tierFps");
const partsEl = document.getElementById("parts");
const fmt = n => Math.round(n).toLocaleString("ru-RU") + " ₽";

// Плавный счётчик бюджета
let shown = Number(slider.value);
let raf;
function tween(to) {
  cancelAnimationFrame(raf);
  const from = shown, start = performance.now(), dur = 450;
  (function step(now) {
    const t = Math.min((now - start) / dur, 1);
    shown = from + (to - from) * (1 - Math.pow(1 - t, 3));
    out.textContent = fmt(shown);
    if (t < 1) raf = requestAnimationFrame(step);
  })(start);
}

// Плавная смена текста сборки
let current = null;
function showTier(tier) {
  if (tier === current) return;
  const first = current === null;
  current = tier;
  const fadeEls = [nameEl, fpsEl, ...partsEl.children];
  const apply = () => {
    nameEl.textContent = tier.name;
    fpsEl.textContent = tier.fps;
    partsEl.innerHTML = Object.entries(tier.parts)
      .map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join("");
  };
  if (first) return apply();
  fadeEls.forEach(el => el.classList.add("swap"));
  setTimeout(() => {
    apply();
    [nameEl, fpsEl, ...partsEl.children].forEach(el => el.classList.remove("swap"));
  }, 250);
}

function render() {
  const v = Number(slider.value);
  const p = (v - slider.min) / (slider.max - slider.min);
  slider.style.setProperty("--p", p * 100 + "%");
  document.querySelector(".panel").style.setProperty("--h", 215 + p * 85);
  document.querySelector(".panel").style.setProperty("--s", (0.82 + p * 0.34).toFixed(3));
  tween(v);
  showTier(tiers.find(t => v <= t.max));
}
slider.addEventListener("input", render);
render();

// Появление блоков при скролле
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Форма
const form = document.getElementById("form");
const msg = document.getElementById("formMsg");
form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true;
  [document.getElementById("name"), document.getElementById("tg")].forEach(f => {
    const empty = f.value.trim() === "";
    f.classList.toggle("error", empty);
    if (empty) ok = false;
  });
  msg.textContent = ok
    ? "Заявка отправлена. Ответим в Telegram в течение дня."
    : "Заполните имя и Telegram, чтобы мы могли ответить.";
  if (ok) form.reset();
});
