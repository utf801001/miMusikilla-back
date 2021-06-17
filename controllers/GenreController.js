'use strict'

const express = require('express');
const router = express.Router()
const config = require('../modules/config')

const genreModel = require('../models/GenreModel')

router.route('/genres')
  .get(async (req, res) => {
    try {
      let findParams = {}

      const genresList = await genreModel.find(findParams).sort({ id: 'ASC', name: 'ASC' }).exec()

      res.json(genresList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

module.exports = router
