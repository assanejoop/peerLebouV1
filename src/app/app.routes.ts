import { Routes } from '@angular/router';
import { LatestComponent } from './latest/latest.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'actualites', 
    pathMatch: 'full' 
  },
  { 
    path: 'actualites', 
    component: LatestComponent,
    title: 'Actualités' 
  },
  { 
    path: 'details/:id', 
    component: DetailsComponent,
    title: 'Détails actualité',
    data: {
      reuseComponent: false // Force le rechargement du composant
    }
  },
  { 
    path: '**', 
    redirectTo: 'actualites',
    pathMatch: 'full' 
  }
];