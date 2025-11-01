import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbConfig.js';


class NurseSalary extends Model { }

NurseSalary.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nurseId:{type:DataTypes.INTEGER,allowNull:false},
    salaryAmt:{type:DataTypes.INTEGER,allowNull:false},
    dateofpayment:{type:DataTypes.DATEONLY,allowNull:false}

},{
    sequelize,
    timestamps:true,
    modelName:"NurseSalary",
    tableName:"nursesSalary"
})


export default NurseSalary;