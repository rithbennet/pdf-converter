package services

import (
	"github.com/pdfcpu/pdfcpu/pkg/api"
)

// MergePDFs merges multiple PDF files into a single PDF
func MergePDFs(inputPaths []string, outputPath string) error {
	// Get the default configuration
	config := api.LoadConfiguration()

	// Merge the PDFs
	// The dividerPage parameter (false) indicates that we don't want to add a blank page between merged PDFs
	return api.MergeAppendFile(inputPaths, outputPath, false, config)
}
