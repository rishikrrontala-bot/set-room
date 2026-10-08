CREATE TABLE `saved_rooms` (
	`user_id` text NOT NULL,
	`room_code` text NOT NULL,
	`saved_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `room_code`),
	FOREIGN KEY (`room_code`) REFERENCES `rooms`(`code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `attempts` ADD `ended_at` integer;--> statement-breakpoint
CREATE INDEX `idx_attempts_room_history` ON `attempts` (`room_code`,`started_at`,`id`);