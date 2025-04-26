import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { FileObject } from '../types';

interface FileUploaderProps {
    onFilesAdded: (files: FileObject[]) => void;
}

const FileUploader = ({ onFilesAdded }: FileUploaderProps) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesAdded(Array.from(e.dataTransfer.files) as FileObject[]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesAdded(Array.from(e.target.files) as FileObject[]);
            // Reset the input value so the same file can be uploaded again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                mb: 3,
                border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
                backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
            }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                multiple
                onChange={handleFileInput}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '150px',
                }}
            >
                <UploadFileIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" component="div" gutterBottom>
                    Drag & Drop Files Here
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    or
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleButtonClick}
                    sx={{ mt: 2 }}
                >
                    Browse Files
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Supported formats: DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP, PDF
                </Typography>
            </Box>
        </Paper>
    );
};

export default FileUploader;