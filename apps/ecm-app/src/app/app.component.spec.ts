import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PushModule, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { AppShellModule } from '@schaeffler/app-shell';
import { getProfileImage, getUsername } from '@schaeffler/azure-auth';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      AppShellModule,
      RouterTestingModule,
      NoopAnimationsModule,
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        selectors: [
          { selector: getUsername, value: 'SchaefflerUser123' },
          { selector: getProfileImage, value: 'someImageUrl' },
        ],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'helloworld'`, () => {
    expect(component.title).toEqual('Hello World');
  });

  it('should render title', () => {
    expect(spectator.query('mat-toolbar')).toHaveText('Hello World');
  });
});
