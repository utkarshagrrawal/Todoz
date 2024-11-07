package middleware

import (
	"log"
	"net/http"
)

func CatchError(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if msg := recover(); msg != nil {
				log.Printf("Recovered. Error: %s, Request: %s, Path: %s", msg, r.Method, r.URL.Path)
			}
		}()
		next.ServeHTTP(w, r)
	})
}
