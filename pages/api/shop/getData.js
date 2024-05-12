//! TODO: You will eventually port over to conext or a redux solution to manage all the data in the app - maintain this file to allow for that.

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return;
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const events = db.collection('events');
    const products = db.collection('products');
    const tickets = db.collection('tickets');
    const users = db.collection('userDetails');
    const eventsData = await events.find().toArray();
    const productsData = await products.find().toArray();
    const ticketsData = await tickets.find().toArray();
    const usersData = await users.find().toArray();

    const data = {
      events: eventsData,
      products: productsData,
      tickets: ticketsData,
      users: usersData,
    };

    if (!eventsData || !productsData || !ticketsData || !usersData) {
      console.log('No data found for at least one collection');
      res.status(500).json({ message: `Internal server error` });
    }
    res.status(200).json(data);
  } catch (error) {
    //TODO: Think about how to handle this
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}

export default handler;
