import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import { Button, Card, Divider, message, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import type { PropsModal } from './ModalEditGroup';
import { loginOut } from '@/components/RightContent/AvatarDropdown';
import { useHistory } from 'umi';
import ModalEditGroup from './ModalEditGroup';

const apirest = API_URL;

const Groups = (): React.ReactNode => {
  const [groups, setGroups] = useState<PRODUCTS.Group[] | []>([]);
  const [modal, setModal] = useState<PropsModal>({
    visible: false,
  });

  const history = useHistory();

  const getGroups = async () => {
    try {
      const response = await axios.get(`${apirest}/parametros/grupos`);
      if (response.status === 200) {
        setGroups(response.data);
      } else {
        setGroups([]);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        loginOut();
      }
    }
  };

  const showModal = (id?: number) => {
    const group = groups.find((item) => item?.id === id);
    setModal({
      visible: true,
      group,
    });
  };

  const saveAndUpdate = async (params: Partial<PRODUCTS.Group>) => {
    if (modal?.group) {
      try {
        const response = await axios.put(
          `${apirest}/grupos/editar`,
          { idgrupo: modal.group.id, ...params },
          {
            headers: {
              authorization: localStorage.getItem('token') || '',
            },
          },
        );
        if (response.status === 200) {
          setModal({ visible: false });
          message.success('Grupo actualizado correctamente');
          getGroups();
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          loginOut();
        }
        message.error('Ha ocurrido un error');
      }
    } else {
      try {
        const response = await axios.post(`${apirest}/grupos/crear`, params, {
          headers: {
            authorization: localStorage.getItem('token') || '',
          },
        });
        if (response.status === 200) {
          setModal({ visible: false });
          message.success('Grupo creado correctamente');
          getGroups();
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          loginOut();
        }
        message.error('Ha ocurrido un error');
      }
    }
  };

  const closeModal = () => {
    setModal({
      visible: false,
    });
  };

  const renderTable = () => {
    const columns: ColumnsType<PRODUCTS.Group> = [
      {
        title: 'Código',
        dataIndex: 'id',
      },
      {
        title: 'Nombre',
        dataIndex: 'nombre',
      },
      {
        title: 'Acciones',
        dataIndex: 'id',
        align: 'center',
        render: (id) => (
          <Button
            onClick={() => history.push(`/groups/${id}`)}
            type="primary"
            icon={<EditFilled />}
          />
        ),
      },
    ];

    return (
      <Card>
        <Table columns={columns} dataSource={groups} />
      </Card>
    );
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <PageContainer
      title={
        <>
          Grupos <Divider type="vertical" />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Nuevo
          </Button>
        </>
      }
    >
      {renderTable()}
      <ModalEditGroup {...modal} onOk={saveAndUpdate} onCancel={closeModal} />
    </PageContainer>
  );
};

export default Groups;
