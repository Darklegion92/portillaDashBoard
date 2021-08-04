import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Lo sentimos, recurso no disponible"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Volver al inicio
      </Button>
    }
  />
);

export default NoFoundPage;
