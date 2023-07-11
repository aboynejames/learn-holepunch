import Hyperswarm from 'hyperswarm'

const swarm2 = new Hyperswarm()

swarm2.on('connection', (conn, info) => {
  let DMLreceived = false
  conn.on('data', data =>
   console.log('peer2 client got message:',data.toString()),
   DMLreceived = true,
   console.log('true/??'),
   console.log(DMLreceived)
  )
  if (DMLreceived === true) {
    console.log('out with true')
    console.log(DMLreceived)
    conn.write('Yes, Peer 2 wants to DML thank you for asking')
  }
})

const topic = Buffer.alloc(32).fill('hello world') // A topic must be 32 bytes


swarm2.join(topic, { server: false, client: true })
await swarm2.flush() // Waits for the swarm to connect to pending peers.

