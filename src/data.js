// Static sample data (no database needed).
// Put your food photos in /public/images (see README for the file names).
const img = (file) => `/images/${file}`
export const ph = (text) =>
  `https://placehold.co/300x180/1e293b/ffffff?text=${encodeURIComponent(text)}`

// Hard-coded demo accounts. The role decides which side the app shows.
export const USERS = [
  {
    role: 'customer', email: 'user@example.com', username: 'user', password: 'user123',
    name: 'Juan Del Rosario', phone: '0917 123 4567', course: 'BS Information Technology', year: '3rd Year',
  },
  {
    role: 'seller', email: 'seller@example.com', username: 'seller', password: 'seller123',
    name: 'Maria Santos', store: 'KainKleek Kitchen', phone: '0928 555 0199',
  },
]

export const CATEGORIES = [
  { name: 'Rice Meals', desc: 'Filipino rice bowl combos, served hot and ready in minutes.', image: ph('Rice Meals') },
  { name: 'Snacks', desc: 'Merienda favorites like lumpia, siomai, and fries.', image: ph('Snacks') },
  { name: 'Drinks & Desserts', desc: 'Milk tea, halo-halo, and other cold treats.', image: ph('Drinks & Desserts') },
]

export const PRODUCTS = [
  { id: 1, name: 'Choco Butterbonia', price: 88, category: 'Snacks', stock: 25, featured: true,
    desc: '8 pieces of chocolate butterbonia, perfect for sharing or enjoying solo.', image: img('choco-butterbonia.png') },
  { id: 2, name: 'Dessert Milk Tea', price: 59, category: 'Drinks & Desserts', stock: 30, featured: true,
    desc: 'Classic milk tea dessert. 20% off for first-time orders today.', image: img('milkteaf.png') },
  { id: 3, name: 'Nata de Coco', price: 5, category: 'Drinks & Desserts', stock: 100, featured: true,
    desc: 'Sweet, chewy nata de coco. Add it to any drink.', image: img('nata.png') },
  { id: 4, name: 'Palamig', price: 99, category: 'Drinks & Desserts', stock: 40,
    desc: 'Cold and refreshing Filipino palamig, perfect on a hot day.', image: img('palamig.png') },
  { id: 5, name: 'Siomai Rice', price: 67, category: 'Rice Meals', stock: 50,
    desc: '2 pieces of siomai served with a cup of steamed rice.', image: img('siomai-ric.png') },
  { id: 6, name: 'Pork Sisig', price: 135, category: 'Rice Meals', stock: 20,
    desc: 'Sizzling sisig, best paired with rice.', image: ph('Pork Sisig') },
  { id: 7, name: 'Leche Flan', price: 45, category: 'Drinks & Desserts', stock: 15,
    desc: 'Creamy caramel custard, made fresh daily.', image: ph('Leche Flan') },
  { id: 8, name: 'Fresh Buko Juice', price: 55, category: 'Drinks & Desserts', stock: 35,
    desc: 'Cold coconut juice straight from the shell.', image: ph('Buko Juice') },
]

export const ORDERS = [
  { no: '#KK-1042', date: 'Oct 24, 2026', items: 'Siomai Rice x2, Palamig x1', status: 'Delivered', total: 210 },
  { no: '#KK-1039', date: 'Oct 27, 2026', items: 'Palamig x1', status: 'Out for Delivery', total: 99 },
  { no: '#KK-1031', date: 'Oct 29, 2026', items: 'Pork Sisig x1, Leche Flan x1', status: 'Preparing', total: 179 },
]

export const SELLER_ORDERS = [
  { no: '#KK-1042', customer: 'Juan Del Rosario', product: 'Siomai Rice x2, Palamig x1', status: 'Delivered', total: 210 },
  { no: '#KK-1041', customer: 'Ana Reyes', product: 'Choco Butterbonia x1', status: 'Delivered', total: 88 },
  { no: '#KK-1039', customer: 'Juan Del Rosario', product: 'Palamig x1', status: 'Out for Delivery', total: 99 },
  { no: '#KK-1035', customer: 'Mark Lopez', product: 'Pork Sisig x2', status: 'Out for Delivery', total: 270 },
  { no: '#KK-1031', customer: 'Juan Del Rosario', product: 'Pork Sisig x1, Leche Flan x1', status: 'Preparing', total: 179 },
]

export const STATUSES = ['Preparing', 'Out for Delivery', 'Delivered']
