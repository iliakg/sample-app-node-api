const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
  const candidate = await Admin.findOne({email: req.body.email})

  if (candidate) {
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.encrypted_password)
    if (passwordResult) {
      const token = jwt.sign({
        email: candidate.email,
        adminId: candidate._id
      }, keys.jwt, {expiresIn: 60 * 60 * 24})

      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'Ошибка авторизации'
      })
    }
  } else {
    res.status(401).json({
      message: 'Ошибка авторизации'
    })
  }
}

module.exports.register = async function(req, res) {
  const candidate = await Admin.findOne({email: req.body.email})

  if (candidate) {
    res.status(422).json({
      message: 'Email уже занят.'
    })
  } else {
    const admin = new Admin({
      email: req.body.email,
      password: req.body.password
    })

    try {
      await admin.save()
      res.status(200).json({status: "ok"})
    } catch(e) {
      errorHandler(res, e)
    }
  }
}
