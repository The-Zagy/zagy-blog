import clsx from "clsx";
export interface ProjectCardMeta  {
    thumbnail: string;
    name: string;
    description: string;
    link: string;
}
const ProjectCard: React.FC<ProjectCardMeta & {direction: number}> = (projectMeta) => {
    const cardFlexDirection = projectMeta.direction % 2 != 0;
    return (
        <div 
        className={clsx("projectCard flex w-11/12 lg:w-4/6 m-auto my-14  justify-between gap-4 shadow-sm border dark:border-dark-muted-500 hover:shadow-lg hover:translate-y-px transition-all border-gray-100", {"flex-row-reverse": cardFlexDirection})}
        key={projectMeta.name}
        >
            <div
            className="thumDiv w-1/3"
            >
                <img src={projectMeta.thumbnail} alt="project-thumbnail" className="w-full h-full"/>
            </div>

            <div
            className="projectInfo flex flex-col justify-between w-4/6"
            >
                <h3
                key={projectMeta.name}
                className="projectName text-left text-4xl italic my-2 text-"
                >
                    {projectMeta.name}
                </h3>
                <p
                className="projectDisc "
                >
                    {projectMeta.description}
                </p>
                <a
                href={projectMeta.link}
                className="projectLink my-6 text-dark-secondary-600"
                >
                    check more information here
                </a>
            </div>
        </div>
    );
}
export default ProjectCard;