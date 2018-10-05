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

  describe('/POST admin', async () => {
    it('it should GET one admin', async () => {
      let res = await chai.request(server)
        .post('/api/admins')
        .set('Authorization', token)
        .send({
          email: 'test2@gmail.com',
          name: 'name name',
          password: '123456'
        })

      expect(res.status).to.equal(201)
      expect(res.body.email).to.equal('test2@gmail.com')
      expect(res.body.password).to.equal('filtered')
      expect(res.body.name).to.equal('name name')
      expect(await Admin.countDocuments()).to.equal(3)
    })
  })

  describe('/POST admin with not valid params', async () => {
    it('it should return error if user not authorized', async () => {
      let res = await chai.request(server).post('/api/admins')

      expect(res.status).to.equal(401)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .post('/api/admins')
        .set('Authorization', token)

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'email', message: 'Email не может быть пустым'})
      expect(res.body).to.deep.include({path: 'password', message: 'Пароль не может быть пустым'})
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .post('/api/admins')
        .set('Authorization', token)
        .send({email: 'test1@gmail.com'})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'email', message: 'Такой email уже есть в системе'})
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .post('/api/admins')
        .set('Authorization', token)
        .send({email: 'testgmailcom', password: '123456'})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'email', message: 'Не верный формат Email'})
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .post('/api/auth/register')
        .set('Authorization', token)
        .send({email: 'test2@gmail.com', password: '12345'})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'password', message: 'Пароль должен быть больше 6 символов'})
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .post('/api/auth/register')
        .set('Authorization', token)
        .send({email: 'test2@gmail.com', password: 'a'.repeat(51)})

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'password', message: 'Пароль должен быть меньше 50 символов'})
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .post('/api/admins')
        .set('Authorization', token)
        .send({
          email: 'test2@gmail.com',
          password: '123456',
          name: '123'
        })

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'name', message: 'Имя должно быть больше 4 символов'})
      expect(await Admin.countDocuments()).to.equal(2)
    })

    it('it should return error', async () => {
      let res = await chai.request(server)
        .post('/api/admins')
        .set('Authorization', token)
        .send({
          email: 'test2@gmail.com',
          password: '123456',
          name: 'a'.repeat(51)
        })

      expect(res.status).to.equal(422)
      expect(res.body).to.deep.include({path: 'name', message: 'Имя должно быть меньше 50 символов'})
      expect(await Admin.countDocuments()).to.equal(2)
    })
  })
})
