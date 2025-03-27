import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Output() closeSidenavEvent = new EventEmitter<void>()

  constructor(private _authService: AuthService, private _router: Router) { }

  onClickLogOut() {
    this._authService.logout().subscribe(e => {
      localStorage.removeItem('userRolIdHealthPlus')
      localStorage.removeItem('roleHealthPlus')
      localStorage.removeItem('accessTokenHealthPlus')
      localStorage.removeItem('isLoggedInHealthPlus')
      if(localStorage.getItem('rememberMeHealthPlus'))
        localStorage.removeItem('rememberMeHealthPlus')
      this._router.navigate(['/login'])
    })
  }

  onClickCloseSidenav() {
    this.closeSidenavEvent.emit()
  }

  ngOnInit(): void {
  }

}
