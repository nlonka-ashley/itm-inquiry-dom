import { Helmet } from "@modern-js/runtime/head";
import { ConfigProvider, theme } from "antd";
import POsPaidContainer from "../../components/POsPaidContainer";
import "antd/dist/reset.css";

const POsPaidInquiryPage = () => (
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
      <title>POs Paid Inquiry</title>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <POsPaidContainer companyCode="ASHLEY" />
  </ConfigProvider>
);

export default POsPaidInquiryPage;
