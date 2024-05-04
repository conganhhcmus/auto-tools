import React, { useEffect, useState } from 'react'
import { Checkbox, Col, Row, Select, Button, InputNumber, Flex } from 'antd'
import styles from './SkyGarden.module.css'
import axios from 'axios'

const SkyGarden = (props) => {
    const { selectedGame } = props
    const [selectedAuto, setSelectedAuto] = useState('')
    const [frequency, setFrequency] = useState(1)
    const [openGameAfter, setOpenGameAfter] = useState(1)
    const [gameOption, setGameOption] = useState(['sellItems', 'openChests', 'openGame'])
    const [autoOption, setAutoOption] = useState([])

    useEffect(() => {
        axios.get(`/api/gameOptions?game=${selectedGame}`).then((response) => {
            setAutoOption(response.data)
            setSelectedAuto(response.data.sort((a, b) => a.order - b.order)[0].key)
        })
    }, [])

    const onSelectedAuto = (value) => {
        setSelectedAuto(value)
    }

    const onSelectedGameOption = (value) => {
        setGameOption(value)
    }

    const runAuto = () => {
        const data = {
            runAuto: selectedAuto,
            openGame: gameOption.includes('openGame'),
            openChests: gameOption.includes('openChests'),
            hasEventTree: gameOption.includes('hasEventTree'),
            sellItems: gameOption.includes('sellItems'),
            openGameAfter,
            frequency,
        }
        props.runAuto(data)
    }

    return (
        <>
            <Col className="gutter-row" xs={24} sm={24} xl={16} xxl={16}>
                <h3>Game Option</h3>
                <Row>
                    <Checkbox.Group style={{ width: '100%' }} onChange={onSelectedGameOption} defaultValue={gameOption}>
                        <Row gutter={[40, 20]}>
                            <Col className="gutter-row" xs={24} sm={24} xl={11} xxl={12}>
                                <Flex justify="space-between" gap="middle" align="center" vertical={false}>
                                    <label>Run Auto</label>
                                    <Select
                                        className={styles.selectAuto}
                                        showSearch
                                        placeholder="Search to Select"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                        filterSort={(optionA, optionB) => (optionA?.order ?? 0) - (optionB?.order ?? 0)}
                                        options={autoOption.map((item) => ({
                                            value: item.key,
                                            label: item.name + (item.recommend ? ' (★)' : ''),
                                            disabled: item.disabled,
                                            order: item.order,
                                        }))}
                                        onChange={onSelectedAuto}
                                        value={selectedAuto}
                                    />
                                </Flex>
                            </Col>

                            <Col xs={24} sm={24} xl={12} xxl={12}>
                                <Row gutter={[30, 20]}>
                                    <Col xs={12} xl={13}>
                                        <Flex gap="middle" align="center" vertical={false}>
                                            <label>Open Game After</label>
                                            <InputNumber
                                                disabled={!gameOption.includes('openGame')}
                                                className={styles.inputNumber}
                                                min={1}
                                                max={99}
                                                value={openGameAfter}
                                                onChange={(value) => setOpenGameAfter(value)}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col xs={12} xl={11}>
                                        <Flex gap="middle" align="center" vertical={false}>
                                            <label>Frequency</label>
                                            <InputNumber className={styles.inputNumber} min={1} max={99} value={frequency} onChange={(value) => setFrequency(value)} />
                                        </Flex>
                                    </Col>
                                </Row>
                            </Col>

                            <Col className="gutter-row" xs={24} sm={24} xl={24} xxl={24}>
                                <Row gutter={[40, 20]}>
                                    <Col xs={12} sm={6} xl={6}>
                                        <Checkbox value="hasEventTree">Has Event Tree</Checkbox>
                                    </Col>
                                    <Col xs={12} sm={6} xl={6}>
                                        <Checkbox value="openGame">Open Game</Checkbox>
                                    </Col>
                                    <Col xs={12} sm={6} xl={6}>
                                        <Checkbox value="openChests">Open Chests</Checkbox>
                                    </Col>
                                    <Col xs={12} sm={6} xl={6}>
                                        <Checkbox value="sellItems">Sell Items</Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Button type="primary" loading={false} onClick={runAuto}>
                                    Run now!
                                </Button>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Row>
            </Col>
        </>
    )
}

export default React.memo(SkyGarden)
