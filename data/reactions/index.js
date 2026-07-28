// data/reactions/index.js
//
// Barcha oilalarni bitta ro'yxatga yig'adi.
// Yangi oila qo'shilganda faqat shu ro'yxatga qatorini qo'shish yetarli.

const { oilaniYoy } = require('./_umumiy')

const OILALAR = [
  require('./kislota-asos'),
  require('./metall-kislota'),
  require('./chokma'),
  require('./redoks'),
  require('./sanoat'),
  require('./termik-parchalanish'),
  require('./galogen-va-oksidlar'),
  require('./kompleks'),
  require('./organik-uglevodorod'),
  require('./organik-funksional'),
  require('./biokimyo'),
  require('./sifat-reaksiyalar'),
]

/** @returns {object[]} barcha reaksiyalar, umumiy maydonlar yoyilgan holda */
function barchaReaksiyalar() {
  return OILALAR.flatMap(oilaniYoy)
}

module.exports = { OILALAR, barchaReaksiyalar }
