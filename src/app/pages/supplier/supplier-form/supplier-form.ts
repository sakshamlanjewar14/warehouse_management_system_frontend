import { SupplierService } from './../supplier.service';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupplierRequestDto, SupplierResponseDto } from '../supplier.model';
import { ToastNotificationService } from '../../../shared/services/toast-notification.service';

// Component Setup
@Component({
  selector: 'app-supplier-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.scss',
})
export class SupplierForm implements OnInit {

  // Dependency Injection
  private formBuilder = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private toastnotificationService = inject(ToastNotificationService);
  private activatedRoute = inject(ActivatedRoute)
  private cdr = inject(ChangeDetectorRef)

formMode: 'N' | 'E' = 'N';

  // Signals
  isSubmitting = signal(false);
  submitMessage = signal('');

selectedSupplier: SupplierResponseDto | null = null;

  // For getting an list in select on form
  stateList = [
    { id: "1", name: "Maharashtra" },
    { id: "2", name: "Goa" },
    { id: "3", name: "Karnatka" },
    { id: "4", name: "Panjab" },
    { id: "5", name: "Hariyana" },
    { id: "6", name: "Uttar Pradesh" },
    { id: "7", name: "Madhya Pradesh" },
  ]

  cityList = [
    { id: "1", name: "Pune" },
    { id: "2", name: "Mumbai" },
    { id: "3", name: "Gondia" },
    { id: "4", name: "Nagpur" },
    { id: "5", name: "Delhi" },
    { id: "6", name: "Chandigarh" },
    { id: "7", name: "Bilaspur" },
  ]


  countryList = [
    { id: "1", name: "India" },
    { id: "2", name: "Australia" },
    { id: "3", name: "Brazil" },
    { id: "4", name: "Colombia" },
    { id: "5", name: "Denmark" },
    { id: "6", name: "Egypt" },
    { id: "7", name: "Germany" },
  ]



  // Strongly typed Reactive Form
  // Form Creation
  supplierForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
    supplierCode: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Z0-9_-]+$/)]],
    email: ['', [ Validators.required, Validators.email, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    phone: ['', [ Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
    address1: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[a-zA-Z0-9\s,.\-/#]+$/)]],
    address2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[a-zA-Z0-9\s,.\-/#]+$/)]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['', [Validators.required]],
    postalCode: ['', [ Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]]
  });


  ngOnInit(): void {
    
    this.activatedRoute.queryParamMap.subscribe(params=>{

      const supplierId = params.get('supplierId');

      if(supplierId){
        this.formMode = 'E';
        console.log("form mode in::", this.formMode);

        // /Api Call
        this.supplierService.getSupplierById(parseInt(supplierId))
        .subscribe({
          next: (response)=>{
            console.log("selectedSupplier::", response);
            this.selectedSupplier = response;
            this.supplierForm.patchValue({
              name: this.selectedSupplier.name,
              supplierCode: this.selectedSupplier.supplierCode,
              email: this.selectedSupplier.email,
              phone: this.selectedSupplier.phone,
              address1: this.selectedSupplier.address1,
              address2: this.selectedSupplier.address2,
              city: this.selectedSupplier.city,
              state: this.selectedSupplier.state,
              country: this.selectedSupplier.country,
              postalCode: this.selectedSupplier.postalCode
            });
          },
          error:(err)=>{
            console.log("Unable to fetch selected supplier from backend", err);
            this,this.toastnotificationService.show("Unable to fetch selected supplier data", "error");
            this.cdr.markForCheck();
          }
        })
      }
    });
    console.log("form mode out::", this.formMode);
  }

  // Check form is valid
  onSubmit() {
    if (this.supplierForm.valid) {
      // Start loading
      this.isSubmitting.set(true);

      console.log('Supplier Data:', this.supplierForm.value);

      // Get form data
      // const supplierData = this.supplierForm.getRawValue() as SupplierRequestDto;
      const formValue = this.supplierForm.value;

      if(this.formMode === 'E' && this.selectedSupplier){

        const editSupplierData: SupplierRequestDto = {
          supplierId: this.selectedSupplier.supplierId,
          name: formValue.name ?? '',
          supplierCode: formValue.supplierCode ?? '',
          email: formValue.email ?? '',
          phone: formValue.phone ?? '',
          address1: formValue.address1 ?? '',
          address2: formValue.address2 ?? '',
          city: formValue.city ?? '',
          state: formValue.state ?? '',
          country: formValue.country ?? '',
          postalCode: formValue.postalCode ?? ''
        }

        // Call backend
        this.supplierService.updateSupplierById(this.selectedSupplier.supplierId, editSupplierData)
        .subscribe({
          // handle response ---seccess
          next:(savedSupplier)=>{
            this.isSubmitting.set(false);
            this.submitMessage.set("Supplier updated successfully");
            this.supplierForm.reset();
            this.toastnotificationService.show("Supplier updated successfully");
            this.cdr.markForCheck();
          },
          // Handle response---error
          error:(err)=>{
            this.isSubmitting.set(false);
            this.submitMessage.set("Unable to update supplier");
            console.log("Unable to update supplier at backend", err);
            this.toastnotificationService.show("Unable to update supplier", "error");
            this.cdr.markForCheck();
          }
        });
      }else{
        const newSupplierData: SupplierRequestDto = {
          name: formValue.name ?? '',
          supplierCode: formValue.supplierCode ?? '',
          email: formValue.email ?? '',
          phone: formValue.phone ?? '',
          address1: formValue.address1 ?? '',
          address2: formValue.address2 ?? '',
          city: formValue.city ?? '',
          state: formValue.state ?? '',
          country: formValue.country ?? '',
          postalCode: formValue.postalCode ?? ''
        };
        // Call backend
      this.supplierService.createSupplier(newSupplierData)
        .subscribe({
          // Handle response--Success
          next: (savedSupplier) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Supplier saved successfully!');
            this.supplierForm.reset();
            this.toastnotificationService.show("Supplier saved successfully!", 'success')
          },
          // Handle response--error
          error: (err) => {
            this.isSubmitting.set(false);
            this.submitMessage.set('Unable to save Supplier!');
            this.toastnotificationService.show("Unable to save Supplier!", "error")
            console.log("Unable to save Supplier at backend", err);
          }
        });
      }
    }else{
      this.toastnotificationService.show("Invalid form values", "error");
    }
  }

  // Clear Form Function
  clearForm() {
    this.supplierForm.reset();
  }

}
