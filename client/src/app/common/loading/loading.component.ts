import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.css"],
  imports: [ MatProgressSpinnerModule, NgIf ],
  standalone: true,
})
export class LoadingComponent {
  @Input() condition = false;
}