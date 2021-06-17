'use strict'

const express = require('express')
const { sha512 } = require('js-sha512')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../modules/config')

const userModel = require('../models/UserModel')

router.route('/auth/login')
  .post(async (req, res) => {
    const credentials = req.body

    credentials.password = sha512(credentials.password)

    const foundUser = await userModel.findOne({email: credentials.email, password: credentials.password, enabled: true})

    console.log(foundUser)
    if(!foundUser){
      res.status(401).json({message: 'Usuario y/o contraseña no válidos.'})
      return
    }

    //creación del payload enviado en el token
    let payload = {
      _id: foundUser._id,
      nick: foundUser.nick,
      email: foundUser.email,
      profile: foundUser.profile
    }

    let token = await jwt.sign(payload, config.APP_SECRET, {
      expiresIn: "30 days"
    })

    res.json({token: token})
  })

router.route('/auth/forggotten-password')
  .post((req, res) => {
    res.json({})
  })

module.exports = router
