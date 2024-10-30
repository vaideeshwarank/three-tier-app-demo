require('dotenv').config(); // Loads environment variables from .env for local testing
const sql = require('mssql'); // SQL Server client

// Database connection configuration using environment variables
const config = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
        encrypt: true, // true if using Azure SQL or any other secure connection
        enableArithAbort: true
    }
};

// Connect to the database and check if the Feedback table exists
async function initializeDatabase() {
    try {
        let pool = await sql.connect(config);
        console.log('Connected to the database');

        // Check and create the Feedback table if it doesn't exist
        const tableCheckQuery = `
            IF NOT EXISTS (
                SELECT * FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME = 'Feedback'
            )
            CREATE TABLE Feedback (
                Id INT PRIMARY KEY IDENTITY(1,1),
                Name NVARCHAR(100) NOT NULL,
                Feedback NVARCHAR(255) NOT NULL,
                SubmittedAt DATETIME DEFAULT GETDATE()
            );
        `;
        
        await pool.request().query(tableCheckQuery);
        console.log('Feedback table is ready');

    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

// Run the database initialization
initializeDatabase();

// Sample Express setup (if using Express for backend routing)
const express = require('express');
const app = express();
app.use(express.json());

// Endpoint for submitting feedback
app.post('/feedback', async (req, res) => {
    const { name, feedback } = req.body;
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('feedback', sql.NVarChar, feedback)
            .query(`INSERT INTO Feedback (Name, Feedback) VALUES (@name, @feedback)`);
        res.status(201).send({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).send({ error: 'Failed to submit feedback' });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
