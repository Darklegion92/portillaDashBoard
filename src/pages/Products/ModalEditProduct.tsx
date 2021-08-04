import { BarcodeOutlined, LoadingOutlined, PlusOutlined, SketchOutlined } from '@ant-design/icons';
import { Modal, Form, Input, InputNumber, Select, Tabs, Divider, Upload, Switch, Row, Col, message } from 'antd'
import React, { useState, useEffect } from 'react'

const apirest = process.env.API || 'http://localhost'


export interface PropsModal {
    visible: boolean;
    product?: PRODUCTS.Product;
    onOk?: (props: PRODUCTS.Product) => void;
    onCancel?: () => void;
}

const { TabPane } = Tabs;
const FormItem = Form.Item

const ModalEditProduct = (props: PropsModal): React.ReactNode => {
    const { visible, onCancel, product } = props
    const [loading, setLoading] = useState(false)
    const [lista, setLista] = useState<string[]>([])

    useEffect(() => {
        const newLista = product?.lista.split('*') || []
        setLista(newLista)
    }, [])


    const onChange = (info: any) => {
        setLoading(true)
        if (info.file.status === 'done') {
            setLoading(false)
            message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
            setLoading(false)
            message.error(`${info.file.name} file upload failed.`)
        }
        return false
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Subir</div>
        </div>
    );

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            title={product ? `Editar producto ${product.nombre}` : 'Nuevo producto'}
            footer={false}
            bodyStyle={{ padding: '20px 70px' }}
        >
            <Form layout="vertical">
                <Tabs>
                    <TabPane tab={<><BarcodeOutlined /> Generales</>} key="1">
                        <Row gutter={16}>
                            <Col span={10}>
                                <FormItem label="Código">
                                    <Input name="codigo" />
                                </FormItem>
                            </Col>
                            <Col span={14}>
                                <FormItem label="Nombre">
                                    <Input name="nombre" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <FormItem label="Descripción">
                                    <Input.TextArea name="descripciion" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Categoría">
                                    <Select />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Grupo">
                                    <Select />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Subgrupo">
                                    <Select />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Marca">
                                    <Select />
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="Estado">
                            <Switch />
                        </FormItem>
                    </TabPane>
                    <TabPane tab={<><SketchOutlined /> Precios y Descuentos</>} key="2">
                        <Row gutter={16}>
                            <Col span={9}>
                                <FormItem label="Precio">
                                    <InputNumber name="precio" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="Embalaje">
                                    <Select />
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem label="Incremento">
                                    <InputNumber name="incremento" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider>Descuento 1</Divider>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Precio con descuento">
                                    <InputNumber name="dcto1" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Cantidad Mínima">
                                    <InputNumber name="cant_dcto1" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider>Descuento 2</Divider>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Precio con descuento">
                                    <InputNumber name="dcto2" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Cantidad Mínima">
                                    <InputNumber name="cant_dcto2" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider>Descuento 3</Divider>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Precio con descuento">
                                    <InputNumber name="dcto3" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Cantidad Mínima">
                                    <InputNumber name="cant_dcto3" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab={<><PlusOutlined /> Otros</>} key="3">
                        <Row gutter={16}>
                            <Col span={10}>
                                <FormItem label="Imagen">
                                    <Upload
                                        name="avatar"
                                        headers={{
                                            authorization: localStorage.getItem('token') || '',
                                        }}
                                        action={`${apirest}/parametros/subirimg`}
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        onChange={onChange}
                                    >
                                        {product?.img ? <img src={product?.img} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                    </Upload>
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem label="Clasificación">
                                    <InputNumber name="clasificacion" />
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <FormItem label="Estrellas">
                                    <InputNumber name="rank" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Form.List name="lista">
                            {lista.map((item: string, index: number) => (
                                <FormItem label="">
                                    <Input/>
                                </FormItem>
                            ))}
                        </Form.List>
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    )
}

export default ModalEditProduct
