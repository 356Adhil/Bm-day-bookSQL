import { openDB } from "./app/services/db.mjs";

export async function createTables() {
  const db = await openDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS Sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enteredBy INTEGER,
      amount REAL,
      invoiceNumber TEXT,
      date TEXT,
      FOREIGN KEY (enteredBy) REFERENCES Users(id)
    );

    CREATE TABLE IF NOT EXISTS Expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enteredBy INTEGER,
      expenseAmount REAL,
      description TEXT,
      date TEXT,
      FOREIGN KEY (enteredBy) REFERENCES Users(id)
    );

    CREATE TABLE IF NOT EXISTS Receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enteredBy INTEGER,
      amount REAL,
      description TEXT,
      date TEXT,
      FOREIGN KEY (enteredBy) REFERENCES Users(id)
    );
  `);

  // Insert a sample user
  const sampleUser = {
    name: "Boba Metals",
    email: "admin@boba.com",
    password: "adm321", // Remember to hash passwords in production!
    role: "admin",
  };

  await db.run(
    `
    INSERT INTO Users (name, email, password, role)
    VALUES (?, ?, ?, ?)`,
    [sampleUser.name, sampleUser.email, sampleUser.password, sampleUser.role]
  );

  console.log("Sample user added:", sampleUser);
}

// Call the createTables function to execute
createTables().catch(console.error);
