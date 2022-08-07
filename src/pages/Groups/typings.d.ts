declare namespace PRODUCTS {
  type Product = {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    lista: string;
    precio: number;
    embalaje: string;
    clasificacion: number;
    categoria: string;
    idgrupo: number;
    idsubgrupo: number;
    idmarca: number;
    rank: number;
    dcto1: number;
    cant_dcto1: number;
    dcto2: number;
    cant_dcto2: number;
    dcto3: number;
    cant_dcto3: number;
    img: string;
    incremento: number;
    estado: number;
  };
  type Group = {
    id: number;
    nombre: string;
    subgrupos: Subgrupo[];
  };

  type Subgroup = {
    id: number;
    nombre: string;
    idgrupo: number;
  };
  type Brand = {
    id: number;
    nombre: string;
  };
}
