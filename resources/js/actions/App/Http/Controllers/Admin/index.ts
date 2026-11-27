import PublicSiteController from './PublicSiteController'
import ContactEnquiryController from './ContactEnquiryController'
import MarketingFeatureController from './MarketingFeatureController'
import TemplateController from './TemplateController'
import OverviewController from './OverviewController'
import UserController from './UserController'
import ProjectController from './ProjectController'
import OrganizationController from './OrganizationController'
import AuditController from './AuditController'
import UsageController from './UsageController'
import CompilerSettingsController from './CompilerSettingsController'
import BuildQueueController from './BuildQueueController'
import InstitutionalDomainController from './InstitutionalDomainController'

const Admin = {
    PublicSiteController: Object.assign(PublicSiteController, PublicSiteController),
    ContactEnquiryController: Object.assign(ContactEnquiryController, ContactEnquiryController),
    MarketingFeatureController: Object.assign(MarketingFeatureController, MarketingFeatureController),
    TemplateController: Object.assign(TemplateController, TemplateController),
    OverviewController: Object.assign(OverviewController, OverviewController),
    UserController: Object.assign(UserController, UserController),
    ProjectController: Object.assign(ProjectController, ProjectController),
    OrganizationController: Object.assign(OrganizationController, OrganizationController),
    AuditController: Object.assign(AuditController, AuditController),
    UsageController: Object.assign(UsageController, UsageController),
    CompilerSettingsController: Object.assign(CompilerSettingsController, CompilerSettingsController),
    BuildQueueController: Object.assign(BuildQueueController, BuildQueueController),
    InstitutionalDomainController: Object.assign(InstitutionalDomainController, InstitutionalDomainController),
}

export default Admin