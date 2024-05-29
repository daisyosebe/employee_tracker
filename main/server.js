const { Client } = require('pg');
const inquirer = require('inquirer');

const client = new Client({
  user: '',
  host: 'localhost',
  database: '',
  password: 'daisy',
  port: 3001,
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));
