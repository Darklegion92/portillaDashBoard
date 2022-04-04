import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Carousel, Divider, message, Tabs, Upload } from 'antd';
import axios from 'axios';
import {
  DeleteOutlined,
  MobileOutlined,
  PlusOutlined,
  SaveFilled,
  WindowsOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';
import { loginOut } from '@/components/RightContent/AvatarDropdown';

const apirest = API_URL;

const { TabPane } = Tabs;

const Dashboard = (): React.ReactNode => {
  const [images, setImages] = useState([]);
  const [imagesMovil, setImagesMovil] = useState([]);

  const getImages = async () => {
    try {
      const response = await axios.get(`${apirest}/parametros/carusel`);
      if (response.status === 200) {
        const newImages = response.data
          .filter((item: SLIDER.Image) => item.img)
          .map((item: SLIDER.Image) => ({
            uid: item.id,
            url: `${apirest}/img/carusel/${item.img}`,
            thumbUrl: item.img,
          }));

        const newImagesMovil = response.data
          .filter((item: SLIDER.Image) => item.imgmovil)
          .map((item: SLIDER.Image) => ({
            uid: item.id,
            url: `${apirest}/img/carusel/movil/${item.imgmovil}`,
            thumbUrl: item.imgmovil,
          }));

        setImages(newImages);
        setImagesMovil(newImagesMovil);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        loginOut();
      }
      message.error('Ha ocurrido un error');
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  const onChange = (info: any) => {
    const fileFind = images.find((item: UploadFile) => item.uid === info.file.uid);

    if (info.file.status === 'uploading' && !fileFind) {
      const newImages = [...images];
      newImages.push(info.file);
      setImages(newImages);
    }
    if (info.file.status === 'done') {
      const newImages = images.map((item: UploadFile) => {
        if (item.uid === info.file.uid) {
          return {
            uid: item.uid,
            url: `${apirest}/temp/${info.file.response.img}`,
            thumbUrl: `${info.file.response.img}`,
          };
        }
        return item;
      });
      setImages(newImages);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    return false;
  };

  const onChangeMovil = (info: any) => {
    const fileFind = imagesMovil.find((item: UploadFile) => item.uid === info.file.uid);
    if (info.file.status === 'uploading' && !fileFind) {
      const newImages = [...imagesMovil];
      newImages.push(info.file);
      setImagesMovil(newImages);
    }
    if (info.file.status === 'done') {
      const newImagesMovil = imagesMovil.map((item: UploadFile) => {
        if (item.uid === info.file.uid) {
          return {
            uid: item.uid,
            url: `${apirest}/temp/${info.file.response.img}`,
            thumbUrl: `${info.file.response.img}`,
          };
        }
        return item;
      });
      setImagesMovil(newImagesMovil);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    return false;
  };

  const removeImage = async (id: string, type: string) => {
    try {
      await axios.delete(`${apirest}/parametros/carusel/${id}/${type}`, {
        headers: {
          authorization: localStorage.getItem('token') || '',
        },
      });
      getImages();
    } catch (error) {
      if (error?.response?.status === 401) {
        loginOut();
      }
      message.error('Ha ocurrido un error');
    }
  };

  const insertSlider = async (slider: any) => {
    try {
      const response = await axios.post(`${apirest}/parametros/carusel`, slider, {
        headers: {
          authorization: localStorage.getItem('token') || '',
        },
      });
      if (response.status === 200) {
        getImages();
        message.success('Imagen agregada correctamente');
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        loginOut();
      }
      message.error('Ha ocurrido un error');
    }
  };

  const saveSliders = async () => {
    const slider = {
      images: images.map((img) => ({
        url: img.thumbUrl,
        id: img.uid,
      })),
      imagesMovil: imagesMovil.map((img) => ({
        url: img.thumbUrl,
        id: img.uid,
      })),
    };
    insertSlider(slider);
  };

  const uploadButton = (
    <Button style={{ width: 500, height: 140 }} type="dashed">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Agregar</div>
    </Button>
  );

  const itemRender = (originNode: ReactElement, file: UploadFile) => {
    return (
      <div style={{ position: 'relative' }} key={file.uid} id={file.uid}>
        <div style={{ position: 'absolute' }}>
          <Button
            type="text"
            onClick={() => removeImage(file.uid, 'desktop')}
            icon={<DeleteOutlined style={{ color: 'red' }} />}
          />
        </div>
        <img src={file.url} width={500} key={file.uid} />
      </div>
    );
  };

  const itemRenderMovil = (originNode: ReactElement, file: UploadFile) => {
    return (
      <div style={{ position: 'relative' }} key={file.uid} id={file.uid}>
        <div style={{ position: 'absolute' }}>
          <Button
            type="text"
            onClick={() => removeImage(file.uid, 'movil')}
            icon={<DeleteOutlined style={{ color: 'red' }} />}
          />
        </div>
        <img src={file.url} width={500} key={file.uid} />
      </div>
    );
  };
  return (
    <PageContainer
      title={
        <>
          Edición de Carrousel
          <Divider type="vertical" />
          <Button type="primary" icon={<SaveFilled />} onClick={() => saveSliders()}>
            Guardar
          </Button>
        </>
      }
    >
      <Card>
        <Tabs type="card">
          <TabPane
            tab={
              <>
                <WindowsOutlined /> Escritorio
              </>
            }
            key="1"
          >
            <Carousel>
              {images.map((image: UploadFile) => (
                <img src={image.url} />
              ))}
            </Carousel>
            <Upload
              name="avatar"
              headers={{
                authorization: localStorage.getItem('token') || '',
              }}
              action={`${apirest}/parametros/subirimg`}
              itemRender={itemRender}
              fileList={images}
              onChange={onChange}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {images.length >= 8 ? null : uploadButton}
            </Upload>
          </TabPane>
          <TabPane
            tab={
              <>
                <MobileOutlined /> Móvil
              </>
            }
            key="2"
          >
            <Carousel>
              {imagesMovil.map((image: UploadFile) => (
                <img src={image.url} />
              ))}
            </Carousel>
            <Upload
              name="avatar"
              action={`${apirest}/parametros/subirimg`}
              headers={{
                authorization: localStorage.getItem('token') || '',
              }}
              itemRender={itemRenderMovil}
              fileList={imagesMovil}
              onChange={onChangeMovil}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {imagesMovil.length >= 8 ? null : uploadButton}
            </Upload>
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
