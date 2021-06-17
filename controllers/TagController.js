'use strict'

const express = require('express');
const router = express.Router()
const config = require('../modules/config')

const tagModel = require('../models/TagModel')

router.route('/tags')
  .get(async (req, res) => {
    try {
      let findParams = {}

      const tagsList = await tagModel.find(findParams).sort({ id: 'ASC', genre_id: 'ASC', name: 'ASC' }).exec()

      res.json(tagsList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

module.exports = router
