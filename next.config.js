const withTM = require('next-transpile-modules')(['react-frappe-charts', 'frappe-charts']);

module.exports = withTM({
  /* Optionally, specify additional settings here */
  publicRuntimeConfig: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 50, 100, 200, 350, 500],
  },
});
