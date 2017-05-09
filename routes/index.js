const router = require('express').Router();

const db = require('../models');
const Hotel = db.model('hotel');
const Restaurant = db.model('restaurant');
const Activity = db.model('activity');
const Place = db.model('place');

router.get('/', function (req, res, next) {
  Promise.all([
    Hotel.findAll({ include: [ Place ] }),
    Restaurant.findAll({ include: [ Place ] }),
    Activity.findAll({ include: [ Place ] })
  ])
  .then(function (allThings) {
    const hotels = allThings[0];
    const restaurants = allThings[1];
    const activities = allThings[2];
    res.render('index', {
      hotels: hotels,
      restaurants: restaurants,
      activities: activities
    });
  })
  .catch(next);
});

module.exports = router;
