import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactService } from './contact.service';
import { FORMSPREE_URL } from '../../constants/core.constants';

describe('ContactService', () => {
  let service: ContactService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        ContactService,
      ],
    });
    service = TestBed.inject(ContactService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('send() posts to the Formspree URL', async () => {
    const payload = { name: 'Eden', email: 'eden@example.com', message: 'Hello!' };
    const promise = service.send(payload);
    const req = httpTesting.expectOne(FORMSPREE_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ok: true });
    await promise;
  });

  it('send() includes Accept: application/json header', async () => {
    const payload = { name: 'Eden', email: 'eden@example.com', message: 'Test message' };
    const promise = service.send(payload);
    const req = httpTesting.expectOne(FORMSPREE_URL);
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({ ok: true });
    await promise;
  });

  it('send() rejects when the server returns an error', async () => {
    const payload = { name: 'Eden', email: 'eden@example.com', message: 'Fail' };
    const promise = service.send(payload);
    const req = httpTesting.expectOne(FORMSPREE_URL);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    await expect(promise).rejects.toBeDefined();
  });
});
