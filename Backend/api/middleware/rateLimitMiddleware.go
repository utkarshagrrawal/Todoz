package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
	"todolist/db"
	model "todolist/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func RateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Rate limiting logic can be implemented here using db.HitsCollection
		var userDetails model.RateLimiter
		userIP := r.Header.Get("x-forwarded-for")
		if userIP != "" {
			userIP = strings.Split(userIP, ", ")[0]
		} else {
			userIP = strings.Split(r.RemoteAddr, ":")[0]
		}
		isUserPresent := db.HitsCollection.FindOne(r.Context(), bson.D{{Key: "userIP", Value: userIP}})
		if isUserPresent.Err() == mongo.ErrNoDocuments {
			userDetails = model.RateLimiter{
				Requests:  30,
				ExpiresAt: time.Now().Unix() + 120,
				UserIP:    userIP,
			}
			_, err := db.HitsCollection.InsertOne(r.Context(), userDetails)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode("Error occurred while inserting user details in Rate limiting API")
				return
			}
		} else if isUserPresent.Err() != nil {
			fmt.Println(isUserPresent.Err())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode("Error occurred while getting user details in Rate limiting API")
			return
		} else {
			err := isUserPresent.Decode(&userDetails)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode("Error occurred while decoding user details in Rate limiting API")
				return
			}
			if userDetails.ExpiresAt < time.Now().Unix() {
				userDetails.Requests = 30
				userDetails.ExpiresAt = time.Now().Unix() + 120
			}
			if userDetails.Requests <= 0 {
				w.WriteHeader(http.StatusTooManyRequests)
				json.NewEncoder(w).Encode("Rate limit exceeded. Please try again later.")
				return
			}
			userDetails.Requests -= 1
			_, err = db.HitsCollection.UpdateOne(r.Context(), bson.D{{Key: "userIP", Value: userIP}}, bson.D{{Key: "$set", Value: bson.D{{Key: "requests", Value: userDetails.Requests}, {Key: "expiresAt", Value: userDetails.ExpiresAt}}}})
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode("Error occurred while updating user details in Rate limiting API")
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
