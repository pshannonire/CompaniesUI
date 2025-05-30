import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private tokenType: string = 'Bearer';
  private loginUrl = 'https://localhost:44374/api/auth/login';

  constructor(private http: HttpClient) {}

  async authenticate(): Promise<void> {
    if (!this.token) {
      const response: any = await firstValueFrom(
        this.http.post(this.loginUrl, {
          username: 'admin',
          password: 'password123'
        })
      );
      this.token = response.token;
      this.tokenType = response.tokenType || 'Bearer';
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getTokenType(): string {
    return this.tokenType;
  }
}
