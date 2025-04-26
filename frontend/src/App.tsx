import { useState } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import FileUploader from './components/FileUploader'
import FileList from './components/FileList'
import ActionPanel from './components/ActionPanel'
import { FileObject, Message, ConvertedFile } from './types'

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
    const [files, setFiles] = useState<FileObject[]>([]);
    const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);

    const handleFilesAdded = (newFiles: FileObject[]) => {
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleFileRemove = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleConvertedFileRemove = (index: number) => {
        setConvertedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleFilesReorder = (newOrderFiles: FileObject[] | any[]) => {
        setFiles(newOrderFiles as FileObject[]);
    };

    const handleConvertedFilesReorder = (newOrderFiles: ConvertedFile[] | any[]) => {
        setConvertedFiles(newOrderFiles as ConvertedFile[]);
    };

    // Function to download individual PDF files
    const handleDownloadFile = (file: FileObject | ConvertedFile) => {
        try {
            window.open(`${API_BASE_URL}/download/${file.name}`, '_blank');
        } catch (error) {
            setMessage({ type: 'error', text: `Error downloading file: ${(error as Error).message}` });
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" className="app-container">
                <h1>PDF Conversion and Merger Tool</h1>

                <FileUploader onFilesAdded={handleFilesAdded} />

                {files.length > 0 && (
                    <>
                        <h2>Uploaded Files</h2>
                        <FileList
                            files={files}
                            onRemove={handleFileRemove}
                            onReorder={handleFilesReorder}
                        />
                    </>
                )}

                <ActionPanel
                    files={files}
                    convertedFiles={convertedFiles}
                    setConvertedFiles={setConvertedFiles}
                    loading={loading}
                    setLoading={setLoading}
                    setMessage={setMessage}
                />

                {convertedFiles.length > 0 && (
                    <>
                        <h2>Converted PDFs</h2>
                        <FileList
                            files={convertedFiles}
                            onRemove={handleConvertedFileRemove}
                            onReorder={handleConvertedFilesReorder}
                            isPdf={true}
                            onDownload={handleDownloadFile}
                        />
                    </>
                )}

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </Container>
        </ThemeProvider>
    );
}

export default App