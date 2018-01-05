import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatPaginator, MatSort} from '@angular/material';
import {TableDataSource} from '../utils/table-data-source';
import {VaetasService} from '../services/vaetas';

@Component({
  selector: 'va-cta-stats',
  template: `
    <div class="table-container" fxLayout="column">
      <mat-table [dataSource]="datasource" matSort>

        <ng-container *ngFor="let column of displayedColumns" [cdkColumnDef]="column">
          <mat-header-cell *cdkHeaderCellDef mat-sort-header> {{column}}</mat-header-cell>
          <mat-cell *cdkCellDef="let row"> {{row[column]}}</mat-cell>
        </ng-container>

        <mat-header-row *cdkHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *cdkRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>

      <mat-paginator #paginator
                    [length]="data$.value.length"
                    [pageIndex]="0"
                    [pageSize]="5"
                    [pageSizeOptions]="[5, 10, 25, 100]">
      </mat-paginator>
    </div>
  `,
  styles: [``]
})

export class CtaStatsComponent implements OnInit {

  displayedColumns: string[] = ['timestamp', 'country', 'city', 'latitude', 'longitude'];

  @Input() namespace: string;
  @Input() email_id: number;
  data$ = new BehaviorSubject<any[]>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  datasource: TableDataSource;
  constructor(private service: VaetasService) {
  }

  ngOnInit() {
    this.service.getCtaStats(this.email_id, this.namespace).subscribe((dataArray) => {
      const sourceData = dataArray.map((value) => {
        const data = {};
        data['timestamp'] = value.timestamp;
        data['country'] = value.location.country;
        data['city'] = value.location.city;
        data['longitude']  = value.location.longitude;
        data['latitude'] = value.location.latitude;
        return data;
      });
      console.log(sourceData);
      this.data$.next(sourceData);
    });
    this.datasource = new TableDataSource(this.data$, this.paginator, this.sort);
  }
}
