const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/your-database-name';

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});


const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Transaction };
