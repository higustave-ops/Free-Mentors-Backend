/* eslint-disable no-trailing-spaces */
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import client from '../../config/config';

dotenv.config();

const router = express.Router();

router.post('/signin', (req, res) => {
  const user = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [req.body.email],
  };

  client.query(user, (error, results) => {
    if (results.rows === 'undefined' || results.rows.length === 0) {
    // there is no data in the DB
      res.status(404).json({
        status: 404,
        error: 'Authentication failed, Invalid Email or Password',
      });
    } else {
      const userIn = {
        id: results.rows[0].id,
        firstName: results.rows[0].first_name,
        lastName: results.rows[0].last_name,
        email: results.rows[0].email,
        hashPassword: results.rows[0].password,
        address: results.rows[0].address,
        bio: results.rows[0].bio,
        occupation: results.rows[0].occupation,
        expertise: results.rows[0].expertise,
        user_type: results.rows[0].user_type,
      };

      bcrypt.compare(req.body.password, userIn.hashPassword, (err, matched) => {
        if (matched) {
          jwt.sign({ userIn }, process.env.AUTH_KEY, (_err, token) => {
            res.status(200).json({
              status: 200,
              message: 'User is successfully sign in',
              data: {
                token,
                firstName: userIn.firstName,
                lastName: userIn.lastName,
              },
            });
          });
        // not authorize user to log in  
        } else {
          res.status(401).json({
            status: 401,
            message: 'Authentication failed, Invalid Email or Password',
          });
        }
      });
    }
  });  
});

export default router;
