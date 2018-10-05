process.env.NODE_ENV = 'test'
const server = require('../../app')
const mongoose = require("mongoose")
const Admin = mongoose.model('admins')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
chai.use(chaiHttp)

describe('Register', () => {
  beforeEach(() => Admin.create({email: 'test@gmail.com', password: '123456'}))
  afterEach(() => Admin.deleteMany({}))

  describe('/POST register with valid params', () => {
    it('it should register', async () => {
      let res = await chai.request(server)
        .post('/api/auth/register')
        .send({email: 'newadmin@gmail.com', password: '123456'})

      expect(res.status).to.equal(200)
      expect(res.body.status).to.equal('ok')

      expect(await Admin.countDocuments()).to.equal(2)

      const admin = await Admin.findOne({email: 'newadmin@gmail.com'})
      expect(admin).to.be.an('object')
      expect(admin.password).to.equal('filtered')
    })
  })

  describe('/POST register with invalid params', () => {
    it('it should not register when not uniq email', async () => {
      let res = await chai.request(server)
        .post('/api/auth/register')
        .send({email: 'test@gmail.com', password: '123456'})

      expect(res.status).to.equal(422)
      expect(res.body.message).to.equal('Email уже занят.')

      expect(await Admin.countDocuments()).to.equal(1)
    })

    it('it should not register when not invalid email', async () => {
      let res = await chai.request(server)
        .post('/api/auth/register')
        .send({email: 'testgmail', password: '123456'})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'email', message: 'Не верный формат Email'})
      expect(await Admin.countDocuments()).to.equal(1)
    })

    it('it should not register when password too short', async () => {
      let res = await chai.request(server)
        .post('/api/auth/register')
        .send({email: 'newadmin@gmail.com', password: '12345'})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'password', message: 'Пароль должен быть больше 6 символов'})
      expect(await Admin.countDocuments()).to.equal(1)
    })

    it('it should not register when password too long', async () => {
      let res = await chai.request(server)
        .post('/api/auth/register')
        .send({email: 'newadmin@gmail.com', password: "a".repeat(51)})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'password', message: 'Пароль должен быть меньше 50 символов'})
      expect(await Admin.countDocuments()).to.equal(1)
    })

    it('it should not register with empty body', async () => {
      let res = await chai.request(server).post('/api/auth/register')

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'email', message: 'Email не может быть пустым'})
      expect(res.body).to.deep.include({path: 'password', message: 'Пароль не может быть пустым'})
      expect(await Admin.countDocuments()).to.equal(1)
    })
  })
})
