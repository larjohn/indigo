import {Component, Input} from '@angular/core';

import {AddCommasPipe} from '../../pipes/add-commas';
import {EllipsisPipe} from '../../pipes/ellipsis';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {Cube} from "../../models/cube";


export type CubeInput = Cube;

@Component({
  selector: 'cube-preview',
  pipes: [AddCommasPipe, EllipsisPipe],
  directives: [
    MD_CARD_DIRECTIVES,
    MD_LIST_DIRECTIVES
  ],
  template: `<md-card>
  <md-card-title-group>
    <md-card-title>{{ name }}</md-card-title>

  </md-card-title-group>
  <md-card-content>
    <div class="row">
      <a [linkTo]=" '/cube/builder/' + name">Indicators Builder</a>
    </div>
    <div class="row">
        <a [linkTo]=" '/cube/analytics/' + name">Analytics</a>
    </div>


  </md-card-content>
</md-card>
  `,
  styles: [`
    md-card {
      width: 600px;
      height: 300px;
      margin: 15px;
    }
    md-card-title {
      margin-right: 10px;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      width: 60px;
      min-width: 60px;
      margin-left: 5px;
    }
    md-card-content {
      margin-top: 15px;
    }
    span {
      display: inline-block;
      font-size: 13px;
    }
    md-card-footer {
      padding-bottom: 25px;
    }
  `]
})
export class CubePreviewComponent {
  @Input() cube: CubeInput;

  get id() {
    return this.cube ? this.cube.name : "";
  }

  get name() {
    return this.cube ? this.cube.name : "";
  }


}