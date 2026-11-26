import DashboardController from './DashboardController'
import ProjectController from './ProjectController'
import ProjectFileController from './ProjectFileController'
import ProjectRevisionController from './ProjectRevisionController'
import CompilationController from './CompilationController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
ProjectController: Object.assign(ProjectController, ProjectController),
ProjectFileController: Object.assign(ProjectFileController, ProjectFileController),
ProjectRevisionController: Object.assign(ProjectRevisionController, ProjectRevisionController),
CompilationController: Object.assign(CompilationController, CompilationController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers