/* eslint-disable no-sequences */
/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';

const router = express.Router();

router.patch('/sessions/:sessionId/reject', verifyToken, (req, res) => {
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
        // check if they were no accepted before  
        } else if (results.rows[0].status === 'accepted') {
          res.status(401).json({
            status: 401,
            error: 'This request can not be rejected because was accepted before',
          });
        // check if the rejected wasn't made before  
        } else if (results.rows[0].status === 'rejected') {
          res.status(409).json({
            status: 409,
            error: 'This request was made before',
          });
        // update if everything goes right  
        } else {
          client.query('UPDATE request_session SET status = \'rejected\' WHERE id = $1 RETURNING*', [req.params.sessionId]).then((reject) => {
            res.status(200).json({
              status: 200,
              data: {
                sessionId: reject.rows[0].id,
                mentorId: reject.rows[0].mentorid,
                menteeId: reject.rows[0].menteeid,
                questions: reject.rows[0].questions,
                status: reject.rows[0].status,
              },
            });
          });
        } 
      });
    }
  });
});

export default router;
