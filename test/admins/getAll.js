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
  beforeEach(() => {
    const array = [
      {email: 'test1@gmail.com', password: '123456'},
      {email: 'test2@gmail.com', password: '123456'},
      {email: 'test3@gmail.com', password: '123456'},
      {email: 'test4@gmail.com', password: '123456'},
      {email: 'test5@gmail.com', password: '123456'}
    ]
    Admin.insertMany(array)
  })
  afterEach(async () => await Admin.deleteMany({}))

  describe('/GET admins', async () => {
    it('it should GET error if user not authorized', async () => {
      let res = await chai.request(server).get('/api/admins')

      expect(res.status).to.equal(401)
    })

    it('it should GET all admins', async () => {
      let token = await sessionHelper.login(server)
      let res = await chai.request(server).get('/api/admins').set('Authorization', token)

      expect(res.status).to.equal(200)
      expect(res.body.length).to.equal(6)
    })
  })
})
