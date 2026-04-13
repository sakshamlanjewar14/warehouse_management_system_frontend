import { Component, inject } from '@angular/core';
import { ToastNotificationService } from '../../services/toast-notification.service';

@Component({
  selector: 'app-toast-notification',
  imports: [],
  templateUrl: './toast-notification.html',
  styleUrl: './toast-notification.scss',
})
export class ToastNotification {
  toastService = inject(ToastNotificationService);
}
