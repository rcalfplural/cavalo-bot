module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		user_channel: {
			type: DataTypes.STRING,
			defaultValue: "",
			allowNull: false,
		},
	},
  {
		timestamps: false,
	});
};