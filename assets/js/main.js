/* UNITOP E&C — shared header/footer + interactions */
const NAV = [
  ["about.html", "회사소개", "about"],
  ["business.html", "사업분야", "business"],
  ["products.html", "제품소개", "products"],
  ["tech.html", "기술·특허", "tech"],
  ["contact.html", "문의·오시는 길", "contact"],
];
const COMPANY = {
  name: "주식회사 유니탑이앤씨",
  hq: "경기도 안성시 양성면 덕봉서원로559-11, D동",
  lab: "경기도 안양시 동안구 관양동 954-1 평촌디지털엠파이어 12층 1216호",
  tel: "031-677-2005",
  mail: "unitop@unitopenc.com",
};

const page = document.body.dataset.page || "home";

document.getElementById("hd").outerHTML = `
<header class="hd"><div class="wrap">
  <a class="logo" href="index.html"><img src="assets/img/logo.png" alt="UNITOP E&C 유니탑이앤씨"></a>
  <nav class="gnb" id="gnb">${NAV.map(([h, t, k]) => `<a href="${h}" class="${k === page ? "on" : ""}">${t}</a>`).join("")}</nav>
  <div class="hd-util"><a href="contact.html">제품문의</a><i></i><a href="#">ENG</a></div>
  <button class="burger" id="burger" aria-label="메뉴"><span></span></button>
</div></header>`;

document.getElementById("ft").outerHTML = `
<footer class="ft"><div class="wrap">
  <div class="ft-l">
    <a class="lg" href="index.html"><img src="assets/img/logo.png" alt="UNITOP E&C"></a>
    <div class="ft-pol"><a href="#">개인정보처리방침</a><a href="#">이용약관</a></div>
    <p>본사 : ${COMPANY.hq}<br>연구소 : ${COMPANY.lab}<br>
    TEL : ${COMPANY.tel} &nbsp;|&nbsp; EMAIL : ${COMPANY.mail}</p>
    <p class="cp">Copyright © ${COMPANY.name} All rights reserved.</p>
  </div>
  <div class="ft-menu">
    <div><h5>회사소개</h5><a href="about.html#overview">회사개요</a><a href="about.html#history">연혁</a><a href="about.html#values">핵심가치</a></div>
    <div><h5>사업분야</h5><a href="business.html#precast">ECO-UHPC 2차제품</a><a href="business.html#modular">모듈러 주택</a><a href="business.html#lid">비점오염저감시설</a></div>
    <div><h5>제품소개</h5><a href="products.html#grating">그레이팅</a><a href="products.html#manhole">맨홀뚜껑</a><a href="products.html#tree">가로수보호판</a></div>
    <div><h5>고객센터</h5><a href="tech.html">기술·특허</a><a href="contact.html">문의하기</a></div>
  </div>
</div></footer>`;

/* mobile menu */
const burger = document.getElementById("burger"), gnb = document.getElementById("gnb");
burger.onclick = () => { burger.classList.toggle("open"); gnb.classList.toggle("open"); };

/* scroll reveal */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

/* hero slider */
const slides = [...document.querySelectorAll(".slide")];
if (slides.length) {
  const ctl = document.querySelector(".hero-ctl");
  let cur = 0, timer;
  const go = (i) => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("on", n === cur));
    [...ctl.children].forEach((b, n) => b.classList.toggle("on", n === cur));
  };
  slides.forEach((_, i) => { const b = document.createElement("button"); b.textContent = "0" + (i + 1); b.onclick = () => { go(i); reset(); }; ctl.appendChild(b); });
  const reset = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500); };
  go(0); reset();
}

/* business slider */
const track = document.querySelector(".biz-track");
if (track) {
  const cards = [...track.children], items = [...document.querySelectorAll(".biz-list li")];
  let cur = 0;
  const go = (i) => {
    cur = (i + cards.length) % cards.length;
    cards.forEach((c, n) => c.classList.toggle("on", n === cur));
    items.forEach((c, n) => c.classList.toggle("on", n === cur));
    track.style.transform = `translateX(${-cur * (cards[0].offsetWidth + 24)}px)`;
  };
  items.forEach((li, i) => li.onclick = () => go(i));
  document.querySelector(".arrows .prev").onclick = () => go(cur - 1);
  document.querySelector(".arrows .next").onclick = () => go(cur + 1);
  window.addEventListener("resize", () => go(cur));
  go(0);
}

/* news dots (decorative pager) */
document.querySelectorAll(".dots i").forEach((d, i, all) => d.onclick = () => all.forEach((x, n) => x.classList.toggle("on", n === i)));

/* project filter */
document.querySelectorAll(".chips[data-filter]").forEach((chips) => {
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    chips.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    document.querySelectorAll(".pj-card").forEach((c) => c.classList.toggle("hide", b.dataset.f !== "all" && c.dataset.cat !== b.dataset.f));
  });
});

/* contact form (front-end only demo) */
const form = document.getElementById("inquiry");
if (form) form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.\n(데모: 실제 전송은 서버 연동 후 동작합니다)");
  form.reset();
});

/* counters */
document.querySelectorAll("[data-count]").forEach((el) => {
  const o = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; o.disconnect();
    const end = +el.dataset.count, t0 = performance.now();
    const tick = (t) => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString(); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  o.observe(el);
});
