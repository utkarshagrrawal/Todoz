package routes

import (
	"net/http"
	handler "todolist/api/handlers"
	"todolist/api/middleware"

	"github.com/gorilla/mux"
)

func UserRouter() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/create", handler.CreateTodozUser).Methods("POST", "OPTIONS")
	r.HandleFunc("/login", handler.LoginIntoTodoz).Methods("POST", "OPTIONS")
	r.HandleFunc("/logout", handler.LogoutUser).Methods("POST", "OPTIONS")
	r.Handle("/details", middleware.VerifyToken(http.HandlerFunc(handler.GetUserDetails))).Methods("GET", "OPTIONS")
	r.Handle("/update-details", middleware.VerifyToken(http.HandlerFunc(handler.UpdateUserDetailsHandler))).Methods("PUT", "OPTIONS")
	r.Handle("/change-password", middleware.VerifyToken(http.HandlerFunc(handler.UpdateUserPasswordHandler))).Methods("POST", "OPTIONS")
	r.HandleFunc("/contact-us", handler.FillContactUs).Methods("POST", "OPTIONS")

	return r
}
