import React, { useEffect, useState } from 'react'
import { Col } from 'antd'
import SkyGarden from './SkyGarden'
import axios from 'axios'

const GameOptionsFilter = (props) => {
    useEffect(() => {
        axios.get('/api/listGameOptions').then((response) => {
            setListGameOption(response.data.listGameOption)
        })
    }, [])

    const [listGameOption, setListGameOption] = useState([])
    const { selectedGame } = props

    if (listGameOption.length <= 0) return <></>

    switch (selectedGame) {
        case listGameOption[0].key:
            return <SkyGarden {...props} />

        default:
            return (
                <Col className="gutter-row" xs={24} sm={24} xl={16} xxl={16}>
                    <h3>Don't support this game!</h3>
                </Col>
            )
    }
}

export default React.memo(GameOptionsFilter)
