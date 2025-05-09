import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InfoService, ContentItem } from '../info.service';
import { HttpClientModule } from '@angular/common/http';
import { distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  article: ContentItem | null = null;
  loading = true;
  error = false;
  imageBaseUrl = 'http://peeyconnect.net/repertoire_upload/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private infoService: InfoService
  ) {
    // Écoute des changements de route
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadArticle();
    });
  }

  ngOnInit(): void {
    this.loadArticle();
  }

  private loadArticle(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && !isNaN(+id)) {
      this.fetchArticleDetails(+id);
    } else {
      this.router.navigate(['/actualites']);
    }
  }
  private fetchArticleDetails(id: number): void {
    this.resetStates();
    
    this.infoService.getActuById(id).subscribe({
      next: (data) => {
        this.article = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching article details:', err);
        this.handleError();
      }
    });
  }

  private resetStates(): void {
    this.loading = true;
    this.error = false;
    this.article = null;
  }

  private handleError(): void {
    this.error = true;
    this.loading = false;
    setTimeout(() => this.router.navigate(['/actualites']), 5000);
  }

  private handleInvalidId(): void {
    console.error('Invalid article ID');
    this.error = true;
    this.loading = false;
    this.router.navigate(['/actualites']);
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/placeholder.jpg';
    return this.imageBaseUrl + imagePath;
  }

  goBack(): void {
    this.router.navigate(['/actualites']);
  }

  openExternalLink(): void {
    if (this.article?.lien) {
      window.open(this.article.lien, '_blank');
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Date non disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return 'Date invalide';
    }
  }
}