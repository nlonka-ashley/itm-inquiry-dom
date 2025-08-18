import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Select,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import type React from 'react';
import type { FilterValue, ProductionSchedSearchFormData } from '../types';

const { Option } = Select;

interface ProductionSchedSearchFormProps {
  form: FormInstance;
  loading: boolean;
  filterValues: Record<string, FilterValue[]>;
  onFieldChange: (fieldId: string, filterKey: string) => void;
  onSearch: (values: ProductionSchedSearchFormData) => void;
}

const ProductionSchedSearchForm: React.FC<ProductionSchedSearchFormProps> = ({
  form,
  loading,
  filterValues,
  onFieldChange,
  onSearch,
}) => {
  // Add error boundary for this component
  if (!form || !onSearch) {
    console.error('❌ ProductionSchedSearchForm: Missing required props');
    return <div>Error: Missing required props</div>;
  }
  const handleFinish = (values: any) => {
    try {
      console.log('🔍 ProductionSchedSearchForm - Form submission:', values);

      // Create filter rows from form values
      const filterRows: any[] = [];

      if (values.itemNumber) {
        // Add wildcard character '%' to item number for partial matching
        const itemNumberWithWildcard = `${values.itemNumber.trim()}%`;
        filterRows.push({
          id: 'item',
          fieldType: 'Item',
          comparisonOperator: 'equals',
          filterValue: itemNumberWithWildcard,
          isActive: true,
        });
      }

      // Always add vendor filter with "ALL" as default if no value selected
      filterRows.push({
        id: 'vendor',
        fieldType: 'Vendor',
        comparisonOperator: 'equals',
        filterValue: values.vendor || 'ALL',
        isActive: true,
      });

      // Always add warehouse filter with "ALL" as default if no value selected
      filterRows.push({
        id: 'warehouse',
        fieldType: 'Warehouse',
        comparisonOperator: 'equals',
        filterValue: values.warehouse || 'ALL',
        isActive: true,
      });

      // Always add DRP planner filter with "ALL" as default if no value selected
      filterRows.push({
        id: 'drp',
        fieldType: 'DRP',
        comparisonOperator: 'equals',
        filterValue: values.drpPlanner || 'ALL',
        isActive: true,
      });

      // Always add FC planner filter with "ALL" as default if no value selected
      filterRows.push({
        id: 'fc',
        fieldType: 'FC',
        comparisonOperator: 'equals',
        filterValue: values.fcPlanner || 'ALL',
        isActive: true,
      });

      if (values.office) {
        filterRows.push({
          id: 'office',
          fieldType: 'Office',
          comparisonOperator: 'equals',
          filterValue: values.office,
          isActive: true,
        });
      }

      if (values.productionResource) {
        filterRows.push({
          id: 'productionResource',
          fieldType: 'ProductionResource',
          comparisonOperator: 'equals',
          filterValue: values.productionResource,
          isActive: true,
        });
      }

      if (values.itemClass) {
        filterRows.push({
          id: 'itemClass',
          fieldType: 'ItemClass',
          comparisonOperator: 'equals',
          filterValue: values.itemClass,
          isActive: true,
        });
      }

      const searchData: ProductionSchedSearchFormData = {
        filterRows,
        orderTypeFilters: {
          plannedOrders: values.plannedOrders ?? true,
          firmedOrders: values.firmedOrders ?? true,
          shippedOrders: values.shippedOrders ?? true,
        },
        timePeriod: {
          pastWeeks: values.pastWeeks ?? 4,
          futureWeeks: values.futureWeeks ?? 12,
        },
        reportOptions: {
          reportBy: values.reportBy ?? 'itemQty',
          containerDirectFilter: values.containerDirectFilter ?? false,
          rpFilter: values.rpFilter ?? false,
          groupByWarehouse: false, // Removed from UI but required by type
        },
        reportType: values.reportType || 'browser',
      };

      console.log(
        '🔍 ProductionSchedSearchForm - Calling onSearch with:',
        searchData,
      );
      onSearch(searchData);
    } catch (error) {
      console.error(
        '❌ ProductionSchedSearchForm - Error in handleFinish:',
        error,
      );
    }
  };

  const handleReset = () => {
    try {
      console.log('🔄 ProductionSchedSearchForm - Resetting form');
      form.resetFields();
    } catch (error) {
      console.error(
        '❌ ProductionSchedSearchForm - Error in handleReset:',
        error,
      );
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      size="small"
      initialValues={{
        plannedOrders: true,
        firmedOrders: true,
        shippedOrders: true,
        pastWeeks: 4,
        futureWeeks: 12,
        reportBy: 'itemQty',
        containerDirectFilter: false,
        rpFilter: false,
        reportType: 'browser',
      }}
    >
      {/* First Row - Item Number, Vendor, and Warehouse */}
      <Row gutter={[24, 16]} justify="center">
        <Col xs={24} sm={16} md={10} lg={8}>
          <Form.Item label="Item Number" name="itemNumber">
            <Input placeholder="Enter item number" allowClear size="small" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={8}>
          <Form.Item label="Vendor" name="vendor">
            <Select
              placeholder="Select vendor"
              allowClear
              showSearch
              size="small"
              optionFilterProp="children"
              onChange={() => onFieldChange('Vendor', 'vendorValue')}
            >
              {(filterValues.vendorValue || [])
                .filter(
                  value =>
                    value &&
                    value.filterId !== undefined &&
                    value.filterId !== null,
                )
                .filter(
                  value => value.filterDesc && value.filterDesc.trim() !== '',
                )
                .map((value, index) => (
                  <Select.Option
                    key={`vendor-${value.filterId}-${index}`}
                    value={value.filterId}
                  >
                    {`${value.filterDesc} (${value.filterId})`}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={16} md={10} lg={8}>
          <Form.Item label="Warehouse" name="warehouse">
            <Select
              placeholder="Select warehouse"
              allowClear
              showSearch
              size="small"
              optionFilterProp="children"
              onChange={() => onFieldChange('Warehouse', 'warehouseValue')}
            >
              {(filterValues.warehouseValue || [])
                .filter(
                  value =>
                    value &&
                    value.filterId !== undefined &&
                    value.filterId !== null,
                )
                .filter(
                  value => value.filterDesc && value.filterDesc.trim() !== '',
                )
                .map((value, index) => (
                  <Select.Option
                    key={`warehouse-${value.filterId}-${index}`}
                    value={value.filterId}
                  >
                    {`${value.filterDesc} (${value.filterId})`}
                  </Select.Option>
                ))}
            </Select>
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
                {/* First Row - Report By, Past Weeks, Future Weeks, and Production Resource */}
                <Row gutter={[24, 16]} justify="center">
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="Report By" name="reportBy">
                      <Select size="small" placeholder="Select report grouping">
                        <Option value="itemQty">Item Qty</Option>
                        <Option value="containers">Containers</Option>
                        <Option value="feus">FEUs</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="Past Weeks" name="pastWeeks">
                      <Select
                        placeholder="Select past weeks"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          week => (
                            <Option key={week} value={week}>
                              {week}
                            </Option>
                          ),
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="Future Weeks" name="futureWeeks">
                      <Select
                        placeholder="Select future weeks"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                      >
                        {Array.from({ length: 36 }, (_, i) => i + 1).map(
                          week => (
                            <Option key={week} value={week}>
                              {week}
                            </Option>
                          ),
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                      label="Production Resource"
                      name="productionResource"
                    >
                      <Select
                        placeholder="Select production resource"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={() =>
                          onFieldChange(
                            'ProductionResource',
                            'productionResourceValue',
                          )
                        }
                      >
                        {(filterValues.productionResourceValue || [])
                          .filter(
                            value =>
                              value &&
                              value.filterId !== undefined &&
                              value.filterId !== null,
                          )
                          .filter(
                            value =>
                              value.filterDesc &&
                              value.filterDesc.trim() !== '',
                          )
                          .map((value, index) => (
                            <Select.Option
                              key={`production-resource-${value.filterId}-${index}`}
                              value={value.filterId}
                            >
                              {`${value.filterDesc} (${value.filterId})`}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Second Row - DRP Planner, FC Planner, Office, and Item Class */}
                <Row gutter={[24, 16]} justify="center">
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="DRP Planner" name="drpPlanner">
                      <Select
                        placeholder="Select DRP planner"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={() => onFieldChange('DRP', 'drpValue')}
                      >
                        {(filterValues.drpValue || [])
                          .filter(
                            value =>
                              value &&
                              value.filterId !== undefined &&
                              value.filterId !== null,
                          )
                          .filter(
                            value =>
                              value.filterDesc &&
                              value.filterDesc.trim() !== '',
                          )
                          .map((value, index) => (
                            <Select.Option
                              key={`drp-${value.filterId}-${index}`}
                              value={value.filterId}
                            >
                              {`${value.filterDesc} (${value.filterId})`}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="FC Planner" name="fcPlanner">
                      <Select
                        placeholder="Select forecast planner"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={() => onFieldChange('FC', 'fcValue')}
                      >
                        {(filterValues.fcValue || [])
                          .filter(
                            value =>
                              value &&
                              value.filterId !== undefined &&
                              value.filterId !== null,
                          )
                          .filter(
                            value =>
                              value.filterDesc &&
                              value.filterDesc.trim() !== '',
                          )
                          .map((value, index) => (
                            <Select.Option
                              key={`fc-${value.filterId}-${index}`}
                              value={value.filterId}
                            >
                              {`${value.filterDesc} (${value.filterId})`}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="Office" name="office">
                      <Select
                        mode="multiple"
                        placeholder="Select office(s)"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={() => onFieldChange('Office', 'officeValue')}
                      >
                        {(filterValues.officeValue || [])
                          .filter(
                            value =>
                              value &&
                              value.filterId !== undefined &&
                              value.filterId !== null,
                          )
                          .filter(
                            value =>
                              value.filterDesc &&
                              value.filterDesc.trim() !== '',
                          )
                          .map((value, index) => (
                            <Select.Option
                              key={`office-${value.filterId}-${index}`}
                              value={value.filterId}
                            >
                              {`${value.filterDesc} (${value.filterId})`}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="Item Class" name="itemClass">
                      <Select
                        placeholder="Select item class"
                        allowClear
                        showSearch
                        size="small"
                        optionFilterProp="children"
                        onChange={() =>
                          onFieldChange('ItemClass', 'itemClassValue')
                        }
                      >
                        {(filterValues.itemClassValue || [])
                          .filter(
                            value =>
                              value &&
                              value.filterId !== undefined &&
                              value.filterId !== null,
                          )
                          .filter(
                            value =>
                              value.filterId && value.filterId.trim() !== '',
                          )
                          .map((value, index) => (
                            <Select.Option
                              key={`item-class-${value.filterId}-${index}`}
                              value={value.filterId}
                            >
                              {value.filterId}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Third Row - Filter Options and Order Types (Combined) */}
                <Row gutter={[24, 16]} justify="center">
                  <Col xs={24} sm={20} md={16} lg={12}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: 'bold',
                        }}
                      >
                        Filter Options
                      </label>
                      <Row gutter={[4, 4]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="rpFilter"
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Checkbox>RP Filter</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="containerDirectFilter"
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Checkbox>C&CNW Filter</Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={24} sm={20} md={16} lg={12}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: 'bold',
                        }}
                      >
                        Order Types
                      </label>
                      <Row gutter={[16, 8]}>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            name="plannedOrders"
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Checkbox>Planned Orders</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            name="firmedOrders"
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Checkbox>Firmed Orders</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            name="shippedOrders"
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Checkbox>Shipped Orders</Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
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

export default ProductionSchedSearchForm;
