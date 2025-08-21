import {
  DownOutlined,
  HomeOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Layout,
  Switch,
  Typography,
  message,
} from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { poCustomInquiryApiService } from '../services/apiService';
import type {
  DropdownOption,
  POCustomInquiryData,
  POCustomInquiryProps,
  POCustomInquirySearchFormData,
} from '../types';
import ErrorBoundary from './ErrorBoundary';
import ExportOptions from './ExportOptions';
import styles from './POCustomInquiryContainer.module.css';
import POCustomInquiryResultsTable from './POCustomInquiryResultsTable';
import POCustomInquirySearchForm from './POCustomInquirySearchForm';

const { Content } = Layout;
const { Title, Text } = Typography;

const POCustomInquiryContainer: React.FC<POCustomInquiryProps> = ({
  companyCode,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<POCustomInquiryData[]>([]);
  const [currentSearchCriteria, setCurrentSearchCriteria] = useState<
    Partial<POCustomInquirySearchFormData>
  >({});
  const [filterValues, setFilterValues] = useState<
    Record<string, DropdownOption[]>
  >({});
  const [autoCollapseAfterSearch, setAutoCollapseAfterSearch] = useState(true);
  const [searchPanelCollapsed, setSearchPanelCollapsed] = useState(false);

  // Load filter values on component mount
  useEffect(() => {
    const loadFilterValues = async () => {
      try {
        console.log('🔄 Loading PO Custom Inquiry filter values...');

        const filterTypes = [
          'warehouses',
          'carriers',
          'shipMethods',
          'statuses',
          'vendors',
          'vessels',
          'portOfEntry',
        ];

        const filterPromises = filterTypes.map(async (filterType) => {
          const values = await poCustomInquiryApiService.getFilterValues(filterType);
          return { filterType, values };
        });

        const results = await Promise.all(filterPromises);
        const newFilterValues: Record<string, DropdownOption[]> = {};

        results.forEach(({ filterType, values }) => {
          newFilterValues[filterType] = values;
        });

        setFilterValues(newFilterValues);
        console.log('✅ Filter values loaded successfully');
      } catch (error) {
        console.error('❌ Error loading filter values:', error);
        message.error('Failed to load filter options');
      }
    };

    loadFilterValues();
  }, []);

  // Handle vessel selection change to load voyages
  const handleVesselChange = async (vessel: string) => {
    try {
      console.log('🔄 Loading voyages for vessel:', vessel);
      const voyages = await poCustomInquiryApiService.getVoyages(vessel);
      setFilterValues(prev => ({
        ...prev,
        voyages,
      }));
    } catch (error) {
      console.error('❌ Error loading voyages:', error);
      message.error('Failed to load voyages');
    }
  };

  const handleSearch = async (values: POCustomInquirySearchFormData) => {
    setLoading(true);
    try {
      console.log('🔍 POCustomInquiryContainer - Search initiated with:', values);

      // TODO: Implement actual API call
      // For now, return mock data
      const mockResults: POCustomInquiryData[] = [
        {
          poNumber: 'PO001234',
          itemNumber: 'ITEM001',
          description: 'Sample Item Description',
          vendor: 'VENDOR001 - Sample Vendor',
          warehouse: 'WH001 - Main Warehouse',
          carrier: 'CARR001 - Sample Carrier',
          shipMethod: 'Ocean',
          status: 'In Transit',
          vessel: 'VESSEL001',
          voyage: 'V001',
          portOfEntry: 'PORT001 - Sample Port',
          etd: '2024-01-15',
          eta: '2024-02-15',
          receiptToStock: '',
          receiver: '',
          releaseDate: '2024-01-10',
          originalDocsReceived: '',
          delivered: '',
          expectedDeliveryDate: '2024-02-20',
          orderQty: 100,
          receivedQty: 0,
          balanceQty: 100,
          unitCost: 25.50,
          extendedCost: 2550.00,
          eInvoiceStatus: 'Pending',
        },
      ];

      setSearchResults(mockResults);
      setCurrentSearchCriteria(values); // Store search criteria for export

      // Auto-collapse search panel if enabled and results found
      if (autoCollapseAfterSearch && mockResults.length > 0) {
        setSearchPanelCollapsed(true);
      }

      message.success(`Found ${mockResults.length} items`);
    } catch (error) {
      console.error('❌ Search failed:', error);
      message.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (exportType: string) => {
    try {
      switch (exportType) {
        case 'excel': {
          if (searchResults.length === 0) {
            message.warning(
              'No data to export. Please perform a search first.',
            );
            return;
          }

          setExportLoading(true);
          const hideLoading = message.loading('Generating CSV file...', 0);

          try {
            // CSV export for PO Custom Inquiry data
            const csvContent = `data:text/csv;charset=utf-8,PO Number,Item Number,Description,Item Class,Vendor Number,Vendor Name,Warehouse,Status,Quantity,Unit Price,Extended Price,Due Date\n${searchResults
              .map(
                item =>
                  `${item.poNumber},"${item.itemNumber}","${item.description}",${item.itemClass},${item.vendorNumber},"${item.vendorName}",${item.warehouse},"${item.status}",${item.quantity},${item.unitPrice},${item.extendedPrice},"${item.dueDate}"`,
              )
              .join('\n')}`;

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute(
              'download',
              `PO_Custom_Inquiry_Export_${new Date().toISOString().split('T')[0]}.csv`,
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            hideLoading();
            message.success(
              `CSV file downloaded successfully! (${searchResults.length} records)`,
            );
          } catch (exportError) {
            hideLoading();
            throw exportError;
          } finally {
            setExportLoading(false);
          }
          break;
        }

        case 'emailExcel':
          message.info('Email functionality coming soon...');
          // Future implementation for email export
          break;

        default:
          message.warning(`Export type "${exportType}" not implemented yet.`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      message.error('Export failed. Please try again.');
      setExportLoading(false);
    }
  };

  return (
    <ErrorBoundary>
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
                  title: 'Inquiry',
                },
                {
                  title: 'PO Customizable Inquiry',
                },
              ]}
            />
          </div>

          {/* Search Panel */}
          <Card className={styles.searchCard}>
            <div className={styles.searchHeader}>
              <Flex
                align="center"
                justify="space-between"
                wrap="wrap"
                gap="large"
              >
                <Flex align="center" gap="small">
                  <Button
                    type="link"
                    icon={searchPanelCollapsed ? <DownOutlined /> : <UpOutlined />}
                    onClick={() => setSearchPanelCollapsed(!searchPanelCollapsed)}
                    className={styles.collapseButton}
                  >
                    Search Criteria
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
                <POCustomInquirySearchForm
                  form={form}
                  loading={loading}
                  filterValues={filterValues}
                  onVesselChange={handleVesselChange}
                  onSearch={handleSearch}
                />
              </>
            )}
          </Card>

          {/* Search Results Section */}
          {searchResults.length > 0 && (
            <Card className={styles.resultsCard}>
              <div className={styles.resultsHeader}>
                <Flex
                  align="center"
                  justify="space-between"
                  wrap="wrap"
                  gap="large"
                >
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
              <POCustomInquiryResultsTable
                data={searchResults}
                loading={loading}
              />
            </Card>
          )}
        </Content>
      </Layout>
    </ErrorBoundary>
  );
};

export default POCustomInquiryContainer;
