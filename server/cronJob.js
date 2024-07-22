const cron = require('node-cron');
const setTools = require('./setTools')

const job = cron.schedule('* * * * *', async () => {
  try {
    await setTools()
    console.log('Hobbies fetched for job')
  } catch (error) {
    console.log(error)
  }
});

module.exports = job