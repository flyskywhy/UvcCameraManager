module.exports = function(sequelize, DataTypes) {
    return sequelize.define('b_publish_compose_download', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        b_program_publish_compose_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: false,
            primaryKey: false,
        },
        reason: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: 0
        },
        rdate: {
            type: DataTypes.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null
        },
        b_user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: false,
            primaryKey: false,
        },
    }, {
        tableName: 'b_publish_compose_download'
    });
};
