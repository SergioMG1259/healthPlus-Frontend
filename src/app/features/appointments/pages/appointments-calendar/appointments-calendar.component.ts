import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-appointments-calendar',
  templateUrl: './appointments-calendar.component.html',
  styleUrls: ['./appointments-calendar.component.css']
})
export class AppointmentsCalendarComponent implements OnInit {

  type: 'month'|'week'|'day' = 'week' 
  indexDate: Date = new Date()

  constructor() { }

  get dateRange(): string {

    if (this.type === 'day') {
      return this.indexDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })

    } else if (this.type === 'week') {
      
      const startOfWeek = new Date(this.indexDate)
      startOfWeek.setDate(this.indexDate.getDate() - this.indexDate.getDay())
    
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
    
      const startDay = startOfWeek.toLocaleString('en-US', { day: '2-digit' })
      const endDay = endOfWeek.toLocaleString('en-US', { day: '2-digit' })
      const endMonth = endOfWeek.toLocaleString('en-US', { month: 'short' })
      const endYear = endOfWeek.getFullYear()
      return `${startDay} - ${endDay} ${endMonth}, ${endYear}`

    } else if (this.type === 'month') {
      
      const month = this.indexDate.toLocaleString('en-US', { month: 'long' })
      const year = this.indexDate.getFullYear()
      return `${month}, ${year}`
    }

    return ''
  }

  ngOnInit(): void {

  }

}
