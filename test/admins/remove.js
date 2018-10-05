process.env.NODE_ENV = 'test'
const server = require('../../app')
const mongoose = require("mongoose")
const Admin = mongoose.model('admins')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sessionHelper = require('../helpers/sessions')
const expect = chai.expect
chai.use(chaiHttp)

describe('Admins', () => {
  let admin;

  beforeEach(async () => {
    admin = await Admin.create({email: 'test1@gmail.com', password: '123456', name: 'test name'})
  })

  afterEach(async () => await Admin.deleteMany({}))

  describe('/DELETE admin', async () => {
    it('it should return error if user not authorized', async () => {
      let res = await chai.request(server).delete(`/api/admins/${admin._id}`)

      expect(res.status).to.equal(401)
      expect(await Admin.countDocuments()).to.equal(1)
    })

    it('it should return error if admin not exist', async () => {
      let token = await sessionHelper.login(server)
      let res = await chai.request(server)
        .delete('/api/admins/51c35e5ced18cb901d000000')
        .set('Authorization', token)

      expect(res.status).to.equal(404)
      expect(res.body).to.deep.include({ path: 'not_found', message: 'Админ не найден' })
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error if admin id is not', async () => {
      let token = await sessionHelper.login(server)
      let res = await chai.request(server)
        .delete('/api/admins/hehehe')
        .set('Authorization', token)

      expect(res.status).to.equal(500)
      expect(res.body).to.deep.include({ path: 'critical', message: 'Cast to ObjectId failed for value "hehehe" at path "_id" for model "admins"' })
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should DELETE one admin', async () => {
      let token = await sessionHelper.login(server)
      let res = await chai.request(server)
        .delete(`/api/admins/${admin._id}`)
        .set('Authorization', token)

      expect(res.status).to.equal(200)
      expect(res.body.message).to.equal('Админ удален.')
      expect(await Admin.countDocuments()).to.equal(1)
    })
  })
})
