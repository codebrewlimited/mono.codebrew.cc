import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 8746;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from v1!');
});

app.listen(PORT, () => {
  console.log(`v1 app running on port ${PORT}`);
});
