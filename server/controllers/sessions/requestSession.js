/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';

const router = express.Router();

router.post('/sessions', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.AUTH_KEY, (err, loggedUser) => {
    const schema = {
      mentorId: Joi.number().required(),
      questions: Joi.string().min(3).max(250).required(),
    };

    const result = Joi.validate(req.body, schema);

    if (err) {
      res.status(403).json({
        status: 403,
        error: 'Forbidden',
      });  
    } else {
      const session = {
        mentorId: req.body.mentorId,
        menteeId: loggedUser.userIn.id,
        questions: req.body.questions,
      };
      client.query('SELECT * FROM users WHERE id = $1', [session.mentorId], (erreur, results) => {
        // check if the logged user is a user
        if (loggedUser.userIn.user_type !== '0') {
          res.status(403).json({
            status: 403,
            error: 'You are not allowed to access this route',
          });
        // check validation  
        } else if (result.error) {
          res.status(400).json({
            status: 400,
            error: result.error.details[0].message,
          });
        // check if Id exists  
        } else if (results.rows === 'undefined' || results.rows.length === 0 || results.rows[0].user_type !== '2') {
          res.status(404).json({
            status: 404,
            error: 'Mentor with the Given ID does not exists',
          });  
        } else {
          // Insert into database if everything goes right              
          client.query('INSERT INTO request_session (mentorId, menteeId, questions) VALUES ($1, $2, $3) RETURNING*', [session.mentorId, session.menteeId, session.questions]);
          client.query('SELECT r.id as sessionId, r.mentorId as mentorId, u.id as menteeId, r.questions as questions, u.email as email, r.status as status FROM users u JOIN request_session r ON u.id = r.menteeId WHERE u.id = $1 ORDER BY r.id DESC LIMIT 1', [loggedUser.userIn.id], (error, request) => {
            res.status(201).json({
              status: 201,
              data: {
                sessionId: request.rows[0].sessionid,
                mentorId: request.rows[0].mentorid,
                menteeId: request.rows[0].menteeid,
                questions: request.rows[0].questions,
                menteeEmail: request.rows[0].email,
                status: request.rows[0].status, 
              },
            });
          });
        }
      });
    }
  });
});

export default router;
