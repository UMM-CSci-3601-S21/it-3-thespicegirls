import { TestBed } from '@angular/core/testing';

import { PackFormService } from './pack-form.service';

describe('PackFormService', () => {
  let service: PackFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
