
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-projects-section',
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.scss']
})
export class ProjectsSectionComponent implements OnInit {
  selectedProject: string = '';
  showAllProjects: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    // Check if a specific project was requested via URL
    this.route.queryParams.subscribe(params => {
      if (params['project']) {
        this.showProjectDetail(params['project']);
      } else {
        this.showAllProjects = true;
        this.selectedProject = '';
      }
    });
  }

  ngAfterViewInit() {
  this.route.fragment.subscribe(fragment => {
    if (fragment) {
      setTimeout(() => {
        this.scroller.scrollToAnchor(fragment);
      }, 100); // delay ensures DOM is ready
    }
  });
}

  // Show specific project detail view
  showProjectDetail(projectId: string): void {
    this.selectedProject = projectId;
    this.showAllProjects = false;
  }

  // Go back to all projects view
showAllProjectsView(): void {
  // this.showAllProjects = true;
  // this.selectedProject = '';

  // Navigate back to home with projects fragment
  this.router.navigate(['/'], {
    fragment: 'projects',
    state: { fromNavigation: true } 
  });

  // this.location.back();

//   this.router.navigate(['/home'], {
//   state: { fromProjects: true }
// });
}


  // Navigate to specific project from within projects page
  viewProject(projectId: string, event: Event): void {
    event.preventDefault();
    this.showProjectDetail(projectId);
    
    // Update URL without navigation
    this.router.navigate([], {
      queryParams: { project: projectId },
      replaceUrl: true
    });
  }
}