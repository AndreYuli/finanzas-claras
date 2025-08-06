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

app.get('/api/transactions', async (req, res) => {
    try{
        const allTransactions = await prisma.transaction.findMany({
            orderBy: {
                date: 'desc',
            },
        });

        res.status(200).json(allTransactions);
    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        res.status(500).json({error: 'No se pudieron obtener las listas de transacciones'});
    }
});

app.delete('/api/transactions/:id', async (req, res) => {
    try{
        const {id} = req.params;

        await prisma.transaction.delete({
            where: {
                id: parseInt(id),
            },
        });

        // Cambia req.status por res.status
        res.status(200).json({message: 'Transacción eliminada correctamente'});
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({error: 'La transaccion con el ID especificado no existe.'});
        }

        console.error('Error al eliminar la transacción:', error);
        res.status(500).json({error: 'No se pudo eliminar la transacción'});
    }
});

app.put('/api/transactions/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {description, amount, category, date, type} = req.body;

        if (!description || !amount || !type) {
            return res.status(400).json({error: 'Descripción, monto y tipo son campos requeridos.'});
        }

        const updatedTransaction = await prisma.transaction.update({
            where: {
                id: parseInt(id),
            },
            data: {
                description,
                amount,
                category,
                date: new Date(date),
                type,
            },
        });

        res.status(200).json(updatedTransaction);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({error: 'La transacción con el ID especificado no existe.'});
        }

        console.error('Error al actualizar la transacción:', error);
        res.status(500).json({error: 'No se pudo actualizar la transacción'});
    }
});
