package middleware

import (
	"encoding/json"
	"net/http"
	"net/url"
)

func ApplyCors(next http.Handler) http.Handler {
	origins := make(map[string]bool)
	origins["localhost:5173"] = true
	origins["todoz-fsbs.onrender.com"] = true

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		actualOrigin := r.Header.Get("origin")
		parsedOrigin, err := url.Parse(actualOrigin)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode("Error while processing request")
			return
		}
		if origins[parsedOrigin.Host] {
			w.Header().Set("Access-Control-Allow-Origin", actualOrigin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "content-type, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		} else {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode("Access forbidden")
			return
		}
	})
}
