// File type definitions
export interface FileObject extends File {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Message type for notifications
export interface Message {
  type: "success" | "error" | "info" | "warning";
  text: string;
}

// Converted file type
export interface ConvertedFile {
  name: string;
  originalName: string;
}
