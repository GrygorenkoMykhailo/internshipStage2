import { Request, Response } from "express";
import { RequestWithUserCreds } from "../types/RequestWithUserCreds";
import userRepository from "../repositories/userRepository";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import { UserProfileDAO } from "../types/UserProfileDAO";
import { UserUpdateProfileDAO } from "../types";
import { updateUserProfileSchema } from "../schemas/updateUserProfileSchema";

const getAllUsers = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    res.json(await userRepository.getAllUsers());
});

const changeUserRole = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    const { id, newRole } = req.body;

    if(!id || !newRole) res.status(400).send();

    const userId = await userRepository.changeUserRole(id, newRole);
    res.json(userId);
});

const getUserProfile = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    if(req.user){
        const userData = await userRepository.getUserById(req.user.userId);
        res.json(userData);
    }else{
        res.status(403).send();
    }
});

const getUserFavourites = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    if(req.user){
        res.json(await userRepository.getUserFavourites(req.user.userId));
    }else{
        res.status(403).send();
    }
});

const addUserFavourite = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    const { productId } = req.body;

    if(!productId) res.status(400).send();

    if(req.user){
        res.json(await userRepository.addUserFavourite(req.user.userId, productId));
    }else{
        res.status(403).send();
    }
});

const removeUserFavourite = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    const { id } = req.params;

    if(!id || !+id) res.status(400).send();

    if(req.user){
        await userRepository.removeUserFavourite(req.user.userId, +id);
        res.status(200).send();
    }else{
        res.status(403).send();
    }
});

const updateUserProfile = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    if (req.user) {
        await updateUserProfileSchema.validate(req.body);

        let profileImagePath;
        if (req.file) {
            profileImagePath = `/profile-images/${req.file.filename}`;
        }

        const updatedProfile = await userRepository.updateUserProfile(req.user.userId, req.body, profileImagePath);

        res.json(updatedProfile);
    } else {
        res.status(403).send();
    }
});

const deleteUser = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    const { id } = req.params;

    if(!id || !+id) res.status(400).send();

    const userId = await userRepository.deleteUser(+id);
    res.json(userId);
});


export default {
    getUserProfile,
    getUserFavourites,
    addUserFavourite,
    updateUserProfile,
    removeUserFavourite,
    getAllUsers,
    changeUserRole,
    deleteUser,
}