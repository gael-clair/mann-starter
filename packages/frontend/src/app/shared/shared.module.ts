import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Shared module for shared components, directives, pipes
 * Exports:
 * - Common module
 * - Reactive forms module
 * - Material modules
 */
@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [CommonModule, ReactiveFormsModule],
})
export class SharedModule {}
