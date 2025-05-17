import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^7[05678]\d{7}$/; // Format Sénégal : 70, 75, 76, 77, 78 + 7 chiffres
    return phoneRegex.test(phone);
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Veuillez saisir votre nom d\'utilisateur et votre mot de passe';
      return;
    }

    if (!this.isValidPhoneNumber(this.username)) {
      this.errorMessage = 'Numéro de téléphone invalide (format attendu : 77XXXXXXX)';
      return;
    }

    if (this.password !== 'passer123') {
      this.errorMessage = 'Mot de passe incorrect';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password, this.rememberMe)
      .subscribe({
        next: (response) => {
          console.log('Connexion réussie');
          const user = this.authService.getCurrentUser();
          if (user) {
            console.log(`Bienvenue, ${user.username}!`);
          }
          this.isLoading = false;
          this.router.navigate(['/utilisateurs']);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la connexion.';
          }
        }
      });
  }
}
