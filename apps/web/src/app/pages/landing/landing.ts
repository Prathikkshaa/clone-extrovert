// Landing page.
// WHY: the first visible screen. It exists in this scaffold to prove the design
// token system is wired end-to-end (canvas background, ink text, one accent
// button) and that the product name comes from the shared APP_NAME constant.
import { Component } from '@angular/core';
import { APP_NAME } from '@extrovertai/shared';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly appName = APP_NAME;
}
