import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'healthPlus-Frontend';

  // @HostListener("window:beforeunload",["$event"])
  // clearLocalStorage() {
  //   if(localStorage.getItem('rememberMeHealthPlus') == null && localStorage.getItem('isLoggedInHealthPlus')) {
  //     localStorage.removeItem('userRolIdHealthPlus')
  //     localStorage.removeItem('roleHealthPlus')
  //     localStorage.removeItem('accessTokenHealthPlus')
  //     localStorage.removeItem('isLoggedInHealthPlus')
  //     localStorage.removeItem('rememberMeHealthPlus')
  //   }
  // }
}