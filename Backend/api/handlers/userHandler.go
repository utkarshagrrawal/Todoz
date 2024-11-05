package handler

import (
	"encoding/json"
	"net/http"
	service "todolist/api"
	model "todolist/models"

	"github.com/golang-jwt/jwt/v5"
)

func CreateTodozUser(w http.ResponseWriter, r *http.Request) {
	// create a new user
	w.Header().Set("Content-Type", "application/json")
	var userDetails model.User
	err := json.NewDecoder(r.Body).Decode(&userDetails)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("User details cannot be read")
		return
	}
	msg := service.CreateUser(&userDetails)
	if msg != "User created successfully" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(msg)
		return
	}
	json.NewEncoder(w).Encode(msg)
}

func LoginIntoTodoz(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var loginDetails model.UserLogin
	err := json.NewDecoder(r.Body).Decode(&loginDetails)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Invalid email/password")
		return
	}
	token, message, err := service.LoginUser(&loginDetails)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(message)
		return
	}
	var tokenCookie = http.Cookie{
		Name:   "token",
		Value:  token,
		MaxAge: 86400,
	}
	http.SetCookie(w, &tokenCookie)
	json.NewEncoder(w).Encode("Login successfull")
}

func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	jwtClaims, ok := r.Context().Value(model.ContextKey("payload")).(jwt.MapClaims)
	if !ok {
		json.NewEncoder(w).Encode("Error reading the user detail")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	email, ok := jwtClaims["email"].(string)
	if !ok {
		json.NewEncoder(w).Encode("The email cannot be parsed")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	user, err := service.GetUserDetailsByEmail(email)
	if err != nil {
		json.NewEncoder(w).Encode("Some internal error occurred while fetching details")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var userResponse = model.UserResponse{
		Name:       user.Name,
		Email:      user.Email,
		Phone:      user.Phone,
		IsVerified: user.IsVerified,
	}
	json.NewEncoder(w).Encode(userResponse)
}
