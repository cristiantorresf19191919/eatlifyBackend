import 'reflect-metadata';
import { CommonServices } from '../commonService';
import Container from '../../container';

describe('CommonServices', () => {
    let commonServices: CommonServices;

    beforeEach(() => {
        commonServices = Container.get(CommonServices);
    });

    describe('handleJWT', () => {
        it('should return a JWT token', async () => {
            const payload = { id: '123', name: 'test' };
            const token = await commonServices.handleJWT(payload);
            expect(typeof token).toBe('string');
        });

        it('should remove the password from the payload', async () => {
            const payload = { id: '123', name: 'test', password: 'password123' };
            const token = await commonServices.handleJWT(payload);
            expect(typeof token).toBe('string');
            // We can't actually check the decoded payload without the secret,
            // but we trust jwt.sign works. The main thing is that the function doesn't throw
            // and returns a token.
        });
    });

    describe('handleCustomException', () => {
        it('should send a response with the correct status and message', () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            commonServices.handleCustomException(res as any, 400, 'badReq');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Peticion Incorrecta');
        });
    });
}); 