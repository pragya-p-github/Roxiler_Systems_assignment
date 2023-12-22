import React, { useState } from 'react';
import './App.css';
import TransactionTable from './TransactionTable';
import StatisticsBox from './StatisticsBox';
import BarChart from './BarChart';
import PieChart from './PieChart';

function App() {
  const [selectedMonth, setSelectedMonth] = useState('03'); // Default to March

  const monthsMapping = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Transaction Dashboard</h1>

        {/* Month Dropdown */}
        <label>Select Month: </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthsMapping.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        {/* Display components */}
        <TransactionTable selectedMonth={selectedMonth} />
        <StatisticsBox selectedMonth={selectedMonth} />
        <BarChart selectedMonth={selectedMonth} />
        <PieChart selectedMonth={selectedMonth} />
      </header>
    </div>
  );
}

export default App;
