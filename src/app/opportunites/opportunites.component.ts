import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OpportuniteService, OpportuniteItem, OpportuniteResponse } from '../opportinute.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-opportunites',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './opportunites.component.html',
  styleUrl: './opportunites.component.css'
})
export class OpportunitesComponent implements OnInit {
  opportunites: OpportuniteItem[] = [];
  allOpportunites: OpportuniteItem[] = []; // Stocke toutes les opportunités
  loading = true;
  error = false;
  imageBaseUrl = 'http://peeyconnect.net/repertoire_upload/';
  
  // Pagination properties
  itemsPerPage = 4;
  currentPage = 0;
  totalPages = 0;

  constructor(
    private opportuniteService: OpportuniteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchOpportunites();
  }

  fetchOpportunites(): void {
    this.loading = true;
    this.opportuniteService.getOpportunites(0, 12).subscribe({
      next: (response: OpportuniteResponse) => {
        this.allOpportunites = response.content;
        this.totalPages = Math.ceil(this.allOpportunites.length / this.itemsPerPage);
        this.updateDisplayedOpportunites();
        this.loading = false;
        console.log('Opportunités chargées:', this.allOpportunites);
      },
      error: (err) => {
        console.error('Error fetching opportunites:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Mettre à jour les opportunités affichées en fonction de la page courante
  updateDisplayedOpportunites(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    this.opportunites = this.allOpportunites.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Navigation entre les pages
  goToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.currentPage = pageIndex;
      this.updateDisplayedOpportunites();
    }
  }

  // Page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateDisplayedOpportunites();
    }
  }

  // Page précédente
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedOpportunites();
    }
  }

  // Helper method to construct full image URL
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/placeholder.jpg';
    return this.imageBaseUrl + imagePath;
  }

  // Navigation vers la page détails
  navigateToDetails(id: number): void {
    if (!id || isNaN(id)) {
      console.error('ID invalide:', id);
      return;
    }
    
    console.log('Navigation vers les détails avec ID:', id);
    
    this.router.navigateByUrl(`/opportunite-details/${id}`).then(success => {
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