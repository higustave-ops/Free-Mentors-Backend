/* eslint-disable no-trailing-spaces */
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';

const router = express.Router();

router.delete('/sessions/:sessionid/review', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.AUTH_KEY, (err, loggedUser) => {
    if (err) {
      res.status(403).json({
        status: 403,
        error: 'Forbidden',
      });
    // check root access  
    } else {
      client.query('SELECT * FROM reviews WHERE id = $1', [req.params.sessionid]).then((results) => {
        // check root access
        if (loggedUser.userIn.user_type !== '1') {
          res.status(403).json({
            status: 403,
            error: 'You are not allowed to access this route',
          });
        // check if ID exists  
        } else if (results.rows === 'undefined' || results.rows.length === 0) {
          res.status(404).json({
            status: 404,
            error: 'The review ID not found',
          });
        } else {
          // Delete if everything is okay
          client.query('DELETE FROM reviews WHERE id = $1 RETURNING*', [req.params.sessionid]).then(() => {
            res.status(200).json({
              status: 200,
              message: 'Review successfully deleted',
            });
          });
        }
      });
    }
  });
});

export default router;
