const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let loginWindow;

// Function to create the login window
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  loginWindow.loadFile('login.html').catch((err) => {
    console.error('Failed to load login.html:', err);
  });
}

// Function to create the main application window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html').catch((err) => {
    console.error('Failed to load index.html:', err);
  });

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createLoginWindow(); // Create the login window

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow();
  });
});

// Handle login attempt
ipcMain.on('login-attempt', (event, credentials) => {
  console.log('Received credentials:', credentials); // Debugging

  // Check credentials (replace with your actual credentials)
  const validCredentials = {
    username: 'admin',
    password: 'password123'
  };

  if (credentials.username === validCredentials.username && 
      credentials.password === validCredentials.password) {
    console.log('Login successful!'); // Debugging
    loginWindow.close();
    createMainWindow();
  } else {
    console.log('Login failed.'); // Debugging
    event.reply('login-response', false);
  }
});

// Listen for 'insert-truck-data' event from the renderer process
ipcMain.on('insert-truck-data', (event, truckData) => {
  // Assuming dataHandler is a module to handle DB operations
  dataHandler.insertTruckData(truckData, (err, lastID) => {
    if (err) {
      console.error('Error inserting data:', err);
      return;
    }
    console.log('Data inserted with ID:', lastID);
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
