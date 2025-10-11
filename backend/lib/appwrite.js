const { Client, Account, Users } = require('node-appwrite');

const client = new Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const account = new Account(client);
const users = new Users(client);

module.exports = {
    client,
    account,
    users
};