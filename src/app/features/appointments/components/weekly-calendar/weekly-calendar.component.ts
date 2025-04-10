import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AppointmentOverlayCalendarService } from '../../services/appointment-overlay-calendar.service';
import { PatientShortResponseDTO } from 'src/app/features/patients/models/PatientShortResponseDTO';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppointmentResponseDTO } from '../../models/AppointmentResponseDTO';
import { debounceTime, Observable, startWith, Subscription, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditAppointemntDialogComponent } from '../edit-appointemnt-dialog/edit-appointemnt-dialog.component';
import { DetailsAppointmentDialogComponent } from '../details-appointment-dialog/details-appointment-dialog.component';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PatientResponseDTO } from 'src/app/features/patients/models/PatientResponseDTO';
import { PatientService } from 'src/app/services/patient.service';
import { AppointmentCreateDTO } from '../../models/AppointmentCreateDTO';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css']
})
export class WeeklyCalendarComponent implements OnInit {

  indexDate: Date = new Date()
  @Input() indexDate$: Observable<Date> = new Observable<Date>()
  @Input() appointmentAdd$: Observable<AppointmentResponseDTO> = new Observable<AppointmentResponseDTO>()
  indexDateSub!: Subscription
  appointmentAddSub!: Subscription
  daysName: string[] = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  daysWeek: Date [] = []
  gridData: Date[] = []
  @ViewChild('containerCells', { static: true }) containerCells!: ElementRef
  @ViewChild('overlayTemplate') overlayTemplate!: TemplateRef<any>

  private _cellEventAdd: HTMLElement | null = null
  private _appointmentOverlapping: HTMLElement | null = null

  /* Para el input search */
  isOpenInputSearch: boolean = false
  patientList:PatientShortResponseDTO[] = []
  selectedPatient: PatientShortResponseDTO | null = null

  form: FormGroup = this._fb.group({
    issueField: ['', Validators.required],
    priceField: [null, [Validators.required, Validators.min(1)]],
    patientField: [null, Validators.required]
  })
  patientControl = new FormControl()
  filteredPatients$: Observable<PatientResponseDTO[]> = new Observable<PatientResponseDTO[]>()

  appointments: AppointmentResponseDTO[] = []

  startDateOverlay: Date | null = null
  endDateOverlay: Date | null = null
  waitingResponseApi: boolean = false
  errorMessage: string | null = null

  constructor(private _renderer: Renderer2, private _viewContainerRef: ViewContainerRef, 
    private _appointmentOverlayService: AppointmentOverlayCalendarService, private _fb: FormBuilder, private _dialog: MatDialog,
    private _appointmentService: AppointmentService, private _patientService: PatientService) { }

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
    if(this.isPastTime(startDate))
      return

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
    // Filtrar la lista de appointments a un día
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
    this.patientControl.reset()
  }

  saveAppointment(): void {

    this.waitingResponseApi = true
    const date = new Date(this.startDateOverlay!)
    date.setHours(0)
    date.setMinutes(0)
    const startHour = this.startDateOverlay?.getHours()
    const endHour = this.endDateOverlay?.getHours()

    // Crear startDate en UTC sin zona horaria local
    const startDate = new Date(Date.UTC(
      new Date(date).getUTCFullYear(), 
      new Date(date).getUTCMonth(), 
      new Date(date).getUTCDate(),
      startHour, 0, 0, 0  // Establece la hora en UTC (hora de inicio)
    ))

    // Crear endDate en UTC sin zona horaria local
    const endDate = new Date(Date.UTC(
      new Date(date).getUTCFullYear(),
      new Date(date).getUTCMonth(),
      new Date(date).getUTCDate(),
      endHour, 0, 0, 0  // Establece la hora en UTC (hora de fin)
    ))
    const appointment: AppointmentCreateDTO = {
      price: this.form.get('priceField')?.value,
      startDate: startDate,
      endDate: endDate,
      issue: this.form.get('issueField')?.value
    }
    this._appointmentService.addAppointment(this.form.get('patientField')?.value, appointment).subscribe(e => {
      const newAppointment = {...e,
        startDate: new Date(e.startDate), endDate: new Date(e.endDate)}
      this.appointments.push(newAppointment)
      this.closeOverlay()
      this.resetValues()
      this.errorMessage = null
      this.waitingResponseApi = false
    }, error=> {this.errorMessage = error, this.waitingResponseApi = false})
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

  onClickOpenAppointmentActionDialog(appointment: AppointmentResponseDTO): void {

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

    if (!isPastTime) {
      dialogRef!.afterClosed().subscribe((e) => {
        if( e && e.delete) {
          this.appointments = this.appointments.filter((appointmentDelete) => e.appointmentResponse.id != appointmentDelete.id)
        } else if (e && !e.delete){
          appointment.startDate = new Date(e.appointmentResponse.startDate)
          appointment.endDate = new Date(e.appointmentResponse.endDate)
          appointment.patient = e.appointmentResponse.patient
          appointment.issue = e.appointmentResponse.issue
          appointment.price = e.appointmentResponse.price
        }
      })
    }
  }

  selectPatient(patient: PatientResponseDTO): void {
    this.form.get('patientField')?.setValue(patient.id)
  }

  displayPatient = (patient: PatientShortResponseDTO): string => {
    return patient ? `${patient.names} ${patient.lastNames}` : ''
  }

  private filterPatients(value: string|null): Observable<PatientResponseDTO[]> {
    if (value == '')
      value = null
    return this._patientService.getPatientsWithFilters({searchByNameAndLastName: value, female: true,
      male: true, minAge: null, maxAge: null, sortBy: null})
  }

  ngOnInit(): void {
    this.indexDateSub = this.indexDate$.pipe(
      tap((date) => { 
        this.indexDate = date
        this.fillWeek() // Se ejecuta inmediatamente
      }),
      debounceTime(500), // Solo afecta la llamada a la API
      switchMap((date) => this._appointmentService.findAppointmentsWeeklyBySpecialistId({ date }))
    ).subscribe(e => {
      this.appointments = e.map(appointment => ({
        ...appointment,
        startDate: new Date(appointment.startDate),
        endDate: new Date(appointment.endDate)
      }))
    })

    // Para cuando se agrega un appointment desde el botón "Agregar appointment" fuera de este componente
    this.appointmentAddSub = this.appointmentAdd$.subscribe(appointment => {
      const newAppointment = {...appointment,
        startDate: new Date(appointment.startDate), endDate: new Date(appointment.endDate)}
        
      this.appointments.push(newAppointment)
    })

    this.filteredPatients$ = this.patientControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000), // Espera 1 segundo
      switchMap(value => this.filterPatients(value))
    )
  }

  ngOnDestroy(): void {
    if (this.indexDateSub)
      this.indexDateSub.unsubscribe()

    if (this.appointmentAddSub)
      this.appointmentAddSub.unsubscribe()
  }
}
