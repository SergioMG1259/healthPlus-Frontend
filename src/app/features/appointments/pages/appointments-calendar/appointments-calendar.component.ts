import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddAppointmentDialogComponent } from '../../components/add-appointment-dialog/add-appointment-dialog.component';

@Component({
  selector: 'app-appointments-calendar',
  templateUrl: './appointments-calendar.component.html',
  styleUrls: ['./appointments-calendar.component.css']
})
export class AppointmentsCalendarComponent implements OnInit {

  type: 'month'|'week'|'day' = 'week' 
  indexDate: Date = new Date()
  indexDateSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(this.indexDate)

  constructor(private _dialog: MatDialog) { }

  get dateRange(): string {

    // if (this.type == 'day') {
    //   return this.indexDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })

    // } 
    if (this.type === 'week') {
      
      const startOfWeek = new Date(this.indexDate)
      startOfWeek.setDate(this.indexDate.getDate() - this.indexDate.getDay())
    
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
    
      const startDay = startOfWeek.toLocaleString('en-US', { day: '2-digit' })
      const endDay = endOfWeek.toLocaleString('en-US', { day: '2-digit' })
      const endMonth = endOfWeek.toLocaleString('en-US', { month: 'short' })
      const endYear = endOfWeek.getFullYear()
      return `${startDay} - ${endDay} ${endMonth}, ${endYear}`

    } else if (this.type == 'month') {
      
      const month = this.indexDate.toLocaleString('en-US', { month: 'long' })
      const year = this.indexDate.getFullYear()
      return `${month}, ${year}`
    }

    return ''
  }

  get indexDate$(): Observable<Date> {
    return this.indexDateSubject as Observable<Date>
  }

  next(): void {
    if (this.type == 'week') {
      this.indexDate.setDate(this.indexDate.getDate() + 7)
    } else if (this.type == 'month') {
      this.indexDate.setMonth(this.indexDate.getMonth() + 1)
    }
    this.indexDateSubject.next(this.indexDate)
  }

  prev(): void {
    if (this.type == 'week') {
      this.indexDate.setDate(this.indexDate.getDate() - 7)
    }
    else if (this.type == 'month') {
      this.indexDate.setMonth(this.indexDate.getMonth() - 1)
    }
    this.indexDateSubject.next(this.indexDate)
  }

  onClickOpenDialog(): void {
    const dialogRef = this._dialog.open(AddAppointmentDialogComponent, {
      backdropClass: 'dialog-bg',
      width: '400px'
    })
    dialogRef.afterClosed().subscribe( (e) => {
      console.log(e)
    })
  }

  ngOnInit(): void {

  }

}
