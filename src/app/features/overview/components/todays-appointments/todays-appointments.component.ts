import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todays-appointments',
  templateUrl: './todays-appointments.component.html',
  styleUrls: ['./todays-appointments.component.css']
})
export class TodaysAppointmentsComponent implements OnInit {

  today = formatDate(new Date(),'dd', 'en-US')
  weekDays: { letter: string; date: string }[] = []
  currentWeekRange: string = ''

  constructor() { this.getWeekDays() }

  getWeekDays(): void {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const sundayOffset = dayOfWeek // Desplazamiento para encontrar el último domingo

    // Calcular el último domingo
    const lastSunday = new Date(today)
    lastSunday.setDate(today.getDate() - sundayOffset)

    // Limpiar weekDays
    this.weekDays = []

    // Generar los días de la semana, comenzando desde el domingo
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(lastSunday) // Clona el domingo
        currentDay.setDate(lastSunday.getDate() + i)
        const formattedDate = formatDate(currentDay, 'dd', 'en-US')

        this.weekDays.push({
            letter: ['U', 'M', 'T', 'W', 'R', 'F', 'S'][i],
            date: formattedDate
        })
    }

    // Rango de la semana
    const endOfWeek = new Date(lastSunday)
    endOfWeek.setDate(lastSunday.getDate() + 6)
  
    const startDay = lastSunday.toLocaleString('en-US', { day: '2-digit' })
    const endDay = endOfWeek.toLocaleString('en-US', { day: '2-digit' })
    const endMonth = endOfWeek.toLocaleString('en-US', { month: 'short' })
    const endYear = endOfWeek.getFullYear()
    this.currentWeekRange = `${startDay} - ${endDay} ${endMonth}, ${endYear}`
  }

  ngOnInit(): void {
  }

}
