package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	service "todolist/api/services"
	model "todolist/models"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func GetTasksByUser(w http.ResponseWriter, r *http.Request) {
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
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error while retrieving the page number")
		return
	}
	tasks, err := service.GetTasks(email, num)
	if err == mongo.ErrNoDocuments {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("No tasks created for the user")
		return
	} else if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
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
	msg := service.CreateTask(&task)
	if msg != "Task created succesfully" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(msg)
		return
	}
	json.NewEncoder(w).Encode(msg)
}