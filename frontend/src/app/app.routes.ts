import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TeamPageComponent } from './components/team-page/team-page.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'team/:team', component: TeamPageComponent }

];