const cron = require('node-cron');
const setTools = require('./setTools')

const job = cron.schedule('0 0 * * *', async () => {
  try {
    await setTools()
  } catch (error) {
    console.error(error)
  }
});

module.exports = job