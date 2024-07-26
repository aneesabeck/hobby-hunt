const cron = require('node-cron');
const setTools = require('./setTools')

const job = cron.schedule('0 0 */5 * *', async () => {
  try {
    await setTools()
    console.log('Hobbies fetched for job')
  } catch (error) {
    console.log(error)
  }
});

module.exports = job