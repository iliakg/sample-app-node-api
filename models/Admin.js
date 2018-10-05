const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')

const validateEmail = function (email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [4, 'Имя должно быть больше 4 символов'],
    maxlength: [50, 'Имя должно быть меньше 50 символов']
  },
  email: {
    type: String,
    format: 'email',
    required: [true, 'Email не может быть пустым'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Не верный формат Email']
  },
  password: {
    type: String,
    required: [true, 'Пароль не может быть пустым'],
    minlength: [6, 'Пароль должен быть больше 6 символов'],
    maxlength: [50, 'Пароль должен быть меньше 50 символов']
  },
  encrypted_password: {
    type: String
  }
})

adminSchema.plugin(uniqueValidator, {
  message: 'Такой {PATH} уже есть в системе'
})

adminSchema.pre('save', function (next) {
  this.encrypted_password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
  this.password = 'filtered'
  next()
})

adminSchema.pre('findOneAndUpdate', function (next) {
  let password = this.getUpdate().password

  // password validation
  if (password && password.length >= 6 && password.length <= 50) {
    this._update.encrypted_password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    this._update.password = 'filtered'
  }

  if (!password) {
    this._update.password = 'filtered'
  }

  this.setOptions({runValidators: true})

  next()
})

module.exports = mongoose.model('admins', adminSchema)
