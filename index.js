const express = require('express');

const app = express();

const PORT = 3001;

app.get('/', (req, res) => {
    res.send('El servidor de FinanzasClaras esta funcionando correctamente');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});