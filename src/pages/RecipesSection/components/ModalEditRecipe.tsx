import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload, Form, Modal, message, Input, Button } from 'antd'
import { useState } from 'react'

export interface ModalProps {
    visible: boolean;
    recipe?: RECIPES.Recipe;
    onCancel?: () => void
    onOk?: (values: any) => Promise<boolean>
}
const apirest = process.env.API || 'http://localhost'

const FormItem = Form.Item

const ModalEditRecipe = (props: ModalProps) => {
    const { visible, recipe, onCancel, onOk } = props
    const [image, setImage] = useState<{ url?: string, img?: string }>()
    const [loading, setLoading] = useState(false)

    const onChange = (info: any) => {
        setLoading(true)
        if (info.file.status === 'done') {
            setLoading(false)
            setImage({
                url: `temp/${info.file.response.img}`,
                img: info.file.response.img,
            })
            message.success(`${info.file.name} Imagen subirda correctamente`)
        } else if (info.file.status === 'error') {
            setLoading(false)
            message.error(`${info.file.name} error al subir imagen`)
        }
        return false
    }

    const onFinish = async (e: any) => {
        setLoading(true)
        console.log(e);

        if (onOk) {
            const response = await onOk(e)
            if (response) {
                setLoading(false)
                if (onCancel) onCancel()
            }
        }
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Subir</div>
        </div>
    );


    return (
        <Modal
            visible={visible}
            destroyOnClose
            onCancel={onCancel}
            title="Edición Receta"
            footer={false}
            bodyStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={recipe}
            >
                <FormItem label="Imagen" name="img" rules={[{ required: true, message: 'Campo obligatorio' }]} >
                    <Upload
                        name="avatar"
                        headers={{
                            authorization: localStorage.getItem('token') || '',
                        }}
                        action={`${apirest}/parametros/subirimg`}
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={onChange}
                        disabled={loading}
                    >
                        {recipe?.img || image?.url ? <img src={`${apirest}/${image?.url || recipe?.img}`} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </FormItem>
                <FormItem label="Titulo" name="titulo" rules={[{ required: true, message: 'Campo obligatorio' }]}>
                    <Input defaultValue={recipe?.titulo} disabled={loading} />
                </FormItem >
                <FormItem label="Descripción" name="texto" rules={[{ required: true, message: 'Campo obligatorio' }]}>
                    <Input.TextArea defaultValue={recipe?.texto} disabled={loading} />
                </FormItem>
                <FormItem>
                    <Button style={{ marginRight: 20 }} type="ghost" loading={loading} htmlType="reset" onClick={onCancel}>Cancelar</Button>
                    <Button type="primary" htmlType="submit" loading={loading} >Guardar</Button>
                </FormItem>
            </Form>
        </Modal>
    )
}

export default ModalEditRecipe
