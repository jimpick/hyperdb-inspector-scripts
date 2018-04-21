const hyperdb = require('hyperdb')

const db = hyperdb('./db')

db.heads((err, heads) => {
  if (err) throw err
  console.log('Heads', heads)
  console.log('Writers')
  db._writers.forEach((writer, index) => {
    console.log(index, writer._feed.key.toString('hex'), writer._feed.length)
  })
})

