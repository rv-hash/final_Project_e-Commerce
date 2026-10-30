import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { useStore } from '../store.jsx'

export default function Login() {
  const { login } = useStore()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!id.trim()) return setError('Please enter your username or email.')
    if (!pw) return setError('Please enter your password.')
    if (pw.length < 6) return setError('Password must be at least 6 characters.')
    if (!login(id, pw)) setError('Invalid email/username or password.')
  }
  const fill = (email, password) => { setId(email); setPw(password); setError('') }

  return (
    <div className="login-wrap">
      <Card className="login-card shadow">
        <Card.Body className="p-4">
          <h1 className="h3 text-center mb-1">KainKleek 🍽️</h1>
          <p className="text-center text-body-secondary mb-4">Log in to order or manage your store.</p>

          <Form onSubmit={submit} noValidate>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username or Email</Form.Label>
              <Form.Control type="text" placeholder="Enter username or email" value={id}
                onChange={(e) => setId(e.target.value)} autoComplete="username" />
            </Form.Group>
            <Form.Group className="mb-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type={show ? 'text' : 'password'} placeholder="Enter password" value={pw}
                onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
            </Form.Group>
            <Form.Check className="mb-3" id="showPassword" label="Show Password"
              checked={show} onChange={(e) => setShow(e.target.checked)} />

            {error && <Alert variant="danger" role="alert" className="py-2">{error}</Alert>}

            <Button type="submit" className="w-100">Login</Button>
          </Form>

          <hr />
          <p className="small text-body-secondary mb-2">Demo accounts (click to fill in):</p>
          <div className="d-flex flex-wrap gap-2">
            <Button size="sm" variant="outline-secondary" onClick={() => fill('user@example.com', 'user123')}>
              Customer
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={() => fill('seller@example.com', 'seller123')}>
              Seller
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
