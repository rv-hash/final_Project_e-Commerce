import { Badge, Button, Card } from 'react-bootstrap'
import { useStore } from '../store.jsx'
import { ph } from '../data'

export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist } = useStore()
  const saved = wishlist.includes(product.id)
  const out = product.stock <= 0

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={product.image} alt={product.name} className="card-img"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ph(product.name) }} />
      <Card.Body className="d-flex flex-column">
        <Badge bg="secondary" className="align-self-start mb-2">{product.category}</Badge>
        <Card.Title as="h3" className="h5">{product.name}</Card.Title>
        <Card.Text className="text-body-secondary">{product.desc}</Card.Text>
        <div className="price mt-auto">₱{product.price}</div>
        <div className="small text-body-secondary mb-2">{out ? 'Out of stock' : `${product.stock} in stock`}</div>
        <div className="d-flex gap-2">
          <Button className="flex-grow-1" disabled={out} onClick={() => addToCart(product.id)}>Add to Cart</Button>
          <Button variant={saved ? 'danger' : 'outline-secondary'} aria-pressed={saved}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            onClick={() => toggleWishlist(product.id)}>
            {saved ? '❤️' : '🤍'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
