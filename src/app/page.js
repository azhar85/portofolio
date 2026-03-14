import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Businesses from '@/components/Businesses';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

async function getData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const [profileRes, skillsRes, projectsRes, experiencesRes, businessesRes, socialRes] = await Promise.all([
    supabase.from('profile').select('*').limit(1).single(),
    supabase.from('skills').select('*').order('category'),
    supabase.from('projects').select('*').order('order'),
    supabase.from('experiences').select('*').order('start_date', { ascending: false }),
    supabase.from('businesses').select('*').order('order'),
    supabase.from('social_links').select('*'),
  ]);

  return {
    profile: profileRes.data,
    skills: skillsRes.data || [],
    projects: projectsRes.data || [],
    experiences: experiencesRes.data || [],
    businesses: businessesRes.data || [],
    socialLinks: socialRes.data || [],
  };
}

export default async function Home() {
  let data = { profile: null, skills: [], projects: [], experiences: [], businesses: [], socialLinks: [] };
  
  try {
    data = await getData();
  } catch (e) {
    console.error('Failed to fetch data:', e);
  }

  return (
    <main>
      <Navbar />
      <Hero profile={data.profile} socialLinks={data.socialLinks} />
      <hr className="divider" />
      <About profile={data.profile} experiences={data.experiences} />
      <hr className="divider" />
      <Skills skills={data.skills} />
      <hr className="divider" />
      <Projects projects={data.projects} />
      <hr className="divider" />
      <Businesses businesses={data.businesses} />
      <hr className="divider" />
      <Contact socialLinks={data.socialLinks} />
      <Footer socialLinks={data.socialLinks} />
    </main>
  );
}
