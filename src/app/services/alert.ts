import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AlertService {
  constructor(private snackBar: MatSnackBar) {
  }

  success(message: string, duration = 3500) {
    this.snackBar.open(message, '', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      extraClasses: ['alert', 'alert-success']
    });
  }

  error(message: string, duration = 3500) {
    this.snackBar.open(message, '', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      extraClasses: ['alert', 'alert-error']
    });
  }
}
