import React from "react";
import { Button, Dropdown } from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

interface ExportOptionsProps {
  onExport: (exportType: "excel" | "emailExcel") => void;
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExport,
  loading = false,
  disabled = false,
  style,
}) => {
  const exportMenuItems: MenuProps["items"] = [
    {
      key: "excel",
      label: "Download Excel",
      icon: <FileExcelOutlined />,
      onClick: () => onExport("excel"),
    },
    {
      key: "email",
      label: "Email Report",
      icon: <MailOutlined />,
      onClick: () => onExport("emailExcel"),
    },
  ];

  return (
    <div style={style}>
      <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
        <Button
          icon={<DownloadOutlined />}
          loading={loading}
          disabled={disabled || loading}
          size="small"
        >
          Export
        </Button>
      </Dropdown>
    </div>
  );
};

export default ExportOptions;
