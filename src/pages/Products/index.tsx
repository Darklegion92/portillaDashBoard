import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import { Badge, Button, Card, Col, Divider, Form, Input, Row, Table } from 'antd';
import numeral from 'numeral'
import type { ColumnsType } from 'antd/lib/table';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import type { PropsModal } from './ModalEditProduct';
import ModalEditProduct from './ModalEditProduct';

const apirest = process.env.API || 'http://localhost'

const FormItem = Form.Item

const Products = (): React.ReactNode => {
    const [products, setProducts] = useState<PRODUCTS.Product[] | []>([])
    const [modal, setModal] = useState<PropsModal>({
        visible: true,
    })

    const getProducts = async (name: string) => {
        const response = await axios.get(`${apirest}/articulos?nombre=${name}`)
        if (response.status === 200) {
            setProducts(response.data)
        }
    }

    useEffect(() => {
        getProducts('Arr')
    }, [])

    const renderFilters = (
        <Card size="small">
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem label="Nombre">
                            <Input name="name" />
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

    const showModal = (id?: number) => {
        const product = products.find(item => item?.id === id)
        setModal({
            visible: true,
            product,
        })
    }

    const saveAndUpdate = (params: PRODUCTS.Product) => {

    }

    const closeModal = () => {
        setModal({
            visible: false,
        })
    }

    const renderTable = () => {
        const columns: ColumnsType<PRODUCTS.Product> = [
            {
                title: 'Código',
                dataIndex: 'codigo',
            },
            {
                title: 'Nombre',
                dataIndex: 'nombre',
            },
            {
                title: 'Precio',
                dataIndex: 'precio',
                align: 'right',
                render: precio => numeral(precio).format('$ 0,0')
            },
            {
                title: 'Embalaje',
                dataIndex: 'embalaje',
            },
            {
                title: 'Incremento',
                dataIndex: 'incremento',
                align: 'center',
            },
            {
                title: 'Estado',
                dataIndex: 'estado',
                render: estado => <Badge status={estado === 1 ? 'success' : 'default'} text={estado === 1 ? 'Activo' : 'Inactivo'} />
            },
            {
                title: 'Acciones',
                dataIndex: 'id',
                align: 'center',
                render: id => <Button onClick={() => showModal(id)} type="primary" icon={<EditFilled />} />
            },
        ]

        return <Card>
            <Table
                columns={columns}
                dataSource={products}
            />
            <ModalEditProduct {...modal} onOk={saveAndUpdate} onCancel={closeModal} />
        </Card>

    }

    return (
        <PageContainer title={
            <>Productos <Divider type="vertical" /><Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Nuevo</Button></>
        }>
            {renderFilters}
            {renderTable()}
        </PageContainer>
    )
}

export default Products