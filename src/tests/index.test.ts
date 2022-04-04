
import { app } from '../app';
import supertest from 'supertest';

describe('app', () => {
  let request;
  beforeEach(() => {
    request = supertest(app);
  });
  it('should return a successful response for GET /', done => {
    request.get('/cajeros/verCajero')
      .expect(200, done);
  });
});