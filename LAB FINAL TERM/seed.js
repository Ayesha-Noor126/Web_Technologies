const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/mern')
.then(() => console.log("MongoDB Connected"));

const products = [

  // ─── POLO SHIRTS ──────────────────────────────────
  {
    name: 'Off White Signature Polo',
    price: 7450, category: 'polo-shirts', badge: 'New',
    images: ['/assest/hertiage polo pict 1.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 50,
    description: 'A timeless off-white polo crafted from premium pique cotton.'
  },
  {
    name: 'Navy Signature Polo',
    price: 7450, category: 'polo-shirts', badge: 'New',
    images: ['/assest/hertiage polo 2.jpg'],
    sizes: ['S','M','L','XL','XXL'], stock: 50,
    description: 'Classic navy blue polo with our heritage signature finish.'
  },
  {
    name: 'Black Signature Polo',
    price: 7450, category: 'polo-shirts', badge: 'New',
    images: ['/assest/black signature polo.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 50,
    description: 'The essential black polo — versatile, sleek, and effortlessly stylish.'
  },
  {
    name: 'Olive Signature Polo',
    price: 7450, category: 'polo-shirts', badge: 'New',
    images: ['/assest/olive signature polo.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 30,
    description: 'Earthy olive tones meet refined tailoring in this signature polo.'
  },
  {
    name: 'Beige Signature Polo',
    price: 7450, category: 'polo-shirts', badge: 'New',
    images: ['/assest/beige signature polo.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 40,
    description: 'Soft beige tones for a warm, sophisticated look.'
  },
  {
    name: 'Pink Signature Polo',
    price: 7450, category: 'polo-shirts', badge: 'New',
    images: ['/assest/pink signature polo.jpg'],
    sizes: ['S','M','L','XL','XXL'], stock: 25,
    description: 'A bold yet refined pink polo that adds personality to your wardrobe.'
  },
  {
    name: 'Brown Signature Polo',
    price: 7250, category: 'polo-shirts', badge: 'New',
    images: ['/assest/brown signature polo.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 35,
    description: 'Rich brown tones with a premium finish.'
  },
  {
    name: 'Rust Signature Polo',
    price: 7250, category: 'polo-shirts', badge: 'New',
    images: ['/assest/rust signature polo.jpg'],
    sizes: ['S','M','L','XL','XXL'], stock: 0,
    description: 'A distinctive rust-colored polo that stands out from the crowd.'
  },

  // ─── SUITS ────────────────────────────────────────
  {
    name: 'Classic Navy 2-Piece Suit',
    price: 45000, category: 'suits', badge: 'New',
    images: ['/assest/formals.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 20,
    description: 'A sharp navy 2-piece suit crafted for the modern gentleman. Perfect for business meetings and formal events.'
  },
  {
    name: 'Charcoal Grey Suit',
    price: 48000, category: 'suits', badge: 'New',
    images: ['/assest/formals.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 15,
    description: 'Timeless charcoal grey suit with a slim fit silhouette. Pairs perfectly with white or pastel shirts.'
  },
  {
    name: 'Beige 3-Piece Suit',
    price: 55000, category: 'suits', badge: 'New',
    images: ['/assest/formals.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 10,
    description: 'Elegant beige 3-piece suit ideal for weddings and formal occasions.'
  },

  // ─── CASUAL SHIRTS ────────────────────────────────
  {
    name: 'White Casual Linen Shirt',
    price: 4500, category: 'casual-shirts', badge: 'New',
    images: ['/assest/causals.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 60,
    description: 'Breathable linen casual shirt perfect for summer outings and relaxed gatherings.'
  },
  {
    name: 'Denim Casual Shirt',
    price: 5200, category: 'casual-shirts', badge: 'New',
    images: ['/assest/causals.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 45,
    description: 'A classic denim shirt that pairs well with chinos or jeans for a smart-casual look.'
  },

  // ─── T-SHIRTS ─────────────────────────────────────
  {
    name: 'White Essential T-Shirt',
    price: 2500, category: 't-shirts', badge: 'New',
    images: ['/assest/T-shirt.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 100,
    description: 'The perfect everyday white t-shirt. Made from 100% combed cotton for maximum comfort.'
  },
  {
    name: 'Black Essential T-Shirt',
    price: 2500, category: 't-shirts', badge: 'New',
    images: ['/assest/T-shirt.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 100,
    description: 'A must-have black t-shirt crafted from premium cotton for all-day comfort.'
  },
  {
    name: 'Navy Graphic T-Shirt',
    price: 3200, category: 't-shirts', badge: 'New',
    images: ['/assest/T-shirt.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 75,
    description: 'Bold graphic print on premium navy cotton. A statement piece for casual wear.'
  },

  // ─── TEHWAR ───────────────────────────────────────
  {
    name: 'White Kurta Shalwar',
    price: 8500, category: 'tehwar', badge: 'New',
    images: ['/assest/tehwar collection.jpg'],
    sizes: ['S','M','L','XL','XXL'], stock: 40,
    description: 'Elegant white kurta shalwar crafted for festive occasions. Intricate embroidery at collar and cuffs.'
  },
  {
    name: 'Beige Festive Kurta',
    price: 9500, category: 'tehwar', badge: 'New',
    images: ['/assest/tehwar.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 30,
    description: 'Refined beige festive kurta with subtle embellishments. Perfect for Eid and weddings.'
  },
  {
    name: 'Grey Waistcoat Set',
    price: 12000, category: 'tehwar', badge: 'New',
    images: ['/assest/tehwar.webp'],
    sizes: ['S','M','L','XL','XXL'], stock: 20,
    description: 'A complete grey waistcoat set combining tradition with contemporary style.'
  },

  // ─── ACCESSORIES ──────────────────────────────────
  {
    name: 'Silk Tie - Navy Blue',
    price: 3500, category: 'accessories', badge: 'New',
    images: ['/assest/accessoires.webp'],
    sizes: ['One Size'], stock: 50,
    description: 'Premium silk tie in classic navy blue. A sophisticated addition to any formal outfit.'
  },
  {
    name: 'Leather Belt - Black',
    price: 4200, category: 'accessories', badge: 'New',
    images: ['/assest/accessoires.webp'],
    sizes: ['S','M','L','XL'], stock: 35,
    description: 'Genuine leather belt with a classic silver buckle. Built to last a lifetime.'
  },
  {
    name: 'Pocket Square Set',
    price: 1800, category: 'accessories', badge: 'New',
    images: ['/assest/accessoires.webp'],
    sizes: ['One Size'], stock: 60,
    description: 'Set of 3 premium pocket squares in complementary colors. Elevate any suit instantly.'
  }

];

async function seedDB() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ ${products.length} Products seeded!`);
  mongoose.connection.close();
}

seedDB();