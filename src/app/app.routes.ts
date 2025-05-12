import { Routes } from '@angular/router';
import { LatestComponent } from './latest/latest.component';
import { DetailsComponent } from './details/details.component';
import { OpportunitesComponent } from './opportunites/opportunites.component';
import { OpportuniteDetailsComponent } from './opportunite-details/opportunite-details.component';
import { AccueilComponent } from './accueil/accueil.component';

export const routes: Routes = [
  { 
    path: '', 
    component: AccueilComponent,
    title: 'Accueil'
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
    path: 'opportunites', 
    component: OpportunitesComponent,
    title: 'Opportunités' 
  },
  { 
    path: 'opportunite-details/:id', 
    component: OpportuniteDetailsComponent,
    title: 'Détails opportunité',
    data: {
      reuseComponent: false // Force le rechargement du composant
    }
  },
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full' 
  }
];