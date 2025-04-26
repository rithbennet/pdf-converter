package services

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// ConvertToPDF converts a document to PDF format using LibreOffice
func ConvertToPDF(inputPath, outputDir string) (string, error) {
	// Get the file extension
	fileExt := strings.ToLower(filepath.Ext(inputPath))

	// Check if the file is already a PDF
	if fileExt == ".pdf" {
		// Copy the file to the output directory
		outputPath := filepath.Join(outputDir, filepath.Base(inputPath))
		inputData, err := os.ReadFile(inputPath)
		if err != nil {
			return "", fmt.Errorf("failed to read file: %v", err)
		}

		err = os.WriteFile(outputPath, inputData, 0644)
		if err != nil {
			return "", fmt.Errorf("failed to copy PDF file: %v", err)
		}

		return filepath.Base(outputPath), nil
	}

	// Get the filename without extension
	filenameWithoutExt := strings.TrimSuffix(filepath.Base(inputPath), filepath.Ext(inputPath))
	outputFilename := filenameWithoutExt + ".pdf"

	// Use LibreOffice to convert the document
	cmd := exec.Command(
		"libreoffice",
		"--headless",
		"--convert-to", "pdf",
		"--outdir", outputDir,
		inputPath,
	)

	// Run the command and capture output
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("conversion failed: %v\nOutput: %s", err, string(output))
	}

	// Check if the converted file exists
	outputPath := filepath.Join(outputDir, outputFilename)
	if _, err := os.Stat(outputPath); os.IsNotExist(err) {
		return "", fmt.Errorf("conversion failed: output file not found")
	}

	return outputFilename, nil
}
