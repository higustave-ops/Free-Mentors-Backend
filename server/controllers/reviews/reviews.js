/* eslint-disable no-trailing-spaces */
import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';

const router = express.Router();

router.post('/sessions/:sessionId/review', verifyToken, (req, res) => {
  // Validate inputs
  const schema = {
    score: Joi.number().greater(0).less(6).required(),
    remark: Joi.string().min(3).max(250).required(),
  };

  const result = Joi.validate(req.body, schema);

  jwt.verify(req.token, process.env.AUTH_KEY, (err, loggedUser) => {
    if (err) {
      res.status(403).json({
        status: 403,
        error: 'Forbidden',
      });  
    } else {
      client.query('SELECT * FROM request_session WHERE id = $1', [req.params.sessionId]).then((results) => {
        const review = {
          reqsession_id: req.params.sessionId,
          menteeid: loggedUser.userIn.id,
          score: req.body.score,
          remark: req.body.remark,
        };
        // protect the route from mentors
        if (loggedUser.userIn.user_type === '2') {
          res.status(403).json({
            status: 403,
            error: 'You are not allowed to access this route',
          });
        // admin can not review but see all reviews  
        } else if (loggedUser.userIn.user_type === '1') {
          client.query('SELECT rq.id as sessionId, rq.mentorid as mentorId, u.id as menteeId, r.score as score, u.first_name as firstName, u.last_name as lastName, r.remark as remark FROM users u JOIN request_session rq ON u.id = rq.menteeid JOIN reviews r ON rq.id = r.reqsession_id ORDER BY r.id DESC').then((reviews) => {
            res.status(200).json({
              status: 200,
              data: reviews.rows,
            });
          });
        // check if request session ID exists  
        } else if (results.rows === 'undefined' || results.rows.length === 0) {
          res.status(404).json({
            status: 404,
            error: 'The given course ID does not exits',
          });
        // check the privileges of who requested  
        } else if (loggedUser.userIn.id !== results.rows[0].menteeid) {
          res.status(401).json({ 
            status: 401,
            error: 'The given course ID is not the course you requested',
          });
        // review the request accepted  
        } else if (results.rows[0].status === 'pending' || results.rows[0].status === 'rejected') {
          res.status(401).json({
            status: 401,
            error: 'Can not review session that was not accepted',
          });
        // check validation 
        } else if (result.error) {
          res.status(400).json({
            status: 400,
            error: result.error.details[0].message,
          });
        // review if everything is okay  
        } else {
          client.query('INSERT INTO reviews (reqsession_id, menteeid, score, remark) VALUES ($1, $2, $3, $4)', [review.reqsession_id, review.menteeid, review.score, review.remark]);
          client.query('SELECT r.id as id, rq.id as sessionid, rq.mentorid as mentorId, u.first_name as menteeFirstName, u.last_name as menteeLastName, r.score as score, r.remark as remark FROM users u JOIN request_session rq ON u.id = rq.menteeid JOIN reviews r ON rq.id = r.reqsession_id WHERE u.id = $1 ORDER BY r.id DESC LIMIT 1', [loggedUser.userIn.id]).then((reviews) => {
            res.status(201).json({
              status: 201,
              data: reviews.rows[0],
            });
          });
        }
      });
    } 
  });
});

export default router;
