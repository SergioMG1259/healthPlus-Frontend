import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  @ViewChild('sidenav',{ static: true }) sidenav!: MatSidenav

  private _resizeSub!:Subscription

  public mode:MatDrawerMode = 'side'

  constructor(private breakpointObserver: BreakpointObserver) { }

  closeSideNav() {
    if (this.mode == 'over')
      this.sidenav.close()
  }

  ngOnInit(): void {
    this._resizeSub = this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((state: BreakpointState) => {
      if(state.matches) {
        this.sidenav.close()
        this.mode = 'over'
      } else {
        this.sidenav.open()
        this.mode = 'side'
      }
    })
  }

  ngOnDestroy():void {
    if (this._resizeSub) {
      this._resizeSub.unsubscribe()
    }
  }

}
