'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Star, Clock, CheckCircle } from 'lucide-react';

const defaultProjects = [
  {
    title: 'AI Chat Application',
    description: 'Real-time AI-powered chat application with natural language processing and context-aware responses.',
    image_url: null,
    live_url: '#',
    repo_url: '#',
    tech_stack: ['Next.js', 'OpenAI', 'Supabase', 'Tailwind'],
    featured: true,
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.',
    image_url: null,
    live_url: '#',
    repo_url: '#',
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    featured: true,
  },
  {
    title: 'POS System',
    description: 'Point of sale system for bakery business with real-time stock tracking and sales reports.',
    image_url: null,
    live_url: '#',
    repo_url: '#',
    tech_stack: ['React', 'Supabase', 'Chart.js'],
    featured: false,
  },
  {
    title: 'Portfolio Website',
    description: 'Modern portfolio website with admin panel, CMS integration, and dynamic content management.',
    image_url: null,
    live_url: '#',
    repo_url: '#',
    tech_stack: ['Next.js', 'Supabase', 'Framer Motion'],
    featured: false,
  },
];

export default function Projects({ projects, activeWork = [] }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const data = projects && projects.length > 0 ? projects : defaultProjects;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">

          <h2 className="section-title">
            Featured <span className="highlight">Work</span>
          </h2>
          <p className="section-desc">A selection of projects I&apos;ve built and current ongoing works</p>
        </div>

        {activeWork && activeWork.length > 0 && (
          <div className="ongoing-work-section">

            <div className={`projects-grid ${isVisible ? 'projects-visible' : ''}`}>
              {activeWork.map((work, i) => (
                <div key={work.id} className="project-card glass-card work-featured" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="project-image">
                    {work.image_url ? (
                      <img src={work.image_url} alt={work.project_name} className="dimmed-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="project-image-placeholder dimmed-img">
                        <span className="project-image-icon">{'</>'}</span>
                      </div>
                    )}
                    <div className="ongoing-center-badge">
                      <Clock size={18} />
                      On Going
                    </div>
                  </div>

                  <div className="project-content">
                    <h3 className="project-title">{work.project_name}</h3>
                    <p className="project-desc">{work.description}</p>

                    <div className="project-tags">
                      {(work.tech_stack || []).map((tech, j) => (
                        <span key={j} className="project-tag">{tech}</span>
                      ))}
                    </div>

                    <div className="project-links">
                      {work.live_url && work.live_url !== '#' && (
                        <a href={work.live_url} target="_blank" rel="noopener noreferrer" className="project-link">
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                      {work.repo_url && work.repo_url !== '#' && (
                        <a href={work.repo_url} target="_blank" rel="noopener noreferrer" className="project-link">
                          <Github size={16} />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`projects-grid ${isVisible ? 'projects-visible' : ''}`}>
          {data.map((project, i) => (
            <div
              key={i}
              className={`project-card glass-card ${project.featured ? 'project-featured' : ''}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="project-image">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="project-image-placeholder">
                    <span className="project-image-icon">{'</>'}</span>
                  </div>
                )}
                {project.featured && (
                  <div className="project-badge">
                    <Star size={12} />
                    Featured
                  </div>
                )}
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-tags">
                  {(project.tech_stack || []).map((tech, j) => (
                    <span key={j} className="project-tag">{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  {project.live_url && project.live_url !== '#' && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="project-link">
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  {project.repo_url && project.repo_url !== '#' && (
                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="project-link">
                      <Github size={16} />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
        }
        .projects-visible .project-card,
        .projects-visible .work-item {
          animation: fadeInUp 0.6s ease forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .project-card {
          opacity: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;
        }
        .project-featured, .work-featured {
          border-color: rgba(255,215,0,0.2);
          box-shadow: 0 4px 20px rgba(255,215,0,0.05);
        }
        .project-featured:hover, .work-featured:hover {
          box-shadow: 0 16px 32px rgba(255,215,0,0.15);
        }
        .project-image {
          position: relative;
          height: 220px;
          background: linear-gradient(135deg, #1a1a1a, #111);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.5s ease;
        }
        .project-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .project-image-icon {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.5rem;
          color: rgba(255,215,0,0.15);
        }
        .project-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(15,15,15,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,215,0,0.3);
          border-radius: 50px;
          font-size: 0.75rem;
          color: #ffd700;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .dimmed-img {
          filter: brightness(0.6);
          transition: filter 0.4s ease;
        }
        .project-card:hover .dimmed-img {
          filter: brightness(0.9);
        }
        .ongoing-center-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 200, 255, 0.5);
          border-radius: 50px;
          font-size: 0.95rem;
          color: #00c8ff;
          font-weight: 600;
          backdrop-filter: blur(8px);
          z-index: 10;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        .project-content {
          padding: 28px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .project-title {
          font-size: 1.3rem;
          color: #fff;
          margin-bottom: 10px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .project-desc {
          color: #999;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
        }
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }
        .project-tag {
          padding: 6px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50px; /* Pill shape */
          font-size: 0.75rem;
          color: #bbb;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .project-card:hover .project-tag {
          background: rgba(255,215,0,0.08);
          border-color: rgba(255,215,0,0.2);
          color: #ffd700;
        }
        .project-links {
          display: flex;
          gap: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .project-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #aaa;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .project-link:hover {
          color: #ffd700;
          transform: translateY(-1px);
        }
        
        /* Ongoing Work Styles */
        .ongoing-work-section {
          margin-bottom: 64px;
        }
        .sub-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffd700;
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
