import supertest from "supertest";
import { config } from './config'
import user from './user'
jest.setTimeout(10000);

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
      console.log(res.body.userID)
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
      console.log(res.body)
      console.log(res.status)
      expect(res.status).toEqual(200);
    })

    test('Удаление пользователя', async () => {
      const payload = { "userName" : user.randomUserName(), "password": `${config.defaultPassword}` }
      const cr = await user.create(payload)
      const auth = await user.authorize(payload)
      const del = await user.delete(cr.body.userID, auth.body.token)
      expect(del.status).toEqual(200);
    })

    test('Получение информации о пользователе', async () => {
      const payload = { "userName" : user.randomUserName(), "password": `${config.defaultPassword}` }
      const cr = await user.create(payload)
      const info = await user.get(cr.body.userID, cr.body.token)
      expect(info.status).toEqual(200);
    })
  })
})

describe('Books', () => {
  describe('create/edit/delete book', () => {
    let createUser;
    let genToken;
    // eslint-disable-next-line no-unused-vars
    let authUser;

    beforeEach(async () => {
      createUser = await user.create({ "userName" : user.randomUserName(), "password": `${config.defaultPassword}` })
      genToken = await user.generateToken({ "userName" : createUser.body.username, "password": `${config.defaultPassword}` })
      authUser = await user.authorize({ "userName" : createUser.body.username, "password": `${config.defaultPassword}` })
    })

    test('Создание книги', async () => {
      const bookData = {
        "userId": createUser.body.userID,
        "collectionOfIsbns": [
          {
            "isbn": "9781449331818"
          }
        ],
      };
      const book = await user.createBook(genToken.body.token, bookData)
      console.log('Книга', book.body)
      console.log('юзер', createUser.body)
      expect(book.status).toEqual(201);
    });
    test('Обновление книги', async () => {
      const bookData = {
        "userId": createUser.body.userID,
        "collectionOfIsbns": [
          {
            "isbn": "9781449331818"
          }
        ],
      };
      // eslint-disable-next-line no-unused-vars
      const book = await user.createBook(genToken.body.token, bookData)
      const updatedBookData = {
        "userId": createUser.body.userID,
        "collectionOfIsbns": [
          {
            "isbn": "9781449331819"
          }
        ],
      };
      const responseUpdate = await supertest(config.url)
        .put('/BookStore/v1/Books/Book?ISBN=9781449331818')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${genToken.body.token}`)
        .send(updatedBookData);
      expect(responseUpdate.status).toEqual(200);
    });
    test('Получении информации о книге', async () => {
      const bookData = {
        "userId": createUser.body.userID,
        "collectionOfIsbns": [
          {
            "isbn": "9781449331818"
          }
        ],
      };
      // eslint-disable-next-line no-unused-vars
      const book = await user.createBook(genToken.body.token, bookData)
      const responseGet = await user.getBook(bookData.collectionOfIsbns[0].isbn, genToken.body.token)
      expect(responseGet.status).toEqual(200);
    });
    test('Удаление книги', async () => {
      const bookData = {
        "userId": createUser.body.userID,
        "collectionOfIsbns": [
          {
            "isbn": "9781449331818"
          }
        ],
      };
      // eslint-disable-next-line no-unused-vars
      const book = await user.createBook(genToken.body.token, bookData)
      const bookDataDelete = {
        "isbn": "9781449331818",
        "userId": createUser.body.userID
      }
      const responseDelete = await supertest(config.url)
        .delete(`/BookStore/v1/Book/`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${genToken.body.token}`)
        .send(bookDataDelete)

      expect(responseDelete.status).toEqual(204);
      const responseCheck = await user.getBook(bookData.collectionOfIsbns[0].isbn, genToken.body.token)
      expect(responseCheck.status).toEqual(404);

    });
  });
});
