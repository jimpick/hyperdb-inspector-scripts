const hyperdb = require('hyperdb')
const ram = require('random-access-memory')
const hyperdiscovery = require('hyperdiscovery')

const key = process.argv[2]
if (!key) {
  console.error('Need key')
  process.exit(1)
}
console.log('Key', key)
const db = hyperdb(ram, key)
// const sw = hyperdiscovery(feed, {port: 3282})
const sw = hyperdiscovery(db)
sw.on('connection', (stream, info) => {
  console.log('Connection', info)
  stream.on('error', err => {
    console.error('Error', err)
  })
  stream.on('close', () => {
    console.log('Closed')
  })
})
// db.on('ready', () => {
//  db.on('append', (feed, writerId) => {
  db.on('remote-update', (feed, writerId) => {
    console.log('Append: writerId', writerId)
    db.version((err, version) => {
      if (err) throw err
      console.log('Version', version.toString('hex'))
      done()
    })
  })
// })

function done () {
  console.log('Done.')
  process.exit()
}
