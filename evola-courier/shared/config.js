const config = {
    evola_eve_corporation_id: process.env.EVOLA_EVE_CORPORATION_ID,
    evola_eve_character_id: process.env.EVOLA_EVE_CHARACTER_ID,

    directus_api_url: process.env.DIRECTUS_API_URL,
    directus_token: process.env.DIRECTUS_TOKEN,
    
    eve_esi_client_id: process.env.EVOLA_EVE_ESI_CLIENT_ID,
    eve_esi_client_secret: process.env.EVOLA_EVE_ESI_CLIENT_SECRET,    
    eve_esi_refresh_token: process.env.EVOLA_EVE_ESI_REFRESH_TOKEN,

    esi_user_agent_email: process.env.ESI_USER_AGENT_EMAIL,
    esi_user_agent_app: process.env.ESI_USER_AGENT_APP,
    esi_user_agent_source: process.env.ESI_USER_AGENT_SOURCE,
    esi_user_agent_discord: process.env.ESI_USER_AGENT_DISCORD,
    esi_user_agent_eve: process.env.ESI_USER_AGENT_EVE,
}

export default config;