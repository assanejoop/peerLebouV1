import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/* ─────────── Types ─────────── */

export interface User {
  id: number;
  username: string;      // ici : numéro de téléphone
  role?: string;
}

export interface AuthResponse {
  token: string;
  user:  User;
  refreshToken?: string; // si ton backend le fournit
}

/* ─────────── Service ─────────── */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* ⚙️  API root : change‑la si besoin */
  private readonly apiRoot = 'https://peeyconnect.net/api/v1/auth/signin';

  /* ✅  États internes */
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject      = new BehaviorSubject<User | null>(null);

  /* 🌍  Observable publics */
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$     = this.currentUserSubject.asObservable();

  /* Utilisé pour savoir si l’on est côté navigateur */
  private readonly isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    /* 🔄  Recharge le token & l’utilisateur s’ils existent déjà */
    if (this.isBrowser) {
      this.isAuthenticatedSubject.next(this.hasToken());
      this.loadUserFromStorage();
    }
  }

  /* ─────────── AUTH ─────────── */

  /** ⏩  Login */
  login(username: string, password: string, rememberMe: boolean = false): Observable<AuthResponse> {
    const url = `${this.apiRoot}`;
    return this.http.post<AuthResponse>(url, { username, password }).pipe(
      tap(resp => {
        if (this.isBrowser) {
          /* Token */
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('token', resp.token);

          /* User */
          storage.setItem('user', JSON.stringify(resp.user));

          /* Subjects */
          this.currentUserSubject.next(resp.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(err => {
        /* Mapping d’erreurs plus lisibles si besoin */
        if (err.status === 404) {
          return throwError(() => new Error('Numéro de téléphone non trouvé'));
        }
        if (err.status === 401) {
          return throwError(() => new Error('Mot de passe incorrect'));
        }
        return throwError(() => err);
      })
    );
  }

  /** 🚪  Logout */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /* ─────────── Getters & helpers ─────────── */

  /** 👤  Utilisateur actuel */
  getCurrentUser(): User | null {
    if (!this.currentUserSubject.value && this.isBrowser) {
      this.loadUserFromStorage();
    }
    return this.currentUserSubject.value;
  }

  /** 🔑  Récupère le token brut */
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /** 📦  Recharge l’utilisateur depuis le storage */
  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;
    const json = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (json) {
      try {
        this.currentUserSubject.next(JSON.parse(json));
      } catch {
        this.currentUserSubject.next(null);
      }
    }
  }

  /**  Y a‑t‑il déjà un token stocké ? */
  private hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  }
}
