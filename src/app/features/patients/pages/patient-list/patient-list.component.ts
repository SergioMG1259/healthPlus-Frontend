import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, delay, distinctUntilChanged, filter, Observable, Subscription, switchMap } from 'rxjs';
import { FilterPatientService } from '../../services/filter-patient.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { PatientResponseDTO } from '../../models/PatientResponseDTO';
import { PatientService } from 'src/app/services/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletePatientDialogComponent } from '../../components/delete-patient-dialog/delete-patient-dialog.component';

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
  dataSourceLoading = new MatTableDataSource<PatientResponseDTO>(Array.from({ length: 10 }, () => ({} as PatientResponseDTO)))
  pageIndex: number = 0

  inputSearch: string|null = null
  inputSearchAux: string|null = null // Para identificar que hubo un cambio en el input search
  orderBy: string = 'default'
  orderbyAux: string | null = null // Para identificar que hubo un cambio en el order by
  minAge: number | null = null
  maxAge: number | null = null
  female: boolean = false
  male: boolean = false

  private _queryParamsSubscription!: Subscription
  private _filterResizeSub!: Subscription

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild('filterButton', {read: ElementRef}) private _filterButton!: ElementRef

  constructor(private _router:Router,private _route:ActivatedRoute, private _filterService:FilterPatientService, 
    private _cdr: ChangeDetectorRef, private _breakpointObserver: BreakpointObserver, private _patientService: PatientService,
    private _dialogService: MatDialog) { }

  get isLoadingChange$(): Observable<boolean> {
    return this.isLoadingChange as Observable<boolean>
  }

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

    const queryParams: any = {}

    if (currentPage.pageIndex == 0)
      queryParams['page'] = null
    else
      queryParams['page'] = currentPage.pageIndex + 1
    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
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

  onClickGoToAddPatient(): void {
    this._router.navigate(['/patients/add'])
  }

  onClickGoToPatientDetails(id: number): void {
    this._router.navigate(['/patients/details',id])
  }

  onClickOpenDeletePatientDialog(patientId: number): void {

    const dialogRef = this._dialogService.open(DeletePatientDialogComponent, {
      backdropClass: 'dialog-bg',
      width: '400px',
      data: patientId
    })

    dialogRef.afterClosed().subscribe(e => {
      if(e) {
        this.dataSource.data = this.dataSource.data.filter((patientResponseDTO) => patientResponseDTO.id != patientId)
        this.isLoadingChange.next(true)
        setTimeout(() => {
          this.isLoadingChange.next(false)
          this._router.navigate([], {
            queryParams: {page : this.paginator.pageIndex == 0? null : this.paginator.pageIndex + 1},
            queryParamsHandling: 'merge'
          })
        }, 0)
      }
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit():void {

    let firstLoading = true
    this.dataSource.paginator = this.paginator
    // this.dataSource.data = ELEMENT_DATA
    
    this._queryParamsSubscription = this._route.queryParams.pipe(
      
      switchMap((params) => {
        const inputSearch = params['search']? params['search'] : null
        const orderBy = params['orderby']? params['orderby'] : 'default'
        const minAge = params['minAge'] ? +params['minAge'] : null
        const maxAge = params['maxAge'] ? +params['maxAge'] : null
        const female = params['female'] == 'true'
        const male = params['male'] == 'true'
  
        const hasFilterChanged =
          this.inputSearchAux != inputSearch ||
          this.orderbyAux != orderBy ||
          this.minAge != minAge ||
          this.maxAge != maxAge ||
          this.female != female ||
          this.male != male
  
        const pageFromUrl = params['page'] ? +params['page'] - 1 : 0
        setTimeout( ()=> {
          if (this.paginator.pageIndex != pageFromUrl) {
            // Se guarda el valor de la página actual antes de cambiarlo
            const previousPageIndex = this.paginator.pageIndex
            // this.pageIndex = pageFromUrl
            this.paginator.pageIndex = pageFromUrl
            this.paginator['_emitPageEvent'](previousPageIndex) // Emite eventPage
          }
        },0) 

        if(hasFilterChanged || firstLoading) {
          this.isLoading = true
          this.isLoadingChange.next(true)
  
          this.inputSearch = params['search']? params['search'] : null
          this.inputSearchAux = this.inputSearch
          this.orderBy = params['orderby']? params['orderby'] : 'default'
          this.orderbyAux = this.orderBy
          this.minAge = minAge
          this.maxAge = maxAge
          this.female = female
          this.male = male
          
          return this._patientService.getPatientsWithFilters({searchByNameAndLastName: this.inputSearch, female: this.female,
            male: this.male, minAge: this.minAge, maxAge: this.maxAge, sortBy: this.orderBy})
          // this._cdr.detectChanges()
          // setTimeout(() => {
          //   this.isLoading = false
          //   this.isLoadingChange.next(false)
          // }, 1000)
        }
        return []
      })
    ).pipe(delay(1000)).subscribe(e => {

      if (e) {
        this.dataSource.data = e
        setTimeout(() => {
          this.isLoading = false
          this.isLoadingChange.next(false)
        }, 0)
      }
      firstLoading = false
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