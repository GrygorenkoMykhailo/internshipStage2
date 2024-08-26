import ProductModel from "../models/ProductModel";
import UserFavouritesModel from "../models/UserFavouritesModel";
import UserModel from "../models/UserModel";
import { User } from "../types";
import { Product } from "../types";
import { UserUpdateProfileDAO } from "../types";
import { hashPassword } from "../helpers/hashPassword";

class UserRepository{
    async userExistsByEmail(email: string): Promise<User | undefined>{
        return await UserModel.query().where('email', '=', email).first();
    }

    async getAllUsers(){
        return await UserModel.query();
    }

    async changeUserRole(userId: number, newRole: 'user' | 'admin'){
        return await UserModel.query().where('id', '=', userId).patch({
            role: newRole,
        });
    }

    async userExistsByPhone(phone: string): Promise<User | undefined>{
        return await UserModel.query().where('phoneNumber', '=', phone).first();
    }

    async saveUser(data: Partial<User>): Promise<User>{
        return await UserModel.query().insert(data);
    }

    async getUserById(id: number): Promise<User| undefined>{
        return await UserModel.query().where('id', '=', id).first();
    }

    async getUserFavourites(id: number): Promise<Product[] | undefined>{
        const user = await UserModel.query().where('id', '=', id).withGraphFetched('favourites.[characteristics]').first();
        return user?.favourites;
    }

    async addUserFavourite(userId: number, productId: number): Promise<Product | undefined>{
        await UserFavouritesModel.query().insert({productId: productId, userId: userId}); 
        return await ProductModel.query().where('id', '=', productId).withGraphFetched('characteristics').first();
    }

    async removeUserFavourite(userId: number, productId: number): Promise<void> {
        await UserFavouritesModel.query()
            .where('userId', '=', userId)
            .andWhere('productId', '=', productId)
            .delete();
    }

    async updateUserProfile(id: number, { firstName, lastName, email, phoneNumber, receiveUpdates, newPassword, confirmNewPassword }: UserUpdateProfileDAO, imagePath?: string): Promise<User | undefined> {
        const existingUser = await UserModel.query().where('id', '=', id).first();
        if (!existingUser) {
            throw new Error('User not found');
        }



        const updates: Partial<User> = {
            firstName,
            lastName,
            email,
            phoneNumber,
            receiveUpdates: receiveUpdates as unknown as string === 'true' ? true : false,
            imagePath: imagePath || existingUser.imagePath 
        };
    
        if (newPassword) {
            if(confirmNewPassword){
                if(newPassword === confirmNewPassword){
                    const hashedPassword = hashPassword(newPassword);
                    updates.hash = hashedPassword; 
                }
                else{
                    throw new Error();
                }
            }else{
                throw new Error();
            }
            
        } else {
            updates.hash = existingUser.hash; 
        }

        console.log(updates);
    
        await UserModel.query().where('id', '=', id).patch(updates);
        return await UserModel.query().where('id', '=', id).first();
    }

    async deleteUser(id: number) {
        const user = await UserModel.query().where('id', '=', id).first();
        if(user){
            await UserModel.query().deleteById(user.id);
            return user.id;
        }
    }

    async rememberUser(id: number) {
        return await UserModel.query().where('id', '=', id).patch({ rememberMe: true });
    }

    async forgetUser(id: number) {
        return await UserModel.query().where('id', '=', id).patch({ rememberMe: false });
    }
}

export default new UserRepository();