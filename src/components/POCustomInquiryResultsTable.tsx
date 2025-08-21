import { EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type React from 'react';
import { useState } from 'react';
import type { POCustomInquiryData } from '../types';
import styles from './POCustomInquiryResultsTable.module.css';

const { Text } = Typography;

interface POCustomInquiryResultsTableProps {
  data: POCustomInquiryData[];
  loading: boolean;
}

const POCustomInquiryResultsTable: React.FC<POCustomInquiryResultsTableProps> = ({
  data,
  loading,
}) => {
  // State for managing column widths
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    poNumber: 120,
    itemNumber: 120,
    description: 200,
    vendor: 180,
    warehouse: 150,
    carrier: 150,
    shipMethod: 100,
    status: 120,
    vessel: 120,
    voyage: 100,
    portOfEntry: 150,
    etd: 100,
    eta: 100,
    receiptToStock: 120,
    receiver: 100,
    releaseDate: 120,
    originalDocsReceived: 150,
    delivered: 100,
    expectedDeliveryDate: 150,
    orderQty: 100,
    receivedQty: 100,
    balanceQty: 100,
    unitCost: 100,
    extendedCost: 120,
    eInvoiceStatus: 120,
    actions: 100,
  });

  const getStatusColor = (status: string) => {
    if (status.includes('Transit') || status.includes('Shipped')) return 'blue';
    if (status.includes('Delivered') || status.includes('Received')) return 'green';
    if (status.includes('Cancelled') || status.includes('Rejected')) return 'red';
    if (status.includes('Pending') || status.includes('Processing')) return 'orange';
    if (status.includes('Completed')) return 'purple';
    return 'default';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('MM/DD/YYYY');
  };

  const handleColumnResize = (columnKey: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: width,
    }));
  };

  const columns: ColumnsType<POCustomInquiryData> = [
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          PO Number
        </Text>
      ),
      dataIndex: 'poNumber',
      key: 'poNumber',
      width: columnWidths.poNumber,
      fixed: 'left',
      sorter: (a, b) => a.poNumber.localeCompare(b.poNumber),
      render: (poNumber: string) => (
        <Text strong style={{ fontSize: '12px' }}>
          {poNumber}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Item Number
        </Text>
      ),
      dataIndex: 'itemNumber',
      key: 'itemNumber',
      width: columnWidths.itemNumber,
      sorter: (a, b) => a.itemNumber.localeCompare(b.itemNumber),
      render: (itemNumber: string) => (
        <Text style={{ fontSize: '12px' }}>
          {itemNumber}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Description
        </Text>
      ),
      dataIndex: 'description',
      key: 'description',
      width: columnWidths.description,
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip title={description} placement="topLeft">
          <Text style={{ fontSize: '12px' }}>
            {description}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Vendor
        </Text>
      ),
      dataIndex: 'vendor',
      key: 'vendor',
      width: columnWidths.vendor,
      sorter: (a, b) => a.vendor.localeCompare(b.vendor),
      ellipsis: {
        showTitle: false,
      },
      render: (vendor: string) => (
        <Tooltip title={vendor} placement="topLeft">
          <Text style={{ fontSize: '12px' }}>
            {vendor}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Warehouse
        </Text>
      ),
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: columnWidths.warehouse,
      sorter: (a, b) => a.warehouse.localeCompare(b.warehouse),
      render: (warehouse: string) => (
        <Text style={{ fontSize: '12px' }}>
          {warehouse}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Carrier
        </Text>
      ),
      dataIndex: 'carrier',
      key: 'carrier',
      width: columnWidths.carrier,
      sorter: (a, b) => a.carrier.localeCompare(b.carrier),
      render: (carrier: string) => (
        <Text style={{ fontSize: '12px' }}>
          {carrier}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Ship Method
        </Text>
      ),
      dataIndex: 'shipMethod',
      key: 'shipMethod',
      width: columnWidths.shipMethod,
      sorter: (a, b) => a.shipMethod.localeCompare(b.shipMethod),
      render: (shipMethod: string) => (
        <Text style={{ fontSize: '12px' }}>
          {shipMethod}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Status
        </Text>
      ),
      dataIndex: 'status',
      key: 'status',
      width: columnWidths.status,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: '11px' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Vessel
        </Text>
      ),
      dataIndex: 'vessel',
      key: 'vessel',
      width: columnWidths.vessel,
      sorter: (a, b) => a.vessel.localeCompare(b.vessel),
      render: (vessel: string) => (
        <Text style={{ fontSize: '12px' }}>
          {vessel}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Voyage
        </Text>
      ),
      dataIndex: 'voyage',
      key: 'voyage',
      width: columnWidths.voyage,
      sorter: (a, b) => a.voyage.localeCompare(b.voyage),
      render: (voyage: string) => (
        <Text style={{ fontSize: '12px' }}>
          {voyage}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Port of Entry
        </Text>
      ),
      dataIndex: 'portOfEntry',
      key: 'portOfEntry',
      width: columnWidths.portOfEntry,
      sorter: (a, b) => a.portOfEntry.localeCompare(b.portOfEntry),
      render: (portOfEntry: string) => (
        <Text style={{ fontSize: '12px' }}>
          {portOfEntry}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          ETD
        </Text>
      ),
      dataIndex: 'etd',
      key: 'etd',
      width: columnWidths.etd,
      sorter: (a, b) => dayjs(a.etd).unix() - dayjs(b.etd).unix(),
      render: (etd: string) => (
        <Text style={{ fontSize: '12px' }}>
          {formatDate(etd)}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          ETA
        </Text>
      ),
      dataIndex: 'eta',
      key: 'eta',
      width: columnWidths.eta,
      sorter: (a, b) => dayjs(a.eta).unix() - dayjs(b.eta).unix(),
      render: (eta: string) => (
        <Text style={{ fontSize: '12px' }}>
          {formatDate(eta)}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Order Qty
        </Text>
      ),
      dataIndex: 'orderQty',
      key: 'orderQty',
      width: columnWidths.orderQty,
      align: 'right',
      sorter: (a, b) => a.orderQty - b.orderQty,
      render: (orderQty: number) => (
        <Text style={{ fontSize: '12px' }}>
          {orderQty.toLocaleString()}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Received Qty
        </Text>
      ),
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      width: columnWidths.receivedQty,
      align: 'right',
      sorter: (a, b) => a.receivedQty - b.receivedQty,
      render: (receivedQty: number) => (
        <Text style={{ fontSize: '12px' }}>
          {receivedQty.toLocaleString()}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Balance Qty
        </Text>
      ),
      dataIndex: 'balanceQty',
      key: 'balanceQty',
      width: columnWidths.balanceQty,
      align: 'right',
      sorter: (a, b) => a.balanceQty - b.balanceQty,
      render: (balanceQty: number) => (
        <Text style={{ fontSize: '12px', fontWeight: balanceQty > 0 ? 'bold' : 'normal' }}>
          {balanceQty.toLocaleString()}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Unit Cost
        </Text>
      ),
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: columnWidths.unitCost,
      align: 'right',
      sorter: (a, b) => a.unitCost - b.unitCost,
      render: (unitCost: number) => (
        <Text style={{ fontSize: '12px' }}>
          {formatCurrency(unitCost)}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Extended Cost
        </Text>
      ),
      dataIndex: 'extendedCost',
      key: 'extendedCost',
      width: columnWidths.extendedCost,
      align: 'right',
      sorter: (a, b) => a.extendedCost - b.extendedCost,
      render: (extendedCost: number) => (
        <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {formatCurrency(extendedCost)}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          E-Invoice Status
        </Text>
      ),
      dataIndex: 'eInvoiceStatus',
      key: 'eInvoiceStatus',
      width: columnWidths.eInvoiceStatus,
      sorter: (a, b) => a.eInvoiceStatus.localeCompare(b.eInvoiceStatus),
      render: (eInvoiceStatus: string) => (
        <Tag color={getStatusColor(eInvoiceStatus)} style={{ fontSize: '11px' }}>
          {eInvoiceStatus}
        </Tag>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Actions
        </Text>
      ),
      key: 'actions',
      width: columnWidths.actions,
      fixed: 'right',
      render: (_, record) => (
        <div className={styles.actionButtons}>
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => console.log('View details for:', record.poNumber)}
            />
          </Tooltip>
          <Tooltip title="Column Settings">
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => console.log('Column settings')}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record: POCustomInquiryData) => `${record.poNumber}-${record.itemNumber}`}
        scroll={{ x: 2000 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['10', '25', '50', '100'],
          defaultPageSize: 25,
          position: ['bottomCenter'],
          size: 'small',
        }}
        size="small"
        className={styles.customTable}
      />
    </div>
  );
};

export default POCustomInquiryResultsTable;
