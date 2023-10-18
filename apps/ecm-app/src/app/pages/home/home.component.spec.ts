import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { SubheaderModule } from '@schaeffler/subheader';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { HomeComponent } from './home.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('OverviewComponent', () => {
  let spectator: Spectator<HomeComponent>;
  let component: HomeComponent;
  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [
      MatIconModule,
      SubheaderModule,
      provideTranslocoTestingModule({ langs: {} }),
      RouterTestingModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
