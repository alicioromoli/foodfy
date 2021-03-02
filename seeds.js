const User = require('./src/app/models/admin/Users')
const faker = require('faker')
const { hash } = require('bcryptjs')

let userIds = []

async function createUser(){

    let users = []
    const passwordHash = await hash('123', 8)

    while(users.length < 4){
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: passwordHash
        })
    }

    const usersPromise = users.map(user => User.create(user))
    userIds = Promise.all(usersPromise)
}

createUser()