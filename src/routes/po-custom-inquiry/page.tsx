import { Helmet } from '@modern-js/runtime/head';
import { ConfigProvider, theme } from 'antd';
import POCustomInquiryContainer from '../../components/POCustomInquiryContainer';
import 'antd/dist/reset.css';

const POCustomInquiryPage = () => (
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
      <title>PO Customizable Inquiry</title>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <POCustomInquiryContainer companyCode="ASHLEY" />
  </ConfigProvider>
);

export default POCustomInquiryPage;
