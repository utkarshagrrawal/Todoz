package main

import (
	"net/http"
	"os"
	"todolist/api/middleware"
	routes "todolist/api/routers"

	"github.com/gorilla/mux"
)

func main() {
	mainRouter := mux.NewRouter()

	mainRouter.Use(middleware.ApplyCors)
	mainRouter.Use(middleware.RequestsLogging)
	mainRouter.Use(middleware.CatchError)

	mainRouter.PathPrefix("/api/user").Handler(http.StripPrefix("/api/user", routes.UserRouter()))
	mainRouter.PathPrefix("/api/tasks").Handler(http.StripPrefix("/api/tasks", routes.TaskRouter()))

	port := ":" + os.Getenv("PORT")
	http.ListenAndServe(port, mainRouter)
}
