const hyperdrive = require('hyperdrive')

const archive = hyperdrive('./db')
archive.readdir('/', (err, list) => {
  if (err) throw err
  console.log('Dir /', list)
})
