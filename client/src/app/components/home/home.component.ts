import { Component, AfterViewInit, HostListener, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import * as AOS from 'aos';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('statsSection') statsSection!: ElementRef;

  private sectionNames = ['intro', 'about', 'experience', 'projects', 'contact'];
  currentSectionIndex = 0;
  isDownloading = false;
  isFooterVisible = true;
  isMobileMenuOpen = false;
  private isInitialLoad = true;
  isDarkMode = false;

  // Contact form
  contactForm = {
    name: '',
    email: '',
    message: ''
  };
  isSubmitting = false;
  submitMessage = '';

  // Typing animation text
  typedText = '';
  fullText = 'Software Developer | Building clean, fast web experiences.';
  typingSpeed = 50;

  // Stats counter
  stats = [
    { icon: '🚀', label: 'Projects Completed', target: 5, current: 0, suffix: '+' },
    { icon: '💻', label: 'Technologies', target: 8, current: 0, suffix: '+' },
    { icon: '📅', label: 'Years Experience', target: 2, current: 0, suffix: '+' },
    { icon: '☕', label: 'Cups of Coffee', target: 500, current: 0, suffix: '+' }
  ];
  private statsAnimated = false;

  // Experience data
  experiences = [
    {
      role: 'Web Developer Intern',
      company: 'DSRT',
      type: 'Full-time',
      period: 'March 2025 – December 2025',
      description: 'Building scalable web applications with Angular and Node.js. Leading frontend architecture decisions and implementing responsive design systems.',
      tags: ['Angular', 'Node.js', 'React', 'TypeScript', 'REST APIs'],
      icon: '💼'
    },
    {
      role: 'Java Developer Intern',
      company: 'Iconic Software Solution',
      type: 'Internship',
      period: 'Jun 2023 – Dec 2023',
      description: 'Developed interactive UI components and integrated third-party APIs. Improved page load performance by 40% through code splitting and lazy loading.',
      tags: ['Java', 'Applets', 'Git'],
      icon: '🚀'
    },
    {
      role: 'Master of Computer Applications',
      company: 'Francis Xavier Engineering College',
      type: 'Education',
      period: '2024 – 2026',
      description: 'Currently pursuing Master of Computer Applications with a strong foundation in software engineering, data structures, and full-stack web development.',
      tags: ['Java', 'Python', 'Data Structures', 'DBMS'],
      icon: '🎯'
    },
    {
      role: 'Bachelor of Computer Science',
      company: 'Sadakathullah Appa College',
      type: 'Education',
      period: '2021 – 2024',
      description: 'Graduated with distinction. Focused on software engineering, data structures, and full-stack web development. Active member of the coding club.',
      tags: ['Java', 'Python', 'Data Structures', 'DBMS'],
      icon: '🎓'
    }
  ];


  constructor(
    private router: Router,
    private el: ElementRef,
    private route: ActivatedRoute,
    public themeService: ThemeService
  ) { }


  ngOnInit(): void {
    // Initialize AOS animations
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    // Subscribe to theme changes
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Start typing animation
    this.typeText();

    // Listen for navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Skip the first time component loads
        if (this.isInitialLoad) {
          this.isInitialLoad = false;
          return;
        }

        // Handle fragment navigation on both / and /home
        if (this.router.url.startsWith('/home') || this.router.url === '/' || this.router.url.startsWith('/#')) {
          const fragment = this.route.snapshot.fragment;
          if (fragment) {
            setTimeout(() => this.scrollToSection(fragment), 100);
          }
        }

        const navigationState = history.state;
        if (navigationState?.fromProjects || navigationState?.fromNavigation) {
          const fragment = this.route.snapshot.fragment;
          setTimeout(() => this.scrollToSection(fragment || 'projects'), 200);
        }
      });
  }

  ngAfterViewInit(): void {
    const initialFragment = this.route.snapshot.fragment;
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;

    if (initialFragment && navigationState?.fromNavigation) {
      setTimeout(() => this.scrollToSection(initialFragment), 200);
    }

    // Setup stats counter observer
    this.setupStatsObserver();
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

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    const sections = this.sectionNames.map(name =>
      document.querySelector(`.${name}-section`) as HTMLElement
    ).filter(el => el !== null);

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i] && sections[i].offsetTop <= scrollPos) {
        this.currentSectionIndex = i;
        break;
      }
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

  // Theme Toggle
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Typing Animation
  private typeText(): void {
    let index = 0;
    const type = () => {
      if (index < this.fullText.length) {
        this.typedText += this.fullText.charAt(index);
        index++;
        setTimeout(type, this.typingSpeed);
      }
    };
    setTimeout(type, 500); // Delay before starting
  }

  // Skills data for visualization
  skills = [
    { name: 'React', level: 80 },
    { name: 'Node.js / Express', level: 80 },
    { name: 'Angular / TypeScript', level: 80 },
    { name: 'C', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'Java', level: 70 },
    { name: 'MySQL / REST APIs', level: 85 },
    { name: 'Git', level: 85 },
    { name: 'Responsive Architecture', level: 88 }
  ];

  // Send Email via EmailJS (Frontend Only)
  async sendEmail(event: Event): Promise<void> {
    event.preventDefault();

    if (this.isSubmitting) return;

    // Basic validation
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.submitMessage = '⚠️ Please fill in all fields';
      setTimeout(() => this.submitMessage = '', 3000);
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '📤 Sending...';

    const templateParams = {
      from_name: this.contactForm.name,
      from_email: this.contactForm.email,
      message: this.contactForm.message,
      to_name: 'Abdul Hameed', // Change to your name
    };

    try {
      // Replace these with your actual IDs from EmailJS dashboard
      const serviceID = 'service_4yvxalj';
      const templateID = 'template_ay2ychg';
      const publicKey = 'zQ2hBADbqRst5wn6T';

      // Initialize with public key for this request 
      // (or do it in ngOnInit if preferred, but here is fine for simplicity)
      // We use 'any' cast to avoid TypeScript errors if types aren't perfect
      const emailjs = (window as any).emailjs;

      if (!emailjs) {
        throw new Error('EmailJS SDK not loaded. Please ensure internet connection.');
      }

      await emailjs.init(publicKey);

      const response = await emailjs.send(serviceID, templateID, templateParams);

      if (response.status === 200) {
        console.log('Email sent successfully', response);
        this.submitMessage = '✅ Message sent successfully!';
        this.contactForm = { name: '', email: '', message: '' };
        setTimeout(() => this.submitMessage = '', 5000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error('Email send failed:', error);
      this.submitMessage = '❌ Failed to send. Please try again or email directly at ah303130@gmail.com';
      setTimeout(() => this.submitMessage = '', 5000);
    } finally {
      this.isSubmitting = false;
    }
  }

  // ===== STATS COUNTER ANIMATION =====
  private setupStatsObserver(): void {
    if (!this.statsSection?.nativeElement) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(this.statsSection.nativeElement);
  }

  private animateCounters(): void {
    this.stats.forEach(stat => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          stat.current = stat.target;
          clearInterval(interval);
        } else {
          stat.current = Math.floor(current);
        }
      }, duration / steps);
    });
  }
}
