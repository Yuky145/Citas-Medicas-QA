// index.js
const app = require('./server');
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Sistema de citas operativo en http://localhost:${PORT}`);
});