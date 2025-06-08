jest.mock('../dataBaseConnection', () => {
    return jest.fn().mockImplementation(() => {
        return {
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
        };
    });
});

import { Server } from '../app';
import supertest from 'supertest';
import { Container } from 'typedi';
import { CashierService } from '../services/cashierService';

describe.skip('app', () => {
    let request: supertest.SuperTest<supertest.Test>;
    const server = new Server();

    beforeAll(async () => {
        const cashierServiceMock = {
            seeCashier: jest.fn().mockResolvedValue([{ name: 'Mock Cashier' }])
        };
        Container.set(CashierService, cashierServiceMock);

        await server.start();
        request = supertest(server.connection);
    });

    afterAll(async () => {
        await server.close();
        Container.reset();
    });

    it('should return a successful response for GET /cajeros/verCajero', async () => {
        const response = await request.get('/cajeros/verCajero');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ name: 'Mock Cashier' }]);
    });
});