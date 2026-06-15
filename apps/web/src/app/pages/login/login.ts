// Log in screen.
// WHY: the front door for returning users. Plain copy, calm token-styled card,
// one accent button, friendly inline errors that never clear the email (§7).
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import { AuthService } from '../../core/auth.service';
import { Button } from '../../ui/button/button';
import { Field } from '../../ui/field/field';
import { Icon } from '../../ui/icon/icon';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, Button, Field, Icon],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly appName = APP_NAME;
  protected email = '';
  protected password = '';
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);

  async submit(): Promise<void> {
    this.error.set(null);
    if (!this.email || !this.password) {
      this.error.set('Enter your email and password to continue.');
      return;
    }
    this.loading.set(true);
    const { error } = await this.auth.signIn(this.email, this.password);
    this.loading.set(false);
    if (error) {
      this.error.set(this.friendly(error.message));
      return;
    }
    await this.router.navigateByUrl('/home');
  }

  private friendly(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('invalid login')) {
      return "That email or password didn't match. Try again.";
    }
    if (m.includes('email not confirmed')) {
      return 'Please confirm your email first — check your inbox, then log in.';
    }
    return 'Something went wrong logging you in. Please try again.';
  }
}
