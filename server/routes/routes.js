import express from 'express';

import signupController from '../controllers/users/signup';
import adminSignupController from '../controllers/users/adminSignup';
import signinController from '../controllers/users/signin';
import changerUserController from '../controllers/users/changeUser';
import mentorsController from '../controllers/users/mentors';
import specificMentorController from '../controllers/users/specificMentor';
import allUsersController from '../controllers/users/allUsers';

import requestSessionController from '../controllers/sessions/requestSession';
import acceptRequestController from '../controllers/sessions/acceptRequest';
import rejectRequestController from '../controllers/sessions/rejectRequest';
import sessionsController from '../controllers/sessions/sessions';

import reviewController from '../controllers/reviews/reviews';
import deleteReviewController from '../controllers/reviews/deleteReview';

const route = express();

// users rotues
route.use('/api/v2/auth', signupController);
route.use('/api/v2/auth', adminSignupController);
route.use('/api/v2/auth', signinController);
route.use('/api/v2', changerUserController);
route.use('/api/v2', mentorsController);
route.use('/api/v2', specificMentorController);
route.use('/api/v2', allUsersController);

// sessions routes
route.use('/api/v2', requestSessionController);
route.use('/api/v2', acceptRequestController);
route.use('/api/v2', rejectRequestController);
route.use('/api/v2', sessionsController);

// reviews routes
route.use('/api/v2', reviewController);
route.use('/api/v2', deleteReviewController);

export default route;
