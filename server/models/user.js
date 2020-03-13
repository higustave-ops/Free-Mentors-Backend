/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import client from '../config/config';

const saltRounds = 10;
const password = 'Rwanda123!';

const hashPass = bcrypt.hashSync(password, saltRounds);

const user1 = `
  INSERT INTO users (first_name, last_name, email, password, address, bio, occupation, expertise, user_type) VALUES ('AUGUSTIN', 'NTAMBARA', 'augustin@gmail.com', '${hashPass}', 'USA NEW YORK', 'Leadership', 'CTO at Google', 'SCRUM', 'admin');
`;
const usersQueries = `
  ${user1} 
`;


(async () => {
  try {
    await client.query(usersQueries);
  } catch (err) {
    console.log(err);
  }
})();
