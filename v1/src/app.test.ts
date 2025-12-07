import request from 'supertest';

import app from '../src/app';

describe('Basic Express App Tests', () => {
  it('GET / should return Hello World message', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toContain('Hello World from v1! 🏭');
  });
});
