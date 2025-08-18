import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Form,
  Typography,
  message,
  Flex,
  Collapse,
  Breadcrumb,
  Switch,
  Button,
  Space,
  Divider,
  Dropdown,
  Checkbox,
  Select
} from "antd";
import {
  SearchOutlined,
  HomeOutlined,
  DownOutlined,
  UpOutlined,
  SettingOutlined,
  CheckOutlined
} from "@ant-design/icons";
import type {
  ItmInquiryDOMProps,
  SearchFormData,
  FilterValue,
  POItemData,
} from "../types";
import { apiService } from "../services/apiService";
import { ExcelExportService } from "../services/excelExportService";
import SearchForm from "./SearchForm";
import ResultsTable from "./ResultsTable";
import ExportOptions from "./ExportOptions";
import styles from "./ItmInquiryDOMContainer.module.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const ItmInquiryDOMContainer: React.FC<ItmInquiryDOMProps> = ({
  companyCode,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<POItemData[]>([]);
  const [currentSearchCriteria, setCurrentSearchCriteria] = useState<
    Partial<SearchFormData>
  >({});
  const [filterValues, setFilterValues] = useState<
    Record<string, FilterValue[]>
  >({});
  const [autoCollapseAfterSearch, setAutoCollapseAfterSearch] = useState(true);
  const [searchPanelCollapsed, setSearchPanelCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'standard' | 'detailed'>('standard');

  // Column management state
  const [selectedViewPreset, setSelectedViewPreset] = useState('Planning View');
  const [visibleColumns, setVisibleColumns] = useState({
    description: true,
    buyer: true,
    vendor: false,
    orderDate: true,
    shipDate: true,
    expectedDelivery: true,
  });

  // Load initial data for all fixed filters
  useEffect(() => {
    // Using real API service
    console.log("🔗 Using real API service");

    // Test API responses to debug the issue
    const testAPIs = async () => {
      try {
        console.log("🧪 CONTAINER - Starting API tests...");

        // Test API responses
        await apiService.testAPIResponses();
      } catch (error) {
        console.error("🚨 CONTAINER - Error testing APIs:", error);
      }
    };

    // Test mock APIs
    testAPIs();

    loadAllFilterValues();
  }, []);

  const loadAllFilterValues = async () => {
    try {
      console.log("🚀 Starting to load all filter values...");
      // Load values for all fixed filter types
      const [buyerValues, vendorValues, statusValues, warehouseValues] =
        await Promise.all([
          apiService.getFilterValues("Buyno"),
          apiService.getFilterValues("pomVendorNum"),
          apiService.getFilterValues("Staic"),
          apiService.getFilterValues("Whse"),
        ]);

      console.log("📋 All filter values loaded:", {
        buyerValues,
        vendorValues,
        statusValues,
        warehouseValues,
      });

      const newFilterValues = {
        buyerValue: buyerValues,
        vendorValue: vendorValues,
        statusValue: statusValues,
        warehouseValue: warehouseValues,
      };

      console.log("🎯 Setting filter values state:", newFilterValues);
      setFilterValues(newFilterValues);
    } catch (error) {
      console.error("❌ Error loading filter values:", error);
      message.error("Failed to load filter values");
    }
  };

  const handleFieldChange = (fieldId: string, filterKey: string) => {
    // Since we're using fixed labels, we don't need to reload values
    // This function is kept for compatibility but doesn't need to do anything
    console.log(`Filter changed: ${fieldId} -> ${filterKey}`);
  };

  const handleSearch = async (values: SearchFormData) => {
    setLoading(true);
    try {
      const results = await apiService.searchPOItems(values);
      setSearchResults(results);
      setCurrentSearchCriteria(values); // Store search criteria for export

      // Auto-collapse search panel if enabled and results found
      if (autoCollapseAfterSearch && results.length > 0) {
        setSearchPanelCollapsed(true);
      }

      message.success(`Found ${results.length} items`);
    } catch (error) {
      message.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (exportType: string) => {
    try {
      switch (exportType) {
        case "excel":
          if (searchResults.length === 0) {
            message.warning(
              "No data to export. Please perform a search first."
            );
            return;
          }

          setExportLoading(true);
          const hideLoading = message.loading("Generating Excel file...", 0);

          try {
            // Use the enhanced export with search criteria
            ExcelExportService.exportWithCriteria(
              searchResults,
              currentSearchCriteria,
              `PO_Items_Export_${new Date().toISOString().split("T")[0]}.xlsx`
            );

            hideLoading();
            message.success(
              `Excel file downloaded successfully! (${searchResults.length} records)`
            );
          } catch (exportError) {
            hideLoading();
            throw exportError;
          } finally {
            setExportLoading(false);
          }
          break;

        case "email":
          message.info("Email functionality coming soon...");
          // Future implementation for email export
          break;

        default:
          message.warning(`Export type "${exportType}" not implemented yet.`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Export failed. Please try again.");
      setExportLoading(false);
    }
  };

  return (
    <Layout className={styles.mainLayout}>
      <Content className={styles.content}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb
            items={[
              {
                href: '/',
                title: <HomeOutlined />,
              },
              {
                href: '/supplier-management',
                title: 'Supplier Management',
              },
              {
                title: 'Domestic PO Item Inquiry',
              },
            ]}
          />
        </div>

        {/* Search Criteria Section */}
        <Card className={styles.searchCard}>
          <div className={styles.searchHeader}>
            <Flex align="center" justify="space-between">
              <Flex align="center" gap="medium">
                <Button
                  type="text"
                  icon={searchPanelCollapsed ? <DownOutlined /> : <UpOutlined />}
                  onClick={() => setSearchPanelCollapsed(!searchPanelCollapsed)}
                  className={styles.collapseButton}
                >
                  <SearchOutlined /> Search Criteria
                </Button>
              </Flex>
              <Flex align="center" gap="medium">
                <Flex align="center" gap="small">
                  <Switch
                    checked={autoCollapseAfterSearch}
                    onChange={setAutoCollapseAfterSearch}
                    size="small"
                  />
                  <Text type="secondary" className={styles.switchLabel}>
                    Auto-collapse after search
                  </Text>
                </Flex>

              </Flex>
            </Flex>
          </div>

          {!searchPanelCollapsed && (
            <>
              <Divider className={styles.searchDivider} />
              <SearchForm
                form={form}
                loading={loading}
                filterValues={filterValues}
                onFieldChange={handleFieldChange}
                onSearch={handleSearch}
              />
            </>
          )}
        </Card>

        {/* Search Results Section */}
        {searchResults.length > 0 && (
          <Card className={styles.resultsCard}>
            <div className={styles.resultsHeader}>
              <Flex align="center" justify="space-between" wrap="wrap" gap="large">
                <Flex align="center" gap="small">
                  <Text strong className={styles.resultsTitle}>
                    Search Results
                  </Text>
                  <Text type="secondary" className={styles.resultsCount}>
                    {searchResults.length} total
                  </Text>
                </Flex>
                <Flex align="center" gap="medium">
                  <Space.Compact>
                    <Button
                      type={currentView === 'standard' ? 'primary' : 'default'}
                      onClick={() => setCurrentView('standard')}
                      size="small"
                    >
                      Standard View
                    </Button>
                    <Button
                      type={currentView === 'detailed' ? 'primary' : 'default'}
                      onClick={() => setCurrentView('detailed')}
                      size="small"
                    >
                      Detailed View
                    </Button>
                  </Space.Compact>
                  <Dropdown
                    trigger={['click']}
                    placement="bottomRight"
                    dropdownRender={() => (
                      <Card
                        size="small"
                        bordered={true}
                        bodyStyle={{ padding: '16px', minWidth: '280px' }}
                      >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                          {/* View Presets Section */}
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text strong>View Presets</Text>
                            <Select
                              value={selectedViewPreset}
                              onChange={setSelectedViewPreset}
                              size="small"
                              suffixIcon={<CheckOutlined />}
                              style={{ width: '100%' }}
                            >
                              <Select.Option value="Planning View">Planning View</Select.Option>
                              <Select.Option value="Default View">Default View</Select.Option>
                              <Select.Option value="Buyer View">Buyer View</Select.Option>
                              <Select.Option value="Receiving View">Receiving View</Select.Option>
                            </Select>
                          </Space>

                          <Divider style={{ margin: '8px 0' }} />

                          {/* Optional Columns Section */}
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text strong>Optional Columns</Text>
                            <Checkbox.Group
                              style={{ width: '100%' }}
                              value={Object.entries(visibleColumns)
                                .filter(([_, checked]) => checked)
                                .map(([key, _]) => key)
                              }
                              onChange={(checkedValues) => {
                                const newColumns = {
                                  description: checkedValues.includes('description'),
                                  buyer: checkedValues.includes('buyer'),
                                  vendor: checkedValues.includes('vendor'),
                                  orderDate: checkedValues.includes('orderDate'),
                                  shipDate: checkedValues.includes('shipDate'),
                                  expectedDelivery: checkedValues.includes('expectedDelivery'),
                                };
                                setVisibleColumns(newColumns);
                              }}
                            >
                              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Checkbox value="description">Description</Checkbox>
                                <Checkbox value="buyer">Buyer</Checkbox>
                                <Checkbox value="vendor">Vendor</Checkbox>
                                <Checkbox value="orderDate">Order Date</Checkbox>
                                <Checkbox value="shipDate">Ship Date</Checkbox>
                                <Checkbox value="expectedDelivery">Expected Delivery</Checkbox>
                              </Space>
                            </Checkbox.Group>
                          </Space>
                        </Space>
                      </Card>
                    )}
                  >
                    <Button icon={<SettingOutlined />} size="small">
                      Columns
                    </Button>
                  </Dropdown>
                  <ExportOptions
                    onExport={handleExport}
                    loading={exportLoading}
                  />
                </Flex>
              </Flex>
            </div>
            <Divider className={styles.resultsDivider} />
            <ResultsTable
              data={searchResults}
              loading={loading}
              viewType={currentView}
            />
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default ItmInquiryDOMContainer;
