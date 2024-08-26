import type { Knex } from "knex";

export async function up(knex: Knex) {
    await knex.schema.createTable('categories', table => {
        table.increments('id').primary();
        table.string('imagePath').notNullable();
        table.string('name').notNullable();
    });

    await knex.schema.createTable('subCategories', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('categoryId').unsigned().notNullable();
        table.foreign('categoryId').references('categories.id').onDelete('cascade');
    });

    await knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('firstName').notNullable();
        table.string('lastName').notNullable();
        table.string('email').unique().notNullable();
        table.string('hash').notNullable();
        table.enu('role', ['user', 'admin']).defaultTo('user');
        table.string('phoneNumber').nullable();
        table.boolean('receiveUpdates').defaultTo(false);
        table.boolean('rememberMe').defaultTo(false);
        table.string('imagePath').defaultTo('/profile-images/no-profile-image.png');
    });

    await knex.schema.createTable('products', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('price').notNullable();
        table.text('description').notNullable();
        table.integer('categoryId').unsigned().notNullable();
        table.integer('subcategoryId').unsigned().notNullable();
        table.integer('views').defaultTo(0);
        table.integer('likes').defaultTo(0);
        table.integer('dislikes').defaultTo(0);
        table.integer('favourites').defaultTo(0);
        table.string('imagePath').notNullable();
        table.foreign('categoryId').references('categories.id').onDelete('cascade');
        table.foreign('subcategoryId').references('subCategories.id').onDelete('cascade');
    });

    await knex.schema.createTable('characteristicKeys', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('subcategoryId').unsigned().notNullable();
        table.foreign('subcategoryId').references('subCategories.id').onDelete('cascade');
    });

    await knex.schema.createTable('characteristicValues', table => {
        table.increments('id').primary();
        table.string('value').notNullable();
        table.integer('keyId').unsigned().notNullable();
        table.foreign('keyId').references('characteristicKeys.id').onDelete('cascade');
    });

    await knex.schema.createTable('characteristics', table => {
        table.increments('id').primary();
        table.integer('productId').unsigned().notNullable(); 
        table.string('key').notNullable();
        table.string('value').notNullable();
        table.foreign('productId').references('products.id').onDelete('cascade');
    });

    await knex.schema.createTable('priceInMonth', table => {
        table.increments('id').primary();
        table.string('month').notNullable();
        table.decimal('price').notNullable();
        table.integer('productId').unsigned().notNullable(); 
        table.foreign('productId').references('products.id').onDelete('cascade');
    });

    await knex.schema.createTable('comments', table => {
        table.increments('id').primary();
        table.text('content').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.integer('productId').unsigned().notNullable(); 
        table.integer('userId').unsigned().notNullable(); 
        table.foreign('productId').references('products.id').onDelete('cascade');
        table.foreign('userId').references('users.id').onDelete('cascade');
    });

    await knex.schema.createTable('usersFavourites', table => {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable(); 
        table.integer('productId').unsigned().notNullable(); 
        table.foreign('userId').references('users.id').onDelete('cascade');
        table.foreign('productId').references('products.id').onDelete('cascade');
    });
}

export async function down(knex: Knex) {
    await knex.schema.dropTableIfExists('usersFavourites');
    await knex.schema.dropTableIfExists('comments');
    await knex.schema.dropTableIfExists('priceInMonth');
    await knex.schema.dropTableIfExists('characteristics');
    await knex.schema.dropTableIfExists('characteristicValues');
    await knex.schema.dropTableIfExists('characteristicKeys');
    await knex.schema.dropTableIfExists('products');
    await knex.schema.dropTableIfExists('users');
    await knex.schema.dropTableIfExists('subCategories');
    await knex.schema.dropTableIfExists('categories');
}
