/* eslint-disable no-trailing-spaces */
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';

const router = express.Router();

router.get('/mentors', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.AUTH_KEY, (err, loggedUser) => {
    if (err) {
      res.status(403).json({
        status: 403,
        error: 'Forbidden',
      });
    // protect the route against unauthorized  
    } else if (loggedUser.userIn.user_type === '2') {
      res.status(403).json({
        status: 403,
        error: 'You are not allowed to access this route',
      });
    } else {
      // display mentors
      const userType = '2';
      client.query('SELECT id, first_name, last_name, email, address, bio, occupation, expertise FROM users WHERE user_type = $1 ORDER BY id', [userType]).then((results) => {
        res.status(200).json({
          status: 200,
          data: results.rows,
        });
      });
    }
  });
});

export default router;
