import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
import validationRequest from '../../middlewares/validationRequest';
import favoriteValidation from './favorite_doc.validation';
import FavoriteController from './favorite_doc.controller';



const route=express.Router();

route.post("/favorite_doc", auth(USER_ROLE.user), validationRequest(favoriteValidation.favoriteValidationSchema), FavoriteController.recordedFavoriteDoc);
route.get("/find_my_favorite_list", auth(USER_ROLE.user), FavoriteController.findByAllMyFavoriteDoc);
route.delete("/delete_favorite_doc/:id", auth(USER_ROLE.user), FavoriteController.deleteFavoriteDoc);

const FavoriteRoute=route;

export default FavoriteRoute;