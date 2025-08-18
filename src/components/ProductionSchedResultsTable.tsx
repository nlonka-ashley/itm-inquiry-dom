import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { ProductionSchedData } from '../types';
import styles from './ResultsTable.module.css';

const { Text } = Typography;

interface ProductionSchedResultsTableProps {
  data: ProductionSchedData[];
  loading: boolean;
}

const ProductionSchedResultsTable: React.FC<
  ProductionSchedResultsTableProps
> = ({ data, loading }) => {
  const [columnWidths, setColumnWidths] = useState({
    items: 120,
    vendor: 80,
    type: 80,
    week1: 60,
    week2: 60,
    week3: 60,
    week4: 60,
    week5: 60,
    week6: 60,
    week7: 60,
    week8: 60,
    week9: 60,
    week10: 60,
    week11: 60,
    week12: 60,
  });

  // Transform data to group by item and create rows for each order type
  const transformedData = useMemo(() => {
    const grouped: { [key: string]: ProductionSchedData[] } = {};

    // Group by item number
    data.forEach(item => {
      if (!grouped[item.itemNum]) {
        grouped[item.itemNum] = [];
      }
      grouped[item.itemNum].push(item);
    });

    // Create rows for each item with different order types in specific order
    const result: ProductionSchedData[] = [];
    Object.keys(grouped)
      .sort()
      .forEach(itemNum => {
        const itemGroup = grouped[itemNum];
        const orderTypes = ['Firmed', 'Shipped', 'Planned']; // Specific order for proper merging

        orderTypes.forEach(orderType => {
          const existingItem = itemGroup.find(
            item => item.orderType === orderType,
          );
          if (existingItem) {
            result.push(existingItem);
          } else {
            // Create empty row for missing order type
            const baseItem = itemGroup[0];
            result.push({
              ...baseItem,
              orderType: orderType,
              weeklyData: {},
              orderNum: `${baseItem.orderNum}-${orderType}`,
            });
          }
        });
      });

    return result;
  }, [data]);

  // Format quantity with proper number formatting
  const formatQuantity = (qty: number) => {
    return qty ? qty.toLocaleString() : '0';
  };

  // Generate week columns dynamically
  const generateWeekColumns = () => {
    const weekColumns = [];
    const weekDates = [
      '7/5',
      '7/12',
      '7/19',
      '7/26',
      '8/2',
      '8/9',
      '8/16',
      '8/23',
      '8/30',
      '9/6',
      '9/13',
      '9/20',
    ];
    const weekNumbers = [
      'Week -2',
      'Week -1',
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4',
      'Week 5',
      'Week 6',
      'Week 7',
      'Week 8',
      'Week 9',
      'Week 10',
    ];

    for (let i = 0; i < 12; i++) {
      weekColumns.push({
        title: (
          <div style={{ textAlign: 'center' }}>
            <Text strong style={{ fontSize: '12px', display: 'block' }}>
              {weekDates[i]}
            </Text>
            <Text type="secondary" style={{ fontSize: '10px' }}>
              {weekNumbers[i]}
            </Text>
          </div>
        ),
        dataIndex: `week${i + 1}`,
        key: `week${i + 1}`,
        width: columnWidths[`week${i + 1}` as keyof typeof columnWidths] || 60,
        align: 'center' as const,
        render: (value: number, record: ProductionSchedData) => {
          const qty = record.weeklyData?.[`week${i + 1}`] || 0;
          return (
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: qty > 0 ? 'bold' : 'normal',
              }}
            >
              {qty > 0 ? qty : '0'}
            </Text>
          );
        },
      });
    }
    return weekColumns;
  };

  const columns: ColumnsType<ProductionSchedData> = [
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Items
        </Text>
      ),
      dataIndex: 'itemNum',
      key: 'itemNum',
      width: columnWidths.items,
      fixed: 'left',
      onCell: (record: ProductionSchedData, index?: number) => {
        // Calculate rowspan for item merging
        if (record.orderType === 'Firmed') {
          return { rowSpan: 3 }; // Merge 3 rows (Firmed, Shipped, Planned)
        }
        return { rowSpan: 0 }; // Hide cell for other order types
      },
      render: (itemNum: string) => (
        <Text strong style={{ fontSize: '12px' }}>
          {itemNum}
        </Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Vendor
        </Text>
      ),
      dataIndex: 'vendorNum',
      key: 'vendorNum',
      width: columnWidths.vendor,
      fixed: 'left',
      onCell: (record: ProductionSchedData, index?: number) => {
        // Calculate rowspan for vendor merging
        if (record.orderType === 'Firmed') {
          return { rowSpan: 3 }; // Merge 3 rows (Firmed, Shipped, Planned)
        }
        return { rowSpan: 0 }; // Hide cell for other order types
      },
      render: (vendorNum: string) => (
        <Text style={{ fontSize: '12px' }}>{vendorNum}</Text>
      ),
    },
    {
      title: (
        <Text strong className={styles.columnHeaderText}>
          Type
        </Text>
      ),
      dataIndex: 'orderType',
      key: 'orderType',
      width: columnWidths.type,
      fixed: 'left',
      render: (orderType: string) => {
        let color = '#f0f0f0';
        let textColor = '#000';

        if (orderType === 'Firmed') {
          color = '#d4edda';
          textColor = '#155724';
        } else if (orderType === 'Shipped') {
          color = '#fff3cd';
          textColor = '#856404';
        } else if (orderType === 'Planned') {
          color = '#cce7ff';
          textColor = '#004085';
        }

        return (
          <div
            style={{
              backgroundColor: color,
              color: textColor,
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {orderType}
          </div>
        );
      },
    },
    ...generateWeekColumns(),
  ];

  return (
    <div className={styles.tableContainer}>
      <Table
        columns={columns}
        dataSource={transformedData}
        loading={loading}
        rowKey={record => `${record.itemNum}-${record.orderType}`}
        scroll={{ x: 1200, y: 600 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['12', '24', '48', '96'],
          defaultPageSize: 24, // Show 8 items (8 * 3 rows = 24)
          position: ['bottomCenter'],
        }}
        size="small"
        bordered
        className={styles.productionSchedTable}
        rowClassName={record => {
          // Add row styling based on order type
          if (record.orderType === 'Firmed') {
            return `${styles.firmedRow}`;
          }
          if (record.orderType === 'Shipped') {
            return `${styles.shippedRow}`;
          }
          if (record.orderType === 'Planned') {
            return `${styles.plannedRow}`;
          }
          return '';
        }}
      />
    </div>
  );
};

export default ProductionSchedResultsTable;
