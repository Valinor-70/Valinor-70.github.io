const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Add CORS to allow cross-origin requests

// Create an express app
const app = express();

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

// Serve static files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, '..')));

// Path to store messages
const messagesFilePath = path.join(__dirname, 'messages.json');

// Ensure the messages file exists
if (!fs.existsSync(messagesFilePath)) {
  fs.writeFileSync(messagesFilePath, JSON.stringify([]));
}

// Handle POST requests from the recruitment form
app.post('/submit-message', (req, res) => {
  const { name, email, skills, experience } = req.body;

  const newMessage = {
    id: Date.now(),
    name,
    email,
    skills,
    experience,
    timestamp: new Date().toISOString(),
  };

  const messages = JSON.parse(fs.readFileSync(messagesFilePath));
  messages.push(newMessage);
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));

  console.log(`Message received:
    Name: ${name}
    Email: ${email}
    Skills: ${skills}
    Experience: ${experience}`);

  // Respond to the client
  res.status(200).json({ message: 'Application submitted successfully!' });
});

// Retrieve all messages
app.get('/messages', (req, res) => {
  const messages = JSON.parse(fs.readFileSync(messagesFilePath));
  res.status(200).json(messages);
});

// SSL Certificates
const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert')),
};

// Create an HTTPS server
const server = https.createServer(options, app);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
});