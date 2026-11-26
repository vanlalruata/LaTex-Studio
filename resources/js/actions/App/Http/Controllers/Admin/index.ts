import PublicSiteController from './PublicSiteController'
import ContactEnquiryController from './ContactEnquiryController'
const Admin = {
    PublicSiteController: Object.assign(PublicSiteController, PublicSiteController),
ContactEnquiryController: Object.assign(ContactEnquiryController, ContactEnquiryController),
}

export default Admin