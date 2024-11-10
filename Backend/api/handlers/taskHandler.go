package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"
	service "todolist/api/services"
	model "todolist/models"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func GetTodayPendingUserTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	jwtClaims, ok := r.Context().Value(model.ContextKey("payload")).(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while fetching user details")
		return
	}
	email, ok := jwtClaims["email"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while fetching user details")
		return
	}
	values := r.URL.Query()
	page := values.Get("page")
	if page == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while retrieving the page number")
		return
	}
	num, err := strconv.Atoi(page)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while retrieving the page number")
		return
	}
	tasks, err := service.GetTodayPendingTasks(email, num)
	if err == mongo.ErrNoDocuments {
		json.NewEncoder(w).Encode("No tasks created for the user")
		return
	} else if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(err)
		return
	}
	json.NewEncoder(w).Encode(tasks)
}

func GetNonCompletedUserTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	jwtClaims, ok := r.Context().Value(model.ContextKey("payload")).(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while fetching user details")
		return
	}
	email, ok := jwtClaims["email"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while fetching user details")
		return
	}
	values := r.URL.Query()
	page := values.Get("page")
	if page == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while fetching page")
		return
	}
	num, err := strconv.Atoi(page)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while fetching paage")
		return
	}
	tasks, err := service.GetNonCompletedTasks(email, num)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode("No pending tasks")
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while fetching tasks")
		return
	}
	json.NewEncoder(w).Encode(tasks)
}

func GetCompletedUserTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	jwtClaims, ok := r.Context().Value(model.ContextKey("payload")).(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting user details")
		return
	}
	email, ok := jwtClaims["email"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting user details")
		return
	}
	values := r.URL.Query()
	page := values.Get("page")
	if page == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting page details")
		return
	}
	num, err := strconv.Atoi(page)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting page details")
		return
	}
	tasks, err := service.GetCompletedTasks(email, num)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting tasks")
		return
	}
	json.NewEncoder(w).Encode(tasks)
}

func CreateTaskForUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	jwtClaims, ok := r.Context().Value(model.ContextKey("payload")).(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error fetching user details")
		return
	}
	email, ok := jwtClaims["email"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error fetching user details")
		return
	}
	var task model.Tasks
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error retrieving task details")
		return
	}
	task.UserEmail = email
	if task.IsCompleted {
		task.Status = "completed"
	} else if time.Now().Compare(task.Deadline) == 1 {
		task.Status = "overdue"
	} else {
		task.Status = "pending"
	}
	msg := service.CreateTask(&task)
	if msg != "Task created successfully" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(msg)
		return
	}
	json.NewEncoder(w).Encode(msg)
}

func UpdateUserTaskDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	jwtClaims, ok := r.Context().Value(model.ContextKey("payload")).(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error fetching user details")
		return
	}
	email, ok := jwtClaims["email"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error fetching user details")
		return
	}
	var task model.Tasks
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error parsing task details")
		return
	}
	task.UserEmail = email
	if !task.IsValid() {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Task details invalid")
		return
	}
	if task.IsCompleted {
		task.Status = "completed"
	} else if time.Now().Compare(task.Deadline) == 1 {
		task.Status = "overdue"
	} else {
		task.Status = "pending"
	}
	msg := service.UpdateTaskDetails(&task)
	if msg != "Task details updated" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(msg)
		return
	}
	json.NewEncoder(w).Encode(msg)
}

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	values := r.URL.Query()
	taskId := values.Get("id")
	if taskId == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while getting the task id")
		return
	}
	id, err := bson.ObjectIDFromHex(taskId)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error while getting the task id")
		return
	}
	msg := service.DeleteTask(id)
	if msg != "Task deleted successfully" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(msg)
		return
	}
	json.NewEncoder(w).Encode(msg)
}
