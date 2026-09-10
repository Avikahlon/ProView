import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MartsApiService } from '../../services/marts-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  teams: string[] = [];
  loading = true;
  error: string | null = null;

  constructor(private martsApi: MartsApiService) {}

  ngOnInit(): void {
    this.martsApi.getTeams().subscribe({
      next: (response) => {
        this.teams = response.rows.map(row => row.team);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load teams. Is the backend running?';
        this.loading = false;
        console.error(err);
      }
    });
  }
}