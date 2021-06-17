'use strict'

const express = require('express');
const { sha512 } = require('js-sha512');
const router = express.Router()
const config = require('../modules/config')
const authMiddleware = require('../modules/authenticator')
const onlyRegisteredAccess = authMiddleware(true, ['user', 'admin'])
const onlyAdminAccess = authMiddleware(true, ['admin'])

const userModel = require('../models/UserModel')
const projectModel = require('../models/ProjectModel')

router.route('/users')
  .get(onlyAdminAccess, async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50

      let userList = await userModel.find().sort({ nickname: 'ASC'}).limit(limit).exec()
      //procesar los datos que devolveré para quitar datos sensibles
      userList = userList.map((user) => {
        user = user.toJSON()
        delete user.password

        return user
      })

      res.json(userList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  .post(async (req, res) => {
    let userData = req.body
    try {

      if(userData.nick == null || userData.password == null ||  userData.email == null){
        res.status(400)
      }

      userData.profile = "user"
      userData.password = sha512(userData.password)

      userData = await new userModel(userData).save()
      userData = userData.toJSON()
      delete userData.password

      res.status(201).json(userData)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }

 })

router.route('/users/:userId')
  .get(onlyRegisteredAccess, async (req, res) => {
    try {
      const userId = req.params.userId

      if(userId !== req.tokenData._id && req.tokenData.profile === 'user'){
        res.status(404).json({ message: `Usuario con identificador ${userId} no encontrado.` })
        return
      }

      let foundUser = await userModel.findById(userId).exec()

      if (!foundUser) {
        res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` })
        return
      }
      foundUser = foundUser.toJSON()
      delete foundUser.password

      res.json(foundUser)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  .put(onlyRegisteredAccess, async(req, res) => {
    try {
      const userId = req.params.userId
      const userData = req.body

      if(userId !== req.tokenData._id && req.tokenData.profile === 'user'){
        res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` })
        return
      }

      let updatedItem = await userModel.findOneAndUpdate({ _id: userId }, userData, { new: true }).exec()

      if (!updatedItem) {
        res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` })
        return
      }

      updatedItem = updatedItem.toJSON()
      delete updatedItem.password

      res.json(updatedItem)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  .delete(onlyRegisteredAccess, async (req, res) => {
    try {
      const userId = req.params.userId

      if(userId !== req.tokenData._id && req.tokenData.profile === 'user'){
        res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` })
        return
      }

      let foundItem = await userModel.findOneAndDelete({ _id: userId }).exec()

      if (!foundItem) {
        res.status(404).json({ message: `Usuario con ID ${userId} no encontrado.` })
        return
      }

      res.status(204).json(null)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

router.route('/users/:userId/projects')
  .get( async (req, res) => {

    })

router.route('/me/projects')
  .put(onlyRegisteredAccess, async (req, res) => {
    const userId= req.params.userId
    const projectsId= req.params.projectsId
  })
  .get(onlyRegisteredAccess, async (req, res) => {
      try {

        const userId= req.tokenData._id    
        let findParams = {user_id: userId}
        console.log(findParams)
        const projectsList = await projectModel.find(findParams).sort({ title: 'ASC', artist: 'ASC'}).exec()
  
        res.json(projectsList)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    })

router.route('/me/profile')
  .put(onlyRegisteredAccess, async (req, res) => {
    const userId= req.params.userId
  })
  .get(onlyRegisteredAccess, async (req, res) => {
    try {

      const userProfile = await userModel.findById(req.tokenData._id).exec()
      
      res.json(userProfile)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

router.route('/me/ratings')
  .put(onlyRegisteredAccess, async (req, res) => {
    const userId= req.params.userId
    const ratingsId= req.params.ratingsId
  })

module.exports = router

