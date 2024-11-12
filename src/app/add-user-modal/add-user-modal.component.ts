import { Component, Inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import {CdkDrag} from '@angular/cdk/drag-drop';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, NgIf, CdkDrag, MatButton],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css',
})
export class AddUserModalComponent {
  step: number = 1;
  photoBase64: string | ArrayBuffer | null = null;
  photoPreview: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {console.log(this.step)}

  addUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    numberPhone: new FormControl('', [Validators.required,]),
  });

  nextStep() {
    if (this.step === 1 && this.addUserForm.valid) {
      this.step = 2;
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.readFile(file);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        this.photoBase64 = e.target.result;
        this.photoPreview = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileChange(event: Event): void {
    const inputEvent = event.target as HTMLInputElement
    const file = inputEvent.files?.[0];
    if (file) {
      this.readFile(file);
    }
  };

  removePhoto(): void {
    this.photoPreview = null;
    this.photoBase64 = null;
  };

  onPhoneFocus() {
    const phoneControl = this.addUserForm.get('numberPhone')
    if (phoneControl && !phoneControl?.value?.startsWith('+')) {
      phoneControl.setValue('+' + phoneControl.value)
    }
  }

  onSubmit(): void {
    if (this.addUserForm.valid && this.photoBase64) {
      const userData = this.addUserForm.value;
      this.dialogRef.close({ userData, photoBase64: this.photoBase64 });
    }
  }
}
