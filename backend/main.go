package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rithbennet/pdf-tool/api"
)

func main() {
	// Set up working directory paths for file storage
	workDir, err := os.Getwd()
	if err != nil {
		log.Fatal("Failed to get working directory:", err)
	}

	uploadsDir := filepath.Join(workDir, "uploads")
	convertedDir := filepath.Join(workDir, "converted")
	mergedDir := filepath.Join(workDir, "merged")

	// Create necessary directories
	for _, dir := range []string{uploadsDir, convertedDir, mergedDir} {
		if err := os.MkdirAll(dir, os.ModePerm); err != nil {
			log.Fatalf("Failed to create directory %s: %v", dir, err)
		}
	}

	// Initialize router
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5175"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length", "Content-Disposition"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Pass the directory paths to the API setup
	api.InitPaths(uploadsDir, convertedDir, mergedDir)

	// Setup routes
	api.RegisterRoutes(r)

	// Start server
	log.Println("Starting server on :8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal("Server error:", err)
	}
}
