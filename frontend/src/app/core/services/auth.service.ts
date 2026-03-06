import { Injectable, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { firstValueFrom } from 'rxjs';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        name
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        name
        email
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apollo = inject(Apollo);
  private router = inject(Router);
  private toast = inject(ToastService);

  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }

  async login(input: any) {
    try {
      const result: any = await firstValueFrom(
        this.apollo.mutate({
          mutation: LOGIN_MUTATION,
          variables: { input }
        })
      );

      const data = result.data.login;
      this.handleAuthSuccess(data);
      this.toast.show('success', 'Bem-vindo de volta ao CatLife!');
      this.router.navigate(['/']);
    } catch (error: any) {
      this.toast.show('error', 'E-mail ou senha incorretos.');
    }
  }

  async register(input: any) {
    try {
      const result: any = await firstValueFrom(
        this.apollo.mutate({
          mutation: REGISTER_MUTATION,
          variables: { input }
        })
      );

      const data = result.data.register;
      this.handleAuthSuccess(data);
      this.toast.show('success', 'Conta criada com sucesso!');
      this.router.navigate(['/']);
    } catch (error: any) {
      this.toast.show('error', 'Erro ao criar conta. Tente novamente.');
    }
  }

  private handleAuthSuccess(data: any) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.currentUser.set(data.user);
    this.isAuthenticated.set(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
    this.toast.show('info', 'Você saiu da sua conta.');
  }
}