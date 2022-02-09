import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Carousel, Divider, message, Tabs, Upload } from 'antd';
import axios from 'axios';
import { DeleteOutlined, MobileOutlined, PlusOutlined, SaveFilled, WindowsOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';
import { loginOut } from '@/components/RightContent/AvatarDropdown';

const apirest = API_URL;

const { TabPane } = Tabs;

const Dashboard = (): React.ReactNode => {
    const [images, setImages] = useState([])
    const [imagesMovil, setImagesMovil] = useState([])

    const getImages = async () => {
        try {
            const response = await axios.get(`${apirest}/parametros/carusel`)
            if (response.status === 200) {
                const newImages = response?.data?.map((item: SLIDER.Image) => ({
                    uid: item.id,
                    url: `${apirest}/${item.img}`,
                    thumbUrl: item.img,
                }))
                const newImagesMovil = response?.data?.map((item: SLIDER.Image) => ({
                    uid: item.id,
                    url: `${apirest}/${item.imgmovil}`,
                    thumbUrl: item.imgmovil,
                }))
                setImages(newImages)
                setImagesMovil(newImagesMovil)
            }
        } catch (error) {
            if (error.status === 401) {
                loginOut();
            }
            message.error("Ha ocurrido un error")
        }
    }

    useEffect(() => {
        getImages()
    }, [])


    const onChange = (info: any) => {
        const fileFind = images.find((item: UploadFile) => item.uid === info.file.uid)

        if (info.file.status === 'uploading' && !fileFind) {
            const newImages = [...images]
            newImages.push(info.file)
            setImages(newImages)
        }
        if (info.file.status === 'done') {
            const newImages = images.map((item: UploadFile) => {
                if (item.uid === info.file.uid) {
                    return {
                        uid: item.uid,
                        url: `${apirest}/temp/${info.file.response.img}`,
                        thumbUrl: `${info.file.response.img}`,
                    }
                }
                return item
            })
            setImages(newImages)
            message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
        return false
    }

    const onChangeMovil = (info: any) => {
        const fileFind = images.find((item: UploadFile) => item.uid === info.file.uid)
        if (info.file.status === 'uploading' && !fileFind) {
            const newImages = [...images]
            newImages.push(info.file)
            setImages(newImages)
        }
        if (info.file.status === 'done') {
            const newImagesMovil = imagesMovil.map((item: UploadFile) => {
                if (item.uid === info.file.uid) {
                    return {
                        uid: item.uid,
                        url: `${apirest}/temp/${info.file.response.img}`,
                        thumbUrl: `${info.file.response.img}`,
                    }
                }
                return item
            })
            setImagesMovil(newImagesMovil)
            message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
        return false
    }

    const removeImage = async (id: string) => {
        try {
            await axios.delete(`${apirest}/parametros/carusel/${id}`, {
                headers: {
                    authorization: localStorage.getItem('token') || '',
                }
            })
            getImages()
        } catch (error) {
            if (error.status === 401) {
                loginOut();
            }
            message.error("Ha ocurrido un error")
        }
    }

    const insertSlider = async (slider: any) => {
        try {
            const response = await axios.post(`${apirest}/parametros/carusel`, slider, {
                headers: {
                    authorization: localStorage.getItem('token') || '',
                }
            })
            if (response.status === 200) {
                message.success('Imagen agregada correctamente')
            }
        } catch (error) {
            if (error.status === 401) {
                loginOut();
            }
            message.error("Ha ocurrido un error")
        }
    }

    const saveSliders = async () => {
        if (images.length <= imagesMovil.length) {
            for (let i = 0; i < imagesMovil.length; i += 1) {
                const dato: UploadFile = imagesMovil[i]
                const datoAdd: UploadFile = images[i] || imagesMovil[i]
                if (typeof dato?.uid === 'string') {
                    insertSlider({
                        imgMovil: dato?.thumbUrl,
                        img: datoAdd?.thumbUrl,
                        idgrupo: 1,
                    })
                }
            }
        } else if (images.length > imagesMovil.length) {
            for (let i = 0; i < images.length; i += 1) {
                const dato: UploadFile = images[i]
                const datoAdd: UploadFile = imagesMovil[i] || images[i]
                if (typeof dato?.uid === 'string') {
                    insertSlider({
                        img: dato?.thumbUrl,
                        imgMovil: datoAdd?.thumbUrl,
                        idgrupo: 1,
                    })
                }
            }
        }
    }

    const uploadButton = (
        <Button style={{ width: 500, height: 140 }} type="dashed">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Agregar</div>
        </Button>
    );

    const itemRender = (
        originNode: ReactElement,
        file: UploadFile,
    ) => {
        return <div style={{ position: 'relative' }} key={file.uid} id={file.uid}>
            <div style={{ position: 'absolute' }}>
                <Button type="text" onClick={() => removeImage(file.uid)} icon={<DeleteOutlined style={{ color: 'red' }} />}></Button>
            </div>
            <img src={file.url} width={500} key={file.uid} />
        </div>
    }

    return (
        <PageContainer
            title={<>Edición de Carrousel
                <Divider type="vertical" />
                <Button type="primary" icon={<SaveFilled />} onClick={() => saveSliders()}>Guardar</Button>
            </>}
        >
            <Card>
                <Tabs type="card">
                    <TabPane tab={<><WindowsOutlined /> Escritorio</>} key="1">
                        <Carousel>
                            {images.map((image: UploadFile) => <img src={image.url} />)}
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
                    <TabPane tab={<><MobileOutlined /> Móvil</>} key="2">
                        <Carousel>
                            {imagesMovil.map((image: UploadFile) => <img src={image.url} />)}
                        </Carousel>
                        <Upload
                            name="avatar"
                            action={`${apirest}/parametros/subirimg`}
                            headers={{
                                authorization: localStorage.getItem('token') || '',
                            }}
                            itemRender={itemRender}
                            fileList={imagesMovil}
                            onChange={onChangeMovil}
                            style={{ display: 'flex', justifyContent: 'center' }}
                        >
                            {imagesMovil.length >= 8 ? null : uploadButton}
                        </Upload>
                    </TabPane>
                </Tabs>
            </Card>
        </PageContainer >
    )
}

export default Dashboard
