import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './instructions.component.html',
})
export class InstructionsComponent implements OnInit {
  ngOnInit(): void {}
}
