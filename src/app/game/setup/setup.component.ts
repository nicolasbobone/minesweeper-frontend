import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SetupService } from '../../core/services/setup.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './setup.component.html',
})
export class SetupComponent {
  router = inject(Router);
  setupService = inject(SetupService);
  toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  currentDifficulty = signal('EASY');
  setupForm!: FormGroup;
  initialFormValues!: any;
  loading = signal(true);

  ngOnInit() {
    this.setupForm = this.fb.group({
      rows: new FormControl(10, [Validators.required, Validators.min(8), Validators.max(24)]),
      columns: new FormControl(10, [Validators.required, Validators.min(8), Validators.max(24)]),
      minesCount: new FormControl(10, [Validators.required, Validators.min(1), Validators.max(99)]),
    });

    this.initialFormValues = this.setupForm.getRawValue();

    this.setupForm.valueChanges.subscribe((values) => {
      this.updateDifficulty(values.rows, values.columns, values.minesCount);
    });

    this.getSetup();
  }

  getSetup(): void {
    this.setupService.getSetup().subscribe((response) => {
      this.setupForm.patchValue({
        rows: response.data.rows,
        columns: response.data.columns,
        minesCount: response.data.minesCount,
      });
      this.initialFormValues = this.setupForm.getRawValue();
      this.loading.set(false);
    });
  }

  updateDifficulty(rows: number, columns: number, minesCount: number): void {
    const totalCells = rows * columns;
    const minePercentage = (minesCount / totalCells) * 100;

    if (minePercentage >= 15) {
      this.currentDifficulty.set('HARD');
    } else if (minePercentage >= 10) {
      this.currentDifficulty.set('MEDIUM');
    } else {
      this.currentDifficulty.set('EASY');
    }
  }

  setDifficulty(level: string): void {
    let config = { rows: 10, columns: 10, minesCount: 10 };

    switch (level) {
      case 'EASY':
        config = { rows: 8, columns: 8, minesCount: 10 };
        break;
      case 'MEDIUM':
        config = { rows: 16, columns: 16, minesCount: 40 };
        break;
      case 'HARD':
        config = { rows: 24, columns: 24, minesCount: 99 };
        break;
    }

    this.setupForm.patchValue({ ...config });
    this.currentDifficulty.set(level);
  }

  onFormUpdate(): void {
    const { rows, columns, minesCount } = this.setupForm.value;
    const totalCells = rows! * columns!;
    const minePercentage = (minesCount! / totalCells) * 100;
    let calculatedDifficulty = 'EASY';

    if (minePercentage >= 15 && totalCells >= 144) {
      calculatedDifficulty = 'HARD';
    } else if (minePercentage >= 10) {
      calculatedDifficulty = 'MEDIUM';
    }

    this.currentDifficulty.set(calculatedDifficulty);
  }

  isFormChanged(): boolean {
    return JSON.stringify(this.setupForm.getRawValue()) !== JSON.stringify(this.initialFormValues);
  }

  onSubmit(): void {
    if (this.setupForm.valid) {
      this.setupService.update(this.setupForm.value).subscribe(() => {
        this.initialFormValues = this.setupForm.getRawValue();
        this.toastService.setToast({
          type: 'SUCCESS',
          message: 'The configuration has been successfully updated. You will see the changes in the next game.',
        });
      });
    }
  }
}
