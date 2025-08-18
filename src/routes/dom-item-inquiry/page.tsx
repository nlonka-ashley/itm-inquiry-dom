import { Helmet } from "@modern-js/runtime/head";
import { ConfigProvider, theme } from "antd";
import ItmInquiryDOMContainer from "../../components/ItmInquiryDOMContainer";
import "antd/dist/reset.css";

const DomItemInquiryPage = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        colorBgLayout: "#f5f5f5",
        colorBgContainer: "#ffffff",
        colorBgElevated: "#ffffff",
      },
    }}
  >
    <Helmet>
      <title>Domestic PO Item Inquiry</title>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <ItmInquiryDOMContainer companyCode="ASHLEY" />
  </ConfigProvider>
);

export default DomItemInquiryPage;
