const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

const itemsFilePath = path.join(__dirname, 'data','items.json')
const ordersFilePath = path.join(__dirname, 'data','orders.json')

// Define your API endpoints
app.get('/api/data', (req, res) => {
  // Return some data from the server
  res.json({ message: 'Helloss from the server!' })
})

app.get('/api/items', (req, res) => {
  const searchQuery = req.query.search;

  // Read and parse the JSON data
  fs.readFile(itemsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading the JSON file' });
    } else {
      let items = JSON.parse(data);

      // Filter the items based on the search query
      if (searchQuery) {
        items = items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Send the filtered data as a JSON response
      res.json(items);
    }
  });
});



app.post('/api/order', (req, res) => {

  let requestData = req.body;

  // Read and update item data
  fs.readFile(itemsFilePath, 'utf8', (itemReadErr, itemData) => {
    if (itemReadErr) {
      console.error('Error reading item data:', itemReadErr);
      res.status(500).send('Error updating item stock');
    } else {
      let items = JSON.parse(itemData);

      // Update item stock based on the order
      requestData.cartItems.forEach(orderItem => {
        const itemId = orderItem.id;
        const orderQuantity = orderItem.quantity;
        
        // Find the item in the items array by its ID
        const itemToUpdate = items.find(item => item.id === itemId);

        if (itemToUpdate) {
          // Check if there's enough stock to fulfill the order
          if (itemToUpdate.stock >= orderQuantity) {
            itemToUpdate.stock -= orderQuantity;
          } else {
            console.log('cancel order')
          }
        }
      });

      // Write the updated item data back to the file
      fs.writeFile(itemsFilePath, JSON.stringify(items, null, 2), (itemWriteErr) => {
        if (itemWriteErr) {
          console.error('Error writing item data:', itemWriteErr);
          res.status(500).send('Error updating item stock');
        } else {
          console.log('Item data updated successfully');
        }
      });

      // Update orders data
      fs.readFile(ordersFilePath, 'utf8', (orderReadErr, orderData) => {
        if (orderReadErr) {
          console.error('Error reading order data:', orderReadErr);
          res.status(500).send('Error updating item stock');
        } else {
          let orders = JSON.parse(orderData);
          orders.push(requestData);

          // Write the updated orders data back to the file
          fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (orderWriteErr) => {
            if (orderWriteErr) {
              console.error('Error writing order data:', orderWriteErr);
              res.status(500).send('Error updating item stock');
            } else {
              console.log('Order data updated successfully');
              res.send('Order received successfully');
            }
          });
        }
      });
    }
  });
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});