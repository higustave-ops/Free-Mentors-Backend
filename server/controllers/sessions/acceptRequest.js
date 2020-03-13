/* eslint-disable no-sequences */
/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';

const router = express.Router();

router.patch('/sessions/:sessionId/accept', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.AUTH_KEY, (err, loggedUser) => {
    if (err) {
      res.status(403).json({
        status: 403,
        error: 'Forbidden',
      });  
    } else {
      client.query('SELECT * FROM request_session WHERE id = $1', [req.params.sessionId]).then((results) => {
        // check if logged user is a mentor
        if (loggedUser.userIn.user_type !== '2') {
          res.status(403).json({
            status: 403,
            error: 'You are not allowed to access this route',
          });
        // verify if ID exists   
        } else if (results.rows === 'undefined' || results.rows.length === 0) {
          res.status(404).json({
            status: 404,
            error: 'The given request session Id does not exists',
          });
        // logged mentor Id should match request mentor Id  
        } else if (loggedUser.userIn.id !== results.rows[0].mentorid) {
          res.status(403).json({
            status: 403,
            error: 'The given session ID is not your request, The logged Mentor Id and requested Mentor Id does not match',
          });
        // check if they were no reject before  
        } else if (results.rows[0].status === 'rejected') {
          res.status(401).json({
            status: 401,
            error: 'This request can not be accepted because was rejected before',
          });
        // check if the accepted wasn't made before  
        } else if (results.rows[0].status === 'accepted') {
          res.status(409).json({
            status: 409,
            error: 'This request was made before',
          });
        // update if everything goes right  
        } else {
          client.query('UPDATE request_session SET status = \'accepted\' WHERE id = $1 RETURNING*', [req.params.sessionId]).then((accept) => {
            res.status(200).json({
              status: 200,
              data: {
                sessionId: accept.rows[0].id,
                mentorId: accept.rows[0].mentorid,
                menteeId: accept.rows[0].menteeid,
                questions: accept.rows[0].questions,
                status: accept.rows[0].status, 
              },
            });
          });
        } 
      });
    }
  });
});

export default router;
