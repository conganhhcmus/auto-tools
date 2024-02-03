const localtunnel = require('localtunnel')

const Main = async () => {
    const tunnel = await localtunnel({ port: 8080, subdomain: 'auto-tools' })

    console.log('Public URL: ' + tunnel.url)
    tunnel.on('close', () => {
        // tunnels are closed
    })
}

Main()
