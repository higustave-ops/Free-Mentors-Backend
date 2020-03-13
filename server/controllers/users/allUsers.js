/* eslint-disable camelcase */
/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';

const router = express.Router();

router.get('/users', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.AUTH_KEY, (err, loggedUser) => {
    if (err) {
      res.status(403).json({
        status: 403,
        error: 'Forbidden',
      });
    // check if the logged user is a user  
    } else if (loggedUser.userIn.user_type !== '1') {
      res.status(403).json({
        status: 403,
        error: 'You are not allowed to access this route',
      });
    } else {
      client.query('SELECT id, first_name, last_name, email, address, bio, occupation, expertise, user_type FROM users ORDER BY id').then((results) => {
        res.status(200).json({
          status: 200,
          users: results.rows,
        });
      });
    }
  });
});

export default router;
