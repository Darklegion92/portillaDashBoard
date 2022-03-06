import { SearchOutlined } from '@ant-design/icons'
import { Button, Card, Col, DatePicker, Form, Input, Row, Space } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

const { Search } = Input

const { RangePicker } = DatePicker

const dateFormat = 'YYYY-MM-DD'

const FormSearch = ({ getSales }) => {
  const onFinish = (values: any) => {
    const params = {
      name: values?.name,
      dateInitial: values?.dates
        ? values?.dates[0].format(dateFormat)
        : moment().format(dateFormat),
      dateFinish: values?.dates
        ? values?.dates[1].add(1, 'd').format('YYYY-MM-DD')
        : moment()
            .add(1, 'd')
            .format(dateFormat),
    }
    getSales(params)
  }

  return (
    <Card size='small'>
      <Form layout='vertical' onFinish={onFinish}>
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <FormItem label='Cliente' name='name'>
              <Search />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label='Fechas' name='dates'>
              <RangePicker defaultValue={[moment(), moment()]} format={dateFormat} />
            </FormItem>
          </Col>
          <Col span={6}>
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
