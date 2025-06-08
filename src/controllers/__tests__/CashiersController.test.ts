import 'reflect-metadata';
import { Container } from 'typedi';
import { CashiersController } from '../CashiersController';
import { CashierService } from '../../services/cashierService';
import { Request, Response } from 'express';

jest.mock('../../services/cashierService');

describe('CashiersController', () => {
    let controller: CashiersController;
    let cashierServiceMock: jest.Mocked<CashierService>;

    beforeEach(() => {
        // Manually create a mock instance
        cashierServiceMock = {
            loginCashier: jest.fn(),
        } as any;

        // Set the mock in the container
        Container.set(CashierService, cashierServiceMock);

        // Get the controller instance from the container
        controller = Container.get(CashiersController);
    });

    afterEach(() => {
        Container.reset();
        jest.clearAllMocks();
    });

    describe('loginCashier', () => {
        it('should call cashierService.loginCashier and return the result', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' }
            } as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;
            const serviceResult = { token: 'fake_token' };

            (cashierServiceMock.loginCashier as jest.Mock).mockResolvedValue(serviceResult);

            await controller.loginCashier(req, res);

            expect(cashierServiceMock.loginCashier).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(serviceResult);
        });

        it('should handle errors from the service', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' }
            } as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;
            const error = new Error('Service Error');

            (cashierServiceMock.loginCashier as jest.Mock).mockRejectedValue(error);

            await controller.loginCashier(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('server error');
        });
    });
}); 