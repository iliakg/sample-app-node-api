const Admin = require('../models/Admin')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
  try {
    const admins = await Admin.find({})
    res.status(200).json(admins)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.getById = async function (req, res) {
  try {
    const admin = await Admin.findById(req.params.id)
    res.status(200).json(admin)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function (req, res) {
  const admin = new Admin(adminParams(req.body))

  try {
    await admin.save()
    res.status(201).json(admin)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function (req, res) {
  try {
    const admin = await Admin.findOneAndUpdate(
      {_id: req.params.id},
      adminParams(req.body),
      {new: true, context: 'query'} // for unique validation
    )
    res.status(200).json(admin)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.remove = async function (req, res) {
  try {
    await Admin.remove({_id: req.params.id})
    res.status(200).json({
      message: 'Админ удален.'
    })
  } catch (e) {
    errorHandler(res, e)
  }
}

function adminParams(reqBody) {
  return {
    name: reqBody.name,
    email: reqBody.email,
    password: reqBody.password
  }
}
