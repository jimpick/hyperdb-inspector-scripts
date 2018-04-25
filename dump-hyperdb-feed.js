const hypercore = require('hypercore')
const messages = require('hyperdrive/node_modules/hyperdb/lib/messages')
const to2 = require('to2')

const file = process.argv[2]
if (!file) {
  console.error('Need file')
  process.exit(1)
}
const feed = hypercore(file)

feed.on('ready', () => {
  console.log('Key', feed.key.toString('hex'))
  console.log('Ready', feed.length)
  const stream = feed.createReadStream()
  var i = 0
  stream.pipe(to2((data, enc, next) => {
    let val = messages.Entry.decode(data)
    if (val.inflate === i) {
      val = messages.InflatedEntry.decode(data)
    }
    console.log(i++, val)
    next()
  }))
})

