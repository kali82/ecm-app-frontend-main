// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'ce66f27c-6d68-497a-ba2d-6a26f3ca574d',
  appId: 'https://worksite.onmicrosoft.com/SG_ECM-App_D/user_impersonation',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
