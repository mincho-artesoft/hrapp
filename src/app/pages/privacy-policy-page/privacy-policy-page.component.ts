import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // If you use ngIf/ngFor, not strictly needed for static text
import { MatCardModule } from '@angular/material/card'; // Optional, for styling
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router'; // For back button

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, // Optional
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './privacy-policy-page.component.html',
  styleUrls: ['./privacy-policy-page.component.scss']
})
export class PrivacyPolicyPageComponent { }
