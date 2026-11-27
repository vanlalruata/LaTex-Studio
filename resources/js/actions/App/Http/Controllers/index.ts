import PublicSite from './PublicSite'
import DashboardController from './DashboardController'
import ProjectController from './ProjectController'
import ProjectFileController from './ProjectFileController'
import ProjectRevisionController from './ProjectRevisionController'
import ProjectIndexController from './ProjectIndexController'
import CompilationController from './CompilationController'
import ProjectTaskController from './ProjectTaskController'
import ProjectMilestoneController from './ProjectMilestoneController'
import ProjectIntegrationController from './ProjectIntegrationController'
import ResearchAssetController from './ResearchAssetController'
import BibliographyController from './BibliographyController'
import OcrJobController from './OcrJobController'
import ConversionJobController from './ConversionJobController'
import AnnotationController from './AnnotationController'
import PresenceController from './PresenceController'
import ProjectMemberController from './ProjectMemberController'
import CommentController from './CommentController'
import SuggestionController from './SuggestionController'
import ProjectChatController from './ProjectChatController'
import TableDesignController from './TableDesignController'
import FigureController from './FigureController'
import FigureRenderController from './FigureRenderController'
import FigureCommentController from './FigureCommentController'
import EquationController from './EquationController'
import AiAssistantController from './AiAssistantController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    PublicSite: Object.assign(PublicSite, PublicSite),
DashboardController: Object.assign(DashboardController, DashboardController),
ProjectController: Object.assign(ProjectController, ProjectController),
ProjectFileController: Object.assign(ProjectFileController, ProjectFileController),
ProjectRevisionController: Object.assign(ProjectRevisionController, ProjectRevisionController),
ProjectIndexController: Object.assign(ProjectIndexController, ProjectIndexController),
CompilationController: Object.assign(CompilationController, CompilationController),
ProjectTaskController: Object.assign(ProjectTaskController, ProjectTaskController),
ProjectMilestoneController: Object.assign(ProjectMilestoneController, ProjectMilestoneController),
ProjectIntegrationController: Object.assign(ProjectIntegrationController, ProjectIntegrationController),
ResearchAssetController: Object.assign(ResearchAssetController, ResearchAssetController),
BibliographyController: Object.assign(BibliographyController, BibliographyController),
OcrJobController: Object.assign(OcrJobController, OcrJobController),
ConversionJobController: Object.assign(ConversionJobController, ConversionJobController),
AnnotationController: Object.assign(AnnotationController, AnnotationController),
PresenceController: Object.assign(PresenceController, PresenceController),
ProjectMemberController: Object.assign(ProjectMemberController, ProjectMemberController),
CommentController: Object.assign(CommentController, CommentController),
SuggestionController: Object.assign(SuggestionController, SuggestionController),
ProjectChatController: Object.assign(ProjectChatController, ProjectChatController),
TableDesignController: Object.assign(TableDesignController, TableDesignController),
FigureController: Object.assign(FigureController, FigureController),
FigureRenderController: Object.assign(FigureRenderController, FigureRenderController),
FigureCommentController: Object.assign(FigureCommentController, FigureCommentController),
EquationController: Object.assign(EquationController, EquationController),
AiAssistantController: Object.assign(AiAssistantController, AiAssistantController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers