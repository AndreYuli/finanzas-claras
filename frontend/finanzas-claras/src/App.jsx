import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const apiUrl = 'http://localhost:3001/api/transactions';

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log('Transacciones obtenidas:', data);
        setTransactions(data);
      })
      .catch(error =>
        console.error('Error al obtener las transacciones:', error));
      },[]);

      return (
        <>
        <h1>FinanzasClaras</h1>
        <h2>Mi lista de transacciones</h2>

        <ul>
          {transactions.map(tx =>(
            <li key={tx.id}>
              {tx.description}: ${tx.amount} ({tx.type})
            </li>
          ))}
        </ul>

        </>

  );
}

export default App
