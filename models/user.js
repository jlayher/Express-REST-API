'use strict'
const {Model, DataTypes} = require('sequelize');
//const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A First Name must be added'
                },
                notEmpty: {
                    msg: 'First Name cannot be empty'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A First Name must be added'
                },
                notEmpty: {
                    msg: 'First Name cannot be empty'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "This Email Address Already Exists"
            },
            validate: {
                notNull: {
                    msg: 'An Email must be added'
                },
                notEmpty: {
                    msg: 'Email cannot be empty'
                },
                isEmail: {
                    msg: "Email Address Is Not Valid"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            },
            validate: {
                notNull: {
                    msg: 'A First Name must be added'
                },
                notEmpty: {
                    msg: 'First Name cannot be empty'
                }
            }
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: 'userId'
        });
    };
    return User;
};