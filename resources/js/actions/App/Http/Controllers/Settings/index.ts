import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import AiCredentialController from './AiCredentialController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
SecurityController: Object.assign(SecurityController, SecurityController),
AiCredentialController: Object.assign(AiCredentialController, AiCredentialController),
}

export default Settings