import Setting from '../models/setting';
import KhongDau from 'khong-dau';

export function getSettings(req, res) {
  Setting.find({ disable: false }).exec((err, settings) => {
    if(err) {
      res.json({ settings: [] });
    } else {
      res.json({ settings });
    }
  })
}
