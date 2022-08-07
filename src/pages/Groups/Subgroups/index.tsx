import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import { Button, Card, Divider, message, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import type { PropsModal } from './ModalEditSubgroup';
import { loginOut } from '@/components/RightContent/AvatarDropdown';
import { useParams } from 'umi';
import ModalEditSubgroup from './ModalEditSubgroup';

const apirest = API_URL;

const Groups = (): React.ReactNode => {
  const [groups, setGroups] = useState<PRODUCTS.Subgroup[] | []>([]);
  const [modal, setModal] = useState<PropsModal>({
    visible: false,
  });

  const { id } = useParams();

  const getGroups = async () => {
    try {
      const response = await axios.get(`${apirest}/parametros/grupos`);
      if (response.status === 200) {
        const groupSelected = response?.data?.find((group: PRODUCTS.Subgroup) => group.id == id);

        setGroups(groupSelected?.subgrupos || []);
      } else {
        setGroups([]);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        loginOut();
      }
    }
  };

  const showModal = (idSubgroup?: number) => {
    const subgroup = groups.find((item) => item?.id === idSubgroup);
    setModal({
      visible: true,
      subgroup,
    });
  };

  const saveAndUpdate = async (params: Partial<PRODUCTS.Subgroup>) => {
    if (modal?.subgroup) {
      try {
        const response = await axios.put(
          `${apirest}/subgrupos/editar`,
          { idsubgrupo: modal.subgroup.id, ...params },
          {
            headers: {
              authorization: localStorage.getItem('token') || '',
            },
          },
        );
        if (response.status === 200) {
          setModal({ visible: false });
          message.success('Subgrupo actualizado correctamente');
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
        const response = await axios.post(
          `${apirest}/subgrupos/crear`,
          { idgrupo: id, ...params },
          {
            headers: {
              authorization: localStorage.getItem('token') || '',
            },
          },
        );
        if (response.status === 200) {
          setModal({ visible: false });
          message.success('Subgrupo creado correctamente');
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
    const columns: ColumnsType<PRODUCTS.Subgroup> = [
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
        render: (idSubgroup: number) => (
          <Button onClick={() => showModal(idSubgroup)} type="primary" icon={<EditFilled />} />
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
          Subgrupos {} <Divider type="vertical" />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Nuevo
          </Button>
        </>
      }
    >
      {renderTable()}
      <ModalEditSubgroup {...modal} onOk={saveAndUpdate} onCancel={closeModal} />
    </PageContainer>
  );
};

export default Groups;
