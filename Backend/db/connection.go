package db

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var client *mongo.Client
var UserCollection *mongo.Collection

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return
	}
	mongoDBUrl := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(mongoDBUrl)
	client, err := mongo.Connect(clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	UserCollection = client.Database("todoz").Collection("users")
}
