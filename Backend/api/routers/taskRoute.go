package routes

import (
	"net/http"
	handler "todolist/api/handlers"
	"todolist/api/middleware"

	"github.com/gorilla/mux"
)

func TaskRouter() *mux.Router {
	r := mux.NewRouter()

	r.Handle("/today", middleware.VerifyToken(http.HandlerFunc(handler.GetTodayPendingUserTasks))).Methods("GET", "OPTIONS")
	r.Handle("/non-completed", middleware.VerifyToken(http.HandlerFunc(handler.GetNonCompletedUserTasks))).Methods("GET", "OPTIONS")
	r.Handle("/completed", middleware.VerifyToken(http.HandlerFunc(handler.GetCompletedUserTasks))).Methods("GET", "OPTIONS")
	r.Handle("/create", middleware.VerifyToken(http.HandlerFunc(handler.CreateTaskForUser))).Methods("POST", "OPTIONS")
	r.Handle("/update", middleware.VerifyToken(http.HandlerFunc(handler.UpdateUserTaskDetails))).Methods("PUT", "OPTIONS")
	r.Handle("/delete", middleware.VerifyToken(http.HandlerFunc(handler.DeleteTaskHandler))).Methods("DELETE", "OPTIONS")

	return r
}
