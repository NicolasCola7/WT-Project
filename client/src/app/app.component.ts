import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <h2> SIAMO A CAVALLO! </h2>
    <img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.YN5WVJL9bAMqjExME-7mBAHaEb%26pid%3DApi&f=1&ipt=da911bbbee0157ffdeeca6fb97dd17e15b30330095fd7b4718927552670b015f&ipo=images'>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'Selfie';
}
