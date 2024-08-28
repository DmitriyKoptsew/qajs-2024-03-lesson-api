import supertest from "supertest";
import { config } from './config'
import user from './user'


describe('User', () => {
  describe('POST /Account/v1/User', () => {
    test('Метод должен существовать', async () => {
      const res = await supertest(config.url)
        .post('/Account/v1/User')
        .send({})

      expect(res.status).not.toEqual(404);
    })

    test('Создание нового пользователя парой userName и password', async () => {
      const res = await user.create({ "userName" : user.randomUserName(), "password": `${config.defaultPassword}` })
      //console.log(res.body.userID)
      expect(res.status).toEqual(201);
      expect(typeof res.body.userID).toEqual('string')
      expect(typeof res.body.username).toEqual('string')
    })

    test('Создание пользователя с уже созданной парой с userName и password', async () => {
      const payload = { "userName" : user.randomUserName(), "password": `${config.defaultPassword}` }

      // шаг с созданием дубликата-юзера до
      await user.create(payload)

      const res = await user.create(payload)

      expect(res.status).toEqual(406);
      expect(res.body.code).toEqual('1204')
      expect(res.body.message).toEqual('User exists!')
    })

    test('Авторизация', async () => {
      const payload = { "userName" : user.randomUserName(), "password": `${config.defaultPassword}` }
      await user.create(payload)
      const res = await user.authorize(payload)
      expect(res.status).toEqual(200);
    })

    test('Удаление пользователя', async () => {
      const payload = { "userName" : user.randomUserName(), "password": `${config.defaultPassword}` }
      const cr = await user.create(payload)
      const res = await user.authorize(payload)
      const del = await user.delete(cr.body.userID)
      expect(del.status).toEqual(200);
    })

    test('Получение информации о пользователе', async () => {
      const payload = { "userName" : user.randomUserName(), "password": `${config.defaultPassword}` }
      const cr = await user.create(payload)
      const info = await user.get(cr.body.userID)
      expect(info.status).toEqual(200);
    })
  })
})
