// FALQOR product catalogue (demo data)
window.TIERS = [
  { id: "affordable", name: "Affordable Luxury", short: "Affordable", price: 59, desc: "Signature square flacon, gold collar. Eau de Parfum, 50 ml." },
  { id: "premium", name: "Premium Luxury", short: "Premium", price: 129, desc: "Faceted crystal glass with sculpted cap. Higher concentration, 50 ml." },
  { id: "ultra", name: "Ultra Luxury", short: "Ultra", price: 249, desc: "Hand-finished jewelled flacon in a velvet-lined presentation box, 50 ml." }
];

window.PRODUCTS = [
  {
    id: "shadow", name: "Shadow", gender: "men", family: "Woody Spicy",
    mood: ["Mysterious", "Bold", "Evening"], color: "#b8964f",
    tagline: "Quiet power that lingers after you leave the room.",
    notes: { top: "Black pepper, cardamom", heart: "Cedarwood, leather", base: "Smoked oud, patchouli" },
    rating: 4.8, reviews: 214, badge: "Bestseller",
    images: ["tile-shadow", "tiers-shadow", "box-shadow"]
  },
  {
    id: "ocean-legend", name: "Ocean Legend", gender: "men", family: "Fresh Aquatic",
    mood: ["Fresh", "Free", "Daytime"], color: "#2f6bd1",
    tagline: "A crashing wave of salt, citrus and open sky.",
    notes: { top: "Sea salt, bergamot", heart: "Marine accord, sage", base: "Ambergris, driftwood" },
    rating: 4.9, reviews: 302, badge: "Most loved",
    images: ["tile-ocean-legend", "hero-ocean-tiers", "ocean-box", "box-ocean-legend"]
  },
  {
    id: "gold-supreme", name: "Gold Supreme", gender: "men", family: "Oud Amber",
    mood: ["Opulent", "Warm", "Statement"], color: "#d4a648",
    tagline: "Liquid gold. Saffron and oud wrapped in molten amber.",
    notes: { top: "Saffron, pink pepper", heart: "Agarwood (oud), rose", base: "Amber, vanilla, labdanum" },
    rating: 4.8, reviews: 176,
    images: ["tile-gold-supreme", "tiers-gold-supreme", "box-gold-supreme"]
  },
  {
    id: "urban-ninja", name: "Urban Ninja", gender: "men", family: "Fresh Spicy",
    mood: ["Modern", "Strong", "Distinctive"], color: "#8a8f99",
    tagline: "Modern. Strong. Distinctive. Made for the city after dark.",
    notes: { top: "Grapefruit, ginger", heart: "Lavender, pink pepper", base: "Vetiver, black leather, musk" },
    rating: 4.7, reviews: 158, badge: "New",
    images: ["tile-urban-ninja", "ninja-hero", "ninja-box", "tiers-urban-ninja"]
  },
  {
    id: "black-vetiver", name: "Black Vetiver", gender: "men", family: "Earthy Woody",
    mood: ["Grounded", "Refined", "Everyday"], color: "#2f8a5b",
    tagline: "Rain-soaked roots and polished woods. Nature, tailored.",
    notes: { top: "Lime, elemi", heart: "Haitian vetiver, iris", base: "Cedar, tonka bean" },
    rating: 4.7, reviews: 131,
    images: ["tile-black-vetiver", "vetiver-box", "tiers-black-vetiver"]
  },
  {
    id: "rose-noir", name: "Rosé Noir", gender: "women", family: "Fruity Floral",
    mood: ["Romantic", "Elegant", "Long lasting"], color: "#e0598b",
    tagline: "Romantic. Elegant. Long lasting. A rose with a secret.",
    notes: { top: "Lychee, raspberry", heart: "Turkish rose, peony", base: "White musk, patchouli" },
    rating: 4.9, reviews: 287, badge: "Bestseller",
    images: ["tile-rose-noir", "rose-hero", "box-rose-noir", "tiers-rose-noir"]
  },
  {
    id: "velvet-blossom", name: "Velvet Blossom", gender: "women", family: "White Floral",
    mood: ["Soft", "Sensual", "Graceful"], color: "#e9d9b8",
    tagline: "Jasmine petals on warm skin, wrapped in velvet.",
    notes: { top: "Neroli, mandarin", heart: "Jasmine sambac, tuberose", base: "Sandalwood, vanilla" },
    rating: 4.8, reviews: 199,
    images: ["tile-velvet-blossom", "velvet-tiers", "box-velvet-blossom"]
  },
  {
    id: "amber-rouge", name: "Amber Rouge", gender: "women", family: "Amber Sweet",
    mood: ["Passion", "Seductive", "Exclusive"], color: "#c4223a",
    tagline: "Passion. Seduction. Exclusivity, bottled in crimson crystal.",
    notes: { top: "Red berries, saffron", heart: "Damask rose, jasmine", base: "Amber, benzoin, vanilla" },
    rating: 4.9, reviews: 241, badge: "Most loved",
    images: ["tile-amber-rouge", "amber-hero", "amber-tiers", "box-amber-rouge"]
  },
  {
    id: "lumiere", name: "Lumière", gender: "women", family: "Fresh Floral",
    mood: ["Radiant", "Clean", "Daytime"], color: "#f1e3c6",
    tagline: "Morning light through white blossoms. Pure radiance.",
    notes: { top: "Pear, bergamot", heart: "Orange blossom, lily", base: "White musk, cashmeran" },
    rating: 4.8, reviews: 166,
    images: ["tile-lumiere", "lumiere-box", "lumiere-tiers", "box-lumiere"]
  },
  {
    id: "midnight-queen", name: "Midnight Queen", gender: "women", family: "Dark Fruity",
    mood: ["Regal", "Daring", "Night"], color: "#8b3fd1",
    tagline: "Rule the night. Dark plum, violet and velvet oud.",
    notes: { top: "Blackcurrant, plum", heart: "Violet, black orchid", base: "Vanilla, oud, musk" },
    rating: 4.8, reviews: 148, badge: "New",
    images: ["tile-midnight-queen", "box-midnight-queen", "tiers-midnight-queen"]
  }
];
