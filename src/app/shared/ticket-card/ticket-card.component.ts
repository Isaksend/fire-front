import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss']
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;

  get sentimentClass(): string {
    const map: Record<string, string> = {
      Positive: 'sent-pos',
      Neutral:  'sent-neu',
      Negative: 'sent-neg',
    };
    return map[this.ticket?.sentiment] ?? 'sent-neu';
  }

  get sentimentBadge(): string {
    const map: Record<string, string> = {
      Positive: 'badge-pos',
      Neutral:  'badge-neu',
      Negative: 'badge-neg',
    };
    return map[this.ticket?.sentiment] ?? 'badge-neu';
  }

  get segmentBadge(): string {
    const map: Record<string, string> = {
      VIP:      'badge-vip',
      Priority: 'badge-prio',
      Mass:     'badge-mass',
    };
    return map[this.ticket?.segment] ?? 'badge-mass';
  }

  get priorityClass(): string {
    const p = this.ticket?.priority ?? 0;
    if (p >= 8) return 'prio-high';
    if (p >= 5) return 'prio-mid';
    return 'prio-low';
  }

  get priorityColor(): string {
    const p = this.ticket?.priority ?? 0;
    if (p >= 8) return '#ef4444';
    if (p >= 5) return '#f59e0b';
    return '#22c55e';
  }

  get priorityWidth(): string {
    return `${(this.ticket?.priority ?? 0) * 10}%`;
  }

  get statusDotClass(): string {
    const map: Record<string, string> = {
      'New':         'status-new',
      'In Progress': 'status-prog',
      'Resolved':    'status-done',
    };
    return map[this.ticket?.status] ?? 'status-new';
  }

  get statusLabel(): string {
    return this.ticket?.status ?? 'New';
  }

  get ticketId(): string {
    return `TKT-${String(this.ticket?.id ?? 0).padStart(6, '0')}`;
  }

  get managerInitials(): string {
    const name = this.ticket?.assigned_manager?.full_name ?? '';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('');
  }

  get hasAttachments(): boolean {
    return !!(this.ticket?.attachments && this.ticket.attachments.trim() !== '' && this.ticket.attachments !== 'nan');
  }

  get hasAiPlaceholder(): boolean {
    return !this.hasAttachments && !!this.ticket?.ai_attachment_placeholder;
  }

  get geoString(): string {
    const t = this.ticket;
    if (!t) return '';
    const parts: string[] = [];
    if (t.city) parts.push(t.city);
    if (t.client_lat && t.client_lng) {
      parts.push(`${t.client_lat.toFixed(4)}°N, ${t.client_lng.toFixed(4)}°E`);
    }
    if (t.nearest_office) {
      parts.push(`Nearest: ${t.nearest_office.name}`);
    }
    return parts.join(' · ');
  }

  get clientAge(): string {
    if (!this.ticket?.date_of_birth) return '';
    const dob = new Date(this.ticket.date_of_birth);
    const age = new Date().getFullYear() - dob.getFullYear();
    return isNaN(age) ? this.ticket.date_of_birth : String(age);
  }
}