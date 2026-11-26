import PublicSiteController from './PublicSiteController'
import ContactEnquiryController from './ContactEnquiryController'
import MarketingFeatureController from './MarketingFeatureController'
import TemplateController from './TemplateController'
const Admin = {
    PublicSiteController: Object.assign(PublicSiteController, PublicSiteController),
ContactEnquiryController: Object.assign(ContactEnquiryController, ContactEnquiryController),
MarketingFeatureController: Object.assign(MarketingFeatureController, MarketingFeatureController),
TemplateController: Object.assign(TemplateController, TemplateController),
}

export default Admin