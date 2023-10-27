import { useState, useEffect } from 'react'

function SearchFunction({ updateItems }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('normal')

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  useEffect(() => {
    fetch('/api/items')
      .then((response) => response.json())
      .then((data) => {
        
        const sortedData = sortProducts(data, sortOption)
        updateItems(sortedData)
      })
      .catch((error) => {
        console.error('Error fetching all items:', error)
      })
  }, [sortOption])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      fetch('/api/items')
        .then((response) => response.json())
        .then((data) => {
          
          const sortedData = sortProducts(data, sortOption)
          updateItems(sortedData)
        })
        .catch((error) => {
          console.error('Error fetching all items:', error)
        })
    } else {
      fetch(`/api/items?search=${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          const sortedData = sortProducts(data, sortOption)
          updateItems(sortedData)
        })
        .catch((error) => {
          console.error('Error fetching filtered items:', error)
        })
    }
  }, [searchQuery, sortOption])

 
  const sortProducts = (data, option) => {
    const sortedData = [...data]
    if (option === 'cheapest') {
      sortedData.sort((a, b) => a.price - b.price)
    } else if (option === 'expensive') {
      sortedData.sort((a, b) => b.price - a.price)
    }
    return sortedData
  }

  return (
    <>
      <div className="d-flex">
        {' '}
        <div className="input-group mb-3" style={{ marginRight: '15px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            aria-label="Search..."
            aria-describedby="button-addon2"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </div>
        <div
          className="d-flex justify-content-center align-items-center  mb-3"
          style={{ width: '350px' }}
        >
          <label htmlFor="sort">Sort:</label>
          <select
            className="form-select"
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="normal">Recommended</option>
            <option value="cheapest">Cheap to Expensive</option>
            <option value="expensive">Expensive to Cheap</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default SearchFunction
