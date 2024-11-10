package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	Name       string `bson:"name" json:"name"`
	Email      string `bson:"email" json:"email"`
	Phone      string `bson:"phone" json:"phone"`
	Password   string `bson:"password" json:"password"`
	Gender     string `bson:"gender" json:"gender"`
	IsVerified bool   `bson:"isVerified" json:"isVerified"`
	IsDeleted  bool   `bson:"isDeleted" json:"isDeleted"`
}

type UserLogin struct {
	Email      string `bson:"email" json:"email"`
	Password   string `bson:"password" json:"password"`
	RememberMe bool   `bson:"remember_me" json:"remember_me"`
}

type UserResponse struct {
	Name       string `bson:"name" json:"name"`
	Email      string `bson:"email" json:"email"`
	Phone      string `bson:"phone" json:"phone"`
	Gender     string `bson:"gender" json:"gender"`
	IsVerified bool   `bson:"isVerified" json:"isVerified"`
}

type ChangeCredentials struct {
	Email           string `bson:"email" json:"email"`
	OldPassword     string `bson:"oldPassword" json:"oldPassword"`
	NewPassword     string `bson:"newPassword" json:"newPassword"`
	ConfirmPassword string `bson:"confirmPassword" json:"confirmPassword"`
}

type Tasks struct {
	TaskId      bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	UserEmail   string        `bson:"user_email" json:"user_email"`
	Description string        `bson:"description" json:"description"`
	Status      string        `bson:"status" json:"status"`
	CreatedAt   time.Time     `bson:"created_at" json:"created_at"`
	Deadline    time.Time     `bson:"deadline" json:"deadline"`
	IsCompleted bool          `bson:"is_completed" json:"is_completed"`
	Priority    int           `bson:"priority" json:"priority"`
}

type ContactForm struct {
	Name    string `bson:"name" json:"name"`
	Email   string `bson:"email" json:"email"`
	Message string `bson:"message" json:"message"`
}

type ContextKey string

func (u *User) IsValid() bool {
	if u.Name == "" || u.Email == "" || u.Phone == "" {
		return false
	}
	return true
}

func (t *Tasks) IsValid() bool {
	if t.UserEmail == "" || t.Description == "" || t.Status == "" {
		return false
	}
	return true
}
