const express = require('express');

const { MongoClient } = require("mongodb");
const cors = require('cors');

const uri = "mongodb+srv://sijinwu:19G8s1WGL7zA9Fs5@cluster0.jmnd1xv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });

database = client.db('Test');

const app = express();
const { ObjectId } = require('mongodb');
app.use(express.json());
app.use(cors());

const profileConnection = database.collection('testC');
const tradeConnection = database.collection('trade');
const balanceConnection = database.collection('balance');

app.get('/test', async (req, res) => {
  try {
    res.json('{"1":"2"}');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/getItems', async (req, res) => {
  try {
    let allItems = [];

    const items = await profileConnection.find();

    if (!items) {
      return res.status(404).json({ status:404, message: 'Items not found' });
    }

    for await (const doc of items) {
      allItems.push(doc);
    }

    res.json(allItems);
  } catch (error) {
    console.log("500 error Message:" + error.message)
    res.status(500).json({ message: error.message });
  }
});


app.get('/getItem/:ticker', async (req, res) => {
  try {

    const query = { ticker:  req.params.ticker };
    const item = await profileConnection.findOne(query);

    if (!item) {
      return res.status(404).json({ status:404, message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/updateItem', async (req, res) => {
  try {
    const filter = { ticker: req.body.ticker };
    const result = await profileConnection.updateOne(filter, {$set: req.body },
      {upsert: true});

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


app.post('/deleteItem', async (req, res) => {
  try {
    const filter = { ticker: req.body.ticker };
    const result = await profileConnection.findOneAndDelete(filter, { $deleteOne: req.body });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});



app.get('/getTradeItems', async (req, res) => {
  try {
    let allItems = [];

    const items = await tradeConnection.find();

    if (!items) {
      return res.status(404).json({ status:404, message: 'Items not found' });
    }

    for await (const doc of items) {
      allItems.push(doc);
    }

    res.json(allItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/getTradeItem/:ticker', async (req, res) => {
  try {

    const query = { ticker:  req.params.ticker };
    const item = await tradeConnection.findOne(query);

    if (!item) {
      return res.status(404).json({ status:404, message: 'Trade item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/updateTradeItem', async (req, res) => {
  try {
    const filter = { ticker: req.body.ticker };
    const result = await tradeConnection.updateOne(filter, {$set: req.body },
      {upsert: true});

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


app.post('/deleteTradeItem', async (req, res) => {
  try {
    const filter = { ticker: req.body.ticker };
    const result = await tradeConnection.findOneAndDelete(filter, { $deleteOne: req.body });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/getBalance', async (req, res) => {
  try {

    const query = { keyName:  "balance" };
    const item = await balanceConnection.findOne(query);

    if (!item) {
      return res.status(404).json({ status:404, message: 'Balance not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/updateBalance', async (req, res) => {
  try {
    const filter = { keyName:  "balance" };
    const result = await balanceConnection.updateOne(filter, {$set: req.body },
      {upsert: true});

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
