import Ward from '../models/ward';
import mongoose from 'mongoose';

export function createWard(req, res) {
  const reqWard =  req.body.ward;
  if (reqWard &&
    reqWard.hasOwnProperty('name') &&
    reqWard.hasOwnProperty('district')
  ) {
    const ward = new Ward({
      district: reqWard.district,
      name: reqWard.name,
    });
    ward.save((err) => {
      if (err) {
        res.json({ ward: 'error' });
      } else {
        res.json({ ward: 'success' });
      }
    });
  } else {
    res.json({ ward: 'missing' });
  }
}

export function getWards(req, res) {
  if (req.params.districtId) {
    Ward.find({ district: mongoose.Types.ObjectId(req.params.districtId), disable: false  }).exec((err, wards) => {
      if (err) {
        res.json({ wards: [] });
      } else {
        res.json({ wards });
      }
    });
  } else {
    res.json({ wards: [] });
  }
}
