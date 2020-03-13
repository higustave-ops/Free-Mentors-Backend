/* eslint-disable no-trailing-spaces */
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../../middleware/verifyToken';
import client from '../../config/config';


const router = express.Router();

// eslint-disable-next-line no-use-before-define
router.patch('/user/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.AUTH_KEY, (err, loggedUser) => {
    // eslint-disable-next-line radix
    const user = {
      text: 'SELECT * FROM  users WHERE id = $1',
      values: [req.params.id],
    };

    if (err) {
      res.status(403).json({
        status: 403,
        error: 'Forbidden',
      });
    } else {
      client.query(user, (error, results) => {
        // prevent user who is not an admin to access the route
        if (loggedUser.userIn.user_type !== '1') {
          res.status(403).json({
            status: 403,
            error: 'You are not allowed to access this route',
          });
        // verify if ID exists   
        } else if (results.rows === 'undefined' || results.rows.length === 0) {
          res.status(404).json({
            status: 404,
            error: 'No User found',
          });
        // verify admin to be changed as mentor  
        } else if (results.rows[0].user_type === '1') {
          res.status(403).json({
            status: 403,
            error: 'Admin can not be changed to mentor',
          });
        // verify if user already changed as mentors  
        } else if (results.rows[0].user_type === '2') {
          res.status(409).json({
            status: 409,
            error: 'User already changed to mentor',
          });
        // if everything is good update the user  
        } else {
          client.query('UPDATE users SET user_type = 2 WHERE id = $1 RETURNING*', [req.params.id], (fail, type) => {
            res.status(200).json({
              status: 200,
              message: 'User account changed to mentor',
              data: {
                Mentor: {
                  id: type.rows[0].id, 
                  firstName: type.rows[0].first_name,
                  lastName: type.rows[0].last_name,
                  email: type.rows[0].email,
                  address: type.rows[0].address,
                },
              },
            });
          });
        }
      });
    }
  });
});

export default router;
