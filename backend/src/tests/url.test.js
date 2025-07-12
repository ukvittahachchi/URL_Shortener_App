import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app.js';
import Url from '../models/Url.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('URL Shortener API', () => {
  test('should shorten a URL', async () => {
    const response = await request(app)
      .post('/api/url/shorten')
      .send({ originalUrl: 'https://example.com' });
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('shortUrl');
  });

  test('should reject invalid URL', async () => {
    const response = await request(app)
      .post('/api/url/shorten')
      .send({ originalUrl: 'invalid-url' });
    
    expect(response.statusCode).toBe(400);
  });
});