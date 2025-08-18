# ItmInquiryDOM - Domestic PO Item Inquiry

A modern React application migrated from Classic ASP, built with Modern.js and Ant Design v5.26.7.

## 🚀 Migration Overview

This project represents the successful migration of `ItmInquiryDOM.asp` from Classic ASP to a modern React application following the Ashley Design System guidelines.

### Key Improvements

- ✅ **Simplified UI**: Removed complex logical and comparison operators
- ✅ **Modern Stack**: Modern.js + React + TypeScript + Ant Design v5.26.7
- ✅ **Responsive Design**: Mobile-first approach with beautiful professional UI
- ✅ **Container Architecture**: Main, Header, Content, Actions structure
- ✅ **Mock Data Integration**: Complete mock data service for development
- ✅ **Form Validation**: Comprehensive validation and error handling

### Simplified Design Changes

**Before (Classic ASP):**

- Complex 5-row filter system with AND/OR logical operators
- Comparison operators (= and <>)
- Sequential validation requirements
- jQuery-based UI with multiple libraries

**After (Modern React):**

- Clean 4-filter system with implicit AND logic
- Removed logical and comparison operators
- Simplified validation rules
- Single Ant Design component library

## 🛠 Tech Stack

- **Framework**: Modern.js v2.68.6
- **UI Library**: Ant Design v5.26.7 (ONLY)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Date Handling**: dayjs
- **Icons**: @ant-design/icons

## 📁 Project Structure

```
src/
├── components/
│   ├── ItmInquiryDOMContainer.tsx    # Main container component
│   ├── SearchForm.tsx                # Simplified search form
│   ├── ResultsTable.tsx              # Data display table
│   └── ExportOptions.tsx             # Export functionality
├── services/
│   └── mockDataService.ts            # Mock data for development
├── types/
│   └── index.ts                      # TypeScript interfaces
├── styles/
│   └── theme.ts                      # Ant Design theme configuration
└── routes/
    ├── page.tsx                      # Main page component
    └── layout.tsx                    # Layout wrapper
```

## 🎨 Features

### Search Functionality

- **Required Field**: Item Number (primary search)
- **Date Range**: Due From/To dates with date picker
- **4 Optional Filters**: Buyer, Vendor, Status, Warehouse
- **Cascading Dropdowns**: Dynamic value loading based on field selection

### Data Display

- **Responsive Table**: Sortable, filterable results table
- **Status Indicators**: Color-coded status tags
- **Overdue Highlighting**: Red highlighting for overdue items
- **Action Buttons**: View and Edit PO functionality

### Export Options

- **In Browser**: View results in current window
- **Excel Download**: Export to Excel format
- **Email Report**: Send results via email

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm serve
```

### Development Server

The application will be available at:

- Local: http://localhost:8080
- Network: Available on your local network

## 🔧 Configuration

### Theme Customization

The Ashley Design System theme is configured in `src/styles/theme.ts`:

```typescript
export const ashleyTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1890ff",
    fontFamily: "Arial, sans-serif",
    borderRadius: 6,
    // ... more theme tokens
  },
};
```

### Mock Data

Development uses mock data from `src/services/mockDataService.ts`. Replace with actual API calls for production.

## 📊 Component Props

### ItmInquiryDOMContainer

```typescript
interface ItmInquiryDOMProps {
  companyCode?: string; // Optional company identifier
}
```

### Usage

```tsx
<ItmInquiryDOMContainer companyCode="ASHLEY" />
```

## 🧪 Testing

The application includes comprehensive mock data for testing all functionality:

```bash
# Run tests (when implemented)
pnpm test

# Run linting
pnpm lint
```

## 📝 Migration Notes

### Removed Features (Simplified Design)

- **Logical Operators**: AND/OR dropdowns removed (implicit AND logic)
- **Comparison Operators**: =/≠ dropdowns removed (implicit equals logic)
- **Sequential Validation**: No longer required to fill filters in order
- **Complex Dependencies**: Simplified interdependent validation rules

### Retained Features

- **Item Number Search**: Primary required field
- **Date Range Filtering**: Due From/To date selection
- **Cascading Dropdowns**: Field-based value filtering
- **Export Functionality**: Browser, Excel, Email options
- **Data Display**: Comprehensive results table

### Future Enhancements

- [ ] API integration to replace mock data
- [ ] Advanced filtering options
- [ ] Real-time data updates
- [ ] Enhanced export formats
- [ ] User preferences storage
- [ ] Accessibility improvements

## 🤝 Contributing

1. Follow the Ashley Design System guidelines
2. Use only Ant Design v5.26.7+ components
3. Maintain TypeScript strict mode
4. Follow the established project structure
5. Add comprehensive tests for new features

## 📄 License

This project is part of the Ashley Furniture Industries supply chain system.

## 🔗 Related Documentation

- [Ashley Design System Guidelines](../MIGRATION_ANALYSIS.md)
- [Dropdown Analysis & Simplification](../DROPDOWN_ANALYSIS.md)
- [Modern.js Documentation](https://modernjs.dev/en)
- [Ant Design Documentation](https://ant.design/)
