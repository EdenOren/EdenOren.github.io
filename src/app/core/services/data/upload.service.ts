import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiUploadResponse } from '../../../shared/models/api.models';

@Service()
export class UploadService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  upload(file: File): Observable<ApiUploadResponse> {
    return new Observable(observer => {
      const reader: FileReader = new FileReader();
      reader.onload = (): void => {
        const dataUrl: string = reader.result as string;
        const commaIndex: number = dataUrl.indexOf(',');
        const mimeType: string = dataUrl.slice(5, commaIndex).replace(';base64', '');
        const dataBase64: string = dataUrl.slice(commaIndex + 1);
        this.httpClient
          .post<ApiUploadResponse>(`${environment.apiBaseUrl}api/upload`, {
            filename: file.name,
            mimeType,
            dataBase64,
          })
          .subscribe(observer);
      };
      reader.onerror = (): void => observer.error(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
