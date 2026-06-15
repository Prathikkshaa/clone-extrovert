// ui-wordmark — the product's text logo, in one place (the "restyled wordmark").
// WHY: the brand mark appears on the landing/login/signup screens and in the
// sidebar. Centralising it here means the logo is defined once, and the product
// name comes straight from the env-driven environment.appName — so renaming the
// product in .env (APP_NAME) re-skins the logo everywhere with no code change.
// Style: a tight, semibold wordmark with a subtle accent gradient so it reads as
// an intentional logo rather than plain text. Size is inherited from the host,
// so callers set the type scale (e.g. <ui-wordmark class="text-heading-sm" />).
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ui-wordmark',
  template: `
    <span
      class="bg-gradient-to-r from-accent to-accent-strong bg-clip-text font-semibold tracking-tight text-transparent"
    >{{ appName }}</span>
  `,
})
export class Wordmark {
  protected readonly appName = environment.appName;
}
