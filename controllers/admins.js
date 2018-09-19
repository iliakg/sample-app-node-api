const Admin = require('../models/Admin')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function(req, res) {
  try {
    const admins = await Admin.find({})
    res.status(200).json(admins)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.getById = async function(req, res) {
  try {
    const admin = await Admin.findById(req.params.id)
    res.status(200).json(admin)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function(req, res) {
  const admin = new Admin({
    name: req.body.name,
    email: req.body.email
  })

  try {
    await admin.save()
    res.status(201).json(admin)
  } catch (e) {
    errorHandler(res, e)
  }


  // const candidate = await Admin.findOne({email: req.body.email})
  //
  // if (candidate) {
  //   res.status(422).json({
  //     message: 'Email уже занят.'
  //   })
  // } else {
  //   const salt = bcrypt.genSaltSync(10)
  //   const password = req.body.password
  //   const admin = new Admin({
  //     email: req.body.email,
  //     password: bcrypt.hashSync(password, salt)
  //   })
  //
  //   try {
  //     await admin.save()
  //     res.status(201).json(admin)
  //   } catch(e) {
  //     errorHandler(res, e)
  //   }
  // }

}

module.exports.update = async function(req, res) {
  const updated = {
    name: req.body.name,
    email: req.body.email
  }

  try {
    const admin = await Admin.findOneAndUpdate(
      {_id: req.params.id},
      {$set: updated},
      {new: true}
    )
    res.status(200).json(admin)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.remove = async function(req, res) {
  try {
    await Admin.remove({_id: req.params.id})
    res.status(200).json({
      message: 'Админ удален.'
    })
  } catch (e) {
    errorHandler(res, e)
  }
}
