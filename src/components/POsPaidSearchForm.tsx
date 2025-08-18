import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Switch,
  Typography,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import React from 'react';
import type {
  DateFieldOption,
  FilterValue,
  POsPaidSearchFormData,
} from '../types';

const { Text } = Typography;

const { Option } = Select;
const { RangePicker } = DatePicker;

interface POsPaidSearchFormProps {
  form: FormInstance;
  loading: boolean;
  filterValues: Record<string, FilterValue[]>;
  onFieldChange: (fieldId: string, filterKey: string) => void;
  onSearch: (values: POsPaidSearchFormData) => void;
  searchPanelCollapsed?: boolean;
  onSearchPanelToggle?: () => void;
  autoCollapseAfterSearch?: boolean;
  onAutoCollapseToggle?: (checked: boolean) => void;
}

// Date field options matching the Classic ASP implementation
const dateFieldOptions: DateFieldOption[] = [
  { value: '-1', label: 'All Dates', fieldId: -1 },
  { value: '0', label: 'PO Date', fieldId: 0 },
  { value: '1', label: 'ETD', fieldId: 1 },
  { value: '2', label: 'ETA', fieldId: 2 },
  { value: '3', label: 'On Board', fieldId: 3 },
  { value: '4', label: 'Pmt Approved', fieldId: 4 },
  { value: '5', label: 'Vendor Paid', fieldId: 5 },
];

const POsPaidSearchForm: React.FC<POsPaidSearchFormProps> = ({
  form,
  loading,
  filterValues,
  onFieldChange,
  onSearch,
  searchPanelCollapsed = false,
  onSearchPanelToggle,
  autoCollapseAfterSearch = false,
  onAutoCollapseToggle,
}) => {
  const [showDateRange, setShowDateRange] = React.useState(false);

  const handleFinish = (values: any) => {
    try {
      console.log('🔍 POsPaidSearchForm - Form values:', values);

      // Handle date range
      let dateFrom = '';
      let dateTo = '';
      if (values.dateRange && values.dateRange.length === 2) {
        dateFrom = values.dateRange[0].format('MM/DD/YYYY');
        dateTo = values.dateRange[1].format('MM/DD/YYYY');
      }

      const searchData: POsPaidSearchFormData = {
        itemNumber: values.itemNumber || '*',
        warehouse: values.warehouse || '',
        status: values.status || '',
        vendor: values.vendor || '',
        dateField: values.dateField || '-1',
        dateFrom,
        dateTo,
        reportType: values.reportType || 'browser',
      };

      console.log('🔍 POsPaidSearchForm - Calling onSearch with:', searchData);
      onSearch(searchData);
    } catch (error) {
      console.error('❌ POsPaidSearchForm - Error in handleFinish:', error);
    }
  };

  const handleReset = () => {
    try {
      console.log('🔄 POsPaidSearchForm - Resetting form');
      form.resetFields();
      setShowDateRange(false);
    } catch (error) {
      console.error('❌ POsPaidSearchForm - Error in handleReset:', error);
    }
  };

  const handleDateFieldChange = (value: string) => {
    console.log('📅 POsPaidSearchForm - Date field changed:', value);
    setShowDateRange(value !== '-1');
    onFieldChange('dateField', value);
  };

  return (
    <Card
      style={{
        margin: '16px auto',
        maxWidth: '1240px',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '20px',
      }}
    >
      {/* Search Criteria Header with Toggle */}
      <div style={{ marginBottom: '16px' }}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="medium">
            <Button
              type="text"
              icon={searchPanelCollapsed ? <DownOutlined /> : <UpOutlined />}
              onClick={onSearchPanelToggle}
              style={{
                padding: '4px 8px',
                fontWeight: '500',
                color: '#1890ff',
              }}
            >
              <SearchOutlined /> Search Criteria
            </Button>
          </Flex>
          <Flex align="center" gap="medium">
            <Flex align="center" gap="small">
              <Switch
                checked={autoCollapseAfterSearch}
                onChange={onAutoCollapseToggle}
                size="small"
              />
              <Text
                type="secondary"
                style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
              >
                Auto-collapse after search
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </div>

      {/* Search Form */}
      {!searchPanelCollapsed && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          size="small"
          initialValues={{
            itemNumber: '*',
            dateField: '-1',
            reportType: 'browser',
          }}
        >
          {/* First Row - Item Number, Date Field, and Date Range */}
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label="Item Number"
                name="itemNumber"
                rules={[
                  { required: true, message: 'Please enter an item number!' },
                  {
                    max: 15,
                    message: 'Item number cannot exceed 15 characters',
                  },
                ]}
              >
                <Input
                  placeholder="Enter item number or * for all"
                  allowClear
                  size="small"
                  maxLength={15}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Date Field" name="dateField">
                <Select
                  placeholder="Select date field"
                  size="small"
                  onChange={handleDateFieldChange}
                >
                  {dateFieldOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {showDateRange && (
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Date Range" name="dateRange">
                  <RangePicker
                    format="MM/DD/YYYY"
                    placeholder={['From Date', 'To Date']}
                    size="small"
                    allowClear
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* Advanced Search Options */}
          <Collapse
            ghost
            size="small"
            items={[
              {
                key: 'advanced',
                label: 'Advanced Search Options',
                children: (
                  <>
                    {/* Single Row - Warehouse, Status, and Vendor */}
                    <Row gutter={[16, 16]} justify="center">
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item label="Warehouse" name="warehouse">
                          <Select
                            placeholder="Select warehouse"
                            allowClear
                            showSearch
                            size="small"
                            optionFilterProp="children"
                            onChange={value =>
                              onFieldChange('warehouse', value || '')
                            }
                          >
                            {filterValues.warehouseValue?.map(item => (
                              <Option key={item.filterId} value={item.filterId}>
                                {item.filterDesc
                                  ? `${item.filterDesc} (${item.filterId})`
                                  : `None (${item.filterId})`}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item label="Status" name="status">
                          <Select
                            placeholder="Select status"
                            allowClear
                            showSearch
                            size="small"
                            optionFilterProp="children"
                            onChange={value =>
                              onFieldChange('status', value || '')
                            }
                          >
                            {filterValues.statusValue?.map(item => (
                              <Option key={item.filterId} value={item.filterId}>
                                {item.filterDesc
                                  ? `${item.filterDesc} (${item.filterId})`
                                  : `None (${item.filterId})`}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item label="Vendor" name="vendor">
                          <Select
                            placeholder="Select vendor"
                            allowClear
                            showSearch
                            size="small"
                            optionFilterProp="children"
                            onChange={value =>
                              onFieldChange('vendor', value || '')
                            }
                          >
                            {filterValues.vendorValue?.map(item => (
                              <Option key={item.filterId} value={item.filterId}>
                                {item.filterDesc
                                  ? `${item.filterDesc} (${item.filterId})`
                                  : `None (${item.filterId})`}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ),
              },
            ]}
          />

          {/* Action Buttons */}
          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <Button onClick={handleReset} disabled={loading} size="small">
                Clear All
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SearchOutlined />}
                size="small"
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Card>
  );
};

export default POsPaidSearchForm;
