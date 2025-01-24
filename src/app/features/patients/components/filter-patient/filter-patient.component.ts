import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterPatientService } from '../../services/filter-patient.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  minAge:number|null = null
  maxAge:number|null = null

  private _queryParamsSubscription!: Subscription

  constructor(private _filterService:FilterPatientService, private _formBuilder:FormBuilder, 
    private _router:Router, private _route:ActivatedRoute) { }

  applyFilters(): void {
    // Obtener los valores de los checkboxes desde el FormGroup
    const female = this.gender.get('female')!.value
    const male = this.gender.get('male')!.value

    const queryParams: any = {
      minAge: this.minAge,
      maxAge: this.maxAge,
      page: null
    }
  
    // Solo agregar a la URL si es true
    female? queryParams['female'] = true: queryParams['female'] = null
    male? queryParams['male'] = true: queryParams['male'] = null
  
    // Establecer los parámetros de la URL con los filtros actuales
    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge', // Mantener otros parámetros de la URL
    });
  }

  onClickResetFilters(): void {
    this.gender.patchValue({
      female: null,
      male: null
    })

    this.minAge = null
    this.maxAge = null
  }

  onClickCloseFilter(): void {
    this.applyFilters()
    this._filterService.closeFilter()
  }

  ngOnInit(): void {
    this._queryParamsSubscription = this._route.queryParams.subscribe(params => {

      // Inicializar los checkboxes con los valores de los parámetros
      this.gender.patchValue({
        female: params['female'] === 'true', // Convertir el string a booleano
        male: params['male'] === 'true'
      })

      this.minAge = params['minAge'] ? +params['minAge'] : null
      this.maxAge = params['maxAge'] ? +params['maxAge'] : null
    })
  }

  ngOnDestroy(): void {
    if(this._queryParamsSubscription)
      this._queryParamsSubscription.unsubscribe()
  }
}
