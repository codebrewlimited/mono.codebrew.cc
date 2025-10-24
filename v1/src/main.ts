import express from 'express';

const app = express();
const PORT = process.env.PORT || 8745;

app.get('/', (req, res) => {
  res.send('Hello World from v1!');
});

app.listen(PORT, () => {
  console.log(`v1 app running on port ${PORT}`);
});
