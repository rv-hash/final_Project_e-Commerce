import { useState } from 'react'
import { Button, Modal, Toast, ToastContainer } from 'react-bootstrap'
import { useStore } from './store.jsx'
import Login from './components/Login.jsx'
import Sidebar from './components/Sidebar.jsx'
import * as C from './pages/CustomerPages.jsx'
import * as S from './pages/SellerPages.jsx'

const CUSTOMER_MENU = [
  { title: '📍 Main Navigation', items: [['home', '🏠 Home'], ['products', '🍽️ Products'], ['categories', '📂 Categories']] },
  { title: '🛍️ Shopping', items: [['cart', '🛒 Cart'], ['orders', '📦 My Orders'], ['wishlist', '❤️ Wishlist']] },
  { title: '👤 Account', items: [['profile', '👤 Profile'], ['settings', '⚙️ Settings']] },
  { title: '💻 System', items: [['logout', '🚪 Logout']] },
]
const SELLER_MENU = [
  { title: '📍 Main Navigation', items: [['dashboard', '📊 Dashboard'], ['manage', '🧺 Manage Products'], ['add', '➕ Add Product']] },
  { title: '🛍️ Sales', items: [['orders', '📦 Orders']] },
  { title: '👤 Account', items: [['profile', '👤 Seller Profile'], ['settings', '⚙️ Settings']] },
  { title: '💻 System', items: [['logout', '🚪 Logout']] },
]
const PAGES = {
  customer: { home: C.Home, products: C.Products, categories: C.Categories, cart: C.Cart,
    orders: C.Orders, wishlist: C.Wishlist, profile: C.Profile, settings: C.Settings },
  seller: { dashboard: S.Dashboard, manage: S.ManageProducts, add: S.AddProduct,
    orders: S.SellerOrders, profile: S.SellerProfile, settings: S.Settings },
}

function Shell() {
  const { user, logout, cartCount, toast, setToast } = useStore()
  const isSeller = user.role === 'seller'
  const [page, setPage] = useState(isSeller ? 'dashboard' : 'home')
  const [open, setOpen] = useState(window.innerWidth > 768)
  const [confirmLogout, setConfirmLogout] = useState(false)

  const go = (key) => {
    if (key === 'logout') return setConfirmLogout(true)
    setPage(key)
    if (window.innerWidth <= 768) setOpen(false)
    window.scrollTo(0, 0)
  }
  const Page = PAGES[user.role][page]

  return (
    <div>
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}
      <Sidebar open={open} menu={isSeller ? SELLER_MENU : CUSTOMER_MENU} page={page}
        onNavigate={go} user={user} badges={{ cart: cartCount }} />
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="sidebar">
        ☰ Menu
      </button>
      <main className="main-content"><Page go={go} /></main>

      <Modal show={confirmLogout} onHide={() => setConfirmLogout(false)} centered>
        <Modal.Header closeButton><Modal.Title>Log out</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmLogout(false)}>Stay logged in</Button>
          <Button variant="danger" onClick={logout}>Log Out</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3 toast-top">
        <Toast show={!!toast} onClose={() => setToast('')} delay={2500} autohide bg="dark">
          <Toast.Body className="text-white">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

export default function App() {
  const { user } = useStore()
  // key resets page state when switching accounts
  return user ? <Shell key={user.email} /> : <Login />
}
