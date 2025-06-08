import { Service } from 'typedi';
import FinalUser, { IFinalUsers } from '../models/FinalUsers';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth/AuthService';

@Service()
export class FinalUsersService {
    constructor(private readonly authService: AuthService) { }

    async addFinalUser(userData: IFinalUsers) {
        const { email, password } = userData;
        if (!email || !password) throw new Error("bad request no email or password");
        const yaexisteusuario = await FinalUser.findOne({ email: email.trim() });
        if (yaexisteusuario) throw new Error("EMAIL_EXISTS");

        const finalUser = new FinalUser({ email, password });
        finalUser.password = await this.authService.hashPassword(password);
        const finalUserSaved = await finalUser.save();
        return this.authService.signToken(finalUserSaved);
    }

    async loginFinalUser(userData: IFinalUsers) {
        const { email, password } = userData;
        const userFound = await FinalUser.findOne({ email: email });
        if (!userFound) throw new Error("EMAIL_NOT_FOUND");

        const match = await bcrypt.compare(password, userFound.password);
        if (match) {
            return this.authService.signToken(userFound);
        } else {
            throw new Error('INVALID_PASSWORD');
        }
    }

    async viewAllUsers() {
        return await FinalUser.find({});
    }

    async viewFinalUserbyId(id: string) {
        return await FinalUser.findById(id);
    }

    async updateFinalUser(id: string, userData: IFinalUsers) {
        const { email, password } = userData;
        const user = await FinalUser.findById(id);
        if (!user) throw new Error("user not found");
        user.email = email;
        user.password = await this.authService.hashPassword(password);
        return await user.save();
    }

    async deleteFinalUser(id: string) {
        const user = await FinalUser.findById(id);
        if (!user) {
            throw new Error("user not found");
        }
        await user.remove();
        return user;
    }
} 