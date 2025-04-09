import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { Buffer } from 'buffer'
import axios from 'axios'

import * as styles from './ImageScreen.module.css'

const ImageScreen = (props) => {
    const { loading, setLoading, deviceId } = props
    const [data, setData] = useState(null)

    useEffect(() => {
        setLoading(true)
        axios
            .get(`/api/viewDevice?device=${deviceId}`, {
                responseType: 'arraybuffer',
            })
            .then((response) => {
                const imgData = Buffer.from(response.data, 'binary').toString('base64')
                setData(imgData)
                setLoading(false)
            })
    }, [])

    return (
        <>
            <Spin spinning={loading} size="small" />
            {!loading && <img className={styles.imageScreen} src={`data:image/jpeg;base64,${data}`} />}
        </>
    )
}

export default React.memo(ImageScreen)
