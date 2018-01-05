import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterStrings'
})
export class FilterStringPipe implements PipeTransform {
    transform(items: string[], filterStrings: string[]): string[] {
        return items.filter((item) => filterStrings.indexOf(item) === -1);
    }
}
