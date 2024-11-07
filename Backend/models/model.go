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
	Email    string `bson:"email" json:"email"`
	Password string `bson:"password" json:"password"`
}

type UserResponse struct {
	Name       string `bson:"name" json:"name"`
	Email      string `bson:"email" json:"email"`
	Phone      string `bson:"phone" json:"phone"`
	Gender     string `bson:"gender" json:"gender"`
	IsVerified bool   `bson:"isVerified" json:"isVerified"`
}

type Tasks struct {
	TaskId      bson.ObjectID `bson:"_id" json:"_id"`
	UserEmail   string        `bson:"user_email" json:"user_email"`
	Description string        `bson:"description" json:"description"`
	Status      string        `bson:"status" json:"status"`
	CreatedAt   time.Time     `bson:"created_at" json:"created_at"`
	Deadline    time.Time     `bson:"deadline" json:"deadline"`
	IsCompleted bool          `bson:"is_completed" json:"is_completed"`
	Priority    string        `bson:"priority" json:"priority"`
}

type ContextKey string

func (u *User) IsValid() bool {
	if u.Name == "" || u.Email == "" || u.Phone == "" {
		return false
	}
	return true
}

func (t *Tasks) IsValid() bool {
	if t.UserEmail == "" || t.Description == "" || t.Status == "" || t.Priority == "" {
		return false
	}
	return true
}
