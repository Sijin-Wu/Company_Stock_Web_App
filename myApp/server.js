const express = require('express');
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, 'dist/browser')));

// Serve Angular index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/browser/index.html'));
});

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
