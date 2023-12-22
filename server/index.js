const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { connectToMongoDB } = require('./connect');
const { Transaction } = require('./model');
const cors = require('cors');

const app = express();
const PORT = 3001;


connectToMongoDB("mongodb://0.0.0.0:27017/Data_base");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/api/initialize-database', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactionsData = response.data;
        await Transaction.deleteMany({});
        const transactions = await Transaction.create(transactionsData);

        res.json({ message: 'Database initialized successfully', transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.get('/api/transactions/:month', async (req, res) => {
    const { month } = req.params;
    const { search, page = 1, perPage = 4 } = req.query;

    try {
        const query = {
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, parseInt(month)],
            },
        };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $regex: search, $options: 'i' } },
            ];
        }

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalRecords = await Transaction.countDocuments(query);

        res.json({ transactions, totalRecords });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




app.get('/api/statistics/:month', async (req, res) => {
    const { month } = req.params;
    try {
        const query = {
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, parseInt(month)],
            },
        };

        console.log('Query:', query);

        const totalSaleAmount = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, totalSaleAmount: { $sum: '$price' } } },
        ]);

        console.log('Total Sale Amount:', totalSaleAmount);

        const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });
        const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });

        console.log('Total Sold Items:', totalSoldItems);
        console.log('Total Not Sold Items:', totalNotSoldItems);

        res.json({
            totalSaleAmount: totalSaleAmount[0]?.totalSaleAmount || 0,
            totalSoldItems,
            totalNotSoldItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/bar-chart/:month', async (req, res) => {
    const { month } = req.params;

    try {
        const query = {
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, parseInt(month)],
            },
        };

        const barChartData = await Transaction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lte: ['$price', 100] }, then: '0 - 100' },
                                { case: { $lte: ['$price', 200] }, then: '101 - 200' },
                                { case: { $lte: ['$price', 300] }, then: '201 - 300' },
                                { case: { $lte: ['$price', 400] }, then: '301 - 400' },
                                { case: { $lte: ['$price', 500] }, then: '401 - 500' },
                                { case: { $lte: ['$price', 600] }, then: '501 - 600' },
                                { case: { $lte: ['$price', 700] }, then: '601 - 700' },
                                { case: { $lte: ['$price', 800] }, then: '701 - 800' },
                                { case: { $lte: ['$price', 900] }, then: '801 - 900' },
                                { case: { $gte: ['$price', 901] }, then: '901-above' },
                            ],
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $project: { _id: 0, priceRange: '$_id', count: 1 } },
            { $sort: { priceRange: 1 } },
        ]);

        res.json(barChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/pie-chart/:month', async (req, res) => {
    const { month } = req.params;

    try {
        const query = {
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, parseInt(month)],
            },
        };

        const pieChartData = await Transaction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
            { $project: { category: '$_id', count: 1, _id: 0 } },
        ]);

        res.json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/combined-data/:month', async (req, res) => {
    try {
        const month = req.params.month;

        const transactionsResponse = await axios.get(`http://localhost:3001/api/transactions/${month}`);
        const barChartResponse = await axios.get(`http://localhost:3001/api/bar-chart/${month}`);
        const pieChartResponse = await axios.get(`http://localhost:3001/api/pie-chart/${month}`);

        const combinedData = {
            transactions: transactionsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data,
        };

        res.json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
