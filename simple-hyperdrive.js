const ram = require('random-access-memory')
const hyperdrive = require('hyperdrive')

const versions = {}

const archive = hyperdrive(ram)
archive.writeFile('/hello.txt', 'world', err => {
  if (err) throw err
  archive.readdir('/', (err, list) => {
    if (err) throw err
    console.log(list)
    archive.readFile('/hello.txt', 'utf8',  (err, data) => {
      if (err) throw err
      console.log(data)
      saveVersion(0, () => {
        dumpVersion(0, secondWrite)
      })
    })
  })
})

function secondWrite () {
  archive.writeFile('/hello.txt', 'world2', err => {
    if (err) throw err
    saveVersion(1, () => {
      dumpVersion(1, revisitFirst)
    })
  })
}

function revisitFirst () {
  dumpVersion(0, done)
}

function done () {
  console.log('Done.')
}

function saveVersion (index, cb) {
  const version = archive.db.version((err, version) => {
    if (err) throw err
    console.log(index + ' Version:', version.toString('hex'))
    versions[index] = version
    cb()
  })
}

function dumpVersion (index, cb) {
  const checkout = archive.db.checkout(versions[index])
  const oldArchive = hyperdrive('unused', {checkout})
  oldArchive.readdir('/', (err, list) => {
    if (err) throw err
    console.log(index + ' old "/":', list)
    checkout.get('/hello.txt', (err, node) => {
      console.log(index + ' old db get /hello.txt', node)
      archive.readFile('/hello.txt', 'utf8',  (err, data) => {
        if (err) throw err
        console.log(index + ' old /hello.txt', data)
        oldArchive.db.heads((err, heads) => {
          if (err) throw err
          console.log(index + ' heads:', heads)
          oldArchive.db.list((err, listDb) => {
            if (err) throw err
            console.log(index + ' db list:', listDb)
            cb()
          })
        })
      })
    })
  })
}
