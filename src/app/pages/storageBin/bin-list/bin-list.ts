import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { StorageBinService } from "../storageBin.service";
import { StorageBinResponse } from "../storageBin.model";


@Component({
  selector: 'app-storageBin-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bin-list.html'
})
export class StorageBinList implements OnInit {

  constructor(
    public storageBinService: StorageBinService
  ){

  }

  storageBins: StorageBinResponse[] = [];
  totalStorageBinCount = signal<number>(0);

  ngOnInit(): void {
    this.storageBinService.getAllStorageBins()
    .subscribe({
      next: (storageBinList)=> {
        this.storageBins = storageBinList;
        this.totalStorageBinCount.set(storageBinList.length);
      },
      error: (err)=>{
        console.log("Unable to fetch storageBin list from backend", err);
      }
    });
  }
  
}