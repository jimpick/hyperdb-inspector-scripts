const hypercore = require('hypercore')
const ram = require('random-access-memory')
const hyperdiscovery = require('hyperdiscovery')
const prettyHash = require('pretty-hash')
const input = require('diffy/input')()
const thunky = require('thunky')

const key = process.argv[2]
if (!key) {
  console.error('Need key')
  process.exit(1)
}
console.log('Key', key)
const key2 = process.argv[3]
if (!key2) {
  console.error('Need key2')
  process.exit(1)
}
console.log('Key2', key2)
function storage (prefix) {
  return file => ram(prefix + '/' + file)
}
const feed = hypercore(storage('feed1'), key)
const feed2 = hypercore(storage('feed2'), key2)
feed.ready(() => {
  feed2.ready(() => {
    const sw = hyperdiscovery(feed, {
      stream: (peer) => {
        let replicating2 = false
        const stream = feed.replicate({live: true})
        stream.on('feed', dk => {
          if (dk.equals(feed2.discoveryKey)) {
            if (!replicating2) {
              console.log('Jim feed2 replicating', feed2.key.toString('hex'))
              replicating2 = true
              feed2.replicate({live: true, stream})
              stream.feed(feed2.key)
            }
          }
        })
        stream.on('close', () => { console.log('close') })
        stream.on('error', () => { console.log('error') })
        return stream
      }
    })
    // const sw = hyperdiscovery(feed)
    sw.on('connection', () => { console.log('Connection') })
  })
})
feed.ready(() => {
  console.log('Discovery Key', feed.discoveryKey.toString('hex'))
  console.log('Ready', feed.length)
  feed.on('sync', () => {
    console.log('sync', feed.length)
    onSync(feed, () => {
      console.log('First feed done')
      load2()
    })
  })
  feed.on('append', () => { console.log('append', feed.length) })
})
function load2() {
  feed2.ready(() => {
    console.log('Feed 2 Ready', feed2.length)
    console.log('Requesting second feed')
    // feed2.on('sync', () => {
      console.log('Feed 2 length', feed2.length)
      onSync(feed2, () => {
        console.log('Second feed done')
      })
    // })
    feed2.on('append', () => { console.log('append2', feed2.length) })
  })
}

function onSync (myFeed, cb) {
  printChanges(0, cb)

  function printChanges (from, cb) {
    if (from >= myFeed.length) return cb()
    myFeed.get(from, (err, data) => {
      if (err) {
        console.error('Error', err)
        process.exit(1)
      }
      console.log(myFeed.key.toString('hex'), from, data)
      printChanges(from + 1, cb)
    })
  }
}

function done () {
  console.log('Waiting')
}

input.on('keypress', (ch, key) => {
  if (key.sequence === 'c') {
    console.log('Swarm connections', sw.connections.length)
    for (let connection of sw.connections) {
      console.log(`  remoteId: ${prettyHash(connection.remoteId)} ` +
                  `(${connection.feeds.length} feeds)`)
      for (let feed of connection.feeds) {
        console.log(`    ${prettyHash(feed.key)} ` +
                    `(dk: ${prettyHash(feed.discoveryKey)})`)
      }
    }
  } else if (key.sequence === 'C') {
    console.log('Swarm connections', sw.connections)
  } else if (key.sequence === 'p') {
    console.log('Peers', feed.peers.length)
    for (let peer of feed.peers) {
      console.log(`  remoteId: ${prettyHash(peer.remoteId)}`)
    }
  } else if (key.sequence === 'P') {
    console.log('Peers', feed.peers)
  } else if (key.sequence === 'x') {
    console.log('sw._peersIds', sw._peersIds)
  } else if (key.name === 'return') {
    console.log('')
  } else {
    console.log('key', key)
  }
})
