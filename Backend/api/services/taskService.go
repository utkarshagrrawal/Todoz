package service

import (
	"context"
	"time"
	"todolist/db"
	model "todolist/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func GetTodayPendingTasks(email string, page int) ([]model.Tasks, error) {
	skip := int64((page - 1) * 20)
	findOptions := options.Find()
	findOptions.SetLimit(20)
	findOptions.SetSkip(skip)
	findOptions.SetSort(bson.D{{Key: "priority", Value: -1}, {Key: "created_at", Value: 1}})
	cur, err := db.TasksCollection.Find(context.TODO(), bson.D{{Key: "user_email", Value: email}, {Key: "is_completed", Value: false}, {Key: "deadline", Value: bson.D{{Key: "$lt", Value: time.Now().AddDate(0, 0, 1)}}}}, findOptions)
	var tasks []model.Tasks
	if err != nil {
		return tasks, err
	}
	defer cur.Close(context.TODO())
	for cur.Next(context.TODO()) {
		var task model.Tasks
		if err := cur.Decode(&task); err != nil {
			return tasks, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func GetNonCompletedTasks(email string, page int) ([]model.Tasks, error) {
	skip := int64((page - 1) * 20)
	findOptions := options.Find()
	findOptions.SetSkip(skip)
	findOptions.SetLimit(20)
	findOptions.SetSort(bson.D{{Key: "created_at", Value: 1}, {Key: "priority", Value: -1}})
	cur, err := db.TasksCollection.Find(context.TODO(), bson.D{{Key: "user_email", Value: email}, {Key: "is_completed", Value: false}}, findOptions)
	if err != nil {
		return []model.Tasks{}, err
	}
	defer cur.Close(context.TODO())
	var tasks []model.Tasks
	for cur.Next(context.TODO()) {
		var task model.Tasks
		if err := cur.Decode(&task); err != nil {
			return tasks, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func GetCompletedTasks(email string, page int) ([]model.Tasks, error) {
	skip := int64((page - 1) * 20)
	findOptions := options.Find()
	findOptions.SetLimit(20)
	findOptions.SetSkip(skip)
	findOptions.SetSort(bson.D{{Key: "created_at", Value: 1}, {Key: "priority", Value: -1}})
	var tasks []model.Tasks
	cur, err := db.TasksCollection.Find(context.TODO(), bson.D{{Key: "user_email", Value: email}, {Key: "is_completed", Value: true}}, findOptions)
	if err != nil {
		return tasks, err
	}
	defer cur.Close(context.TODO())
	for cur.Next(context.TODO()) {
		var task model.Tasks
		if err := cur.Decode(&task); err != nil {
			return tasks, err
		}
		tasks = append(tasks, task)
	}
	return tasks, err
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
	return "Task created successfully"
}

func UpdateTaskDetails(t *model.Tasks) string {
	_, err := db.TasksCollection.UpdateByID(context.TODO(), t.TaskId, bson.M{"$set": bson.M{"is_completed": t.IsCompleted, "priority": t.Priority, "description": t.Description, "deadline": t.Deadline, "status": t.Status}})
	if err != nil {
		return "Error while updating the task"
	}
	return "Task details updated"
}
