import { moduleFederationPlugin } from '@module-federation/modern-js';

const { appTools, defineConfig } = require('@modern-js/app-tools');

// https://modernjs.dev/en/configure/app/usage
module.exports = defineConfig({
  runtime: {
    router: true,
  },
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
    moduleFederationPlugin(),
  ],

  html: {
    template: './public/index.html',
  },

  tools: {
    devServer: {
      client: {
        webSocketURL: {
          hostname: 'localhost',
          pathname: '/webpack-hmr',
          port: 8080,
          protocol: 'ws',
        },
      },
      hot: true,
      liveReload: true,
      proxy: {
        // PO Items API - Purchase Order Domain Gateway
        '/api/po-item-inquiry-dom': {
          target:
            'https://ashley-supplier-purchase-order-rest-domain-gateway.aks.eastus.azure.dev.a1p-apps.p6m.run',
          changeOrigin: true,
          secure: true,
          logLevel: 'debug',
          onProxyReq: (proxyReq: any, req: any, res: any) => {
            console.log(
              '🔄 PO Items Proxy - API request:',
              req.method,
              req.url,
            );
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          },
          onProxyRes: (proxyRes: any, req: any, res: any) => {
            console.log(
              '✅ PO Items Proxy - API response:',
              proxyRes.statusCode,
              'for',
              req.url,
            );
            console.log(
              '📄 PO Items Proxy - Content-Type:',
              proxyRes.headers['content-type'],
            );
          },
          onError: (err: any, req: any, res: any) => {
            console.error(
              '❌ PO Items Proxy - Error for',
              req.url,
              ':',
              err.message,
            );
          },
        } as any,
        // Production Schedule API - Purchase Order Domain Gateway
        '/api/ProductionSchedule': {
          target:
            'https://ashley-supplier-purchase-order-rest-domain-gateway.aks.eastus.azure.dev.a1p-apps.p6m.run',
          changeOrigin: true,
          secure: true,
          logLevel: 'debug',
          onProxyReq: (proxyReq: any, req: any, res: any) => {
            console.log(
              '🔄 Production Schedule Proxy - API request:',
              req.method,
              req.url,
            );
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          },
          onProxyRes: (proxyRes: any, req: any, res: any) => {
            console.log(
              '✅ Production Schedule Proxy - API response:',
              proxyRes.statusCode,
              'for',
              req.url,
            );
            console.log(
              '📄 Production Schedule Proxy - Content-Type:',
              proxyRes.headers['content-type'],
            );
          },
          onError: (err: any, req: any, res: any) => {
            console.error(
              '❌ Production Schedule Proxy - Error for',
              req.url,
              ':',
              err.message,
            );
          },
        } as any,
        // POs Paid API - Purchase Order Domain Gateway
        '/api/POsPaid': {
          target:
            'https://ashley-supplier-purchase-order-rest-domain-gateway.aks.eastus.azure.dev.a1p-apps.p6m.run',
          changeOrigin: true,
          secure: true,
          logLevel: 'debug',
          onProxyReq: (proxyReq: any, req: any, res: any) => {
            console.log(
              '🔄 POs Paid Proxy - API request:',
              req.method,
              req.url,
            );
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          },
          onProxyRes: (proxyRes: any, req: any, res: any) => {
            console.log(
              '✅ POs Paid Proxy - API response:',
              proxyRes.statusCode,
              'for',
              req.url,
            );
            console.log(
              '📄 POs Paid Proxy - Content-Type:',
              proxyRes.headers['content-type'],
            );
          },
          onError: (err: any, req: any, res: any) => {
            console.error(
              '❌ POs Paid Proxy - Error for',
              req.url,
              ':',
              err.message,
            );
          },
        } as any,
        // General API - Supplier Domain Gateway (for common endpoints)
        '/api': {
          target:
            'https://ashley-supplier-supplier-rest-domain-gateway.aks.eastus.azure.dev.a1p-apps.p6m.run',
          changeOrigin: true,
          secure: true,
          logLevel: 'debug',
          onProxyReq: (proxyReq: any, req: any, res: any) => {
            console.log(
              '🔄 DevServer Proxy - API request:',
              req.method,
              req.url,
            );
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          },
          onProxyRes: (proxyRes: any, req: any, res: any) => {
            console.log(
              '✅ DevServer Proxy - API response:',
              proxyRes.statusCode,
              'for',
              req.url,
            );
            console.log(
              '📄 DevServer Proxy - Content-Type:',
              proxyRes.headers['content-type'],
            );
          },
          onError: (err: any, req: any, res: any) => {
            console.error(
              '❌ DevServer Proxy - Error for',
              req.url,
              ':',
              err.message,
            );
          },
        } as any,
      },
    },
  },
});
