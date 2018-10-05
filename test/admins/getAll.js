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
  beforeEach(async () => {
    const array = []
    for (let i = 0; i < 25; i++) array.push({email: `test${i}@gmail.com`, password: '123456'})
    await Admin.insertMany(array)
  })
  afterEach(() => Admin.deleteMany({}))

  describe('/GET admins', async () => {
    it('it should GET error if user not authorized', async () => {
      let res = await chai.request(server).get('/api/admins')

      expect(res.status).to.equal(401)
    })

    it('it should GET all admins', async () => {
      let token = await sessionHelper.login(server)
      let res = await chai.request(server).get('/api/admins').set('Authorization', token)

      expect(res.status).to.equal(200)
      expect(res.body.length).to.equal(26)
    })
  })
})
