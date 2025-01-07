import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AppointmentOverlayCalendarService } from '../../services/appointment-overlay-calendar.service';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css']
})
export class WeeklyCalendarComponent implements OnInit {

  @Input() indexDate: Date = new Date()
  daysName: string[] = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  daysWeek: Date [] = []
  cells: number[] = []
  @ViewChild('containerCells', { static: true }) containerCells!: ElementRef
  @ViewChild('overlayTemplate') overlayTemplate!: TemplateRef<any>

  private _cellEventAdd: HTMLElement | null = null
  private _appointmentOverlapping: HTMLElement | null = null

  constructor(private _renderer: Renderer2, private _viewContainerRef: ViewContainerRef, 
    private _appointmentOverlayService: AppointmentOverlayCalendarService) { }

  fillWeek(): void {
    const startOfWeek = new Date(this.indexDate)
    startOfWeek.setDate(this.indexDate.getDate() - this.indexDate.getDay())
  
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
  
    let current = new Date(startOfWeek)
    this.daysWeek = []

    while (current <= endOfWeek) {
      let newDay = new Date(current)
      this.daysWeek.push(newDay)
      current.setDate(current.getDate() + 1)
    }
  }

  areDatesEqual(date1: Date, date2: Date = new Date()): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    )
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault()

    const cell = event.target as HTMLElement
    const appointmentOverlapping = this.createAppointmentOverlapping(cell)
    const span = this._renderer.createElement('span')

    this._cellEventAdd = cell
    this._appointmentOverlapping = appointmentOverlapping

    const initialY = event.clientY

    const cellIndex = Array.from(cell.parentNode!.children).indexOf(cell) // Obtener el índice de la celda
    const startHour = 6 + Math.floor(cellIndex / 7) // Calcular la hora de inicio
    this._renderer.appendChild(appointmentOverlapping, span)
    this.updateAppointmentOverlappingText(span, startHour, startHour + 1)
    

    const onMouseMove = this.createMouseMoveHandler(initialY, appointmentOverlapping, cell, startHour, span)
    const removeMouseMoveListener = this._renderer.listen(document, 'mousemove', onMouseMove)

    const onMouseUp = () => {
      removeMouseMoveListener()
      removeMouseUpListener()
      setTimeout(() => {
        if (document.body.contains(appointmentOverlapping)) {
          this.openOverlay(appointmentOverlapping)
        }
      }, 0)
      // this._renderer.removeChild(cell, overlay)
      // this.finalizeOverlay(overlay, cell);
    }
    const removeMouseUpListener = this._renderer.listen(document, 'mouseup', onMouseUp)
  }

  private createAppointmentOverlapping(cell: HTMLElement): HTMLElement {
    const appointmentOverlapping = this._renderer.createElement('div')
    this._renderer.addClass(appointmentOverlapping, 'appointment-overlapping')
    this._renderer.appendChild(cell, appointmentOverlapping)
    return appointmentOverlapping
  }

  private createMouseMoveHandler(initialY: number, appointmentOverlapping: HTMLElement, cell: HTMLElement, 
    startHour: number, span: HTMLElement) {
    return (moveEvent: MouseEvent) => {
        requestAnimationFrame(() => {

            const heightDifference = moveEvent.clientY - initialY

            // Verifica que el border inferior del appointment no supere el borde inferior del calendar
            if (appointmentOverlapping.getBoundingClientRect().bottom - 2 > 
              this.containerCells.nativeElement.getBoundingClientRect().bottom) {
              
              this._renderer.removeChild(cell, appointmentOverlapping)
              return
            }

            if (heightDifference >= 0) {
              
                const newHeight = this.calculateNewHeight(heightDifference)
                this._renderer.setStyle(appointmentOverlapping, 'height', `${newHeight}px`)

                const hoursAdded = Math.floor(heightDifference / 60)
                const endHour = startHour + hoursAdded + 1
                this.updateAppointmentOverlappingText(span, startHour, endHour)
                // if (this.isOverlayOverlapping(overlay)) {
                //     this.renderer.removeChild(cell, overlay);
                // }
            }
        })
    }
  }

  private calculateNewHeight(heightDifference: number): number {
    return 60 + Math.floor(heightDifference / 60) * 60
  }

  updateAppointmentOverlappingText(span: HTMLElement, startHour: number, endHour: number): void {
    this._renderer.setProperty(span, 'textContent', `${startHour}:00 - ${endHour}:00`)
  }

  openOverlay(appointmentOverlapping: HTMLElement): void {
    this._appointmentOverlayService.open(this.overlayTemplate, this._viewContainerRef, 
      appointmentOverlapping, this.removeAppointmentRange.bind(this))
  }

  closeOverlay(): void {
    this._appointmentOverlayService.close()
    this.removeAppointmentRange()
  }

  removeAppointmentRange(): void {
    this._renderer.removeChild(this._cellEventAdd, this._appointmentOverlapping)
  }

  ngOnInit(): void {
    this.fillWeek()
    const totalCells = 17 * 7
    this.cells = new Array(totalCells).fill(0)
  }

}
