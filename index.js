const express = require('express');
const app = express(); // Mueve esta línea arriba

app.use(express.json());    

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('El servidor de FinanzasClaras esta funcionando correctamente');
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.post('/api/transactions', async (req, res) => {
    try{
        const {description, amount, category, date, type } = req.body;

        if (!description || !amount || !type) {
            return res.status(400).json({error: 'Descripción, monto y tipo son campos requeridos.'});
        }
        const newTransaction = await prisma.transaction.create({
            data: {
                description,
                amount,
                category,
                date: new Date(date),
                type
            },
        });

        res.status(201).json(newTransaction);

    } catch (error) {
        console.error('Error al crear la transacción:', error);
        res.status(500).json({error: 'No se pudo crear la transacción'});
    }
});

