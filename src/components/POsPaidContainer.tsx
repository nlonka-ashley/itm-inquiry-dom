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
  Space,
  Switch,
  Typography,
  message,
} from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { apiService, posPaidApiService } from '../services/apiService';
import { ExcelExportService } from '../services/excelExportService';
import type {
  FilterValue,
  POsPaidData,
  POsPaidProps,
  POsPaidSearchFormData,
} from '../types';
import ErrorBoundary from './ErrorBoundary';
import ExportOptions from './ExportOptions';
import POsPaidResultsTable from './POsPaidResultsTable';
import POsPaidSearchForm from './POsPaidSearchForm';

const { Content } = Layout;
const { Title } = Typography;

const POsPaidContainer: React.FC<POsPaidProps> = ({
  companyCode = 'ASHLEY',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<POsPaidData[]>([]);
  const [filterValues, setFilterValues] = useState<
    Record<string, FilterValue[]>
  >({});
  const [searchPanelCollapsed, setSearchPanelCollapsed] = useState(false);
  const [autoCollapseAfterSearch, setAutoCollapseAfterSearch] = useState(false);
  const [currentSearchCriteria, setCurrentSearchCriteria] =
    useState<POsPaidSearchFormData | null>(null);

  // Load filter values on component mount
  useEffect(() => {
    loadAllFilterValues();
  }, []);

  const loadAllFilterValues = async () => {
    try {
      console.log('🚀 Starting to load all POs Paid filter values...');

      // Load all filter values in parallel using real API service
      const [vendorValues, warehouseValues, statusValues] = await Promise.all([
        apiService.getFilterValues('Vendor'),
        apiService.getFilterValues('Warehouse'),
        Promise.resolve([
          {
            statusCode: '10',
            statusDescription: 'Cfm Required',
            isActive: true,
          },
          { statusCode: '20', statusDescription: 'On-Order', isActive: true },
          { statusCode: '30', statusDescription: 'In-Transit', isActive: true },
          {
            statusCode: '35',
            statusDescription: 'Partial RcToStk',
            isActive: true,
          },
          {
            statusCode: '40',
            statusDescription: 'Rc. to Stk.',
            isActive: true,
          },
          { statusCode: '50', statusDescription: 'Paid', isActive: true },
        ]).then((statuses: any[]) =>
          statuses.map((status: any) => ({
            fieldId: 'Status',
            filterId: status.statusCode,
            filterDesc: status.statusDescription,
          })),
        ),
      ]);

      const newFilterValues: Record<string, FilterValue[]> = {
        vendorValue: vendorValues,
        warehouseValue: warehouseValues,
        statusValue: statusValues,
      };

      console.log(
        '✅ POsPaidContainer - All filter values loaded:',
        newFilterValues,
      );
      setFilterValues(newFilterValues);
    } catch (error) {
      console.error(
        '🚨 POsPaidContainer - Error loading filter values:',
        error,
      );
      message.error('Failed to load filter options. Please refresh the page.');
    }
  };

  const handleFieldChange = (fieldId: string, filterKey: string) => {
    console.log(
      `🔄 POsPaidContainer - Field changed: ${fieldId} -> ${filterKey}`,
    );
    // Handle dynamic field changes if needed
  };

  const handleSearch = async (values: POsPaidSearchFormData) => {
    try {
      console.log('🔍 POsPaidContainer - Starting search with values:', values);
      setLoading(true);

      // Temporary: Use mock data for testing while API integration is being finalized
      console.log('🔄 Using mock data for POs Paid testing...');
      const mockResults: POsPaidData[] = [
        {
          vendor: 'Ashley Manufacturing Co.',
          vendorNum: 'V001',
          warehouse: '01',
          buyingEntity: 'ASHLEY',
          pomOrderNum: 'PO123456',
          pomDatePaid: '2024-01-15',
          currencyCode: 'USD',
          orderAmount: 15000.0,
          totalAdjustments: -500.0,
          totalPaid: 14500.0,
          poStatus: 'Paid',
          etdDate: '2024-01-10',
          etaDate: '2024-01-20',
          onboard: '2024-01-12',
          paymentTerms: 'NET 30',
          pmtApproveDate: '2024-01-14',
        },
        {
          vendor: 'Furniture Components Inc.',
          vendorNum: 'V002',
          warehouse: '02',
          buyingEntity: 'ASHLEY',
          pomOrderNum: 'PO123457',
          pomDatePaid: '2024-01-16',
          currencyCode: 'USD',
          orderAmount: 25000.0,
          totalAdjustments: 0.0,
          totalPaid: 25000.0,
          poStatus: 'Paid',
          etdDate: '2024-01-11',
          etaDate: '2024-01-21',
          onboard: '2024-01-13',
          paymentTerms: 'NET 45',
          pmtApproveDate: '2024-01-15',
        },
        {
          vendor: 'Global Suppliers Ltd.',
          vendorNum: 'V003',
          warehouse: '03',
          buyingEntity: 'ASHLEY',
          pomOrderNum: 'PO123458',
          pomDatePaid: '2024-01-17',
          currencyCode: 'USD',
          orderAmount: 8500.0,
          totalAdjustments: 200.0,
          totalPaid: 8700.0,
          poStatus: 'Paid',
          etdDate: '2024-01-12',
          etaDate: '2024-01-22',
          onboard: '2024-01-14',
          paymentTerms: 'NET 60',
          pmtApproveDate: '2024-01-16',
        },
      ];

      console.log('✅ POsPaidContainer - Using mock results:', mockResults);
      setSearchResults(mockResults);

      // TODO: Uncomment when API integration is complete
      // const results = await apiService.searchPOsPaid(values);
      // setSearchResults(results);
      setCurrentSearchCriteria(values); // Store search criteria for export

      // Auto-collapse search panel if enabled
      if (autoCollapseAfterSearch) {
        setSearchPanelCollapsed(true);
      }

      message.success(`Found ${mockResults.length} POs paid records`);
    } catch (error) {
      console.error('🚨 POsPaidContainer - Search error:', error);
      message.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (exportType: 'excel' | 'emailExcel') => {
    if (!currentSearchCriteria || searchResults.length === 0) {
      message.warning('No data to export. Please perform a search first.');
      return;
    }

    try {
      console.log(`📊 POsPaidContainer - Exporting as ${exportType}...`);

      if (exportType === 'excel') {
        const filename = `POs_Paid_Inquiry_${new Date().toISOString().split('T')[0]}.xlsx`;
        ExcelExportService.exportPOsPaidData(searchResults, filename);
        message.success('Excel file downloaded successfully!');
      } else if (exportType === 'emailExcel') {
        // TODO: Implement email export functionality
        message.info('Email export functionality will be implemented soon.');
      }
    } catch (error) {
      console.error('🚨 POsPaidContainer - Export error:', error);
      message.error('Export failed. Please try again.');
    }
  };

  return (
    <ErrorBoundary>
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Content style={{ padding: '24px' }}>
          {/* Header Section */}
          <div style={{ marginBottom: '24px' }}>
            <Breadcrumb
              items={[
                { href: '/', title: <HomeOutlined /> },
                { title: 'Inquiry' },
                { title: 'POs Paid Inquiry' },
              ]}
              style={{ marginBottom: '16px' }}
            />
          </div>

          {/* Search Panel */}
          <POsPaidSearchForm
            form={form}
            loading={loading}
            filterValues={filterValues}
            onFieldChange={handleFieldChange}
            onSearch={handleSearch}
            searchPanelCollapsed={searchPanelCollapsed}
            onSearchPanelToggle={() =>
              setSearchPanelCollapsed(!searchPanelCollapsed)
            }
            autoCollapseAfterSearch={autoCollapseAfterSearch}
            onAutoCollapseToggle={setAutoCollapseAfterSearch}
          />

          {/* Search Results Section */}
          {searchResults.length > 0 && (
            <Card
              style={{
                margin: '0 auto 24px auto',
                maxWidth: '1240px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '20px',
              }}
            >
              <div style={{ marginBottom: '0', minHeight: '40px' }}>
                <Flex
                  align="center"
                  justify="space-between"
                  wrap="wrap"
                  gap="large"
                >
                  <Flex align="center" gap="small">
                    <Typography.Text
                      strong
                      style={{
                        fontSize: '16px',
                        color: '#262626',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        marginRight: '4px',
                      }}
                    >
                      Search Results
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: '14px', color: '#8c8c8c' }}
                    >
                      {searchResults.length} total
                    </Typography.Text>
                  </Flex>
                  <Flex align="center" gap="medium">
                    <Space.Compact>
                      <Button type="primary" size="small">
                        Standard View
                      </Button>
                    </Space.Compact>
                    <ExportOptions
                      onExport={handleExport}
                      disabled={loading || searchResults.length === 0}
                    />
                  </Flex>
                </Flex>
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <POsPaidResultsTable data={searchResults} loading={loading} />
            </Card>
          )}
        </Content>
      </Layout>
    </ErrorBoundary>
  );
};

export default POsPaidContainer;
