/* eslint-disable no-trailing-spaces */
import express from 'express';
import jwt from 'jsonwebtoken';
import client from '../../config/config';
import verifyToken from '../../middleware/verifyToken';


const router = express.Router();

router.get('/mentors/:id', verifyToken, (req, res) => {
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
    // users are allowed to access this route
    } else {
      client.query(user).then((results) => {
        if (loggedUser.userIn.user_type === '2') {
          res.status(403).json({
            status: 403,
            error: 'You are not allowed to access this route',
          });
        // verify if ID exists   
        } else if (results.rows === 'undefined' || results.rows.length === 0) {
          res.status(404).json({
            status: 404,
            error: 'Mentor with the given ID does not exists',
          });
        // verify if the existed ID is mentors ID  
        } else if (results.rows[0].user_type !== '2') {
          res.status(400).json({
            status: 400,
            error: 'The Given ID is not for a mentor ',
          });
        // display specific mentor  
        } else {
          res.status(200).json({
            status: 200,
            data: {
              Mentor: {
                id: results.rows[0].id, 
                firstName: results.rows[0].first_name,
                lastName: results.rows[0].last_name,
                email: results.rows[0].email,
                address: results.rows[0].address,
                bio: results.rows[0].bio,
                occupation: results.rows[0].occupation,
                expertise: results.rows[0].expertise,
              },
            },
          });
        }
      });
    }
  });
});

export default router;
