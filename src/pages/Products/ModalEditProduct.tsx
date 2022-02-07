/* eslint-disable react-hooks/exhaustive-deps */
import { loginOut } from '@/components/RightContent/AvatarDropdown'
import {
  BarcodeOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
  SketchOutlined,
} from '@ant-design/icons'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Typography,
  Select,
  Tabs,
  Divider,
  List,
  Upload,
  Switch,
  Row,
  Col,
  message,
  Button,
  Space,
  Card,
} from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

const apirest = API_REST || 'https://apirest.bodegaportilla.com'
export interface PropsModal {
  visible: boolean
  product?: PRODUCTS.Product
  onOk?: (props: PRODUCTS.Product, lista: string[]) => void
  onCancel?: () => void
}

const { TabPane } = Tabs
const FormItem = Form.Item
const { Option } = Select
const { Text } = Typography

const ModalEditProduct = (props: PropsModal): React.ReactNode => {
  const { visible, onCancel, product, onOk } = props
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<PRODUCTS.Group[]>([])
  const [subgroups, setSubgroups] = useState<PRODUCTS.Subgroup[]>([])
  const [brands, setBrands] = useState<PRODUCTS.Brand[]>([])
  const [images, setImages] = useState<{ url?: string; img?: string; uid: string; name: string }[]>(
    [],
  )
  const [activeKey, setActiveKey] = useState('1')
  const [lista, setLista] = useState<string[]>([])

  const onChangeGroup = (id: any) => {
    const groupSelected = groups.find(group => group.id === id)
    setSubgroups(groupSelected?.subgrupos || [])
  }

  const getGroups = async () => {
    try {
      const response = await axios.get(`${apirest}/parametros/grupos`)
      if (response.status === 200) {
        setGroups(response.data)
        if (product) {
          onChangeGroup(product.idgrupo)
        }
      }
    } catch (error) {
      if (error.status === 401) {
        loginOut()
      }
      message.error('Ha ocurrido un error')
    }
  }

  const getBrands = async () => {
    try {
      const response = await axios.get(`${apirest}/parametros/marcas`)
      if (response.status === 200) {
        setBrands(response.data)
      }
    } catch (error) {
      if (error.status === 401) {
        loginOut()
      }
      message.error('Ha ocurrido un error')
    }
  }

  useEffect(() => {
    const newLista = product?.lista.split('*') || []
    const imagesList = product?.img?.split('|') || []
    const images = imagesList.map(img => ({ url: `${apirest}/img/articulos/${img}`, img, uid: img, name: img }))
    setImages(images)
    setLista(newLista)
    getGroups()
    getBrands()
  }, [props.visible])

  const agregaritem = () => {
    const newList = [...lista]
    newList.push('')
    setLista(newList)
  }

  const onChange = (info: any) => {
    setLoading(true)
    if (info.file.status === 'done') {
      setLoading(false)
      const newImages = images?.concat([
        {
          uid: info.file.response.img,
          name: info.file.response.img,
          url: `temp/${info.file.response.img}`,
          img: info.file.response.img,
        },
      ])
      setImages(newImages)
      message.success(`${info.file.name} imagen subida correctamente`)
    } else if (info.file.status === 'error') {
      setLoading(false)
      message.error(`${info.file.name} error al subir la imagen`)
    }
    return false
  }

  const eliminarItem = (i: number) => {
    const newList = [...lista]
    newList.splice(i, 1)
    setLista(newList)
  }

  const onChangeLista = (e: React.KeyboardEventHandler, i: number) => {
    const newList = [...lista]
    newList[i] = e.target.value
    setLista(newList)
  }

  const initialValuesForm = {
    embalaje: 'Und',
    clasificacion: 1,
    rank: 1,
    categoria: 'NORMAL',
    ...product,
    estado: product?.estado !== 0,
  }
  const onFinish = (values: any) => {
    if (values.precio)
      if (values.clasificacion) {
        delete values.imagen
        const newImages = images.reduce((ant, img) => `${ant}|${img.img}`, '')
        onOk && onOk({ ...values, img: newImages }, lista)
      } else setActiveKey('3')
    else setActiveKey('2')
  }

  const deleteImage = (uid: string) => {
    const newImages = images.filter(image => image.uid !== uid)
    setImages(newImages)
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Subir</div>
    </div>
  )

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={product ? `Editar producto ${product.nombre}` : 'Nuevo producto'}
      footer={false}
      bodyStyle={{ padding: '20px 70px' }}
      destroyOnClose
    >
      <Form
        layout='vertical'
        initialValues={{
          ...initialValuesForm,
          precio:
            initialValuesForm.embalaje === 'Und'
              ? initialValuesForm.precio
              : (initialValuesForm?.precio || 0) * 1000,
              dcto1:
              initialValuesForm.embalaje === 'Und'
                ? initialValuesForm.dcto1
                : (initialValuesForm?.dcto1 || 0) * 1000,
                dcto2:
            initialValuesForm.embalaje === 'Und'
              ? initialValuesForm.dcto2
              : (initialValuesForm?.dcto2 || 0) * 1000,
              dcto3 :
            initialValuesForm.embalaje === 'Und'
              ? initialValuesForm.dcto3
              : (initialValuesForm?.dcto3 || 0) * 1000,
        }}
        onFinish={onFinish}
      >
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
          <TabPane
            tab={
              <>
                <BarcodeOutlined /> Generales
              </>
            }
            key='1'
          >
            <Row gutter={16}>
              <Col span={10}>
                <FormItem
                  label='Código'
                  name='codigo'
                  rules={[{ required: true, message: 'Obligatorio' }]}
                >
                  <Input />
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  label='Nombre'
                  name='nombre'
                  rules={[{ required: true, message: 'Obligatorio' }]}
                >
                  <Input />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem label='Descripción' name='descripcion'>
                  <Input.TextArea />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label='Categoría' name='categoria'>
                  <Select>
                    <Option value='NORMAL'>NORMAL</Option>
                    <Option value='REGALO'>REGALO</Option>
                    <Option value='NUEVO'>NUEVO</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label='Grupo'
                  name='idgrupo'
                  rules={[{ required: true, message: 'Obligatorio' }]}
                >
                  <Select onChange={onChangeGroup}>
                    {groups.map(group => (
                      <Option key={group.nombre} value={group.id}>
                        {group.nombre}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label='Subgrupo'
                  name='idsubgrupo'
                  rules={[{ required: true, message: 'Obligatorio' }]}
                >
                  <Select>
                    {subgroups.map(subgroup => (
                      <Option key={subgroup.nombre} value={subgroup.id}>
                        {subgroup.nombre}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label='Marca'
                  name='idmarca'
                  rules={[{ required: true, message: 'Obligatorio' }]}
                >
                  <Select>
                    {brands.map(brand => (
                      <Option key={brand.nombre} value={brand.id}>
                        {brand.nombre}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <FormItem label='Estado' name='estado' valuePropName='checked'>
              <Switch defaultChecked />
            </FormItem>
          </TabPane>
          <TabPane
            tab={
              <>
                <SketchOutlined /> Precios y Descuentos
              </>
            }
            key='2'
          >
            <Row gutter={16}>
              <Col span={9}>
                <FormItem
                  label='Precio'
                  name='precio'
                  rules={[{ required: true, message: 'Obligatorio' }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label='Embalaje' name='embalaje'>
                  <Select>
                    <Option value='Und'>Und</Option>
                    <Option value='Gr'>Gr</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={9}>
                <FormItem
                  label='Incremento'
                  name='incremento'
                  rules={[{ required: true, message: 'Obligatorio' }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </FormItem>
              </Col>
            </Row>
            <Divider>Descuento 1</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label='Precio con descuento' name='dcto1'>
                  <InputNumber style={{ width: '100%' }} defaultValue={0} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='Cantidad Mínima' name='cant_dcto1'>
                  <InputNumber style={{ width: '100%' }} defaultValue={0} />
                </FormItem>
              </Col>
            </Row>
            <Divider>Descuento 2</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label='Precio con descuento' name='dcto2'>
                  <InputNumber style={{ width: '100%' }} defaultValue={0} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='Cantidad Mínima' name='cant_dcto2'>
                  <InputNumber style={{ width: '100%' }} defaultValue={0} />
                </FormItem>
              </Col>
            </Row>
            <Divider>Descuento 3</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label='Precio con descuento' name='dcto3'>
                  <InputNumber style={{ width: '100%' }} defaultValue={0} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='Cantidad Mínima' name='cant_dcto3'>
                  <InputNumber style={{ width: '100%' }} defaultValue={0} />
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={
              <>
                <PlusOutlined /> Otros
              </>
            }
            key='3'
          >
            <Row gutter={16}>
              <Col span={24}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {images.map(image => (
                    <Card
                      bordered
                      bodyStyle={{ padding: 0 }}
                      style={{ width: 100 }}
                      actions={[
                        <DeleteOutlined
                          key='delete'
                          style={{ color: 'red' }}
                          onClick={() => deleteImage(image.uid)}
                        />,
                      ]}
                    >
                      <img
                        style={{ width: 100, height: 100 }}
                        alt={image.img}
                        src={image.url}
                      />
                    </Card>
                  ))}
                </div>
                <FormItem label='Imagen' name='imagen'>
                  {images?.length < 2 ? (
                    <Upload
                      name='avatar'
                      headers={{
                        authorization: localStorage.getItem('token') || '',
                      }}
                      action={`${apirest}/parametros/subirimg`}
                      listType='picture-card'
                      className='avatar-uploader'
                      showUploadList={false}
                      onChange={onChange}
                      disabled={loading}
                    >
                      {uploadButton}
                    </Upload>
                  ) : null}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label='Clasificación' name='clasificacion'>
                  <InputNumber min={1} max={5} />
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label='Estrellas' name='rank'>
                  <InputNumber min={1} max={5} />
                </FormItem>
              </Col>
            </Row>
            <FormItem
              label={
                <Text>
                  Lista Beneficios
                  <Divider type='vertical' />
                  <Button icon={<PlusOutlined />} onClick={agregaritem} type='primary'>
                    Agregar
                  </Button>
                </Text>
              }
              name='lista'
            >
              <List
                style={{
                  width: '100%',
                  maxHeight: '100px',
                  overflowY: 'scroll',
                }}
              >
                {lista?.map((item: string, i: number) => {
                  if (i > 0) {
                    return (
                      <Row gutter={[0, 10]} style={{ marginBottom: 10 }}>
                        <Col span={2}>
                          <Text>{i}</Text>
                        </Col>
                        <Col span={20}>
                          <Input defaultValue={item} onChange={e => onChangeLista(e, i)} />
                        </Col>
                        <Col
                          span={2}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <DeleteOutlined
                            style={{ color: 'red' }}
                            onClick={() => eliminarItem(i)}
                          />
                        </Col>
                      </Row>
                    )
                  }
                  return null
                })}
              </List>
            </FormItem>
          </TabPane>
        </Tabs>
        <Row>
          <Space>
            <FormItem>
              <Button type='primary' htmlType='submit'>
                Guardar
              </Button>
            </FormItem>
            <FormItem>
              <Button htmlType='reset' onClick={onCancel}>
                Cancelar
              </Button>
            </FormItem>
          </Space>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalEditProduct
