import express from 'express';
import { loggedInUser, logOutUser, newUser, updateUser } from '../controllers/user.js';
import { validateData } from '../middlewares/validationMiddlewate.js';
import { userLoginSchema, userRegistrationSchema, userUpdateSchema } from '../schema/userSchema.js';
import { authenticateUser } from '../middlewares/auth.js';

const app = express.Router();

app.get('/logout', logOutUser);
app.post('/new', validateData(userRegistrationSchema), newUser);
app.post('/login', validateData(userLoginSchema), loggedInUser);
app.put('/:id', authenticateUser, validateData(userUpdateSchema), updateUser);

export default app;
