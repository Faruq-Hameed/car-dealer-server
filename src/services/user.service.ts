import { NotFoundException } from "../exceptions/NotFoundException";
import { Car, Category, IUser, User } from "../models";
import { UserStatusEnum } from "../utils/types/enums";

class UserService {
  /**service to find all users */
  async findAllUsers(query?: Record<string, any>): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }
  async findUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async update(userId: string, data: Partial<IUser>): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...data },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    return updatedUser;
  }
  async delete(userId: string): Promise<string> {
    //check if a the user already has documents created by me if yes, only the status got updated to delete
    const [car, category] = await Promise.all([
      Car.findOne({ $or: [{ addedBy: userId }, { soldTo: userId }] }),
      Category.findOne({ addedBy: userId }),
    ]);
    
    let message = "User deleted successfully";
    let user: IUser | null;
    if (car || category) {
      user = await User.findByIdAndUpdate(userId, {
        $set: { status: UserStatusEnum.DELETED },
      });
      message = "User status updated to deleted";
    } else {
      user = await User.findByIdAndDelete(userId);
    }

    if (!user) {
      throw new NotFoundException("User not found");
    }
    return message;
  }
}

export default new UserService();
