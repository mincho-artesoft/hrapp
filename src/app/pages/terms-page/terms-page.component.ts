import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; // Optional
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router'; // For back button

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, // Optional
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'] // You can reuse privacy-policy-page.scss
})
export class TermsPageComponent { }
