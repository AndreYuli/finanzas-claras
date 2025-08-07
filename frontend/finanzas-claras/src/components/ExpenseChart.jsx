import { useState, useEffect } from "react";
import { PieChart ,Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";

const ExpenseChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/transactions/summary/expenses')
        .then(response => response.json())
        .then(summaryData => setData(summaryData))
        .catch(error => console.error('Error al obtener el resumen de gastos:', error));
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div style ={{width: '100%', height: 300}}>
            <h3>Resumen de Gastos</h3>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill= "#8884d8"
                    dataKey="value"
                    nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key = {`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`}/>
                </PieChart>
                </ResponsiveContainer>
            </div>
        );
    };

export default ExpenseChart;