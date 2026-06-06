// Root app shell.
// WHY: a thin shell that only hosts the router outlet. All screens are lazy
// routes (performance rule §7), so the shell stays minimal and route bundles
// load on demand.
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {}
