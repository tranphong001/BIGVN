import City from '../models/city';

export function createCity(req, res) {
  const reqCity = req.body.city;
  if (reqCity &&
    reqCity.hasOwnProperty('name')
  ) {
    const city = new City({
      name: reqCity.name
    });
    city.save((err) => {
      if (err) {
        res.json({ city: 'error' });
      } else {
        res.json({ city: 'success' });
      }
    });
  } else {
    res.json({ city: 'missing' });
  }
}
export function getCities(req, res) {
  City.find({ disable: false }).exec((err, cities) => {
    if (err) {
      res.json({ cities: [] });
    } else {
      res.json({ cities });
    }
  });
}
