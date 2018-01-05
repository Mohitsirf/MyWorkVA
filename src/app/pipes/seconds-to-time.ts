import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'secondsToTime'
})
export class SecondsToTimePipe implements PipeTransform {

  transform(secondsNum) {
    let hours: number|string = Math.floor(secondsNum / 3600);
    let minutes: number|string = Math.floor((secondsNum - (hours * 3600)) / 60);
    let seconds: number|string = secondsNum - (hours * 3600) - (minutes * 60);

    hours = hours < 10 ? 0 + '' + hours : hours;
    minutes = minutes < 10 ? 0 + '' + minutes : minutes;
    seconds = seconds < 10 ? 0 + '' + seconds : seconds;
    return hours + ':' + minutes + ':' + seconds;
  }
}
