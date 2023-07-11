import Hyperswarm from 'hyperswarm'

const swarm1 = new Hyperswarm()

swarm1.on('connection', (conn, info) => {
  // swarm1 will receive server connections
  conn.write('this is a peer1 (server) connection')
  console.log('first message sent')
  // console.log(swarm1.peers)
  let DMLreceived = false
  conn.on('data', data =>
    console.log('peer1 client got message:',data.toString()),
    DMLreceived = true,
    console.log('true/??'),
    console.log(DMLreceived)
    // basis established for DML to take place.  Both have the same NXP genesis  e.g. 1a88d9733ea9b615ee5efc21c3af58c60026706d  
    // each peer will have their own instance e.g 132f0baeeddb85b77aeab546984e6150550d1dc0
    // Stage 2  challenge proof of work from KBL
    // Stage 3  Do the machine learning check hash of 'model' ie computation
    // Stage 4  Prepare slashtag to data from ML e.g. variable, weights or population sample
    // Stage 5  one off or continue (set frequency)
    // Stage 6  on going evaluation of improvement to ML?
    // Make Model available to other new joining the NXP genesis
  )
  //conn.end()
})


const topic = Buffer.alloc(32).fill('hello world') // A topic must be 32 bytes
const discovery = swarm1.join(topic, { server: true, client: false })
await discovery.flushed() // Waits for the topic to be fully announced on the DHT

console.log(swarm1.peers)