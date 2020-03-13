/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';

const router = express.Router();

router.get('/sessions', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.AUTH_KEY, (err, loggedUser) => {
    if (err) {
      res.status(403).json({
        status: 403,
        error: 'Forbidden',
      });
    // check if the logged user is a user  
    } else if (loggedUser.userIn.user_type === '0') {
      client.query('SELECT r.id as sessionId, r.mentorid as MentorId, u.id as menteeId, r.questions as questions, u.email as email, r.status as status FROM users u JOIN request_session r ON u.id = r.menteeId WHERE u.id = $1 ORDER BY r.id DESC', [loggedUser.userIn.id], (error, results) => {
        res.status(200).json({
          status: 200,
          data: results.rows,
        });
      });
    // check if the logged user is a mentor  
    } else if (loggedUser.userIn.user_type === '2') {
      client.query('SELECT r.id as sessionId, r.mentorid as MentorId, u.id as menteeId, r.questions as questions, u.email as email, r.status as status FROM users u JOIN request_session r ON u.id = r.menteeId WHERE r.mentorid = $1 ORDER BY r.id DESC', [loggedUser.userIn.id], (error, result) => {
        res.status(200).json({
          status: 200,
          data: result.rows,
        });
      });
    } else {
      res.status(404).json({
        status: 404,
        message: 'Not records found',
      });
    }
  });
});

export default router;
