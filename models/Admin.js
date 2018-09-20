const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя не может быть пустым'],
    minlength: [4, 'Имя должно быть больше 4 символов'],
    maxlength: [50, 'Имя должно быть меньше 50 символов']
  },
  email: {
    type: String,
    format: 'email',
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
})

adminSchema.plugin(uniqueValidator, {
  message: 'Такой {PATH} уже есть в системе'
})

module.exports = mongoose.model('admins', adminSchema)
