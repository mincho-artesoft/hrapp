import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Optional

@Component({
  selector: 'app-terms-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule // Optional
  ],
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['../privacy-policy-dialog/privacy-policy-dialog.component.scss'] // Can reuse privacy policy styles
  // Or create its own SCSS if needed: styleUrls: ['./terms-dialog.component.scss']
})
export class TermsDialogComponent { }
