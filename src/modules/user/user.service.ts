import AppError from '../../libs/app-error';
import { FastifyRequest } from 'fastify';

export default class UserService {
  private static instance: UserService;
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  async getme(request: FastifyRequest) {
    if (request.isExpiredToken) {
      throw new AppError('Unauthorized');
    }

    if (!request.user) {
      throw new AppError('Unauthorized');
    }

    return request.user;
  }
}
