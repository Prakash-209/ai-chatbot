export interface Lecture {
  id: string;
  title: string;
  transcript: string;
  uploadDate: string;
  duration: number; // in minutes
  fileSize: number; // in bytes
  fileType: string;
}