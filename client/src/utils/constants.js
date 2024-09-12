export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "/api/auth"

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE = `${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMG = `${AUTH_ROUTES}/add-profile-img`
export const REMOVE_PROFILE_IMG = `${AUTH_ROUTES}/remove-profile-img`
export const LOGOUT = `${AUTH_ROUTES}/logout`


export const CONTACT_ROUTES = "/api/contacts"
export const SEARCH_CONTACT = `${CONTACT_ROUTES}/search`
export const GET_CONTACT_LIST = `${CONTACT_ROUTES}/get-contact-for-dm`


export const MESSAGE_ROUTES = "/api/message"
export const GET_MESSAGES = `${MESSAGE_ROUTES}/get-messages`

