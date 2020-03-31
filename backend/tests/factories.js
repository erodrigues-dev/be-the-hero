const faker = require('faker')

faker.locale = 'pt_BR'

module.exports = {
    createONG(){
        return {
            name: faker.name.findName(),
            email: faker.internet.email(),
            whatsapp: faker.phone.phoneNumber(),
            city: faker.address.city(),
            uf: faker.address.stateAbbr()
        }
    },

    createIncident(){
        return {
            title: faker.lorem.words(4),
            description: faker.lorem.sentences(2),
            value: faker.random.number(),
        }
    }
}