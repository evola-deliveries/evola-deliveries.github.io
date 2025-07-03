import evolaConfig from '../../shared/config.js';

const rawOverride = process.env.SEND_EVE_MAIL_OVERRIDE_RECIPIENT_CHARACTER_ID;

const config = {
	override_recipient_character_id: (
		!rawOverride ||
		rawOverride.trim() === '' ||
		rawOverride.trim().toLowerCase() === 'false' ||
		rawOverride.trim().toLowerCase() === 'null'
	) ? null : rawOverride,

	...evolaConfig
};

export default config;
