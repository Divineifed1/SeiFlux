import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const [projectsRes, contributorsRes, organizationsRes, applicationsRes] = await Promise.all([
      fetch(`${API_BASE}/projects`, { cache: 'no-store' }),
      fetch(`${API_BASE}/contributors`, { cache: 'no-store' }),
      fetch(`${API_BASE}/organizations`, { cache: 'no-store' }),
      fetch(`${API_BASE}/applications`, { cache: 'no-store' }),
    ]);

    const projects = projectsRes.ok ? await projectsRes.json() : [];
    const contributors = contributorsRes.ok ? await contributorsRes.json() : [];
    const organizations = organizationsRes.ok ? await organizationsRes.json() : [];
    const applications = applicationsRes.ok ? await applicationsRes.json() : [];

    const metrics = [
      { value: String(Array.isArray(projects) ? projects.length : 0), label: 'Projects' },
      { value: String(Array.isArray(contributors) ? contributors.length : 0), label: 'Contributors' },
      { value: String(Array.isArray(organizations) ? organizations.length : 0), label: 'Organizations' },
      { value: String(Array.isArray(applications) ? applications.length : 0), label: 'Applications' },
    ];

    return NextResponse.json({ metrics });
  } catch {
    return NextResponse.json(
      { metrics: [
        { value: '0', label: 'Projects' },
        { value: '0', label: 'Contributors' },
        { value: '0', label: 'Organizations' },
        { value: '0', label: 'Applications' },
      ] },
      { status: 200 },
    );
  }
}
