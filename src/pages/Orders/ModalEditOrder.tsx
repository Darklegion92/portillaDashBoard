/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Select, Row, Space, Button } from 'antd'
import React from 'react'

export interface PropsModal {
    visible: boolean;
    idStatus?: number;
    order?: ORDERS.Order;
    status?: ORDERS.State[];
    onOk?: (props: ORDERS.Order) => void;
    onCancel?: () => void;
}

const FormItem = Form.Item
const { Option } = Select

const ModalEditOrder = (props: PropsModal): React.ReactNode => {
    const { visible, onCancel, status, idStatus, onOk } = props

    const initialValuesForm = {
        estado: idStatus,
    }

    const onFinish = (values: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onOk && onOk(values)
    }

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            title="Cambiar Estado"
            footer={false}
            bodyStyle={{ padding: '20px 70px' }}
            destroyOnClose
        >
            <Form
                layout="vertical"
                initialValues={initialValuesForm}
                onFinish={onFinish}
            >
                <FormItem name="estado" label="Estado">
                    <Select>
                        {status?.map(state => <Option value={state.id}>{state.nombre}</Option>)}
                    </Select>
                </FormItem>
                <Row>
                    <Space>
                        <FormItem>
                            <Button type="primary" htmlType="submit">Guardar</Button>
                        </FormItem>
                        <FormItem>
                            <Button htmlType="reset" onClick={onCancel}>Cancelar</Button>
                        </FormItem>
                    </Space>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalEditOrder

