# ECM App

This project is a helloworld template for a frontend application based on Angular.
It is provided by the Software Competence Center in order to kickstart your application development ramp-up phase and to showcase builtin best practices of modern frontend development and devops.
Furthermore it is designed to be integrated in the [Hello World Reference Architecture](https://confluence.schaeffler.com/x/292ZCw), which builds on top of the [AKS Shared Cluster](https://confluence.schaeffler.com/x/upS7Aw).

## Do you want to deploy to the Public Shared Cluster?

Per default this project only supports the deployment to the [Private Shared Cluster](https://confluence.schaeffler.com/x/bEBpCg) as this is the advised platform now.
This project can't be deployed to the [Public Shared Cluster](https://confluence.schaeffler.com/x/upS7Aw) out of the box any longer. Some minor changes are required.

Please refer to [this documentation](https://confluence.schaeffler.com/x/p2AZDg) on how to deploy this project into the Public Shared Cluster.

## How to use this template

In order to use this template, just <a href="https://github.com/Schaeffler-Group/helloworld-frontend-angular/generate"><img src="https://img.shields.io/badge/click-here-brightgreen" /></a> and follow the process described in the [official GitHub documentation about using template repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

You can find further tips and process instructions in our [Hello World E2E Journey](https://confluence.schaeffler.com/x/ESnRCw).

After setting up the new repository, please make sure to adjust the following files: (just here as a placeholder, needs to be added, once we have the corresponding feature implementation)

- codeowners
- environment files
- project and organization name

## How to stay up-to-date

As we consistently work on the template, the project setup, its automation features, tooling integration and many more, we recommend you to subscribe to the releases, so that you always get informed about the latest updates.

To do so, just select `Releases` in the `Customize Notifications` dropdown, when [configuring the watch settings](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) of this repository.

## Getting Started with Nx & Angular

### Quick Start & Documentation

- [Angular Documentation](https://angular.io/docs)
- [Nx Documentation](https://nx.dev/angular)
- [10-minute video showing all Nx features](https://nx.dev/getting-started/intro)
- [Interactive Nx Tutorial](https://nx.dev/react-tutorial/01-create-application)
- [Developer Guidelines] --> link will follow once reworked

### Installing Dependencies

Before you can actually start developing, you need to install the local project dependencies (node modules). This project relies on `pnpm` as node package manager as well as node version manager.
Run `pnpm install` to get started.

If you did not yet install `pnpm`, run `npm install pnpm -g` first. Please see the [official installation](https://pnpm.io/installation) guide as further reference.

### Generate an application

Run `ng g @nx/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generate a library

Run `ng g @nx/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@schaeffler-helloworld/mylib`.

### Development server - Run the app locally

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

TBD: add command when proxy config is set up.

### Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

### Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

### Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

### Docker Build

### Further help

If you need further help, please see our [FAQs](https://confluence.schaeffler.com/display/DP/FAQ) first or use the internal search of [our Confluence page](https://confluence.schaeffler.com/display/DP). If you don't get your question answered, please get in contact with us via our [public Microsoft Teams Channel](https://teams.microsoft.com/l/team/19%3a6dbf52ea5fee4605b1199c224db2e98a%40thread.skype/conversations?groupId=6408e686-d495-46fa-b056-c35afa1daa6b&tenantId=67416604-6509-4014-9859-45e709f53d3f).
