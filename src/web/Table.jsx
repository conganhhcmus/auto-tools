const moment = require('moment')
import React, { useEffect, useState } from "react";
import { Divider, Table, Button, Flex, Row, Col, Popover, Spin } from 'antd';
import axios from "axios";
import { Buffer } from 'buffer';
import styles from './Table.module.css'

const RunningTable = (props) => {
    const [runningDevice, setRunningDevice] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [logContent, setLogContent] = useState('<p>No Content</p>');
    const [viewContent, setViewContent] = useState(null);
    const [loading, setLoading] = useState(false);

    const refreshData = () => {
        axios.get('/api/runningDevice').then(response => {
            setRunningDevice(response.data)
        })
    }
    useEffect(() => {
        const intervalId = setInterval(() => refreshData(), 60 * 1000);
        refreshData();
        return () => clearInterval(intervalId)
    }, [props.refreshTime])

    const stopDevice = (device) => {
        let payload = { device }
        axios.post('/api/stop', payload).then(response => {
            refreshData()
            setSelectedDevices([])
            props.setRefreshTime(moment().format('LTS'))
        })
    }

    const stopAllDevices = () => {
        let payload = { listDevices: selectedDevices }

        axios.post('/api/stopAll', payload).then(response => {
            refreshData()
            setSelectedDevices([])
            props.setRefreshTime(moment().format('LTS'))
        })
    }

    const gameOptionContent = (gameOptions) => {
        let propertyNames = Object.getOwnPropertyNames(gameOptions).filter(x => x !== 'runAuto')
        return <div>
            {propertyNames.map(propertyName =>
                <p>{propertyName} : {gameOptions[propertyName].toString()}</p>
            )}
        </div>
    }

    const getLogsDevice = (device) => {
        setLoading(true)
        axios.get(`/api/logs?device=${device}`).then(response => {
            let logs = response.data && response.data.logs
            logs = logs.replaceAll('\n', '<br/>')
            setLogContent(`<p>${logs}</p>`)
            setLoading(false)
        })
    }

    const getCurrentScreenDevice = (device) => {
        setLoading(true)
        axios.get(`/api/viewDevice?device=${device}`, {
            responseType: 'arraybuffer'
        }).then(response => {
            const screen = Buffer.from(response.data, 'binary').toString('base64')
            setViewContent(screen)
            setLoading(false)
        })
    }

    const viewLogContent = () => {
        return <>
            <Spin spinning={loading} size="small" />
            {!loading && <div dangerouslySetInnerHTML={{ __html: logContent }} />}
        </>
    }

    const viewCurrentDevice = () => {
        return <>
            <Spin spinning={loading} size="small" />
            {!loading && <img src={`data:image/jpeg;base64,${viewContent}`} />}
        </>
    }

    const columns = [
        {
            title: 'Device',
            width: 200,
            dataIndex: 'deviceName',
        },
        {
            title: 'Game',
            width: 300,
            dataIndex: 'game',
        },
        {
            title: 'Run Auto',
            width: 300,
            dataIndex: 'runAuto',
        },
        {
            title: 'Action',
            width: 250,
            dataIndex: '',
            render: (text, record) => <Row gutter={[20, 20]} justify="center" type="flex">
                <Col className="gutter-row" xs={24} sm={24} xl={12} xxl={6} style={{ textAlign: 'center' }}>
                    <Button className={styles.stopButton} type="primary" danger onClick={() => stopDevice(record.key)}>
                        Stop
                    </Button>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} xl={12} xxl={6} style={{ textAlign: 'center' }}>
                    <Popover
                        key={`view-${record.key}`}
                        rootClassName={styles.popupView}
                        placement="leftBottom"
                        content={viewCurrentDevice}
                        title={`Current screen of ${record.key}`}
                        trigger="click">
                        <Button className={styles.viewButton} type="primary" onClick={() => getCurrentScreenDevice(record.key)}>View</Button>
                    </Popover>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} xl={12} xxl={6} style={{ textAlign: 'center' }}>
                    <Popover
                        key={`log-${record.key}`}
                        rootClassName={styles.popupLogs}
                        placement="leftBottom"
                        content={viewLogContent}
                        title={`Log of ${record.key}`}
                        trigger="click">
                        <Button className={styles.logButton} type="primary" onClick={() => getLogsDevice(record.key)}>Logs</Button>
                    </Popover>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} xl={12} xxl={6} style={{ textAlign: 'center' }}>
                    <Popover
                        key={`detail-${record.key}`}
                        rootClassName={styles.popupDetail}
                        placement="leftBottom"
                        content={gameOptionContent(record.gameOptions)}
                        title={`Game Option of ${record.key}`}
                        trigger="click">
                        <Button className={styles.detailButton} type="primary">Detail</Button>
                    </Popover>
                </Col>
            </Row >,
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedDevices,
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedDevices(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    return <>
        <Divider></Divider>
        <Table
            title={() => <Flex gap="middle" justify="space-between" align="center" vertical={false}>
                <label style={{ fontSize: 20, fontWeight: 500 }}>Running Devices</label>
                <Button disabled={selectedDevices.length <= 0} type="primary" danger onClick={stopAllDevices}>
                    Stop All
                </Button>
            </Flex>}
            bordered={true}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={runningDevice.map(item => ({
                ...item,
                key: item.device
            }))}
            pagination={{ position: ['bottomCenter'], pageSize: 5 }}
        />
    </>
}

export default React.memo(RunningTable);