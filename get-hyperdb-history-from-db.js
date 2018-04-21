const hyperdb = require('hyperdb')
const hyperdrive = require('hyperdrive')
const to2 = require('to2')

const db = hyperdb('./db')

let i = 0
const history = db.createHistoryStream()
history.pipe(to2.obj((data, enc, cb) => {
  console.log(i + ' history:')
  console.log(data)
  console.log()

  console.log(i + ' hyperdb list:')
  const checkout = db.checkout([data])
  checkout.list((err, list) => {
    if (err) throw err
    console.log(list)
    console.log()

    console.log(i + ' hyperdrive readdir "/":')
    const archive = hyperdrive('./db', {checkout})
    archive.readdir('/', (err, listDir) => {
      if (err) throw err
      console.log(listDir)

      console.log()
      console.log()
      i++
      cb()
    })
  })
}))

