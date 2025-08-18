import { createModuleFederationConfig } from "@module-federation/modern-js";

export default createModuleFederationConfig({
  name: "po_item_dom_inquiry",
  manifest: {
    filePath: "static",
  },
  filename: "static/remoteEntry.js",
  exposes: {
    "./po-item-dom-inquiry-content":
      "./src/components/ItmInquiryDOMContainer.tsx",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    antd: { singleton: true, requiredVersion: "^5.26.7" },
  },
});
