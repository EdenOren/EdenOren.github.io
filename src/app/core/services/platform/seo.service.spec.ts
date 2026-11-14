import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleMock: { setTitle: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    titleMock = { setTitle: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        SeoService,
        { provide: Title, useValue: titleMock },
      ],
    });
    service = TestBed.inject(SeoService);
  });

  it('names the page in the title and falls back to the site title', () => {
    service.applyPageTitle('Projects');
    expect(titleMock.setTitle).toHaveBeenLastCalledWith('Projects — Eden Oren');
    service.applyPageTitle('');
    expect(titleMock.setTitle).toHaveBeenLastCalledWith('Eden Oren — Frontend Developer');
    service.applyPageTitle('Skills');
    service.resetTitle();
    expect(titleMock.setTitle).toHaveBeenLastCalledWith('Eden Oren — Frontend Developer');
  });
});
