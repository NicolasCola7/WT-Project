import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: '../styles.css',
})
export class AppComponent  implements OnInit{
  @HostListener('window:orientationchange')
  @HostListener('window:resize')
  ngOnInit(): void {
    this.checkOrentation();
  }

  checkOrentation(){
    const isLandscape = window.innerWidth > window.innerHeight;
    const isSmartphone = Math.max(window.innerWidth, window.innerHeight) <= 999;

    const warning = document.getElementById('landscape-warning');

    if (isLandscape && isSmartphone) {
      // Blocca landscape solo su smartphone
      if (warning){
        warning.style.display = 'flex';
      }
      document.body.classList.add('landscape');
    } else {
      // Sblocca su tablet o portrait
      if (warning){
        warning.style.display = 'none';
      }
      document.body.classList.remove('landscape');
    }
  }
}
