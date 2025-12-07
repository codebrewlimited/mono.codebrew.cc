import app from './app';

console.warn(process.env.PORT);

const PORT = process.env.PORT || 8746;

app.listen(PORT, () => {
  console.log(`v1 app running on port ${PORT}`);
});
