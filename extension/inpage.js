import LocalMessageDuplexStream from 'post-message-stream'

window.Terra = (function() {
  const inpageStream = new LocalMessageDuplexStream({
    name: 'station:inpage',
    target: 'station:content',
  })

  return {
    sendMessage: (data) => {
      inpageStream.write(data)
    },
    on: (name, callback) => {
      inpageStream.on('data', (data) => {
        data.name === name && callback(data.payload)
      })
    }
  }
}())
