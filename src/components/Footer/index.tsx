import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const defaultMessage = "Creado por SOLTEC Tecnología y Desarrollo";

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      links={[]}
      copyright={`${currentYear} ${defaultMessage}`}
    />
  );
};
