import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

import { ApiService } from '../../core/services/api.service';
import { Ticket, Manager, Stats, TicketFilters } from '../../core/models/ticket.model';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { TicketCardComponent } from '../../shared/components/ticket-card/ticket-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    HeaderComponent, SidebarComponent, FooterComponent, TicketCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  managers: Manager[] = [];
  stats: Stats = { total: 0, new: 0, in_progress: 0, resolved: 0, urgent: 0 };
  filters: TicketFilters = {};
  lastRunTime = '';
  isProcessing = false;
  isLoading = true;

  private pollSub?: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadManagers();
    this.startPolling();
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  startPolling() {
    this.pollSub = interval(8000).pipe(
      startWith(0),
      switchMap(() => this.api.getTickets(this.filters))
    ).subscribe({
      next: tickets => {
        this.tickets = tickets;
        this.isLoading = false;
        this.api.getStats().subscribe(s => this.stats = s);
      },
      error: () => { this.isLoading = false; }
    });
  }

  loadManagers() {
    this.api.getManagers().subscribe(m => this.managers = m);
  }

  onFiltersChange(filters: TicketFilters) {
    this.filters = filters;
    this.pollSub?.unsubscribe();
    this.isLoading = true;
    this.startPolling();
  }

  triggerProcessing() {
    this.isProcessing = true;
    this.api.triggerProcessing().subscribe({
      next: () => {
        this.lastRunTime = new Date().toLocaleTimeString('en-KZ', { hour: '2-digit', minute: '2-digit' });
        setTimeout(() => this.isProcessing = false, 3000);
      },
      error: () => this.isProcessing = false
    });
  }

  trackById(_: number, t: Ticket) { return t.id; }

  get totalCount(): number { return this.tickets.length; }
}