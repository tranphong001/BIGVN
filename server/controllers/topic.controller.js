import Topic from '../models/topic';
// import KhongDau from 'khong-dau';
export function getTopics(req, res) {
  Topic.find({ disable: false }).exec((err, topics) => {
    if (err) {
      res.json({ topics: [] });
    } else {
      res.json({ topics });
    }
  });
}
