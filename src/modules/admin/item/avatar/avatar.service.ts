export default class AvatarService {
  private static instance: AvatarService;
  public static getInstance() {
    if (!AvatarService.instance) {
      AvatarService.instance = new AvatarService();
    }

    return AvatarService.instance;
  }

  async createAvatar() {}
}
