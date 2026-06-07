import { Service } from '@angular/core';

const FORMSPREE_URL = 'https://formspree.io/f/xyzkybnl';

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

@Service()
export class ContactService {
  async send(payload: ContactPayload): Promise<void> {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Formspree request failed');
    }
  }
}
