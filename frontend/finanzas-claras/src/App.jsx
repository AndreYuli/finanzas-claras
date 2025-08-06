import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])
const [description, setDescription] = useState('')
const [amount, setAmount] = useState('')
const [type, setType] = useState('')

const handleSubmit = (event) => {
  event.preventDefault();
  const newTransaction = {
    description,
    amount: parseFloat(amount),
    type,
    date: new Date().toISOString(),
    category: 'General'
  };

  fetch('http://localhost:3001/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTransaction),
  })
    .then(response => response.json())
    .then(savedTransaction => {
      setTransactions([...transactions, savedTransaction]);
      setDescription('');
      setAmount('');
      setType('');
    })
    .catch(error => console.error('Error al crear la transacción:', error));
};



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

        <form onSubmit={handleSubmit}>
          <h3>Añadir nueva transacción</h3>
          <div>
            <label>Descripción:</label>
            <input 
            type = "text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
            />
          </div>
          <div>
            <label>Monto:</label>
            <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required 
            />
          </div>
          <div>
            <label>Tipo:</label>
            <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            required>
              <option value="">Seleccione un tipo</option>
              <option value="EXPENSE">Gasto</option>
              <option value="INCOME">Ingreso</option>
            </select>
          </div>
          <button type="submit">Añadir transacción</button>
        </form>

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
