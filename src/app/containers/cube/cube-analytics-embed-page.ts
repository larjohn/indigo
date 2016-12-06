import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import {Component} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as cubeActions from '../../actions/cube/cube2';
import * as fromRoot from '../../reducers';
import {
  InCollectionInput
} from '../../components/cube/analytics/cube-analytics-detail';
import {Cube} from '../../models/cube';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'cube-analytics-embed-page',
  template: `
    <indigo-cube-analytics-embed [algorithmName]="algorithmName"
      [inCollection]="isCubeInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </indigo-cube-analytics-embed>
  `
})
export class CubeAnalyticsEmbedPage {
  isCubeInCollection$: Observable<InCollectionInput>;
  cube: Cube;
  algorithmName: Observable<string> = new Observable<string>();
  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.algorithmName = route.params.select<string>('algorithm');
    route.params
      .select<string>('id')
      .map(id => new cubeActions.SelectAction(id))
      .subscribe(store);

  }



}