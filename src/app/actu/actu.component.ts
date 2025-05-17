import { Component, OnInit } from '@angular/core';
import { InfoService, ActuResponse, ContentItem } from './../info.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-actu',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './actu.component.html',
  styleUrls: ['./actu.component.css']
})
export class ActuComponent implements OnInit {
  baseUrl= 'https://peeyconnect.net/repertoire_upload/'; // ← base locale définie ici

  actusList: ContentItem[] = [];
  currentPage = 0;
  pageSize = 4;
  totalPages = 0;
  totalItems = 0;
  loading = true;
  error = false;
  validationLoading: { [key: number]: boolean } = {}; // Pour suivre l'état de chargement par actualité

  constructor(
    private infoService: InfoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadActus(this.currentPage);
  }

  loadActus(page: number): void {
    this.loading = true;
    this.infoService.getActus(page, this.pageSize).subscribe({
      next: (response: ActuResponse) => {
        this.actusList = response.content;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des actualités', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadActus(page);
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

  goToActuDetail(id: number): void {
    this.router.navigate(['/actualites', id]);
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
  
  /**
   * Gérer le clic sur une carte d'actualité
   * Détermine si l'utilisateur a cliqué sur le bouton de validation ou sur la carte
   */
  handleCardClick(event: Event, actu: ContentItem): void {
    // Vérifie si le clic est sur un bouton de validation
    const target = event.target as HTMLElement;
    if (target.classList.contains('validation-btn') || 
        target.closest('.validation-btn')) {
      event.stopPropagation(); // Empêche la navigation vers les détails
      this.toggleValidation(actu);
    } else {
      // Si clic ailleurs sur la carte, aller aux détails
      this.goToActuDetail(actu.id);
    }
  }
  
  /**
   * Changer le statut de validation d'une actualité
   */
  toggleValidation(actu: ContentItem): void {
    // Status opposé à l'état actuel
    const newStatus = !actu.isvalid;
    this.validationLoading[actu.id] = true;
    
    this.infoService.toggleActuValidation(newStatus, actu.id).subscribe({
      next: (updatedActu) => {
        // Mettre à jour l'actualité avec les nouvelles informations
        const index = this.actusList.findIndex(item => item.id === actu.id);
        if (index !== -1) {
          this.actusList[index].isvalid = updatedActu.isvalid;
        }
        this.validationLoading[actu.id] = false;
      },
      error: (err) => {
        console.error(`Erreur lors de la ${newStatus ? 'validation' : 'invalidation'} de l'actualité`, err);
        this.validationLoading[actu.id] = false;
      }
    });
  }
}