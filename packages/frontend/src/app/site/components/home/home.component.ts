import { Component, Input, OnInit } from '@angular/core';
import { Sample } from '@app/resources/models';

/**
 * Home component.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @Input()
  samples: Sample[];
}
