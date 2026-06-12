import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/platform/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let getValidToken: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getValidToken = vi.fn().mockReturnValue(null);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getValidToken } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('attaches an Authorization header when a valid token is available', () => {
    getValidToken.mockReturnValue('my-token');
    http.get('/api/data').subscribe();
    const req = httpTesting.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush({});
  });

  it('passes the request through without an Authorization header when no token is available', () => {
    getValidToken.mockReturnValue(null);
    http.get('/api/data').subscribe();
    const req = httpTesting.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('does not mutate the original request when adding the header', () => {
    getValidToken.mockReturnValue('token-123');
    http.get('/api/data').subscribe();
    const req = httpTesting.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush({});
  });
});
