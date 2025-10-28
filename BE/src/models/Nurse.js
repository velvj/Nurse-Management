import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbConfig.js';


class Nurse extends Model { }

Nurse.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:{type:DataTypes.STRING,allowNull:false},
    licenseNumber:{type:DataTypes.STRING,allowNull:false,unique:true},
    dob:{type:DataTypes.DATEONLY,allowNull:false},
    age:{type:DataTypes.INTEGER,allowNull:false},
    isActive:{type:DataTypes.BOOLEAN,defaultValue:true}

},{
    sequelize,
    timestamps:true,
    modelName:"Nurse",
    tableName:"nurses"
})


export default Nurse;