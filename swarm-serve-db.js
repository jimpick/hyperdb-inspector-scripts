require('longjohn')

require('events').prototype._maxListeners = 100

const hyperdb = require('hyperdrive/node_modules/hyperdb')
const hyperdiscovery = require('hyperdiscovery')

const db = hyperdb('./db', {contentFeed: true})
db.ready(() => {
  console.log('Key:', db.key.toString('hex'))
  console.log('Local Key:', db.local.key.toString('hex'))
  const sw = hyperdiscovery(db, {
    live: true,
    download: false,
    upload: true,
    stream: (peer) => {
      const stream = db.replicate({live: true, download: true})
      stream.on('feed', dk => {
        console.log('dk:', dk.toString('hex'))
      })
      return stream
    }
  })
  sw.on('connection', (stream, info) => {
    console.log('Connection', info)
    stream.on('error', err => {
      console.error('Error', err)
    })
    stream.on('close', () => {
      console.log('Closed')
    })
  })
})
