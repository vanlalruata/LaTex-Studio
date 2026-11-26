import PublicSite from './PublicSite'
import DashboardController from './DashboardController'
import ProjectController from './ProjectController'
import ProjectFileController from './ProjectFileController'
import ProjectRevisionController from './ProjectRevisionController'
import ProjectIndexController from './ProjectIndexController'
import CompilationController from './CompilationController'
import ProjectMemberController from './ProjectMemberController'
import CommentController from './CommentController'
import SuggestionController from './SuggestionController'
import ProjectChatController from './ProjectChatController'
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
ProjectMemberController: Object.assign(ProjectMemberController, ProjectMemberController),
CommentController: Object.assign(CommentController, CommentController),
SuggestionController: Object.assign(SuggestionController, SuggestionController),
ProjectChatController: Object.assign(ProjectChatController, ProjectChatController),
AiAssistantController: Object.assign(AiAssistantController, AiAssistantController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers