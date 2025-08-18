// TypeScript interfaces for ItmInquiryDOM and POsPaidInquiry components

export interface ItmInquiryDOMProps {
  companyCode?: string;
}

export interface FilterField {
  fieldId: string;
  fieldDesc: string;
}

export interface FilterValue {
  fieldId: string;
  filterId: string;
  filterDesc: string;
}

export interface SearchFormData {
  itemNumber: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  buyerValue?: string;
  vendorValue?: string;
  statusValue?: string;
  warehouseValue?: string;
  reportType: 'browser' | 'excel' | 'email';
}

export interface POItemData {
  poNumber: string;
  vendor: string;
  itemNumber: string;
  whse: string;
  orderQty: 0;
  orderQtyOpen: 0;
  due: string;
  status: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerNum: string;
  procStatus: string;
  procStatusDesc: string;
  vname: string;
  statusCode: string;
  intransitQty: 0;
  inspectionQty: 0;
  orderDate: string;
  shipDate: string;
  stockQty: 0;
  returnedQty: 0;
  xpectedDelivery: string;
  itemDesc: string;
}

export interface ExportOptions {
  type: 'browser' | 'excel' | 'email';
  title: string;
  description: string;
}

export interface ApiDataService {
  getFilterFields(): Promise<FilterField[]>;
  getFilterValues(fieldId: string): Promise<FilterValue[]>;
  searchPOItems(searchData: SearchFormData): Promise<POItemData[]>;
}

// Field types for the simplified dropdown system
export type FieldType = 'Buyno' | 'pomVendorNum' | 'Staic' | 'Whse';

export interface FieldOption {
  value: FieldType;
  label: string;
}

// Status options for the Status field (matches API response structure)
export interface StatusOption {
  statusCode: string;
  statusDescription: string;
  isActive: boolean;
}

// Buyer information
export interface BuyerInfo {
  buyerNum: string;
  firstName: string;
  lastName: string;
}

// Vendor information
export interface VendorInfo {
  vendorNum: string;
  vendorName: string;
}

// Warehouse information
export interface WarehouseInfo {
  whseCode: string;
  whseDescription: string;
}

export interface POItemDomRequest {
  vhsName: string;
  itemNumber: string;
  vendorNumber: string;
  warehouse: string;
  statusCode: string;
  buyerNumber: string;
  dueDateFrom: string;
  dueDateTo: string;
  userId: string;
  application: string;
}

export interface POItemDomResponse {
  data: POItemData[];
  totalRecords: number;
}

// ===== PRODUCTION SCHEDULE TYPES =====

export interface ProductionSchedProps {
  companyCode?: string;
}

// Field types for Production Schedule filters
export type ProductionSchedFieldType =
  | 'Item'
  | 'Vendor'
  | 'Warehouse'
  | 'DRP'
  | 'FC'
  | 'Office'
  | 'ProductionResource'
  | 'ItemClass';

// Logical operators for connecting filter rows
export type LogicalOperator = 'AND' | 'OR';

// Comparison operators for filter conditions
export type ComparisonOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan';

// Individual filter row configuration
export interface ProductionSchedFilterRow {
  id: string;
  fieldType: ProductionSchedFieldType;
  logicalOperator?: LogicalOperator; // Not used for first row
  comparisonOperator: ComparisonOperator;
  filterValue: string;
  isActive: boolean;
}

// Order type filter options
export interface OrderTypeFilters {
  plannedOrders: boolean;
  firmedOrders: boolean;
  shippedOrders: boolean;
}

// Time period selection
export interface TimePeriodSelection {
  pastWeeks: number;
  futureWeeks: number;
}

// Report configuration options
export interface ReportOptions {
  reportBy: string;
  containerDirectFilter: boolean;
  rpFilter: boolean;
  groupByWarehouse: boolean; // Added for backward compatibility
}

// Complete search form data for Production Schedule
export interface ProductionSchedSearchFormData {
  filterRows: ProductionSchedFilterRow[];
  orderTypeFilters: OrderTypeFilters;
  timePeriod: TimePeriodSelection;
  reportOptions: ReportOptions;
  reportType: 'browser' | 'excel' | 'email';
}

// Production Schedule result data structure (matches API response)
export interface ProductionSchedData {
  orderNum: string;
  pQty: number;
  fQty: number;
  sQty: number;
  wkNum: number;
  itemNum: string;
  itemClass: string;
  itemDesc: string;
  replaceableFlag: string;
  whse: string;
  vendorNum: string;
  vendorName: string;
  productionResource: string;
  // Additional fields for weekly display
  orderType?: string;
  weeklyData?: { [key: string]: number };
  weeks?: string[];
}

// Weekly data for production schedule
export interface WeekData {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  plannedQty: number;
  firmedQty: number;
  shippedQty: number;
}

// Filter options for dropdowns
export interface ProductionResourceInfo {
  resourceId: string;
  resourceName: string;
  vendorId: string;
}

export interface ItemClassInfo {
  classCode: string;
  classDescription: string;
}

export interface DRPInfo {
  drpCode: string;
  drpDescription: string;
}

export interface FCInfo {
  fcCode: string;
  fcDescription: string;
}

export interface OfficeInfo {
  officeCode: string;
  officeName: string;
}

// API request/response types for Production Schedule
export interface ProductionSchedRequest {
  vhsName: string;
  filterCriteria: ProductionSchedFilterRow[];
  orderTypeFilters: OrderTypeFilters;
  timePeriod: TimePeriodSelection;
  reportOptions: ReportOptions;
  userId: string;
  application: string;
}

export interface ProductionSchedResponse {
  data: ProductionSchedData[];
  totalRecords: number;
  criteria: string;
}

// New API request/response types for real Production Schedule API
export interface ProductionSchedApiRequest {
  itemNum: string;
  vendorNum: string;
  warehouse: string;
  drpPlanner: string;
  forecastPlanner: string;
  pastWeeks: number;
  forecastWeeks: number;
  vhsName: string;
  user: string;
  groupByWhse: string;
  rpFilter: boolean;
  plannedOrders: number;
  firmedOrders: number;
  shippedOrders: number;
  app: string;
  reportBy: number;
  excludeContainerDirect: number;
  productionResource: string;
  itemClass: string;
}

export interface ProductionSchedApiResponseItem {
  orderNum: string;
  pQty: number;
  fQty: number;
  sQty: number;
  wkNum: number;
  itemNum: string;
  itemClass: string;
  itemDesc: string;
  replaceableFlag: string;
  whse: string;
  vendorNum: string;
  vendorName: string;
  productionResource: string;
}

export interface ProductionSchedApiResponse {
  items: ProductionSchedApiResponseItem[];
  success: boolean;
  errorMessage: string;
  totalCount: number;
  timestamp: string;
  requestId: string;
}

// ============================================================================
// POs Paid Inquiry Types
// ============================================================================

export interface POsPaidProps {
  companyCode?: string;
}

export interface POsPaidSearchFormData {
  itemNumber: string;
  warehouse?: string;
  status?: string;
  vendor?: string;
  dateField?: string;
  dateFrom?: string;
  dateTo?: string;
  reportType: 'browser' | 'excel' | 'emailExcel';
}

export interface POsPaidData {
  vendor: string;
  vendorNum: string;
  warehouse: string;
  buyingEntity: string;
  pomOrderNum: string;
  pomDatePaid: string;
  currencyCode: string;
  orderAmount: number;
  totalAdjustments: number;
  totalPaid: number;
  poStatus: string;
  etdDate: string;
  etaDate: string;
  onboard: string;
  paymentTerms: string;
  pmtApproveDate: string;
}

export interface DateFieldOption {
  value: string;
  label: string;
  fieldId: number;
}

export interface POsPaidRequest {
  itemNumber: string;
  warehouse: string;
  status: string;
  vendor: string;
  dateField: number;
  dateFrom: string;
  dateTo: string;
  orderBy: number;
  vhsName: string;
  user: string;
  app: string;
}

export interface POsPaidResponse {
  success: boolean;
  data: POsPaidData[];
  message?: string;
  totalCount: number;
  timestamp: string;
  requestId: string;
}
