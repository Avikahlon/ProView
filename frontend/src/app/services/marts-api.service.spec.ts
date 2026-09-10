import { TestBed } from '@angular/core/testing';

import { MartsApiService } from './marts-api.service';

describe('MartsApiService', () => {
  let service: MartsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MartsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
