import supertest from "supertest";
import { config } from './config'

const { faker } = require('@faker-js/faker');
const {url} = config

// контроллер user
const user = {
  // Функция авторизации
  create: (payload) => {
    return supertest(url)
      .post('/Account/v1/User')
      .set('Accept', 'application/json')
      .send(payload)
  },
  authorize: (payload) => {
    return supertest(url)
      .post('/Account/v1/Authorized')
      .set('Accept', 'application/json')
      .send(payload)
  },
  generateToken: (payload) => {
    return supertest(url)
      .post('/Account/v1/GenerateToken')
      .set('Accept', 'application/json')
      .send(payload)
  },
  createBook: (token, bookData) => {
    return supertest(url)
      .post('/BookStore/v1/Books')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(bookData);
  },
  getBook: (isbn, token) => {
    return supertest(url)
      .get(`/BookStore/v1/Book?ISBN=${isbn}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
  },

  delete: (uuid) => {
    return supertest(url)
      .delete(`/Account/v1/User/${uuid}`)
      .set('Accept', 'application/json')
      .send()
  },
  get: (uuid) => {
    return supertest(url)
      .get(`/Account/v1/User`)
      .set('Accept', 'application/json')
      .send()
  },

  randomUserName() {
    return `${faker.person.lastName()}-${faker.person.firstName()}`;
  },
}

export default user
