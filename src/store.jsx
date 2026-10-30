import { createContext, useContext, useEffect, useState } from 'react'
import { USERS, PRODUCTS, ORDERS, SELLER_ORDERS } from './data'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

// useState that is saved in localStorage
function usePersist(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
  }, [key, value])
  return [value, setValue]
}

export function StoreProvider({ children }) {
  const [session, setSession] = usePersist('kk_session', null)
  const [products, setProducts] = usePersist('kk_products', PRODUCTS)
  const [cart, setCart] = usePersist('kk_cart', [])
  const [wishlist, setWishlist] = usePersist('kk_wishlist', [6, 7, 8])
  const [orders, setOrders] = usePersist('kk_orders', ORDERS)
  const [sellerOrders, setSellerOrders] = usePersist('kk_seller_orders', SELLER_ORDERS)
  const [dark, setDark] = usePersist('kk_dark', false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light')
  }, [dark])

  const user = USERS.find((u) => u.email === session) || null

  // ---------- auth ----------
  const login = (id, password) => {
    const key = id.trim().toLowerCase()
    const found = USERS.find((u) => (u.email === key || u.username === key) && u.password === password)
    if (found) setSession(found.email)
    return found || null
  }
  const logout = () => setSession(null)

  // ---------- cart ----------
  const cartItems = cart
    .map((c) => {
      const p = products.find((x) => x.id === c.id)
      return p ? { ...p, qty: c.qty } : null
    })
    .filter(Boolean)
  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0)
  const cartTotal = cartItems.reduce((n, i) => n + i.qty * i.price, 0)

  const addToCart = (id) => {
    setCart((c) => (c.some((i) => i.id === id)
      ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
      : [...c, { id, qty: 1 }]))
    const p = products.find((x) => x.id === id)
    setToast(`${p ? p.name : 'Item'} added to cart!`)
  }
  const changeQty = (id, delta) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)))
  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id))

  const checkout = () => {
    if (!cartItems.length) return false
    const no = `#KK-${1100 + orders.length}`
    const items = cartItems.map((i) => `${i.name} x${i.qty}`).join(', ')
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    setOrders((o) => [{ no, date, items, status: 'Preparing', total: cartTotal }, ...o])
    setSellerOrders((o) => [{ no, customer: user.name, product: items, status: 'Preparing', total: cartTotal }, ...o])
    setProducts((ps) => ps.map((p) => {
      const bought = cartItems.find((i) => i.id === p.id)
      return bought ? { ...p, stock: Math.max(0, p.stock - bought.qty) } : p
    }))
    setCart([])
    setToast('Checkout successful! Thank you for ordering from KainKleek.')
    return true
  }

  // ---------- wishlist ----------
  const toggleWishlist = (id) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
  const moveToCart = (id) => {
    addToCart(id)
    setWishlist((w) => w.filter((x) => x !== id))
  }

  // ---------- seller: products & orders ----------
  const addProduct = (p) => setProducts((ps) => [...ps, { ...p, id: Date.now() }])
  const updateProduct = (id, p) => setProducts((ps) => ps.map((x) => (x.id === id ? { ...x, ...p } : x)))
  const deleteProduct = (id) => setProducts((ps) => ps.filter((x) => x.id !== id))
  const setOrderStatus = (no, status) => {
    setSellerOrders((o) => o.map((x) => (x.no === no ? { ...x, status } : x)))
    setOrders((o) => o.map((x) => (x.no === no ? { ...x, status } : x)))
  }

  const value = {
    user, login, logout, products, cartItems, cartCount, cartTotal, addToCart, changeQty,
    removeFromCart, checkout, wishlist, toggleWishlist, moveToCart, orders, sellerOrders,
    addProduct, updateProduct, deleteProduct, setOrderStatus, dark, setDark, toast, setToast,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
