package handler

import (
	"encoding/json"
	"net/http"
	"os"
	service "todolist/api/services"
	model "todolist/models"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func CreateTodozUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var userDetails model.User
	err := json.NewDecoder(r.Body).Decode(&userDetails)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("User details cannot be read")
		return
	}
	if !userDetails.IsValid() {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("User details are invalid")
		return
	}
	if len(userDetails.Password) > 48 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Password must be less than 48 digits")
		return
	}
	msg := service.CreateUser(&userDetails)
	if msg != "Account created successfully" {
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
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode("User does not exists")
		} else if message == "Invalid password" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode("Incorrect password")
		} else {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(message)
		}
		return
	}
	var tokenCookie = http.Cookie{
		Name:     "token",
		Value:    token,
		MaxAge:   86400,
		HttpOnly: true,
	}
	if os.Getenv("ENV") != "dev" {
		tokenCookie.SameSite = http.SameSiteNoneMode
		tokenCookie.Secure = true
	}
	http.SetCookie(w, &tokenCookie)
	json.NewEncoder(w).Encode("Login successfull")
}

func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	jwtClaims, ok := r.Context().Value(model.ContextKey("payload")).(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error reading the user detail")
		return
	}
	email, ok := jwtClaims["email"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("The email cannot be parsed")
		return
	}
	user, err := service.GetUserDetailsByEmail(email)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Some internal error occurred while fetching details")
		return
	}
	var userResponse = model.UserResponse{
		Name:       user.Name,
		Email:      user.Email,
		Phone:      user.Phone,
		Gender:     user.Gender,
		IsVerified: user.IsVerified,
	}
	json.NewEncoder(w).Encode(userResponse)
}

func UpdateUserPasswordHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var userPasswords model.ChangeCredentials
	err := json.NewDecoder(r.Body).Decode(&userPasswords)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(err)
		return
	}
	if userPasswords.NewPassword != userPasswords.ConfirmPassword {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Passwords do not match")
		return
	}
	if len(userPasswords.NewPassword) > 48 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Password should be of max 48 characters")
		return
	}
	jwtClaims, ok := r.Context().Value(model.ContextKey("payload")).(jwt.MapClaims)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error fetching user details")
		return
	}
	email, ok := jwtClaims["email"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error decoding user details")
		return
	}
	userPasswords.Email = email
	msg, err := service.UpdateUserPassword(&userPasswords)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(msg)
		return
	}
	json.NewEncoder(w).Encode(msg)
}
