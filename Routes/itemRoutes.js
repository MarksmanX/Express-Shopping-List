const express = require('express');
const router = new express.Router();
const ITEMS = require('../fakeDb');

router.get('/', (req, res) => {
    return res.json({items: ITEMS});
})

router.get('/:name', (req, res) => {
    const item = ITEMS.find(item => item.name === req.params.name)
    if (item) {
        res.json({item});
    } else {
        res.status(404).json({ error: "Item not found" });
    }
});

router.post('/', (req, res) => {
    const { name, price } = req.body;

    // Validate input
    if (!name || price === undefined) {
        return res.status(400).json({ error: "Name and price are required" });
    }

    // Add item to shopping list
    const newItem = { name, price };
    ITEMS.push(newItem);

    // Respond with the added item
    return res.status(201).json({ added: newItem });
});

router.patch('/:name', (req, res) => {
    const {name, price} = req.body;
    const itemName = req.params.name;

    const item = ITEMS.find(item => item.name === itemName);

    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    } 

     // Update the item's properties if provided
     if (name) item.name = name;
     if (price !== undefined) item.price = price;
 
     // Respond with the updated item
     return res.json({ updated: item });
});

router.delete('/:name', (req, res) => {
    const itemName = req.params.name;
    const itemIndex = ITEMS.findIndex(item => item.name === itemName);

    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }

    // Remove the item from the array
    ITEMS.splice(itemIndex, 1);

    // Respond with a success message
    return res.json({ message: `Deleted ${itemName}` });
});

module.exports = router;