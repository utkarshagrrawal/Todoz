package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	model "todolist/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func VerifyToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := godotenv.Load()
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode("Error reading .env file")
			return
		}
		ckie, err := r.Cookie("token")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode("Authorization token cannot be identified")
			return
		}
		token := ckie.Value
		var claims jwt.MapClaims
		_, err = jwt.ParseWithClaims(token, &claims, func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode("Token expired")
				return
			}
			json.NewEncoder(w).Encode("Error while parsing token")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		var contextKey = model.ContextKey("payload")
		ctx := context.WithValue(r.Context(), contextKey, claims)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
