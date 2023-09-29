import mongoose from 'mongoose';

const connection = mongoose.connection; // Use the default connection from Mongoose

async function connect() {
  if (connection.readyState === 1) {
    // Already connected
    console.log('Already connected.');
    return;
  }

  if (connection.readyState === 2 || connection.readyState === 3) {
    // Connecting or disconnecting, wait for completion
    await new Promise((resolve) => connection.once('open', resolve));
  } else {
    // No previous connection, establish a new one
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  console.log('Connected to the database');
}

async function disconnect() {
  if (connection.readyState === 0) {
    // No active connection
    console.log('No active connection to disconnect.');
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    await mongoose.disconnect();
    console.log('Disconnected from the database');
  } else {
    console.log('Not disconnected.');
  }
}

const db = { connect, disconnect };
export default db;
