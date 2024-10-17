import { Sequelize } from 'sequelize';

// Connexion à la base de données PostgreSQL
const sequelize = new Sequelize('database_name', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres', // Ou 'mysql', 'sqlite', etc.
});

export default sequelize;