const PROXY_CONFIG = [
  {
    context: ['/public/api', '/api', '/admin'],
    // target: 'http://localhost:8080',
    target: 'https://ecm-app.de-d.aks.schaeffler.com', // using dev env,
    secure: true,
    changeOrigin: true,
  },
  {
    context: ['/dotnet'],
    // target: 'http://localhost:5000',
    target: 'https://ecm-app.de-d.aks.schaeffler.com', // using dev env,
    secure: true,
    changeOrigin: true,
  },
];

module.exports = PROXY_CONFIG;
