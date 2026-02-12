export type ProfileDto = {
	name: string | null
	username: string | null
	email: string
	avatarURL: string | null
}

export type UpdateProfilePayload = {
	name: string
	username: string
}
