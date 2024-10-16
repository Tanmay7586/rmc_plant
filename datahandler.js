const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database file or connect to an existing one
const dbPath = path.join(__dirname, 'db', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database.');
        db.run(`CREATE TABLE IF NOT EXISTS truck_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            material_type TEXT NOT NULL,
            quantity REAL NOT NULL,
            truck_number TEXT NOT NULL,
            driver_name TEXT NOT NULL,
            notes TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Function to insert truck load/unload data
function insertTruckData(data, callback) {
  const { materialType, quantity, truckNumber, driverName, notes } = data;
  console.log("Inserting data:", data); // Log the data being inserted
  db.run(`INSERT INTO truck_data (material_type, quantity, truck_number, driver_name, notes) VALUES (?, ?, ?, ?, ?)`,
      [materialType, quantity, truckNumber, driverName, notes], function(err) {
          callback(err, this.lastID); // Return error and last inserted ID
      });
}

// Function to retrieve all truck data
function getAllTruckData(callback) {
    db.all(`SELECT * FROM truck_data ORDER BY timestamp DESC`, [], (err, rows) => {
        callback(err, rows); // Return error and rows of data
    });
}

// Export the database functions
module.exports = {
    insertTruckData,
    getAllTruckData
};
