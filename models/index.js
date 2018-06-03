var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var log = require('./../instances/log.js');
var configs = require('./../instances/config.js');

var sequelize = new Sequelize(configs.db.toString(), {
     logging: function() {},
     timezone: '+08:00',
     define: {
          timestamps: false,
          freezeTableName: true,
          underscored: true
     }
});

//  autoload
fs
     .readdirSync(__dirname)
     .filter(function(file) {
          //return (file.indexOf('.') !== 0) && (file !== 'index.js' &&  file !== 'migrate.js') ;
          return (file.indexOf('.') !== 0) && (file !== 'index.js' && file !== 'migrate.js') && /(\w*).json/.exec(file) === null;
     })
     .forEach(function(file) {
          try {
               //if(file.substring(0,2)!=="c_")
               //{
               sequelize.import(path.join(__dirname, file));
               //console.log(file.substring(0,2));
               //}
          } catch (e) {
               log.debug(file + '_______' + e);
          }
     });

var models = sequelize.models;
Object.keys(sequelize.models).forEach(function(modelName) {
     //hasOne  belongsTo  hasMany belongsTo belongsToMany
     try {
          switch (modelName) {

               case 'b_access_log':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_module);
                    break;
               case 'b_client_disuse':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_client_repairs);
                    break;
               case 'b_client_repairs':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.c_client_list);
                    break;
               case 'b_distribution_benefit':
                    models[modelName].hasMany(models.b_distribution_benefit_operator);
                    models[modelName].hasMany(models.b_distribution_benefit_sysadmin);
                    models[modelName].hasMany(models.c_client_attribute);
                    break;
               case 'b_distribution_benefit_operator':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_distribution_benefit);
                    break;
               case 'b_distribution_benefit_sysadmin':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_distribution_benefit);
                    break;
               case 'b_login_log':
                    models[modelName].belongsTo(models.b_user);
                    break;
               case 'b_location_type':
                    models[modelName].hasMany(models.c_client_location_type);
                    break;
               case 'b_material':
                    models[modelName].belongsToMany(models.b_program_list, {
                         through: {
                              model: models.b_program_material,
                              unique: false,
                         }
                    });
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_resource);
                    models[modelName].hasMany(models.b_program_material);
                    break;
               case 'b_message':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_messagetext);
                    break;
               case 'b_messagetext':
                    models[modelName].hasMany(models.b_message);
                    models[modelName].belongsTo(models.b_user);
                    break;
               case 'b_mode':
                    models[modelName].hasMany(models.b_virtual_screen);
                    break;
               case 'b_module':
                    models[modelName].hasMany(models.b_access_log);
                    models[modelName].hasMany(models.b_role_module);
                    models[modelName].hasMany(models.b_module_relational);
                    models[modelName].hasMany(models.b_system_parameter);
                    models[modelName].hasMany(models.b_timing_services);
                    break;
               case 'b_module_list':
                    models[modelName].hasMany(models.b_screen_led);
                    break;
               case 'b_module_relational':
                    models[modelName].belongsTo(models.b_module);
                    break;
               case 'b_notice':
                    models[modelName].belongsTo(models.b_user);
                    break;
               case 'b_phone_cost':
                    models[modelName].belongsTo(models.b_phone_list);
                    break;
               case 'b_phone_list':
                    models[modelName].hasMany(models.b_phone_cost);
                    models[modelName].hasMany(models.c_client_attribute);
                    break;
               case 'b_program_cancel':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_program_list);
                    models[modelName].belongsTo(models.b_virtual_screen_user_rent);
                    break;
                    // case 'b_program_compose':
                    //      models[modelName].belongsTo(models.b_program_list);
                    //      models[modelName].belongsTo(models.c_client_list);
                    //      models[modelName].belongsTo(models.b_virtual_screen_user_rent);
                    //      models[modelName].belongsTo(models.b_mode);
                    //      models[modelName].hasOne(models.b_program_compose_mode_01);
                    //      models[modelName].hasOne(models.b_program_compose_mode_02);
                    //      break;
               case 'b_program_client_status':
                    models[modelName].belongsTo(models.b_program_precompose, {
                         onDelete: 'cascade'
                    });
                    break;
               case 'b_program_precompose':
                    models[modelName].belongsTo(models.b_program_list);
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_publish_list);
                    models[modelName].belongsTo(models.b_mode);
                    // models[modelName].belongsTo(models.b_virtual_screen_user_rent);
                    models[modelName].belongsTo(models.b_virtual_screen);
                    models[modelName].hasOne(models.b_program_compose_mode_01);
                    models[modelName].hasOne(models.b_program_compose_mode_02);
                    models[modelName].hasMany(models.b_program_client_status);
                    break;
               case 'b_program_compose_system':
                    models[modelName].belongsTo(models.b_program_list);
                    models[modelName].belongsTo(models.c_client_list);
                    break;
               case 'b_program_compose_mode_01':
                    models[modelName].belongsTo(models.b_program_precompose);
                    break;
               case 'b_program_compose_mode_02':
                    models[modelName].belongsTo(models.b_program_precompose);
                    break;
               case 'b_program_effect':
                    models[modelName].belongsTo(models.b_program_list);
                    break;
               case 'b_program_material':
                    models[modelName].belongsTo(models.b_program_list);
                    models[modelName].belongsTo(models.b_material);
                    break;
               case 'b_program_list':
                    // models[modelName].hasMany(models.b_program_compose);
                    models[modelName].hasMany(models.b_program_precompose);
                    models[modelName].hasMany(models.b_program_compose_system);
                    models[modelName].hasOne(models.b_program_effect);
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].hasMany(models.c_client_playlist);
                    models[modelName].hasMany(models.c_client_status);
                    models[modelName].belongsToMany(models.b_material, {
                         through: {
                              model: models.b_program_material,
                              unique: false,
                         }
                    });
                    models[modelName].hasMany(models.b_program_cancel);
                    break;
               case 'b_program_publish_compose':
                    models[modelName].belongsTo(models.c_client_list);
                    // models[modelName].belongsTo(models.b_publish_list);
                    models[modelName].hasMany(models.c_cmd_list);
                    models[modelName].hasMany(models.b_playlist_programs);
                    models[modelName].hasMany(models.b_publish_compose_download);
                    break;
               case 'b_publish_compose_download':
                    models[modelName].belongsTo(models.b_program_publish_compose);
                    models[modelName].belongsTo(models.b_user);
                    break;
               case 'b_playlist_programs':
                    models[modelName].belongsTo(models.b_program_publish_compose);
                    break;
               case 'b_publish_list':
                    // models[modelName].hasMany(models.b_program_publish_compose);
                    models[modelName].hasMany(models.b_program_precompose);
                    models[modelName].belongsTo(models.b_user);
                    break;
               case 'b_rent_count_mode_01':
                    models[modelName].belongsTo(models.b_virtual_screen);
                    break;
               case 'b_rented_count_mode_01':
                    models[modelName].belongsTo(models.b_virtual_screen);
                    break;
               case 'b_rent_setting':
                    models[modelName].belongsTo(models.b_virtual_screen);
                    break;
               case 'b_rent_count_mode_02':
                    models[modelName].belongsTo(models.b_virtual_screen);
                    break;
               case 'b_role':
                    models[modelName].hasMany(models.b_role_module);
                    //models[modelName].hasMany(models.b_user_role);
                    models[modelName].belongsToMany(models.b_user, {
                         through: {
                              model: models.b_user_role,
                              unique: false,
                         }
                    });
                    break;
               case 'b_role_module':
                    models[modelName].belongsTo(models.b_role);
                    models[modelName].belongsTo(models.b_module);
                    break;
               case 'b_screen_frame':
                    models[modelName].belongsTo(models.c_client_list);
                    break;
               case 'b_screen_group':
                    models[modelName].belongsTo(models.b_user);
                    //models[modelName].belongsTo(models.b_module_list);
                    models[modelName].hasMany(models.b_virtual_screen_not_rent_group);
                    models[modelName].hasMany(models.b_virtual_screen_group);
                    break;
               case 'b_screen_share':
                    models[modelName].belongsTo(models.c_client_list);
                    break;
               case 'b_status':
                    models[modelName].belongsTo(models.b_status_main);
                    break;
               case 'b_status_main':
                    models[modelName].hasMany(models.b_status);
                    break;
               case 'b_system_parameter':
                    models[modelName].belongsTo(models.b_module);
                    break;
               case 'b_third_party_certifier':
                    models[modelName].belongsTo(models.b_user);
                    break;
               case 'b_timing_services':
                    models[modelName].belongsTo(models.b_module);
                    break;
               case 'b_user':
                    models[modelName].hasMany(models.b_access_log);
                    models[modelName].hasMany(models.b_client_disuse);
                    models[modelName].hasMany(models.b_client_repairs);
                    models[modelName].hasMany(models.b_notice);
                    models[modelName].hasMany(models.b_program_list);
                    models[modelName].hasMany(models.b_publish_list);
                    models[modelName].hasMany(models.b_screen_group);
                    models[modelName].hasMany(models.b_third_party_certifier);
                    models[modelName].hasMany(models.b_user_interest);
                    models[modelName].hasMany(models.b_user_interest_next_level);
                    models[modelName].hasMany(models.b_virtual_screen_user_not_rent);
                    models[modelName].hasMany(models.b_virtual_screen_user_not_rent_check);
                    models[modelName].hasMany(models.b_virtual_screen_user_rent);
                    models[modelName].hasMany(models.c_clinet_constraint);
                    models[modelName].belongsToMany(models.b_role, {
                         through: {
                              model: models.b_user_role,
                              unique: false,
                         }
                    });
                    models[modelName].hasMany(models.b_material);
                    models[modelName].hasMany(models.b_program_cancel);
                    models[modelName].hasMany(models.b_distribution_benefit_operator);
                    models[modelName].hasMany(models.b_distribution_benefit_sysadmin);
                    models[modelName].hasMany(models.b_message);
                    models[modelName].hasMany(models.b_messagetext);
                    models[modelName].hasMany(models.c_client_list);
                    models[modelName].hasMany(models.b_user_monthly_cost);
                    models[modelName].hasMany(models.b_publish_compose_download);
                    models[modelName].hasMany(models.b_referee, {
                         foreignKey: 'b_referee_user_id'
                    });
                    models[modelName].hasMany(models.b_referee);
                    models[modelName].hasMany(models.b_regional_manager);
                    break;
               case 'b_user_interest':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].hasMany(models.b_user_interest_next_level);
                    break;
               case 'b_resource':
                    models[modelName].hasMany(models.b_material);
                    break;
               case 'b_referee':
                    models[modelName].belongsTo(models.b_user, {
                         onDelete: 'cascade',
                         foreignKey: 'b_referee_user_id'
                    });
                    models[modelName].belongsTo(models.b_user, {
                         onDelete: 'cascade'
                    });
                    models[modelName].belongsTo(models.c_client_list, {
                         onDelete: 'cascade'
                    });
                    models[modelName].hasMany(models.b_referral_interest);
                    break;
               case 'b_regional_manager':
                    models[modelName].belongsTo(models.b_user, {
                         onDelete: 'cascade'
                    });
                    models[modelName].hasMany(models.b_referral_interest);
                    break;
               case 'b_referral_interest':
                    models[modelName].belongsTo(models.b_regional_manager, {
                         onDelete: 'cascade'
                    });
                    models[modelName].belongsTo(models.b_referee, {
                         onDelete: 'cascade'
                    });
                    break;
               case 'b_user_interest_next_level':
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_user_interest);
                    break;
               case 'b_user_role':
                    //models[modelName].belongsTo(models.b_user);
                    //models[modelName].belongsTo(models.b_role);
                    break;
               case 'b_virtual_screen':
                    models[modelName].hasMany(models.b_program_precompose);
                    //models[modelName].hasMany(models.b_program_compose);
                    models[modelName].hasMany(models.b_rent_count_mode_01);
                    models[modelName].hasMany(models.b_rent_count_mode_02);
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_mode);
                    models[modelName].hasMany(models.b_virtual_screen_user_not_rent);
                    models[modelName].hasMany(models.b_virtual_screen_user_not_rent_check);
                    models[modelName].hasMany(models.b_virtual_screen_user_rent);
                    models[modelName].hasMany(models.b_virtual_screen_group);
                    models[modelName].hasMany(models.b_rented_count_mode_01);
                    models[modelName].hasMany(models.b_rent_setting);
                    break;
               case 'b_virtual_screen_not_rent_group':
                    models[modelName].belongsTo(models.b_virtual_screen_user_not_rent);
                    models[modelName].belongsTo(models.b_screen_group);
                    break;
               case 'b_virtual_screen_group':
                    models[modelName].belongsTo(models.b_virtual_screen);
                    models[modelName].belongsTo(models.b_screen_group);
                    break;
               case 'b_virtual_screen_user_not_rent':
                    models[modelName].belongsTo(models.b_virtual_screen);
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].hasMany(models.b_virtual_screen_user_not_rent_check);
                    models[modelName].hasMany(models.b_virtual_screen_not_rent_group);
                    break;
               case 'b_virtual_screen_user_not_rent_check':
                    models[modelName].belongsTo(models.b_virtual_screen);
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].belongsTo(models.b_virtual_screen_user_not_rent);
                    break;
               case 'b_virtual_screen_user_rent':
                    models[modelName].belongsTo(models.b_virtual_screen);
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].hasOne(models.b_virtual_screen_user_rent_mode_01);
                    models[modelName].hasOne(models.b_virtual_screen_user_rent_mode_02);
                    models[modelName].hasMany(models.b_program_cancel);
                    break;
               case 'b_virtual_screen_user_rent_mode_01':
                    models[modelName].belongsTo(models.b_virtual_screen_user_rent);
                    break;
               case 'b_virtual_screen_user_rent_mode_02':
                    models[modelName].belongsTo(models.b_virtual_screen_user_rent);
                    break;
               case 'b_screen_classify':
                    models[modelName].hasMany(models.c_client_attribute);
                    break;
               case 'b_screen_led':
                    models[modelName].belongsTo(models.b_module_list);
                    models[modelName].hasMany(models.c_client_config);
                    break;
               case 'b_player_list':
                    models[modelName].hasMany(models.c_client_config);
                    break;
               case 'c_client_list':
                    models[modelName].hasOne(models.c_client_attribute);
                    models[modelName].hasOne(models.c_client_config);
                    models[modelName].hasMany(models.b_client_repairs);
                    // models[modelName].hasMany(models.b_program_compose);
                    models[modelName].hasMany(models.b_program_precompose);
                    models[modelName].hasMany(models.b_program_compose_system);
                    models[modelName].hasMany(models.b_program_publish_compose);
                    models[modelName].hasOne(models.b_screen_frame);
                    models[modelName].hasMany(models.b_screen_share);
                    models[modelName].hasMany(models.b_user_interest);
                    models[modelName].hasMany(models.b_virtual_screen);
                    models[modelName].hasMany(models.c_client_playlist);
                    models[modelName].hasMany(models.c_client_status);
                    models[modelName].hasOne(models.c_clinet_constraint);
                    models[modelName].hasMany(models.c_cmd_list);
                    models[modelName].hasOne(models.c_client_playtime);
                    models[modelName].hasMany(models.c_client_location_type);
                    models[modelName].belongsTo(models.b_user);
                    models[modelName].hasMany(models.c_client_active_log);
                    models[modelName].hasMany(models.c_client_control_log);
                    models[modelName].hasMany(models.c_client_merge_config);
                    models[modelName].hasMany(models.c_client_offline);
                    models[modelName].hasMany(models.b_referee);
                    break;
               case 'c_client_attribute':
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_phone_list);
                    models[modelName].belongsTo(models.b_screen_classify);
                    models[modelName].belongsTo(models.b_distribution_benefit);
                    break;
               case 'c_client_config':
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_screen_led);
                    models[modelName].belongsTo(models.b_player_list);
                    break;
               case 'c_client_offline':
                    models[modelName].belongsTo(models.c_client_list);
                    break;
               case 'c_clinet_constraint':
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_user);
                    break;
               case 'c_client_location_type':
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_location_type);
                    break;
               case 'c_client_playlist':
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_program_list);
                    break;
               case 'c_client_playtime':
                    models[modelName].belongsTo(models.c_client_list);
                    break;
               case 'c_client_status':
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_program_list);
                    break;
               case 'c_client_active_log':
                    models[modelName].belongsTo(models.c_client_list);
                    break;
               case 'c_cmd_list':
                    models[modelName].belongsTo(models.c_client_list);
                    models[modelName].belongsTo(models.b_program_publish_compose);
                    break;
               case 'c_client_control_log':
                    models[modelName].belongsTo(models.c_client_list);
                    break;
               case 'c_client_merge_config':
                    models[modelName].belongsTo(models.c_client_list, {
                         onDelete: 'cascade'
                    });
                    break;
               case 'b_user_monthly_cost':
                    models[modelName].belongsTo(models.b_user);
                    break;
               default:
                    break;

          }
     } catch (e) {
          log.debug(modelName + '_______' + e);
     }


     if (models[modelName].options.hasOwnProperty('associate')) {
          models[modelName].options.associate(models);
     }
});

module.exports = sequelize;
