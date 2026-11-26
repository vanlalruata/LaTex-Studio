import PublicSiteController from './PublicSiteController'
import ContactEnquiryController from './ContactEnquiryController'
import MarketingFeatureController from './MarketingFeatureController'
const Admin = {
    PublicSiteController: Object.assign(PublicSiteController, PublicSiteController),
ContactEnquiryController: Object.assign(ContactEnquiryController, ContactEnquiryController),
MarketingFeatureController: Object.assign(MarketingFeatureController, MarketingFeatureController),
}

export default Admin