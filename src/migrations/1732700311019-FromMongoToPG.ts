import { MongoClient } from 'mongodb';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FromMongoToPG1732700311019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const mongoClient = new MongoClient(process.env.DB_URL as string);

    await mongoClient.connect();

    const mongodb = mongoClient.db();
    const allUsers = await mongodb.collection('users').find().toArray();
    const familyGroups = await mongodb.collection('familygroups').find().toArray();

    /// Insert users
    await queryRunner.query(`
            INSERT INTO "users" (id, username, password, first_name, last_name)
            VALUES
                ${allUsers
                  .map(
                    ({ username, password, firstName, lastName }) =>
                      `(uuid_generate_v4(), '${username}', '${password}', '${firstName}', '${lastName}')`,
                  )
                  .join(',')}
        `);

    const owners = allUsers.filter((u) => familyGroups.some((g) => g.ownerId === u._id.toString()));
    const ownerIds = await queryRunner.query(`
            SELECT id FROM "users"
            WHERE username IN (${owners.map((u) => `'${u.username}'`).join(', ')})
    `);
    ///

    /// Insert family_groups
    await queryRunner.query(`
            INSERT INTO "family_groups" (id, owner_id)
            VALUES
                ${ownerIds
                  .map(({ id }: { id: string }) => `(uuid_generate_v4(), '${id}')`)
                  .join(',')}
        `);
    ///

    /// Insert group_members
    const groupWithOwner: Array<{ username: string; group_id: string }> = await queryRunner.query(`
      SELECT family_groups.id AS group_id, username
      FROM "family_groups"
      JOIN "users" ON users.id = family_groups.owner_id
    `);
    const users: Array<{ user_id: string; username: string }> = await queryRunner.query(`
      SELECT id AS user_id, username FROM users
    `);

    const groupMembers = familyGroups.reduce(
      (
        acc: Record<
          string,
          {
            members: { userId: string; isAccepted: boolean }[];
            ownerId: string;
          }
        >,
        group,
      ) => {
        const ownerName = allUsers.find((u) => u._id.toString() === group.ownerId)?.username;
        const groupId = groupWithOwner.find(({ username }) => username === ownerName)?.group_id;

        if (!groupId) {
          return acc;
        }

        return {
          ...acc,
          [groupId]: {
            ownerId: users.find(({ username }) => username === ownerName)?.user_id,
            members: allUsers
              .filter((u) => group.members.some((m: any) => m.userId === u._id.toString()))
              .map((u) => ({
                userId: users.find(({ username }) => username === u.username)?.user_id,
                isAccepted: !!group.members.find(
                  (m: { userId: string; isAccepted: boolean }) => m.userId === u._id.toString(),
                )?.isAccepted,
              })),
          },
        };
      },
      {},
    );

    for (const [groupId, { members, ownerId }] of Object.entries(groupMembers)) {
      for (const { userId, isAccepted } of members) {
        await queryRunner.query(`
              INSERT INTO "group_members" (id, group_id, user_id, is_accepted, is_owner)
              VALUES (uuid_generate_v4(), '${groupId}', '${userId}', ${isAccepted}, false)
        `);
      }
      await queryRunner.query(`
              INSERT INTO "group_members" (id, group_id, user_id, is_accepted, is_owner)
              VALUES (uuid_generate_v4(), '${groupId}', '${ownerId}', true, true)
        `);
    }
    ///

    /// Insert subscriptions
    const subscriptions = await mongodb.collection('subscriptions').find().toArray();

    for (const { userId, subscriptions: subs } of subscriptions) {
      const sub = subs[0];
      const username = allUsers.find((u) => u._id.toString() === userId)?.username;
      const { user_id } = users.find((u) => u.username === username)!;

      await queryRunner.query(`
            INSERT INTO "subscriptions" (id, user_id, endpoint, user_agent, keys)
            VALUES (uuid_generate_v4(), '${user_id}', '${sub.endpoint}', '${
        sub.userAgent
      }', '${JSON.stringify(sub.keys)}')
      `);
    }
    ///

    /// Insert groceries
    const groceries = await mongodb.collection('groceries').find().toArray();

    for (const grocery of groceries) {
      const username = allUsers.find((u) => u._id.toString() === grocery.userId)?.username;
      const { user_id } = users.find((u) => u.username === username)!;

      await queryRunner.query(`
            INSERT INTO "groceries" (id, user_id, name, status, priority)
            VALUES (uuid_generate_v4(), '${user_id}', '${grocery.name}', '${grocery.status}', '${grocery.priority}')
      `);
    }
    ///
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "users"
    `);
    await queryRunner.query(`
      DELETE FROM "family_groups"
    `);
    await queryRunner.query(`
      DELETE FROM "group_members"
    `);
    await queryRunner.query(`
      DELETE FROM "subscriptions"
    `);
    await queryRunner.query(`
      DELETE FROM "groceries"
    `);
  }
}
