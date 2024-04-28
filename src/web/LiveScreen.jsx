import React, { useEffect } from 'react'
import JMuxer from 'jmuxer'
import styles from './LiveScreen.module.css'

const LiveScreen = (props) => {
    useEffect(() => {
        var protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        var socketURL = protocol + '//' + window.location.host + '/live/' + props.deviceId
        var jmuxer = new JMuxer({
            node: `player-${props.deviceId}`,
            mode: 'video',
            flushingTime: 0,
            fps: 60,
            debug: false,
        })
        var ws = new WebSocket(socketURL)
        ws.binaryType = 'arraybuffer'
        ws.addEventListener('message', function (event) {
            jmuxer.feed({
                video: new Uint8Array(event.data),
            })
        })
        ws.addEventListener('error', function (e) {
            console.log('Socket Error')
        })

        props.webSocketHandler && props.webSocketHandler(ws)
    }, [])

    return <video key={props.deviceId} controls autoPlay id={`player-${props.deviceId}`} />
}

export default React.memo(LiveScreen)
