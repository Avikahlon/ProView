import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MartsApiService } from '../../services/marts-api.service';

@Component({
  selector: 'app-player-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './player-page.component.html',
  styleUrl: './player-page.component.scss'
})
export class PlayerPageComponent implements OnInit {
  playerName = '';
  summary: any[] = [];
  champions: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private martsApi: MartsApiService
  ) {}

  ngOnInit(): void {
    this.playerName = this.route.snapshot.paramMap.get('player') ?? '';

    this.martsApi.getPlayerSummary(this.playerName).subscribe({
      next: (response) => {
        this.summary = response.rows;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load player summary.';
        this.loading = false;
        console.error(err);
      }
    });

    this.martsApi.getPlayerChampions(this.playerName).subscribe({
      next: (response) => {
        this.champions = response.rows;
      },
      error: (err) => console.error(err)
    });
  }
}