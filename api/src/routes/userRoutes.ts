import express from "express";
import { authenticate } from "../middleware/authenticate";
import usersController from "../controllers/usersController";
import { ensureAdmin } from "../middleware/ensureAdmin";
import { createMulterMiddleware } from "../middleware/createMulterMiddleware";

const upload = createMulterMiddleware('public/profile-images/');

export const router = express.Router();

router.get('/profile', authenticate, usersController.getUserProfile);
router.get('/favourites', authenticate, usersController.getUserFavourites);

router.get('/users', [authenticate, ensureAdmin], usersController.getAllUsers);
router.post('/userRole', [authenticate, ensureAdmin], usersController.changeUserRole);
router.delete('/user/:id', [authenticate, ensureAdmin], usersController.deleteUser);

router.post('/favourite', authenticate, usersController.addUserFavourite);
router.delete('/favourite/:id', authenticate, usersController.removeUserFavourite);
router.put('/updateProfile', [authenticate, upload.single('profileImage')], usersController.updateUserProfile);
