import { useState } from 'react';
import {
    Paper,
    Button,
    Box,
    Typography,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { FileObject, Message } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

interface ConvertedFile {
    name: string;
    originalName: string;
}

interface ActionPanelProps {
    files: FileObject[];
    convertedFiles: ConvertedFile[];
    setConvertedFiles: React.Dispatch<React.SetStateAction<ConvertedFile[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<Message | null>>;
}

interface UploadResponse {
    filename: string;
    success: boolean;
}

interface ConvertResponse {
    filename: string;
    success: boolean;
}

interface MergeResponse {
    filename: string;
    success: boolean;
}

const ActionPanel = ({
    files,
    convertedFiles,
    setConvertedFiles,
    loading,
    setLoading,
    setMessage
}: ActionPanelProps) => {
    const [mergedPdf, setMergedPdf] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [currentOperation, setCurrentOperation] = useState<string>('');

    // Function to upload a file
    const uploadFile = async (file: FileObject): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Error uploading file: ${(error as Error).message}`);
        }
    };

    // Function to convert files to PDF
    const convertFiles = async (): Promise<void> => {
        if (files.length === 0) {
            setMessage({ type: 'error', text: 'Please add files to convert' });
            return;
        }

        setLoading(true);
        setMessage(null);
        setCurrentOperation('Converting files to PDF');
        const newConvertedFiles: ConvertedFile[] = [];
        const totalFiles = files.length;

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Update progress
                setProgress(Math.round((i / totalFiles) * 100));
                setCurrentOperation(`Converting ${file.name} (${i + 1}/${totalFiles})`);

                try {
                    // First upload the file
                    const uploadResponse = await uploadFile(file);

                    // Then convert it to PDF
                    const convertResponse = await fetch(`${API_BASE_URL}/convert`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ filename: uploadResponse.filename }),
                    });

                    if (!convertResponse.ok) {
                        const errorData = await convertResponse.json().catch(() => ({}));
                        throw new Error(errorData.error || `Conversion failed: ${convertResponse.statusText}`);
                    }

                    const convertResult: ConvertResponse = await convertResponse.json();
                    newConvertedFiles.push({
                        name: convertResult.filename,
                        originalName: file.name,
                    });
                } catch (error) {
                    // Continue with the next file even if one fails
                    setMessage({
                        type: 'error',
                        text: `Error with ${file.name}: ${(error as Error).message}. Continuing with other files...`
                    });
                    // Wait a moment to ensure the user sees the error message
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }

            if (newConvertedFiles.length > 0) {
                setConvertedFiles((prev) => [...prev, ...newConvertedFiles]);
                setMessage({
                    type: 'success',
                    text: `Converted ${newConvertedFiles.length} out of ${files.length} files successfully`
                });
            } else {
                setMessage({ type: 'error', text: 'Failed to convert any files' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: (error as Error).message });
        } finally {
            setProgress(0);
            setLoading(false);
            setCurrentOperation('');
        }
    };

    // Function to merge PDFs
    const mergePdfs = async (): Promise<void> => {
        if (convertedFiles.length < 2) {
            setMessage({
                type: 'error',
                text: 'Please convert at least two files to merge them'
            });
            return;
        }

        setLoading(true);
        setMessage(null);
        setCurrentOperation('Merging PDF files');
        setProgress(10); // Start progress indicator

        try {
            const filenames = convertedFiles.map(file => file.name);

            setProgress(30); // Update progress

            const mergeResponse = await fetch(`${API_BASE_URL}/merge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ files: filenames }),
            });

            setProgress(70); // Update progress

            if (!mergeResponse.ok) {
                const errorData = await mergeResponse.json().catch(() => ({}));
                throw new Error(errorData.error || `Merge failed: ${mergeResponse.statusText}`);
            }

            setProgress(90); // Almost done

            const mergeResult: MergeResponse = await mergeResponse.json();
            setMergedPdf(mergeResult.filename);
            setMessage({ type: 'success', text: 'PDFs merged successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: (error as Error).message });
        } finally {
            setProgress(100); // Complete
            setTimeout(() => {
                setProgress(0);
                setLoading(false);
                setCurrentOperation('');
            }, 500);
        }
    };

    // Function to download a file
    const downloadFile = async (filename: string): Promise<void> => {
        try {
            window.open(`${API_BASE_URL}/download/${filename}`, '_blank');
        } catch (error) {
            setMessage({ type: 'error', text: `Error downloading file: ${(error as Error).message}` });
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={loading ? null : <PictureAsPdfIcon />}
                    onClick={convertFiles}
                    disabled={loading || files.length === 0}
                    sx={{ flex: 1 }}
                >
                    {loading && currentOperation === 'Converting files to PDF'
                        ? <CircularProgress size={24} color="inherit" />
                        : 'Convert to PDF'
                    }
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={loading ? null : <MergeTypeIcon />}
                    onClick={mergePdfs}
                    disabled={loading || convertedFiles.length < 2}
                    sx={{ flex: 1 }}
                >
                    {loading && currentOperation === 'Merging PDF files'
                        ? <CircularProgress size={24} color="inherit" />
                        : 'Merge PDFs'
                    }
                </Button>

                {mergedPdf && (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FileDownloadIcon />}
                        onClick={() => downloadFile(mergedPdf)}
                        disabled={loading}
                        sx={{ flex: 1 }}
                    >
                        Download Merged PDF
                    </Button>
                )}
            </Box>

            {loading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {currentOperation}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}
        </Paper>
    );
};

export default ActionPanel;