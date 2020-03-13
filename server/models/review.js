import client from '../config/config';

const review1 = `
  INSERT INTO reviews (reqsession_id, menteeid, score, remark) VALUES ('1', '2', '4', 'Keep working');
`;

const review2 = `
  INSERT INTO reviews (reqsession_id, menteeid, score, remark) VALUES ('3', '2', '4', 'Keep working');
`;

const review3 = `
  INSERT INTO reviews (reqsession_id, menteeid, score, remark) VALUES ('2', '2', '4', 'Keep working');
`;

const reviewsQueries = `
  ${review1} 
  ${review2}
  ${review3}
`;

(async () => {
  try {
    await client.query(reviewsQueries);
  } catch (err) {
    console.log(err);
  }
})();
