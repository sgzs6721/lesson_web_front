import React from 'react';

interface ProjectCardProps {
  title: string;
  backgroundColor: string;
  gradientColors: string;
  svgContent: React.ReactNode;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  backgroundColor, 
  gradientColors, 
  svgContent 
}) => {
  return (
    <div className="project-card">
      <div className="project-card-img" style={{ background: gradientColors }}>
        {svgContent}
      </div>
      <div className="project-card-title" style={{ backgroundColor }}>
        <h4>{title}</h4>
      </div>
    </div>
  );
};

export default ProjectCard;
