import { useState } from 'react'
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { useStore } from '../store.jsx'
import { CATEGORIES, ph } from '../data'
import ProductCard from '../components/ProductCard.jsx'

const STATUS_BG = { Delivered: 'success', 'Out for Delivery': 'primary', Preparing: 'warning' }
export const StatusBadge = ({ status }) => (
  <Badge bg={STATUS_BG[status] || 'secondary'} text={status === 'Preparing' ? 'dark' : undefined}>{status}</Badge>
)

const Grid = ({ children }) => <Row xs={1} sm={2} lg={3} className="g-4">{children}</Row>

export function Home({ go }) {
  const { user, products } = useStore()
  const featured = products.filter((p) => p.featured).slice(0, 3)
  const highlights = [
    ['🔥', 'Best Seller', 'Siomai Rice is our most ordered meal this week.'],
    ['🌿', 'Made Fresh', 'Cooked daily and packed hot.'],
    ['🚚', 'Fast Delivery', 'Meals delivered around campus.'],
  ]
  return (
    <>
      <h1>Welcome to KainKleek 👋</h1>
      <p className="subtitle">
        Hi {user.name.split(' ')[0]}! Order your favorite Filipino meals online — fast, easy, and always fresh.
      </p>

      <div className="promo-banner rounded-4 p-4 mb-4">
        <Badge bg="warning" text="dark" className="mb-2">Promo</Badge>
        <h2 className="h3">20% off your first order</h2>
        <p className="mb-3">Treat yourself to merienda today. Discount applied at checkout.</p>
        <Button variant="light" onClick={() => go('products')}>Order now</Button>
      </div>

      <h2 className="section-title">Featured Today</h2>
      <Grid>{featured.map((p) => <Col key={p.id}><ProductCard product={p} /></Col>)}</Grid>

      <h2 className="section-title">Product Highlights</h2>
      <Grid>
        {highlights.map(([icon, title, text]) => (
          <Col key={title}>
            <Card className="h-100 shadow-sm"><Card.Body>
              <div className="fs-2" aria-hidden="true">{icon}</div>
              <Card.Title as="h3" className="h5">{title}</Card.Title>
              <Card.Text className="text-body-secondary">{text}</Card.Text>
            </Card.Body></Card>
          </Col>
        ))}
      </Grid>
    </>
  )
}

export function Products() {
  const { products } = useStore()
  return (
    <>
      <h1>Products</h1>
      <p className="subtitle">Browse everything available for order right now.</p>
      <Grid>{products.map((p) => <Col key={p.id}><ProductCard product={p} /></Col>)}</Grid>
    </>
  )
}

export function Categories() {
  const { products } = useStore()
  const [selected, setSelected] = useState(null)
  const list = selected ? products.filter((p) => p.category === selected) : []
  return (
    <>
      <h1>Categories</h1>
      <p className="subtitle">Find what you're craving by category.</p>
      <Grid>
        {CATEGORIES.map((c) => (
          <Col key={c.name}>
            <Card className={`h-100 shadow-sm ${selected === c.name ? 'border-primary border-2' : ''}`}>
              <Card.Img variant="top" src={c.image} alt={c.name} className="card-img" />
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h3" className="h5">{c.name}</Card.Title>
                <Card.Text className="text-body-secondary">{c.desc}</Card.Text>
                <Button className="mt-auto" variant={selected === c.name ? 'secondary' : 'primary'}
                  onClick={() => setSelected(selected === c.name ? null : c.name)}>
                  {selected === c.name ? 'Hide items' : `View items (${products.filter((p) => p.category === c.name).length})`}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Grid>
      {selected && (
        <>
          <h2 className="section-title">{selected}</h2>
          {list.length ? <Grid>{list.map((p) => <Col key={p.id}><ProductCard product={p} /></Col>)}</Grid>
            : <p className="text-body-secondary">No items in this category yet.</p>}
        </>
      )}
    </>
  )
}

export function Cart({ go }) {
  const { cartItems, cartTotal, changeQty, removeFromCart, checkout } = useStore()
  if (!cartItems.length) {
    return (
      <>
        <h1>Cart</h1>
        <p className="subtitle">Your cart is empty. Add something tasty to get started.</p>
        <Button onClick={() => go('products')}>Browse products</Button>
      </>
    )
  }
  return (
    <>
      <h1>Cart</h1>
      <p className="subtitle">Review your order before checking out.</p>
      <Table responsive hover className="align-middle bg-body">
        <thead className="table-dark">
          <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Subtotal</th><th><span className="visually-hidden">Remove</span></th></tr>
        </thead>
        <tbody>
          {cartItems.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button size="sm" variant="outline-secondary" aria-label={`Decrease ${i.name}`} onClick={() => changeQty(i.id, -1)}>−</Button>
                  <span aria-live="polite">{i.qty}</span>
                  <Button size="sm" variant="outline-secondary" aria-label={`Increase ${i.name}`} onClick={() => changeQty(i.id, 1)}>+</Button>
                </div>
              </td>
              <td>₱{i.price}</td>
              <td className="fw-bold">₱{i.price * i.qty}</td>
              <td><Button size="sm" variant="outline-danger" onClick={() => removeFromCart(i.id)}>Remove</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="cart-total">Total: <strong>₱{cartTotal}</strong></p>
      <Button size="lg" onClick={() => checkout() && go('orders')}>Checkout</Button>
    </>
  )
}

export function Wishlist() {
  const { products, wishlist, toggleWishlist, moveToCart } = useStore()
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  return (
    <>
      <h1>Wishlist</h1>
      <p className="subtitle">{items.length ? "Items you've saved for later." : 'Nothing saved yet. Tap the heart on a product to save it.'}</p>
      <Grid>
        {items.map((p) => (
          <Col key={p.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={p.image} alt={p.name} className="card-img"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ph(p.name) }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h3" className="h5">{p.name}</Card.Title>
                <Card.Text className="text-body-secondary">{p.desc}</Card.Text>
                <div className="price mt-auto">₱{p.price}</div>
                <div className="d-flex gap-2">
                  <Button className="flex-grow-1" onClick={() => moveToCart(p.id)}>Move to Cart</Button>
                  <Button variant="outline-danger" onClick={() => toggleWishlist(p.id)}>Remove</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Grid>
    </>
  )
}

export function Orders() {
  const { orders } = useStore()
  return (
    <>
      <h1>My Orders</h1>
      <p className="subtitle">Track your past and current orders.</p>
      <Table responsive hover className="align-middle bg-body">
        <thead className="table-dark"><tr><th>Order No.</th><th>Date</th><th>Items</th><th>Status</th><th>Total</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.no}>
              <td>{o.no}</td><td>{o.date}</td><td>{o.items}</td>
              <td><StatusBadge status={o.status} /></td><td className="fw-bold">₱{o.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export function Profile() {
  const { user } = useStore()
  const info = [['Name', user.name], ['Email', user.email], ['Contact Number', user.phone],
    ['Course', user.course], ['Year Level', user.year]]
  return (
    <>
      <h1>Profile</h1>
      <p className="subtitle">Your account information.</p>
      <img src="https://placehold.co/120x120/1e293b/ffffff?text=JD" alt="Profile" className="profile-img" />
      <Row xs={1} md={2} className="g-3">
        {info.map(([label, value]) => (
          <Col key={label}><div className="info-item"><span className="label">{label}</span>{value}</div></Col>
        ))}
      </Row>
    </>
  )
}

export function Settings() {
  const { dark, setDark } = useStore()
  const row = (label, checked = false) => (
    <div className="setting-row" key={label}>
      <span>{label}</span>
      <Form.Check type="switch" id={label} defaultChecked={checked} aria-label={label} />
    </div>
  )
  return (
    <>
      <h1>Settings</h1>
      <p className="subtitle">Manage your account, privacy, and notification preferences.</p>
      <h2 className="section-title">Account Settings</h2>
      {row('Two-factor authentication', true)}{row('Save payment details')}
      <h2 className="section-title">Privacy Settings</h2>
      {row('Public profile', true)}{row('Share order history')}
      <h2 className="section-title">Notification Settings</h2>
      {row('Order status updates', true)}{row('Promos and new items', true)}
      <h2 className="section-title">Theme</h2>
      <div className="setting-row">
        <span>Dark mode</span>
        <Form.Check type="switch" id="darkMode" checked={dark} onChange={(e) => setDark(e.target.checked)} aria-label="Dark mode" />
      </div>
    </>
  )
}
