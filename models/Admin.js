const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')

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
    unique: true
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

module.exports = mongoose.model('admins', adminSchema)
