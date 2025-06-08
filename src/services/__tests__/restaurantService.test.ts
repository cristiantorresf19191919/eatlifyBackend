import 'reflect-metadata';
import { Container } from 'typedi';
import { RestaurantService } from '../restaurantService';
import { CommonServices } from '../commonService';
import RestaurantDb from '../../models/Restaurantes';
import * as bcrypt from 'bcryptjs';

jest.mock('../../models/Restaurantes');
jest.mock('bcryptjs');

describe('RestaurantService', () => {
    let restaurantService: RestaurantService;
    let commonServicesMock: Partial<CommonServices>;

    beforeEach(() => {
        // Mock CommonServices
        commonServicesMock = {
            handleCustomException: jest.fn(),
            handleJWT: jest.fn().mockResolvedValue('test_token'),
        };

        // Set the mock in the container
        Container.set(CommonServices, commonServicesMock);

        // Get the service instance from the container
        restaurantService = Container.get(RestaurantService);
    });

    afterEach(() => {
        Container.reset();
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return a token on successful login', async () => {
            const restaurantBody = { email: 'test@test.com', password: 'password123' };
            const mockRestaurant = {
                ...restaurantBody,
                password: 'hashedpassword'
            };

            (RestaurantDb.findOne as jest.Mock).mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRestaurant)
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const res = {}; // Mock response object

            const token = await restaurantService.login(res as any, restaurantBody as any);

            expect(RestaurantDb.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(commonServicesMock.handleJWT).toHaveBeenCalledWith(mockRestaurant);
            expect(token).toBe('test_token');
        });

        it('should call handleCustomException for non-existent restaurant', async () => {
            const restaurantBody = { email: 'test@test.com', password: 'password123' };
            
            (RestaurantDb.findOne as jest.Mock).mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            });

            const res = {}; // Mock response object

            await restaurantService.login(res as any, restaurantBody as any);

            expect(commonServicesMock.handleCustomException).toHaveBeenCalledWith(res, 400, "badReq");
        });

        it('should call handleCustomException for invalid password', async () => {
            const restaurantBody = { email: 'test@test.com', password: 'wrongpassword' };
            const mockRestaurant = {
                ...restaurantBody,
                password: 'hashedpassword'
            };

            (RestaurantDb.findOne as jest.Mock).mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRestaurant)
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const res = {}; // Mock response object

            await restaurantService.login(res as any, restaurantBody as any);

            expect(commonServicesMock.handleCustomException).toHaveBeenCalledWith(res, 404, "invalidPass");
        });
    });
}); 