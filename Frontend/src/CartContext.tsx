import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

type ShoppingCartProviderProps = {
  children: ReactNode
}

type CartItem = {
  id: number
  quantity: number
}

type ShoppingCartContext = {
  getItemQuantity: (id: number) => number
  increaseCartQuantity: (id: number) => void
  decreaseCartQuantity: (id: number) => void
  removeFromCart: (id: number) => void
  checkStock: (id: number) => void
  placeOrder: () => void
  clearCart: () => void
  cartItems: CartItem[]
  cartQuantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function UseShoppingCart() {
  return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/items')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0
  }

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  )

  function checkStock(id: number) {
    const product = items.find((item) => item.id === id)
    if (product) {
      return product.stock
    }
    return 0
  }

  function increaseCartQuantity(id: number) {
    const quantity = getItemQuantity(id)
    const stock = checkStock(id)

    if (quantity < stock) {
      if (quantity === 0) {
        setCartItems([...cartItems, { id: id, quantity: 1 }])
      } else {
        setCartItems(
          cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        )
      }
    } else {
      console.log('Out of stock!')
    }
  }

  function removeFromCart(id: number) {
    setCartItems((cartItems) =>
      cartItems.filter((currentItem) => {
        return currentItem.id != id
      })
    )
  }

  function decreaseCartQuantity(id: number) {
    const quantity = getItemQuantity(id)

    if (quantity === 1) {
      removeFromCart(id)
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      )
    }
  }

  function clearCart() {
    setCartItems([])
  }

  function placeOrder() {
    const itemsOutOfStock = cartItems.filter((item) => {
      const stock = checkStock(item.id)
      return item.quantity > stock
    })

    if (itemsOutOfStock.length === 0) {
      fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      })
        .then((response) => {
          if (response.ok) {
            
            console.log('Order placed successfully')
            clearCart()
            navigate('/order')
          } else {
            console.error('Error placing the order')
          }
        })
        .catch((error) => {
          console.error('Error placing the order:', error)
        })
    } else {
      
      console.log('Some items are out of stock')
    }
  }


  
  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        checkStock,
        placeOrder,
        clearCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  )
}
