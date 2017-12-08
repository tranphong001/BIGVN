import Keyword from '../models/keyword';

export function getKeyword(req, res) {
  Keyword
    .find({ alias: { $regex: req.params.alias, $options: 'gi' } })
    .sort( 'alias' )
    .limit(10)
    .exec((err, keywords) => {
    if (err) {
      res.json({ keywords: [] });
    } else {
      const response = [];
      keywords.map((k, index) => {
        response.push({ id: index, name: k.title });
      });
      res.json({ keywords: response });
    }
  });
}
