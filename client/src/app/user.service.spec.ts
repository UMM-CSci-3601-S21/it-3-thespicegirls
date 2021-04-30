import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check some strings with admin checker', () => {
    expect(service.checkIfAdmin('true')).toEqual(true);
  });
  it('should check some strings with login checker', () => {
    expect(service.checkIfLoggedIn('true')).toEqual(true);
  });
});
