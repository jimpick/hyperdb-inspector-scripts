const hypercore = require('hypercore')
const ram = require('random-access-memory')
const hyperdiscovery = require('hyperdiscovery')
const messages = require('hyperdb/lib/messages')
const to2 = require('to2')

const key = process.argv[2]
if (!key) {
  console.error('Need key')
  process.exit(1)
}
console.log('Key', key)

const feed = hypercore(ram, key)
const sw = hyperdiscovery(feed)
sw.on('connection', () => { console.log('Connection') })
feed.on('ready', () => {
  console.log('Ready', feed.length)
  feed.on('sync', () => {
    const stream = feed.createReadStream()
    var i = 0
    stream.pipe(to2((data, enc, next) => {
      let val = messages.Entry.decode(data)
      if (val.inflate === i) {
        val = messages.InflatedEntry.decode(data)
      }
      if (val.feeds) {
        val.feeds = val.feeds.map(feed => Object.assign(feed, {
          key: feed.key.toString('hex')
        }))
      }
      if (val.contentFeed) {
        val.contentFeed = val.contentFeed.toString('hex')
      }
      console.log(i++, val)
      next()
    }))
  })
})
