    declare namespace ORDERS {
    type State = {
        id: number;
        nombre: string;
    };
    type Order = {

        id: number;
        idcliente: null;
        total: number;
        finalizada: number;
        nombrecliente: string;
        apellidoscliente: string;
        telefonocliente: string;
        telefono2cliente: null;
        idtipo_documento: number;
        documentocliente: string;
        direccioncliente: string;
        idbarrio: null;
        idtipo_pago: number;
        numeropago: string;
        idestado_pago: number;
        idestado: number;
        fecha: string;
        estadopago: string;
        cliente: string;
        estado: string;
        detalles: Detalle[];
    }

    type Detalle = {
        id: number;
        codigoarticulo: string;
        preciound: number;
        cantidad: number;
        nombrearticulo: string;
        embalajearticulo: string;
        idorden: number;
        img: string;
    }
}