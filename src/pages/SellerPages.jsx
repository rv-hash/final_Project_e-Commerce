import { useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { useStore } from '../store.jsx'
import { STATUSES } from '../data'
import ProductForm from '../components/ProductForm.jsx'
import { Settings } from './CustomerPages.jsx'

export { Settings }

export function Dashboard() {
  const { user, products, sellerOrders } = useStore()
  const sales = sellerOrders.reduce((n, o) => n + o.total, 0)
  const delivered = sellerOrders.filter((o) => o.status === 'Delivered').length
  const lowStock = products.filter((p) => p.stock <= 10).length
  const stats = [['Total Products', products.length], ['Total Orders', sellerOrders.length],
    ['Total Sales', `₱${sales}`], ['Low Stock Items', lowStock]]
  return (
    <>
      <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
      <p className="subtitle">Here's how {user.store} is doing today.</p>
      <Row xs={1} sm={2} xl={4} className="g-4">
        {stats.map(([label, value]) => (
          <Col key={label}>
            <Card className="h-100 shadow-sm"><Card.Body>
              <div className="text-body-secondary">{label}</div>
              <div className="display-6 fw-bold">{value}</div>
            </Card.Body></Card>
          </Col>
        ))}
      </Row>
      <h2 className="section-title">Sales Summary</h2>
      <Table responsive className="align-middle bg-body">
        <thead className="table-dark"><tr><th>Status</th><th>Orders</th><th>Amount</th></tr></thead>
        <tbody>
          {STATUSES.map((s) => {
            const list = sellerOrders.filter((o) => o.status === s)
            return <tr key={s}><td>{s}</td><td>{list.length}</td><td>₱{list.reduce((n, o) => n + o.total, 0)}</td></tr>
          })}
          <tr className="fw-bold"><td>Total</td><td>{sellerOrders.length}</td><td>₱{sales}</td></tr>
        </tbody>
      </Table>
      <p className="text-body-secondary small">{delivered} of {sellerOrders.length} orders delivered.</p>
    </>
  )
}

export function ManageProducts() {
  const { products, addProduct, updateProduct, deleteProduct, setToast } = useStore()
  const [modal, setModal] = useState(null) // { mode: 'add' | 'edit', product }
  const close = () => setModal(null)

  const save = (data) => {
    if (modal.mode === 'add') { addProduct(data); setToast('Product added!') }
    else { updateProduct(modal.product.id, data); setToast('Product updated!') }
    close()
  }
  const remove = (p) => {
    if (window.confirm(`Delete "${p.name}"?`)) { deleteProduct(p.id); setToast('Product deleted.') }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
        <div><h1>Manage Products</h1><p className="subtitle">Add, edit, or remove items in your store.</p></div>
        <Button onClick={() => setModal({ mode: 'add' })}>+ Add Product</Button>
      </div>
      <Table responsive hover className="align-middle bg-body">
        <thead className="table-dark"><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td><td>{p.category}</td><td>₱{p.price}</td><td>{p.stock}</td>
              <td className="text-nowrap">
                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => setModal({ mode: 'edit', product: p })}>Edit</Button>
                <Button size="sm" variant="outline-danger" onClick={() => remove(p)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!products.length && <p className="text-body-secondary">No products yet. Click "Add Product" to create one.</p>}

      <Modal show={!!modal} onHide={close} centered>
        <Modal.Header closeButton><Modal.Title>{modal?.mode === 'edit' ? 'Edit Product' : 'Add Product'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {modal && <ProductForm initial={modal.product} submitLabel={modal.mode === 'edit' ? 'Save changes' : 'Add product'} onSubmit={save} />}
        </Modal.Body>
      </Modal>
    </>
  )
}

export function AddProduct() {
  const { addProduct, setToast } = useStore()
  return (
    <>
      <h1>Add Product</h1>
      <p className="subtitle">Fill in the details to put a new item in your store.</p>
      <Card className="shadow-sm" style={{ maxWidth: 600 }}><Card.Body>
        <ProductForm submitLabel="Add product" onSubmit={(d) => { addProduct(d); setToast('Product added!') }} />
      </Card.Body></Card>
    </>
  )
}

export function SellerOrders() {
  const { sellerOrders, setOrderStatus } = useStore()
  return (
    <>
      <h1>Orders</h1>
      <p className="subtitle">Customer orders. Update the status as you prepare and deliver them.</p>
      <Table responsive hover className="align-middle bg-body">
        <thead className="table-dark"><tr><th>Order No.</th><th>Customer</th><th>Product Ordered</th><th>Status</th><th>Total</th></tr></thead>
        <tbody>
          {sellerOrders.map((o) => (
            <tr key={o.no}>
              <td>{o.no}</td><td>{o.customer}</td><td>{o.product}</td>
              <td style={{ minWidth: 170 }}>
                <Form.Select size="sm" aria-label={`Status of ${o.no}`} value={o.status} onChange={(e) => setOrderStatus(o.no, e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </Form.Select>
              </td>
              <td className="fw-bold">₱{o.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export function SellerProfile() {
  const { user } = useStore()
  const info = [['Seller Name', user.name], ['Store Name', user.store], ['Email', user.email], ['Contact Information', user.phone]]
  return (
    <>
      <h1>Seller Profile</h1>
      <p className="subtitle">Your store information.</p>
      <img src="https://placehold.co/120x120/1e293b/ffffff?text=MS" alt="Seller" className="profile-img" />
      <Row xs={1} md={2} className="g-3">
        {info.map(([label, value]) => (
          <Col key={label}><div className="info-item"><span className="label">{label}</span>{value}</div></Col>
        ))}
      </Row>
    </>
  )
}
