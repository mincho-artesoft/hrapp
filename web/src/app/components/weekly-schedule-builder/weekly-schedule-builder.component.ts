import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Block { id: number; day: number; title: string; start: string; end: string; }

/** A temporary weekly draft: no account, persistence, calendar writes or requests. */
@Component({
  selector: 'cc-weekly-schedule-builder', standalone: true, imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekly-schedule-builder.component.html',
  styleUrl: './weekly-schedule-builder.component.scss',
})
export class WeeklyScheduleBuilderComponent {
  readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  private nextId = 2;
  readonly blocks = signal<Block[]>([{ id: 1, day: 0, title: 'Example focus block', start: '09:00', end: '10:00' }]);
  readonly notice = signal('');
  readonly valid = computed(() => this.blocks().filter(b => this.isValid(b)).sort((a, b) => a.day - b.day || a.start.localeCompare(b.start)));
  readonly warnings = computed(() => {
    const result: string[] = [];
    for (const b of this.blocks()) if (!this.isValid(b)) result.push(`Check block ${b.id}: add a title and an end time later than its start. Split overnight work across two days.`);
    const rows = this.valid();
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      const a = rows[i], b = rows[j];
      if (a.day === b.day && a.start < b.end && b.start < a.end) result.push(`${this.days[a.day]}: “${a.title}” overlaps “${b.title}”.`);
    }
    return result;
  });
  readonly totalMinutes = computed(() => this.valid().reduce((sum, b) => sum + this.minutes(b.end) - this.minutes(b.start), 0));
  readonly summary = computed(() => `${Math.floor(this.totalMinutes() / 60)}h ${this.totalMinutes() % 60}m of blocks (overlaps counted separately)`);
  readonly planText = computed(() => this.days.map((day, i) => {
    const rows = this.valid().filter(b => b.day === i);
    return `${day}\n${rows.length ? rows.map(b => `${b.start}–${b.end} ${b.title}`).join('\n') : 'No blocks'}`;
  }).join('\n\n'));

  add(): void {
    this.blocks.update(rows => [...rows, { id: this.nextId++, day: 0, title: '', start: '09:00', end: '10:00' }]);
    this.notice.set('Block added. Choose its day, title and times.');
  }
  update(id: number, field: 'title' | 'start' | 'end', value: string): void {
    this.blocks.update(rows => rows.map(b => b.id === id ? { ...b, [field]: value } : b));
    this.notice.set('');
  }
  setDay(id: number, value: string | number): void {
    const day = Number(value);
    if (Number.isInteger(day) && day >= 0 && day < 7) this.blocks.update(rows => rows.map(b => b.id === id ? { ...b, day } : b));
  }
  remove(id: number): void { this.blocks.update(rows => rows.filter(b => b.id !== id)); this.notice.set('Block removed.'); }
  forDay(day: number): Block[] { return this.valid().filter(b => b.day === day); }
  private minutes(time: string): number { const [h, m] = time.split(':').map(Number); return h * 60 + m; }
  private isValid(b: Block): boolean {
    const time = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return b.title.trim().length > 0 && time.test(b.start) && time.test(b.end) && b.end > b.start;
  }
}
