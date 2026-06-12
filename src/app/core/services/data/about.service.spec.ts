import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AboutService } from './about.service';
import { environment } from '../../../../environments/environment';

const ABOUT_URL = `${environment.apiBaseUrl}api/about`;
const ADMIN_ABOUT_URL = `${environment.apiBaseUrl}api/admin/about`;

describe('AboutService', () => {
  let service: AboutService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AboutService,
      ],
    });
    service = TestBed.inject(AboutService);
    httpTesting = TestBed.inject(HttpTestingController);
    TestBed.flushEffects();
  });

  afterEach(() => {
    httpTesting.match(ABOUT_URL).forEach(req => req.flush(null));
    httpTesting.verify();
  });

  it('data() is undefined while the resource is loading', () => {
    expect(service.data()).toBeUndefined();
  });

  it('update() sends a PUT to the admin about endpoint with the payload', () => {
    httpTesting.match(ABOUT_URL).forEach(req => req.flush(null));
    const payload = { bio_text: 'Updated bio' };
    const emitted: unknown[] = [];
    service.update(payload).subscribe(result => emitted.push(result));
    const req = httpTesting.expectOne(ADMIN_ABOUT_URL);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ ok: true });
    expect(emitted).toEqual([{ ok: true }]);
  });
});
