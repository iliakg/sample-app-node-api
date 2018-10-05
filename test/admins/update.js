process.env.NODE_ENV = 'test'
const server = require('../../app')
const mongoose = require('mongoose')
const Admin = mongoose.model('admins')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sessionHelper = require('../helpers/sessions')
const expect = chai.expect
chai.use(chaiHttp)

describe('Admins', () => {
  let token
  let admin

  beforeEach(async () => {
    token = await sessionHelper.login(server)
    admin = await Admin.create({email: 'test1@gmail.com', password: '123456', name: 'test name'})
  })

  afterEach(() => Admin.deleteMany({}))

  describe('/PUT admin', async () => {
    it('it should update admin data', async () => {
      let res = await chai.request(server)
        .put(`/api/admins/${admin._id}`)
        .set('Authorization', token)
        .send({
          email: 'test2@gmail.com',
          name: 'name name'
        })

      expect(res.status).to.equal(204)
      expect(res.body).to.be.empty

      const dbAdmin = await Admin.findById(admin._id)
      expect(dbAdmin.email).to.equal('test2@gmail.com')
      expect(dbAdmin.name).to.equal('name name')
      expect(dbAdmin.password).to.equal('filtered')
      expect(dbAdmin.encrypted_password).to.equal(admin.encrypted_password)
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should update admin password', async () => {
      let res = await chai.request(server)
        .put(`/api/admins/${admin._id}`)
        .set('Authorization', token)
        .send({password: '123456'})

      expect(res.status).to.equal(204)
      expect(res.body).to.be.empty

      const dbAdmin = await Admin.findById(admin._id)
      expect(dbAdmin.email).to.equal(admin.email)
      expect(dbAdmin.name).to.equal(admin.name)
      expect(dbAdmin.password).to.equal('filtered')
      expect(dbAdmin.encrypted_password).to.not.equal(admin.encrypted_password)
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .put(`/api/admins/${admin._id}`)
        .set('Authorization', token)

      expect(res.status).to.equal(204)
      expect(res.body).to.be.empty

      const dbAdmin = await Admin.findById(admin._id)
      expect(dbAdmin.email).to.equal(admin.email)
      expect(dbAdmin.name).to.equal(admin.name)
      expect(dbAdmin.password).to.equal('filtered')
      expect(dbAdmin.encrypted_password).to.equal(admin.encrypted_password)
      expect(await Admin.countDocuments()).to.equal(2)
    })
  })

  describe('/PUT admin with not valid params', async () => {
    it('it should return error if user not authorized', async () => {
      let res = await chai.request(server).put(`/api/admins/${admin._id}`)

      expect(res.status).to.equal(401)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .put(`/api/admins/${admin._id}`)
        .set('Authorization', token)
        .send({email: 'test@gmail.com'})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'email', message: 'Такой email уже есть в системе'})
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .put(`/api/admins/${admin._id}`)
        .set('Authorization', token)
        .send({email: 'testgmailcom'})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'email', message: 'Не верный формат Email'})
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .put(`/api/admins/${admin._id}`)
        .set('Authorization', token)
        .send({password: '12345', name: '123'})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'password', message: 'Пароль должен быть больше 6 символов'})
      expect(res.body).to.deep.include({path: 'name', message: 'Имя должно быть больше 4 символов'})
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .put(`/api/admins/${admin._id}`)
        .set('Authorization', token)
        .send({password: 'a'.repeat(51), name: 'a'.repeat(51)})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'password', message: 'Пароль должен быть меньше 50 символов'})
      expect(res.body).to.deep.include({path: 'name', message: 'Имя должно быть меньше 50 символов'})
      expect(await Admin.countDocuments()).to.equal(2)
    })
  })
})
