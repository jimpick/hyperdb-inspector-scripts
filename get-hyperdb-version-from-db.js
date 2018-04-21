const hyperdb = require('hyperdb')

const db = hyperdb('./db')
db.version((err, version) => {
  if (err) throw err
  console.log('Version', version.toString('hex'))
})
