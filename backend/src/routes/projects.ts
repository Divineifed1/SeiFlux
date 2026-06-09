import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/database.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await DatabaseService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await DatabaseService.getProjectById(parseInt(req.params.id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, githubUrl, techStack, email } = req.body;
    const submitterId = req.body.submitterId || 1; // Default to admin for now

    const project = await DatabaseService.createProject({
      name,
      description,
      githubUrl,
      techStack,
      submitterId,
    });

    if (!project) {
      return res.status(500).json({ error: 'Failed to create project' });
    }

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const project = await DatabaseService.updateProjectStatus(parseInt(req.params.id), status);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ error: 'Failed to update project status' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await DatabaseService.deleteProject(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
