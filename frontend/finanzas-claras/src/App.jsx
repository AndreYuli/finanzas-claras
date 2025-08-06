import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('')

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ description: '', amount: '', type: 'EXPENSE' });

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setEditingData({ 
      description: tx.description, 
      amount: tx.amount, 
      type: tx.type,
      date: tx.date, // <-- agrega esto
      category: tx.category // si usas category
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  // CORRECCIÓN: Recibe el id como argumento
  const handleSave = (id) => {
    fetch(`http://localhost:3001/api/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingData,
        amount: parseFloat(editingData.amount)
      }),
    })
      .then(response => response.json())
      .then(UpdatedTx => {
        setTransactions(transactions.map(tx => (tx.id === id ? UpdatedTx : tx)));
        setEditingId(null);
      })
      .catch(error => console.error('Error al actualizar la transacción:', error));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      return;
    }

    fetch(`http://localhost:3001/api/transactions/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setTransactions(transactions.filter(tx => tx.id !== id));
        } else {
          console.error('Error al eliminar la transacción');
        }
      })
      .catch(error => console.error('Error de red:', error));
  };

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
        setTransactions(data);
      })
      .catch(error =>
        console.error('Error al obtener las transacciones:', error));
  }, []);

  return (
    <main className='container'>
      <h1>FinanzasClaras</h1>

      <form onSubmit={handleSubmit}>
        <h3>Añadir nueva transacción</h3>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
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
        {transactions.map(tx => (
          <li key={tx.id}>
            {editingId === tx.id ? (
              <div>
                <input
                  type="text"
                  value={editingData.description}
                  onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                />
                <input
                  type='number'
                  value={editingData.amount}
                  onChange={(e) => setEditingData({ ...editingData, amount: e.target.value })}
                />
                <select
                  value={editingData.type}
                  onChange={(e) => setEditingData({ ...editingData, type: e.target.value })}
                >
                  <option value="EXPENSE">Gasto</option>
                  <option value="INCOME">Ingreso</option>
                </select>
                {/* CORRECCIÓN: Botón bien escrito y pasando el id */}
                <button className= "secondary outline" onClick={() => handleSave(tx.id)}>Guardar</button>
                <button className= "contrast outline" onClick={handleCancel}>Cancelar</button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between',alignItems: 'center',width: '100%' }}>
                <span>
                   {tx.description}: ${tx.amount} ({tx.type})
                </span>
                <span>
                  <button className = "secondary outline "onClick={() => handleEdit(tx)}>
                  Editar
                </button>
                <button className = "contrast outline" onClick={() => handleDelete(tx.id)} style={{ marginLeft: '10px' }}>
                  Eliminar
                </button>
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App
