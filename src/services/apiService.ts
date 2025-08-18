// API service for fetching dropdown data from real endpoints

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import type {
  FilterField,
  FilterValue,
  POItemData,
  SearchFormData,
  BuyerInfo,
  VendorInfo,
  StatusOption,
  WarehouseInfo,
  POItemDomRequest,
  POItemDomResponse,
  ProductionSchedSearchFormData,
  ProductionSchedData,
  ProductionSchedRequest,
  ProductionSchedResponse,
  ProductionSchedApiRequest,
  ProductionSchedApiResponse,
  ProductionSchedApiResponseItem,
  ProductionResourceInfo,
  ItemClassInfo,
  DRPInfo,
  FCInfo,
  OfficeInfo,
  POsPaidSearchFormData,
  POsPaidData,
  POsPaidRequest,
  POsPaidResponse,
} from "../types";

// API configuration - using local proxy URLs
const API_CONFIG = {
  WAREHOUSES_API_URL: "/api/v1/inquiry-common/warehouses",
  BUYERS_API_URL: "/api/v1/inquiry-common/buyers",
  VENDORS_API_URL: "/api/v1/inquiry-common/dom-vendors",
  STATUSES_API_URL: "/api/v1/inquiry-common/dom-statuses",
  PO_ITEMS_API_URL: (env: string) => `/api/po-item-inquiry-dom/${env}/search`,

  // Production Schedule API URLs
  PRODUCTION_RESOURCES_API_URL: "/api/v1/inquiry-common/production-resources",
  ITEM_CLASSES_API_URL: "/api/v1/inquiry-common/class-items",
  DRP_API_URL: "/api/v1/inquiry-common/drp-planners",
  FC_API_URL: "/api/v1/inquiry-common/fc-planners",
  OFFICES_API_URL: "/api/v1/inquiry-common/offices",
  PRODUCTION_SCHEDULE_API_URL: (env: string) => `/api/ProductionSchedule/${env}/search`,
  PRODUCTION_VENDORS_API_URL: "/api/v1/inquiry-common/vendors",

  // POs Paid API URLs
  POS_PAID_API_URL: (env: string) => `/api/POsPaid/${env}/search`,
  POS_PAID_STATUSES_API_URL: "/api/v1/inquiry-common/po-statuses",
};

// Configure Axios defaults
const axiosInstance = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Automatically parse JSON responses
  responseType: "json",
  // Validate status codes
  validateStatus: (status) => status >= 200 && status < 300,
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    const params = new URLSearchParams(config.params).toString();
    const fullUrl = `${config.url}${params ? `?${params}` : ""}`;
    console.log(`Making API request to: ${fullUrl}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API response from ${response.config.url}: ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(
        `API error ${error.response.status} for ${error.config?.url}:`,
        error.response.data
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error(
        `No response received for ${error.config?.url}:`,
        error.request
      );
    } else {
      // Something else happened
      console.error("API request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Generic API fetch function with Axios
async function fetchAPI<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    // Add environment parameter to GET requests only
    // POST requests for Production Schedule don't need environment in query params
    const configWithParams = {
      ...config,
      params: config?.method?.toLowerCase() === 'post' ? config?.params : {
        environment: "afi",
        ...config?.params,
      },
    };

    console.log(`🔄 API Request - URL: ${url}`, configWithParams);

    // Use the appropriate HTTP method based on config
    const method = configWithParams.method?.toLowerCase() || 'get';
    let response: AxiosResponse<T>;

    switch (method) {
      case 'post':
        response = await axiosInstance.post<T>(url, configWithParams.data, configWithParams);
        break;
      case 'put':
        response = await axiosInstance.put<T>(url, configWithParams.data, configWithParams);
        break;
      case 'patch':
        response = await axiosInstance.patch<T>(url, configWithParams.data, configWithParams);
        break;
      case 'delete':
        response = await axiosInstance.delete<T>(url, configWithParams);
        break;
      default:
        response = await axiosInstance.get<T>(url, configWithParams);
        break;
    }
    console.log(
      `✅ API Response - Status: ${response.status}, Content-Type: ${response.headers["content-type"]}`
    );
    console.log(`📄 API Response - Data type: ${typeof response.data}`);

    // Check if we got HTML instead of JSON
    if (
      typeof response.data === "string" &&
      response.data.includes("<!DOCTYPE html>")
    ) {
      console.error(
        `❌ API returned HTML instead of JSON for ${url}:`,
        response.data.substring(0, 300)
      );
      throw new Error(`API returned HTML instead of JSON for ${url}`);
    }

    return response.data;
  } catch (err) {
    const error = err as any;
    console.error(`❌ API fetch error for ${url}:`, error);
    if (error.response) {
      console.error(`❌ Response status: ${error.response.status}`);
      console.error(`❌ Response headers:`, error.response.headers);
      console.error(`❌ Response data:`, error.response.data);

      // If the response data is HTML, log it
      if (
        typeof error.response.data === "string" &&
        error.response.data.includes("<!DOCTYPE html>")
      ) {
        console.error(
          `❌ HTML Response received:`,
          error.response.data.substring(0, 500)
        );
      }
    }
    throw error;
  }
}

// Fetch buyers from API
export async function fetchBuyers(): Promise<BuyerInfo[]> {
  try {
    const data = await fetchAPI<any>(API_CONFIG.BUYERS_API_URL);
    console.log("🔍 BUYERS - Raw API response:", data);
    console.log("🔍 BUYERS - Response type:", typeof data);
    console.log("🔍 BUYERS - Is array:", Array.isArray(data));
    console.log(
      "🔍 BUYERS - Object keys:",
      data ? Object.keys(data) : "null/undefined"
    );

    // Check if data is null or undefined
    if (data === null || data === undefined) {
      console.warn("❌ BUYERS - API returned null/undefined");
      return [];
    }

    // Try to extract array from various possible response formats
    let extractedData: any[] = [];

    if (Array.isArray(data)) {
      console.log("✅ BUYERS - Using direct array, length:", data.length);
      extractedData = data;
    } else if (data && typeof data === "object") {
      // Try common property names for arrays
      const possibleArrayProps = [
        "data",
        "buyers",
        "items",
        "results",
        "list",
        "records",
      ];

      for (const prop of possibleArrayProps) {
        if (data[prop] && Array.isArray(data[prop])) {
          console.log(
            `✅ BUYERS - Using data.${prop} array, length:`,
            data[prop].length
          );
          extractedData = data[prop];
          break;
        }
      }

      // If no array found in common properties, check all properties
      if (extractedData.length === 0) {
        const allKeys = Object.keys(data);
        console.log("🔍 BUYERS - Available properties:", allKeys);

        for (const key of allKeys) {
          if (Array.isArray(data[key])) {
            console.log(
              `✅ BUYERS - Found array in property '${key}', length:`,
              data[key].length
            );
            extractedData = data[key];
            break;
          }
        }
      }
    }

    if (extractedData.length === 0) {
      console.warn("❌ BUYERS - No array found in response");
      console.log(
        "🔍 BUYERS - Full response structure:",
        JSON.stringify(data, null, 2)
      );
      return [];
    }

    return extractedData;
  } catch (error: any) {
    console.error("❌ BUYERS - Error fetching:", error);
    return [];
  }
}

// Fetch vendors from API
export async function fetchVendors(): Promise<VendorInfo[]> {
  try {
    const data = await fetchAPI<any>(API_CONFIG.VENDORS_API_URL, {
      params: {
        vhsName: "MASTERYY",
      },
    });
    console.log("🔍 VENDORS - Raw API response:", data);
    console.log("🔍 VENDORS - Response type:", typeof data);
    console.log("🔍 VENDORS - Is array:", Array.isArray(data));
    console.log(
      "🔍 VENDORS - Object keys:",
      data ? Object.keys(data) : "null/undefined"
    );

    // Try to extract array from various possible response formats
    let extractedData: any[] = [];

    if (Array.isArray(data)) {
      console.log("✅ VENDORS - Using direct array, length:", data.length);
      extractedData = data;
    } else if (data && typeof data === "object") {
      // Try common property names for arrays
      const possibleArrayProps = [
        "data",
        "vendors",
        "items",
        "results",
        "list",
        "records",
      ];

      for (const prop of possibleArrayProps) {
        if (data[prop] && Array.isArray(data[prop])) {
          console.log(
            `✅ VENDORS - Using data.${prop} array, length:`,
            data[prop].length
          );
          extractedData = data[prop];
          break;
        }
      }

      // If no array found in common properties, check all properties
      if (extractedData.length === 0) {
        const allKeys = Object.keys(data);
        console.log("🔍 VENDORS - Available properties:", allKeys);

        for (const key of allKeys) {
          if (Array.isArray(data[key])) {
            console.log(
              `✅ VENDORS - Found array in property '${key}', length:`,
              data[key].length
            );
            extractedData = data[key];
            break;
          }
        }
      }
    }

    if (extractedData.length === 0) {
      console.warn("❌ VENDORS - No array found in response");
      console.log(
        "🔍 VENDORS - Full response structure:",
        JSON.stringify(data, null, 2)
      );
      return [];
    }

    return extractedData;
  } catch (error: any) {
    console.error("❌ VENDORS - Error fetching:", error);
    return [];
  }
}

// Fetch statuses from API
export async function fetchStatuses(): Promise<StatusOption[]> {
  try {
    const data = await fetchAPI<any>(API_CONFIG.STATUSES_API_URL);
    console.log("Raw statuses data:", data);

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && Array.isArray(data.statuses)) {
      return data.statuses;
    } else {
      console.warn("Statuses API returned unexpected format:", data);
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching statuses:", error);
    return [];
  }
}

// Fetch warehouses from API
export async function fetchWarehouses(): Promise<WarehouseInfo[]> {
  try {
    const data = await fetchAPI<any>(API_CONFIG.WAREHOUSES_API_URL);
    console.log("🔍 WAREHOUSES - Raw API response:", data);
    console.log("🔍 WAREHOUSES - Response type:", typeof data);
    console.log("🔍 WAREHOUSES - Is array:", Array.isArray(data));
    console.log(
      "🔍 WAREHOUSES - Object keys:",
      data ? Object.keys(data) : "null/undefined"
    );

    // Check if response is HTML (indicating an error page)
    if (typeof data === "string" && data.includes("<!DOCTYPE html>")) {
      console.error(
        "❌ WAREHOUSES - API returned HTML instead of JSON:",
        data.substring(0, 200) + "..."
      );
      // Return mock data as fallback
      console.warn("🔄 WAREHOUSES - Using fallback mock data");
      return [
        { whseCode: "MOCK01", whseDescription: "Mock Warehouse 1" },
        { whseCode: "MOCK02", whseDescription: "Mock Warehouse 2" },
      ];
    }

    // Check if data is null or undefined
    if (data === null || data === undefined) {
      console.warn("❌ WAREHOUSES - API returned null/undefined");
      return [];
    }

    // Try to extract array from various possible response formats
    let extractedData: any[] = [];

    if (Array.isArray(data)) {
      extractedData = data;
    } else if (data && Array.isArray(data.data)) {
      extractedData = data.data;
    } else if (data && Array.isArray(data.warehouses)) {
      extractedData = data.warehouses;
    } else if (data && Array.isArray(data.items)) {
      extractedData = data.items;
    } else if (data && Array.isArray(data.results)) {
      extractedData = data.results;
    } else {
      console.warn("❌ WAREHOUSES - API returned unexpected format:", data);
      // Log the first few characters to see what we actually got
      if (typeof data === "string") {
        console.warn(
          "❌ WAREHOUSES - String response preview:",
          data.substring(0, 500)
        );
        // If it's HTML, return fallback data
        if (data.includes("<!DOCTYPE html>")) {
          console.warn(
            "🔄 WAREHOUSES - Using fallback mock data for HTML response"
          );
          return [
            {
              whseCode: "FALLBACK01",
              whseDescription: "Fallback Warehouse 1",
            },
            {
              whseCode: "FALLBACK02",
              whseDescription: "Fallback Warehouse 2",
            },
          ];
        }
      } else if (typeof data === "object") {
        console.warn(
          "❌ WAREHOUSES - Object response preview:",
          JSON.stringify(data, null, 2).substring(0, 500)
        );
      }
      return [];
    }

    console.log("✅ WAREHOUSES - Extracted data:", extractedData);
    console.log("✅ WAREHOUSES - Extracted count:", extractedData.length);

    return extractedData;
  } catch (error: any) {
    console.error("❌ WAREHOUSES - Error fetching warehouses:", error);

    // Check if the error response contains HTML
    if (
      error.response &&
      typeof error.response.data === "string" &&
      error.response.data.includes("<!DOCTYPE html>")
    ) {
      console.warn(
        "🔄 WAREHOUSES - Error response was HTML, using fallback mock data"
      );
      return [
        {
          whseCode: "ERROR01",
          whseDescription: "Error Fallback Warehouse 1",
        },
        {
          whseCode: "ERROR02",
          whseDescription: "Error Fallback Warehouse 2",
        },
      ];
    }

    return [];
  }
}

// Convert API data to FilterValue format for dropdowns
export function convertBuyersToFilterValues(
  buyers: BuyerInfo[]
): FilterValue[] {
  console.log("🔄 BUYERS CONVERSION - Input data:", buyers);
  console.log("🔄 BUYERS CONVERSION - Input type:", typeof buyers);
  console.log("🔄 BUYERS CONVERSION - Is array:", Array.isArray(buyers));

  if (!Array.isArray(buyers)) {
    console.warn("❌ BUYERS CONVERSION - Expected array, got:", typeof buyers);
    return [];
  }

  console.log("🔄 BUYERS CONVERSION - Processing", buyers.length, "items");

  const result = buyers.map((buyer, index) => {
    console.log(`🔄 BUYERS CONVERSION - Item ${index}:`, buyer);
    console.log(
      `🔄 BUYERS CONVERSION - Item ${index} keys:`,
      Object.keys(buyer)
    );

    const buyerAny = buyer as any;

    // Log all properties for debugging
    console.log(
      `🔍 BUYERS CONVERSION - All properties for item ${index}:`,
      buyerAny
    );

    // Try multiple possible property names for buyer ID
    const buyerId =
      buyer.buyerNum ||
      buyerAny.buyerNumber ||
      buyerAny.buyno ||
      buyerAny.id ||
      buyerAny.code ||
      buyerAny.buyerCode ||
      buyerAny.buyerId ||
      buyerAny.buyer_id ||
      buyerAny.buyer_num ||
      buyerAny.buyer_number ||
      buyerAny.BuyerNum ||
      buyerAny.BuyerNumber ||
      buyerAny.BuyerId ||
      buyerAny.BUYER_NUM ||
      buyerAny.BUYER_ID ||
      "";

    // Try multiple possible property names for buyer name
    const firstName =
      buyer.firstName ||
      buyerAny.first_name ||
      buyerAny.fname ||
      buyerAny.FirstName ||
      buyerAny.FIRST_NAME ||
      "";
    const lastName =
      buyer.lastName ||
      buyerAny.last_name ||
      buyerAny.lname ||
      buyerAny.LastName ||
      buyerAny.LAST_NAME ||
      "";
    const fullName = `${firstName} ${lastName}`.trim();

    const buyerName =
      fullName ||
      buyerAny.name ||
      buyerAny.buyerName ||
      buyerAny.buyer_name ||
      buyerAny.BuyerName ||
      buyerAny.BUYER_NAME ||
      buyerAny.description ||
      buyerAny.desc ||
      buyerAny.Description ||
      buyerAny.DESC ||
      buyerId ||
      `Buyer ${index + 1}`;

    console.log(
      `🔍 BUYERS CONVERSION - Extracted buyerId: "${buyerId}", buyerName: "${buyerName}"`
    );

    // Ensure we have valid values
    const finalBuyerId = buyerId || `buyer_${index}`;
    const finalBuyerName = buyerName || `Buyer ${index + 1}`;

    const converted = {
      fieldId: "Buyno",
      filterId: finalBuyerId,
      filterDesc: finalBuyerName,
    };
    console.log(`✅ BUYERS CONVERSION - Converted item ${index}:`, converted);
    return converted;
  });

  console.log("✅ BUYERS CONVERSION - Final result:", result);
  return result;
}

export function convertVendorsToFilterValues(
  vendors: VendorInfo[]
): FilterValue[] {
  console.log("🔄 VENDORS CONVERSION - Input data:", vendors);
  console.log("🔄 VENDORS CONVERSION - Input type:", typeof vendors);
  console.log("🔄 VENDORS CONVERSION - Is array:", Array.isArray(vendors));

  if (!Array.isArray(vendors)) {
    console.warn(
      "❌ VENDORS CONVERSION - Expected array, got:",
      typeof vendors
    );
    return [];
  }

  console.log("🔄 VENDORS CONVERSION - Processing", vendors.length, "items");

  const result = vendors.map((vendor, index) => {
    console.log(`🔄 VENDORS CONVERSION - Item ${index}:`, vendor);
    console.log(
      `🔄 VENDORS CONVERSION - Item ${index} keys:`,
      Object.keys(vendor)
    );

    const vendorAny = vendor as any;

    // Try multiple possible property names for vendor number
    const vendorNum =
      vendor.vendorNum ||
      vendorAny.vendorNumber ||
      vendorAny.id ||
      vendorAny.code ||
      vendorAny.vendorCode ||
      "";

    // Try multiple possible property names for vendor name
    const vendorName =
      vendor.vendorName ||
      vendorAny.name ||
      vendorAny.description ||
      vendorAny.desc ||
      vendorAny.label ||
      vendorNum ||
      "Unknown";

    const converted = {
      fieldId: "pomVendorNum",
      filterId: vendorNum,
      filterDesc: vendorName,
    };
    console.log(`✅ VENDORS CONVERSION - Converted item ${index}:`, converted);
    return converted;
  });

  console.log("✅ VENDORS CONVERSION - Final result:", result);
  return result;
}

export function convertStatusesToFilterValues(
  statuses: StatusOption[]
): FilterValue[] {
  console.log("🔄 STATUSES CONVERSION - Input data:", statuses);
  console.log("🔄 STATUSES CONVERSION - Input type:", typeof statuses);
  console.log("🔄 STATUSES CONVERSION - Is array:", Array.isArray(statuses));

  if (!Array.isArray(statuses)) {
    console.warn(
      "❌ STATUSES CONVERSION - Expected array, got:",
      typeof statuses
    );
    return [];
  }

  console.log("🔄 STATUSES CONVERSION - Processing", statuses.length, "items");

  const result = statuses.map((status, index) => {
    console.log(`🔄 STATUSES CONVERSION - Item ${index}:`, status);
    console.log(
      `🔄 STATUSES CONVERSION - Item ${index} keys:`,
      Object.keys(status)
    );

    // Use the correct StatusOption interface properties
    const statusCode = status.statusCode || `status_${index}`;
    const statusDesc =
      status.statusDescription || statusCode || `Status ${index + 1}`;

    console.log(
      `🔍 STATUSES CONVERSION - Using StatusOption interface - code: "${statusCode}", description: "${statusDesc}"`
    );

    const converted = {
      fieldId: "Staic",
      filterId: statusCode, // Use code as the ID
      filterDesc: statusDesc, // Use description as the display name
    };
    console.log(`✅ STATUSES CONVERSION - Converted item ${index}:`, converted);
    return converted;
  });

  console.log("✅ STATUSES CONVERSION - Final result:", result);
  return result;
}

export function convertWarehousesToFilterValues(
  warehouses: WarehouseInfo[]
): FilterValue[] {
  console.log("🔄 WAREHOUSES CONVERSION - Input data:", warehouses);
  console.log("🔄 WAREHOUSES CONVERSION - Input type:", typeof warehouses);
  console.log(
    "🔄 WAREHOUSES CONVERSION - Is array:",
    Array.isArray(warehouses)
  );

  if (!Array.isArray(warehouses)) {
    console.warn(
      "❌ WAREHOUSES CONVERSION - Expected array, got:",
      typeof warehouses
    );
    return [];
  }

  console.log(
    "🔄 WAREHOUSES CONVERSION - Processing",
    warehouses.length,
    "items"
  );

  const result = warehouses.map((warehouse, index) => {
    console.log(`🔄 WAREHOUSES CONVERSION - Item ${index}:`, warehouse);
    console.log(
      `🔄 WAREHOUSES CONVERSION - Item ${index} keys:`,
      Object.keys(warehouse)
    );

    const warehouseAny = warehouse as any;

    // Log all properties for debugging
    console.log(
      `🔍 WAREHOUSES CONVERSION - All properties for item ${index}:`,
      warehouseAny
    );

    // Try multiple possible property names for warehouse code
    const warehouseCode =
      warehouse.whseCode ||
      warehouseAny.warehouseCode ||
      warehouseAny.warehouse_code ||
      warehouseAny.WarehouseCode ||
      warehouseAny.WAREHOUSE_CODE ||
      warehouseAny.code ||
      warehouseAny.id ||
      warehouseAny.whse ||
      warehouseAny.whseId ||
      warehouseAny.whse_id ||
      warehouseAny.WhseCode ||
      warehouseAny.WhseId ||
      warehouseAny.WHSE_CODE ||
      warehouseAny.WHSE_ID ||
      warehouseAny.Code ||
      warehouseAny.ID ||
      "";

    // Try multiple possible property names for warehouse description
    const warehouseDesc =
      warehouse.whseDescription ||
      warehouseAny.warehouseName ||
      warehouseAny.warehouse_name ||
      warehouseAny.WarehouseName ||
      warehouseAny.WAREHOUSE_NAME ||
      warehouseAny.description ||
      warehouseAny.desc ||
      warehouseAny.name ||
      warehouseAny.label ||
      warehouseAny.Description ||
      warehouseAny.DESC ||
      warehouseAny.Name ||
      warehouseAny.Label ||
      warehouseAny.WhseDescription ||
      warehouseAny.whse_description ||
      warehouseAny.WHSE_DESCRIPTION ||
      warehouseCode ||
      `Warehouse ${index + 1}`;

    console.log(
      `🔍 WAREHOUSES CONVERSION - Extracted warehouseCode: "${warehouseCode}", warehouseDesc: "${warehouseDesc}"`
    );

    // Ensure we have valid values
    const finalWarehouseCode = warehouseCode || `warehouse_${index}`;
    const finalWarehouseDesc = warehouseDesc || `Warehouse ${index + 1}`;

    const converted = {
      fieldId: "Whse",
      filterId: finalWarehouseCode,
      filterDesc: finalWarehouseDesc,
    };
    console.log(
      `✅ WAREHOUSES CONVERSION - Converted item ${index}:`,
      converted
    );
    return converted;
  });

  console.log("✅ WAREHOUSES CONVERSION - Final result:", result);
  return result;
}

// Main API service class
export class ApiService {
  // Cache for dropdown data to avoid repeated API calls
  private static cache = new Map<string, any>();
  private static cacheExpiry = new Map<string, number>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private static isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private static setCache<T>(key: string, data: T): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private static getCache<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key) as T;
    }
    return null;
  }

  // Get filter fields (static list)
  static async getFilterFields(): Promise<FilterField[]> {
    return [
      { fieldId: "Buyno", fieldDesc: "Buyer" },
      { fieldId: "pomVendorNum", fieldDesc: "Vendor" },
      { fieldId: "Staic", fieldDesc: "Status" },
      { fieldId: "Whse", fieldDesc: "Warehouse" },
    ];
  }

  // Get filter values for a specific field
  static async getFilterValues(fieldId: string): Promise<FilterValue[]> {
    console.log(`🔍 Getting filter values for fieldId: ${fieldId}`);
    const cacheKey = `filterValues_${fieldId}`;
    const cached = this.getCache<FilterValue[]>(cacheKey);
    if (cached) {
      console.log(`📦 Using cached data for ${fieldId}:`, cached);
      return cached;
    }

    try {
      let filterValues: FilterValue[] = [];

      switch (fieldId) {
        case "Buyno":
          console.log(`🔄 Fetching buyers data...`);
          const buyers = await fetchBuyers();
          console.log(`📊 Raw buyers data:`, buyers);
          filterValues = convertBuyersToFilterValues(buyers);
          console.log(`✅ Converted buyers to filter values:`, filterValues);
          break;
        case "pomVendorNum":
          console.log(`🔄 Fetching vendors data...`);
          const vendors = await fetchVendors();
          console.log(`📊 Raw vendors data:`, vendors);
          filterValues = convertVendorsToFilterValues(vendors);
          console.log(`✅ Converted vendors to filter values:`, filterValues);
          break;
        case "Staic":
          console.log(`🔄 Fetching statuses data...`);
          const statuses = await fetchStatuses();
          console.log(`📊 Raw statuses data:`, statuses);
          filterValues = convertStatusesToFilterValues(statuses);
          console.log(`✅ Converted statuses to filter values:`, filterValues);
          break;
        case "Whse":
          console.log(`🔄 Fetching warehouses data...`);
          const warehouses = await fetchWarehouses();
          console.log(`📊 Raw warehouses data:`, warehouses);
          filterValues = convertWarehousesToFilterValues(warehouses);
          console.log(
            `✅ Converted warehouses to filter values:`,
            filterValues
          );
          break;
        default:
          console.warn(`Unknown field ID: ${fieldId}`);
          return [];
      }

      console.log(`💾 Caching filter values for ${fieldId}:`, filterValues);
      this.setCache(cacheKey, filterValues);
      return filterValues;
    } catch (error: any) {
      console.error(`❌ Error getting filter values for ${fieldId}:`, error);
      return [];
    }
  }

  // Test function to check API responses
  static async testAPIResponses(): Promise<void> {
    console.log("🧪 Testing API responses...");

    try {
      // Test warehouses API specifically
      console.log("🔍 Testing warehouses API...");
      const warehousesResponse = await fetchAPI<any>(
        API_CONFIG.WAREHOUSES_API_URL
      );
      console.log("🔍 Direct warehouses API response:", warehousesResponse);
      console.log("🔍 Warehouses response type:", typeof warehousesResponse);
      console.log("🔍 Warehouses is array:", Array.isArray(warehousesResponse));
      if (Array.isArray(warehousesResponse) && warehousesResponse.length > 0) {
        console.log(
          "🔍 First warehouse item structure:",
          warehousesResponse[0]
        );
        console.log(
          "🔍 First warehouse item keys:",
          Object.keys(warehousesResponse[0])
        );
      }

      // Test buyers API
      const buyersResponse = await fetchAPI<any>(API_CONFIG.BUYERS_API_URL);
      console.log("🔍 Direct buyers API response:", buyersResponse);
      console.log("🔍 Buyers response type:", typeof buyersResponse);
      console.log("🔍 Buyers is array:", Array.isArray(buyersResponse));
      if (Array.isArray(buyersResponse) && buyersResponse.length > 0) {
        console.log("🔍 First buyer item structure:", buyersResponse[0]);
        console.log(
          "🔍 First buyer item keys:",
          Object.keys(buyersResponse[0])
        );
      }

      // Test vendors API
      const vendorsResponse = await fetchAPI<any>(API_CONFIG.VENDORS_API_URL, {
        params: { vhsName: "MASTERYY" },
      });
      console.log("🔍 Direct vendors API response:", vendorsResponse);
      console.log("🔍 Vendors response type:", typeof vendorsResponse);
      console.log("🔍 Vendors is array:", Array.isArray(vendorsResponse));
      if (Array.isArray(vendorsResponse) && vendorsResponse.length > 0) {
        console.log("🔍 First vendor item structure:", vendorsResponse[0]);
        console.log(
          "🔍 First vendor item keys:",
          Object.keys(vendorsResponse[0])
        );
      }

      // Test statuses API
      const statusesResponse = await fetchAPI<any>(API_CONFIG.STATUSES_API_URL);
      console.log("🔍 Direct statuses API response:", statusesResponse);
      console.log("🔍 Statuses response type:", typeof statusesResponse);
      console.log("🔍 Statuses is array:", Array.isArray(statusesResponse));
      if (Array.isArray(statusesResponse) && statusesResponse.length > 0) {
        console.log("🔍 First status item structure:", statusesResponse[0]);
        console.log(
          "🔍 First status item keys:",
          Object.keys(statusesResponse[0])
        );
      }
    } catch (error: any) {
      console.error("🚨 Error testing API responses:", error);
    }
  }

  // Search PO Items using the DOM API
  static async searchPOItems(
    searchData: SearchFormData
  ): Promise<POItemData[]> {
    try {
      console.log("🔍 Searching PO Items with data:", searchData);
      console.log("🔍 Date values - dueDateFrom:", searchData.dueDateFrom, "dueDateTo:", searchData.dueDateTo);

      // Transform SearchFormData to POItemDomRequest format
      const formattedDateFrom = searchData.dueDateFrom
        ? dayjs(searchData.dueDateFrom).isValid()
          ? dayjs(searchData.dueDateFrom).format("MM/DD/YYYY")
          : ""
        : "";
      const formattedDateTo = searchData.dueDateTo
        ? dayjs(searchData.dueDateTo).isValid()
          ? dayjs(searchData.dueDateTo).format("MM/DD/YYYY")
          : ""
        : "";

      console.log("🔍 Formatted dates - From:", formattedDateFrom, "To:", formattedDateTo);

      const requestPayload: POItemDomRequest = {
        vhsName: "MASTERYY", // Default VHS name - could be configurable
        itemNumber: searchData.itemNumber || "",
        vendorNumber: searchData.vendorValue || "",
        warehouse: searchData.warehouseValue || "",
        statusCode: searchData.statusValue || "",
        buyerNumber: searchData.buyerValue || "",
        dueDateFrom: formattedDateFrom,
        dueDateTo: formattedDateTo,
        userId: "SYSTEM", // Default user ID - could be from auth context
        application: "DOM_INQUIRY", // Application identifier
      };

      console.log("📤 API Request payload:", requestPayload);

      const response: AxiosResponse<POItemDomResponse> =
        await axiosInstance.post(
          API_CONFIG.PO_ITEMS_API_URL("afi"),
          requestPayload
        );

      console.log("📥 API Response:", response.data);

      // Return the data array from the response
      return response.data.data || [];
    } catch (error) {
      console.error("❌ Error searching PO Items:", error);

      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          console.error(
            "Server error:",
            error.response.status,
            error.response.data
          );
          throw new Error(
            `Search failed: ${error.response.status} - ${error.response.statusText}`
          );
        } else if (error.request) {
          // Request was made but no response received
          console.error("Network error:", error.request);
          throw new Error("Network error: Unable to reach the server");
        }
      }

      // Generic error
      throw new Error("Search failed. Please try again.");
    }
  }
}

// ===== PRODUCTION SCHEDULE API FUNCTIONS =====

// Fetch Production Vendors from API
export async function fetchProductionVendors(): Promise<FilterValue[]> {
  try {
    const params = {
      environment: "afi",
      vhsName: "masteryy"
    };

    const data = await fetchAPI<any>(API_CONFIG.PRODUCTION_VENDORS_API_URL, { params });
    console.log("🔍 PRODUCTION VENDORS - Raw API response:", data);

    // Handle the response structure: { data: [...], success: true, message: "...", correlationId: "..." }
    let vendorArray: any[] = [];

    if (data && data.data && Array.isArray(data.data)) {
      vendorArray = data.data;
    } else if (Array.isArray(data)) {
      vendorArray = data;
    } else {
      console.warn("🔍 PRODUCTION VENDORS - Unexpected response structure:", data);
      return [];
    }

    const extractedData = vendorArray
      .filter((vendor: any) => vendor && vendor.isActive !== false) // Only include active vendors
      .map((vendor: any) => ({
        fieldId: "Vendor",
        filterId: vendor.vendorNumber || vendor.vendorId || "",
        filterDesc: vendor.vendorName || vendor.name || "",
      }))
      .filter((vendor) => vendor.filterId && vendor.filterDesc); // Remove invalid entries

    console.log("✅ PRODUCTION VENDORS - Extracted data:", extractedData);
    console.log("✅ PRODUCTION VENDORS - Extracted count:", extractedData.length);

    return extractedData;
  } catch (error: any) {
    console.error("❌ PRODUCTION VENDORS - Error fetching vendors:", error);

    // Fallback to empty array on error
    return [];
  }
}

// Fetch Production Resources from API
export async function fetchProductionResources(vendorId?: string): Promise<ProductionResourceInfo[]> {
  // Return static 'ALL Production Resource' option since API is not available
  console.log("🔍 PRODUCTION RESOURCES - Returning static 'ALL Production Resource' option");
  return [
    {
      resourceId: "ALL",
      resourceName: "ALL Production Resource",
      vendorId: "",
    }
  ];
}

// Fetch Item Classes from API
export async function fetchItemClasses(): Promise<ItemClassInfo[]> {
  try {
    const params = {
      environment: "afi"
    };

    const data = await fetchAPI<any>(API_CONFIG.ITEM_CLASSES_API_URL, { params });
    console.log("🔍 ITEM CLASSES - Raw API response:", JSON.stringify(data, null, 2));

    // Handle the response structure: { data: [...], success: true, message: "...", correlationId: "..." }
    let itemArray: any[] = [];

    if (data && data.data && Array.isArray(data.data)) {
      itemArray = data.data;
    } else if (Array.isArray(data)) {
      itemArray = data;
    } else {
      console.warn("🔍 ITEM CLASSES - Unexpected response structure:", data);
      return [];
    }

    console.log("🔍 ITEM CLASSES - Array length:", itemArray.length);
    if (itemArray.length > 0) {
      console.log("🔍 ITEM CLASSES - First item:", itemArray[0]);
      console.log("🔍 ITEM CLASSES - Available fields:", Object.keys(itemArray[0]));
    }

    // Map the actual API response fields
    const extractedData = itemArray.map((item: any) => ({
      classCode: item.itemClass || "",
      classDescription: item.itemClass || "Unknown Item Class"
    }));

    console.log("✅ ITEM CLASSES - Extracted data:", extractedData);
    console.log("✅ ITEM CLASSES - Extracted count:", extractedData.length);

    console.log("✅ ITEM CLASSES - Extracted data:", extractedData);
    return extractedData;
  } catch (error) {
    console.error("❌ Error fetching item classes:", error);
    return [];
  }
}

// Fetch DRP Codes from API
export async function fetchDRPCodes(): Promise<DRPInfo[]> {
  try {
    const params = {
      environment: "afi"
    };

    const data = await fetchAPI<any>(API_CONFIG.DRP_API_URL, { params });
    console.log("🔍 DRP CODES - Raw API response:", JSON.stringify(data, null, 2));
    console.log("🔍 DRP CODES - Response type:", typeof data);
    console.log("🔍 DRP CODES - Is array:", Array.isArray(data));
    if (data && typeof data === 'object') {
      console.log("🔍 DRP CODES - Object keys:", Object.keys(data));
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        console.log("🔍 DRP CODES - First data item:", JSON.stringify(data.data[0], null, 2));
        console.log("🔍 DRP CODES - First data item keys:", Object.keys(data.data[0]));
      }
    }

    // Process the actual API response
    console.log("� DRP CODES - Using mock data temporarily to fix display issue");


    // Handle the response structure: { data: [...], success: true, message: "...", correlationId: "..." }
    let drpArray: any[] = [];

    if (data && data.data && Array.isArray(data.data)) {
      drpArray = data.data;
    } else if (Array.isArray(data)) {
      drpArray = data;
    } else {
      console.warn("🔍 DRP CODES - Unexpected response structure:", data);
      // Return mock data for unexpected response structure
      console.log("🔄 DRP CODES - Using mock data for unexpected response structure");
      return [
        { drpCode: "DRP001", drpDescription: "DRP Planner Alpha" },
        { drpCode: "DRP002", drpDescription: "DRP Planner Beta" },
        { drpCode: "DRP003", drpDescription: "DRP Planner Gamma" },
        { drpCode: "DRP004", drpDescription: "DRP Planner Delta" },
        { drpCode: "DRP005", drpDescription: "DRP Planner Epsilon" },
      ];
    }

    // Log the first item to understand the structure
    if (drpArray.length > 0) {
      console.log("🔍 DRP CODES - First item structure:", JSON.stringify(drpArray[0], null, 2));
      console.log("🔍 DRP CODES - Available fields:", Object.keys(drpArray[0]));
    }

    // Map the actual API response fields
    const extractedData = drpArray.map((item: any) => ({
      drpCode: item.plannerCode || "",
      drpDescription: item.plannerName || item.plannerCode || "Unknown DRP"
    }));

    console.log("✅ DRP CODES - Extracted data:", extractedData);
    console.log("✅ DRP CODES - Extracted count:", extractedData.length);

    return extractedData;
  } catch (error) {
    console.error("❌ Error fetching DRP codes:", error);
    return [];
  }
}

// Fetch FC Codes from API
export async function fetchFCCodes(): Promise<FCInfo[]> {
  try {
    const params = {
      environment: "afi"
    };

    const data = await fetchAPI<any>(API_CONFIG.FC_API_URL, { params });
    console.log("🔍 FC CODES - Raw API response:", JSON.stringify(data, null, 2));

    // Temporarily return mock data until we fix the field mapping
    console.log("� FC CODES - Using mock data temporarily to fix display issue");


    // Handle the response structure: { data: [...], success: true, message: "...", correlationId: "..." }
    let fcArray: any[] = [];

    if (data && data.data && Array.isArray(data.data)) {
      fcArray = data.data;
    } else if (Array.isArray(data)) {
      fcArray = data;
    } else {
      console.warn("🔍 FC CODES - Unexpected response structure:", data);
      return [];
    }

    console.log("🔍 FC CODES - Array length:", fcArray.length);
    if (fcArray.length > 0) {
      console.log("🔍 FC CODES - First item:", fcArray[0]);
      console.log("🔍 FC CODES - Available fields:", Object.keys(fcArray[0]));
    }

    // Map the actual API response fields (same structure as DRP)
    const extractedData = fcArray.map((item: any) => ({
      fcCode: item.plannerCode || "",
      fcDescription: item.plannerName || item.plannerCode || "Unknown FC"
    }));

    console.log("✅ FC CODES - Extracted data:", extractedData);
    return extractedData;
  } catch (error) {
    console.error("❌ Error fetching FC codes:", error);
    return [];
  }
}

// Fetch Offices from API
export async function fetchOffices(vhsName: string = "MASTERYY", userName: string = "system"): Promise<OfficeInfo[]> {
  try {
    const params = {
      vhsName,
      userName,
    };

    const data = await fetchAPI<any>(API_CONFIG.OFFICES_API_URL, { params });
    console.log("🔍 OFFICES - Raw API response:", data);

    // Handle the response structure: { data: [...], success: true, message: "...", correlationId: "..." }
    let officeArray: any[] = [];

    if (data && data.data && Array.isArray(data.data)) {
      officeArray = data.data;
    } else if (Array.isArray(data)) {
      officeArray = data;
    } else {
      console.warn("🔍 OFFICES - Unexpected response structure:", data);
      return [
        { officeCode: "AFI", officeName: "Ashley Furniture Industries" },
        { officeCode: "HOM", officeName: "Home Office" },
        { officeCode: "MFG", officeName: "Manufacturing" },
      ];
    }

    const extractedData = officeArray.map((item: any) => ({
      officeCode: item.officeCode || item.code || "",
      officeName: item.officeName || item.name || item.description || "",
    }));

    console.log("✅ OFFICES - Extracted data:", extractedData);
    console.log("✅ OFFICES - Extracted count:", extractedData.length);
    return extractedData;
  } catch (error) {
    console.error("❌ Error fetching offices:", error);
    return [
      { officeCode: "AFI", officeName: "Ashley Furniture Industries" },
      { officeCode: "HOM", officeName: "Home Office" },
      { officeCode: "MFG", officeName: "Manufacturing" },
    ];
  }
}

// Production Schedule API Service Class
class ProductionSchedApiService {
  // Get filter values for Production Schedule dropdowns
  async getFilterValues(filterType: string): Promise<FilterValue[]> {
    try {
      console.log(`🔄 Getting Production Schedule filter values for: ${filterType}`);

      let data: FilterValue[] = [];

      switch (filterType) {
        case "Vendor":
          // Use the real API endpoint for production vendors
          data = await fetchProductionVendors();
          break;

        case "Warehouse":
          // Use the real API endpoint for warehouses
          const warehouses = await fetchWarehouses();
          data = convertWarehousesToFilterValues(warehouses);
          break;

        case "ProductionResource":
          // Use the real API endpoint for production resources
          const productionResources = await fetchProductionResources();
          data = productionResources.map(r => ({
            fieldId: "ProductionResource",
            filterId: r.resourceId,
            filterDesc: r.resourceName,
          }));
          break;

        case "ItemClass":
          // Use the real API endpoint for item classes
          console.log("🔍 Fetching ItemClass data...");
          const itemClasses = await fetchItemClasses();
          console.log("📊 ItemClass raw data:", itemClasses);
          data = itemClasses.map(c => ({
            fieldId: "ItemClass",
            filterId: c.classCode,
            filterDesc: c.classDescription,
          }));
          console.log("✅ ItemClass mapped data:", data);
          break;

        case "DRP":
          // Use the real API endpoint for DRP codes
          console.log("🔍 Fetching DRP data...");
          const drpCodes = await fetchDRPCodes();
          console.log("📊 DRP raw data:", drpCodes);
          data = drpCodes.map(d => ({
            fieldId: "DRP",
            filterId: d.drpCode,
            filterDesc: d.drpDescription,
          }));
          console.log("✅ DRP mapped data:", data);
          break;

        case "FC":
          // Use the real API endpoint for FC codes
          console.log("🔍 Fetching FC data...");
          const fcCodes = await fetchFCCodes();
          console.log("📊 FC raw data:", fcCodes);
          data = fcCodes.map(f => ({
            fieldId: "FC",
            filterId: f.fcCode,
            filterDesc: f.fcDescription,
          }));
          console.log("✅ FC mapped data:", data);
          break;

        case "Office":
          // Use the real API endpoint for offices
          console.log("🔍 Fetching Office data...");
          const offices = await fetchOffices();
          console.log("📊 Office raw data:", offices);
          data = offices.map(o => ({
            fieldId: "Office",
            filterId: o.officeCode,
            filterDesc: o.officeName,
          }));
          console.log("✅ Office mapped data:", data);
          break;

        default:
          console.warn(`Unknown Production Schedule filter type: ${filterType}`);
          return [];
      }

      console.log(`✅ Retrieved ${data.length} Production Schedule values for ${filterType}`);
      return data;
    } catch (error) {
      console.error(`❌ Error getting Production Schedule filter values for ${filterType}:`, error);
      return [];
    }
  }

  // Search Production Schedule data
  async searchProductionSchedule(searchData: ProductionSchedSearchFormData): Promise<ProductionSchedData[]> {
    try {
      console.log("🔄 Searching Production Schedule with real API:", searchData);

      // Transform search form data to API request format
      const apiRequest: ProductionSchedApiRequest = {
        itemNum: this.getFilterValue(searchData.filterRows, "Item") || "",
        vendorNum: this.getFilterValue(searchData.filterRows, "Vendor") || "",
        warehouse: this.getFilterValue(searchData.filterRows, "Warehouse") || "",
        drpPlanner: this.getFilterValue(searchData.filterRows, "DRP") || "",
        forecastPlanner: this.getFilterValue(searchData.filterRows, "FC") || "",
        pastWeeks: searchData.timePeriod.pastWeeks,
        forecastWeeks: searchData.timePeriod.futureWeeks,
        vhsName: "masteryy",
        user: "SYSTEM",
        groupByWhse: "false",
        rpFilter: searchData.reportOptions.rpFilter,
        plannedOrders: searchData.orderTypeFilters.plannedOrders ? 1 : 0,
        firmedOrders: searchData.orderTypeFilters.firmedOrders ? 1 : 0,
        shippedOrders: searchData.orderTypeFilters.shippedOrders ? 1 : 0,
        app: "ProductionSchedule",
        reportBy: this.getReportByValue(searchData.reportOptions.reportBy),
        excludeContainerDirect: searchData.reportOptions.containerDirectFilter ? 0 : 1,
        productionResource: this.getFilterValue(searchData.filterRows, "ProductionResource") || "",
        itemClass: this.getFilterValue(searchData.filterRows, "ItemClass") || ""
      };

      console.log("🔄 API Request payload:", apiRequest);

      // Make API call
      const response = await fetchAPI<ProductionSchedApiResponse>(
        API_CONFIG.PRODUCTION_SCHEDULE_API_URL("afi"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: apiRequest,
        }
      );

      console.log("🔄 API Response:", response);

      if (!response.success) {
        throw new Error(response.errorMessage || "API request failed");
      }

      // Transform API response to internal format
      const results = this.transformApiResponse(response.items);

      console.log(`✅ Production Schedule search completed: Found ${results.length} items`);

      return results;
    } catch (error) {
      console.error("❌ Error searching Production Schedule:", error);
      throw new Error("Production Schedule search failed. Please try again.");
    }
  }

  // Helper method to get filter value by type
  private getFilterValue(filterRows: any[], fieldType: string): string {
    const filter = filterRows.find(row => row.fieldType === fieldType && row.isActive);
    return filter ? filter.filterValue : "";
  }

  // Helper method to convert reportBy string to number
  private getReportByValue(reportBy: string): number {
    switch (reportBy.toLowerCase()) {
      case "daily": return 1;
      case "weekly": return 2;
      case "monthly": return 3;
      default: return 2; // Default to weekly
    }
  }

  // Transform API response items to internal ProductionSchedData format
  private transformApiResponse(items: ProductionSchedApiResponseItem[]): ProductionSchedData[] {
    return items.map(item => ({
      orderNum: item.orderNum,
      pQty: item.pQty,
      fQty: item.fQty,
      sQty: item.sQty,
      wkNum: item.wkNum,
      itemNum: item.itemNum,
      itemClass: item.itemClass,
      itemDesc: item.itemDesc,
      replaceableFlag: item.replaceableFlag,
      whse: item.whse,
      vendorNum: item.vendorNum,
      vendorName: item.vendorName,
      productionResource: item.productionResource,
    }));
  }

  // ============================================================================
  // POs Paid API Methods
  // ============================================================================

  /**
   * Search POs Paid data
   * @param searchData Search criteria
   * @returns Promise<POsPaidData[]>
   */
  static async searchPOsPaid(searchData: POsPaidSearchFormData): Promise<POsPaidData[]> {
    try {
      console.log("🔍 POsPaidApiService - Searching with criteria:", searchData);

      const request: POsPaidRequest = {
        itemNumber: searchData.itemNumber,
        warehouse: searchData.warehouse || "",
        status: searchData.status || "",
        vendor: searchData.vendor || "",
        dateField: parseInt(searchData.dateField || "-1"),
        dateFrom: searchData.dateFrom || "",
        dateTo: searchData.dateTo || "",
        orderBy: 1, // Default sort order
        vhsName: "MASTERYY", // Default VHS name
        user: "system", // Default user
        app: "POsPaidInq.asp", // Application name
      };

      const response = await fetchAPI<POsPaidResponse>(
        API_CONFIG.POS_PAID_API_URL("afi"),
        {
          method: "POST",
          data: request,
        }
      );

      console.log("✅ POsPaidApiService - Search successful:", response);
      return response.data || [];
    } catch (error) {
      console.error("❌ POsPaidApiService - Search failed:", error);
      throw new Error("Failed to search POs Paid data");
    }
  }

  /**
   * Get PO statuses for POs Paid inquiry
   * @returns Promise<StatusOption[]>
   */
  static async getPOStatuses(): Promise<StatusOption[]> {
    try {
      console.log("🔍 POsPaidApiService - Fetching PO statuses...");

      const data = await fetchAPI<any>(API_CONFIG.POS_PAID_STATUSES_API_URL, {
        params: {
          environment: "afi",
        },
      });

      console.log("✅ POsPaidApiService - PO statuses loaded:", data);

      // Transform API response to StatusOption format
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          statusCode: item.statusCode || item.code,
          statusDescription: item.statusDescription || item.description,
          isActive: item.isActive !== false, // Default to true if not specified
        }));
      }

      // Return mock data as fallback
      console.warn("🔄 POsPaidApiService - Using fallback mock PO statuses");
      return [
        { statusCode: "10", statusDescription: "Cfm Required", isActive: true },
        { statusCode: "20", statusDescription: "On-Order", isActive: true },
        { statusCode: "30", statusDescription: "In-Transit", isActive: true },
        { statusCode: "35", statusDescription: "Partial RcToStk", isActive: true },
        { statusCode: "40", statusDescription: "Rc. to Stk.", isActive: true },
        { statusCode: "50", statusDescription: "Paid", isActive: true },
      ];
    } catch (error) {
      console.error("❌ POsPaidApiService - Error fetching PO statuses:", error);

      // Return mock data as fallback
      console.warn("🔄 POsPaidApiService - Using fallback mock PO statuses");
      return [
        { statusCode: "10", statusDescription: "Cfm Required", isActive: true },
        { statusCode: "20", statusDescription: "On-Order", isActive: true },
        { statusCode: "30", statusDescription: "In-Transit", isActive: true },
        { statusCode: "35", statusDescription: "Partial RcToStk", isActive: true },
        { statusCode: "40", statusDescription: "Rc. to Stk.", isActive: true },
        { statusCode: "50", statusDescription: "Paid", isActive: true },
      ];
    }
  }


}

// Debug function to test specific API endpoints and understand response structure
export async function debugProductionScheduleAPIs(): Promise<void> {
  console.log("🧪 DEBUG: Testing Production Schedule API endpoints...");

  try {
    // Test DRP Planners API
    console.log("🔍 Testing DRP Planners API...");
    const drpResponse = await fetchAPI<any>(API_CONFIG.DRP_API_URL, { params: { environment: "afi" } });
    console.log("📊 DRP Response Structure:", {
      type: typeof drpResponse,
      isArray: Array.isArray(drpResponse),
      keys: drpResponse && typeof drpResponse === 'object' ? Object.keys(drpResponse) : 'N/A',
      hasData: drpResponse && drpResponse.data ? true : false,
      dataLength: drpResponse && drpResponse.data && Array.isArray(drpResponse.data) ? drpResponse.data.length : 'N/A'
    });

    if (drpResponse && drpResponse.data && Array.isArray(drpResponse.data) && drpResponse.data.length > 0) {
      console.log("📋 DRP First Item:", JSON.stringify(drpResponse.data[0], null, 2));
      console.log("� DRP First Item Keys:", Object.keys(drpResponse.data[0]));
    }

    // Test FC Planners API
    console.log("🔍 Testing FC Planners API...");
    const fcResponse = await fetchAPI<any>(API_CONFIG.FC_API_URL, { params: { environment: "afi" } });
    console.log("📊 FC Response Structure:", {
      type: typeof fcResponse,
      isArray: Array.isArray(fcResponse),
      keys: fcResponse && typeof fcResponse === 'object' ? Object.keys(fcResponse) : 'N/A',
      hasData: fcResponse && fcResponse.data ? true : false,
      dataLength: fcResponse && fcResponse.data && Array.isArray(fcResponse.data) ? fcResponse.data.length : 'N/A'
    });

    if (fcResponse && fcResponse.data && Array.isArray(fcResponse.data) && fcResponse.data.length > 0) {
      console.log("📋 FC First Item:", JSON.stringify(fcResponse.data[0], null, 2));
      console.log("📋 FC First Item Keys:", Object.keys(fcResponse.data[0]));
    }

    // Test Item Classes API
    console.log("🔍 Testing Item Classes API...");
    const itemResponse = await fetchAPI<any>(API_CONFIG.ITEM_CLASSES_API_URL, { params: { environment: "afi" } });
    console.log("� Item Classes Response Structure:", {
      type: typeof itemResponse,
      isArray: Array.isArray(itemResponse),
      keys: itemResponse && typeof itemResponse === 'object' ? Object.keys(itemResponse) : 'N/A',
      hasData: itemResponse && itemResponse.data ? true : false,
      dataLength: itemResponse && itemResponse.data && Array.isArray(itemResponse.data) ? itemResponse.data.length : 'N/A'
    });

    if (itemResponse && itemResponse.data && Array.isArray(itemResponse.data) && itemResponse.data.length > 0) {
      console.log("📋 Item Classes First Item:", JSON.stringify(itemResponse.data[0], null, 2));
      console.log("📋 Item Classes First Item Keys:", Object.keys(itemResponse.data[0]));
    }

  } catch (error) {
    console.error("❌ Error in debug function:", error);
  }
}

// Export default instance
export const apiService = ApiService;
export const productionSchedApiService = new ProductionSchedApiService();
export const posPaidApiService = ApiService;
