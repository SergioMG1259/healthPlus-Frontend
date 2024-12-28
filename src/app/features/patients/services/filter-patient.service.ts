import { Overlay, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable } from '@angular/core';
import { FilterPatientComponent } from '../components/filter-patient/filter-patient.component';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class FilterPatientService {

  private _overlayRef!: OverlayRef
  private _positionStrategy: PositionStrategy | null = null
  private _scrollStrategy: ScrollStrategy | null = null
  private _origin!: ElementRef
  private _isOpen = false

  private readonly MOBILE_BACKDROP_CLASS = 'dialog-bg';
  private readonly DESKTOP_BACKDROP_CLASS = 'cdk-overlay-transparent-backdrop';

  constructor(private overlay: Overlay) { }

  get panelOpen(): boolean {
    return this._isOpen
  }

  openFilter(origin: ElementRef): void {
    if (this._isOpen) return

    this._isOpen = true
    this._origin = origin
    this.initializeOverlay()

    const componentPortal = new ComponentPortal(FilterPatientComponent)
    this._overlayRef.attach(componentPortal)

    this._overlayRef.backdropClick().subscribe(() => this.closeFilter())
  }

  closeFilter(): void {
    if (!this._overlayRef) return

    this._overlayRef.detach()
    this._overlayRef.dispose()
    this._isOpen = false
  }

  updateOverlayPosition(): void {
    if (this._overlayRef) {
      this.setPositionStrategy()
      this._overlayRef.updatePositionStrategy(this._positionStrategy!)
      this._overlayRef.updateScrollStrategy(this._scrollStrategy!)
    }
  }

  handleScreenResize(): void {
    // if (this._isOpen) {
    //   this.closeFilter()
    //   this.updateOverlayPosition()
    // }
  }

  private initializeOverlay(): void {
    this.setPositionStrategy()

    this._overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: this.getBackdropClass(),
      positionStrategy: this._positionStrategy!,
      scrollStrategy: this._scrollStrategy!
    })
  }

  private setPositionStrategy(): void {
    if (window.innerWidth <= 412) {
      this._positionStrategy = this.overlay.position().global().right().top()
      this._scrollStrategy = this.overlay.scrollStrategies.block()
    } else {
      this._positionStrategy = this.overlay.position()
        .flexibleConnectedTo(this._origin)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' }
        ])
      this._scrollStrategy = this.overlay.scrollStrategies.reposition()
    }
  }

  private getBackdropClass(): string {
    return window.innerWidth <= 412 ? this.MOBILE_BACKDROP_CLASS : this.DESKTOP_BACKDROP_CLASS
  }
}
