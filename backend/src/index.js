const express = require('express');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

// Function to create table and insert initial data
async function createTableAndInsertData() {
    try {
        let pool = await sql.connect(dbConfig);
        
        // Create the table if it doesn't exist
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Messages' AND xtype='U')
            CREATE TABLE Messages (
                Id INT PRIMARY KEY IDENTITY(1,1),
                Message NVARCHAR(255) NOT NULL
            )
        `);

        // Insert initial data if the table is empty
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM Messages)
            INSERT INTO Messages (Message) VALUES ('Hello, World!')
        `);

        console.log('Table created and initial data inserted.');
    } catch (err) {
        console.error('SQL error:', err);
    }
}

// Call the function to create the table and insert data
createTableAndInsertData().catch(err => console.error('Error creating table:', err));

// Start the server
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
