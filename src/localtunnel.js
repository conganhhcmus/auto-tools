const localtunnel = require('localtunnel')
const port = process.env.PORT || 8080
const subdomain = process.env.SUBDOMAIN || 'auto-tools'

const Main = async () => {
    const tunnel = await localtunnel({ port: port, subdomain: subdomain })

    console.log('Public URL: ' + tunnel.url)
    tunnel.on('close', () => {
        // tunnels are closed
    })
}

Main()
