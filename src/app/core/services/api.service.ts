import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, Manager, Office, Stats, TicketFilters } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api';

  constructor(private http: HttpClient) {}

  // ── Tickets ────────────────────────────────────────────────────────────────
  getTickets(filters?: TicketFilters): Observable<Ticket[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          params = params.set(k, String(v));
        }
      });
    }
    return this.http.get<Ticket[]>(`${this.base}/tickets`, { params });
  }

  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.base}/tickets/${id}`);
  }

  updateTicketStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.base}/tickets/${id}/status`, null, {
      params: { status }
    });
  }

  // ── Upload ─────────────────────────────────────────────────────────────────
  uploadTickets(file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post(`${this.base}/upload/tickets`, form);
  }

  uploadManagers(file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post(`${this.base}/upload/managers`, form);
  }

  uploadOffices(file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post(`${this.base}/upload/offices`, form);
  }

  triggerProcessing(): Observable<any> {
    return this.http.post(`${this.base}/process`, {});
  }

  // ── Managers & Offices ────────────────────────────────────────────────────
  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.base}/managers`);
  }

  getOffices(): Observable<Office[]> {
    return this.http.get<Office[]>(`${this.base}/offices`);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.base}/stats`);
  }
}