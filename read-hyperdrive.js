require('longjohn')
const hyperdrive = require('hyperdrive')
const prettyHash = require('pretty-hash')

const archive = hyperdrive('./db')
archive.ready(() => {
  archive.readdir('/', (err, list) => {
    if (err) {
      console.error('Jim1 error', err)
      process.exit(1)
    }
    console.log('Dir /', list)
    archive.readdir('/shopping-list', (err, list) => {
      if (err) {
        console.log('Jim2 error', err)
        console.log(err.stack)
        console.log(err.info)
        dumpWriters(archive)
        process.exit(1)
      }
      console.log('Dir /shopping-list', list)
    })
  })
})

function dumpWriters (archive) {
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
}
