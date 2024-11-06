package main

import (
	"net/http"
	"os"
	routes "todolist/api/routers"
)

func main() {
	port := ":" + os.Getenv("port")
	http.ListenAndServe(port, routes.UserRouter())
}
