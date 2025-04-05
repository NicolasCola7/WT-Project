import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({providedIn: 'root'})
export class AlertService  {

  showError(title: string, text: string) {
    Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonText: 'OK'
    });
  }

  showWarning(text: string) {
    Swal.fire({
        title: 'Attenzione!',
        text: text,
        icon: 'warning',
        confirmButtonText: 'OK'
    });
  }

  showSuccess(text: string) {
    Swal.fire({
        title: 'Successo!',
        text: text,
        icon: 'success',
        confirmButtonText: 'OK'
    });
  }

  showQuestion(title: string, text: string, onConfirm: () => void) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Conferma",
        cancelButtonText: "Annulla",
        customClass: {
            confirmButton: "my-confirm-button",
            cancelButton: "my-cancel-button"
        }
    }).then(result => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
  }
}