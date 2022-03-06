import { loginOut } from '@/components/RightContent/AvatarDropdown'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select } from 'antd'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'

const FormItem = Form.Item
const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const dateFormat = 'YYYY-MM-DD'
const apirest = API_URL

const FormSearch = ({ getSales }) => {
  const [groups, setGroups] = useState<PRODUCTS.Group[]>([])
  const [subgroups, setSubgroups] = useState<PRODUCTS.Subgroup[]>([])

  const onFinish = (values: any) => {
    const params = {
      name: values?.name,
      groupId: values?.groupId,
      subgroupId: values?.subgroupId,
      dateInitial: values?.dates
        ? values?.dates[0].format(dateFormat)
        : moment().format(dateFormat),
      dateFinish: values?.dates
        ? values?.dates[1].add(1, 'd').format('YYYY-MM-DD')
        : moment()
            .add(1, 'd')
            .format(dateFormat),
    }

    console.log(params)

    getSales(params)
  }

  const onChangeGroup = (id: any) => {
    const groupSelected = groups.find(group => group.id === id)
    setSubgroups(groupSelected?.subgrupos || [])
  }

  const getGroups = async () => {
    try {
      const response = await axios.get(`${apirest}/parametros/grupos`)
      if (response.status === 200) {
        setGroups(response.data)
      }
    } catch (error) {
      if (error?.status === 401) {
        loginOut()
      }
      message.error('Ha ocurrido un error')
    }
  }

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <Card size='small'>
      <Form layout='vertical' onFinish={onFinish}>
        <Row gutter={[10, 10]}>
          <Col span={8}>
            <FormItem label='Artículo' name='name'>
              <Search />
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem label='Grupos' name='groupId'>
              <Select onChange={onChangeGroup} allowClear>
                {groups?.map(group => (
                  <Option key={group.id} value={group.id}>
                    {group.nombre}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem label='Subgrupos' name='subgroupId'>
              <Select allowClear>
                {subgroups.map(subgroup => (
                  <Option key={subgroup.id} value={subgroup.id}>
                    {subgroup.nombre}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label='Fechas' name='dates'>
              <RangePicker defaultValue={[moment(), moment()]} format={dateFormat} />
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem label=' '>
              <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
                Buscar
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default FormSearch
