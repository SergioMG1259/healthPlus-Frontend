import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-filter-patient',
  templateUrl: './filter-patient.component.html',
  styleUrls: ['./filter-patient.component.css']
})
export class FilterPatientComponent implements OnInit {

  gender = this._formBuilder.group({
    female: false,
    male: false
  })

  constructor(private _formBuilder:FormBuilder) { }

  ngOnInit(): void {
  }

}
