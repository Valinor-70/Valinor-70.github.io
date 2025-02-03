const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the workspace root
app.use(express.static('/workspaces/Valinor-70.github.io'));

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join('/workspaces/Valinor-70.github.io', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
