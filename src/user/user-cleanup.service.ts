import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/common/schema/user.schema';

@Injectable()
export class UserCleanupService {
  private readonly logger = new Logger(UserCleanupService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Cron('0 0 1 */3 *')
  async handleCron() {
    try {
      this.logger.log('Running user cleanup job.');

      const deletedUsers = await this.userModel.deleteMany({
        deactivated: true,
      });

      this.logger.log(`Deleted ${deletedUsers.deletedCount} users.`);
    } catch (error) {
      this.logger.error('Error in user cleanup job:', error);
    }
  }
}
