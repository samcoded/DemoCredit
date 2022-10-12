import { Knex } from 'knex';
import { hashPassword } from '../../utils/bcrypt';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('wallets').del();
    await knex('users').del();

    // Inserts seed entries
    await knex('users').insert([
        {
            id: 1,
            name: 'John Doe',
            email: 'john@gmail.com',
            password: await hashPassword('123456'),
        },
        {
            id: 2,
            name: 'Mike Phelan',
            email: 'mike@gmail.com',
            password: await hashPassword('123456'),
        },
        {
            id: 3,
            name: 'Jane Mark',
            email: 'jane@gmail.com',
            password: await hashPassword('123456'),
        },
    ]);

    await knex('wallets').insert([
        {
            id: 1,
            user_id: 1,
            amount: 0,
        },
        {
            id: 2,
            user_id: 2,
            amount: 0,
        },
        {
            id: 3,
            user_id: 3,
            amount: 0,
        },
    ]);
}
