import { useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { CATEGORIES, ph } from '../data'

const EMPTY = { name: '', price: '', category: CATEGORIES[0].name, stock: '', desc: '', image: '' }

// Used by both "Add Product" and the Edit modal.
export default function ProductForm({ initial, submitLabel, onSubmit }) {
  const [f, setF] = useState(initial ? { ...initial } : EMPTY)
  const [error, setError] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim()) return setError('Product name is required.')
    if (f.price === '' || Number(f.price) <= 0) return setError('Enter a price greater than 0.')
    if (f.stock === '' || Number(f.stock) < 0) return setError('Enter a stock quantity of 0 or more.')
    setError('')
    onSubmit({
      ...f, name: f.name.trim(), price: Number(f.price), stock: Number(f.stock),
      desc: f.desc.trim() || 'No description yet.', image: f.image.trim() || ph(f.name.trim()),
    })
    if (!initial) setF(EMPTY)
  }

  return (
    <Form onSubmit={submit} noValidate>
      {error && <Alert variant="danger" className="py-2">{error}</Alert>}
      <Row className="g-3">
        <Col xs={12}>
          <Form.Group controlId="pName">
            <Form.Label>Product name</Form.Label>
            <Form.Control value={f.name} onChange={set('name')} placeholder="e.g. Lumpia Shanghai" />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group controlId="pPrice">
            <Form.Label>Price (₱)</Form.Label>
            <Form.Control type="number" min="1" value={f.price} onChange={set('price')} />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group controlId="pStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control type="number" min="0" value={f.stock} onChange={set('stock')} />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="pCat">
            <Form.Label>Category</Form.Label>
            <Form.Select value={f.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="pDesc">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control as="textarea" rows={2} value={f.desc} onChange={set('desc')} />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="pImg">
            <Form.Label>Image link (optional)</Form.Label>
            <Form.Control value={f.image} onChange={set('image')} placeholder="https://..." />
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit" className="mt-3">{submitLabel}</Button>
    </Form>
  )
}
