/* eslint-disable no-console */
import client from '../config/config';

const tableUsers = `
  DROP TABLE IF EXISTS users CASCADE;
  DROP TYPE IF EXISTS user_role CASCADE;
  CREATE TYPE user_role AS ENUM ('admin','mentee','mentor');
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name character varying(250) NOT NULL,
    last_name character varying(250) NOT NULL,
    email character varying(250) NOT NULL,
    password character varying(250) NOT NULL,
    address character varying(250) NOT NULL,
    bio text NOT NULL,
    occupation character varying(250) NOT NULL,
    expertise character varying(250) NOT NULL,
    user_type user_role,
    token character varying(1500)
  );
`;

const tableRequestSession = `
  DROP TABLE IF EXISTS request_session CASCADE;
  CREATE TABLE request_session (
    id SERIAL PRIMARY KEY,
    mentorid integer NOT NULL,
    menteeid integer NOT NULL,
    questions character varying(250) NOT NULL,
    status character varying(30) NOT NULL DEFAULT 'pending'
  );  
`;

const tableReviews = `
  DROP TABLE IF EXISTS reviews CASCADE;
  CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reqsession_id integer NOT NULL,
    menteeid integer NOT NULL,
    score integer NOT NULL,
    remark character varying(250) NOT NULL
  );  
`;

const tableQueries = `
  ${tableUsers} 
  ${tableRequestSession} 
  ${tableReviews}
`;

(async () => {
  try {
    await client.query(tableQueries);
  } catch (err) {
    console.log(err);
  }
})();
