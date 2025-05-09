// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { OpportuniteService, OpportuniteItem, OpportuniteResponse } from '../opportunite.service';
// import { HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-opportunites',
//   standalone: true,
//   // imports: [CommonModule, OpportunitesComponent],
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './opportunites.component.html',
//   styleUrl: './opportunites.component.css'
// })
// export class OpportunitesComponent implements OnInit {
//   // Données des opportunités
//   opportunities: OpportuniteItem[] = [];
//   allOpportunities: OpportuniteItem[] = [];
  
//   // État du chargement
//   loading = true;
//   error = false;
  
//   // Pagination
//   currentPage = 0;
//   pageSize = 12;
//   totalPages = 0;
//   totalElements = 0;
  
//   // URL de base pour les images
//   imageBaseUrl = 'http://peeyconnect.net/repertoire_upload/';

//   constructor(
//     private opportuniteService: OpportuniteService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadOpportunites();
//   }

//   loadOpportunites(): void {
//     this.loading = true;
//     this.error = false;
    
//     this.opportuniteService.getOpportunites(this.currentPage, this.pageSize)
//       .subscribe({
//         next: (response: OpportuniteResponse) => {
//           this.opportunities = response.content;
//           this.totalPages = response.totalPages;
//           this.totalElements = response.totalElements;
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error('Erreur lors du chargement des opportunités:', err);
//           this.error = true;
//           this.loading = false;
//         }
//       });
//   }

//   getFullImageUrl(imagePath: string): string {
//     if (!imagePath) return 'assets/images/placeholder.jpg';
//     return this.imageBaseUrl + imagePath;
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return 'Date non disponible';
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric'
//       });
//     } catch (e) {
//       console.error('Format de date invalide:', dateString);
//       return 'Date invalide';
//     }
//   }

//   navigateToDetails(id: number): void {
//     if (id) {
//       this.router.navigateByUrl(`/opportunites-details/${id}`);
//     } else {
//       console.error('ID d\'opportunité invalide');
//     }
//   }

//   // Navigation de pagination
//   prevPage(): void {
//     if (this.currentPage > 0) {
//       this.currentPage--;
//       this.loadOpportunites();
//     }
//   }

//   nextPage(): void {
//     if (this.currentPage < this.totalPages - 1) {
//       this.currentPage++;
//       this.loadOpportunites();
//     }
//   }

//   goToPage(pageNumber: number): void {
//     if (pageNumber >= 0 && pageNumber < this.totalPages) {
//       this.currentPage = pageNumber;
//       this.loadOpportunites();
//     }
//   }

//   getPagesArray(): number[] {
//     return Array(this.totalPages).fill(0).map((_, i) => i);
//   }
// }