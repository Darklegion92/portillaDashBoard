declare namespace RECIPES {
    type Recipe = {
        id: number;
        img: string;
        titulo: string;
        texto: string;
    }
    type ParamsPut = {
        id?: number;
        data: {
            titulo: string;
            texto: string;
        };
        img: string | null;
        imgant?: string;

    }
}