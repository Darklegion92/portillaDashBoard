import { loginOut } from '@/components/RightContent/AvatarDropdown'
import { PageContainer } from '@ant-design/pro-layout'
import { message, Space } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import FormSearch from './components/FormSearch'
import TableReport from './components/TableReport'

const apirest = API_URL

const SalesCustomer = () => {
  const [sales, setSales] = useState()

  const getSales = async (params?: any) => {
    try {
      const response = await axios.get(`${apirest}/informes/salesCustomer`, {
        headers: {
          authorization: localStorage.getItem('token') || '',
        },
        params,
      })
      if (response.status === 200) {
        setSales(response.data)
      }
    } catch (error) {
      if (error?.status === 401) {
        loginOut()
      }
      message.error('Ha ocurrido un error')
    }
  }
  return (
    <PageContainer title='Ventas por cliente'>
      <Space direction='vertical' style={{ width: '100%' }}>
        <FormSearch getSales={getSales} />
        <TableReport sales={sales} />
      </Space>
    </PageContainer>
  )
}

export default SalesCustomer
