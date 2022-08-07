/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input, Row, Button, Space, InputNumber } from 'antd';

export interface PropsModal {
  visible: boolean;
  subgroup?: PRODUCTS.Subgroup;
  onOk?: (props: Partial<PRODUCTS.Subgroup>) => void;
  onCancel?: () => void;
}

const FormItem = Form.Item;

const ModalEditSubgroup = (props: PropsModal) => {
  const { visible, onCancel, subgroup, onOk } = props;

  const initialValuesForm = {
    nombre: '',
    descuento: 0,
    ...subgroup,
  };

  const onFinish = (values: Partial<PRODUCTS.Subgroup>) => {
    if (onOk) onOk(values);
  };

  const onError = (error: any) => {
    console.log(error);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={subgroup ? `Editar subgrupo ${subgroup.nombre}` : 'Nuevo subgrupo'}
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
        <FormItem
          label="Descuento"
          name="descuento"
          rules={[{ required: true, message: 'Obligatorio' }]}
        >
          <InputNumber
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value!.replace('%', '')}
          />
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

export default ModalEditSubgroup;
