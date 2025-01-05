import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

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
    );
  }

  ngOnInit(): void {
    this.fillWeek()
    const totalCells = 17 * 7
    this.cells = new Array(totalCells).fill(0);
  }

}
