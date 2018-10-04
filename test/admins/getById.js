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
    admin = new Admin({email: 'test1@gmail.com', password: '123456', name: 'test name'})
    await admin.save()
  })

  afterEach(async () => await Admin.deleteMany({}))

  describe.only('/GET admin', async () => {
    it('it should GET error if user not authorized', async () => {
      let res = await chai.request(server).get(`/api/admins/${admin._id}`)

      expect(res.status).to.equal(401)
    })

    it('it should GET error if admin not exist', async () => {
      let token = await sessionHelper.login(server)
      let res = await chai.request(server)
        .get('/api/admins/51c35e5ced18cb901d000000')
        .set('Authorization', token)

      expect(res.status).to.equal(404)
      expect(res.body).to.deep.include({ path: 'not_found', message: 'Admin Not Found' })
    })

    it('it should GET error if admin id is not', async () => {
      let token = await sessionHelper.login(server)
      let res = await chai.request(server)
        .get('/api/admins/hehehe')
        .set('Authorization', token)

      expect(res.status).to.equal(500)
      expect(res.body).to.deep.include({ path: 'critical', message: 'Cast to ObjectId failed for value "hehehe" at path "_id" for model "admins"' })
    })

    it('it should GET one admin', async () => {
      let token = await sessionHelper.login(server)
      let res = await chai.request(server)
        .get(`/api/admins/${admin._id}`)
        .set('Authorization', token)

      expect(res.status).to.equal(200)
      expect(res.body.email).to.equal('test1@gmail.com')
      expect(res.body.name).to.equal('test name')
    })
  })
})
