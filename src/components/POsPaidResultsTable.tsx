import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { POsPaidData } from '../types';
import styles from './ResultsTable.module.css';

const { Text } = Typography;

interface POsPaidResultsTableProps {
  data: POsPaidData[];
  loading: boolean;
}

const POsPaidResultsTable: React.FC<POsPaidResultsTableProps> = ({
  data,
  loading,
}) => {
  const [sortedInfo, setSortedInfo] = useState<any>({});

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    console.log('📊 POsPaidResultsTable - Table change:', {
      pagination,
      filters,
      sorter,
    });
    setSortedInfo(sorter);
  };

  const handlePODetailClick = (poNumber: string) => {
    console.log('🔍 POsPaidResultsTable - PO Detail clicked:', poNumber);
    // TODO: Implement navigation to PO Detail page
    // This would typically navigate to PODetail.asp?Ordno=${poNumber}
    alert(`Navigate to PO Detail for: ${poNumber}`);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString || dateString.trim() === '') return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    } catch {
      return dateString;
    }
  };

  const getPaymentStatusTag = (paymentTerms: string, datePaid: string) => {
    if (paymentTerms === 'Free Of Charge FOC') {
      return <Tag color="orange">Ineligible</Tag>;
    }
    if (datePaid && datePaid.trim() !== '') {
      return <Tag color="green">Paid</Tag>;
    }
    return <Tag color="blue">Pending</Tag>;
  };

  const columns: ColumnsType<POsPaidData> = useMemo(
    () => [
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Vendor
          </Typography.Text>
        ),
        dataIndex: 'vendor',
        key: 'vendor',
        width: 270,
        sorter: (a, b) => a.vendor.localeCompare(b.vendor),
        sortOrder: sortedInfo.columnKey === 'vendor' ? sortedInfo.order : null,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <Typography.Text style={{ fontSize: '12px', maxWidth: 250 }}>
              {text}
            </Typography.Text>
          </Tooltip>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Vendor Number
          </Typography.Text>
        ),
        dataIndex: 'vendorNum',
        key: 'vendorNum',
        width: 80,
        sorter: (a, b) => a.vendorNum.localeCompare(b.vendorNum),
        sortOrder:
          sortedInfo.columnKey === 'vendorNum' ? sortedInfo.order : null,
        render: text => (
          <Typography.Text style={{ fontSize: '12px' }}>{text}</Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Warehouse
          </Typography.Text>
        ),
        dataIndex: 'warehouse',
        key: 'warehouse',
        width: 80,
        sorter: (a, b) => a.warehouse.localeCompare(b.warehouse),
        sortOrder:
          sortedInfo.columnKey === 'warehouse' ? sortedInfo.order : null,
        render: text => (
          <Typography.Text style={{ fontSize: '12px' }}>{text}</Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Buying Entity
          </Typography.Text>
        ),
        dataIndex: 'buyingEntity',
        key: 'buyingEntity',
        width: 80,
        sorter: (a, b) => a.buyingEntity.localeCompare(b.buyingEntity),
        sortOrder:
          sortedInfo.columnKey === 'buyingEntity' ? sortedInfo.order : null,
        render: text => (
          <Typography.Text style={{ fontSize: '12px' }}>{text}</Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            PO #
          </Typography.Text>
        ),
        dataIndex: 'pomOrderNum',
        key: 'pomOrderNum',
        width: 80,
        sorter: (a, b) => a.pomOrderNum.localeCompare(b.pomOrderNum),
        sortOrder:
          sortedInfo.columnKey === 'pomOrderNum' ? sortedInfo.order : null,
        render: text => (
          <Button
            type="link"
            size="small"
            onClick={() => handlePODetailClick(text)}
            style={{ fontSize: '12px', padding: 0 }}
            title="Click to view PO Detail"
          >
            {text}
          </Button>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Date Paid
          </Typography.Text>
        ),
        dataIndex: 'pomDatePaid',
        key: 'pomDatePaid',
        width: 90,
        sorter: (a, b) =>
          new Date(a.pomDatePaid).getTime() - new Date(b.pomDatePaid).getTime(),
        sortOrder:
          sortedInfo.columnKey === 'pomDatePaid' ? sortedInfo.order : null,
        render: (text, record) => {
          if (record.paymentTerms === 'Free Of Charge FOC') {
            return (
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Ineligible
              </Typography.Text>
            );
          }
          return (
            <Typography.Text style={{ fontSize: '12px' }}>
              {formatDate(text)}
            </Typography.Text>
          );
        },
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Currency Code
          </Typography.Text>
        ),
        dataIndex: 'currencyCode',
        key: 'currencyCode',
        width: 50,
        align: 'center',
        sorter: (a, b) => a.currencyCode.localeCompare(b.currencyCode),
        sortOrder:
          sortedInfo.columnKey === 'currencyCode' ? sortedInfo.order : null,
        render: text => (
          <Typography.Text style={{ fontSize: '12px' }}>{text}</Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Order Amount
          </Typography.Text>
        ),
        dataIndex: 'orderAmount',
        key: 'orderAmount',
        width: 100,
        align: 'right',
        sorter: (a, b) => a.orderAmount - b.orderAmount,
        sortOrder:
          sortedInfo.columnKey === 'orderAmount' ? sortedInfo.order : null,
        render: amount => (
          <Typography.Text style={{ fontSize: '12px' }}>
            {formatCurrency(amount)}
          </Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Total Adjustments
          </Typography.Text>
        ),
        dataIndex: 'totalAdjustments',
        key: 'totalAdjustments',
        width: 100,
        align: 'right',
        sorter: (a, b) => a.totalAdjustments - b.totalAdjustments,
        sortOrder:
          sortedInfo.columnKey === 'totalAdjustments' ? sortedInfo.order : null,
        render: amount => (
          <Typography.Text
            style={{
              fontSize: '12px',
              color:
                amount < 0 ? '#ff4d4f' : amount > 0 ? '#52c41a' : 'inherit',
            }}
          >
            {formatCurrency(amount)}
          </Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Total Paid
          </Typography.Text>
        ),
        dataIndex: 'totalPaid',
        key: 'totalPaid',
        width: 100,
        align: 'right',
        sorter: (a, b) => a.totalPaid - b.totalPaid,
        sortOrder:
          sortedInfo.columnKey === 'totalPaid' ? sortedInfo.order : null,
        render: amount => (
          <Typography.Text
            strong
            style={{ fontSize: '12px', color: '#1890ff' }}
          >
            {formatCurrency(amount)}
          </Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            PO Status
          </Typography.Text>
        ),
        dataIndex: 'poStatus',
        key: 'poStatus',
        width: 100,
        sorter: (a, b) => a.poStatus.localeCompare(b.poStatus),
        sortOrder:
          sortedInfo.columnKey === 'poStatus' ? sortedInfo.order : null,
        render: (status, record) =>
          getPaymentStatusTag(record.paymentTerms, record.pomDatePaid),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            ETD Date
          </Typography.Text>
        ),
        dataIndex: 'etdDate',
        key: 'etdDate',
        width: 75,
        sorter: (a, b) =>
          new Date(a.etdDate).getTime() - new Date(b.etdDate).getTime(),
        sortOrder: sortedInfo.columnKey === 'etdDate' ? sortedInfo.order : null,
        render: text => (
          <Typography.Text style={{ fontSize: '12px' }}>
            {formatDate(text)}
          </Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            ETA Date
          </Typography.Text>
        ),
        dataIndex: 'etaDate',
        key: 'etaDate',
        width: 75,
        sorter: (a, b) =>
          new Date(a.etaDate).getTime() - new Date(b.etaDate).getTime(),
        sortOrder: sortedInfo.columnKey === 'etaDate' ? sortedInfo.order : null,
        render: text => (
          <Typography.Text style={{ fontSize: '12px' }}>
            {formatDate(text)}
          </Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            On Board Date
          </Typography.Text>
        ),
        dataIndex: 'onboard',
        key: 'onboard',
        width: 75,
        sorter: (a, b) =>
          new Date(a.onboard).getTime() - new Date(b.onboard).getTime(),
        sortOrder: sortedInfo.columnKey === 'onboard' ? sortedInfo.order : null,
        render: text => (
          <Typography.Text style={{ fontSize: '12px' }}>
            {formatDate(text)}
          </Typography.Text>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Payment Terms
          </Typography.Text>
        ),
        dataIndex: 'paymentTerms',
        key: 'paymentTerms',
        width: 75,
        sorter: (a, b) => a.paymentTerms.localeCompare(b.paymentTerms),
        sortOrder:
          sortedInfo.columnKey === 'paymentTerms' ? sortedInfo.order : null,
        ellipsis: {
          showTitle: false,
        },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <Typography.Text style={{ fontSize: '12px', maxWidth: 70 }}>
              {text}
            </Typography.Text>
          </Tooltip>
        ),
      },
      {
        title: (
          <Typography.Text strong style={{ fontSize: '12px' }}>
            Pmt Approved Date
          </Typography.Text>
        ),
        dataIndex: 'pmtApproveDate',
        key: 'pmtApproveDate',
        width: 90,
        sorter: (a, b) =>
          new Date(a.pmtApproveDate).getTime() -
          new Date(b.pmtApproveDate).getTime(),
        sortOrder:
          sortedInfo.columnKey === 'pmtApproveDate' ? sortedInfo.order : null,
        render: text => (
          <Typography.Text style={{ fontSize: '12px' }}>
            {formatDate(text)}
          </Typography.Text>
        ),
      },
    ],
    [sortedInfo],
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={(record: POsPaidData) =>
        `${record.pomOrderNum}-${record.vendorNum}`
      }
      onChange={handleTableChange}
      scroll={{ x: 1200 }}
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
    />
  );
};

export default POsPaidResultsTable;
