import { ConflictException } from "../exceptions/ConflictException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { IUser, User } from "../models";
import {
  comparePassword,
  generateAuthToken,
  hashPassword,
  userPublicFields,
} from "../utils/auth.utils";
import { IChangePassword, ILogin } from "../utils/types/authTypes";

class AuthService {
  /**service t add a user */
  async registerAccount(data: Partial<IUser>): Promise<Partial<IUser>> {
    const { email, phonenumber } = data;
    const existingUser = await User.findOne({
      $or: [{ email }, { phonenumber }],
    });
    if (existingUser) {
      const existingField =
        existingUser.email === email ? "email" : "phone number";
      throw new ConflictException(`${existingField} already exist`);
    }
    data.password = hashPassword(data.password as string);

    data.lastTokenGeneration = new Date(); //to be used for token generation
    const user = await User.create(data)
    return user.toObject()
  }

  async login(data: ILogin): Promise<Partial<IUser>> {
    const { email, password } = data;
    const user = await User.findOne({ email, status: "active" }).lean();
    if (!user) {
      throw new NotFoundException("No active account found");
    }
    const isPasswordCorrect = comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new ConflictException("Incorrect password");
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        lastTokenGeneration: new Date(),
      },
      { new: true }
    ).lean()
    return updatedUser as IUser;
  }

  async changePassword(data: IChangePassword, userId: string): Promise<void> {
    const { oldPassword, newPassword } = data;
    const user = await User.findById(userId, "password lastTokenGeneration");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const isPasswordCorrect = comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new ConflictException("Old password incorrect password");
    }
     user.password = hashPassword(newPassword);

    user.lastTokenGeneration = new Date(); //to be used for token generation
    await user.save();
    return;
  }
}

export default new AuthService();
