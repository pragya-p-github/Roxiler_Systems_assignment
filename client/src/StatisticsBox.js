import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css';

const StatisticsBox = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/statistics/${selectedMonth}`);
        setStatistics(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div className='Box'>
      <h2>Statistics</h2>
      <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default StatisticsBox;
