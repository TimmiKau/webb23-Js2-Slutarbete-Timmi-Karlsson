import { useEffect, useState } from 'react'

function TalkToServer() {
  const [data, setData] = useState()

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData)
      })
  }, [])

  return (
    <div>
      <h1>React Frontend</h1>
      {data && <p>Response from server: {data.message}</p>}
    </div>
  )
}

export default TalkToServer
