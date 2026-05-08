import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StockTransferService } from '../stockTransfer.service';
import { StockTransferResponseDto } from '../stockTransfer.model';

@Component({
  selector: 'app-stock-transfer-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './stock-transfer-details.html',
  styleUrl: './stock-transfer-details.scss',
})
export class StockTransferDetails implements OnInit {

  private stockTransferService = inject(StockTransferService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // states
  transfer: StockTransferResponseDto | null = null;
  isLoding = true;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id){
      this.stockTransferService.getStockTransferById(+id).subscribe({
        next:(response)=>{
          console.log(response)
          this.transfer = response
          this.isLoding = false;
          this.cdr.markForCheck();
        },
        error:()=>{
          this.isLoding = false;
        }
      })
    }
    
  }
}
