import Banner from '../models/banner';
import fs from 'fs';
import cuid from 'cuid';

export function getBanner(req, res) {
  const string = (req.query.search && req.query.search !== '') ? req.query.search : '';
  const page = (req.query.page && req.query.page !== '') ? req.query.page : 0;
  Banner.find(
    {},
    { name: 1, _id: 1, dateCreated: 1, description: 1, imageDirectory: 1, link: 1 },
    { skip: 10 * page, limit: 10, sort: { dateCreated: -1 } }
  ).exec((err, banners) => {
    if (err) {
      res.json({ banners: [] });
    } else {
      res.json({ banners });
    }
  });
}
