import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  user = {
    name: 'Rayan Anderson',
    role: 'Store owner',
    avatar: 'https://i.pravatar.cc/150?img=11',
    notifications: 1
  };

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
