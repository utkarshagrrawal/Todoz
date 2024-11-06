package model

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

type ContextKey string

func (u *User) IsValid() bool {
	// check if user is valid
	if u.Name == "" || u.Email == "" || u.Phone == "" {
		return false
	}
	return true
}
