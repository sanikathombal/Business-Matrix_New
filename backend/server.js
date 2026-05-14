const app = require('./app');

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`B-Matrix backend listening on http://localhost:${port}`);
});
