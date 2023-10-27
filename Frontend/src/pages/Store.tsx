import { Col, Row, Stack } from 'react-bootstrap'
import { StoreItem } from '../components/StoreItem'
import Search from '../components/SearchBar'
import { useState } from 'react'

const home = () => {
  const [items, setItems] = useState([])

  const updateItems = (newItems) => {
    setItems(newItems)
  }

  return (
    <>
      <h1>Store</h1>
      <Search updateItems={updateItems}></Search>
      <Row md={2} xs={1} lg={3} className="g-3">
        {items.map((item) => (
          <Col key={item.id}>
            <StoreItem {...item} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default home
