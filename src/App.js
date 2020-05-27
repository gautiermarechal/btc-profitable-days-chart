import React from 'react';
import './App.css';
import ProfitableDaysChart from './ProfitableDaysChart';

function App() {
  return (
    <div className="App">
      <div className="Main">
        <h1>Profitable Days Buying BTC</h1>
        <ProfitableDaysChart/>
        <div className="Description">
        <h3>Chart Description</h3>
        <p>This chart displays all the days when it would have been profitable to buy BTC, compared to today's price. Profitable days are in green, and non-profitable in red. </p>
        </div>
      </div>
    </div>
  );
}

export default App;
