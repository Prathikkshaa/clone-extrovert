// Landing page.
// WHY: the first visible screen. It exists in this scaffold to prove the design
// token system is wired end-to-end (canvas background, ink text, one accent
// button) and that the product name comes from the env-driven wordmark.
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../ui/button/button';
import { Wordmark } from '../../ui/wordmark/wordmark';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Button, Wordmark],
  templateUrl: './landing.html',
})
export class Landing {}
