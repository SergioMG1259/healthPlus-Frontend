import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-monthly-calendar',
  templateUrl: './monthly-calendar.component.html',
  styleUrls: ['./monthly-calendar.component.css']
})
export class MonthlyCalendarComponent implements OnInit {

  indexDate: Date = new Date()
  @Input() indexDate$: Observable<Date> = new Observable<Date>()

  gridData:{ day: Date, isOtherMonth: boolean }[] = []
  indexDateSub!: Subscription


  constructor() { }

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

  ngOnInit(): void {
    // this.fillCalendar()
    this.indexDateSub = this.indexDate$.subscribe(date => {
      this.indexDate = date
      this.fillCalendar()
    })
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['indexDate'] && !changes['indexDate'].firstChange) {
  //     console.log("sss")
  //   }
  // }

  ngOnDestroy(): void {
    if (this.indexDateSub) {
      this.indexDateSub.unsubscribe()
    }
  }

}
