package service

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"
	"todolist/db"
	model "todolist/models"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"golang.org/x/crypto/bcrypt"
)

func GetUserDetailsByEmail(email string) (u model.User, err error) {
	singleResult := db.UserCollection.FindOne(context.TODO(), bson.M{"email": email, "isDeleted": false})
	if singleResult.Err() != nil {
		return model.User{}, singleResult.Err()
	}
	err = singleResult.Decode(&u)
	if err != nil {
		return model.User{}, err
	}
	return u, nil
}

func LoginUser(u *model.UserLogin) (string, string, error) {
	singleResult := db.UserCollection.FindOne(context.TODO(), bson.M{"email": u.Email})
	if singleResult.Err() != nil {
		return "", "Error getting user", singleResult.Err()
	}
	var userDetails model.User
	err := singleResult.Decode(&userDetails)
	if err != nil {
		return "", "Error decoding user details", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(userDetails.Password), []byte(u.Password))
	if err != nil {
		return "", "Invalid password", err
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": u.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenStr, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", "Error signing token", err
	}
	return tokenStr, "User is valid", nil
}

func CreateUser(user *model.User) string {
	if !user.IsValid() {
		return "User details are invalid"
	}
	if len(user.Password) > 48 {
		return "Password must be less than 48 digits"
	}
	userDetails := db.UserCollection.FindOne(context.TODO(), bson.M{"email": user.Email})
	if userDetails.Err() == nil {
		return "User already exists with this mail"
	} else if userDetails.Err() != mongo.ErrNoDocuments {
		return "Error while indexing DB for user"
	}
	passwordBytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return "Password cannot be encrypted"
	}
	var passwordString strings.Builder
	passwordString.Write(passwordBytes)
	user.Password = passwordString.String()
	_, err = db.UserCollection.InsertOne(context.TODO(), user)
	if err != nil {
		fmt.Println(err)
		return "Error while inserting into DB"
	}
	return "Account created successfully"
}

func UpdateUserPassword(email, password string) (string, error) {
	hashedPasswordBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "Error hashing password", err
	}
	var hashedPassword strings.Builder
	hashedPassword.Write(hashedPasswordBytes)
	_, err = db.UserCollection.UpdateOne(context.TODO(), bson.M{"email": email}, bson.M{"$set": bson.M{"password": hashedPassword.String()}})
	if err != nil {
		return "Error updating password", err
	}
	return "Password updated successfully", nil
}

func UpdateUserPhone(email string, phone string) (string, error) {
	_, err := db.UserCollection.UpdateOne(context.TODO(), bson.M{"email": email}, bson.M{"$set": bson.M{"phone": phone}})
	if err != nil {
		return "Error updating phone", err
	}
	return "Phone updated successfully", nil
}

func UpdateUserName(email string, name string) (string, error) {
	_, err := db.UserCollection.UpdateOne(context.TODO(), bson.M{"email": email}, bson.M{"$set": bson.M{"name": name}})
	if err != nil {
		return "Error updating name", err
	}
	return "Name updated successfully", nil
}

func DeleteUser(email string) (string, error) {
	singleResult := db.UserCollection.FindOne(context.TODO(), bson.M{"email": email})
	if singleResult.Err() != nil {
		return "Error getting user", singleResult.Err()
	}
	_, err := db.UserCollection.UpdateOne(context.TODO(), bson.M{"email": email}, bson.M{"$set": bson.M{"isDeleted": true}})
	if err != nil {
		return "Error deleting user", err
	}
	return "User deleted successfully", nil
}

func VerifyUser(email string) (string, error) {
	_, err := db.UserCollection.UpdateOne(context.TODO(), bson.M{"email": email}, bson.M{"$set": bson.M{"isVerified": true}})
	if err != nil {
		return "Error verifying user", err
	}
	return "User verified successfully", nil
}