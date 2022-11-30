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
}
