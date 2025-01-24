import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, delay, distinctUntilChanged, filter, Observable, Subscription } from 'rxjs';
import { FilterPatientService } from '../../services/filter-patient.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { PatientResponseDTO } from '../../models/PatientResponseDTO';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  isLoading: boolean = true
  isLoadingChange = new BehaviorSubject<boolean>(true)

  displayedColumns: string[] = ['patientName', 'gender', 'age', 'phone', 'createdAt', 'actions']
  dataSource = new MatTableDataSource<PatientResponseDTO>(Array.from({ length: 10 }, () => ({} as PatientResponseDTO)))
  pageIndex: number = 0

  inputSearch:string|null = null
  orderBy: string = 'default'
  minAge: number | null = null

  private flag:boolean = false
  private _queryParamsSubscription!: Subscription
  private _filterResizeSub!: Subscription

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild('filterButton', {read: ElementRef}) private _filterButton!: ElementRef

  constructor(private _router:Router,private _route:ActivatedRoute, private _filterService:FilterPatientService, 
    private _cdr: ChangeDetectorRef, private _breakpointObserver: BreakpointObserver, private patientService: PatientService) { }

  calculateAge(date: Date): number {
    const birthDate = new Date(date)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff == 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  toggleFilter(): void {
    if (this._filterService.panelOpen == false) {
      this._filterService.openFilter(this._filterButton)
    }else {
      this._filterService.closeFilter()
    }
  }

  onClickSearch(): void {
    this.inputSearch == ''? this.inputSearch = null : this.inputSearch

    const queryParams: any = {
      search: this.inputSearch,
      page: null
    }

    this._router.navigate([], {
        queryParams: queryParams,
        queryParamsHandling: 'merge',
    })
  }

  changePage(currentPage:PageEvent): void {

    this.flag = true
    const queryParams: any = {}

    if (currentPage.pageIndex == 0)
      queryParams['page'] = null
    else
      queryParams['page'] = currentPage.pageIndex + 1

    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    }).finally(() => {
      setTimeout(() => this.flag = false, 0) // Resetea el flag después de actualizar la ruta
    })
  } 

  changeOrderBy(orderBy:string) {
    const queryParams: any = {}
    this.orderBy = orderBy
    if(this.orderBy == "default")
      queryParams['orderby'] = null
    else
      queryParams['orderby'] = this.orderBy
  
    queryParams['page'] = null

    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }

  onClickGoToAddPatient() {
    this._router.navigate(['/patients/add'])
  }

  onClickGoToPatientDetails() {
    this._router.navigate(['/patients/details']);
  }

  ngOnInit(): void {
    this.dataSource.data = ELEMENT_DATA
    this.patientService.getPatients(2).pipe(delay(2000)).subscribe(e => {
      this.dataSource.data = e
      this.isLoading = false
    })
  }

  ngAfterViewInit():void {

    let firstLoading = true
    this.dataSource.paginator = this.paginator
    // this.dataSource.data = ELEMENT_DATA
    this.isLoading = false
    
    this._queryParamsSubscription = this._route.queryParams.pipe(
      // filter(() => !this.flag),// Si el cambio de página viene de los botones, se ignora para evitar un nueva emisión del pageEvent
      // distinctUntilChanged((prev, curr) => {
      //   // Compara los parámetros relevantes (excluyendo 'page')
      //   return (
      //     prev['female'] === curr['female'] &&
      //     prev['male'] === curr['male'] &&
      //     prev['minAge'] === curr['minAge'] &&
      //     prev['maxAge'] === curr['maxAge']
      //     // prev['page'] === curr['page']
      //   )
      // })
    ).subscribe(params => {

      this.inputSearch = params['search']? params['search'] : null
      this.orderBy = params['orderby']? params['orderby'] : 'default'
      const minAge = params['minAge'] ? +params['minAge'] : null

      if(minAge != this.minAge || firstLoading) {
        this.isLoading = true
        console.log("consulta a la api")
        this.isLoadingChange.next(true)
        this.minAge = minAge
        if( minAge!=null ) {
          this.dataSource.data = ELEMENT_DATA2
        } else {
          this.dataSource.data = ELEMENT_DATA
        }
        // this._cdr.detectChanges()
        setTimeout(() => {
          this.isLoading = false
          this.isLoadingChange.next(false)
        }, 1000)
      }

      setTimeout(() => {  
        const pageFromUrl = params['page'] ? +params['page'] - 1 : 0
        if (this.paginator.pageIndex != pageFromUrl) {
          const previousPageIndex = this.paginator.pageIndex
          // this.pageIndex = pageFromUrl
          this.paginator.pageIndex = pageFromUrl
          this.paginator['_emitPageEvent'](previousPageIndex) // Emite eventPage
        }
      }, 0)

      firstLoading = false


      // Se guarda el valor de la página actual antes de cambiarlo
      // const previousPageIndex = this.paginator.pageIndex
      // this.pageIndex = params['page']? +params['page'] - 1 : 0
      // this.paginator.pageIndex = this.pageIndex
      // // Emite eventPage
      // this.paginator['_emitPageEvent'](previousPageIndex)

    })

    this._cdr.detectChanges()
    this._filterResizeSub = this._breakpointObserver.observe(['(max-width: 412px)']).subscribe((state: BreakpointState) => {
      this._filterService.handleScreenResize()
    })
  }

  ngOnDestroy(): void {
    if(this._queryParamsSubscription)
      this._queryParamsSubscription.unsubscribe()
    if(this._filterResizeSub)
      this._filterResizeSub.unsubscribe()
  }

  get isLoadingChange$(): Observable<boolean> {
    return this.isLoadingChange as Observable<boolean>
  }
}

const ELEMENT_DATA: any[] = [
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'}
]

const ELEMENT_DATA2: any[] = [
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'},
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'}
]