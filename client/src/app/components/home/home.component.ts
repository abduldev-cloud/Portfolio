import {  Component,AfterViewInit,HostListener,OnDestroy,OnInit,ElementRef} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  private isAnimating = false;
  currentSectionIndex = 0;
  private sectionNames = ['intro', 'about', 'projects', 'contact'];
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly SCROLL_DURATION = 1000;
  private readonly SCROLL_THRESHOLD = 50;
  isDownloading = false;
  isFooterVisible = false;
  private sections: HTMLElement[] = [];
  private isInitialLoad = true;  
  private wheelHandler: (event: WheelEvent) => void; //  Hold the wheel handler reference so we can remove it correctly

  constructor(
    private router: Router,
    private el: ElementRef,
    private route: ActivatedRoute
  ) {
    // Bind once and store it to allow removal laterA?
    this.wheelHandler = this.handleScroll.bind(this);
  }

  ngOnInit(): void {
    // Listen for navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Skip the first time component loads
        if (this.isInitialLoad) {
          this.isInitialLoad = false;
          return;
        }

        // Handle fragment navigation only when on /home
        if (this.router.url.startsWith('/home')) {
          const fragment = this.route.snapshot.fragment;
          if (fragment) {
            setTimeout(() => this.scrollToSection(fragment), 100);
          }
        }

        // ADD THIS BLOCK
        const navigationState = history.state;
        if (navigationState?.fromProjects) {
          setTimeout(() => this.scrollToSection('projects'), 200);
        }
      });
  }

  ngAfterViewInit(): void {
    // Grab section references
    this.sections = [
      this.el.nativeElement.querySelector('.intro-section'),
      this.el.nativeElement.querySelector('.about-section'),
      this.el.nativeElement.querySelector('.projects-section'),
      this.el.nativeElement.querySelector('.contact-section')
    ];

    const initialFragment = this.route.snapshot.fragment;
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;

    if (initialFragment && navigationState?.fromNavigation) {
      setTimeout(() => this.scrollToSection(initialFragment), 200);
      
    } else {
      this.changeSection(0);
    }

    //  Attach scroll listener only if current route is /home
    if (this.router.url.startsWith('/home')) {
      window.addEventListener('wheel', this.wheelHandler, { passive: false });
    }
  }

  ngOnDestroy(): void {
    //  Proper cleanup — removes the same listener reference
    window.removeEventListener('wheel', this.wheelHandler);

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  //  Handle wheel scroll
  public handleScroll(event: WheelEvent): void {
    if (this.isAnimating) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const delta = event.deltaY;

    if (delta > this.SCROLL_THRESHOLD && this.currentSectionIndex < this.sectionNames.length - 1) {
      this.changeSection(this.currentSectionIndex + 1);
    } else if (delta < -this.SCROLL_THRESHOLD && this.currentSectionIndex > 0) {
      this.changeSection(this.currentSectionIndex - 1);
    }
  }

  //  Handle keyboard-based navigation
  @HostListener('window:keydown', ['$event'])
  public handleKeyboard(event: KeyboardEvent): void {
    if (this.isAnimating) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault();
        if (this.currentSectionIndex < this.sectionNames.length - 1) {
          this.changeSection(this.currentSectionIndex + 1);
        }
        break;

      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        if (this.currentSectionIndex > 0) {
          this.changeSection(this.currentSectionIndex - 1);
        }
        break;

      case 'Home':
        event.preventDefault();
        this.scrollToTop();
        break;

      case 'End':
        event.preventDefault();
        this.scrollToSection('contact');
        break;
    }
  }

  //  Core section switching logic
  private changeSection(index: number): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.currentSectionIndex = index;

    this.updateFooterVisibility();
    this.showCurrentSection();

    this.scrollTimeout = setTimeout(() => {
      this.isAnimating = false;
      this.scrollTimeout = null;
    }, this.SCROLL_DURATION);
  }

  private updateFooterVisibility(): void {
    this.isFooterVisible = this.currentSectionIndex === 3;
  }

  private showCurrentSection(): void {
    this.onSectionChange(this.sectionNames[this.currentSectionIndex]);
  }

  private onSectionChange(sectionName: string): void {
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', sectionName ? sectionName : '');
    }
  }

  public scrollToSection(section: string): void {
    const idx = this.sectionNames.indexOf(section);
    if (idx !== -1) {
      // Force section change even during animation
      this.isAnimating = false;
      this.changeSection(idx);
    } else {
      console.warn(`Section '${section}' not found.`);
    }
  }

  public scrollToTop(): void {
    this.scrollToSection('intro');
  }

  public isActiveSection(name: string): boolean {
    return this.sectionNames.indexOf(name) === this.currentSectionIndex;
  }

  public getCurrentSectionName(): string {
    return this.sectionNames[this.currentSectionIndex];
  }

  public getTotalSections(): number {
    return this.sectionNames.length;
  }

  public isScrollingEnabled(): boolean {
    return !this.isAnimating;
  }

  public nextSection(): void {
    if (this.currentSectionIndex < this.sectionNames.length - 1 && !this.isAnimating) {
      this.changeSection(this.currentSectionIndex + 1);
    }
  }

  public previousSection(): void {
    if (this.currentSectionIndex > 0 && !this.isAnimating) {
      this.changeSection(this.currentSectionIndex - 1);
    }
  }

  //  Resume Download Logic
  public downloadResume(): void {
    if (this.isDownloading) return;

    this.isDownloading = true;

    try {
      const link = document.createElement('a');
      link.href = 'assets/ABDUL-HAMEED-S-M.pdf';
      link.download = 'Abdul_Hameed_Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showDownloadToast('Resume downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      this.showDownloadToast('Download failed. Please try again.');
    } finally {
      this.isDownloading = false;
    }
  }

  private showDownloadToast(message: string): void {
    alert(message);
  }

  //  Go to Projects Page
  goToProjectsPage(projectId?: string): void {
    if (projectId) {
      this.router.navigate(['/projects-section'], {
        queryParams: { project: projectId }
      });
    }
  }
}
