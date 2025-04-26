package api

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// UploadHandler receives files and saves them to a temporary directory
func UploadHandler(c *gin.Context) {
	// Get the uploaded file
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No file uploaded",
		})
		return
	}

	// Generate a unique filename
	filename := filepath.Join(uploadsDir, file.Filename)

	// Save the file
	if err := c.SaveUploadedFile(file, filename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save file",
		})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"message":  fmt.Sprintf("File %s uploaded successfully", file.Filename),
		"filename": file.Filename,
	})
}
