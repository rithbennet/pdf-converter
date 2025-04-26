import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Typography,
    Tooltip
} from '@mui/material';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { ConvertedFile, FileObject } from '../types';

// Generic type that accepts either FileObject or ConvertedFile
type FileType = FileObject | ConvertedFile;

interface SortableItemProps {
    id: string;
    file: FileType;
    index: number;
    onRemove: (index: number) => void;
    isPdf?: boolean;
    onDownload?: (file: FileType) => void;
}

interface FileListProps {
    files: FileType[];
    onRemove: (index: number) => void;
    onReorder: (newFiles: FileType[]) => void;
    isPdf?: boolean;
    onDownload?: (file: FileType) => void;
}

// Sortable item component
const SortableItem = ({ id, file, index, onRemove, isPdf, onDownload }: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const getFileIcon = (file: FileType) => {
        if (isPdf) {
            return <PictureAsPdfIcon color="error" />;
        }

        // For FileObject, check the extension
        if ('type' in file) {
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            if (extension === 'pdf') {
                return <PictureAsPdfIcon color="error" />;
            }
        }

        return <InsertDriveFileIcon color="primary" />;
    };

    return (
        <ListItem
            ref={setNodeRef}
            style={style}
            sx={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            }}
        >
            <ListItemIcon {...attributes} {...listeners}>
                <DragIndicatorIcon />
            </ListItemIcon>
            <ListItemIcon>
                {getFileIcon(file)}
            </ListItemIcon>
            <ListItemText
                primary={file.name}
                secondary={('size' in file && !isPdf) ? `Size: ${(file.size / 1024).toFixed(2)} KB` : ''}
            />
            <ListItemSecondaryAction>
                {isPdf && onDownload && (
                    <Tooltip title="Download file">
                        <IconButton
                            edge="end"
                            aria-label="download"
                            onClick={() => onDownload(file)}
                            sx={{ mr: 1 }}
                        >
                            <CloudDownloadIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                )}
                <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onRemove(index)}
                >
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const FileList = ({ files, onRemove, onReorder, isPdf = false, onDownload }: FileListProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = files.findIndex((file, index) => `${file.name}-${index}` === active.id);
            const newIndex = files.findIndex((file, index) => `${file.name}-${index}` === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reorderedFiles = Array.from(files);
                const [removed] = reorderedFiles.splice(oldIndex, 1);
                reorderedFiles.splice(newIndex, 0, removed);

                onReorder(reorderedFiles);
            }
        }
    };

    // Default empty function for download if not provided
    const handleDownload = onDownload || (() => {
        console.warn('Download handler not provided');
    });

    return (
        <Paper elevation={2} sx={{ mb: 4, maxHeight: '400px', overflow: 'auto' }}>
            {files.length === 0 ? (
                <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                    No files added yet
                </Typography>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <List
                        sx={{ width: '100%', bgcolor: 'background.paper', pt: 0, pb: 0 }}
                    >
                        <SortableContext
                            items={files.map((file, index) => `${file.name}-${index}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            {files.map((file, index) => (
                                <SortableItem
                                    key={`${file.name}-${index}`}
                                    id={`${file.name}-${index}`}
                                    file={file}
                                    index={index}
                                    onRemove={onRemove}
                                    isPdf={isPdf}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </SortableContext>
                    </List>
                </DndContext>
            )}
        </Paper>
    );
};

export default FileList;