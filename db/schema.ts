import { integer, sqliteTable, text, index, primaryKey } from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('rooms',{code:text('code').primaryKey(),name:text('name').notNull(),classes:text('classes').notNull(),createdAt:integer('created_at').notNull()});
export const attempts=sqliteTable('attempts',{id:text('id').primaryKey(),roomCode:text('room_code').notNull().references(()=>rooms.code),className:text('class_name').notNull(),day:text('day').notNull(),target:integer('target').notNull(),gameMode:text('game_mode').notNull().default('refill'),startedAt:integer('started_at').notNull(),finishedAt:integer('finished_at'),endedAt:integer('ended_at'),elapsedMs:integer('elapsed_ms'),answers:text('answers'),state:text('state')},table=>[index('idx_attempts_room_day_target').on(table.roomCode,table.day,table.target),index('idx_attempts_room_history').on(table.roomCode,table.startedAt,table.id)]);
export const savedRooms=sqliteTable('saved_rooms',{userId:text('user_id').notNull(),roomCode:text('room_code').notNull().references(()=>rooms.code),savedAt:integer('saved_at').notNull()},table=>[primaryKey({columns:[table.userId,table.roomCode]})]);

export * from './auth-schema';
