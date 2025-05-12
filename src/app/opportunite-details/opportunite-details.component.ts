import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OpportuniteService, OpportuniteItem } from '../opportinute.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-opportunite-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './opportunite-details.component.html',
  styleUrl: './opportunite-details.component.css'
})
export class OpportuniteDetailsComponent implements OnInit {
  opportunite: OpportuniteItem | null = null;
  loading = true;
  error = false;
  imageBaseUrl = 'http://peeyconnect.net/repertoire_upload/';
  
  constructor(
    private opportuniteService: OpportuniteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      if (idParam) {
        const id = parseInt(idParam, 10);
        if (!isNaN(id)) {
          this.fetchOpportuniteDetails(id);
        } else {
          this.error = true;
          this.loading = false;
          console.error('ID invalide:', idParam);
        }
      } else {
        this.error = true;
        this.loading = false;
        console.error('Aucun ID fourni');
      }
    });
  }

  fetchOpportuniteDetails(id: number): void {
    this.opportuniteService.getOpportuniteById(id).subscribe({
      next: (opportunite) => {
        this.opportunite = opportunite;
        this.loading = false;
        console.log('Opportunité chargée:', opportunite);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'opportunité:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Helper method to construct full image URL
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/placeholder.jpg';
    return this.imageBaseUrl + imagePath;
  }

  // Helper function to format date
  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  }

  // Méthode pour retourner à la liste des opportunités
  goBack(): void {
    this.router.navigate(['/']);
  }
  navigateToDetails(id: number): void {
    console.log('Navigation vers opportunité ID:', id); // Pour débogage
    this.router.navigate(['/opportunite-details', id]);
  }
}