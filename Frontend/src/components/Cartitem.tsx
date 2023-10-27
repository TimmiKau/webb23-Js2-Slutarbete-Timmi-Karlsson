import { Button, Stack } from 'react-bootstrap'
import { UseShoppingCart } from '../CartContext'

const CartItem = ({ item, items }) => {
  const { id, quantity } = item
  const product = items.find((product) => product.id === id)
  const { removeFromCart, increaseCartQuantity, decreaseCartQuantity } =
    UseShoppingCart()

  return (
    <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
      <img
        src={product?.imgUrl}
        style={{ width: '125px', height: '75px', objectFit: 'cover' }}
      />
      <div className="me-auto">
        {product?.name}{' '}
        <div className="text-muted" style={{ fontSize: '.75rem' }}>
          {product?.price}
        </div>
      </div>{' '}
      <Button
        variant="btn btn-light"
        size="sm"
        onClick={() => decreaseCartQuantity(item.id)}
      >
        -
      </Button>
      <span className="text-muted" style={{ fontSize: '1rem' }}>
        x{quantity}
      </span>
      <Button
        variant="btn btn-light"
        size="sm"
        onClick={() => increaseCartQuantity(item.id)}
      >
        +
      </Button>
      <div className="text-muted" style={{ fontSize: '.75rem' }}>
        {product.price * quantity}
      </div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => removeFromCart(item.id)}
      >
        X
      </Button>
    </Stack>
  )
}

export default CartItem
