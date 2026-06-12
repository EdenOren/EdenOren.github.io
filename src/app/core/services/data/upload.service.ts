import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class UploadService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  upload(file: File): Observable<{ url: string }> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const commaIndex = dataUrl.indexOf(',');
        const mimeType = dataUrl.slice(5, commaIndex).replace(';base64', '');
        const dataBase64 = dataUrl.slice(commaIndex + 1);
        this.httpClient
          .post<{ url: string }>(`${environment.apiBaseUrl}api/upload`, {
            filename: file.name,
            mimeType,
            dataBase64,
          })
          .subscribe(observer);
      };
      reader.onerror = () => observer.error(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
