import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Interface for individual content item
export interface ContentItem {
  imagePath: any;
  id: number;
  auteur: string;
  auteurimg: string;
  categorie: string;
  lien: string;
  date: string;
  descr: string;
  idauteur: number;
  img: string;
  isvalid: boolean;
  role: string;
  titre: string;
  alaUne: boolean;
  contenu: string; // Contenu HTML de l'article
}

// Interface for pagination info
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Interface for the complete response
export interface ActuResponse {
  content: ContentItem[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  // URL de base de l'API
  private readonly baseApiUrl = 'https://peeyconnect.net:8080/api/v1';
  
  // URL pour les actualités
  private readonly actuApiUrl = `${this.baseApiUrl}/actu/actus`;
  
  // URL pour les opportunités (si différent)
  private readonly opportApiUrl = `${this.baseApiUrl}/actu/actus`; // À modifier si nécessaire

  constructor(private http: HttpClient) { }

  /**
   * Récupère les actualités avec pagination
   * @param page Numéro de page (commence à 0)
   * @param size Nombre d'éléments par page
   * @returns Observable de type ActuResponse
   */
  getActus(page: number = 0, size: number = 12): Observable<ActuResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ActuResponse>(this.actuApiUrl, { params });
  }

  /**
   * Récupère les opportunités avec pagination
   * @param page Numéro de page (commence à 0)
   * @param size Nombre d'éléments par page
   * @returns Observable de type ActuResponse
   */
  getOpportunites(page: number = 0, size: number = 12): Observable<ActuResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ActuResponse>(this.opportApiUrl, { params });
  }

  /**
   * Récupère une actualité spécifique par son ID
   * @param id L'ID de l'actualité
   * @returns Observable de type ContentItem
   */
  getActuById(id: number): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.baseApiUrl}/actu/${id}`);
  }

  /**
   * Récupère les actualités filtrées par catégorie
   * @param category La catégorie à filtrer
   * @param page Numéro de page (commence à 0)
   * @param size Nombre d'éléments par page
   * @returns Observable de type ActuResponse
   */
  getActusByCategory(category: string, page: number = 0, size: number = 12): Observable<ActuResponse> {
    const params = new HttpParams()
      .set('categorie', category)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ActuResponse>(`${this.actuApiUrl}/category`, { params });
  }

  /**
   * Récupère les actualités mises en avant (alaUne = true)
   * @param page Numéro de page (commence à 0)
   * @param size Nombre d'éléments par page
   * @returns Observable de type ActuResponse
   */
  getFeaturedActus(page: number = 0, size: number = 12): Observable<ActuResponse> {
    const params = new HttpParams()
      .set('alaUne', 'true')
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ActuResponse>(`${this.actuApiUrl}/featured`, { params });
  }
  
  /**
   * Valide ou invalide une actualité
   * @param status Statut de validation (true ou false)
   * @param id ID de l'actualité
   * @returns Observable de type ContentItem
   */
  toggleActuValidation(status: boolean, id: number): Observable<ContentItem> {
    // Utilisation du nouvel endpoint avec status et false pour alaune (par défaut)
    return this.http.get<ContentItem>(`${this.baseApiUrl}/actu/valid/${status}/false/${id}`);
  }
  
  /**
   * Valide ou invalide une actualité ou opportunité avec contrôle du statut alaUne
   * @param status Statut de validation (true ou false)
   * @param alaune Statut alaUne (true ou false)
   * @param id ID de l'actualité ou opportunité
   * @returns Observable de type ContentItem
   */
  toggleValidation(status: boolean, alaune: boolean, id: number): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.baseApiUrl}/actu/valid/${status}/${alaune}/${id}`);
  }
}