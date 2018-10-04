process.env.NODE_ENV = 'test'
const server = require('../../app')
const mongoose = require("mongoose")
const Admin = mongoose.model('admins')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const JwtHelper = require('../helpers/jwt')
chai.use(chaiHttp)

describe('Login', () => {
  let admin;

  beforeEach(async () => {
    admin = new Admin({email: 'test@gmail.com', password: '123456'})
    await admin.save()
  })

  afterEach(async () => await Admin.deleteMany({}))

  describe('/POST login', () => {
    it('it should login', async () => {
      let res = await chai.request(server)
        .post('/api/auth/login')
        .send({email: 'test@gmail.com', password: '123456'})
      let payload = JwtHelper.encodeBearer(res.body.token)

      expect(res.status).to.equal(200)
      expect(payload.adminId).to.equal(admin._id.toString())
      expect(payload.email).to.equal(admin.email)
    })
  })

  describe('/POST login with invalid email', () => {
    it('it should not login and return error', async () => {
      let res = await chai.request(server)
        .post('/api/auth/login')
        .send({email: 'fail@gmail.com', password: '123456'})

      expect(res.status).to.equal(401)
      expect(res.body.message).to.equal('Ошибка авторизации')
    })
  })

  describe('/POST login with invalid password', () => {
    it('it should not login and return error', async () => {
      let res = await chai.request(server)
        .post('/api/auth/login')
        .send({email: 'test@gmail.com', password: '1234567'})

      expect(res.status).to.equal(401)
      expect(res.body.message).to.equal('Ошибка авторизации')
    })
  })

  describe('/POST login with empty body', () => {
    it('it should not login and return error', async () => {
      let res = await chai.request(server).post('/api/auth/login')

      expect(res.status).to.equal(401)
      expect(res.body.message).to.equal('Ошибка авторизации')
    })
  })
})
