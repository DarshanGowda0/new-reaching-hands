import { TestBed, inject } from '@angular/core/testing';

import { MessagingServiceService } from './messaging-service.service';

describe('MessagingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagingServiceService]
    });
  });

  it('should be created', inject([MessagingServiceService], (service: MessagingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
