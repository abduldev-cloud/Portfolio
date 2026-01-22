import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProjectsSectionComponent } from './projects-section/projects-section.component';

const routes: Routes = [
  {path: '',component : HomeComponent},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: HomeComponent },
  { path: 'project', component: HomeComponent },
  { path: 'contact', component: HomeComponent },
  { path: 'projects-section', component: ProjectsSectionComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
   // Redirect unknown routes to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // restores scroll to previous position
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64]
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
