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
  Space,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import type React from 'react';
import type { DropdownOption, POCustomInquirySearchFormData } from '../types';

const { Option } = Select;

interface POCustomInquirySearchFormProps {
  form: FormInstance;
  loading: boolean;
  filterValues: Record<string, DropdownOption[]>;
  onVesselChange: (vessel: string) => void;
  onSearch: (values: POCustomInquirySearchFormData) => void;
}

// Date field options matching the original ASP page
const DATE_FIELD_OPTIONS = [
  { value: -1, label: '-All Dates-' },
  { value: 0, label: 'ETD' },
  { value: 1, label: 'ETA' },
  { value: 2, label: 'Receipt to Stock' },
  { value: 3, label: 'Receiver' },
  { value: 4, label: 'Release Date' },
  { value: 5, label: 'Original Docs Received' },
  { value: 6, label: 'Delivered' },
  { value: 7, label: 'Expected Delivery Date' },
];

const POCustomInquirySearchForm: React.FC<POCustomInquirySearchFormProps> = ({
  form,
  loading,
  filterValues,
  onVesselChange,
  onSearch,
}) => {
  const handleFinish = (values: any) => {
    try {
      console.log('🔍 POCustomInquirySearchForm - Form values:', values);

      // Transform form values to search data format
      const searchData: POCustomInquirySearchFormData = {
        item: values.item || '',
        warehouses: values.warehouses || [],
        carriers: values.carriers || [],
        shipMethod: values.shipMethod || '',
        status: values.status || '',
        vendor: values.vendor || '',
        vessel: values.vessel || '',
        voyage: values.voyage || '',
        portOfEntry: values.portOfEntry || [],
        dateField: values.dateField ?? -1,
        dateFrom: values.dateFrom?.format('YYYY-MM-DD') || '',
        dateTo: values.dateTo?.format('YYYY-MM-DD') || '',
        reportType: 'browser', // Default to browser since download options are removed
      };

      console.log('🔍 POCustomInquirySearchForm - Transformed search data:', searchData);
      onSearch(searchData);
    } catch (error) {
      console.error('❌ POCustomInquirySearchForm - Error in handleFinish:', error);
    }
  };

  const handleReset = () => {
    try {
      console.log('🔄 POCustomInquirySearchForm - Resetting form');
      form.resetFields();
    } catch (error) {
      console.error('❌ POCustomInquirySearchForm - Error in handleReset:', error);
    }
  };

  const handleVesselChange = (vessel: string) => {
    try {
      console.log('🔄 POCustomInquirySearchForm - Vessel changed:', vessel);
      // Reset voyage when vessel changes
      form.setFieldValue('voyage', '');
      onVesselChange(vessel);
    } catch (error) {
      console.error('❌ POCustomInquirySearchForm - Error in handleVesselChange:', error);
    }
  };

  const handleDateFieldChange = (dateField: number) => {
    try {
      console.log('🔄 POCustomInquirySearchForm - Date field changed:', dateField);
      // Reset date values when date field changes to "All Dates"
      if (dateField === -1) {
        form.setFieldsValue({
          dateFrom: null,
          dateTo: null,
        });
      }
    } catch (error) {
      console.error('❌ POCustomInquirySearchForm - Error in handleDateFieldChange:', error);
    }
  };

  const isDateFieldSelected = Form.useWatch('dateField', form) !== -1;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      size="small"
      initialValues={{
        dateField: -1,
      }}
    >
      {/* First Row - Item, Vendor, Warehouses, and Date Field */}
      <Row gutter={[24, 16]} justify="center">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Item" name="item">
            <Input
              placeholder="Enter item number"
              allowClear
              size="small"
              maxLength={15}
            />
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
            >
              {filterValues.vendors?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Warehouses" name="warehouses">
            <Select
              mode="multiple"
              placeholder="Select warehouses"
              allowClear
              showSearch
              size="small"
              optionFilterProp="children"
            >
              {filterValues.warehouses?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Date Field" name="dateField">
            <Select
              placeholder="Select date field"
              size="small"
              onChange={handleDateFieldChange}
            >
              {DATE_FIELD_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Second Row - Date From and Date To (only if date field is selected) */}
      {isDateFieldSelected && (
        <Row gutter={[24, 16]} justify="center">
          <Col xs={24} sm={16} md={10} lg={8}>
            <Form.Item label="Date From" name="dateFrom">
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
            <Form.Item label="Date To" name="dateTo">
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
      )}

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
                {/* First Row - Carriers, Ship Method, Status */}
                <Row gutter={[24, 16]} justify="center">
                  <Col xs={24} sm={12} md={8} lg={8}>
                    <Form.Item label="Carriers" name="carriers">
                      <Select
                        mode="multiple"
                        placeholder="Select carriers"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {filterValues.carriers?.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8}>
                    <Form.Item label="Ship Method" name="shipMethod">
                      <Select
                        placeholder="Select ship method"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {filterValues.shipMethods?.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8}>
                    <Form.Item label="Status" name="status">
                      <Select
                        placeholder="Select status"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {filterValues.statuses?.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Second Row - Vessel, Voyage, Port of Entry */}
                <Row gutter={[24, 16]} justify="center">
                  <Col xs={24} sm={12} md={8} lg={8}>
                    <Form.Item label="Vessel" name="vessel">
                      <Select
                        placeholder="Select vessel"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={handleVesselChange}
                      >
                        {filterValues.vessels?.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8}>
                    <Form.Item label="Voyage" name="voyage">
                      <Select
                        placeholder="Select voyage"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {filterValues.voyages?.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8}>
                    <Form.Item label="Port of Entry" name="portOfEntry">
                      <Select
                        mode="multiple"
                        placeholder="Select port of entry"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {filterValues.portOfEntry?.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
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
  );
};

export default POCustomInquirySearchForm;
