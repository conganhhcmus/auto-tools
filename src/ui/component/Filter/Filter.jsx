const moment = require('moment')
import React, { useEffect, useState } from 'react'
import { Col, Row, Select, Flex, notification } from 'antd'
import GameOptionsFilter from './Game'
import * as styles from './Filter.module.css'
import axios from 'axios'

const Filter = (props) => {
    const [selectedDevices, setSelectedDevices] = useState([])
    const [selectedGame, setSelectedGame] = useState('')
    const [devicesOption, setDevicesOption] = useState([])
    const [listGameOption, setListGameOption] = useState([])

    const [api, contextHolder] = notification.useNotification()
    const openNotification = (title, message) => {
        api.error({
            message: title,
            description: message,
            duration: 2,
        })
    }

    const getSettings = () => {
        axios
            .get('/api/settings')
            .then(function (response) {
                setDevicesOption(response.data.listDevices)
                setListGameOption(response.data.listGameOption)
                setSelectedDevices(response.data.listDevices.filter((x) => !x.disabled).map((x) => x.value))
                setSelectedGame(response.data.listGameOption[0].key)
            })
    }

    useEffect(() => {
        getSettings()
    }, [props.refreshTime])

    const onSelectedDevice = (value) => {
        setSelectedDevices(value)
    }

    const onSelectedGame = (value) => {
        setSelectedGame(value)
    }

    const runAuto = (gameOptions) => {
        if (selectedDevices.length <= 0) {
            return openNotification('Error Message', 'Please select device!')
        }
        let payload = {
            selectedDevices,
            selectedGame,
            gameOptions,
        }

        axios
            .post('/api/start', payload)
            .then((response) => {
                props.setRefreshTime(moment().format('LTS'))
            })
    }

    return (
        <>
            {contextHolder}
            <Row gutter={[40, 0]}>
                <Col xs={24} sm={24} xl={10} xxl={10}>
                    <h3>Settings</h3>
                    <Row justify={'left'} gutter={[40, 20]}>
                        <Col className="gutter-row" xs={24} sm={24} xl={24} xxl={24}>
                            <Flex justify="space-between" gap="middle" align="center" vertical={false}>
                                <label>Devices</label>
                                <Select
                                    style={{ width: '80%' }}
                                    mode="multiple"
                                    placeholder="Select Devices ..."
                                    // maxTagCount="responsive"
                                    value={selectedDevices}
                                    onChange={onSelectedDevice}
                                    options={devicesOption.map((item) => ({
                                        value: item.value,
                                        label: item.label,
                                        disabled: item.disabled,
                                    }))}
                                />
                            </Flex>
                        </Col>
                        <Col className="gutter-row" xs={24} sm={24} xl={24} xxl={24}>
                            <Flex justify="space-between" gap="middle" align="center" vertical={false}>
                                <label>Game</label>
                                <Select
                                    style={{ width: '80%' }}
                                    showSearch
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) => (optionA?.order ?? 0) - (optionB?.order ?? 0)}
                                    options={listGameOption.map((item) => ({
                                        value: item.key,
                                        label: item.name,
                                        disabled: item.disabled,
                                    }))}
                                    onChange={onSelectedGame}
                                    value={selectedGame}
                                />
                            </Flex>
                        </Col>
                    </Row>
                </Col>

                <GameOptionsFilter selectedGame={selectedGame} runAuto={runAuto} />
            </Row>
        </>
    )
}

export default React.memo(Filter)
