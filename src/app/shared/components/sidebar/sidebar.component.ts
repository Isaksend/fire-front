import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Stats, TicketFilters } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<TicketFilters>();

  stats: Stats = { total: 0, new: 0, in_progress: 0, resolved: 0, urgent: 0 };

  activeType = '';
  activeSentiment = '';
  activeSegment = '';
  activeLanguage = '';
  minPriority = 1;

  ticketTypes = [
    { label: 'All Types', value: '' },
    { label: 'Complaint', value: 'Complaint' },
    { label: 'Consultation', value: 'Consultation' },
    { label: 'Claim', value: 'Claim' },
    { label: 'App Failure', value: 'App Failure' },
    { label: 'Data Change', value: 'Data Change' },
    { label: 'Fraud', value: 'Fraudulent Activity' },
    { label: 'Spam', value: 'Spam' },
  ];

  segments = [
    { label: 'All Segments', value: '', color: '#64748b' },
    { label: 'VIP',          value: 'VIP',      color: '#a855f7' },
    { label: 'Priority',     value: 'Priority',  color: '#f59e0b' },
    { label: 'Mass',         value: 'Mass',      color: '#64748b' },
  ];

  sentiments = [
    { label: 'Positive', value: 'Positive', cls: 'pos' },
    { label: 'Neutral',  value: 'Neutral',  cls: 'neu' },
    { label: 'Negative', value: 'Negative', cls: 'neg' },
  ];

  languages = ['RU', 'ENG', 'KZ'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadStats();
    setInterval(() => this.loadStats(), 10000);
  }

  loadStats() {
    this.api.getStats().subscribe(s => this.stats = s);
  }

  setType(value: string) {
    this.activeType = value;
    this.emit();
  }

  setSegment(value: string) {
    this.activeSegment = value;
    this.emit();
  }

  setSentiment(value: string) {
    this.activeSentiment = this.activeSentiment === value ? '' : value;
    this.emit();
  }

  setLanguage(value: string) {
    this.activeLanguage = this.activeLanguage === value ? '' : value;
    this.emit();
  }

  onPriorityChange() {
    this.emit();
  }

  get sliderPercent() {
    return ((this.minPriority - 1) / 9) * 100;
  }

  private emit() {
    this.filtersChange.emit({
      ticket_type: this.activeType || undefined,
      segment: this.activeSegment || undefined,
      sentiment: this.activeSentiment || undefined,
      language: this.activeLanguage || undefined,
      min_priority: this.minPriority > 1 ? this.minPriority : undefined,
    });
  }
}