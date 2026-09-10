import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:4000/api';

interface ApiResponse<T> {
  count: number;
  rows: T[];
}

@Injectable({
  providedIn: 'root'
})
export class MartsApiService {
  constructor(private http: HttpClient) {}

  getTeams(): Observable<ApiResponse<{ team: string }>> {
    return this.http.get<ApiResponse<{ team: string }>>(`${BASE_URL}/teams`);
  }

  getTeamRoster(team: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${BASE_URL}/teams/${encodeURIComponent(team)}/roster`);
  }

  getTeamDraftTendencies(team: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${BASE_URL}/teams/${encodeURIComponent(team)}/draft-tendencies`);
  }

  getPlayerSummary(playerName: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${BASE_URL}/players/${encodeURIComponent(playerName)}/summary`);
  }

  getPlayerChampions(playerName: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${BASE_URL}/players/${encodeURIComponent(playerName)}/champions`);
  }
}