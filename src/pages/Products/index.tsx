import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';

const apirest = process.env.API || 'http://localhost'


const Products = (): React.ReactNode => {
    const [products, setProducts] = useState([])

    const getProducts = async (name?: string) => {
        const response = await axios.get(`${apirest}/products`)
        console.log(response);

    }

    useEffect(() => {
        getProducts()
    }, [])

    return (
        <PageContainer>

        </PageContainer>
    )
}

export default Products