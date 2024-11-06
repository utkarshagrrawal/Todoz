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

	r.HandleFunc("/api/create", handler.CreateTodozUser).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/login", handler.LoginIntoTodoz).Methods("POST", "OPTIONS")
	r.Handle("/api/user/details", middleware.VerifyToken(http.HandlerFunc(handler.GetUserDetails))).Methods("GET", "OPTIONS")

	return r
}
