// Centralized image URLs (Pexels stock — referenced, not downloaded)
// Helper to build sized Pexels URLs
const px = (id: string, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const img = {
  // Hero lifestyle — model in elegant heels
  heroMain: px('32285300', 1400),
  heroAlt: px('27100516', 1200),
  heroSecondary: px('19927197', 900),

  // Promo / editorial
  promo: px('12564240', 1600),
  editorial1: px('18390915', 800),
  editorial2: px('27127387', 800),
  editorial3: px('27113446', 800),

  // Category cards
  catClassic: px('31450733', 800),
  catParty: px('13229861', 800),
  catWedding: px('35538850', 800),
  catOffice: px('134064', 800),
  catLuxury: px('27023941', 800),
  catLimited: px('5713302', 800),

  // Product shots (paired / single heels)
  p1: px('12687623', 700),
  p2: px('26850888', 700),
  p3: px('31450733', 700),
  p4: px('13229861', 700),
  p5: px('35538850', 700),
  p6: px('27023941', 700),
  p7: px('134064', 700),
  p8: px('5713302', 700),
  p9: px('12564240', 700),
  p10: px('27100516', 700),
  p11: px('19927197', 700),
  p12: px('32285300', 700),

  // Instagram lifestyle
  ig1: px('18390915', 600),
  ig2: px('27127387', 600),
  ig3: px('27113446', 600),
  ig4: px('12564240', 600),
  ig5: px('27100516', 600),
  ig6: px('32285300', 600),

  // Testimonials (portraits)
  t1: px('27023941', 200),
  t2: px('134064', 200),
  t3: px('5713302', 200),
  t4: px('12687623', 200),
};

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: 'Best Seller' | 'Trending' | 'Limited' | 'New';
  discount?: number;
  image: string;
  hoverImage: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Seraphina Stiletto',
    category: 'Classic Heels',
    price: 480,
    oldPrice: 620,
    rating: 5,
    reviews: 214,
    badge: 'Best Seller',
    discount: 23,
    image: img.p1,
    hoverImage: img.p3,
  },
  {
    id: 2,
    name: 'Aurora Gold Sandal',
    category: 'Luxury Collection',
    price: 720,
    oldPrice: 890,
    rating: 5,
    reviews: 167,
    badge: 'Trending',
    discount: 19,
    image: img.p2,
    hoverImage: img.p6,
  },
  {
    id: 3,
    name: 'Celestia Pointed Pump',
    category: 'Office Heels',
    price: 360,
    rating: 4,
    reviews: 98,
    badge: 'New',
    image: img.p3,
    hoverImage: img.p7,
  },
  {
    id: 4,
    name: 'Vienna Crystal Heel',
    category: 'Wedding Heels',
    price: 880,
    oldPrice: 1050,
    rating: 5,
    reviews: 142,
    badge: 'Limited',
    discount: 16,
    image: img.p4,
    hoverImage: img.p8,
  },
  {
    id: 5,
    name: 'Margaux Block Heel',
    category: 'Party Heels',
    price: 410,
    oldPrice: 520,
    rating: 5,
    reviews: 187,
    badge: 'Best Seller',
    discount: 21,
    image: img.p5,
    hoverImage: img.p9,
  },
  {
    id: 6,
    name: 'Elora Satin Mule',
    category: 'Limited Edition',
    price: 540,
    rating: 4,
    reviews: 76,
    badge: 'New',
    image: img.p6,
    hoverImage: img.p10,
  },
  {
    id: 7,
    name: 'Capri Knot Heel',
    category: 'Classic Heels',
    price: 390,
    oldPrice: 470,
    rating: 5,
    reviews: 132,
    badge: 'Trending',
    discount: 17,
    image: img.p7,
    hoverImage: img.p11,
  },
  {
    id: 8,
    name: 'Lorraine Pearl Pump',
    category: 'Luxury Collection',
    price: 760,
    oldPrice: 920,
    rating: 5,
    reviews: 159,
    badge: 'Best Seller',
    discount: 17,
    image: img.p8,
    hoverImage: img.p12,
  },
];

export const bestSellers = [
  {
    id: 21,
    name: 'Seraphina Stiletto',
    category: 'Classic Heels',
    price: 480,
    oldPrice: 620,
    rating: 5,
    reviews: 214,
    badge: 'Best Seller' as const,
    image: img.p1,
    hoverImage: img.p3,
  },
  {
    id: 22,
    name: 'Aurora Gold Sandal',
    category: 'Luxury Collection',
    price: 720,
    oldPrice: 890,
    rating: 5,
    reviews: 167,
    badge: 'Trending' as const,
    image: img.p2,
    hoverImage: img.p6,
  },
  {
    id: 23,
    name: 'Margaux Block Heel',
    category: 'Party Heels',
    price: 410,
    oldPrice: 520,
    rating: 5,
    reviews: 187,
    badge: 'Best Seller' as const,
    image: img.p5,
    hoverImage: img.p9,
  },
  {
    id: 24,
    name: 'Lorraine Pearl Pump',
    category: 'Luxury Collection',
    price: 760,
    oldPrice: 920,
    rating: 5,
    reviews: 159,
    badge: 'Limited' as const,
    image: img.p8,
    hoverImage: img.p12,
  },
  {
    id: 25,
    name: 'Vienna Crystal Heel',
    category: 'Wedding Heels',
    price: 880,
    oldPrice: 1050,
    rating: 5,
    reviews: 142,
    badge: 'Trending' as const,
    image: img.p4,
    hoverImage: img.p8,
  },
];

export const newArrivals = [
  {
    id: 31,
    name: 'Celestia Pointed Pump',
    category: 'Office Heels',
    price: 360,
    rating: 4,
    reviews: 98,
    badge: 'New' as const,
    image: img.p3,
    hoverImage: img.p7,
  },
  {
    id: 32,
    name: 'Elora Satin Mule',
    category: 'Limited Edition',
    price: 540,
    rating: 4,
    reviews: 76,
    badge: 'New' as const,
    image: img.p6,
    hoverImage: img.p10,
  },
  {
    id: 33,
    name: 'Capri Knot Heel',
    category: 'Classic Heels',
    price: 390,
    oldPrice: 470,
    rating: 5,
    reviews: 132,
    badge: 'New' as const,
    image: img.p7,
    hoverImage: img.p11,
  },
  {
    id: 34,
    name: 'Margaux Block Heel',
    category: 'Party Heels',
    price: 410,
    oldPrice: 520,
    rating: 5,
    reviews: 187,
    badge: 'New' as const,
    image: img.p5,
    hoverImage: img.p9,
  },
];

export const categories = [
  { name: 'Classic Heels', count: 42, image: img.catClassic, blurb: 'Timeless silhouettes' },
  { name: 'Party Heels', count: 28, image: img.catParty, blurb: 'Statement sparkle' },
  { name: 'Wedding Heels', count: 19, image: img.catWedding, blurb: 'Bridal elegance' },
  { name: 'Office Heels', count: 35, image: img.catOffice, blurb: 'Refined comfort' },
  { name: 'Luxury Collection', count: 24, image: img.catLuxury, blurb: 'Handcrafted couture' },
  { name: 'Limited Edition', count: 12, image: img.catLimited, blurb: 'Rare & exclusive' },
];

export const testimonials = [
  {
    id: 1,
    name: 'Ama Serwaa',
    location: 'Accra, Ghana',
    rating: 5,
    avatar: img.t1,
    text: 'The craftsmanship is unreal. My Seraphina heels felt custom-made — comfortable enough for a 10-hour event and absolutely stunning. ANISHEELS has become my go-to.',
  },
  {
    id: 2,
    name: 'Lara Mensah',
    location: 'Kumasi, Ghana',
    rating: 5,
    avatar: img.t2,
    text: 'I wore the Vienna Crystal heels for my wedding and they were pure magic. The detail, the comfort, the gold accents — every guest asked where they were from.',
  },
  {
    id: 3,
    name: 'Esi Owusu',
    location: 'London, UK',
    rating: 5,
    avatar: img.t3,
    text: 'Shipped to London in four days. The packaging alone feels like a luxury boutique experience. These are genuinely Louboutin-tier at a fraction of the price.',
  },
  {
    id: 4,
    name: 'Nadia Karim',
    location: 'Dubai, UAE',
    rating: 5,
    avatar: img.t4,
    text: 'The Aurora gold sandals are my new signature. Quality you can feel the moment you pick them up. ANISHEELS understands what luxury means for the modern woman.',
  },
];

export const features = [
  { title: 'Premium Quality', desc: 'Handcrafted from fine Italian materials', icon: 'crown' },
  { title: 'Free Delivery', desc: 'On all orders above GHS 300', icon: 'truck' },
  { title: 'Easy Returns', desc: '30-day hassle-free returns', icon: 'refresh' },
  { title: 'Secure Payments', desc: 'Encrypted & protected checkout', icon: 'shield' },
  { title: '24/7 Support', desc: 'Concierge care, anytime you need', icon: 'headset' },
];

export const whyChooseUs = [
  { title: 'Premium Materials', desc: 'Italian leather, silk satin & genuine crystal — sourced from the finest tanneries and ateliers in Europe.', icon: 'gem', stat: '100%' },
  { title: 'Designed for Comfort', desc: 'Memory-foam insoles and ergonomically engineered heels so you never have to choose between beauty and comfort.', icon: 'heart', stat: '12hr' },
  { title: 'Luxury Craftsmanship', desc: 'Each pair is hand-finished by master cobblers with over 20 years of artisan experience.', icon: 'scissors', stat: '20+ yrs' },
  { title: 'Fast Shipping', desc: 'Express worldwide delivery with insured tracking on every order, door to door.', icon: 'plane', stat: '48hr' },
  { title: 'Trusted Brand', desc: 'Loved by 10,000+ women across 30 countries — with a 4.9-star average rating.', icon: 'badge', stat: '4.9★' },
];
