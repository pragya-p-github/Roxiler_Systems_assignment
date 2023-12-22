import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css';

const TransactionTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/transactions/${selectedMonth}?search=${searchText}&page=${currentPage}`);
        setTransactions(response.data.transactions);
        setTotalPages(Math.ceil(response.data.totalRecords / rowsPerPage));
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, [selectedMonth, searchText, currentPage, rowsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); 
  };

  return (
    <div className='Table'>
      <h2>Transactions Table</h2>
      <div>
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => setSearchText('')}>Clear Search</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>
                <img src={transaction.image} alt={transaction.title} style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className='pagination'>
          <li className='page-item'>
            <a href='#' className='page-link' onClick={handlePreviousPage}>
              Prev
            </a>
          </li>
          {[...Array(totalPages).keys()].map((number) => (
            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <a href='#' className='page-link' onClick={() => setCurrentPage(number + 1)}>
                {number + 1}
              </a>
            </li>
          ))}
          <li className='page-item'>
            <a href='#' className='page-link' onClick={handleNextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TransactionTable;
