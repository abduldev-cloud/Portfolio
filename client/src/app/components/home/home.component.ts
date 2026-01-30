import { Component, AfterViewInit, HostListener, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  private sectionNames = ['intro', 'about', 'projects', 'contact'];
  currentSectionIndex = 0;
  isDownloading = false;
  isFooterVisible = true;
  isMobileMenuOpen = false;
  private isInitialLoad = true;

  constructor(
    private router: Router,
    private el: ElementRef,
    private route: ActivatedRoute
  ) { }

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

        const navigationState = history.state;
        if (navigationState?.fromProjects) {
          setTimeout(() => this.scrollToSection('projects'), 200);
        }
      });
  }

  ngAfterViewInit(): void {
    const initialFragment = this.route.snapshot.fragment;
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;

    if (initialFragment && navigationState?.fromNavigation) {
      setTimeout(() => this.scrollToSection(initialFragment), 200);
    }
  }

  ngOnDestroy(): void {
  }

  public scrollToSection(section: string): void {
    const idx = this.sectionNames.indexOf(section);
    if (idx !== -1) {
      this.isMobileMenuOpen = false;
      this.currentSectionIndex = idx;

      const element = document.querySelector(`.${section}-section`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      console.warn(`Section '${section}' not found.`);
    }
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentSectionIndex = 0;
  }

  public isActiveSection(name: string): boolean {
    return this.sectionNames.indexOf(name) === this.currentSectionIndex;
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
