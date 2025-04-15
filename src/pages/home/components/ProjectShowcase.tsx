import React from 'react';
import ProjectCard from './ProjectCard';

// 定义项目数据
const projectData = [
  {
    id: 'sports',
    title: '运动培训',
    backgroundColor: '#3498db',
    gradientColors: 'linear-gradient(135deg, #5dade2, #85c1e9)',
    svgContent: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
        <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)"/>
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5 3"/>
        <path d="M30 25l-15 15c0 0 5 10 15 10s15-10 15-10l-15-15z" fill="#E53935" stroke="white" strokeWidth="1"/>
        <circle cx="30" cy="25" r="8" fill="#f5f5f5" stroke="#E53935" strokeWidth="1"/>
        <line x1="30" y1="25" x2="15" y2="40" stroke="#f5f5f5" strokeWidth="2"/>
        <circle cx="70" cy="35" r="10" fill="#FF9800" stroke="#E65100" strokeWidth="1"/>
        <path d="M62 30c5 5 11 5 16 0M62 40c5-5 11-5 16 0M70 25v20" stroke="#E65100" strokeWidth="1.5" fill="none"/>
        <circle cx="50" cy="65" r="7" fill="#f5f5f5"/>
        <path d="M50 72v10M40 77h20M45 82l-10 5M55 82l10 5" stroke="#f5f5f5" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M36 65h28" stroke="#f5f5f5" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'academic',
    title: '学科培训',
    backgroundColor: '#2980b9',
    gradientColors: 'linear-gradient(135deg, #7fb3d5, #a9cce3)',
    svgContent: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
        <path d="M20 30v50l30-5V25L20 30z" fill="#f5f5f5" stroke="#1565C0" strokeWidth="1.5"/>
        <path d="M80 30v50l-30-5V25L80 30z" fill="#e3f2fd" stroke="#1565C0" strokeWidth="1.5"/>
        <path d="M50 25v50" stroke="#1565C0" strokeWidth="1.5"/>
        <text x="30" y="40" fontFamily="Arial" fontSize="10" fill="#1565C0" fontWeight="bold">∑</text>
        <text x="30" y="55" fontFamily="Arial" fontSize="6" fill="#1565C0">y=2x+1</text>
        <text x="30" y="65" fontFamily="Arial" fontSize="10" fill="#1565C0">π</text>
        <circle cx="62" cy="42" r="5" fill="#42A5F5"/>
        <text x="62" y="45" fontFamily="Arial" fontSize="7" textAnchor="middle" fill="white" fontWeight="bold">A</text>
        <circle cx="73" cy="42" r="5" fill="#42A5F5"/>
        <text x="73" y="45" fontFamily="Arial" fontSize="7" textAnchor="middle" fill="white" fontWeight="bold">B</text>
        <circle cx="67" cy="55" r="5" fill="#42A5F5"/>
        <text x="67" y="58" fontFamily="Arial" fontSize="7" textAnchor="middle" fill="white" fontWeight="bold">C</text>
        <path d="M20 75l10-3M80 75l-10-3" stroke="#1565C0" strokeWidth="1"/>
        <rect x="35" y="70" width="8" height="10" rx="1" fill="#bbdefb" stroke="#1565C0" strokeWidth="0.5"/>
        <rect x="60" y="68" width="10" height="12" rx="1" fill="#bbdefb" stroke="#1565C0" strokeWidth="0.5"/>
        <line x1="61" y1="71" x2="69" y2="71" stroke="#1565C0" strokeWidth="0.5"/>
        <line x1="61" y1="74" x2="69" y2="74" stroke="#1565C0" strokeWidth="0.5"/>
        <line x1="61" y1="77" x2="69" y2="77" stroke="#1565C0" strokeWidth="0.5"/>
      </svg>
    )
  },
  {
    id: 'art',
    title: '艺术培训',
    backgroundColor: '#e74c3c',
    gradientColors: 'linear-gradient(135deg, #f1948a, #f5b7b1)',
    svgContent: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
        <rect x="20" y="20" width="60" height="60" rx="3" fill="rgba(255,255,255,0.1)"/>
        <line x1="25" y1="30" x2="45" y2="30" stroke="white" strokeWidth="1"/>
        <line x1="25" y1="35" x2="45" y2="35" stroke="white" strokeWidth="1"/>
        <line x1="25" y1="40" x2="45" y2="40" stroke="white" strokeWidth="1"/>
        <line x1="25" y1="45" x2="45" y2="45" stroke="white" strokeWidth="1"/>
        <line x1="25" y1="50" x2="45" y2="50" stroke="white" strokeWidth="1"/>
        <circle cx="30" cy="40" r="3" fill="white"/>
        <path d="M33 40v-12" stroke="white" strokeWidth="1.5"/>
        <path d="M33 28c0 0 2 0 3 1s0 3-2 3-3-2-2-3 3-1 3-1" fill="white"/>
        <circle cx="42" cy="35" r="3" fill="white"/>
        <path d="M45 35v-12" stroke="white" strokeWidth="1.5"/>
        <path d="M45 23c0 0 2 0 3 1s0 3-2 3-3-2-2-3 3-1 3-1" fill="white"/>
        <path d="M55 25c10 0 20 10 20 25s-10 25-20 25" fill="none" stroke="white" strokeWidth="1.5"/>
        <path d="M65 60c-3 3-10 0-15-5s-8-12-5-15 10 0 15 5 8 12 5 15z" fill="#FCE4EC" stroke="white" strokeWidth="1"/>
        <circle cx="55" cy="50" r="3" fill="#FF5252"/>
        <circle cx="60" cy="55" r="3" fill="#FFEB3B"/>
        <circle cx="65" cy="50" r="3" fill="#66BB6A"/>
        <path d="M65 30l5-5 2 2-5 5-3 1z" fill="#ffffff" stroke="#C2185B" strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: 'programming',
    title: '编程培训',
    backgroundColor: '#7f8c8d',
    gradientColors: 'linear-gradient(135deg, #aab7b8, #cacfd2)',
    svgContent: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
        <rect x="20" y="20" width="60" height="40" rx="2" fill="#f5f5f5" stroke="#cfd8dc" strokeWidth="1.5"/>
        <rect x="24" y="24" width="52" height="32" fill="#263238"/>
        <rect x="35" y="60" width="30" height="4" fill="#cfd8dc"/>
        <rect x="30" y="64" width="40" height="6" rx="2" fill="#eceff1"/>
        <rect x="45" y="70" width="10" height="5" fill="#cfd8dc"/>
        <rect x="30" y="75" width="40" height="2" rx="1" fill="#eceff1"/>
        <text x="28" y="30" fontFamily="monospace" fontSize="3.5" fill="#4caf50">function hello() {'{'}</text>
        <text x="30" y="36" fontFamily="monospace" fontSize="3.5" fill="#2196f3">  console.log("Hello");</text>
        <text x="28" y="42" fontFamily="monospace" fontSize="3.5" fill="#4caf50">{'}'}</text>
        <text x="28" y="48" fontFamily="monospace" fontSize="3.5" fill="#ff9800">hello();</text>
        <text x="65" y="35" fontFamily="monospace" fontSize="8" fill="#f44336">{'{}'}</text>
        <text x="65" y="45" fontFamily="monospace" fontSize="8" fill="#ffeb3b">;</text>
        <text x="55" y="53" fontFamily="monospace" fontSize="5" fill="#03a9f4">while()</text>
      </svg>
    )
  },
  {
    id: 'speech',
    title: '演讲口才',
    backgroundColor: '#9b59b6',
    gradientColors: 'linear-gradient(135deg, #bb8fce, #d2b4de)',
    svgContent: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
        <rect x="15" y="65" width="70" height="15" rx="2" fill="#ede7f6" stroke="#7b1fa2" strokeWidth="1"/>
        <rect x="25" y="60" width="50" height="5" fill="#d1c4e9"/>
        <rect x="48" y="35" width="4" height="20" fill="#e1bee7"/>
        <path d="M48 35a5 8 0 1 1 4 0" fill="#ce93d8"/>
        <path d="M50 55v10M45 62h10" stroke="#e1bee7" strokeWidth="2"/>
        <circle cx="50" cy="40" r="8" fill="#f5f5f5"/>
        <path d="M50 48v10M43 53h14M40 58c-5 5 0 10 10 10s15-5 10-10" fill="none" stroke="#f5f5f5" strokeWidth="2" strokeLinecap="round"/>
        <path d="M65 35c5-8-5-15-15-10-10-5-20 2-15 10-5 0-5 10 5 10h20c10 0 10-10 5-10z" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <text x="50" y="38" fontFamily="Arial" fontSize="5" textAnchor="middle" fill="white">A! B! C!</text>
        <circle cx="30" cy="80" r="3" fill="#f3e5f5"/>
        <circle cx="40" cy="80" r="3" fill="#f3e5f5"/>
        <circle cx="50" cy="80" r="3" fill="#f3e5f5"/>
        <circle cx="60" cy="80" r="3" fill="#f3e5f5"/>
        <circle cx="70" cy="80" r="3" fill="#f3e5f5"/>
      </svg>
    )
  },
  {
    id: 'thinking',
    title: '思维培训',
    backgroundColor: '#16a085',
    gradientColors: 'linear-gradient(135deg, #73c6b6, #a3e4d7)',
    svgContent: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
        <path d="M50 20c-15 0-25 10-25 25 0 10 5 20 25 30 20-10 25-20 25-30 0-15-10-25-25-25z" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M30 40c0 0 5-5 10-5s10 5 10 0-5-10 0-10" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M70 40c0 0-5-5-10-5s-10 5-10 0 5-10 0-10" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M40 60c0 0 5 5 10 0s5-10 10-5" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="35" cy="35" r="3" fill="#E0F2F1"/>
        <circle cx="50" cy="25" r="3" fill="#E0F2F1"/>
        <circle cx="65" cy="35" r="3" fill="#E0F2F1"/>
        <circle cx="40" cy="50" r="3" fill="#E0F2F1"/>
        <circle cx="60" cy="50" r="3" fill="#E0F2F1"/>
        <circle cx="50" cy="65" r="3" fill="#E0F2F1"/>
        <line x1="35" y1="35" x2="50" y2="25" stroke="#B2DFDB" strokeWidth="1"/>
        <line x1="50" y1="25" x2="65" y2="35" stroke="#B2DFDB" strokeWidth="1"/>
        <line x1="35" y1="35" x2="40" y2="50" stroke="#B2DFDB" strokeWidth="1"/>
        <line x1="65" y1="35" x2="60" y2="50" stroke="#B2DFDB" strokeWidth="1"/>
        <line x1="40" y1="50" x2="50" y2="65" stroke="#B2DFDB" strokeWidth="1"/>
        <line x1="60" y1="50" x2="50" y2="65" stroke="#B2DFDB" strokeWidth="1"/>
        <line x1="40" y1="50" x2="60" y2="50" stroke="#B2DFDB" strokeWidth="1"/>
        <circle cx="50" cy="40" r="6" fill="rgba(255,255,255,0.2)"/>
        <path d="M50 37v6M47 40h6" stroke="white" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'chinese',
    title: '国学培训',
    backgroundColor: '#d35400',
    gradientColors: 'linear-gradient(135deg, #f0b27a, #f5cba7)',
    svgContent: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
        <path d="M25 20c0 0-5 0-5 5v50c0 0 0 5 5 5h50c0 0 5 0 5-5V25c0 0 0-5-5-5h-7l2-7h-10l2 7h-25l2-7h-10l2 7z" fill="#FBE9E7" stroke="#FF5722" strokeWidth="1.5"/>
        <path d="M80 25v50c2-2 5-5 5-25s-3-23-5-25z" fill="#FBE9E7" stroke="#FF5722" strokeWidth="1.5"/>
        <path d="M20 25v50c-2-2-5-5-5-25s3-23 5-25z" fill="#FBE9E7" stroke="#FF5722" strokeWidth="1.5"/>
        <text x="35" y="38" fontFamily="KaiTi, SimSun" fontSize="16" fill="#BF360C">国学</text>
        <text x="65" y="38" fontFamily="KaiTi, SimSun" fontSize="16" fill="#BF360C">经典</text>
        <path d="M35 45c0 0 5 0 15 5s15 5 15 0" stroke="#BF360C" strokeWidth="2" fill="none"/>
        <path d="M35 55c0 0 5 0 15 5s15 5 15 0" stroke="#BF360C" strokeWidth="2" fill="none"/>
        <path d="M35 65c0 0 5 0 15 5s15 5 15 0" stroke="#BF360C" strokeWidth="2" fill="none"/>
        <rect x="55" y="60" width="15" height="15" fill="#FF5722" stroke="#BF360C" strokeWidth="1"/>
        <text x="62.5" y="71.5" fontFamily="KaiTi, SimSun" fontSize="11" fill="white" textAnchor="middle">印</text>
      </svg>
    )
  }
];

const ProjectShowcase: React.FC = () => {
  return (
    <section className="project-showcase">
      <div className="project-title">
        <h3>适用于各类校外培训机构</h3>
        <p>我们的系统可以灵活适应各种类型的培训机构需求，从学科教育到艺术培训和体育教学</p>
      </div>

      <div className="project-grid">
        {projectData.map(project => (
          <ProjectCard
            key={project.id}
            title={project.title}
            backgroundColor={project.backgroundColor}
            gradientColors={project.gradientColors}
            svgContent={project.svgContent}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectShowcase;
