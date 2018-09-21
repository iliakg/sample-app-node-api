const express = require('express')
const passport = require('passport')
const controller = require('../controllers/admins')
const router = express.Router()

const pass = passport.authenticate('jwt', {session: false})

router.get('/', pass, controller.getAll)
router.get('/:id', pass, controller.getById)
router.post('/', pass, controller.create)
router.put('/:id', pass, controller.update)
router.delete('/:id', pass, controller.remove)

module.exports = router
