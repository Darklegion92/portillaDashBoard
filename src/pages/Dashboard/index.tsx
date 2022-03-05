import React, { useEffect, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Badge, Button, Card, Col, Row, Typography } from 'antd'
import axios from 'axios'

const { Title } = Typography

const apirest = API_URL || 'https://apirest.bodegaportilla.com'

const Dashboard = (): React.ReactNode => {
  const [counter, setCounter] = useState(99999)
  const getCounter = async () => {
    const response = await axios.get(`${apirest}/parametros/contador`)
    if (response.status === 200) {
      setCounter(response.data[0].valor)
    }
  }

  const generateReport = async () => {
    const response = await axios.get(`${apirest}/informes/1`, {
      params: {
        idgrupo: 0,
        idsubgrupo: 0,
        fechainicial: '2022-01-01',
        fechafinal: '2022-01-31',
      },
      headers: {
        authorization: localStorage.getItem('token') || '',
      },
    })
    console.log(response)

    if (response.status === 200) {
      //setReportData(response.data[0].valor)
    }
  }
  setInterval(getCounter, 2000000)

  useEffect(() => {
    getCounter()
    generateReport()
  }, [])
  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            bordered
            bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Title level={4}>Contador de Visitas</Title>
            <Badge
              style={{
                backgroundColor: '#52c41a',
                fontSize: 50,
                paddingBottom: 50,
                paddingTop: 30,
              }}
              count={counter}
              overflowCount={9999999999}
              showZero
            />
            <Button style={{ marginTop: 16 }} type='primary' onClick={() => getCounter()}>
              Recargar
            </Button>
          </Card>
        </Col>
        <Col span={24}>
          <Card bordered></Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default Dashboard
