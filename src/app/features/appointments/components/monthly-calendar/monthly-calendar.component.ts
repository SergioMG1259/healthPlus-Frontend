import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-monthly-calendar',
  templateUrl: './monthly-calendar.component.html',
  styleUrls: ['./monthly-calendar.component.css']
})
export class MonthlyCalendarComponent implements OnInit {

  @Input() indexDate: Date = new Date()
  gridData:{ day: Date, isOtherMonth: boolean }[] = []

  // resizableDivs: { top: number; left: number; height: number; width: number }[] = []
  // resizing = false
  // startY = 0
  // divHeight = 0
  // startX = 0
  // divIndex = -1

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

  // startResize(event: MouseEvent, index: number, cell: HTMLDivElement) {
  //   let cellWidth = cell.getBoundingClientRect().width; // Obtener el ancho preciso del cell
  //   cellWidth = parseFloat(cellWidth.toFixed(2)); // Redondear a dos decimales

  //   if (!this.gridData[index].occupied) {
  //     this.resizing = true
  //     const row = Math.floor(index / 7)
  //     const col = index % 7
  //     this.startY = row * 70 // 100px cell height + 10px gap
  //     this.startX = col * (cellWidth) // 100px cell width + 10px gap
  //     this.divHeight = 70 // Initial cell height

  //     this.resizableDivs.push({
  //       top: this.startY,
  //       left: this.startX,
  //       height: 70,
  //       width: cellWidth
  //     })

  //     this.divIndex = this.resizableDivs.length - 1
  //     this.gridData[index].occupied = true
  //   }
  // }

  ngOnInit(): void {
    this.fillCalendar()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indexDate'] && !changes['indexDate'].firstChange) {
      console.log("sss")
    }
  }

}
