package api

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes sets up all the API endpoints
func RegisterRoutes(r *gin.Engine) {
	// API group
	api := r.Group("/api")
	{
		// Upload endpoint
		api.POST("/upload", UploadHandler)

		// Convert endpoint
		api.POST("/convert", ConvertHandler)

		// Merge endpoint
		api.POST("/merge", MergeHandler)

		// Download endpoint
		api.GET("/download/:filename", DownloadHandler)
	}
}
