'use strict'

const express = require('express');
const router = express.Router()
const config = require('../modules/config')

const authMiddleware = require('../modules/authenticator')
const onlyRegisteredAccess = authMiddleware(true, ['user', 'admin'])

const projectModel = require('../models/ProjectModel')
const userModel = require('../models/UserModel')


router.route('/projects')
  .get(async (req, res) => {
    try {
      let findParams = {}

      const projectsList = await projectModel.find(findParams).sort({ title: 'ASC', artist: 'ASC'}).exec()

      res.json(projectsList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  .post(onlyRegisteredAccess, async (req, res) => {
    const foundUser = await userModel.findOne({ _id: req.tokenData._id, enabled: true }).exec()

    if (!foundUser) {
      res.status(404).json({ message: `Usuario con id ${orderData.user} no encontrado.` })
      return
    }

    try {
      let newProject = req.body.newProject
      newProject.user_id = req.tokenData._id;
      console.log(newProject)
      newProject = await new projectModel(newProject).save()

      res.status(201).json(newProject)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

router.route('/projects/:projectId')
  .get(async (req, res) => {
    try {
      const projectId = req.params.projectId

      let foundProject = await projectModel.findById(projectId).exec()

      if (!foundProject) {
        res.status(404).json({ message: `Trabajo con ID ${projectId} no encontrado.` })
        return
      }
      foundProject = foundProject.toJSON()
      delete foundProject.password

      res.json(foundProject)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })


  .put(onlyRegisteredAccess, async (req, res) => {
    try {
      const projectId = req.params.projectId

      if(projectId !== req.tokenData._id && req.tokenData.profile === 'project'){
        res.status(404).json({ message: `Trabajo con identificador ${projectId} no encontrado.` })
        return
      }

      let updatedProject = await projectModel.findOneAndUpdate({ title: 'ASC', artist: 'ASC', image: 'ASC', year: 'ASC', country: 'ASC', songs: 'ASC', label: 'ASC', collabs: 'ASC', producer: 'ASC', recorded: 'ASC', mixed: 'ASC', master: 'ASC', genres: 'ASC', tags: 'ASC' }).exec()

      if (!updatedProject) {
        res.status(404).json({ message: `Trabajo con identificador ${projectId} no encontrado.` })
        return
      }

      updatedProject = updatedProject.toJSON()

      res.json(updatedProject)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .delete(onlyRegisteredAccess, async (req, res) => {
    try {
      const projectId = req.params.projectId

      if(projectId !== req.tokenData._id && req.tokenData.profile === 'project'){
        res.status(404).json({ message: `Trabajo con identificador ${projectId} no encontrado.` })
        return
      }

      let foundProject = await projectModel.findOneAndDelete({ _id: projectId }).exec()

      if (!foundProject) {
        res.status(404).json({ message: `Trabajo con identificador ${projectId} no encontrado.` })
        return
      }

      res.status(204).json(null)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

module.exports = router
