(() => {
  const P = window.PRODUCTS, T = window.TIERS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const img = n => `assets/img/${n}.jpg`;
  const money = n => "$" + n.toLocaleString("en-AU");
  const byId = id => P.find(p => p.id === id);
  const tierBy = id => T.find(t => t.id === id);
  const FREE_SHIP = 150;
  const DISCOVERY = { id: "discovery", name: "Discovery Set", price: 49, image: "lineup-wide", label: "10 × 2 ml vials" };

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  let cart = store.get("falqor-cart", []);
  let wish = new Set(store.get("falqor-wish", []));
  let filter = "all", sort = "featured";
  const cardTier = {};

  // ---------- toast ----------
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // ---------- marquee ----------
  const names = P.map(p => `<span>${p.name}</span>`).join("");
  $("#marquee").innerHTML = names + names;

  // ---------- tiers list ----------
  $("#tierList").innerHTML = T.map((t, i) => `
    <div class="tier">
      <span class="tier__num">0${i + 1}</span>
      <div><h4>${t.name}</h4><p>${t.desc}</p></div>
      <span class="tier__price"><small>From</small>${money(t.price)}</span>
    </div>`).join("");

  // ---------- grid ----------
  const heart = `<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`;
  function renderGrid() {
    let list = P.filter(p => filter === "all" || p.gender === filter);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    $("#productGrid").innerHTML = list.map((p, i) => {
      const tid = cardTier[p.id] || "affordable";
      return `
      <article class="card" style="--accent:${p.color};animation-delay:${i * 50}ms" data-id="${p.id}">
        <div class="card__media" data-open="${p.id}">
          ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
          <img class="main" src="${img(p.images[0])}" alt="${p.name} ${p.family} Eau de Parfum" loading="lazy" />
          <img class="alt" src="${img("tiers-" + p.id)}" alt="" loading="lazy" />
          <button class="card__quick" data-open="${p.id}">Quick view</button>
        </div>
        <button class="icon-btn card__wish ${wish.has(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Save ${p.name}">${heart}</button>
        <div class="card__body">
          <div class="card__top">
            <h3 class="card__name">${p.name}</h3>
            <span class="card__rating"><b>★ ${p.rating}</b> (${p.reviews})</span>
          </div>
          <span class="card__family">${p.gender === "men" ? "Men" : "Women"} · ${p.family}</span>
          <div class="tiers-mini" role="radiogroup" aria-label="Luxury level">
            ${T.map(t => `<button class="${t.id === tid ? "is-active" : ""}" data-tier="${t.id}" role="radio" aria-checked="${t.id === tid}">${t.short}</button>`).join("")}
          </div>
          <div class="card__foot">
            <span class="price">${money(tierBy(tid).price)}</span>
            <button class="add" data-add="${p.id}" aria-label="Add ${p.name} to bag"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  $("#productGrid").addEventListener("click", e => {
    const card = e.target.closest(".card"); if (!card) return;
    const id = card.dataset.id;
    const tb = e.target.closest("[data-tier]");
    if (tb) {
      cardTier[id] = tb.dataset.tier;
      $$("[data-tier]", card).forEach(b => { const on = b === tb; b.classList.toggle("is-active", on); b.setAttribute("aria-checked", on); });
      $(".price", card).textContent = money(tierBy(tb.dataset.tier).price);
      return;
    }
    if (e.target.closest("[data-add]")) return addToCart(id, cardTier[id] || "affordable", 1);
    if (e.target.closest("[data-wish]")) return toggleWish(id, e.target.closest("[data-wish]"));
  });

  function setFilter(f) {
    filter = f;
    $$(".chip").forEach(c => c.classList.toggle("is-active", c.dataset.filter === f));
    renderGrid();
  }
  $$(".chip").forEach(c => c.addEventListener("click", () => setFilter(c.dataset.filter)));
  $$("[data-filter-link]").forEach(a => a.addEventListener("click", () => { setFilter(a.dataset.filterLink); closeMenu(); }));
  $("#sort").addEventListener("change", e => { sort = e.target.value; renderGrid(); });

  // ---------- wishlist ----------
  function toggleWish(id, btn) {
    wish.has(id) ? wish.delete(id) : wish.add(id);
    btn?.classList.toggle("on", wish.has(id));
    store.set("falqor-wish", [...wish]);
    updateCounts();
    toast(wish.has(id) ? `${byId(id).name} saved to wishlist` : `Removed from wishlist`);
  }
  $("#wishBtn").addEventListener("click", () => {
    if (!wish.size) return toast("Your wishlist is empty. Tap ♡ on any scent.");
    toast("Saved: " + [...wish].map(id => byId(id).name).join(", "));
  });

  // ---------- cart ----------
  const lineInfo = l => {
    if (l.id === "discovery") return { name: DISCOVERY.name, price: DISCOVERY.price, image: DISCOVERY.image, label: DISCOVERY.label };
    const p = byId(l.id), t = tierBy(l.tier);
    return { name: p.name, price: t.price, image: p.images[0], label: `${t.name} · 50 ml` };
  };
  function addToCart(id, tier, qty) {
    const ex = cart.find(l => l.id === id && l.tier === tier);
    ex ? ex.qty += qty : cart.push({ id, tier, qty });
    saveCart();
    const info = lineInfo({ id, tier });
    toast(`Added ${info.name}${id !== "discovery" ? " (" + tierBy(tier).short + ")" : ""} to your bag`);
    bump();
  }
  function saveCart() { store.set("falqor-cart", cart); renderCart(); updateCounts(); }
  function bump() { const c = $("#cartCount"); c.animate([{ transform: "scale(1.6)" }, { transform: "scale(1)" }], { duration: 400, easing: "ease-out" }); }
  function updateCounts() {
    const n = cart.reduce((s, l) => s + l.qty, 0);
    $("#cartCount").textContent = n; $("#cartCount").classList.toggle("show", n > 0);
    $("#wishCount").textContent = wish.size; $("#wishCount").classList.toggle("show", wish.size > 0);
  }
  function renderCart() {
    const sub = cart.reduce((s, l) => s + lineInfo(l).price * l.qty, 0);
    $("#subtotal").textContent = money(sub);
    const left = FREE_SHIP - sub;
    $("#ship").innerHTML = (left > 0 ? `You're <b style="color:var(--gold-2)">${money(left)}</b> away from complimentary express shipping` : `✦ You've unlocked complimentary express shipping`) +
      `<div class="ship__bar"><i style="width:${Math.min(100, sub / FREE_SHIP * 100)}%"></i></div>`;
    $("#checkoutBtn").disabled = !cart.length;
    $("#checkoutBtn").style.opacity = cart.length ? 1 : .5;
    $("#cartItems").innerHTML = cart.length ? cart.map((l, i) => {
      const x = lineInfo(l);
      return `<div class="line">
        <img src="${img(x.image)}" alt="" />
        <div><h5>${x.name}</h5><small>${x.label}</small>
          <div class="qty"><button data-dec="${i}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-inc="${i}" aria-label="Increase">+</button></div>
        </div>
        <div class="line__right"><b>${money(x.price * l.qty)}</b><button class="line__rm" data-rm="${i}">Remove</button></div>
      </div>`;
    }).join("") : `<div class="empty"><p>Your bag is empty</p><span class="small">Discover a scent that speaks for you.</span><br /><br /><button class="btn btn--ghost" data-close-cart data-goto>Shop now</button></div>`;
  }
  $("#cartItems").addEventListener("click", e => {
    const t = e.target;
    if (t.dataset.inc) cart[t.dataset.inc].qty++;
    else if (t.dataset.dec) { const l = cart[t.dataset.dec]; l.qty--; if (!l.qty) cart.splice(t.dataset.dec, 1); }
    else if (t.dataset.rm) cart.splice(t.dataset.rm, 1);
    else if (t.hasAttribute("data-goto")) { closeCart(); location.hash = "collection"; return; }
    else return;
    saveCart();
  });
  const openCart = () => { $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false"); document.body.classList.add("locked"); };
  const closeCart = () => { $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden", "true"); document.body.classList.remove("locked"); };
  $("#cartBtn").addEventListener("click", openCart);
  $$("[data-close-cart]").forEach(b => b.addEventListener("click", closeCart));
  $("#checkoutBtn").addEventListener("click", () => {
    if (!cart.length) return;
    cart = []; saveCart(); closeCart();
    toast("✦ Thank you! This is a demo store, so no payment was taken.");
  });
  $("#discoveryBtn").addEventListener("click", () => addToCart("discovery", "set", 1));

  // ---------- product modal ----------
  function openProduct(id) {
    const p = byId(id); if (!p) return;
    let tier = cardTier[id] || "premium", qty = 1;
    const gallery = [...new Set([...p.images, "tiers-" + p.id, "box-" + p.id])].slice(0, 5);
    $("#modalBody").innerHTML = `
      <div class="pd" style="--accent:${p.color}">
        <div class="pd__gallery">
          <div class="pd__main"><img id="pdMain" src="${img(gallery[0])}" alt="${p.name}" /></div>
          <div class="pd__thumbs">${gallery.map((g, i) => `<button class="${i ? "" : "on"}" data-img="${g}" aria-label="View image ${i + 1}"><img src="${img(g)}" alt="" /></button>`).join("")}</div>
        </div>
        <div class="pd__info">
          <p class="eyebrow" style="margin:0">${p.gender === "men" ? "Men's" : "Women's"} Collection · ${p.family}</p>
          <h2 id="mTitle">${p.name}</h2>
          <p class="card__rating"><b>★ ${p.rating}</b> · ${p.reviews} reviews</p>
          <p class="pd__tagline">${p.tagline}</p>
          <div class="pd__moods">${p.mood.map(m => `<span>${m}</span>`).join("")}</div>
          <dl class="pyramid">
            <div><dt>Top</dt><dd>${p.notes.top}</dd></div>
            <div><dt>Heart</dt><dd>${p.notes.heart}</dd></div>
            <div><dt>Base</dt><dd>${p.notes.base}</dd></div>
          </dl>
          <div class="tier-pick">${T.map(t => `
            <label><input type="radio" name="tier" value="${t.id}" ${t.id === tier ? "checked" : ""} />
              <span><b>${t.name}</b><small>${t.desc}</small></span><span class="p">${money(t.price)}</span></label>`).join("")}
          </div>
          <div class="pd__buy">
            <div class="qty"><button id="qDec" aria-label="Decrease">−</button><span id="qVal">1</span><button id="qInc" aria-label="Increase">+</button></div>
            <button class="btn btn--gold" id="pdAdd">Add to bag · <span id="pdPrice">${money(tierBy(tier).price)}</span></button>
          </div>
        </div>
      </div>`;
    const upd = () => { $("#qVal").textContent = qty; $("#pdPrice").textContent = money(tierBy(tier).price * qty); };
    $$(".pd__thumbs button").forEach(b => b.addEventListener("click", () => {
      $$(".pd__thumbs button").forEach(x => x.classList.toggle("on", x === b));
      const m = $("#pdMain"); m.src = img(b.dataset.img); m.style.animation = "none"; m.offsetHeight; m.style.animation = "";
    }));
    $$('input[name="tier"]').forEach(r => r.addEventListener("change", () => { tier = r.value; upd(); }));
    $("#qDec").onclick = () => { qty = Math.max(1, qty - 1); upd(); };
    $("#qInc").onclick = () => { qty++; upd(); };
    $("#pdAdd").onclick = () => { addToCart(id, tier, qty); closeModal(); setTimeout(openCart, 250); };
    $("#modal").classList.add("open"); $("#modal").setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    $(".modal__panel").scrollTop = 0;
  }
  function closeModal() { $("#modal").classList.remove("open"); $("#modal").setAttribute("aria-hidden", "true"); document.body.classList.remove("locked"); }
  $$("[data-close]").forEach(b => b.addEventListener("click", closeModal));
  document.addEventListener("click", e => {
    const o = e.target.closest("[data-open]");
    if (o) { e.preventDefault(); openProduct(o.dataset.open); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeCart(); closeMenu(); } });

  // ---------- scent finder ----------
  const Q = [
    { q: "Who is this fragrance for?", key: "gender", opts: [["men", "For him", "Bold, structured, magnetic"], ["women", "For her", "Radiant, sensual, refined"], ["any", "Surprise me", "Show me everything"]] },
    { q: "When will you wear it most?", key: "time", opts: [["day", "By day", "Office, brunch, sunshine"], ["night", "After dark", "Dinners, dates, events"], ["always", "Every moment", "My signature, always"]] },
    { q: "Which world draws you in?", key: "world", opts: [["fresh", "Fresh & airy", "Citrus, sea, clean musk"], ["floral", "Floral & fruity", "Roses, jasmine, berries"], ["warm", "Warm & woody", "Oud, amber, leather"]] }
  ];
  const MAP = {
    men: { fresh: { day: "ocean-legend", night: "urban-ninja", always: "ocean-legend" }, floral: { day: "black-vetiver", night: "urban-ninja", always: "black-vetiver" }, warm: { day: "black-vetiver", night: "shadow", always: "gold-supreme" } },
    women: { fresh: { day: "lumiere", night: "velvet-blossom", always: "lumiere" }, floral: { day: "rose-noir", night: "amber-rouge", always: "rose-noir" }, warm: { day: "velvet-blossom", night: "midnight-queen", always: "amber-rouge" } }
  };
  let ans = {}, step = 0;
  function renderFinder() {
    const card = $("#finderCard");
    const prog = `<div class="finder__progress">${Q.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}</div>`;
    if (step < Q.length) {
      const s = Q[step];
      card.innerHTML = prog + `<h3 class="finder__q">${s.q}</h3><div class="finder__opts">${s.opts.map(([v, b, d]) => `<button class="opt" data-v="${v}"><b>${b}</b><span>${d}</span></button>`).join("")}</div>`;
      $$(".opt", card).forEach(o => o.addEventListener("click", () => { ans[s.key] = o.dataset.v; step++; renderFinder(); }));
    } else {
      const g = ans.gender === "any" ? (ans.world === "floral" ? "women" : Math.random() < .5 ? "men" : "women") : ans.gender;
      const p = byId(MAP[g][ans.world][ans.time]);
      card.innerHTML = prog + `<div class="match">
        <img src="${img(p.images[0])}" alt="${p.name}" />
        <div><p class="eyebrow">Your match</p><h3>${p.name}</h3><p class="card__family" style="--accent:${p.color}">${p.family}</p>
        <p class="pd__tagline">${p.tagline}</p>
        <div class="match__actions"><button class="btn btn--gold" data-open="${p.id}">View fragrance</button><button class="btn btn--ghost" id="again">Start again</button></div></div>
      </div>`;
      $("#again").onclick = () => { ans = {}; step = 0; renderFinder(); };
    }
  }

  // ---------- nav ----------
  const closeMenu = () => $("#navLinks").classList.remove("open");
  $("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", closeMenu));
  addEventListener("scroll", () => $("#nav").classList.toggle("scrolled", scrollY > 10), { passive: true });

  // ---------- newsletter ----------
  $("#newsForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("✦ Welcome to the Falcon Circle. Your 10% code: FALCON10"); });

  // ---------- reveal ----------
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));

  renderGrid(); renderCart(); updateCounts(); renderFinder();
})();
