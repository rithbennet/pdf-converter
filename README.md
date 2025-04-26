# PDF Conversion and Merger Tool

A free, self-hosted web application for converting Office documents to PDF and merging PDF files.

## Features

- Convert various Office documents (docx, xlsx, pptx, etc.) to PDF
- Merge multiple PDF files into a single document
- Reorder pages with drag-and-drop functionality
- Preview documents before and after conversion
- Simple, intuitive user interface

## Technology Stack

### Backend

- Go with Gin web framework
- LibreOffice for document conversion
- pdfcpu for PDF manipulation

### Frontend

- React with Vite
- Material UI for components
- Axios for API communication
- react-beautiful-dnd for drag-and-drop ordering

## Getting Started

### Prerequisites

- Go 1.16 or higher
- Node.js 14 or higher
- LibreOffice (for document conversion)

### Installing LibreOffice

LibreOffice is required for converting office documents to PDF format. If you don't have it installed already, follow these instructions:

**macOS:**

```bash
brew install --cask libreoffice
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get install libreoffice-common libreoffice-writer
```

**Windows:**

1. Download from [LibreOffice official website](https://www.libreoffice.org/download/download/)
2. Run the installer and follow the installation wizard

### Installation

1. Clone this repository

```bash
git clone https://github.com/rithbennet/pdf-tool.git
cd pdf-tool
```

2. Install backend dependencies

```bash
cd backend
go mod download
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### Running the application

Use the provided start script:

```bash
./scripts/start.sh
```

This will start both the backend server and the frontend development server.

## Usage

1. Open your browser and go to http://localhost:5173
2. Upload office documents or PDF files using the drag-and-drop area
3. Click "Convert to PDF" to convert any office documents
4. Reorder PDFs by dragging and dropping them in the list
5. Click "Merge PDFs" to combine multiple PDFs into a single document
6. Click "Download Merged PDF" to download the final merged document

## TODO NEXT?

1. Refine the page even more
2. Find out better pdf conversion methods

## License

This project is licensed under the MIT License - see the LICENSE file for details.
