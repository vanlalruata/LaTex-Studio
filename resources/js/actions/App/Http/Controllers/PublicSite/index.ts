import HomeController from './HomeController'
import FeatureController from './FeatureController'
import HowItWorksController from './HowItWorksController'
import TemplateController from './TemplateController'
import AboutController from './AboutController'
import FaqController from './FaqController'
import LegalController from './LegalController'
const PublicSite = {
    HomeController: Object.assign(HomeController, HomeController),
FeatureController: Object.assign(FeatureController, FeatureController),
HowItWorksController: Object.assign(HowItWorksController, HowItWorksController),
TemplateController: Object.assign(TemplateController, TemplateController),
AboutController: Object.assign(AboutController, AboutController),
FaqController: Object.assign(FaqController, FaqController),
LegalController: Object.assign(LegalController, LegalController),
}

export default PublicSite