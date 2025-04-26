package api

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/rithbennet/pdf-tool/services"
)

type ConvertRequest struct {
	Filename string `json:"filename" binding:"required"`
}

// ConvertHandler converts a document to PDF using LibreOffice
func ConvertHandler(c *gin.Context) {
	var req ConvertRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Check if the file exists
	inputPath := filepath.Join(uploadsDir, req.Filename)
	if _, err := os.Stat(inputPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Convert the document to PDF
	pdfFilename, err := services.ConvertToPDF(inputPath, convertedDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to convert document: " + err.Error(),
		})
		return
	}

	// Return success response with the PDF filename
	c.JSON(http.StatusOK, gin.H{
		"message":  "Document converted successfully",
		"filename": pdfFilename,
	})
}
