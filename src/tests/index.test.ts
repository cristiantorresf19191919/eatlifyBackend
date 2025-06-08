import { Server } from '../app';
import supertest from 'supertest';
import * as http from 'http';

describe('app', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;
    let connection: http.Server;

    beforeAll(() => {
        server = new Server();
        connection = server.app.listen();
        request = supertest(connection);
    });

    afterAll((done) => {
        connection.close(done);
    });

    it('should return a successful response for GET /', async () => {
        await request.get('/cajeros/verCajero').expect(200);
    });
});