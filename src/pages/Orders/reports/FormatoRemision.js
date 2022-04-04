import React from 'react';
import './styles.css';

export default class FormatoFactura extends React.Component {
  render() {
    const formato = new Intl.NumberFormat('en-Us');
    const { Header, Body } = this.props.datos;

    return Header && Body ? (
      <div className="formato-facturaventa">
        <div className="encabezado">
          <div style={{ fontSize: '40px' }}>ORDEN DE PEDIDO</div>
          <div>Cliente: {Header.nombre}</div>
          <div>Documento: {Header.documento}</div>
          <div>Teléfono: {Header.telefono}</div>
          <div>Direccion: {Header.direccion}</div>
        </div>
        <div className="cuerpo">
          <div className="columnas">
            <div style={{ width: '15%' }}>Código</div>
            <div style={{ width: '40%' }}>Descripción</div>
            <div style={{ width: '8%' }}>Cant</div>
            <div style={{ width: '12%' }}>V. Un</div>
            <div style={{ width: '15%' }}>V. Total</div>
          </div>
          {Body.length > 0 &&
            Body.map((dato) => {
              return (
                <div className="fila">
                  <div style={{ width: '15%' }}>{dato.codigoarticulo}</div>
                  <div style={{ width: '40%' }}>{dato.nombrearticulo}</div>
                  <div style={{ width: '8%' }}>{dato.cantidad}</div>
                  <div style={{ width: '12%' }}>{dato.preciound}</div>
                  <div style={{ width: '15%' }}>
                    {formato.format(dato.cantidad * dato.preciound)}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="pie">
          <div style={{ fontSize: '30px', 'text-align': 'right', paddingRight: 40 }}>
            <span>Total:</span> {formato.format(Header.total)}
          </div>
          <div style={{ fontSize: '10px', 'font-weight': 'bold' }}>
            SOLTEC-Tecnología y Desarrollo
          </div>
        </div>
      </div>
    ) : (
      <div>Sin Datos</div>
    );
  }
}
