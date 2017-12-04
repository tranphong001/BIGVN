import District from '../models/district';
import mongoose from 'mongoose';

export function createDistrict(req, res) {
  const reqDistrict =  req.body.district;
  if (reqDistrict &&
    reqDistrict.hasOwnProperty('name') &&
    reqDistrict.hasOwnProperty('city')
  ) {
    const district = new District({
      city: reqDistrict.city,
      name: reqDistrict.name,
    });
    district.save((err) => {
      if (err) {
        res.json({ district: 'error' });
      } else {
        res.json({ district: 'success' });
      }
    });
  } else {
    res.json({ district: 'missing' });
  }
}

export function getDistricts(req, res) {
  if (req.params.cityId) {
    District.find({ city: mongoose.Types.ObjectId(req.params.cityId),  disable: false  }).exec((err, districts) => {
      if (err) {
        res.json({ districts: [] });
      } else {
        res.json({ districts });
      }
    });
  } else {
    res.json({ districts: [] });
  }
}
