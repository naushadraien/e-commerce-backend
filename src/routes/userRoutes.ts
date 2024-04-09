import express from 'express';
import { adminLogin, getAllUsers, loggedInUser, logOutUser, newUser, updateUser, updateUserRole } from '../controllers/user.js';
import { validateData } from '../middlewares/validationMiddlewate.js';
import { userLoginSchema, userRegistrationSchema, userUpdateRoleSchema, userUpdateSchema } from '../schema/userSchema.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/auth.js';

const app = express.Router();

app.get('/logout', logOutUser);
app.get('/users', authenticateUser, authorizeAdmin, getAllUsers);
app.post('/new', validateData(userRegistrationSchema), newUser);
app.post('/login', validateData(userLoginSchema), loggedInUser);
app.post('/adminLogin', validateData(userLoginSchema), adminLogin);
app.put('/update/:id', authenticateUser, validateData(userUpdateSchema), updateUser);
app.put('/role/:id', authenticateUser, validateData(userUpdateRoleSchema), updateUserRole);

export default app;
