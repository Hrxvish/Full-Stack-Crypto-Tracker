import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'descending' });

  const fetchCoins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/coins');
      setCoins(res.data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 1800000); // Refresh every 30 mins
    return () => clearInterval(interval);
  }, []);

  const sortedCoins = React.useMemo(() => {
    let sortableCoins = [...coins];

    if (filter === 'positive') {
      sortableCoins = sortableCoins.filter(c => c.change24h >= 0);
    } else if (filter === 'negative') {
      sortableCoins = sortableCoins.filter(c => c.change24h < 0);
    }

    if (search) {
      sortableCoins = sortableCoins.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      sortableCoins.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableCoins;
  }, [coins, sortConfig, search, filter]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 Crypto Tracker Dashboard</h1>
        <p>Top 10 Cryptocurrencies Live</p>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select onChange={e => setFilter(e.target.value)} value={filter}>
          <option value="all">All</option>
          <option value="positive">Positive Change</option>
          <option value="negative">Negative Change</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('name')}>Name</th>
              <th onClick={() => requestSort('symbol')}>Symbol</th>
              <th onClick={() => requestSort('price')}>Price (USD)</th>
              <th onClick={() => requestSort('marketCap')}>Market Cap</th>
              <th onClick={() => requestSort('change24h')}>24h % Change</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map(coin => (
              <tr key={coin.coinId}>
                <td>{coin.name}</td>
                <td>{coin.symbol.toUpperCase()}</td>
                <td>${coin.price.toLocaleString()}</td>
                <td>${coin.marketCap.toLocaleString()}</td>
                <td className={coin.change24h >= 0 ? 'positive' : 'negative'}>
                  {coin.change24h.toFixed(2)}%
                </td>
                <td>{new Date(coin.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Crypto Tracker | Designed by Vishal Yadav</p>
      </footer>
    </div>
  );
}

export default App;
