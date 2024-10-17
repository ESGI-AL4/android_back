import express from 'express';
import sequelize from './db';
import User from './models/User';

const app = express();
app.use(express.json());

// Synchronisation avec la base de données
/*
sequelize.sync().then(() => {
    console.log('Base de données synchronisée.');
}).catch((error) => {
    console.error('Erreur lors de la synchronisation :', error);
});*/

// Route pour ajouter un utilisateur
app.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'Unknown error occurred' });
        }
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});


// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
