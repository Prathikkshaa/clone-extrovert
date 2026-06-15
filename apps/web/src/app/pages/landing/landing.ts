// Landing page.
// WHY: the first visible screen. It exists in this scaffold to prove the design
// token system is wired end-to-end (canvas background, ink text, one accent
// button) and that the product name comes from the shared APP_NAME constant.
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import { Button } from '../../ui/button/button';
import { Icon } from '../../ui/icon/icon';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Button, Icon],
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly appName = APP_NAME;
}
