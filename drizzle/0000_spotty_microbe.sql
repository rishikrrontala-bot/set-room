CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`room_code` text NOT NULL,
	`class_name` text NOT NULL,
	`day` text NOT NULL,
	`target` integer NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`elapsed_ms` integer,
	`answers` text,
	FOREIGN KEY (`room_code`) REFERENCES `rooms`(`code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_attempts_room_day_target` ON `attempts` (`room_code`,`day`,`target`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`classes` text NOT NULL,
	`created_at` integer NOT NULL
);
