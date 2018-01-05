import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MatPaginator, MatSort} from '@angular/material';

export class TableDataSource extends DataSource<any> {

  constructor(private data$: BehaviorSubject<any[]>, private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  connect(): Observable<any[]> {
    return this.data$.merge(this.paginator.page, this.sort.sortChange).map(() => {
      const data = this.getSortedData();
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  disconnect() {
  }

  private getSortedData(): any[] {
    const data = this.data$.value.slice();
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const propertyA: number | string = a[this.sort.active];
      const propertyB: number | string = b[this.sort.active];

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
