import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import { Card, Col, message, Row } from 'antd';
import type { ModalProps } from './components/ModalEditRecipe';
import ModalEditRecipe from './components/ModalEditRecipe';


const apirest = process.env.API || 'http://localhost'

const styles = {
    col1: {
        width: '14%',
        cursor: 'pointer',
    },
    col2: {
        width: '28%',
        cursor: 'pointer',
    },
}

const Orders = (): React.ReactNode => {
    const [recipes, serRecipes] = useState<RECIPES.Recipe[] | []>([])
    const [modal, setModal] = useState<ModalProps>({
        visible: false,
    })
    const getRecipes = async () => {

        const response = await axios.get(`${apirest}/parametros/recomendaciones`, {
            headers: {
                authorization: localStorage.getItem('token') || '',
            }
        })
        if (response.status === 200) {
            serRecipes(response.data)
        }
    }

    useEffect(() => {
        getRecipes()
    }, [])

    const showModal = (position: number) => {
        setModal({
            visible: true,
            recipe: recipes[position]
        })
    }

    const closeModal = () => {
        setModal({ visible: false })
    }

    const createAndUpdateRecipe = async (values: any) => {

        const img = values.img !== modal.recipe?.img ? values.img.file.response.img : undefined

        const params: RECIPES.ParamsPut = {
            id: modal.recipe?.id,
            img: null,
            data: {
                titulo: values.titulo,
                texto: values.texto,
            },
        }

        if (img) {
            params.img = img
            params.imgant = modal.recipe?.img
        }

        const response = await axios.put(`${apirest}/parametros/recomendaciones`, params, {
            headers: {
                authorization: localStorage.getItem('token') || '',
            }
        })

        if (response.status === 200) {
            message.success("Receta creada correctamente")
            getRecipes()
            return true
        }
        return false

    }

    const renderRecipes = () => {
        return (
            <Card style={{ padding: '8% 16%' }}>
                {recipes.length > 0 && <Row wrap>
                    <div style={styles.col2}><img onClick={() => showModal(0)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[0].img}`} /></div>
                    <div style={styles.col1}><img onClick={() => showModal(1)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[1].img}`} /></div>
                    <div style={styles.col2}><img onClick={() => showModal(2)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[2].img}`} /></div>
                    <div style={styles.col2}><img onClick={() => showModal(3)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[3].img}`} /></div>
                    <div style={styles.col1}><img onClick={() => showModal(4)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[4].img}`} /></div>
                    <div style={styles.col2}><img onClick={() => showModal(5)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[5].img}`} /></div>
                    <div style={styles.col1}><img onClick={() => showModal(3)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[6].img}`} /></div>
                    <div style={styles.col2}><img onClick={() => showModal(7)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[7].img}`} /></div>
                    <div style={styles.col1}><img onClick={() => showModal(8)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[8].img}`} /></div>
                    <div style={styles.col2}><img onClick={() => showModal(9)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[9].img}`} /></div>
                    <div style={styles.col2}><img onClick={() => showModal(10)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[10].img}`} /></div>
                    <div style={styles.col1}><img onClick={() => showModal(11)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[11].img}`} /></div>
                    <div style={styles.col2}><img onClick={() => showModal(12)} width="100%" style={{ height: "100%" }} src={`${apirest}/${recipes[12].img}`} /></div>
                </Row>}
            </Card>
        )
    }

    return (
        <PageContainer title={
            <>Sección de Recetas</>
        }>
            {renderRecipes()}
            <ModalEditRecipe {...modal} onOk={createAndUpdateRecipe} onCancel={closeModal} />
        </PageContainer>
    )
}

export default Orders