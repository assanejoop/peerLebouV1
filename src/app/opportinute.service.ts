import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OpportuniteItem {
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

export interface OpportuniteResponse {
  content: OpportuniteItem[];
  pageable: {
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
  };
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
export class OpportuniteService {
  toggleValidation(id: number, status: boolean): Observable<OpportuniteItem> {
    return this.http.put<OpportuniteItem>(`${this.baseUrl}/${id}/validation`, { isvalid: status });
  }
  private baseUrl = 'https://peeyconnect.net:8080/api/v1';
  
  
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.getOpportunites();
  }

  // Récupérer toutes les opportunités paginées
  getOpportunites(page: number = 0, size: number = 12): Observable<OpportuniteResponse> {
    return this.http.get<OpportuniteResponse>(`${this.baseUrl}/opportunite/pages?page=${page}&size=${size}`);
  }

  // Récupérer une opportunité par ID
  getOpportuniteById(id: number): Observable<OpportuniteItem> {
    return this.http.get<OpportuniteItem>(`${this.baseUrl}/opportunite/${id}`);
  }
}

// function ngOnInit() {
//   throw new Error('Function not implemented.');
// }
