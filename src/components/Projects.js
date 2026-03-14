'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Star } from 'lucide-react';

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

export default function Projects({ projects }) {
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
          <p className="section-desc">A selection of projects I&apos;ve built and contributed to</p>
        </div>

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
          gap: 24px;
        }
        .projects-visible .project-card {
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
        }
        .project-featured {
          border-color: rgba(255,215,0,0.15);
        }
        .project-image {
          position: relative;
          height: 200px;
          background: linear-gradient(135deg, #1a1a1a, #111);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .project-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .project-image-icon {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2rem;
          color: rgba(255,215,0,0.2);
        }
        .project-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: rgba(255,215,0,0.15);
          border: 1px solid rgba(255,215,0,0.3);
          border-radius: 50px;
          font-size: 0.75rem;
          color: #ffd700;
          font-weight: 600;
        }
        .project-content {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .project-title {
          font-size: 1.2rem;
          color: #f5f5f5;
          margin-bottom: 8px;
        }
        .project-desc {
          color: #888;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 16px;
          flex: 1;
        }
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }
        .project-tag {
          padding: 4px 10px;
          background: rgba(255,215,0,0.06);
          border: 1px solid rgba(255,215,0,0.1);
          border-radius: 4px;
          font-size: 0.75rem;
          color: #ffd700;
          font-family: 'JetBrains Mono', monospace;
        }
        .project-links {
          display: flex;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .project-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #aaa;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .project-link:hover {
          color: #ffd700;
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
