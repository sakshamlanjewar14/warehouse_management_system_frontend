import { SupplierItemResponseDto, SupplierResponseDto } from './../supplier.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'app-supplier-view',
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-view.html',
  styleUrl: './supplier-view.scss',
})
export class SupplierView implements OnInit{
  
  private supplierService = inject(SupplierService)
  private activatedRoute = inject(ActivatedRoute)

   supplier: SupplierResponseDto | null=null;
   isLoading =(true);

   ngOnInit(): void {
     const id =  this.activatedRoute.snapshot.paramMap.get('id');

     if(id){
      this.supplierService.getSupplierById(+id).subscribe({
        next:(res)=>{
          this.supplier = res;
          this.isLoading=false;
        },
        error:()=>{
            this.isLoading=false;
        }
      })
     }
   }


}
