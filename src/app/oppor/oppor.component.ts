// 2. COMPOSANT TS MODIFIÉ
import { Component, OnInit } from '@angular/core';
import { OpportuniteService, OpportuniteResponse, OpportuniteItem } from './../opportinute.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-oppor',
  standalone: true, // ← important
  imports: [CommonModule, SidebarComponent], // ← nécessaire pour *ngIf, *ngFor
  templateUrl: './oppor.component.html',
  styleUrls: ['./oppor.component.css']
})
export class OpporComponent implements OnInit {
  opporList: OpportuniteItem[] = [];
  currentPage = 0;
  pageSize = 4;
  totalPages = 0;
  totalItems = 0;
  loading = true;
  error = false;
  processingId: number | null = null; // Pour suivre quelle opportunité est en cours de traitement

  // URL de base pour les images provenant du backend
  imageBaseUrl = 'https://peeyconnect.net/repertoire_upload/';

  constructor(
    private opportuniteService: OpportuniteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOpportunites(this.currentPage);
  }

  loadOpportunites(page: number): void {
    this.loading = true;
    this.opportuniteService.getOpportunites(page, this.pageSize).subscribe({
      next: (response: OpportuniteResponse) => {
        console.log('Réponse API', response);
        this.opporList = response.content.map(oppor => ({
          ...oppor,
          img: oppor.img ? `${this.imageBaseUrl}${oppor.img}` : 'assets/images/placeholder.jpg',
          auteurimg: oppor.auteurimg ? `${this.imageBaseUrl}${oppor.auteurimg}` : 'assets/images/user-placeholder.jpg'
        }));
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements;
        this.currentPage = response.number;
        this.loading = false;
      },
      
      error: (err) => {
        console.error('Erreur lors du chargement des opportunités', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Nouvelle méthode pour valider/invalider une opportunité
  toggleValidation(event: Event, oppor: OpportuniteItem): void {
    // Empêcher la propagation pour ne pas déclencher la navigation vers le détail
    event.stopPropagation();
    
    // Marquer cette opportunité comme en cours de traitement
    this.processingId = oppor.id;
    
    // Envoyer une requête avec le statut inverse
    const newStatus = !oppor.isvalid;
    
    this.opportuniteService.toggleValidation(oppor.id, newStatus).subscribe({
      next: (updatedOppor) => {
        console.log('Opportunité mise à jour:', updatedOppor);
        
        // Mettre à jour l'opportunité dans la liste locale
        const index = this.opporList.findIndex(o => o.id === oppor.id);
        if (index !== -1) {
          this.opporList[index].isvalid = updatedOppor.isvalid;
        }
        
        // Réinitialiser l'ID en cours de traitement
        this.processingId = null;
      },
      error: (err) => {
        console.error('Erreur lors de la validation/invalidation:', err);
        // Réinitialiser l'ID en cours de traitement
        this.processingId = null;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOpportunites(page);
      window.scrollTo(0, 0);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToOpporDetail(id: number): void {
    this.router.navigate(['/opportunites', id]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}