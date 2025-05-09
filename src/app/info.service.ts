import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for individual content item
export interface ContentItem {
contenu: any;
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
  getActuDetail(id: number) {
    throw new Error('Method not implemented.');
  }
  private readonly apiUrl = 'https://peeyconnect.net:8080/api/v1/actu/actus';

  constructor(private http: HttpClient) { }

  /**
   * Fetches actus data with pagination
   * @param page Page number (zero-based)
   * @param size Number of items per page
   * @returns Observable of ActuResponse
   */
  getActus(page: number = 0, size: number = 12): Observable<ActuResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ActuResponse>(this.apiUrl, { params });
  }

  /**
   * Fetches a specific actu by ID
   * @param id The ID of the actu
   * @returns Observable of ContentItem
   */
  getActuById(id: number): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.apiUrl}/${id}`);
  }

  /**
   * Fetches actus filtered by category
   * @param category The category to filter by
   * @param page Page number (zero-based)
   * @param size Number of items per page
   * @returns Observable of ActuResponse
   */
  getActusByCategory(category: string, page: number = 0, size: number = 12): Observable<ActuResponse> {
    const params = new HttpParams()
      .set('categorie', category)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ActuResponse>(`${this.apiUrl}/category`, { params });
  }

  /**
   * Fetches featured actus (alaUne = true)
   * @param page Page number (zero-based)
   * @param size Number of items per page
   * @returns Observable of ActuResponse
   */
  getFeaturedActus(page: number = 0, size: number = 12): Observable<ActuResponse> {
    const params = new HttpParams()
      .set('alaUne', 'true')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ActuResponse>(`${this.apiUrl}/featured`, { params });
  }
}