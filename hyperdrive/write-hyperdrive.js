import Hyperswarm from 'hyperswarm'
import Hyperdrive from 'hyperdrive'
import Localdrive from 'localdrive'
import Corestore from 'corestore'
import goodbye from 'graceful-goodbye'
import debounce from 'debounceify'
import b4a from 'b4a'

// create a Corestore instance 
const store = new Corestore('./writer-storage')
const swarm = new Hyperswarm()
goodbye(() => swarm.destroy())

// replication of the corestore instance on connection with other peers
swarm.on('connection', conn => store.replicate(conn))

// A local drive provides a Hyperdrive interface to a local directory
const local = new Localdrive('./writer-dir')

// A Hyperdrive takes a Corestore because it needs to create many cores
// One for a file metadata Hyperbee, and one for a content Hypercore
const drive = new Hyperdrive(store)

// wait till the properties of the hyperdrive instance are initialized
await drive.ready()
console.log('drive is ready')
// Import changes from the local drive into the Hyperdrive
const mirror = debounce(mirrorDrive)
console.log('after mirror drive debounce')

const discovery = swarm.join(drive.discoveryKey)
await discovery.flushed()

console.log('drive key:', b4a.toString(drive.key, 'hex'))

// start the mirroring process (i.e copying) of content from writer-dir to the drive
// whenever something is entered (other than '/n' or Enter )in the command-line
process.stdin.setEncoding('utf-8')
process.stdin.on('data', (d) => {
  if (!d.match('\n')) return
  mirror()
})

// this function copies the contents from writer-dir directory to the drive
async function mirrorDrive () {
  console.log('started mirroring changes from \'./writer-dir\' into the drive...')
  const mirror = local.mirror(drive)
  await mirror.done()
  console.log('finished mirroring:', mirror.count)
}