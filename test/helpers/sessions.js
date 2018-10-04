const chai = require('chai')
const Admin = require('../../models/Admin')

exports.login = async function (server) {
  let data = {email: 'test@gmail.com', password: '123456'}
  await Admin.create(data)

  let res = await chai.request(server).post('/api/auth/login').send(data)

  return res.body.token
}
