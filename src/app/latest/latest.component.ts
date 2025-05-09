import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InfoService, ContentItem, ActuResponse } from '../info.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.css'
})
export class LatestComponent implements OnInit {
  insights: ContentItem[] = [];
  allInsights: ContentItem[] = []; // Stocke toutes les actualités
  loading = true;
  error = false;
  imageBaseUrl = 'http://peeyconnect.net/repertoire_upload/';
  
  // Pagination properties
  itemsPerPage = 4;
  currentPage = 0;
  totalPages = 0;

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
        this.totalPages = Math.ceil(this.allInsights.length / this.itemsPerPage);
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

  // Mettre à jour les insights affichés en fonction de la page courante
  updateDisplayedInsights(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    this.insights = this.allInsights.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Navigation entre les pages
  goToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.currentPage = pageIndex;
      this.updateDisplayedInsights();
    }
  }

  // Page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateDisplayedInsights();
    }
  }

  // Page précédente
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedInsights();
    }
  }

  // Helper method to construct full image URL
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/placeholder.jpg';
    return this.imageBaseUrl + imagePath;
  }

  // Navigation vers la page détails - Méthode améliorée
  navigateToDetails(id: number): void {
    if (!id || isNaN(id)) {
      console.error('ID invalide:', id);
      return;
    }
    
    console.log('Navigation vers les détails avec ID:', id);
    
    // Utilisation de NavigateByUrl pour un contrôle plus précis
    this.router.navigateByUrl(`/details/${id}`).then(success => {
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

  // Génère un tableau pour l'affichage des boutons de pagination
  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}