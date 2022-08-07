/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input, Row, Button, Space } from 'antd';

export interface PropsModal {
  visible: boolean;
  group?: PRODUCTS.Group;
  onOk?: (props: Partial<PRODUCTS.Group>) => void;
  onCancel?: () => void;
}

const FormItem = Form.Item;

const ModalEditGroup = (props: PropsModal) => {
  const { visible, onCancel, group, onOk } = props;

  const initialValuesForm = {
    nombre: '',
    ...group,
  };

  const onFinish = (values: Partial<PRODUCTS.Group>) => {
    if (onOk) onOk(values);
  };

  const onError = (error: any) => {
    console.log(error);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={group ? `Editar grupo ${group.nombre}` : 'Nuevo grupo'}
      footer={false}
      bodyStyle={{ padding: '20px 70px' }}
      destroyOnClose
    >
      <Form
        layout="vertical"
        initialValues={{
          ...initialValuesForm,
        }}
        onFinish={onFinish}
        onError={onError}
      >
        <FormItem label="Nombre" name="nombre" rules={[{ required: true, message: 'Obligatorio' }]}>
          <Input />
        </FormItem>
        <Row>
          <Space>
            <FormItem>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </FormItem>
            <FormItem>
              <Button htmlType="reset" onClick={onCancel}>
                Cancelar
              </Button>
            </FormItem>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalEditGroup;
