import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MartsApiService } from '../../services/marts-api.service';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.scss'
})
export class TeamPageComponent implements OnInit {
  teamName = '';
  roster: any[] = [];
  draftTendencies: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private martsApi: MartsApiService
  ) {}

  ngOnInit(): void {
    this.teamName = this.route.snapshot.paramMap.get('team') ?? '';

    this.martsApi.getTeamRoster(this.teamName).subscribe({
      next: (response) => {
        this.roster = response.rows;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load roster.';
        this.loading = false;
        console.error(err);
      }
    });

    this.martsApi.getTeamDraftTendencies(this.teamName).subscribe({
      next: (response) => {
        this.draftTendencies = response.rows;
      },
      error: (err) => console.error(err)
    });
  }
}