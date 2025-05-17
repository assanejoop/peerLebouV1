import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { InfoService, ContentItem, ActuResponse } from '../info.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.css'
})
export class LatestComponent implements OnInit {
  insights: ContentItem[] = [];      // Actualités actuellement affichées
  allInsights: ContentItem[] = [];   // Toutes les actualités
  loading = true;
  error = false;
  imageBaseUrl = 'http://peeyconnect.net/repertoire_upload/';
  
  // Paramètres pour affichage limité
  initialDisplayCount = 3;  // Nombre initial de cartes à afficher
  showAllInsights = false;  // État pour afficher toutes les actualités ou non
  
  constructor(
    private infoService: InfoService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.fetchLatestInsights();
  }
  
  fetchLatestInsights(): void {
    this.loading = true;
    this.infoService.getActus(0, 12).subscribe({
      next: (response: ActuResponse) => {
        this.allInsights = response.content;
        this.updateDisplayedInsights();
        this.loading = false;
        console.log('Actualités chargées:', this.allInsights);
      },
      error: (err) => {
        console.error('Error fetching insights:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  // Mettre à jour les insights affichés
  updateDisplayedInsights(): void {
    if (this.showAllInsights) {
      // Afficher toutes les actualités
      this.insights = [...this.allInsights];
    } else {
      // Afficher seulement les 3 premières actualités
      this.insights = this.allInsights.slice(0, this.initialDisplayCount);
    }
  }
  
  // Fonction pour afficher toutes les actualités
  showAllContent(): void {
    this.showAllInsights = true;
    this.updateDisplayedInsights();
  }
  
  // Fonction pour réduire à l'affichage initial
  showLessContent(): void {
    this.showAllInsights = false;
    this.updateDisplayedInsights();
  }
  
  // Helper method to construct full image URL
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/placeholder.jpg';
    return this.imageBaseUrl + imagePath;
  }
  
  // Navigation vers la page détails - CORRIGÉE
  navigateToDetails(id: number): void {
    if (!id || isNaN(id)) {
      console.error('ID invalide:', id);
      return;
    }
    
    console.log('Navigation vers les détails avec ID:', id);
    
    // Utilisation correcte du router navigate
    this.router.navigate(['/details', id]).then(success => {
      if (!success) {
        console.error('La navigation a échoué');
      }
    }).catch(err => {
      console.error('Erreur lors de la navigation:', err);
    });
  }
  
  // Helper function to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  }
}