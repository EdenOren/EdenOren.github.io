import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let metaMock: { addTags: ReturnType<typeof vi.fn> };
  let titleMock: { setTitle: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    metaMock = { addTags: vi.fn() };
    titleMock = { setTitle: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        SeoService,
        { provide: Meta, useValue: metaMock },
        { provide: Title, useValue: titleMock },
      ],
    });
    service = TestBed.inject(SeoService);
  });

  afterEach(() => {
    document.head.querySelector('link[rel="canonical"]')?.remove();
  });

  it('sets the document title', () => {
    service.apply();
    expect(titleMock.setTitle).toHaveBeenCalledWith('Eden Oren — Frontend Developer');
  });

  it('adds meta tags including og:title and twitter:card', () => {
    service.apply();
    expect(metaMock.addTags).toHaveBeenCalledTimes(1);
    const tags = metaMock.addTags.mock.calls[0][0] as Array<{ property?: string; name?: string; content: string }>;
    const ogTitle = tags.find(t => t.property === 'og:title');
    const twitterCard = tags.find(t => t.name === 'twitter:card');
    expect(ogTitle?.content).toBe('Eden Oren — Frontend Developer');
    expect(twitterCard?.content).toBe('summary_large_image');
  });

  it('appends a canonical link element pointing to the site URL', () => {
    service.apply();
    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute('href')).toContain('edenoren');
  });
});
