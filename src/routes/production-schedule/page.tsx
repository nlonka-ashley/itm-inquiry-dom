import { Helmet } from '@modern-js/runtime/head';
import { ConfigProvider, theme } from 'antd';
import ProductionSchedContainer from '../../components/ProductionSchedContainer';
import 'antd/dist/reset.css';

const ProductionSchedulePage = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        colorBgLayout: '#f5f5f5',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
      },
    }}
  >
    <Helmet>
      <title>Production Schedule Inquiry</title>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <ProductionSchedContainer companyCode="ASHLEY" />
  </ConfigProvider>
);

export default ProductionSchedulePage;
