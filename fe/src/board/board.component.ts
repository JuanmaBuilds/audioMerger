// board.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AudioFile {
  name: string;
  path: string;
  x: number;
  y: number;
  duration: number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  audioFiles: AudioFile[] = [];
  private selectedIndex: number | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Dummy data for testing
    this.audioFiles = [
      { name: 'Audio 1', path: 'path/to/audio1.mp3', x: 0, y: 0, duration: 5 },
      { name: 'Audio 2', path: 'path/to/audio2.mp3', x: 0, y: 60, duration: 7 }
    ];
  }

  onDragStart(event: MouseEvent, index: number): void {
    this.selectedIndex = index;
    const audioUnit = event.target as HTMLElement;
    const rect = audioUnit.getBoundingClientRect();
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;

    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.onDragEnd);
  }

  onDragMove = (event: MouseEvent): void => {
    if (this.selectedIndex !== null) {
      const audioFile = this.audioFiles[this.selectedIndex];
      audioFile.x = event.clientX - this.offsetX;
      audioFile.y = event.clientY - this.offsetY;
    }
  };

  onDragEnd = (): void => {
    this.selectedIndex = null;
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.onDragEnd);
  };

  mergeAudio(): void {
    const positions = this.audioFiles.map((audio, index) => ({
      index,
      path: audio.path,
      x: audio.x,
      y: audio.y,
      duration: audio.duration
    }));

    this.http.post('/api/merge', { positions }, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'merged_audio.mp3';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}

//board component change