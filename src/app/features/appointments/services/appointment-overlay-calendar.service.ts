import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class AppointmentOverlayCalendarService {
  
  private _overlayRef: OverlayRef | null = null
  private _isOpen = false

  constructor(private overlay: Overlay) { }

  get panelOpen(): boolean {
    return this._isOpen
  }

  open(template: TemplateRef<any>, viewContainerRef: ViewContainerRef, origin: HTMLElement, backdropClickCallback?: () => void) {
    if (!this._overlayRef) {
      this._overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        positionStrategy: this.overlay.position()
        .flexibleConnectedTo(origin)
        .withPositions([
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: 5,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: -5,
          }
        ]),
        scrollStrategy: this.overlay.scrollStrategies.reposition()
      })
    }

    const portal = new TemplatePortal(template, viewContainerRef)
    this._overlayRef.attach(portal)

    this._overlayRef.backdropClick().subscribe(() => {
      if (backdropClickCallback) {
        backdropClickCallback()
      }
      this.close()
    })
  }

  close(): void {
    if (!this._overlayRef) return

    this._overlayRef.detach()
    this._overlayRef.dispose()
    this._isOpen = false
    this._overlayRef = null
  }
}
