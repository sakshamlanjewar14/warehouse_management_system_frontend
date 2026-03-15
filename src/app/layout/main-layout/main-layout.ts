import { Component, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  @ViewChild(Sidebar) sidebar!: Sidebar;
  isSidebarOpen = true;

  onToggleSidebar() {
    this.sidebar.toggleMobileMenu();
    this.isSidebarOpen = this.sidebar.isMobileMenuOpen;
  }
}
