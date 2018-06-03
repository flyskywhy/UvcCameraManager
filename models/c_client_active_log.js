module.exports = function(sequelize, DataTypes) {
    return sequelize.define('c_client_active_log', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        c_client_list_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: false,
            primaryKey: false
        },
        sdate: {
            type: DataTypes.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null
        },
        edate: {
            type: DataTypes.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null
        },
        rdate: {
            type: DataTypes.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null
        },
    }, {
        tableName: 'c_client_active_log'
    });
};
