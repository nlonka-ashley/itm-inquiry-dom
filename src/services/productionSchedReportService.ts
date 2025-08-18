import dayjs from 'dayjs';
import type {
  ProductionSchedData,
  ProductionSchedFilterRow,
  ProductionSchedSearchFormData,
} from '../types';

export interface ReportObject {
  criteria: string;
  environmentCode: string;
  xmlStyleSheet: string;
  prms: string;
  callMode: string;
}

export class ProductionSchedReportService {
  /**
   * Build user-friendly criteria string from search form data
   * This matches the original buildQueryString() function behavior
   */
  static buildUserCriteria(searchData: ProductionSchedSearchFormData): string {
    let userCriteria = '';
    const sCommaSpace = ', ';

    // Build filter criteria string
    if (searchData.filterRows && searchData.filterRows.length > 0) {
      const filterStrings = searchData.filterRows.map((row, index) => {
        let filterStr = '';

        // Add logical operator for non-first rows
        if (index > 0 && row.logicalOperator) {
          filterStr += ` ${row.logicalOperator} `;
        }

        // Add field type and comparison
        filterStr += `${row.fieldType} ${row.comparisonOperator} "${row.filterValue}"`;

        return filterStr;
      });

      userCriteria += filterStrings.join('');
    }

    // Add order type filters
    const orderTypes = [];
    if (searchData.orderTypeFilters.plannedOrders) orderTypes.push('Planned');
    if (searchData.orderTypeFilters.firmedOrders) orderTypes.push('Firmed');
    if (searchData.orderTypeFilters.shippedOrders) orderTypes.push('Shipped');

    if (orderTypes.length > 0) {
      if (userCriteria) userCriteria += sCommaSpace;
      userCriteria += `Order Types: ${orderTypes.join(', ')}`;
    }

    // Add time period
    if (userCriteria) userCriteria += sCommaSpace;
    userCriteria += `Past Weeks: ${searchData.timePeriod.pastWeeks}`;
    userCriteria += sCommaSpace;
    userCriteria += `Future Weeks: ${searchData.timePeriod.futureWeeks}`;

    // Add report options
    if (userCriteria) userCriteria += sCommaSpace;
    userCriteria += `Report By: ${searchData.reportOptions.reportBy}`;

    if (searchData.reportOptions.containerDirectFilter) {
      userCriteria += `${sCommaSpace}Container Direct Filter`;
    }

    return userCriteria;
  }

  /**
   * Build parameter string for report generation
   * This matches the original reportObject.prms format
   */
  static buildReportParameters(
    searchData: ProductionSchedSearchFormData,
    vhsName = 'AFI',
    userName = 'system',
  ): string {
    // Extract individual filter values
    let item = '';
    let vendor = '';
    let warehouse = '';
    let drp = '';
    let fc = '';
    let prodResource = '';
    let itemClass = '';

    // Parse filter rows to extract specific field values
    searchData.filterRows.forEach(row => {
      switch (row.fieldType) {
        case 'Item':
          item = row.filterValue;
          break;
        case 'Vendor':
          vendor = row.filterValue;
          break;
        case 'Warehouse':
          warehouse = row.filterValue;
          break;
        case 'DRP':
          drp = row.filterValue;
          break;
        case 'FC':
          fc = row.filterValue;
          break;
        case 'ProductionResource':
          prodResource = row.filterValue;
          break;
        case 'ItemClass':
          itemClass = row.filterValue;
          break;
      }
    });

    // Build parameter string (pipe-delimited)
    // Format matches: item|vendor|warehouse|drp|fc|pastWeeks|futureWeeks|vhsName|user|groupByWarehouse|rpFilter|plannedOrderFilter|firmedOrderFilter|shippedOrderFilter|ProductionSched.asp|reportBy|containerDirectFilter|prodResource|itemClass
    const params = [
      item,
      vendor,
      warehouse,
      drp,
      fc,
      searchData.timePeriod.pastWeeks.toString(),
      searchData.timePeriod.futureWeeks.toString(),
      vhsName,
      userName,
      'false', // groupByWarehouse removed
      searchData.reportOptions.rpFilter ? 'true' : 'false', // rpFilter
      searchData.orderTypeFilters.plannedOrders ? '1' : '0',
      searchData.orderTypeFilters.firmedOrders ? '1' : '0',
      searchData.orderTypeFilters.shippedOrders ? '1' : '0',
      'ProductionSched.asp',
      searchData.reportOptions.reportBy,
      searchData.reportOptions.containerDirectFilter ? '1' : '0',
      prodResource,
      itemClass,
    ];

    return params.join('|');
  }

  /**
   * Generate report object that matches the original getReport() function
   * This creates the report configuration for server-side report generation
   */
  static generateReportObject(
    searchData: ProductionSchedSearchFormData,
    environmentCodes = 'AFI',
    vhsName = 'AFI',
    userName = 'system',
  ): ReportObject {
    const userCriteria =
      ProductionSchedReportService.buildUserCriteria(searchData);
    const reportParams = ProductionSchedReportService.buildReportParameters(
      searchData,
      vhsName,
      userName,
    );

    return {
      criteria: userCriteria.replace(/_/g, '-'), // Replace underscores with dashes
      environmentCode: environmentCodes,
      xmlStyleSheet: 'ProductionSched.xml',
      prms: reportParams,
      callMode: '',
    };
  }

  /**
   * Open report window (matches original getReport() behavior)
   * This would typically open a new window for report generation
   */
  static openReportWindow(reportObject: ReportObject): void {
    try {
      // In the original ASP application, this opened a new window
      // For the modern React app, we'll log the report object and could:
      // 1. Open a new tab/window with report parameters
      // 2. Make an API call to generate the report
      // 3. Download the report directly

      console.log(
        '🔄 Opening Production Schedule Report with configuration:',
        reportObject,
      );

      // For now, we'll construct the report URL that matches the original behavior
      const reportUrl =
        '/ReportsNET/ReportCreator/ReportCreatorNETWaiting.aspx?Transfer=1';

      // In a real implementation, you would:
      // 1. POST the report object to the server
      // 2. Open the report in a new window
      // 3. Handle the report generation process

      // For demonstration, we'll show what would happen:
      console.log('📊 Report URL:', reportUrl);
      console.log('📋 Report Configuration:', {
        title: 'Production Schedule Report',
        criteria: reportObject.criteria,
        parameters: reportObject.prms,
        xmlStyleSheet: reportObject.xmlStyleSheet,
      });

      // In the browser, this would be:
      // const reportWindow = window.open(reportUrl, 'ProductionSchedule', 'resizable,menubar,scrollbars,top=50,left=50,width=700,height=400');

      console.log('✅ Report generation initiated');
    } catch (error) {
      console.error('❌ Error opening report window:', error);
      throw new Error('Failed to open report window');
    }
  }

  /**
   * Generate and download Excel report directly
   * This is an alternative to the server-side report generation
   */
  static async generateExcelReport(
    searchData: ProductionSchedSearchFormData,
    data: ProductionSchedData[],
  ): Promise<void> {
    try {
      const { ExcelExportService } = await import('./excelExportService');

      const filename = `Production_Schedule_Report_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;

      // Use the enhanced export with criteria
      ExcelExportService.exportProductionScheduleWithCriteria(
        data,
        searchData,
        filename,
      );

      console.log('✅ Excel report generated successfully');
    } catch (error) {
      console.error('❌ Error generating Excel report:', error);
      throw new Error('Failed to generate Excel report');
    }
  }

  /**
   * Validate search criteria before report generation
   * This matches the original validation logic
   */
  static validateSearchCriteria(searchData: ProductionSchedSearchFormData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check if at least one filter row has a value
    const hasActiveFilters = searchData.filterRows.some(
      row => row.isActive && row.filterValue.trim() !== '',
    );

    if (!hasActiveFilters) {
      errors.push('At least one filter criteria must be specified');
    }

    // Check if at least one order type is selected
    const hasOrderTypes =
      searchData.orderTypeFilters.plannedOrders ||
      searchData.orderTypeFilters.firmedOrders ||
      searchData.orderTypeFilters.shippedOrders;

    if (!hasOrderTypes) {
      errors.push('At least one order type must be selected');
    }

    // Validate time periods
    if (
      searchData.timePeriod.pastWeeks < 0 ||
      searchData.timePeriod.pastWeeks > 52
    ) {
      errors.push('Past weeks must be between 0 and 52');
    }

    if (
      searchData.timePeriod.futureWeeks < 0 ||
      searchData.timePeriod.futureWeeks > 52
    ) {
      errors.push('Future weeks must be between 0 and 52');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
