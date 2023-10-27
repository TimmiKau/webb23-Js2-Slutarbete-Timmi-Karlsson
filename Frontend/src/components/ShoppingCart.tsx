import { Button, Offcanvas, Stack } from 'react-bootstrap'
import { UseShoppingCart } from '../CartContext'
import CartItem from './CartItem'
import { useEffect, useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ShoppingCart = ({ isOpen, onClose }: Props) => {
  const { cartItems, placeOrder } = UseShoppingCart()

  const [items, setItems] = useState([])

  useEffect(() => {
    fetch('/api/items')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const total = cartItems.reduce((acc, cartItem) => {
    const item = items.find((i) => i.id === cartItem.id)
    const itemPrice = item ? item.price : 0
    return acc + itemPrice * cartItem.quantity
  }, 0)

  return (
    <Offcanvas show={isOpen} placement="end" onHide={onClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} items={items}></CartItem>
          ))}
        </Stack>

        <Stack>
          {' '}
          <div className="ms-auto fw-bold fs-5">Total:{total}</div>
          <div id="Order" className="ms-auto">
            <Button
              onClick={() => placeOrder()}
              className="ms-auto"
              style={{ width: '9rem', marginTop: '1rem' }}
            >
              Order
            </Button>
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default ShoppingCart
