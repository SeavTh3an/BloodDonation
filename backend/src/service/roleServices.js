import { client } from "../config/db.js";

export const getAllRoles = async () => {
    try {
        // Fetch only custom roles, excluding system roles and users
        const query = `
            SELECT rolname 
            FROM pg_roles 
            WHERE rolname NOT LIKE 'pg_%' 
            AND rolname NOT IN ('postgres', 'template0', 'template1')
            AND rolcanlogin = false
            ORDER BY rolname;
        `;
        const result = await client.query(query);
        console.log("Fetched roles:", result.rows);
        return result.rows;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
}

export const getRolePermissions = async (roleName) => {
    try {
        console.log(`Fetching permissions for role: "${roleName}"`)
        
        // Get all tables in the database
        const tablesQuery = `
            SELECT 
                schemaname,
                tablename
            FROM pg_tables 
            WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
            ORDER BY schemaname, tablename;
        `;
        
        const tablesResult = await client.query(tablesQuery)
        console.log('Found tables:', tablesResult.rows)
        
        // Check permissions for each table
        const tablePermissions = []
        for (const table of tablesResult.rows) {
            const tableName = `${table.schemaname}.${table.tablename}`
            
            // Check each permission type
            const permissions = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']
            for (const perm of permissions) {
                try {
                    const hasPermQuery = `SELECT has_table_privilege($1, $2, $3) as has_privilege;`
                    const permResult = await client.query(hasPermQuery, [roleName, tableName, perm])
                    
                    if (permResult.rows[0].has_privilege) {
                        tablePermissions.push({
                            schemaname: table.schemaname,
                            tablename: table.tablename,
                            privilege_type: perm,
                            is_grantable: false // We'll set this to false for now
                        })
                    }
                } catch (permError) {
                    console.log(`Error checking ${perm} permission on ${tableName}:`, permError.message)
                }
            }
        }
        
        // Get database-level permissions
        let databasePermissions = []
        try {
            const dbPermsQuery = `
                SELECT 
                    privilege_type,
                    is_grantable
                FROM information_schema.database_privileges 
                WHERE grantee = $1
                ORDER BY privilege_type;
            `;
            const dbResult = await client.query(dbPermsQuery, [roleName])
            databasePermissions = dbResult.rows
        } catch (dbError) {
            console.log('Database permissions query failed:', dbError.message)
        }
        
        // Get schema-level permissions
        let schemaPermissions = []
        try {
            const schemaPermsQuery = `
                SELECT 
                    schema_name,
                    privilege_type,
                    is_grantable
                FROM information_schema.schema_privileges 
                WHERE grantee = $1
                ORDER BY schema_name, privilege_type;
            `;
            const schemaResult = await client.query(schemaPermsQuery, [roleName])
            schemaPermissions = schemaResult.rows
        } catch (schemaError) {
            console.log('Schema permissions query failed:', schemaError.message)
        }

        // Get basic role info
        const roleInfoQuery = `
            SELECT 
                rolname,
                rolcanlogin
            FROM pg_catalog.pg_roles 
            WHERE rolname = $1;
        `;
        const roleInfoResult = await client.query(roleInfoQuery, [roleName])
        const roleInfo = roleInfoResult.rows[0]

        const permissions = {
            tables: tablePermissions,
            database: databasePermissions,
            schemas: schemaPermissions,
            roleInfo: roleInfo
        };

        console.log(`Final permissions for role ${roleName}:`, permissions);
        return permissions;
    } catch (error) {
        console.error("Error fetching role permissions:", error);
        throw error;
    }
}

export const createRole = async (roleName) => {
    try {
        // Use proper quoting for role names to handle special characters
        const query = `CREATE ROLE "${roleName}";`
        const result = await client.query(query);
        console.log(`Role ${roleName} created successfully`);
        return result;
    }catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
}

export const deleteRole = async (roleName) => {
    try {
        // First check if the role has any users
        const users = await getUsersWithRole(roleName);
        if (users.length > 0) {
            throw new Error(`Role "${roleName}" is still assigned to ${users.length} user(s). Please remove all users from this role first.`);
        }

        // Revoke all permissions from the role first
        const permissions = await getRolePermissions(roleName);
        
        // Revoke table permissions
        for (const perm of permissions.tables) {
            const query = `REVOKE ${perm.privilege_type} ON TABLE ${perm.schemaname}.${perm.tablename} FROM "${roleName}";`;
            await client.query(query);
            console.log(`Revoked ${perm.privilege_type} on ${perm.schemaname}.${perm.tablename} from ${roleName}`);
        }

        // Revoke schema permissions
        for (const perm of permissions.schemas) {
            const query = `REVOKE ${perm.privilege_type} ON SCHEMA ${perm.schema_name} FROM "${roleName}";`;
            await client.query(query);
            console.log(`Revoked ${perm.privilege_type} on schema ${perm.schema_name} from ${roleName}`);
        }

        // Revoke database permissions
        for (const perm of permissions.database) {
            const query = `REVOKE ${perm.privilege_type} ON DATABASE blood_donation_system FROM "${roleName}";`;
            await client.query(query);
            console.log(`Revoked ${perm.privilege_type} on database from ${roleName}`);
        }

        // Now try to drop the role
        const query = `DROP ROLE "${roleName}";`;
        const result = await client.query(query);
        console.log(`Role ${roleName} deleted successfully`);
        return result;
    } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
    }
}

export const assignRoleToUser = async (roleName, userName) => {
    try {
        // Use proper quoting for role and user names
        const query = `GRANT "${roleName}" TO "${userName}";`
        const result = await client.query(query);
        console.log(`Role ${roleName} assigned to user ${userName}`);
        return result;
    }catch (error) {
        console.error("Error assigning role to user:", error);
        throw error;
    }
}

export const revokeRoleFromUser = async (roleName, userName) => {
    try {
        // Use proper quoting for role and user names
        const query = `REVOKE "${roleName}" FROM "${userName}";`
        console.log(`[REVOKE] Running query:`, query)
        console.log(`[REVOKE] Parameters: roleName=`, roleName, 'userName=', userName)
        const result = await client.query(query);
        console.log(`[REVOKE] Role ${roleName} revoked from user ${userName}`);
        return result;
    }
    catch (error) {
        console.error(`[REVOKE] Error revoking role ${roleName} from user ${userName}:`, error);
        throw error;
    }
}

export const grantPermissionsToRole = async (roleName, { permissions, entity }) => {
    try {
        const perms = Array.isArray(permissions) ? permissions.join(', ') : permissions;
        // Use proper quoting for role name and table name
        const query = `GRANT ${perms} ON TABLE public.${entity} TO "${roleName}";`;
        console.log('Executing grant query:', query);
        const result = await client.query(query);
        console.log(`Permissions ${perms} granted to role ${roleName} on table ${entity}`);
        return result;
    }
    catch (error) {
        console.error("Error granting permissions to role:", error);
        throw error;
    }
}

export const revokePermissionsFromRole = async (roleName, permissions, entity) => {
    try {
        const perms = Array.isArray(permissions) ? permissions.join(', ') : permissions;
        let query;
        if (entity) {
            // Revoke from a specific table
            query = `REVOKE ${perms} ON TABLE public.${entity} FROM "${roleName}";`;
        } else {
            // Revoke from the whole role (all objects)
            query = `REVOKE ${perms} FROM "${roleName}";`;
        }
        const result = await client.query(query);
        console.log(`Permissions ${perms} revoked from role ${roleName}${entity ? ' on table ' + entity : ''}`);
        return result;
    }
    catch (error) {
        console.error("Error revoking permissions from role:", error);
        throw error;
    }
}

export const grantPermissionsToUser = async (userName, { permissions, entity }) => {
    try {
        const perms = Array.isArray(permissions) ? permissions.join(', ') : permissions;
        // Use proper quoting for user name and table name
        const query = `GRANT ${perms} ON TABLE public.${entity} TO "${userName}";`;
        console.log('Executing grant query for user:', query);
        const result = await client.query(query);
        console.log(`Permissions ${perms} granted to user ${userName} on table ${entity}`);
        return result;
    }
    catch (error) {
        console.error("Error granting permissions to user:", error);
        throw error;
    }
}

export const revokePermissionsFromUser = async (userName, permissions) => {
    try {
        const perms = Array.isArray(permissions) ? permissions.join(', ') : permissions;
        // Use proper quoting for user name
        const query = `REVOKE ${perms} FROM "${userName}";`
        const result = await client.query(query);
        console.log(`Permissions ${perms} revoked from user ${userName}`);
        return result;
    }
    catch (error) {
        console.error("Error revoking permissions from user:", error);
        throw error;
    }
}

export const getUserRoles = async (userName) => {
    try {
        const query = `
            SELECT r.rolname 
            FROM pg_roles r 
            JOIN pg_auth_members m ON r.oid = m.roleid 
            JOIN pg_roles u ON m.member = u.oid 
            WHERE u.rolname = $1
            AND r.rolcanlogin = false
        `;
        const result = await client.query(query, [userName]);
        console.log(`User roles for ${userName}:`, result.rows);
        return result.rows;
    } catch (error) {
        console.error("Error getting user roles:", error);
        throw error;
    }
}

export const getUsersWithRole = async (roleName) => {
    try {
        const query = `
            SELECT u.rolname as username
            FROM pg_catalog.pg_roles u 
            JOIN pg_catalog.pg_auth_members m ON u.oid = m.member 
            JOIN pg_catalog.pg_roles r ON m.roleid = r.oid 
            WHERE r.rolname = $1
            AND u.rolcanlogin = true
            ORDER BY u.rolname;
        `;
        const result = await client.query(query, [roleName]);
        console.log(`Users with role ${roleName}:`, result.rows);
        return result.rows;
    } catch (error) {
        console.error("Error getting users with role:", error);
        throw error;
    }
}

export const revokeRoleFromAllUsers = async (roleName) => {
    try {
        // First get all users with this role
        const users = await getUsersWithRole(roleName);
        
        // Revoke the role from all users
        for (const user of users) {
            try {
                await revokeRoleFromUser(roleName, user.username);
                console.log(`Revoked role ${roleName} from user ${user.username}`);
            } catch (revokeError) {
                console.error(`Failed to revoke role ${roleName} from user ${user.username}:`, revokeError);
            }
        }
        
        return { message: `Revoked role ${roleName} from ${users.length} users`, users };
    } catch (error) {
        console.error("Error revoking role from all users:", error);
        throw error;
    }
}