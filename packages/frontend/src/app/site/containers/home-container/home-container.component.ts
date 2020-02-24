import { Component, Inject, OnInit } from '@angular/core';
import { RESOURCE_SERVICES } from '@app/api/constants';
import { ResourceService } from '@app/api/services';
import { getServiceFromResource } from '@app/api/utils';
import { ResourceItem } from '@app/core/models';
import { SAMPLE_RESOURCE } from '@app/resources';
import { Sample } from '@app/resources/models';
import { Observable } from 'rxjs';

import { LoggerService } from '../../../core/services';

/**
 * Home page container.
 */
@Component({
  selector: 'app-site-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss'],
})
export class HomeContainerComponent implements OnInit {
  /**
   * Sample resource items.
   */
  readonly items$: Observable<Sample[]>;

  /**
   * Sample resource service.
   */
  private readonly sampleResourceService: ResourceService<Sample>;

  /**
   * Returns an instance of HomeContainerComponent.
   * @param resourcesService  resource services list
   * @param logger logger service
   */
  constructor(
    @Inject(RESOURCE_SERVICES) resourcesService: ResourceService<ResourceItem>[],
    private readonly logger: LoggerService,
  ) {
    this.sampleResourceService = getServiceFromResource(resourcesService, SAMPLE_RESOURCE);
    this.items$ = this.sampleResourceService.getItems();
  }

  ngOnInit() {
    this.sampleResourceService.list().then(result => this.logger.info(`Sample resource ${result.length} items loaded`));
  }
}
