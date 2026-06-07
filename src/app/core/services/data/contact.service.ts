import { Service, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const FORMSPREE_URL = 'https://formspree.io/f/xyzkybnl';

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

@Service()
export class ContactService {
  private readonly http = inject(HttpClient);

  async send(payload: ContactPayload): Promise<void> {
    await firstValueFrom(
      this.http.post(FORMSPREE_URL, payload, {
        headers: new HttpHeaders({ 'Accept': 'application/json' }),
      })
    );
  }
}
