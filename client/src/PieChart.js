import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { ArcElement } from 'chart.js';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import './pieChart.css';

Chart.register(ArcElement);



const PieChart = ({ selectedMonth }) => {
    const [pieChartData, setPieChartData] = useState([]);

    useEffect(() => {
        const fetchPieChartData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/pie-chart/${selectedMonth}`);
                console.log(response.data); // Log the API response to the console

                // Check if the response is an array of objects
                if (Array.isArray(response.data)) {
                    setPieChartData(response.data);
                } else {
                    console.error("Invalid data format received from the server");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPieChartData();
    }, [selectedMonth]);


    const data = {
        labels: pieChartData.map((data) => data.category),
        datasets: [
            {
                axis: 'y',
                label: 'My First Dataset',
                data: pieChartData.map((data) => data.count),
                fill: false,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B', '#795548', '#8BC34A', '#FF5722'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B', '#795548', '#8BC34A', '#FF5722'],
            },
        ],
    };

    return (
        <div className="pie-chart-container">
            <h2>Pie Chart</h2>
            <div className="custom-pie-chart">
                <Pie data={data} />
            </div>
        </div>
    );
};

export default PieChart;
