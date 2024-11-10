package routes

import (
	"net/http"
	handler "todolist/api/handlers"
	"todolist/api/middleware"

	"github.com/gorilla/mux"
)

func UserRouter() *mux.Router {
	r := mux.NewRouter()

	r.Use(middleware.ApplyCors)
	r.Use(middleware.RequestsLogging)
	r.Use(middleware.CatchError)

	r.HandleFunc("/api/user/create", handler.CreateTodozUser).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/user/login", handler.LoginIntoTodoz).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/user/logout", handler.LogoutUser).Methods("POST", "OPTIONS")
	r.Handle("/api/user/details", middleware.VerifyToken(http.HandlerFunc(handler.GetUserDetails))).Methods("GET", "OPTIONS")
	r.Handle("/api/user/update-details", middleware.VerifyToken(http.HandlerFunc(handler.UpdateUserDetailsHandler))).Methods("PUT", "OPTIONS")
	r.Handle("/api/user/change-password", middleware.VerifyToken(http.HandlerFunc(handler.UpdateUserPasswordHandler))).Methods("POST", "OPTIONS")

	r.Handle("/api/tasks/today", middleware.VerifyToken(http.HandlerFunc(handler.GetTodayPendingUserTasks))).Methods("GET", "OPTIONS")
	r.Handle("/api/tasks/non-completed", middleware.VerifyToken(http.HandlerFunc(handler.GetNonCompletedUserTasks))).Methods("GET", "OPTIONS")
	r.Handle("/api/tasks/completed", middleware.VerifyToken(http.HandlerFunc(handler.GetCompletedUserTasks))).Methods("GET", "OPTIONS")
	r.Handle("/api/tasks/create", middleware.VerifyToken(http.HandlerFunc(handler.CreateTaskForUser))).Methods("POST", "OPTIONS")
	r.Handle("/api/tasks/update", middleware.VerifyToken(http.HandlerFunc(handler.UpdateUserTaskDetails))).Methods("PUT", "OPTIONS")

	return r
}
