// BreadcrumbService — shared breadcrumb state (File 16, Phase 1).
// WHY: §2 puts the back arrow + breadcrumb in the top bar, while each screen's
// ui-page-header knows its own title/trail. To avoid double chrome (a breadcrumb
// in both the topbar and the page body), the page-header pushes its trail here
// and the topbar renders it. One source of truth; set per screen.
import { Injectable, signal } from '@angular/core';

export interface Crumb {
  label: string;
  /** Router link; omit for the current (last) crumb. */
  link?: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  /** The trail shown in the topbar, e.g. [{label:'Home',link:'/home'},{label:'Find leads'}]. */
  readonly crumbs = signal<Crumb[]>([]);

  set(crumbs: Crumb[]): void {
    this.crumbs.set(crumbs);
  }
}
