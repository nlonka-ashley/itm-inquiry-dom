import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import type React from 'react';
import type { FilterValue, SearchFormData } from '../types';

interface SearchFormProps {
  form: FormInstance;
  loading: boolean;
  filterValues: Record<string, FilterValue[]>;
  onFieldChange: (fieldId: string, filterKey: string) => void;
  onSearch: (values: SearchFormData) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  form,
  loading,
  filterValues,
  onFieldChange,
  onSearch,
}) => {
  const handleFinish = (values: any) => {
    // Transform individual date fields to proper format
    const searchData: SearchFormData = {
      ...values,
      dueDateFrom: values.dueDateFrom?.format('YYYY-MM-DD'),
      dueDateTo: values.dueDateTo?.format('YYYY-MM-DD'),
      reportType: values.reportType || 'browser',
    };

    console.log('🔍 SearchForm - Form values:', values);
    console.log('🔍 SearchForm - Transformed search data:', searchData);

    onSearch(searchData);
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} size="small">
      {/* First Row - Item Number and Date Range */}
      <Row gutter={[24, 16]} justify="center">
        <Col xs={24} sm={16} md={10} lg={8}>
          <Form.Item label="Item Number" name="itemNumber">
            <Input
              placeholder="Enter item number or description"
              allowClear
              size="small"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={8}>
          <Form.Item label="Due Date From" name="dueDateFrom">
            <DatePicker
              placeholder="Select start date"
              size="small"
              format="YYYY-MM-DD"
              allowClear
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={8}>
          <Form.Item label="Due Date To" name="dueDateTo">
            <DatePicker
              placeholder="Select end date"
              size="small"
              format="YYYY-MM-DD"
              allowClear
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
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
                {/* Single Row - 4 Columns: Buyer, Vendor, Warehouse, Status */}
                <Row gutter={[16, 16]} justify="center">
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item label="Buyer" name="buyer">
                      <Select
                        placeholder="Select buyer"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {(filterValues.buyerValue || []).map(value => (
                          <Select.Option
                            key={value.filterId}
                            value={value.filterId}
                          >
                            {value.filterDesc
                              ? `${value.filterDesc} (${value.filterId})`
                              : `None (${value.filterId})`}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item label="Vendor" name="vendor">
                      <Select
                        placeholder="Select vendor"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {(filterValues.vendorValue || []).map(value => (
                          <Select.Option
                            key={value.filterId}
                            value={value.filterId}
                          >
                            {value.filterDesc
                              ? `${value.filterDesc} (${value.filterId})`
                              : `None (${value.filterId})`}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item label="Warehouse" name="warehouse">
                      <Select
                        placeholder="Select warehouse"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {(filterValues.warehouseValue || []).map(value => (
                          <Select.Option
                            key={value.filterId}
                            value={value.filterId}
                          >
                            {value.filterDesc
                              ? `${value.filterDesc} (${value.filterId})`
                              : `None (${value.filterId})`}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item label="Status (Multi-select)" name="status">
                      <Select
                        mode="multiple"
                        placeholder="Select status"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        maxTagCount="responsive"
                      >
                        <Select.Option value="05">
                          05 - Cfm Required
                        </Select.Option>
                        <Select.Option value="10">10 - On Order</Select.Option>
                        <Select.Option value="20">
                          20 - In Transit
                        </Select.Option>
                        <Select.Option value="30">
                          30 - Rc to Inspect
                        </Select.Option>
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
  );
};

export default SearchForm;
