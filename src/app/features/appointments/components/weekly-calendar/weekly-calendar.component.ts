import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AppointmentOverlayCalendarService } from '../../services/appointment-overlay-calendar.service';
import { PatientShortDTO } from 'src/app/features/patients/models/PatientShortDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentResponseDTO } from '../../models/appointmentResponseDTO';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditAppointemntDialogComponent } from '../edit-appointemnt-dialog/edit-appointemnt-dialog.component';
import { DetailsAppointmentDialogComponent } from '../details-appointment-dialog/details-appointment-dialog.component';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css']
})
export class WeeklyCalendarComponent implements OnInit {

  indexDate: Date = new Date()
  @Input() indexDate$: Observable<Date> = new Observable<Date>()
  indexDateSub!: Subscription
  daysName: string[] = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  daysWeek: Date [] = []
  gridData: Date[] = []
  @ViewChild('containerCells', { static: true }) containerCells!: ElementRef
  @ViewChild('overlayTemplate') overlayTemplate!: TemplateRef<any>

  private _cellEventAdd: HTMLElement | null = null
  private _appointmentOverlapping: HTMLElement | null = null

  /* Para el input search */
  isOpenInputSearch: boolean = false
  patientList:PatientShortDTO[] = [
    {id: 1, names: "asd1", lastNames: "ddd"},
    {id: 2, names: "asd2", lastNames: "ddd2"},
    {id: 3, names: "nbn3", lastNames: "mmm3"},
    {id: 4, names: "peo4", lastNames: "gnq"}
  ]
  selectedPatient: PatientShortDTO | null = null

  form: FormGroup = this._fb.group({
    issueField: ['', Validators.required],
    priceField: [null, [Validators.required, Validators.min(1)]],
    patientField: [null, Validators.required]
  })

  appointments: AppointmentResponseDTO[] = [
    {
      price: 10, startDate: new Date(2025, 0, 10, 8), endDate: new Date(2025, 0, 10, 9), issue: 'FOLLOW_UP', patient: {id: 1, names: "hola", lastNames: "ddddddddd"}
    },
    {
      price: 10, startDate: new Date(2025, 0, 10, 9), endDate: new Date(2025, 0, 10, 12), issue: 'FOLLOW_UP', patient: {id: 1, names: "hola", lastNames: "dddddddddddd"}
    },
    {
      price: 10, startDate: new Date(2025, 0, 17, 9), endDate: new Date(2025, 0, 17, 12), issue: 'FOLLOW_UP', patient: {id: 2, names: "hola", lastNames: "dddddddddddd"}
    }
  ]

  startDateOverlay: Date | null = null
  endDateOverlay: Date | null = null

  constructor(private _renderer: Renderer2, private _viewContainerRef: ViewContainerRef, 
    private _appointmentOverlayService: AppointmentOverlayCalendarService, private _fb: FormBuilder, private _dialog: MatDialog) { }

  private fillWeek(): void {
    const startOfWeek = new Date(this.indexDate)
    startOfWeek.setDate(this.indexDate.getDate() - this.indexDate.getDay())
  
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
  
    let current = new Date(startOfWeek)
    this.daysWeek = []
    this.gridData = []
    while (current <= endOfWeek) {
      let newDay = new Date(current)
      this.daysWeek.push(newDay)
      current.setDate(current.getDate() + 1)
    }

    for (let hour = 6; hour < 23; hour++) {
      for (let day = 0; day < 7; day++) {
        const cellDate = new Date(startOfWeek)
        cellDate.setDate(startOfWeek.getDate() + day) // Incrementa por día
        cellDate.setHours(hour)
        cellDate.setMinutes(0)
        this.gridData.push(cellDate)
      }
    }    
  }

  areDatesEqual(date1: Date, date2: Date = new Date()): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    )
  }

  isPastTime(date: Date) {
    const current = new Date()
    return date < current
  }

  onMouseDown(event: MouseEvent, startDate: Date): void {
    event.preventDefault()
    const cell = event.target as HTMLElement
    const appointmentOverlapping = this.createAppointmentOverlapping(cell)
    const span = this._renderer.createElement('span')

    this._cellEventAdd = cell
    this._appointmentOverlapping = appointmentOverlapping

    const initialY = event.clientY

    const startHour = startDate // Calcular la hora de inicio
    this._renderer.appendChild(appointmentOverlapping, span)
    this.updateAppointmentOverlappingText(span, startHour.getHours(), startHour.getHours() + 1)
    
    const filteredAppointments: AppointmentResponseDTO[] = this.filterAppointmentsInit(startHour)
    this.startDateOverlay = startHour
    this.endDateOverlay = new Date(startHour)
    this.endDateOverlay.setHours(startHour.getHours() + 1)

    const onMouseMove = this.createMouseMoveHandler(initialY, appointmentOverlapping, cell, startHour, span, filteredAppointments)
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

  private filterAppointmentsInit(startDate: Date): AppointmentResponseDTO[] {
  
    const endOfDay = new Date(startDate)
    endOfDay.setHours(23, 59, 59, 999)

    return this.appointments.filter(appointment =>
      appointment.startDate >= startDate &&
      appointment.startDate <= endOfDay
    )
  }

  private createMouseMoveHandler(initialY: number, appointmentOverlapping: HTMLElement, cell: HTMLElement, 
    startHour: Date, span: HTMLElement, filteredAppointments:AppointmentResponseDTO[]) {
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
            // const endHour: Date =  startHour.getHours() + hoursAdded + 1
            const endHour: Date =  new Date(startHour)
            endHour.setHours(startHour.getHours() + hoursAdded + 1)
            this.endDateOverlay = endHour

              if (filteredAppointments.length != 0) {
                if(this.isDateOccupied(endHour, filteredAppointments)) {
                  this._renderer.removeChild(cell, appointmentOverlapping)
                  return
                }
              }
            this.updateAppointmentOverlappingText(span, startHour.getHours(), endHour.getHours())
          }
      })
    }
  }

  private calculateNewHeight(heightDifference: number): number {
    return 60 + Math.floor(heightDifference / 60) * 60
  }

  private isDateOccupied(date: Date, list:AppointmentResponseDTO[]): boolean {

    const newDate = new Date(date)
    newDate.setHours(date.getHours() - 1)
    return list.some(
      appointment => appointment.startDate <= newDate && appointment.endDate > newDate
    )
  }

  private updateAppointmentOverlappingText(span: HTMLElement, startHour: number, endHour: number): void {
    this._renderer.setProperty(span, 'textContent', `${startHour}:00 - ${endHour}:00`)
  }

  openOverlay(appointmentOverlapping: HTMLElement): void {
    this._appointmentOverlayService.open(this.overlayTemplate, this._viewContainerRef, 
      appointmentOverlapping, this.removeAppointmentRange.bind(this))
  }

  closeOverlay(): void {
    this.removeAppointmentRange()
    this._appointmentOverlayService.close()
  }

  resetValues(): void {
    this.selectedPatient = null
    this.form.reset()
    this.startDateOverlay = null
    this.endDateOverlay = null
  }

  saveAppointment(): void {
    this.appointments.push({
      price: this.form.controls['priceField'].value,
      startDate: this.startDateOverlay!,
      endDate: this.endDateOverlay!,
      issue: this.form.controls['issueField'].value,
      patient: {id: 1, names: "hola", lastNames: "dddddddddddd"}
    })
    this.closeOverlay()
  }

  removeAppointmentRange(): void {
    this.resetValues()
    this._renderer.removeChild(this._cellEventAdd, this._appointmentOverlapping)
  }

  compareDatesInAppointments(date: Date): AppointmentResponseDTO | null {
    const appointment = this.appointments.find(
      (f) =>
        f.startDate.getFullYear() === date.getFullYear() &&
        f.startDate.getMonth() === date.getMonth() &&
        f.startDate.getDate() === date.getDate() &&
        f.startDate.getHours() === date.getHours()
    )
    return appointment || null
  }

  onClickOpenAppointmentActionDialog(appointment: AppointmentResponseDTO):void {

    const isPastTime = this.isPastTime(appointment.startDate)

    let dialogRef = null

    if (!isPastTime) {
      dialogRef = this._dialog.open(EditAppointemntDialogComponent, {
        backdropClass: 'dialog-bg',
        width: '400px',
        data: {appointment: appointment}
      })
    } else {
      dialogRef = this._dialog.open(DetailsAppointmentDialogComponent, {
        backdropClass: 'dialog-bg',
        width: '400px',
        data: {appointment: appointment}
      })
    }

    dialogRef!.afterClosed().subscribe( (e) => {
      console.log(e)
    })
  }


  onSearchInput(event: Event): void {
    this.openSearchPatient()
  }

  onPatientSelect(patient: PatientShortDTO) {
    this.form.controls['patientField'].setValue(patient)
    this.selectedPatient = patient
    this.closeSearchPatient()
  }

  openSearchPatient(): void {
    if(this.isOpenInputSearch) return
    this.isOpenInputSearch = true
  }

  closeSearchPatient(): void {
    if(!this.isOpenInputSearch) return
    this.isOpenInputSearch = false
  }

  ngOnInit(): void {
    // this.fillWeek()
    this.indexDateSub = this.indexDate$.subscribe(date => {
      this.indexDate = date
      this.fillWeek()
    })
  }

  ngOnDestroy(): void {
    if (this.indexDateSub) {
      this.indexDateSub.unsubscribe()
    }
  }
}
