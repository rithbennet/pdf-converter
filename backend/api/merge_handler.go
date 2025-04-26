package api

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/rithbennet/pdf-tool/services"
)

type MergeRequest struct {
	Files []string `json:"files" binding:"required"`
}

// MergeHandler merges multiple PDF files into a single PDF
func MergeHandler(c *gin.Context) {
	var req MergeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if len(req.Files) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "At least two PDF files are required for merging"})
		return
	}

	// Prepare file paths
	inputPaths := make([]string, len(req.Files))
	for i, filename := range req.Files {
		inputPaths[i] = filepath.Join(convertedDir, filename)
		// Check if each file exists
		if _, err := os.Stat(inputPaths[i]); os.IsNotExist(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "File not found: " + filename})
			return
		}
	}

	// Merge PDFs
	outputFilename := "merged_" + filepath.Base(req.Files[0])
	outputPath := filepath.Join(mergedDir, outputFilename)

	if err := services.MergePDFs(inputPaths, outputPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to merge PDFs: " + err.Error(),
		})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"message":  "PDFs merged successfully",
		"filename": outputFilename,
	})
}
