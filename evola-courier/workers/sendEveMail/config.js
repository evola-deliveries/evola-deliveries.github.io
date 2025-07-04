import evolaConfig from '../../shared/config.js';

const rawOverride = process.env.SEND_EVE_MAIL_OVERRIDE_RECIPIENT_CHARACTER_ID;

const config = {
	override_recipient_character_id: (
		!rawOverride ||
		rawOverride.trim() === '' ||
		rawOverride.trim().toLowerCase() === 'false' ||
		rawOverride.trim().toLowerCase() === 'null'
	) ? null : rawOverride,
	send_mail_buffer: process.env.SEND_EVE_MAIL_SEND_MAIL_BUFFER,
	queue_limiter_max: process.env.SEND_EVE_MAIL_QUEUE_LIMITER_MAX,
	queue_limiter_duration: process.env.SEND_EVE_MAIL_QUEUE_LIMITER_DURATION,

	...evolaConfig
};

export default config;
