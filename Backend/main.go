package main

import (
	"net/http"
	routes "todolist/api/routers"
)

func main() {
	http.ListenAndServe(":8080", routes.UserRouter())
}
