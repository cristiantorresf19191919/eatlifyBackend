import 'reflect-metadata';
import { Container } from 'typedi';
import { CashierService } from '../cashierService';
import Cajero from '../../models/Cajero';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

jest.mock('../../models/Cajero');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('CashierService', () => {
    let cashierService: CashierService;

    beforeEach(() => {
        cashierService = Container.get(CashierService);
    });

    afterEach(() => {
        Container.reset();
        jest.clearAllMocks();
    });

    describe('loginCashier', () => {
        it('should return a token and user info on successful login', async () => {
            const cashierBody = { email: 'cashier@test.com', password: 'password123' };
            const mockCashier = {
                id: '1',
                name: 'Test Cashier',
                email: 'cashier@test.com',
                password: 'hashedpassword',
                admin: false,
                superuser: false,
            };

            (Cajero.findOne as jest.Mock).mockResolvedValue(mockCashier);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockImplementation((payload, secret, options, callback) => {
                callback(null, 'test_token');
            });

            const result = await cashierService.loginCashier(cashierBody as any);

            expect(Cajero.findOne).toHaveBeenCalledWith({ email: 'cashier@test.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalled();
            expect(result).toEqual({
                token: 'test_token',
                usuarioenviar: {
                    id: '1',
                    name: 'Test Cashier',
                    admin: false,
                    superuser: false,
                },
            });
        });

        it('should throw an error for non-existent user', async () => {
            const cashierBody = { email: 'nonexistent@test.com', password: 'password123' };
            (Cajero.findOne as jest.Mock).mockResolvedValue(null);

            await expect(cashierService.loginCashier(cashierBody as any)).rejects.toThrow('usuario no se encuentra en la base de datos');
        });

        it('should throw an error for invalid password', async () => {
            const cashierBody = { email: 'cashier@test.com', password: 'wrongpassword' };
            const mockCashier = {
                password: 'hashedpassword',
            };
            (Cajero.findOne as jest.Mock).mockResolvedValue(mockCashier);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(cashierService.loginCashier(cashierBody as any)).rejects.toThrow('Password Invalid');
        });
    });
}); 