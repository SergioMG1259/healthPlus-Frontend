import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentResponseDTO } from '../../models/AppointmentResponseDTO';

@Component({
  selector: 'app-monthly-calendar',
  templateUrl: './monthly-calendar.component.html',
  styleUrls: ['./monthly-calendar.component.css']
})
export class MonthlyCalendarComponent implements OnInit {

  @Input() indexDate$: Observable<Date> = new Observable<Date>()
  @Input() appointmentAdd$: Observable<AppointmentResponseDTO> = new Observable<AppointmentResponseDTO>()
  indexDate: Date = new Date()

  gridData:{ day: Date, isOtherMonth: boolean }[] = []
  indexDateSub!: Subscription
  appointmentAddSub!: Subscription

  appointments: AppointmentResponseDTO[] = []

  constructor(private _appointmentService: AppointmentService) { }

  fillCalendar(): void {
    const year = this.indexDate.getFullYear()
    const month = this.indexDate.getMonth()

    // Primer día del mes
    const firstDay = new Date(year, month, 1)
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0)

    firstDay.setDate(firstDay.getDate() - firstDay.getDay())
    lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()))

    // Llenar los días
    let current = new Date(firstDay)
    this.gridData = []

    while (current <= lastDay) {
      const isOtherMonth = current.getMonth() !== month
      this.gridData.push({
        day: new Date(current),
        isOtherMonth: isOtherMonth,
      })
      current.setDate(current.getDate() + 1) // Pasar al siguiente día
    }
  }

  areDatesEqual(date1: Date, date2: Date = new Date()): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    )
  }

  hasAppointmentAt(day:Date, appointment: Date): boolean {
    if(
      day.getFullYear() == appointment.getFullYear() &&
      day.getMonth() == appointment.getMonth() &&
      day.getDate() == appointment.getDate()
    )
      return true
    return false
  }

  getAppointmentsForDay(day: Date) {
    const dayAppointments = this.appointments.filter(appointment => this.hasAppointmentAt(day, appointment.startDate))
    return {
      appointments: dayAppointments.slice(0, 3),
      remaining: dayAppointments.length > 3 ? dayAppointments.length - 3 : 0
    }
  }

  ngOnInit(): void {
    // this.fillCalendar()
    this.indexDateSub = this.indexDate$.pipe(
      switchMap((date)=> {
        this.indexDate = date
        this.fillCalendar()
        return this._appointmentService.findAppointmentsMonthlyBySpecialistId(1,{date: this.indexDate})
      })
    ).subscribe(e => {
      this.appointments = e.map(appointment => ({
        ...appointment,
        startDate: new Date(appointment.startDate),
        endDate: new Date(appointment.endDate)
      }))
    })

    this.appointmentAddSub = this.appointmentAdd$.subscribe(appointment => {
      const newAppointment = {...appointment,
        startDate: new Date(appointment.startDate), endDate: new Date(appointment.endDate)}
        
      this.appointments.push(newAppointment)
    })
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['indexDate'] && !changes['indexDate'].firstChange) {
  //     console.log("sss")
  //   }
  // }

  ngOnDestroy(): void {
    if (this.indexDateSub)
      this.indexDateSub.unsubscribe()
    
    if (this.appointmentAddSub)
      this.appointmentAddSub.unsubscribe()
  }

}
