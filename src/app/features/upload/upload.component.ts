import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { HeaderComponent } from '../../shared/components/header/header.component';

interface UploadSlot {
  key: 'tickets' | 'managers' | 'offices';
  label: string;
  icon: string;
  file: File | null;
  status: 'idle' | 'uploading' | 'done' | 'error';
  message: string;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  slots: UploadSlot[] = [
    { key: 'offices',  label: 'Offices CSV',  icon: '🏢', file: null, status: 'idle', message: '' },
    { key: 'managers', label: 'Managers CSV', icon: '👥', file: null, status: 'idle', message: '' },
    { key: 'tickets',  label: 'Tickets CSV',  icon: '🎫', file: null, status: 'idle', message: '' },
  ];

  constructor(private api: ApiService) {}

  onFileDrop(event: DragEvent, slot: UploadSlot) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) { slot.file = file; }
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }

  onFileSelect(event: Event, slot: UploadSlot) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) { slot.file = input.files[0]; }
  }

  upload(slot: UploadSlot) {
    if (!slot.file) return;
    slot.status = 'uploading';

    const obs = slot.key === 'tickets'  ? this.api.uploadTickets(slot.file)
              : slot.key === 'managers' ? this.api.uploadManagers(slot.file)
              : this.api.uploadOffices(slot.file);

    obs.subscribe({
      next: (res) => {
        slot.status = 'done';
        slot.message = `✓ ${res.message ?? 'Uploaded successfully'}`;
      },
      error: () => {
        slot.status = 'error';
        slot.message = '✗ Upload failed. Check backend connection.';
      }
    });
  }

  clearSlot(slot: UploadSlot) {
    slot.file = null;
    slot.status = 'idle';
    slot.message = '';
  }
}