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
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatButton } from '@angular/material/button';
import { AddUserService } from './add-user.service';
import { DialogResult } from './add-user';

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
    private addUserService: AddUserService,
    @Inject(MAT_DIALOG_DATA) public data: DialogResult,
  ) {}

  public addUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    numberPhone: new FormControl('', [Validators.required]),
  });

  public nextStep() {
    if (this.step === 1 && this.addUserForm.valid) {
      this.step = 2;
    }
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.readFile(file);
    }
  }

  private readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        this.photoBase64 = e.target.result;
        this.photoPreview = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  public onFileChange(event: Event): void {
    const inputEvent = event.target as HTMLInputElement;
    const file = inputEvent.files?.[0];
    if (file) {
      this.readFile(file);
    }
  }

  public removePhoto(): void {
    this.photoPreview = null;
    this.photoBase64 = null;
  }

  public onPhoneFocus() {
    const phoneControl = this.addUserForm.get('numberPhone');
    if (phoneControl && !phoneControl?.value?.startsWith('+')) {
      phoneControl.setValue('+' + phoneControl.value);
    }
  }

  public onSubmit(): void {
    if (this.addUserForm.valid && this.photoBase64) {
      const userData = this.addUserForm.value;
      const firstName = userData.firstName ?? '';
      const lastName = userData.lastName ?? '';
      const email = userData.email ?? '';
      const numberPhone = userData.numberPhone ?? '';
      this.addUserService.addNewUser(firstName, lastName, email, numberPhone);
      this.dialogRef.close({ userData, photoBase64: this.photoBase64 });
    }
  }
}
