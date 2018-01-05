import {Component, OnInit, ViewChild} from '@angular/core';
import {VaetasService} from '../services/vaetas';
import {MatPaginator, MatSort} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {getCta, State} from '../reducers/index';
import {TableDataSource} from '../utils/table-data-source';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'va-cta-custom-stats',
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
                    [pageSize]="25"
                    [pageSizeOptions]="[5, 10, 25, 100]">
      </mat-paginator>
    </div>

  `,
  styles: []
})

export class CtaCustomFormStatsComponent implements OnInit {
  displayedColumns: string[] = [];

  data$ = new BehaviorSubject<any[]>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;
  datasource: TableDataSource;

  ngOnInit(): void {
    this.route.params.map(params => params['id'])
      .switchMap((id) => this.store.select((state) => getCta(state, id)))
      .switchMap((cta) => {
        const fields: any[] = JSON.parse(cta.config.fields);
        this.displayedColumns = fields.map((field) => field.name);
        this.displayedColumns.push('submitted_at');
        return this.service.loadCustomCtaStats(cta.id).map((dataArray) =>
          dataArray.map((value) => {
            const data = value.data;
            data['submitted_at'] = value.created_at;
            return data;
          }));
      }).subscribe((data) => {
      this.data$.next(data);
    });

    this.datasource = new TableDataSource(this.data$, this.paginator, this.sort);
  }

  constructor(private service: VaetasService, private route: ActivatedRoute, private store: Store<State>) {

  }
}
