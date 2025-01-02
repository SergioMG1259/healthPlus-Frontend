import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterPatientService } from '../../services/filter-patient.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  displayedColumns: string[] = ['patientName', 'gender', 'age', 'phone', 'createdAt', 'actions']
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA)
  pageIndex: number = 0
  inputSearch:string|null = null
  orderBy: string = 'default'

  private flag:boolean = false
  private _queryParamsSubscription!: Subscription
  private _filterResizeSub!: Subscription

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild('filterButton', {read: ElementRef}) private _filterButton!: ElementRef

  constructor(private _router:Router,private _route:ActivatedRoute, private _filterService:FilterPatientService, 
    private _cdr: ChangeDetectorRef, private _breakpointObserver: BreakpointObserver) { }

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

  ngOnInit(): void {
  }

  ngAfterViewInit():void {
    this.dataSource.paginator = this.paginator

    this._queryParamsSubscription = this._route.queryParams.subscribe(params => {

      if (this.flag) {
        return // Si el cambio de página viene de los botones, se ignora para evitar un nueva emisión del pageEvent
      }

      this.inputSearch = params['search']? params['search'] : null
      this.orderBy = params['orderby']? params['orderby'] : 'default'

      if (this.paginator) {
        // Se guarda el valor de la página actual antes de cambiarlo
        const previousPageIndex = this.paginator.pageIndex
        this.pageIndex = params['page']? +params['page'] - 1 : 0
        this.paginator.pageIndex = this.pageIndex
        // Emite eventPage
        this.paginator['_emitPageEvent'](previousPageIndex)
        // const pageEvent: PageEvent = {
        //   previousPageIndex: previousPageIndex,
        //   pageIndex: this.pageIndex,
        //   pageSize: this.paginator.pageSize,
        //   length: this.paginator.length
        // };
      
        // Emitir el evento con el objeto que contiene todas las propiedades necesarias
        // this.paginator.page.emit(pageEvent)
      }
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
  {patientName: 'Alfreds Futterkiste', gender: 'Male', age: 18, phone: 939192382, createdAt: '10/31/2024'}
]