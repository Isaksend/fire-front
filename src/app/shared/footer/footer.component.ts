import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stats, Manager } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Input() stats: Stats = { total: 0, new: 0, in_progress: 0, resolved: 0, urgent: 0 };
  @Input() managers: Manager[] = [];
  @Input() lastRunTime = '';

  get nextAlmaty(): string {
    const m = this.managers.find(m => m.office?.city?.toLowerCase().includes('almaty'));
    return m ? m.full_name.split(' ').slice(0, 2).join(' ') : '—';
  }

  get nextAstana(): string {
    const m = this.managers.find(m => m.office?.city?.toLowerCase().includes('astana'));
    return m ? m.full_name.split(' ').slice(0, 2).join(' ') : '—';
  }
}