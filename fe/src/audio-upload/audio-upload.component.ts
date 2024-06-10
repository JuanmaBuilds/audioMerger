import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-audio-upload',
  templateUrl: './audio-upload.component.html',
  styleUrls: ['./audio-upload.component.css']
})
export class AudioUploadComponent {
  selectedFiles: FileList | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  onUpload(): void {
    if (this.selectedFiles) {
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }
      this.http.post('http://localhost:3000/upload', formData).subscribe(response => {
        console.log('Upload successful', response);
      }, error => {
        console.error('Upload failed', error);
      });
    }
  }
}
