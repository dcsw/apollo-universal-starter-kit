/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import { camelizeKeys } from 'humps';
import uuidv4 from 'uuid';
import _ from 'lodash';

import settings from '../../../../settings';
import log from '../../../common/log';

import knex from '../../sql/connector';
import { orderedFor } from '../../sql/helpers';

import UserDAO from '../entities/user/lib';

const User = new UserDAO();

const entities = settings.entities;
const authn = settings.auth.authentication;
const authz = settings.auth.authorization;
const staticUserScopes = authz.userScopes;
const staticGroupScopes = authz.groupScopes;
const staticOrgScopes = authz.orgScopes;

export default class Auth {
  async registerNewUser(newUser) {
    try {
      let user = null;

      // Use a transaction during registration
      knex.transaction(trx => {
        // Finally wait on the transaction to complete, potentially rolling back
        this.registerUser(newUser)
          .then(createdUser => {
            user = createdUser;
          })
          .then(trx.commit)
          .catch(trx.rollback);
      });

      return user;
    } catch (e) {
      log.error('Error in Auth.registerNewUser', e);
      throw e;
    }
  }

  async registerUser(newUser, trx) {
    try {
      const id = await User.create(
        {
          email: newUser.email,
          isActive: newUser.isActive
        },
        trx
      );

      if (newUser.profile) {
        await User.createProfile(id, newUser.profile, trx);
      }

      await this.createPassword(id, newUser.password, trx);

      // let ret = await this.createUserRole(id, 'user');

      const user = await User.get(id, trx);

      return user;
    } catch (e) {
      log.error('Error in Auth.searchUserByEmail', e);
      throw e;
    }
  }

  async searchUserByEmail(email, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email')
        .from('users AS u')
        .whereIn('u.email', email)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.searchUserByEmail', e);
      throw e;
    }
  }

  async searchUserByOAuthIdOrEmail(provider, id, email, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'o.provider')
        .from('users AS u')
        .whereIn('u.email', email)
        .orWhere('provider', '=', provider)
        .leftJoin('user_oauths AS o', 'o.user_id', 'u.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.searchUserByOAuthIdOrEmail', e);
      throw e;
    }
  }

  async getUserWithPassword(id, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.password')
        .from('users AS u')
        .where('u.id', '=', id)
        .leftJoin('user_password AS a', 'a.user_id', 'u.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.getUserWithPassword', e);
      throw e;
    }
  }

  async getUsersWithApiKeys(ids, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.name', 'a.key')
        .from('users AS u')
        .whereIn('u.id', ids)
        .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, row => row.name !== null);
      res = camelizeKeys(res);
      return orderedFor(res, ids, 'id', false);
    } catch (e) {
      log.error('Error in Auth.getUsersWithApiKeys', e);
      throw e;
    }
  }

  async getUsersWithSerials(ids, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.name', 'a.serial')
        .from('users AS u')
        .whereIn('u.id', ids)
        .leftJoin('user_certificates AS a', 'a.user_id', 'u.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, row => row.serial !== null);
      res = camelizeKeys(res);
      return orderedFor(res, ids, 'id', false);
    } catch (e) {
      log.error('Error in Auth.getUserWithSerials', e);
      throw e;
    }
  }

  async getUsersWithOAuths(ids, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.provider', 'a.oauth_id AS oauth_id')
        .from('users AS u')
        .whereIn('u.id', ids)
        .leftJoin('user_oauths AS a', 'a.user_id', 'u.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, row => row.provider !== null);
      res = camelizeKeys(res);
      return orderedFor(res, ids, 'id', false);
    } catch (e) {
      log.error('Error in Auth.getUserWithOAuths', e);
      throw e;
    }
  }

  async getUserPasswordFromEmail(email, trx) {
    try {
      console.log('Auth.getUserPasswordFromEmail', email);
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.password')
        .from('users AS u')
        .whereIn('u.email', email)
        .leftJoin('user_password AS a', 'a.user_id', 'u.id')
        .first();

      if (trx) {
        console.log('transacting!');
        builder.transacting(trx);
      }

      let row = await builder;

      let ret = camelizeKeys(row);
      return ret;
    } catch (e) {
      log.error('Error in Auth.getUserPasswordFromEmail', e);
      throw e;
    }
  }

  async getUserFromApiKey(apikey, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.name')
        .from('users AS u')
        .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
        .where('a.key', '=', apikey)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.getUserFromApiKey', e);
      throw e;
    }
  }

  async getUserFromOAuth(provider, oauth_id, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email')
        .from('users AS u')
        .leftJoin('user_oauths AS a', 'a.user_id', 'u.id')
        .where({
          provider,
          oauth_id
        })
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.getUserFromOAuth', e);
      throw e;
    }
  }

  async getUserFromSerial(serial, trx) {
    try {
      // ??? (Same as and ApiKey?) Maybe this should be public/private key pairs?
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.name')
        .from('users AS u')
        .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
        .where('a.serial', '=', serial)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.getUserFromSerial', e);
      throw e;
    }
  }

  async createPassword(id, plaintextPassword, trx) {
    try {
      const password = await bcrypt.hash(plaintextPassword, 12);

      let builder = knex('user_password').insert({
        user_id: id,
        password: password
      });

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Auth.createPassword', e);
      throw e;
    }
  }

  async updatePassword(id, plaintextPassword, trx) {
    try {
      const password = await bcrypt.hash(plaintextPassword, 12);

      let builder = knex('user_password')
        .update({
          password: password
        })
        .where({
          user_id: id
        });

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Auth.updatePassword', e);
      throw e;
    }
  }

  async createUserOAuth(provider, oauthId, userId, trx) {
    try {
      let builder = knex('user_oauths').insert({
        provider: provider,
        oauth_id: oauthId,
        user_id: userId
      });

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Auth.createUserOAuth', e);
      throw e;
    }
  }

  async deleteUserOAuth(provider, oauthId, userId, trx) {
    try {
      let builder = knex('user_oauths')
        .where({
          provider: provider,
          oauth_id: oauthId,
          user_id: userId
        })
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Auth.deleteUserOAuth', e);
      throw e;
    }
  }

  async createUserApiKey(id, name, trx) {
    try {
      let key = uuidv4();
      let builder = knex('user_apikeys')
        .returning('key')
        .insert({
          name: name,
          key: key,
          user_id: id
        });

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Auth.createUserApiKey', e);
      throw e;
    }
  }

  async deleteUserApiKey(id, name, trx) {
    try {
      let builder = knex('user_apikeys')
        .where({
          name: name,
          user_id: id
        })
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Auth.deleteUserApiKey', e);
      throw e;
    }
  }

  async getUserWithUserRoles(id, trx) {
    try {
      let builder = await knex
        .select('b.user_id', 'r.id', 'r.name')
        .from('user_role_user_bindings AS b')
        .where('b.user_id', id)
        .leftJoin('user_roles AS r', 'r.id', 'b.role_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.name !== null);
      res = camelizeKeys(res);
      return res;
    } catch (e) {
      log.error('Error in Auth.getUserWithUserRoles', e);
      throw e;
    }
  }

  async getUserWithGroupRoles(id, trx) {
    try {
      let builder = await knex
        .select('b.role_id', 'r.group_id', 'r.name', 'g.name AS groupName')
        .from('group_role_user_bindings AS b')
        .where('b.user_id', id)
        .leftJoin('group_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('groups as g', 'r.group_id', 'g.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.name !== null);
      res = camelizeKeys(res);

      let ret = {};
      for (let r of res) {
        let cur = ret[r.groupId];
        if (!cur) {
          cur = {
            groupId: r.groupId,
            groupName: r.groupName,
            roles: {}
          };
        }
        cur.roles[r.name] = {
          name: r.name,
          id: r.roleId
        };
        ret[cur.groupId] = cur;
      }

      return ret;
    } catch (e) {
      log.error('Error in Auth.getUserWithGroupRoles', e);
      throw e;
    }
  }

  async getUserWithOrgRoles(id, trx) {
    try {
      let builder = await knex
        .select('b.role_id', 'r.org_id', 'r.name', 'o.name AS orgName')
        .from('org_role_user_bindings AS b')
        .where('b.user_id', id)
        .leftJoin('org_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('orgs AS o', 'r.org_id', 'o.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.name !== null);
      res = camelizeKeys(res);

      let ret = {};
      for (let r of res) {
        let cur = ret[r.orgId];
        if (!cur) {
          cur = {
            orgId: r.orgId,
            orgName: r.orgName,
            roles: {}
          };
        }
        cur.roles[r.name] = {
          name: r.name,
          id: r.roleId
        };
        ret[cur.orgId] = cur;
      }

      return ret;
    } catch (e) {
      log.error('Error in Auth.getUserWithOrgRoles', e);
      throw e;
    }
  }

  async getUserWithAllRoles(id, trx) {
    // TODO replace the following with a call to replace static scope lookup with a dynamic one
    // // ALSO, make this configurable, static or dynamic role/permission sets

    let groupRoles = null;
    let orgRoles = null;

    let userRoles = await this.getUserWithUserRoles(id, trx);
    for (let role of userRoles) {
      const scopes = staticUserScopes[role.name];
      role.scopes = scopes;
      userRoles[role.name] = role;
    }

    if (entities.groups.enabled) {
      groupRoles = await this.getUserWithGroupRoles(id, trx);
      for (let gid in groupRoles) {
        let grp = groupRoles[gid];

        let scopes = [];
        for (let r in grp.roles) {
          let role = grp.roles[r];
          role.scopes = staticGroupScopes[role.name];
          grp.roles[role.name] = role;
          scopes = scopes.concat(role.scopes);
        }
        grp.scopes = scopes;

        groupRoles[gid] = grp;
      }
    } // end of groups

    if (entities.orgs.enabled) {
      orgRoles = await this.getUserWithOrgRoles(id, trx);
      for (let gid in orgRoles) {
        let o = orgRoles[gid];

        let scopes = [];
        for (let r in o.roles) {
          let role = o.roles[r];
          role.scopes = staticOrgScopes[role.name];
          o.roles[role.name] = role;
          scopes = scopes.concat(role.scopes);
        }
        o.scopes = scopes;

        orgRoles[gid] = o;
      }
    } // end of orgs
    return {
      userRoles,
      groupRoles,
      orgRoles
    };
  }

  async getUserWithUserRolesPermissions(id, trx) {
    try {
      let builder = knex
        .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
        .from('user_role_user_bindings AS b')
        .where('b.user_id', '=', id)
        .leftJoin('user_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('user_role_permission_bindings AS g', 'g.role_id', 'r.id')
        .leftJoin('permissions AS p', 'p.id', 'g.permission_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.role_id !== null);
      res = camelizeKeys(res);
      let ids = _.map(res, r => r.roleId);
      ids = _.uniq(ids);
      return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error('Error in Auth.getUserWithUserRolesPermissions', e);
      throw e;
    }
  }

  async getUserWithGroupRolesPermissions(id, trx) {
    try {
      let builder = knex
        .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
        .from('group_role_user_bindings AS b')
        .where('b.user_id', '=', id)
        .leftJoin('group_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('group_role_permission_bindings AS g', 'g.role_id', 'r.id')
        .leftJoin('permissions AS p', 'p.id', 'g.permission_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      console.log('ROWS:', rows);

      let res = _.filter(rows, row => row.role_id !== null);
      res = camelizeKeys(res);
      let ids = _.map(res, r => r.roleId);
      ids = _.uniq(ids);
      console.log('gUW-GRP:', ids, res);
      return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error('Error in Auth.getUserWithGroupRolesPermissions', e);
      throw e;
    }
  }

  async getUserWithOrgRolesPermissions(id, trx) {
    try {
      let builder = knex
        .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
        .from('org_role_user_bindings AS b')
        .where('b.user_id', '=', id)
        .leftJoin('org_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('org_role_permission_bindings AS g', 'g.role_id', 'r.id')
        .leftJoin('permissions AS p', 'p.id', 'g.permission_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      console.log('ROWS:', rows);

      let res = _.filter(rows, row => row.role_id !== null);
      res = camelizeKeys(res);
      let ids = _.map(rows, row => row.roleId);
      ids = _.uniq(ids);
      console.log('gUW-ORP:', ids, res);
      return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error('Error in Auth.getUserWithOrgRolesPermissions', e);
      throw e;
    }
  }

  // Plural version for multiple "Users" ids
  async getUsersWithUserRoles(ids, trx) {
    try {
      let builder = knex
        .select('b.user_id', 'r.id AS role_id', 'r.name')
        .from('user_role_user_bindings AS b')
        .whereIn('b.user_id', ids)
        .leftJoin('user_roles AS r', 'r.id', 'b.role_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.name !== null);
      res = camelizeKeys(res);
      return orderedFor(res, ids, 'userId', false);
    } catch (e) {
      log.error('Error in Auth.getUsersWithUserRoles', e);
      throw e;
    }
  }
}