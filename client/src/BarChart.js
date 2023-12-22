import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './barChart.css';

const BarChart = ({ selectedMonth }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBarChartData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/bar-chart/${selectedMonth}`);
                if (response.data) {
                    setChartData(response.data || []); // Assuming the response is an array directly
                } else {
                    console.error("Invalid data received from the server");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBarChartData();
    }, [selectedMonth]);

    const labels = chartData.map((data) => {
        if (data.priceRange === '901-above') {
            return '901 - above';
        } else {
            const [min, max] = data.priceRange.split(' - ');
            return `${min} - ${max || 'above'}`;
        }
    });

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Number of Items',
                data: chartData.map((data) => data.count),
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Price Range',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Items',
                },
                beginAtZero: true,
                stepSize: 1, 
            },
        },
    };


    return (
        <div className='Bar-chart'>
            <h2>Bar Chart</h2>
            {loading ? (
                <p>Loading...</p>
            ) : chartData && chartData.length ? (
                <Bar data={data} options={options} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default BarChart;
