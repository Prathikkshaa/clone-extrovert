// Sign up screen.
// WHY: account creation. Same calm card + plain copy as login. Handles the
// email-confirmation case gracefully (shows a "check your inbox" notice when the
// project requires confirmation) and keeps the email field on error (§7).
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Button } from '../../ui/button/button';
import { Field } from '../../ui/field/field';
import { Wordmark } from '../../ui/wordmark/wordmark';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, Button, Field, Wordmark],
  templateUrl: './signup.html',
})
export class Signup {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly appName = environment.appName;
  protected fullName = '';
  protected email = '';
  protected password = '';
  protected readonly error = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);
  protected readonly loading = signal(false);

  async submit(): Promise<void> {
    this.error.set(null);
    this.notice.set(null);
    if (!this.fullName.trim()) {
      this.error.set('Tell us your name so we can personalise things.');
      return;
    }
    if (!this.email || !this.password) {
      this.error.set('Enter an email and a password to create your account.');
      return;
    }
    this.loading.set(true);
    const { error, needsConfirmation } = await this.auth.signUp(
      this.email,
      this.password,
      this.fullName,
    );
    this.loading.set(false);
    if (error) {
      this.error.set(this.friendly(error.message));
      return;
    }
    if (needsConfirmation) {
      this.notice.set('Account created. Check your email to confirm it, then log in.');
      return;
    }
    await this.router.navigateByUrl('/home');
  }

  private friendly(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('already registered') || m.includes('already been registered')) {
      return 'That email is already registered. Try logging in instead.';
    }
    if (m.includes('password')) {
      return 'Use a password with at least 6 characters.';
    }
    if (m.includes('valid email') || m.includes('invalid')) {
      return 'That email address doesn’t look right. Please check it.';
    }
    return 'Something went wrong creating your account. Please try again.';
  }
}
