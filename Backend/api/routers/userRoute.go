package routes

import (
	"net/http"
	handler "todolist/api/handlers"
	"todolist/api/middleware"

	"github.com/gorilla/mux"
)

func UserRouter() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/api/create", handler.CreateTodozUser).Methods("POST")
	r.HandleFunc("/api/login", handler.LoginIntoTodoz).Methods("POST")
	r.Handle("/api/user/details", middleware.VerifyToken(http.HandlerFunc(handler.GetUserDetails))).Methods("GET")

	return r
}
