import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  showProjects: boolean = false;
  
  // Menu items avec leurs routes et icônes
  menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: 'home.png' },
    { path: '/dashboard/humanresources', label: 'Ressources Humaines', icon: 'humain.png' },
    { path: '/dashboard/financial', label: 'Sous-traitants', icon: 'humain.png' },
    { path: '/dashboard/forunisseur', label: 'Fournisseurs', icon: 'humain.png' },
    { path: '/utilisateurs', label: 'Utilisateurs', icon: 'users.png' },
    { path: '/parametres', label: 'Paramètres', icon: 'solar_settings.png' }
  ];
  router: any;
  
  // Fonction pour basculer l'affichage des projets
  toggleProjects(): void {
    this.showProjects = !this.showProjects;
  }

  // Méthode pour vérifier si un lien est actif
  isActive(path: string): boolean {
    return window.location.pathname.includes(path);
  }
  
  // Méthode pour la déconnexion
  logout(): void {
    // Ici vous pouvez implémenter la logique de déconnexion
    console.log('Déconnexion...');
    // Rediriger vers la page de login après déconnexion
    this.router.navigate(['/login']);
  }
  onclick():void {
    this.router.navigate(['/parametres']);
  }
}