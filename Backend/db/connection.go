package db

import (
	"log"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var UserCollection *mongo.Collection
var TasksCollection *mongo.Collection
var ContactCollection *mongo.Collection

func init() {
	mongoDBUrl := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(mongoDBUrl)
	client, err := mongo.Connect(clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	UserCollection = client.Database("todoz").Collection("users")
	TasksCollection = client.Database("todoz").Collection("tasks")
	ContactCollection = client.Database("todoz").Collection("contacts")
}
