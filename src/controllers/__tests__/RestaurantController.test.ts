import 'reflect-metadata';
import { Container } from 'typedi';
import { RestaurantController } from '../RestaurantController';
import { RestaurantService } from '../../services/restaurantService';
import { Request, Response } from 'express';

jest.mock('../../services/restaurantService');

describe('RestaurantController', () => {
    let controller: RestaurantController;
    let restaurantServiceMock: jest.Mocked<RestaurantService>;

    beforeEach(() => {
        // Create a mock instance of RestaurantService
        restaurantServiceMock = new RestaurantService(null) as jest.Mocked<RestaurantService>;
        restaurantServiceMock.login = jest.fn();

        // Set the mock in the container
        Container.set(RestaurantService, restaurantServiceMock);

        // Get the controller instance from the container
        controller = Container.get(RestaurantController);
    });

    afterEach(() => {
        Container.reset();
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should call restaurantService.login with request body and response object', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password' }
            } as Request;
            const res = {} as Response;

            await controller.login(req, res);

            expect(restaurantServiceMock.login).toHaveBeenCalledWith(res, req.body);
            expect(restaurantServiceMock.login).toHaveBeenCalledTimes(1);
        });
    });
}); 