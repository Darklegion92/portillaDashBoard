import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import { Button, Card, Col, Divider, Form, DatePicker, message, Row, Select, Table, Space } from 'antd';
import numeral from 'numeral'
import { useReactToPrint } from 'react-to-print'
import type { ColumnsType } from 'antd/lib/table';
import { EditFilled, PrinterOutlined } from '@ant-design/icons';
import type { PropsModal } from './ModalEditOrder';
import moment from 'moment';
import ModalEditOrder from './ModalEditOrder';
import FormatoRemision from './reports/FormatoRemision'
import { stringify } from 'qs';

const apirest = process.env.API || 'https://apirest.bodegaportilla.com'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select

const Orders = (): React.ReactNode => {
    const [orders, setOrders] = useState<ORDERS.Order[] | []>([])
    const [status, setStatus] = useState<ORDERS.State[]>([])
    const [datosImpresion, setDatosImpresion] = useState({})
    const [modal, setModal] = useState<PropsModal>({
        visible: false,
    })

    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    })

    const getStatus = async () => {
        try {
            const response = await axios.get(`${apirest}/parametros/estados`)
            if (response.status === 200) {
                setStatus(response.data)
            } else if (response.status === 401) {
                localStorage.clear()
            }
        } catch (error) {
            message.error("Se ha presentado un error")

        }
    }

    const getOrders = async (params?: any) => {

        const response = await axios.get(`${apirest}/carrito/consultar?${stringify(params)}`, {
            headers: {
                authorization: localStorage.getItem('token') || '',
            }
        })
        if (response.status === 200) {
            setOrders(response.data)
        }else{
            setOrders([])
        }
    }

    useEffect(() => {
        getOrders()
        getStatus()
    }, [])


    const onFinish = (values: any) => {
        const params = { ...values }
        if (values.fechas) {
            delete params.fechas
            params.fechas = JSON.stringify({
                date: [
                    moment(values.fechas[0]).format('YYYY/MM/DD'),
                    moment(values.fechas[1]).format('YYYY/MM/DD'),
                ],
                dateString: [
                    moment(values.fechas[0]).format('YYYY/MM/DD'),
                    moment(values.fechas[1]).format('YYYY/MM/DD'),
                ]
            })
        } else {
            delete params.fecha
        }

        if (!values.estado) {
            delete params.estado
        }

        getOrders(params)
    }
    const showModal = (id?: number) => {
        const orderSelected = orders.find(order => order.id === id)
        setModal({
            visible: true,
            status,
            order: orderSelected,
            idStatus: orderSelected?.idestado,
        })
    }

    const changeState = async (params: ORDERS.Order, idState?: number) => {

        const response = await axios.put(`${apirest}/carrito/actualizarestado`, { idorden: modal.order?.id, state: idState || params.estado }, {
            headers: {
                authorization: localStorage.getItem('token') || '',
            }
        })
        if (response.status === 200) {
            getOrders()
            setModal({
                visible: false
            })
        } else {
            message.error(response.data.messaje)
        }
    }

    const printPage = async (id: number) => {
        const items = orders.find(order => order.id === id)
        const data = {
            Header: {
                nombre: items?.cliente,
                documento: items?.documentocliente,
                direccion: items?.direccioncliente,
                estado: items?.estado,
                total: items?.total,
                telefono: items?.telefonocliente
            },
            Body: items?.detalles
        }
        if (items?.idestado === 1) changeState(items, 2)
        setDatosImpresion(data)
        handlePrint()
    }



    const closeModal = () => {
        setModal({
            visible: false,
        })
    }

    const renderFilters = (
        <Card>
            <Form layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={5}>
                        <FormItem label="Estado" name="estado" >
                            <Select>
                                {status.map(state => <Option value={state.id}>{state.nombre}</Option>)}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem label="Fechas" name="fechas" >
                            <RangePicker locale={
                                {
                                    lang: {
                                        locale: 'en_US',
                                        rangePlaceholder: ['Fecha Inicial', 'Fecha Final'],
                                    }
                                }
                            } />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label=" " colon={false}>
                            <Button type="primary" htmlType="submit">Buscar</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
    )

    const renderTable = () => {
        const columns: ColumnsType<ORDERS.Order> = [
            {
                title: 'Código',
                dataIndex: 'id',
            },
            {
                title: 'Documento',
                dataIndex: 'documentocliente',
            },
            {
                title: 'Nombre',
                dataIndex: 'nombrecliente',
                render: (nombrecliente, record) => `${nombrecliente} ${record.apellidoscliente}`
            },
            {
                title: 'Teléfono',
                dataIndex: 'telefonocliente',
            },
            {
                title: 'Total',
                dataIndex: 'total',
                align: 'right',
                render: precio => numeral(precio).format('$ 0,0')
            },
            {
                title: 'Estado',
                dataIndex: 'estado',
            },
            {
                title: 'Estado Pago',
                dataIndex: 'estadopago',
            },
            {
                title: 'Fecha Registro',
                dataIndex: 'fecha',
                render: fecha => moment(fecha)
                    .utc()
                    .format('YYYY-MM-DD'),
            },
            {
                title: 'Acciones',
                dataIndex: 'id',
                align: 'center',
                render: id => <>
                    <Button onClick={() => printPage(id)} type="primary" style={{ backgroundColor: 'green', borderColor: 'green' }} icon={<PrinterOutlined />} />
                    <Divider type="vertical" />
                    <Button onClick={() => showModal(id)} type="primary" icon={<EditFilled />} />
                </>
            },
        ]

        return <Card>
            <Table
                columns={columns}
                dataSource={orders}
            />
            <ModalEditOrder {...modal} onOk={changeState} onCancel={closeModal} />
        </Card>

    }

    return (
        <PageContainer title={
            <>Pedidos</>
        }>
            {renderFilters}
            {renderTable()}
            <div style={{ visibility: 'collapse' }}>
                <FormatoRemision ref={componentRef} datos={datosImpresion} />
            </div>
        </PageContainer>
    )
}

export default Orders