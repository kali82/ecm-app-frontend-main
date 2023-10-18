import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getProfileImage, getUsername } from '@schaeffler/azure-auth';
@Component({
  selector: 'ecm-app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'ECM App';

  public username$!: Observable<string>;
  public profileImage$!: Observable<string>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
  }
}
