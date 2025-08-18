import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Form,
  Typography,
  message,
  Flex,
  Button,
  Switch,
  Divider,
  Breadcrumb
} from "antd";
import {
  SearchOutlined,
  HomeOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import type {
  ProductionSchedProps,
  ProductionSchedSearchFormData,
  FilterValue,
  ProductionSchedData,
} from "../types";
import { apiService, productionSchedApiService, debugProductionScheduleAPIs } from "../services/apiService";
import { ExcelExportService } from "../services/excelExportService";
import ProductionSchedSearchForm from "./ProductionSchedSearchForm";
import ProductionSchedResultsTable from "./ProductionSchedResultsTable";
import ExportOptions from "./ExportOptions";
import ErrorBoundary from "./ErrorBoundary";
import styles from "./ProductionSchedContainer.module.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const ProductionSchedContainer: React.FC<ProductionSchedProps> = ({
  companyCode,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ProductionSchedData[]>([]);
  const [currentSearchCriteria, setCurrentSearchCriteria] = useState<
    Partial<ProductionSchedSearchFormData>
  >({});
  const [filterValues, setFilterValues] = useState<
    Record<string, FilterValue[]>
  >({});
  const [autoCollapseAfterSearch, setAutoCollapseAfterSearch] = useState(true);
  const [searchPanelCollapsed, setSearchPanelCollapsed] = useState(false);

  // Load initial data for all fixed filters
  useEffect(() => {
    console.log("🔗 Using Production Schedule API service");
    loadAllFilterValues();
  }, []);

  const loadAllFilterValues = async () => {
    try {
      console.log("🚀 Starting to load all Production Schedule filter values...");

      // Debug API responses to understand structure
      // await debugProductionScheduleAPIs();

      // Use real API service for Production Schedule

      // Load all filter values in parallel
      const [
        vendorValues,
        warehouseValues,
        productionResourceValues,
        itemClassValues,
        drpValues,
        fcValues,
        officeValues,
      ] = await Promise.all([
        productionSchedApiService.getFilterValues("Vendor"),
        productionSchedApiService.getFilterValues("Warehouse"),
        productionSchedApiService.getFilterValues("ProductionResource"),
        productionSchedApiService.getFilterValues("ItemClass"),
        productionSchedApiService.getFilterValues("DRP"),
        productionSchedApiService.getFilterValues("FC"),
        productionSchedApiService.getFilterValues("Office"),
      ]);

      const newFilterValues: Record<string, FilterValue[]> = {
        vendorValue: vendorValues,
        warehouseValue: warehouseValues,
        productionResourceValue: productionResourceValues,
        itemClassValue: itemClassValues,
        drpValue: drpValues,
        fcValue: fcValues,
        officeValue: officeValues,
      };

      console.log("🎯 Setting Production Schedule filter values state:", newFilterValues);

      // Debug: Log each filter value array
      Object.keys(newFilterValues).forEach(key => {
        console.log(`🔍 Filter ${key}:`, newFilterValues[key]?.length || 0, "items");
        if (newFilterValues[key]?.length > 0) {
          console.log(`🔍 First item in ${key}:`, newFilterValues[key][0]);
        }
      });

      setFilterValues(newFilterValues);
      console.log("✅ All Production Schedule filter values loaded successfully from API");
    } catch (error) {
      console.error("❌ Error loading Production Schedule filter values:", error);
      message.error("Failed to load filter values");
    }
  };

  const handleFieldChange = (fieldId: string, filterKey: string) => {
    // Since we're using fixed labels, we don't need to reload values
    // This function is kept for compatibility but doesn't need to do anything
    console.log(`Production Schedule filter changed: ${fieldId} -> ${filterKey}`);
  };

  const handleSearch = async (values: ProductionSchedSearchFormData) => {
    setLoading(true);
    try {
      console.log("🔍 ProductionSchedContainer - Starting search with real API service:", values);

      // Use real API service for Production Schedule search
      console.log("🔄 ProductionSchedContainer - Calling API service...");
      const results = await productionSchedApiService.searchProductionSchedule(values);

      console.log("✅ ProductionSchedContainer - Search results from API:", results);
      console.log("✅ ProductionSchedContainer - Results type:", typeof results);
      console.log("✅ ProductionSchedContainer - Results length:", Array.isArray(results) ? results.length : 'Not an array');

      setSearchResults(results);
      setCurrentSearchCriteria(values); // Store search criteria for export

      // Auto-collapse search panel if enabled
      if (autoCollapseAfterSearch) {
        setSearchPanelCollapsed(true);
      }

      message.success(`Found ${Array.isArray(results) ? results.length : 0} production schedule items`);
    } catch (error) {
      console.error("🚨 ProductionSchedContainer - Search error:", error);
      message.error("Search failed. Please try again.");
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
          const hideLoading = message.loading("Generating CSV file...", 0);

          try {
            // Simple CSV export for Production Schedule data
            const csvContent = "data:text/csv;charset=utf-8,"
              + "Order Number,Item Number,Description,Item Class,Vendor Number,Vendor Name,Warehouse,Production Resource,Week Number,Planned Qty,Firmed Qty,Shipped Qty,Replaceable Flag\n"
              + searchResults.map(item =>
                `${item.orderNum},"${item.itemNum}","${item.itemDesc}",${item.itemClass},${item.vendorNum},"${item.vendorName}",${item.whse},"${item.productionResource}",${item.wkNum},${item.pQty},${item.fQty},${item.sQty},${item.replaceableFlag}`
              ).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Production_Schedule_Export_${new Date().toISOString().split("T")[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            hideLoading();
            message.success(
              `CSV file downloaded successfully! (${searchResults.length} records)`
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
                title: 'Production Schedule Inquiry',
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
              <ProductionSchedSearchForm
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
                  <ExportOptions
                    onExport={handleExport}
                    loading={exportLoading}
                  />
                </Flex>
              </Flex>
            </div>
            <Divider className={styles.resultsDivider} />
            <ProductionSchedResultsTable data={searchResults} loading={loading} />
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default ProductionSchedContainer;
