module.exports = function(sequelize, DataTypes) {
    return sequelize.define('c_client_offline', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        c_client_list_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null
        },
        update_week: {
            comment: '星期几更新节目',
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null
        },
        update_time: {
            comment: '几点更新节目',
            type: DataTypes.TIME,
            allowNull: true,
            defaultValue: null
        },
        rentable_week: {
            comment: '最晚星期几可租',
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null
        },
        rentable_time: {
            comment: '最晚几点可租',
            type: DataTypes.TIME,
            allowNull: true,
            defaultValue: null
        },
        circle_type: {
            //1：按天，只使用update_time，rentable_time，review_time
            //2：按周，使用以上6个字段
            //3：按月，使用以上6个字段，update_week, rentable_week, review_week 填写日期（几号）
            comment: '更新周期类型',
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null
        },
        status: {
            comment: '0：无效; 1：有效',
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null
        },
        tdate: {
            comment: '创建时间',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        reminder: {
            comment: '0：不提醒; 1：短信提醒',
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: 1
        }
    }, {
        tableName: 'c_client_offline',
        comment: '离线设备配置表'
    });
};
