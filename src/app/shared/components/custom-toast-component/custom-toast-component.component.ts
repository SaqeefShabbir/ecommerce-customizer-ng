import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-custom-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './custom-toast-component.component.html',
  styleUrls: ['./custom-toast-component.component.scss']
})
export class CustomToastComponent extends Toast {
  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage,
    protected override ngZone: NgZone
  ) {
    super(toastrService, toastPackage, ngZone);
  }

  dismiss() {
    this.toastPackage.triggerAction();
  }
}
