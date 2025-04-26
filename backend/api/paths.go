package api

import "sync"

var (
	uploadsDir   string
	convertedDir string
	mergedDir    string
	pathsOnce    sync.Once
)

// InitPaths initializes the directory paths used by the API handlers
func InitPaths(uploads, converted, merged string) {
	pathsOnce.Do(func() {
		uploadsDir = uploads
		convertedDir = converted
		mergedDir = merged
	})
}
