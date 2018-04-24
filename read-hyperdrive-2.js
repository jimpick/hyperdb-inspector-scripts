const hyperdrive = require('hyperdrive')
const hyperdiscovery = require('hyperdiscovery')
const prettyHash = require('pretty-hash')

const archive = hyperdrive('./db')
archive.ready(() => {
  // const sw = hyperdiscovery(archive)
  /*
  const sw = hyperdiscovery(archive, {
    stream: (peer) => {
      const stream = archive.replicate({live: true, download: true})
      stream.on('feed', dk => {
        console.log('dk:', dk)
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
  */
  archive.readdir('/', (err, list) => {
    if (err) throw err
    console.log('Dir /', list)
    archive.readdir('/shopping-list', (err, list) => {
      if (err) throw err
      console.log('Dir /shopping-list', list)

      console.log('Writers:')
      archive.db._writers.forEach((writer, index) => {
        console.log(index, writer._feed.key.toString('hex'),
                    'dk:', prettyHash(writer._feed.discoveryKey),
                    writer._feed.length)
      })
      console.log('Content feeds:')
      archive.db.contentFeeds.forEach((feed, index) => {
        if (feed) {
          console.log('  ', index, feed.key.toString('hex'), feed.length)
        } else {
          console.log('  ', index, 'No feed')
        }
      })
      console.log('File: 0jg9vpsbh.json')
      archive.readFile('/shopping-list/0jg9vpsbh.json', 'utf8', (err, contents) => {
        console.log('Jim1')
        if (err) throw err
        console.log(contents)
      })
    })
  })
})
