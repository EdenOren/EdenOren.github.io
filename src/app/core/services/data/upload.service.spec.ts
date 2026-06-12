import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UploadService } from './upload.service';
import { ApiUploadResponse } from '../../../shared/models/api.models';
import { environment } from '../../../../environments/environment';

const UPLOAD_URL = `${environment.apiBaseUrl}api/upload`;

class SyncFileReader {
  result: string = 'data:image/jpeg;base64,aGVsbG8=';
  onload: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  readAsDataURL(_file: Blob): void {
    this.onload?.();
  }
}

describe('UploadService', () => {
  let service: UploadService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    vi.stubGlobal('FileReader', SyncFileReader);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        UploadService,
      ],
    });
    service = TestBed.inject(UploadService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    vi.unstubAllGlobals();
  });

  it('upload() sends filename, mimeType, and base64 data to the upload endpoint', () => {
    const file = new File(['hello'], 'photo.jpg', { type: 'image/jpeg' });
    const emitted: ApiUploadResponse[] = [];

    service.upload(file).subscribe(result => emitted.push(result));

    const req = httpTesting.expectOne(UPLOAD_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      filename: 'photo.jpg',
      mimeType: 'image/jpeg',
      dataBase64: 'aGVsbG8=',
    });
    req.flush({ url: 'https://cdn.example.com/photo.jpg' });
    expect(emitted).toEqual([{ url: 'https://cdn.example.com/photo.jpg' }]);
  });

  it('upload() emits an error when the file cannot be read', () => {
    class ErrorFileReader {
      onerror: ((e: unknown) => void) | null = null;
      onload: (() => void) | null = null;
      error: DOMException = new DOMException('read error');
      readAsDataURL(_file: Blob): void {
        this.onerror?.(this.error);
      }
    }
    vi.stubGlobal('FileReader', ErrorFileReader);

    const file = new File([''], 'broken.jpg', { type: 'image/jpeg' });
    let caughtError: unknown;
    service.upload(file).subscribe({ error: err => { caughtError = err; } });
    expect(caughtError).toBeInstanceOf(DOMException);
  });
});
