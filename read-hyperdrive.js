const hyperdrive = require('hyperdrive')

const archive = hyperdrive('./db')
archive.ready(() => {
  archive.readdir('/', (err, list) => {
    if (err) throw err
    console.log('Dir /', list)
    archive.readdir('/shopping-list', (err, list) => {
      if (err) throw err
      console.log('Dir /shopping-list', list)
    })
  })
})
