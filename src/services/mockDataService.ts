// Mock data service for development and testing

import type {
  BuyerInfo,
  FilterField,
  FilterValue,
  POItemData,
  SearchFormData,
  StatusOption,
  VendorInfo,
  WarehouseInfo,
} from '../types';

// Mock data for buyers
const mockBuyers: BuyerInfo[] = [
  { buyerNum: 'B001', firstName: 'John', lastName: 'Smith' },
  { buyerNum: 'B002', firstName: 'Sarah', lastName: 'Johnson' },
  { buyerNum: 'B003', firstName: 'Mike', lastName: 'Davis' },
  { buyerNum: 'B004', firstName: 'Lisa', lastName: 'Wilson' },
  { buyerNum: 'B005', firstName: 'David', lastName: 'Brown' },
];

// Mock data for vendors
const mockVendors: VendorInfo[] = [
  { vendorNum: 'V001', vendorName: 'Ashley Furniture Industries' },
  { vendorNum: 'V002', vendorName: 'Global Manufacturing Co.' },
  { vendorNum: 'V003', vendorName: 'Premium Wood Suppliers' },
  { vendorNum: 'V004', vendorName: 'Metal Works International' },
  { vendorNum: 'V005', vendorName: 'Fabric & Textiles Ltd.' },
];

// Mock data for status options
const mockStatuses: StatusOption[] = [
  { statusCode: '10', statusDescription: 'On-Order', isActive: true },
  { statusCode: '20', statusDescription: 'In-Transit', isActive: true },
  { statusCode: '30', statusDescription: 'Received', isActive: true },
  { statusCode: '40', statusDescription: 'Cancelled', isActive: true },
  { statusCode: '50', statusDescription: 'Completed', isActive: true },
];

// Mock data for warehouses
const mockWarehouses: WarehouseInfo[] = [
  { whseCode: 'WH01', whseDescription: 'Main Warehouse - Arcadia' },
  { whseCode: 'WH02', whseDescription: 'Distribution Center - Chicago' },
  { whseCode: 'WH03', whseDescription: 'Regional Hub - Atlanta' },
  { whseCode: 'WH04', whseDescription: 'West Coast Facility - LA' },
  { whseCode: 'WH05', whseDescription: 'Northeast Center - Boston' },
];

// Mock PO Item data - 500 items for comprehensive testing
const mockPOItems: POItemData[] = (() => {
  const items: POItemData[] = [];
  const buyers = mockBuyers;
  const vendors = mockVendors;
  const statuses = mockStatuses;
  const warehouses = mockWarehouses;

  const furnitureItems = [
    'Dining Chair - Oak Finish',
    'Coffee Table - Walnut',
    'Sofa Frame - Steel',
    'Bedroom Dresser - Cherry Wood',
    'Fabric Cushions - Blue Pattern',
    'Table Legs - Metal Black',
    'Bookshelf Unit - Pine',
    'Office Chair - Ergonomic',
    'Mattress - Queen Size',
    'Lamp Base - Ceramic White',
    'Cabinet Hardware - Brass',
    'Dining Table Top - Marble',
    'Nightstand - Mahogany',
    'Sectional Sofa - Leather',
    'Bar Stool - Chrome',
    'Entertainment Center - Black',
    'Recliner Chair - Brown',
    'Kitchen Island - Granite',
    'Wardrobe - White',
    'Desk Chair - Mesh Back',
    'Bed Frame - King Size',
    'Side Table - Glass Top',
    'Armchair - Fabric',
    'TV Stand - Wood Grain',
    'Chest of Drawers - Pine',
    'Dining Set - 6 Piece',
    'Loveseat - Microfiber',
    'Computer Desk - L-Shape',
    'Bookcase - 5 Shelf',
    'Ottoman - Storage',
    'Vanity Table - Mirror',
    'Futon - Convertible',
    'Accent Chair - Velvet',
    'Console Table - Modern',
    'Barstool Set - Industrial',
    'Headboard - Upholstered',
    'Shoe Rack - Metal',
    'Coat Rack - Standing',
    'Mirror - Full Length',
    'Lamp Shade - Fabric',
    'Curtain Rod - Adjustable',
    'Throw Pillow - Decorative',
    'Area Rug - Persian',
    'Wall Art - Canvas',
    'Picture Frame - Wood',
    'Vase - Ceramic',
    'Candle Holder - Glass',
    'Clock - Wall Mount',
    'Plant Stand - Bamboo',
    'Storage Bin - Wicker',
    'Hamper - Laundry',
    'Trash Can - Stainless',
    'Tissue Box - Decorative',
    'Soap Dispenser - Pump',
    'Towel Rack - Chrome',
    'Shower Curtain - Fabric',
    'Bath Mat - Memory Foam',
    'Toilet Seat - Soft Close',
    'Faucet - Kitchen',
    'Cabinet Knob - Brass',
    'Drawer Pull - Stainless',
    'Hinge - Door',
    'Lock Set - Entry',
    'Handle - Cabinet',
    'Screw Set - Assorted',
    'Nail Set - Finishing',
    'Glue - Wood',
    'Stain - Oak',
    'Paint - Interior',
    'Brush - Paint',
    'Roller - Paint',
    'Tray - Paint',
    'Drop Cloth - Canvas',
    'Tape - Masking',
    'Sandpaper - Fine',
    'Primer - Wall',
    'Caulk - Silicone',
    'Sealant - Wood',
    'Cleaner - All Purpose',
    'Polish - Furniture',
    'Wax - Floor',
    'Oil - Teak',
    'Conditioner - Leather',
    'Protector - Fabric',
    'Spring - Coil',
    'Foam - Cushion',
    'Batting - Polyester',
    'Webbing - Elastic',
    'Thread - Upholstery',
    'Zipper - Heavy Duty',
    'Button - Decorative',
    'Trim - Piping',
    'Cord - Decorative',
    'Tassel - Curtain',
    'Fringe - Decorative',
    'Braid - Trim',
    'Velcro - Industrial',
    'Snap - Heavy Duty',
    'Grommet - Metal',
    'Eyelet - Brass',
    'Ring - Curtain',
    'Hook - Wall',
    'Bracket - Shelf',
    'Mount - TV',
    'Stand - Speaker',
    'Cord - Power',
    'Adapter - Plug',
    'Switch - Light',
    'Outlet - Wall',
    'Cover - Switch',
    'Plate - Wall',
    'Box - Junction',
    'Wire - Electrical',
    'Conduit - PVC',
    'Connector - Wire',
    'Terminal - Electrical',
  ];

  for (let i = 1; i <= 500; i++) {
    const orderQty = Math.floor(Math.random() * 500) + 10;
    const releaseQty = Math.floor(orderQty * (0.3 + Math.random() * 0.7));
    const orderQtyOpen = Math.floor(orderQty * Math.random() * 0.5);
    const releaseQtyOpen = Math.floor(releaseQty * Math.random() * 0.3);

    const dueDate = new Date(2024, 11, Math.floor(Math.random() * 31) + 1);
    if (Math.random() > 0.7) {
      dueDate.setFullYear(2025);
      dueDate.setMonth(Math.floor(Math.random() * 3));
    }

    const selectedBuyer = buyers[Math.floor(Math.random() * buyers.length)];
    const selectedVendor = vendors[Math.floor(Math.random() * vendors.length)];
    const selectedStatus =
      statuses[Math.floor(Math.random() * statuses.length)];
    const selectedWarehouse =
      warehouses[Math.floor(Math.random() * warehouses.length)];

    items.push({
      poNumber: `PO-2024-${String(i).padStart(3, '0')}`,
      itemNumber: `ITM${String(i).padStart(3, '0')}`,
      itemDesc:
        furnitureItems[Math.floor(Math.random() * furnitureItems.length)],
      orderQty: 0, // Literal type 0 as defined in POItemData
      orderQtyOpen: 0, // Literal type 0 as defined in POItemData
      intransitQty: 0,
      inspectionQty: 0,
      stockQty: 0,
      returnedQty: 0,
      due: dueDate.toISOString().split('T')[0],
      orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      shipDate: new Date(Date.now() + Math.random() * 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      xpectedDelivery: new Date(
        Date.now() + Math.random() * 45 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split('T')[0],
      buyerFirstName: selectedBuyer.firstName,
      buyerLastName: selectedBuyer.lastName,
      buyerNum: selectedBuyer.buyerNum,
      vendor: selectedVendor.vendorNum,
      vname: selectedVendor.vendorName,
      status: selectedStatus.statusDescription,
      statusCode: selectedStatus.statusCode,
      procStatus: selectedStatus.statusCode,
      procStatusDesc: selectedStatus.statusDescription,
      whse: selectedWarehouse.whseCode,
    });
  }

  return items;
})();

export class MockDataService {
  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getFilterFields(): Promise<FilterField[]> {
    await this.delay(300);
    return [
      { fieldId: 'Empty', fieldDesc: '' },
      { fieldId: 'Buyno', fieldDesc: 'Buyer' },
      { fieldId: 'pomVendorNum', fieldDesc: 'Vendor' },
      { fieldId: 'Staic', fieldDesc: 'Status' },
      { fieldId: 'Whse', fieldDesc: 'Warehouse' },
    ];
  }

  async getFilterValues(fieldId: string): Promise<FilterValue[]> {
    await this.delay(200);

    const baseValues: FilterValue[] = [
      { fieldId: 'Empty', filterId: 'Empty', filterDesc: '' },
    ];

    switch (fieldId) {
      case 'Buyno':
        return [
          ...baseValues,
          ...mockBuyers.map(buyer => ({
            fieldId: 'Buyno',
            filterId: buyer.buyerNum,
            filterDesc: `${buyer.firstName} ${buyer.lastName} (${buyer.buyerNum})`,
          })),
        ];

      case 'pomVendorNum':
        return [
          ...baseValues,
          ...mockVendors.map(vendor => ({
            fieldId: 'pomVendorNum',
            filterId: vendor.vendorNum,
            filterDesc: vendor.vendorName,
          })),
        ];

      case 'Staic':
        return [
          ...baseValues,
          {
            fieldId: 'Staic',
            filterId: 'Open',
            filterDesc: 'All Open Orders',
          },
          ...mockStatuses.map(status => ({
            fieldId: 'Staic',
            filterId: status.statusCode,
            filterDesc: status.statusDescription,
          })),
        ];

      case 'Whse':
        return [
          ...baseValues,
          ...mockWarehouses.map(warehouse => ({
            fieldId: 'Whse',
            filterId: warehouse.whseCode,
            filterDesc: warehouse.whseDescription,
          })),
        ];

      default:
        return baseValues;
    }
  }

  async searchPOItems(searchData: SearchFormData): Promise<POItemData[]> {
    await this.delay(800); // Simulate longer search delay

    // Comprehensive filtering logic for demo purposes
    let filteredItems = [...mockPOItems];

    // Filter by item number if provided
    if (searchData.itemNumber) {
      filteredItems = filteredItems.filter(item =>
        item.itemNumber
          .toLowerCase()
          .includes(searchData.itemNumber.toLowerCase()),
      );
    }

    // Filter by buyer if provided
    if (searchData.buyerValue && searchData.buyerValue !== 'Empty') {
      filteredItems = filteredItems.filter(item =>
        item.buyerNum.includes(searchData.buyerValue!),
      );
    }

    // Filter by vendor if provided
    if (searchData.vendorValue && searchData.vendorValue !== 'Empty') {
      const vendor = mockVendors.find(
        v => v.vendorNum === searchData.vendorValue,
      );
      if (vendor) {
        filteredItems = filteredItems.filter(item =>
          item.vendor.includes(vendor.vendorName),
        );
      }
    }

    // Filter by status if provided
    if (searchData.statusValue && searchData.statusValue !== 'Empty') {
      const status = mockStatuses.find(
        s => s.statusCode === searchData.statusValue,
      );
      if (status) {
        filteredItems = filteredItems.filter(item =>
          item.status.includes(status.statusCode),
        );
      }
    }

    // Filter by warehouse if provided
    if (searchData.warehouseValue && searchData.warehouseValue !== 'Empty') {
      const warehouse = mockWarehouses.find(
        w => w.whseCode === searchData.warehouseValue,
      );
      if (warehouse) {
        filteredItems = filteredItems.filter(item =>
          item.whse.includes(warehouse.whseCode),
        );
      }
    }

    // Filter by date range if provided
    if (searchData.dueDateFrom || searchData.dueDateTo) {
      filteredItems = filteredItems.filter(item => {
        const itemDate = new Date(item.due);
        const fromDate = searchData.dueDateFrom
          ? new Date(searchData.dueDateFrom)
          : null;
        const toDate = searchData.dueDateTo
          ? new Date(searchData.dueDateTo)
          : null;

        if (fromDate && itemDate < fromDate) return false;
        if (toDate && itemDate > toDate) return false;
        return true;
      });
    }

    // If no specific filters applied and no item number, return all items for testing
    if (
      !searchData.itemNumber &&
      !searchData.buyerValue &&
      !searchData.vendorValue &&
      !searchData.statusValue &&
      !searchData.warehouseValue &&
      !searchData.dueDateFrom &&
      !searchData.dueDateTo
    ) {
      return filteredItems; // Return all test data
    }

    return filteredItems;
  }

  // Additional helper methods for getting specific data types
  async getBuyers(): Promise<BuyerInfo[]> {
    await this.delay(200);
    return mockBuyers;
  }

  async getVendors(): Promise<VendorInfo[]> {
    await this.delay(200);
    return mockVendors;
  }

  async getStatuses(): Promise<StatusOption[]> {
    await this.delay(200);
    return mockStatuses;
  }

  async getWarehouses(): Promise<WarehouseInfo[]> {
    await this.delay(200);
    return mockWarehouses;
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
