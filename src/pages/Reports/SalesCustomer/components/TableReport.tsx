import { Space, Table, Typography } from 'antd'
import numeral from 'numeral'

const { Text } = Typography

const TableReport = ({ sales = [] }) => {
  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'name',
      render: (name: string, { phone, identification }: any) => (
        <Space direction='vertical'>
          <Text>{phone}</Text>
          <Text>{name || '(Sin Nombre)'}</Text>
          <Text>{identification}</Text>
        </Space>
      ),
    },
    {
      title: 'Ventas Totales',
      dataIndex: 'salesTotal',
      align: 'right',
      render: salesTotal => numeral(salesTotal).format('$ 0,0'),
    },
    {
      title: 'Cantidad de ventas',
      align: 'center',
      dataIndex: 'salesCount',
    },
  ]

  return <Table dataSource={sales} columns={columns} />
}

export default TableReport
