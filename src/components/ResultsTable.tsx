import React, { useState } from "react";
import { Table, Tag, Button, Tooltip, Typography, Row, Col, Space } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { POItemData } from "../types";
import dayjs from "dayjs";
import styles from "./ResultsTable.module.css";

// Resizable column component for Ant Design Table
const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <th
      {...restProps}
      className={`${restProps.className || ""} ${styles.resizableHeader}`}
    >
      {restProps.children}
      <div
        className={styles.resizeHandle}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent event bubbling to header click

          const startX = e.clientX;
          const startWidth = width;
          let hasMoved = false;

          const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            hasMoved = true;
            const newWidth = Math.max(50, startWidth + e.clientX - startX);
            onResize(newWidth);
          };

          const handleMouseUp = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            // Prevent any click events from firing after resize
            if (hasMoved) {
              setTimeout(() => {
                document.body.style.userSelect = "";
              }, 100);
            }
          };

          // Disable text selection during resize
          document.body.style.userSelect = "none";
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent sorting when clicking resize handle
        }}
      />
    </th>
  );
};

interface ResultsTableProps {
  data: POItemData[];
  loading: boolean;
  viewType?: 'standard' | 'detailed';
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data, loading, viewType = 'standard' }) => {
  // State for managing column widths
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    poNumber: 100,
    itemNumber: 100,
    description: 180,
    orderQty: 90,
    orderQtyOpen: 100,
    releaseQty: 90,
    releaseQtyOpen: 100,
    dueDate: 100,
    buyer: 130,
    vendor: 150,
    status: 110,
    warehouse: 150,
    actions: 90,
  });

  const getStatusColor = (status: string) => {
    if (status.includes("On-Order")) return "blue";
    if (status.includes("In-Transit")) return "orange";
    if (status.includes("Received")) return "green";
    if (status.includes("Cancelled")) return "red";
    if (status.includes("Completed")) return "purple";
    return "default";
  };

  const handleEditPO = (ordno: string) => {
    console.log("Edit PO:", ordno);
    // Implementation for editing PO
  };

  const handleResize = (key: string) => (width: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [key]: width,
    }));
  };

  // Detailed view expandable row content
  const expandedRowRender = (record: POItemData) => (
    <div style={{ padding: '12px 16px', backgroundColor: '#fafafa' }}>
      <Row gutter={[24, 8]}>
        <Col span={6}>
          <Typography.Text strong style={{ fontSize: '12px' }}>RP/PO Qty:</Typography.Text>
          <Typography.Text style={{ fontSize: '12px', marginLeft: 8 }}>
            {record.orderQty?.toLocaleString() || '0'}
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Typography.Text strong style={{ fontSize: '12px' }}>Intransit Qty:</Typography.Text>
          <Typography.Text style={{ fontSize: '12px', marginLeft: 8 }}>
            {record.intransitQty?.toLocaleString() || '0'}
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Typography.Text strong style={{ fontSize: '12px' }}>Inspection Qty:</Typography.Text>
          <Typography.Text style={{ fontSize: '12px', marginLeft: 8 }}>
            {record.stockQty?.toLocaleString() || '0'}
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Typography.Text strong style={{ fontSize: '12px' }}>VR Qty:</Typography.Text>
          <Typography.Text style={{ fontSize: '12px', marginLeft: 8 }}>0</Typography.Text>
        </Col>
      </Row>
      <Row gutter={[24, 8]} style={{ marginTop: 8 }}>
        <Col span={6}>
          <Typography.Text strong style={{ fontSize: '12px' }}>Ship Date:</Typography.Text>
          <Typography.Text style={{ fontSize: '12px', marginLeft: 8 }}>
            {record.due ? dayjs(record.due).format('MM/DD/YYYY') : 'N/A'}
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Typography.Text strong style={{ fontSize: '12px' }}>Buyer:</Typography.Text>
          <Typography.Text style={{ fontSize: '12px', marginLeft: 8 }}>
            {`${record.buyerFirstName} ${record.buyerLastName}` || 'N/A'}
          </Typography.Text>
        </Col>
        <Col span={12}>
          <Typography.Text strong style={{ fontSize: '12px' }}>Vendor:</Typography.Text>
          <Typography.Text style={{ fontSize: '12px', marginLeft: 8 }}>
            {record.vname || 'N/A'}
          </Typography.Text>
        </Col>
      </Row>
    </div>
  );

  // Detailed view columns (simplified for expandable rows)
  const detailedColumns: ColumnsType<POItemData> = [
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>PO Number</Typography.Text>,
      dataIndex: "poNumber",
      key: "poNumber",
      width: 120,
      sorter: (a, b) => a.poNumber.localeCompare(b.poNumber),
      render: (poNumber: string) => (
        <Button type="link" size="small" style={{ fontSize: '12px', padding: 0 }}>
          {poNumber}
        </Button>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Item Number</Typography.Text>,
      dataIndex: "itemNumber",
      key: "itemNumber",
      width: 100,
      sorter: (a, b) => a.itemNumber.localeCompare(b.itemNumber),
      render: (text: string) => (
        <Typography.Text style={{ fontSize: '12px' }}>{text}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Order Qty</Typography.Text>,
      dataIndex: "orderQty",
      key: "orderQty",
      width: 90,
      align: "right",
      sorter: (a, b) => a.orderQty - b.orderQty,
      render: (qty: number) => (
        <Typography.Text style={{ fontSize: '12px' }}>{qty?.toLocaleString() || '0'}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Open Qty</Typography.Text>,
      dataIndex: "orderQtyOpen",
      key: "orderQtyOpen",
      width: 90,
      align: "right",
      sorter: (a, b) => a.orderQtyOpen - b.orderQtyOpen,
      render: (qty: number) => (
        <Typography.Text style={{ fontSize: '12px' }}>{qty?.toLocaleString() || '0'}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Due Date</Typography.Text>,
      dataIndex: "due",
      key: "due",
      width: 100,
      sorter: (a, b) => dayjs(a.due).unix() - dayjs(b.due).unix(),
      render: (date: string) => (
        <Typography.Text style={{ fontSize: '12px' }}>
          {date ? dayjs(date).format("MM/DD/YYYY") : 'N/A'}
        </Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Status</Typography.Text>,
      dataIndex: "procStatusDesc",
      key: "status",
      width: 120,
      sorter: (a, b) => a.procStatusDesc.localeCompare(b.procStatusDesc),
      render: (_, record: POItemData) => {
        const statusText = record.procStatusDesc?.replace(/^PO is in\s*/i, "") || "Unknown";
        return (
          <Tag color={getStatusColor(statusText)} style={{ fontSize: '11px' }}>
            {statusText}
          </Tag>
        );
      },
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Warehouse</Typography.Text>,
      dataIndex: "whse",
      key: "warehouse",
      width: 100,
      sorter: (a, b) => a.whse.localeCompare(b.whse),
      render: (text: string) => (
        <Typography.Text style={{ fontSize: '12px' }}>{text}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Actions</Typography.Text>,
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit PO">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Standard view columns (same as detailed but without expand)
  const standardColumns: ColumnsType<POItemData> = [
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>PO Number</Typography.Text>,
      dataIndex: "poNumber",
      key: "poNumber",
      width: 120,
      sorter: (a, b) => a.poNumber.localeCompare(b.poNumber),
      render: (poNumber: string) => (
        <Button type="link" size="small" style={{ fontSize: '12px', padding: 0 }}>
          {poNumber}
        </Button>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Item Number</Typography.Text>,
      dataIndex: "itemNumber",
      key: "itemNumber",
      width: 100,
      sorter: (a, b) => a.itemNumber.localeCompare(b.itemNumber),
      render: (text: string) => (
        <Typography.Text style={{ fontSize: '12px' }}>{text}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Order Qty</Typography.Text>,
      dataIndex: "orderQty",
      key: "orderQty",
      width: 90,
      align: "right",
      sorter: (a, b) => a.orderQty - b.orderQty,
      render: (qty: number) => (
        <Typography.Text style={{ fontSize: '12px' }}>{qty?.toLocaleString() || '0'}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Open Qty</Typography.Text>,
      dataIndex: "orderQtyOpen",
      key: "orderQtyOpen",
      width: 90,
      align: "right",
      sorter: (a, b) => a.orderQtyOpen - b.orderQtyOpen,
      render: (qty: number) => (
        <Typography.Text style={{ fontSize: '12px' }}>{qty?.toLocaleString() || '0'}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Due Date</Typography.Text>,
      dataIndex: "due",
      key: "due",
      width: 100,
      sorter: (a, b) => dayjs(a.due).unix() - dayjs(b.due).unix(),
      render: (date: string) => (
        <Typography.Text style={{ fontSize: '12px' }}>
          {date ? dayjs(date).format("MM/DD/YYYY") : 'N/A'}
        </Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Status</Typography.Text>,
      dataIndex: "procStatusDesc",
      key: "status",
      width: 120,
      sorter: (a, b) => a.procStatusDesc.localeCompare(b.procStatusDesc),
      render: (_, record: POItemData) => {
        const statusText = record.procStatusDesc?.replace(/^PO is in\s*/i, "") || "Unknown";
        return (
          <Tag color={getStatusColor(statusText)} style={{ fontSize: '11px' }}>
            {statusText}
          </Tag>
        );
      },
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Warehouse</Typography.Text>,
      dataIndex: "whse",
      key: "warehouse",
      width: 100,
      sorter: (a, b) => a.whse.localeCompare(b.whse),
      render: (text: string) => (
        <Typography.Text style={{ fontSize: '12px' }}>{text}</Typography.Text>
      ),
    },
    {
      title: <Typography.Text strong style={{ fontSize: '12px' }}>Actions</Typography.Text>,
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit PO">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columns: ColumnsType<POItemData> = viewType === 'detailed' ? detailedColumns : standardColumns;

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={(record: POItemData) => `${record.poNumber}-${record.itemNumber}`}
      scroll={{ x: 1200 }}
      expandable={viewType === 'detailed' ? {
        expandedRowRender,
        defaultExpandAllRows: false,
        expandRowByClick: false,
      } : undefined}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} of ${total} items`,
        pageSizeOptions: ["10", "25", "50", "100"],
        defaultPageSize: 25,
        position: ["bottomCenter"],
        size: "small",
      }}
      size="small"
    />
  );
};

export default ResultsTable;
