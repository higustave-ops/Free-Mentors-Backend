import client from '../config/config';

const session1 = `
  INSERT INTO request_session (mentorid, menteeid, questions) VALUES ('3', '2', 'How can I emprove?');
`;

const session2 = `
  INSERT INTO request_session (mentorid, menteeid, questions, status) VALUES ('3', '2', 'How can I emprove?', 'rejected');
`;

const session3 = `
  INSERT INTO request_session (mentorid, menteeid, questions, status) VALUES ('3', '2', 'How can I emprove?', 'accepted');
`;

const session4 = `
  INSERT INTO request_session (mentorid, menteeid, questions, status) VALUES ('5', '2', 'How can I emprove?', 'rejected');
`;

const session5 = `
  INSERT INTO request_session (mentorid, menteeid, questions, status) VALUES ('3', '2', 'How can I emprove?', 'accepted');
`;

const session6 = `
  INSERT INTO request_session (mentorid, menteeid, questions, status) VALUES ('3', '2', 'How can I emprove?', 'rejected');
`;

const session7 = `
  INSERT INTO request_session (mentorid, menteeid, questions) VALUES ('3', '2', 'How can I emprove?');
`;

const session8 = `
  INSERT INTO request_session (mentorid, menteeid, questions, status) VALUES ('3', '2', 'How can I emprove?', 'accepted');
`;

const session9 = `
  INSERT INTO request_session (mentorid, menteeid, questions) VALUES ('3', '4', 'How can I emprove?');
`;

const sessionsQueries = `
  ${session1} 
  ${session2}
  ${session3}
  ${session4}
  ${session5}
  ${session6}
  ${session7}
  ${session8}
  ${session9}
`;

(async () => {
  try {
    await client.query(sessionsQueries);
  } catch (err) {
    console.log(err);
  }
})();
