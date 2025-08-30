import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, FaCheckCircle, FaClock, FaRocket,
  FaCode, FaDesktop, FaMobile, FaDatabase, FaCloud,
  FaChartLine, FaBug, FaCogs, FaUsers, FaFileAlt,
  FaPaintBrush, FaSearch, FaShieldAlt, FaTrophy,
  FaExclamationTriangle, FaPlay, FaPause, FaCheck
} from 'react-icons/fa';
import './ProjectTimeline.css';

interface Milestone {
  id: number;
  week: number;
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  icon: React.ReactNode;
  deliverables: string[];
  description: string;
  progress: number;
  team: string[];
  dependencies?: number[];
  criticalPath?: boolean;
}

interface Project {
  id: string;
  name: string;
  duration: string;
  budget: string;
  client: string;
  type: string;
  milestones: Milestone[];
}

const sampleProjects: Project[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Platform',
    duration: '12 weeks',
    budget: '$7,500',
    client: 'Fashion Retailer',
    type: 'Full-Stack Development',
    milestones: [
      {
        id: 1,
        week: 1,
        title: 'Project Kickoff & Discovery',
        date: 'Week 1',
        status: 'completed',
        icon: <FaRocket />,
        progress: 100,
        deliverables: [
          'Requirements document',
          'Technical specifications',
          'Project timeline',
          'Resource allocation'
        ],
        description: 'Initial project setup, requirements gathering, and stakeholder alignment.',
        team: ['Project Manager', 'Lead Developer', 'UX Designer'],
        criticalPath: true
      },
      {
        id: 2,
        week: 2,
        title: 'UI/UX Design',
        date: 'Week 2-3',
        status: 'completed',
        icon: <FaPaintBrush />,
        progress: 100,
        deliverables: [
          'Wireframes',
          'Design mockups',
          'Style guide',
          'Interactive prototype'
        ],
        description: 'Creating user interface designs and user experience flow.',
        team: ['UX Designer', 'UI Designer'],
        dependencies: [1]
      },
      {
        id: 3,
        week: 4,
        title: 'Database Architecture',
        date: 'Week 4',
        status: 'completed',
        icon: <FaDatabase />,
        progress: 100,
        deliverables: [
          'Database schema',
          'ER diagrams',
          'Data migration plan',
          'Backup strategy'
        ],
        description: 'Designing and implementing database structure.',
        team: ['Backend Developer', 'Database Admin'],
        dependencies: [1],
        criticalPath: true
      },
      {
        id: 4,
        week: 5,
        title: 'Backend Development',
        date: 'Week 5-7',
        status: 'in-progress',
        icon: <FaCode />,
        progress: 65,
        deliverables: [
          'API endpoints',
          'Authentication system',
          'Payment integration',
          'Admin panel'
        ],
        description: 'Building server-side logic and API development.',
        team: ['Backend Developer', 'DevOps Engineer'],
        dependencies: [3],
        criticalPath: true
      },
      {
        id: 5,
        week: 6,
        title: 'Frontend Development',
        date: 'Week 6-8',
        status: 'in-progress',
        icon: <FaDesktop />,
        progress: 45,
        deliverables: [
          'Product catalog',
          'Shopping cart',
          'Checkout flow',
          'User dashboard'
        ],
        description: 'Implementing user interface and client-side functionality.',
        team: ['Frontend Developer', 'UI Developer'],
        dependencies: [2, 4]
      },
      {
        id: 6,
        week: 9,
        title: 'Integration Testing',
        date: 'Week 9',
        status: 'upcoming',
        icon: <FaBug />,
        progress: 0,
        deliverables: [
          'Test cases',
          'Bug reports',
          'Performance metrics',
          'Security audit'
        ],
        description: 'Comprehensive testing of all features and integrations.',
        team: ['QA Engineer', 'Security Specialist'],
        dependencies: [4, 5]
      },
      {
        id: 7,
        week: 10,
        title: 'Performance Optimization',
        date: 'Week 10',
        status: 'upcoming',
        icon: <FaChartLine />,
        progress: 0,
        deliverables: [
          'Performance report',
          'Optimization recommendations',
          'CDN setup',
          'Caching strategy'
        ],
        description: 'Optimizing application performance and load times.',
        team: ['Performance Engineer', 'DevOps'],
        dependencies: [6]
      },
      {
        id: 8,
        week: 11,
        title: 'Deployment & Training',
        date: 'Week 11',
        status: 'upcoming',
        icon: <FaCloud />,
        progress: 0,
        deliverables: [
          'Production deployment',
          'User training materials',
          'Admin documentation',
          'Support guidelines'
        ],
        description: 'Deploying to production and training client team.',
        team: ['DevOps', 'Technical Writer', 'Trainer'],
        dependencies: [7],
        criticalPath: true
      },
      {
        id: 9,
        week: 12,
        title: 'Project Handover',
        date: 'Week 12',
        status: 'upcoming',
        icon: <FaTrophy />,
        progress: 0,
        deliverables: [
          'Source code delivery',
          'Technical documentation',
          'Maintenance guide',
          'Final report'
        ],
        description: 'Final project delivery and handover to client.',
        team: ['Project Manager', 'Lead Developer'],
        dependencies: [8],
        criticalPath: true
      }
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile Banking App',
    duration: '10 weeks',
    budget: '$5,500',
    client: 'FinTech Startup',
    type: 'Mobile Development',
    milestones: [
      {
        id: 1,
        week: 1,
        title: 'Requirements Analysis',
        date: 'Week 1',
        status: 'completed',
        icon: <FaSearch />,
        progress: 100,
        deliverables: [
          'Functional requirements',
          'Security requirements',
          'Compliance checklist',
          'User stories'
        ],
        description: 'Analyzing requirements and compliance needs.',
        team: ['Business Analyst', 'Security Expert'],
        criticalPath: true
      },
      {
        id: 2,
        week: 2,
        title: 'Security Architecture',
        date: 'Week 2',
        status: 'completed',
        icon: <FaShieldAlt />,
        progress: 100,
        deliverables: [
          'Security framework',
          'Encryption strategy',
          'Authentication flow',
          'Compliance documentation'
        ],
        description: 'Designing security architecture for banking compliance.',
        team: ['Security Architect', 'Compliance Officer'],
        dependencies: [1],
        criticalPath: true
      },
      {
        id: 3,
        week: 3,
        title: 'Mobile UI Design',
        date: 'Week 3-4',
        status: 'in-progress',
        icon: <FaMobile />,
        progress: 75,
        deliverables: [
          'Mobile wireframes',
          'iOS designs',
          'Android designs',
          'Design system'
        ],
        description: 'Creating mobile-first user interface designs.',
        team: ['Mobile Designer', 'UX Researcher'],
        dependencies: [1]
      },
      {
        id: 4,
        week: 5,
        title: 'Core Banking Features',
        date: 'Week 5-7',
        status: 'upcoming',
        icon: <FaCogs />,
        progress: 0,
        deliverables: [
          'Account management',
          'Transaction history',
          'Fund transfers',
          'Bill payments'
        ],
        description: 'Implementing core banking functionalities.',
        team: ['Mobile Developer', 'Backend Developer'],
        dependencies: [2, 3],
        criticalPath: true
      }
    ]
  }
];

const ProjectTimeline: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project>(sampleProjects[0]);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'gantt' | 'kanban'>('timeline');
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'upcoming'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'upcoming': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FaCheckCircle />;
      case 'in-progress': return <FaClock />;
      case 'upcoming': return <FaCalendarAlt />;
      default: return <FaCalendarAlt />;
    }
  };

  const filteredMilestones = filter === 'all' 
    ? selectedProject.milestones 
    : selectedProject.milestones.filter(m => m.status === filter);

  const overallProgress = Math.round(
    selectedProject.milestones.reduce((sum, m) => sum + m.progress, 0) / 
    selectedProject.milestones.length
  );

  const renderTimelineView = () => (
    <div className="timeline-view">
      <div className="timeline-line" />
      {filteredMilestones.map((milestone, index) => (
        <motion.div
          key={milestone.id}
          className={`timeline-item ${milestone.status} ${milestone.criticalPath ? 'critical' : ''}`}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          onClick={() => setSelectedMilestone(milestone)}
        >
          <div className="timeline-marker">
            <div className="marker-icon" style={{ backgroundColor: getStatusColor(milestone.status) }}>
              {milestone.icon}
            </div>
            {milestone.criticalPath && <span className="critical-badge">Critical Path</span>}
          </div>
          
          <motion.div 
            className="timeline-content"
            whileHover={{ scale: 1.02 }}
          >
            <div className="milestone-header">
              <h3>{milestone.title}</h3>
              <span className="milestone-date">{milestone.date}</span>
            </div>
            
            <p className="milestone-description">{milestone.description}</p>
            
            <div className="milestone-progress">
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${milestone.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                  style={{ backgroundColor: getStatusColor(milestone.status) }}
                />
              </div>
              <span className="progress-text">{milestone.progress}%</span>
            </div>

            <div className="milestone-meta">
              <div className="deliverables-count">
                <FaFileAlt />
                <span>{milestone.deliverables.length} Deliverables</span>
              </div>
              <div className="team-count">
                <FaUsers />
                <span>{milestone.team.length} Team Members</span>
              </div>
              <div className="status-badge" style={{ color: getStatusColor(milestone.status) }}>
                {getStatusIcon(milestone.status)}
                <span>{milestone.status.replace('-', ' ')}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );

  const renderGanttView = () => (
    <div className="gantt-view">
      <div className="gantt-header">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="gantt-week">Week {i + 1}</div>
        ))}
      </div>
      <div className="gantt-body">
        {selectedProject.milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            className="gantt-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="gantt-task-info">
              <span className="task-icon">{milestone.icon}</span>
              <span className="task-title">{milestone.title}</span>
            </div>
            <div className="gantt-bars">
              <motion.div
                className={`gantt-bar ${milestone.status}`}
                style={{
                  left: `${((milestone.week - 1) / 12) * 100}%`,
                  width: `${(parseInt(milestone.date.includes('-') ? 
                    milestone.date.split('-')[1].match(/\d+/)?.[0] || '1' : '1') / 12) * 100}%`,
                  backgroundColor: getStatusColor(milestone.status)
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedMilestone(milestone)}
              >
                <div className="gantt-progress" style={{ width: `${milestone.progress}%` }} />
                <span className="gantt-label">{milestone.progress}%</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderKanbanView = () => (
    <div className="kanban-view">
      <div className="kanban-column">
        <div className="kanban-header completed">
          <FaCheckCircle />
          <h3>Completed</h3>
          <span className="kanban-count">
            {selectedProject.milestones.filter(m => m.status === 'completed').length}
          </span>
        </div>
        <div className="kanban-cards">
          {selectedProject.milestones
            .filter(m => m.status === 'completed')
            .map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className="kanban-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedMilestone(milestone)}
              >
                <div className="card-header">
                  <span className="card-icon">{milestone.icon}</span>
                  <span className="card-week">Week {milestone.week}</span>
                </div>
                <h4>{milestone.title}</h4>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="card-footer">
                  <span className="deliverables">{milestone.deliverables.length} items</span>
                  <FaCheck className="check-icon" />
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      <div className="kanban-column">
        <div className="kanban-header in-progress">
          <FaClock />
          <h3>In Progress</h3>
          <span className="kanban-count">
            {selectedProject.milestones.filter(m => m.status === 'in-progress').length}
          </span>
        </div>
        <div className="kanban-cards">
          {selectedProject.milestones
            .filter(m => m.status === 'in-progress')
            .map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className="kanban-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedMilestone(milestone)}
              >
                <div className="card-header">
                  <span className="card-icon">{milestone.icon}</span>
                  <span className="card-week">Week {milestone.week}</span>
                </div>
                <h4>{milestone.title}</h4>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill in-progress" 
                      style={{ width: `${milestone.progress}%` }} 
                    />
                  </div>
                  <span className="progress-percent">{milestone.progress}%</span>
                </div>
                <div className="card-footer">
                  <span className="deliverables">{milestone.deliverables.length} items</span>
                  <FaClock className="clock-icon" />
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      <div className="kanban-column">
        <div className="kanban-header upcoming">
          <FaCalendarAlt />
          <h3>Upcoming</h3>
          <span className="kanban-count">
            {selectedProject.milestones.filter(m => m.status === 'upcoming').length}
          </span>
        </div>
        <div className="kanban-cards">
          {selectedProject.milestones
            .filter(m => m.status === 'upcoming')
            .map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className="kanban-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedMilestone(milestone)}
              >
                <div className="card-header">
                  <span className="card-icon">{milestone.icon}</span>
                  <span className="card-week">Week {milestone.week}</span>
                </div>
                <h4>{milestone.title}</h4>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '0%' }} />
                  </div>
                </div>
                <div className="card-footer">
                  <span className="deliverables">{milestone.deliverables.length} items</span>
                  <FaCalendarAlt className="calendar-icon" />
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="project-timeline">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Project Timeline & Milestones</h2>
          <p>Track project progress with detailed milestones and deliverables</p>
        </motion.div>

        <motion.div 
          className="timeline-controls"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="project-selector">
            <select 
              value={selectedProject.id} 
              onChange={(e) => setSelectedProject(sampleProjects.find(p => p.id === e.target.value) || sampleProjects[0])}
            >
              {sampleProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.client}
                </option>
              ))}
            </select>
          </div>

          <div className="view-toggles">
            <button 
              className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </button>
            <button 
              className={`view-btn ${viewMode === 'gantt' ? 'active' : ''}`}
              onClick={() => setViewMode('gantt')}
            >
              Gantt Chart
            </button>
            <button 
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              Kanban Board
            </button>
          </div>

          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilter('in-progress')}
            >
              In Progress
            </button>
            <button 
              className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="project-overview"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="overview-card">
            <h3>{selectedProject.name}</h3>
            <div className="overview-details">
              <div className="detail-item">
                <FaUsers />
                <span>Client: {selectedProject.client}</span>
              </div>
              <div className="detail-item">
                <FaClock />
                <span>Duration: {selectedProject.duration}</span>
              </div>
              <div className="detail-item">
                <FaChartLine />
                <span>Budget: {selectedProject.budget}</span>
              </div>
              <div className="detail-item">
                <FaCogs />
                <span>Type: {selectedProject.type}</span>
              </div>
            </div>
            <div className="overall-progress">
              <span>Overall Progress</span>
              <div className="progress-bar large">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="progress-percent">{overallProgress}%</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="timeline-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {viewMode === 'timeline' && renderTimelineView()}
          {viewMode === 'gantt' && renderGanttView()}
          {viewMode === 'kanban' && renderKanbanView()}
        </motion.div>

        <AnimatePresence>
          {selectedMilestone && (
            <motion.div 
              className="milestone-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMilestone(null)}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="close-btn"
                  onClick={() => setSelectedMilestone(null)}
                >
                  ×
                </button>
                
                <div className="modal-header">
                  <div className="milestone-icon" style={{ color: getStatusColor(selectedMilestone.status) }}>
                    {selectedMilestone.icon}
                  </div>
                  <div>
                    <h2>{selectedMilestone.title}</h2>
                    <span className={`status-tag ${selectedMilestone.status}`}>
                      {selectedMilestone.status.replace('-', ' ')}
                    </span>
                    {selectedMilestone.criticalPath && (
                      <span className="critical-tag">Critical Path</span>
                    )}
                  </div>
                </div>

                <p className="modal-description">{selectedMilestone.description}</p>

                <div className="modal-section">
                  <h3>Deliverables</h3>
                  <ul className="deliverables-list">
                    {selectedMilestone.deliverables.map((item, index) => (
                      <li key={index}>
                        <FaCheckCircle style={{ color: getStatusColor(selectedMilestone.status) }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="modal-section">
                  <h3>Team Members</h3>
                  <div className="team-tags">
                    {selectedMilestone.team.map((member, index) => (
                      <span key={index} className="team-tag">{member}</span>
                    ))}
                  </div>
                </div>

                <div className="modal-progress">
                  <h3>Progress</h3>
                  <div className="progress-bar large">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${selectedMilestone.progress}%`,
                        backgroundColor: getStatusColor(selectedMilestone.status)
                      }}
                    />
                  </div>
                  <span className="progress-percent">{selectedMilestone.progress}% Complete</span>
                </div>

                {selectedMilestone.dependencies && selectedMilestone.dependencies.length > 0 && (
                  <div className="modal-section">
                    <h3>Dependencies</h3>
                    <div className="dependencies">
                      {selectedMilestone.dependencies.map(depId => {
                        const dep = selectedProject.milestones.find(m => m.id === depId);
                        return dep ? (
                          <span key={depId} className="dependency-tag">
                            {dep.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectTimeline;