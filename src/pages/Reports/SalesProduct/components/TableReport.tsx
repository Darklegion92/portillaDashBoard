import { BarcodeOutlined } from '@ant-design/icons'
import { Space, Table, Tag, Typography } from 'antd'
import numeral from 'numeral'

const { Text } = Typography

const TableReport = ({ sales = [] }) => {
  const columns = [
    {
      title: 'Artículo',
      dataIndex: 'productName',
      render: (productName: string, { barcode }: any) => (
        <Space direction='vertical'>
          <Text>{productName}</Text>
          <Tag icon={<BarcodeOutlined />}>{barcode}</Tag>
        </Space>
      ),
    },
    {
      title: 'Grupo',
      dataIndex: 'nameGroup',
    },
    {
      title: 'Subgrupo',
      dataIndex: 'nameSubgroup',
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

  return <Table dataSource={sales.sort((a, b) => b.salesCount - a.salesCount)} columns={columns} />
}

export default TableReport
