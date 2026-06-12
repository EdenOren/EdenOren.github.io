import { TestBed } from '@angular/core/testing';
import { Service, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BaseDataService } from './base-data.service';
import { ApiPath } from '../../enums/core.enums';
import { environment } from '../../../../environments/environment';

interface TestItem { id: string; name: string; }

@Service({ autoProvided: false })
class TestDataService extends BaseDataService<TestItem> {
  protected override readonly apiPath: ApiPath = ApiPath.Experience;
}

const BASE_URL = `${environment.apiBaseUrl}api/${ApiPath.Experience}`;

describe('BaseDataService', () => {
  let service: TestDataService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        TestDataService,
      ],
    });
    service = TestBed.inject(TestDataService);
    httpTesting = TestBed.inject(HttpTestingController);
    TestBed.flushEffects();
    httpTesting.match(BASE_URL).forEach(req => req.flush([]));
  });

  afterEach(() => httpTesting.verify());

  it('items() defaults to an empty array before data loads', () => {
    expect(service.items()).toEqual([]);
  });

  it('create() sends a POST to the base URL with the item body', () => {
    const item: TestItem = { id: '1', name: 'Alpha' };
    const emitted: TestItem[] = [];
    service.create(item).subscribe(result => emitted.push(result));
    const req = httpTesting.expectOne(BASE_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(item);
    req.flush(item);
    expect(emitted).toEqual([item]);
  });

  it('update() sends a PUT to the item-specific URL', () => {
    const item: TestItem = { id: '42', name: 'Beta' };
    const emitted: TestItem[] = [];
    service.update('42', item).subscribe(result => emitted.push(result));
    const req = httpTesting.expectOne(`${BASE_URL}/42`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(item);
    req.flush(item);
    expect(emitted).toEqual([item]);
  });

  it('delete() sends a DELETE to the item-specific URL', () => {
    let completed = false;
    service.delete('99').subscribe({ complete: () => { completed = true; } });
    const req = httpTesting.expectOne(`${BASE_URL}/99`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(completed).toBe(true);
  });
});
