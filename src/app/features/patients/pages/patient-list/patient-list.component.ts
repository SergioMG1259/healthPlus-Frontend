import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  displayedColumns: string[] = ['patientName', 'gender', 'age', 'phone', 'createdAt', 'actions']
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA)
  pageIndex: number = 0

  private _queryParamsSubscription!: Subscription

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private router:Router,private route:ActivatedRoute) { }

  changePage(currentPage:PageEvent): void {

    const queryParams: any = {}

    if (currentPage.pageIndex == 0)
      queryParams['page'] = null
    else
      queryParams['page'] = currentPage.pageIndex + 1

    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    })
  } 

  ngOnInit(): void {
    this._queryParamsSubscription = this.route.queryParams.subscribe(params => {

      this.pageIndex = params['page']? +params['page'] - 1 : 0
    })
  }

  ngAfterViewInit():void {
    this.dataSource.paginator = this.paginator
  }

  ngOnDestroy(): void {
    if(this._queryParamsSubscription)
      this._queryParamsSubscription.unsubscribe()
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
];