import Hyperswarm from 'hyperswarm'
import Hyperdrive from 'hyperdrive'
import Localdrive from 'localdrive'
import Corestore from 'corestore'
import goodbye from 'graceful-goodbye'
import debounce from 'debounceify'
import b4a from 'b4a'

// create a Corestore instance
const store = new Corestore('./reader-storage')

const swarm = new Hyperswarm()
goodbye(() => swarm.destroy())

// replication of store on connection with other peers
swarm.on('connection', conn => store.replicate(conn))

// create a local copy of the remote drive
const local = new Localdrive('reader-dir')

// create a hyperdrive using the public key passed as a command-line argument
const drive = new Hyperdrive(store, b4a.from(process.argv[2], 'hex'))

// wait till all the properties of the drive are initialized
await drive.ready()

const mirror = debounce(mirrorDrive)

// call the mirror function whenever content gets appended 
// to the Hypercore instance of the hyperdrive
drive.core.on('append', mirror)

const foundPeers = store.findingPeers()

// join a topic
swarm.join(drive.discoveryKey, { client: true, server: false })
swarm.flush().then(() => foundPeers())

// start the mirroring process (i.e copying the contents from remote drive to local dir)
mirror()

async function mirrorDrive () {
  console.log('started mirroring remote drive into \'./reader-dir\'...')
  const mirror = drive.mirror(local)
  await mirror.done()
  console.log('finished mirroring:', mirror.count)
}