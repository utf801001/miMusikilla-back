'use strict'

const express = require('express')
const router = express.Router()

router.route('/')
  .get((req, res) => {
    const now = new Date()
    const indexMessage = `MiMusikilla v0.0.1, todos los derechos reservados ${now.getFullYear()}.`
    res.send(indexMessage)
  })

module.exports = router
