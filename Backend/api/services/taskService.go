package service

import (
	"context"
	"time"
	"todolist/db"
	model "todolist/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func GetTasks(email string, page int) ([]model.Tasks, error) {
	skip := int64((page - 1) * 20)
	findOptions := options.Find()
	findOptions.SetLimit(20)
	findOptions.SetSkip(skip)
	findOptions.SetSort(bson.D{{Key: "created_at", Value: 1}})
	cur, err := db.TasksCollection.Find(context.TODO(), bson.D{{Key: "user_email", Value: email}}, findOptions)
	var tasks []model.Tasks
	if err != nil {
		return tasks, err
	}
	defer cur.Close(context.TODO())
	for cur.Next(context.TODO()) {
		var task model.Tasks
		err := cur.Decode(&task)
		if err != nil {
			return tasks, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func CreateTask(t *model.Tasks) string {
	if !t.IsValid() {
		return "Invalid payload"
	}
	t.CreatedAt = time.Now()
	_, err := db.TasksCollection.InsertOne(context.TODO(), t)
	if err != nil {
		return "Error while creating task"
	}
	return "Task created succesfully"
}
