const hyperdb = require('hyperdrive/node_modules/hyperdb')
const hyperdrive = require('hyperdrive')
const to2 = require('to2')

const db = hyperdb('./db')

let i = 0
const history = db.createHistoryStream()
history.pipe(to2.obj(
  (data, enc, cb) => {
    console.log(i + ' history:')
    console.log(data)
    console.log()

    console.log(i + ' hyperdb list:')
    const checkout = db.checkout([data])
    dump(i, checkout, () => {
      console.log()
      i++
      cb()
    })
  },
  () => {
    console.log('Heads:')
    db.heads((err, heads) => {
      if (err) throw err
      console.log(heads)
      console.log()
      dump('head', db, () => {
        console.log('Done.')
      })
    })
  }
))

function dump (title, checkout, cb) {
  checkout.version((err, version) => {
    if (err) throw err
    console.log(title + ' version:', version.toString('hex'))

    console.log(title + ' list:')
    checkout.list((err, list) => {
      if (err) throw err
      console.log(list)
      console.log()

      console.log(title + ' list "/":')
      checkout.list('', {gt: true, recursive: false}, (err, list) => {
        if (err) throw err
        console.log(list)
        console.log()

        console.log(title + ' hyperdrive readdir "/":')
        const archive = hyperdrive('./db').checkout(version)
        archive.readdir('/', (err, listDir) => {
          if (err) throw err
          console.log(listDir)
          console.log()

          console.log(i + ' hyperdrive readdir "/shopping-list":')
          archive.readdir('/shopping-list', (err, listDir) => {
            if (err) throw err
            console.log(listDir)
            console.log()
            cb()
          })
        })
      })
    })
  })
}

