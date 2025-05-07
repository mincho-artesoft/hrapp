import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog & MatDialogModule

// Import the dialog components
import { PrivacyPolicyDialogComponent } from '../dialogs/privacy-policy-dialog/privacy-policy-dialog.component';
import { TermsDialogComponent } from '../dialogs/terms-dialog/terms-dialog.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule // Add MatDialogModule here
    // Dialog components don't strictly need to be imported here if only opened via service
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number = new Date().getFullYear();

  // Inject MatDialog service
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  // Method to open Privacy Policy Dialog
  openPrivacyPolicy(): void {
    this.dialog.open(PrivacyPolicyDialogComponent, {
      width: '80vw', // Responsive width
      maxWidth: '650px', // Max width on larger screens
      autoFocus: false, // Prevent autofocus on first element
      maxHeight: '85vh' // Ensure it doesn't take full screen height
    });
  }

  // Method to open Terms of Service Dialog
  openTerms(): void {
    this.dialog.open(TermsDialogComponent, {
      width: '80vw',
      maxWidth: '650px',
      autoFocus: false,
      maxHeight: '85vh'
    });
  }
}
